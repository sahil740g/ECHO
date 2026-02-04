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
      // 1. Resolve all Conversation IDs using the Ref
      let targetIds = [conversationId];
      const currentChat = chatsRef.current.find(c => c.id === conversationId);

      if (currentChat && currentChat.originalIds) {
        targetIds = currentChat.originalIds;
      }

      // 2. Fetch messages for ALL target IDs (using .in())
      const { data: messagesData, error: msgError } = await supabase
        .from("messages")
        .select("id, conversation_id, sender_id, text, created_at, deleted_for_everyone, deleted_by, deleted_at, media_url, media_type")
        .in("conversation_id", targetIds)
        .order("created_at", { ascending: true });

      if (msgError) {
        throw msgError;
      }

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

        // Check if message was deleted for everyone
        const isDeletedForEveryone = msg.deleted_for_everyone === true;

        return {
          id: msg.id,
          senderId: msg.sender_id,
          text: isDeletedForEveryone ? "This message was deleted" : msg.text,
          timestamp: msg.created_at,
          senderName: sender?.name || "Unknown",
          senderAvatar: sender?.avatar_url,
          deletedForEveryone: isDeletedForEveryone,
          deletedBy: msg.deleted_by,
          mediaUrl: msg.media_url,
          mediaType: msg.media_type,
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
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onDmMessage(data) {
      // Only add messages from OTHER users (your messages are already added optimistically)
      const currentUserId = localStorage.getItem('currentUserId'); // We'll set this on login

      if (data.message.senderId === currentUserId) {
        return; // Skip - already added via optimistic update
      }

      // Add message from other user to the appropriate conversation
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === data.conversationId
            ? { ...chat, messages: [...chat.messages, data.message] }
            : chat,
        ),
      );
    }

    function onDmDelete(data) {
      // Update all users when a message is deleted for everyone
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === data.conversationId) {
            return {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === data.messageId
                  ? {
                    ...msg,
                    text: "This message was deleted",
                    deletedForEveryone: true,
                    deletedBy: data.deletedBy,
                  }
                  : msg
              ),
            };
          }
          return chat;
        })
      );
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("dm:message", onDmMessage);
    socket.on("dm:delete", onDmDelete);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("dm:message", onDmMessage);
      socket.off("dm:delete", onDmDelete);
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

  const sendMediaMessage = async (chatId, file, text = "") => {
    if (!user || !file) return;

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be less than 10MB");
      return;
    }

    // Determine media type
    const mediaType = file.type.startsWith("image/") ? "image" : "video";

    const tempId = `temp_${Date.now()}`;
    const newMessage = {
      id: tempId,
      senderId: user.id,
      text: text || "",
      timestamp: new Date().toISOString(),
      senderName: user.name,
      senderAvatar: user.avatar || user.avatar_url,
      mediaType,
      mediaUrl: URL.createObjectURL(file), // Temporary preview URL
      uploading: true,
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
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("chat-media")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("chat-media")
        .getPublicUrl(fileName);

      // Insert message to database
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: chatId,
          sender_id: user.id,
          text: text || null,
          media_url: publicUrl,
          media_type: mediaType,
        })
        .select()
        .single();

      if (error) throw error;

      // Update with real data
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
              ...chat,
              messages: chat.messages.map((m) =>
                m.id === tempId
                  ? {
                    ...m,
                    id: data.id,
                    mediaUrl: publicUrl,
                    uploading: false,
                  }
                  : m,
              ),
            }
            : chat,
        ),
      );

      // Broadcast via Socket.io
      socket.emit("dm:message", {
        conversationId: chatId,
        message: {
          ...newMessage,
          id: data.id,
          mediaUrl: publicUrl,
          uploading: false,
        },
      });
    } catch (error) {
      console.error("Error sending media message:", error);
      alert(`Failed to send media: ${error.message}`);
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

  // Delete message for current user only
  const deleteMessageForMe = async (messageId) => {
    if (!user) return;

    try {
      // Add to deleted_messages table
      const { error } = await supabase
        .from("deleted_messages")
        .insert({
          message_id: messageId,
          user_id: user.id,
        });

      if (error) throw error;

      // Update local state - remove message from current user's view
      setChats((prevChats) =>
        prevChats.map((chat) => ({
          ...chat,
          messages: chat.messages.filter((msg) => msg.id !== messageId),
        }))
      );

      console.log(`Deleted message ${messageId} for user ${user.id}`);
    } catch (error) {
      console.error("Error deleting message for me:", error);
    }
  };

  // Delete message for everyone in the conversation
  const deleteMessageForEveryone = async (messageId, conversationId) => {
    if (!user) return;

    try {
      // Update message in database to mark as deleted for everyone
      const { error } = await supabase
        .from("messages")
        .update({
          deleted_for_everyone: true,
          deleted_by: user.id,
          deleted_at: new Date().toISOString(),
        })
        .eq("id", messageId)
        .eq("sender_id", user.id); // Only sender can delete for everyone

      if (error) throw error;

      // Emit socket event to notify other users
      socket.emit("dm:delete", {
        messageId,
        conversationId,
        deletedBy: user.id,
      });

      // Update local state - mark message as deleted
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === conversationId) {
            return {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === messageId
                  ? {
                    ...msg,
                    text: "This message was deleted",
                    deletedForEveryone: true,
                    deletedBy: user.id,
                  }
                  : msg
              ),
            };
          }
          return chat;
        })
      );

      console.log(`Deleted message ${messageId} for everyone`);
    } catch (error) {
      console.error("Error deleting message for everyone:", error);
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
        sendMediaMessage,
        deleteMessageForMe,
        deleteMessageForEveryone,
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
