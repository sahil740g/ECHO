import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./authcontext";
import { socket } from "../lib/socket";
import { supabase } from "../lib/supabase";

const ChatContext = createContext({});

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [loading, setLoading] = useState(true);

  // Keep a ref to chats for access inside callbacks
  const chatsRef = useRef(chats);
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  // Fetch conversations from Supabase
  const fetchConversations = useCallback(async () => {
    if (!user) {
      setChats([]);
      setLoading(false);
      return;
    }

    try {
      // Get conversations where user is a participant
      const { data: participations, error: participationError } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user.id);

      if (participationError) throw participationError;

      if (!participations || participations.length === 0) {
        setChats([]);
        setLoading(false);
        return;
      }

      const conversationIds = participations.map((p) => p.conversation_id);

      // Fetch full conversation details with participants
      const { data: conversations, error: convError } = await supabase
        .from("conversations")
        .select(
          `
          id,
          created_at,
          conversation_participants (
            user_id,
            profiles:user_id (
              id,
              name,
              handle,
              avatar_url
            )
          ),
          messages (
            id,
            text,
            created_at
          )
        `,
        )
        .in("id", conversationIds)
        .order("created_at", { ascending: false }); // Fetch newest first

      if (convError) throw convError;

      // Deduplicate chats based on participants AND merge
      const uniqueChatsMap = new Map();

      conversations.forEach((conv) => {
        // Create a unique key based on sorted participant IDs
        const participantKey = conv.conversation_participants
          .map(p => p.user_id)
          .sort()
          .join(':');

        if (!uniqueChatsMap.has(participantKey)) {
          // Initialize with this conversation
          uniqueChatsMap.set(participantKey, { ...conv, mergedIds: [conv.id] });
        } else {
          // Merge this conversation into existing one
          const existing = uniqueChatsMap.get(participantKey);

          if (!existing.mergedIds.includes(conv.id)) {
            existing.mergedIds.push(conv.id);
          }

          // Use the ID of the chat that has messages, if any
          const hasMessages = conv.messages && conv.messages.length > 0;
          const existingHasMessages = existing.messages && existing.messages.length > 0;

          if (hasMessages && !existingHasMessages) {
            existing.id = conv.id;
            existing.created_at = conv.created_at;
          } else if (!hasMessages && existingHasMessages) {
            // Keep existing ID
          } else {
            // Both have messages or neither? Use newest.
            if (new Date(conv.created_at) > new Date(existing.created_at)) {
              existing.id = conv.id;
              existing.created_at = conv.created_at;
            }
          }
        }
      });

      const uniqueConversations = Array.from(uniqueChatsMap.values());

      // Transform to frontend structure
      const transformedChats = uniqueConversations.map((conv) => {
        const otherParticipants = conv.conversation_participants
          .filter((p) => p.user_id !== user.id)
          .map((p) => ({
            id: p.profiles?.id,
            name: p.profiles?.name || "Unknown",
            handle: p.profiles?.handle || "@unknown",
            avatar: p.profiles?.avatar_url,
          }));

        return {
          id: conv.id,
          originalIds: conv.mergedIds, // Store all IDs to fetch messages from
          participants: conv.conversation_participants.map((p) => p.user_id),
          participantProfiles: otherParticipants,
          messages: [], // Will be loaded when chat is selected
        };
      });

      setChats(transformedChats);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch messages from ALL merged conversations
  const fetchMessages = useCallback(async (conversationId) => {
    try {
      console.log(`Debug: Fetching messages for Chat ID: ${conversationId}`);

      // 1. Resolve all Conversation IDs using the Ref
      let targetIds = [conversationId];
      const currentChat = chatsRef.current.find(c => c.id === conversationId);

      if (currentChat && currentChat.originalIds) {
        targetIds = currentChat.originalIds;
        console.log(`Debug: Resolved Merged IDs: ${targetIds.join(', ')}`);
      }

      // 2. Fetch messages for ALL target IDs (using .in())
      const { data: messagesData, error: msgError } = await supabase
        .from("messages")
        .select("*")
        .in("conversation_id", targetIds)
        .order("created_at", { ascending: true });

      if (msgError) {
        console.error("Debug: Error fetching messages:", msgError);
        throw msgError;
      }

      console.log(`Debug: Found ${messagesData?.length || 0} messages total`);

      if (!messagesData || messagesData.length === 0) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === conversationId ? { ...chat, messages: [] } : chat,
          ),
        );
        return;
      }

      // 3. Fetch sender profiles manually
      const senderIds = [...new Set(messagesData.map((m) => m.sender_id))];
      const { data: profilesData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, handle, avatar_url")
        .in("id", senderIds);

      if (profileError) console.error("Error fetching message profiles:", profileError);

      const profilesMap = new Map((profilesData || []).map((p) => [p.id, p]));

      // 4. Combine data
      const messages = messagesData.map((msg) => {
        const sender = profilesMap.get(msg.sender_id);
        return {
          id: msg.id,
          senderId: msg.sender_id,
          text: msg.text,
          timestamp: msg.created_at,
          senderName: sender?.name || "Unknown",
          senderAvatar: sender?.avatar_url,
        };
      });

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === conversationId ? { ...chat, messages } : chat,
        ),
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
      console.log("Socket connected");
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("Socket disconnected");
    }

    function onDmMessage(data) {
      console.log("Received DM:", data);
      // Add message to the appropriate conversation
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === data.conversationId
            ? { ...chat, messages: [...chat.messages, data.message] }
            : chat,
        ),
      );
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("dm:message", onDmMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("dm:message", onDmMessage);
      socket.disconnect();
    };
  }, []);

  // Join DM room and fetch messages when active chat changes
  useEffect(() => {
    if (activeChatId) {
      socket.emit("dm:join", activeChatId);
      fetchMessages(activeChatId);
    }
  }, [activeChatId, fetchMessages]);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const sendMessage = async (chatId, text) => {
    if (!user) return;

    const tempId = `temp_${Date.now()}`;
    const newMessage = {
      id: tempId,
      senderId: user.id,
      text,
      timestamp: new Date().toISOString(),
      senderName: user.name,
      senderAvatar: user.avatar || user.avatar_url,
    };

    // Optimistic update
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat,
      ),
    );

    try {
      // Persist to Supabase
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: chatId,
          sender_id: user.id,
          text,
        })
        .select()
        .single();

      if (error) throw error;

      // Update with real ID
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
              ...chat,
              messages: chat.messages.map((m) =>
                m.id === tempId ? { ...m, id: data.id } : m,
              ),
            }
            : chat,
        ),
      );

      // Broadcast via Socket.io
      socket.emit("dm:message", {
        conversationId: chatId,
        message: { ...newMessage, id: data.id },
      });
    } catch (error) {
      console.error("Error sending message:", error);
      alert(`Debug Error: ${error.message} (Code: ${error.code})`);
      // Revert on error
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
              ...chat,
              messages: chat.messages.filter((m) => m.id !== tempId),
            }
            : chat,
        ),
      );
    }
  };

  const selectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const getOrCreateChat = async (participantId) => {
    if (!user) return null;

    // Check if chat already exists
    const existingChat = chats.find(
      (chat) =>
        chat.participants.includes(participantId) &&
        chat.participants.includes(user.id),
    );

    if (existingChat) {
      return existingChat;
    }

    try {
      // Create new conversation
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .insert({})
        .select()
        .single();

      if (convError) throw convError;

      // Add participants
      const { error: partError } = await supabase
        .from("conversation_participants")
        .insert([
          { conversation_id: conversation.id, user_id: user.id },
          { conversation_id: conversation.id, user_id: participantId },
        ]);

      if (partError) throw partError;

      // Fetch participant profile
      const { data: participantProfile } = await supabase
        .from("profiles")
        .select("id, name, handle, avatar_url")
        .eq("id", participantId)
        .single();

      const newChat = {
        id: conversation.id,
        participants: [user.id, participantId],
        participantProfiles: participantProfile
          ? [
            {
              id: participantProfile.id,
              name: participantProfile.name,
              handle: participantProfile.handle,
              avatar: participantProfile.avatar_url,
            },
          ]
          : [],
        messages: [],
      };

      setChats((prev) => [...prev, newChat]);
      return newChat;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        activeChat,
        selectChat,
        sendMessage,
        getOrCreateChat,
        isConnected,
        loading,
        refetchConversations: fetchConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
