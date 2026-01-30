import { useState, useRef, useEffect } from "react";
import { Send, Hash, MoreVertical, Smile } from "lucide-react";
import { useAuth } from "../context/authcontext";
import { supabase } from "../lib/supabase";
import { socket } from "../lib/socket";
import EmojiPicker from "emoji-picker-react";

export default function Community() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing messages from Supabase
  useEffect(() => {
    fetchMessages();

    // Listen for real-time messages via Socket.io
    socket.on("community:message", (data) => {
      // Avoid duplicates (we get our own message back too)
      setMessages((prev) => {
        if (prev.find((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    });

    return () => {
      socket.off("community:message");
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("community_messages")
        .select(
          `
                    *,
                    profiles:sender_id (
                        id,
                        name,
                        handle,
                        avatar_url
                    )
                `,
        )
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) throw error;

      const transformed = data.map((msg) => ({
        id: msg.id,
        user: msg.profiles?.name || "Anonymous",
        handle: msg.profiles?.handle || "@anonymous",
        avatar: msg.profiles?.avatar_url,
        text: msg.text,
        time: new Date(msg.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: msg.sender_id === user?.id,
      }));

      setMessages(transformed);
    } catch (error) {
      console.error("Error fetching community messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setShowEmojiPicker(false);
    if (!message.trim() || !user) return;

    const newMessage = {
      id: `temp_${Date.now()}`,
      user: user.name || "Guest User",
      handle: user.handle || "@guest",
      avatar: user.avatar || user.avatar_url,
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    // Optimistic update
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    try {
      // Persist to Supabase
      const { data, error } = await supabase
        .from("community_messages")
        .insert({
          sender_id: user.id,
          text: newMessage.text,
        })
        .select()
        .single();

      if (error) throw error;

      // Update with real ID
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, id: data.id } : m)),
      );

      // Broadcast via Socket.io for real-time delivery to others
      socket.emit("community:message", {
        id: data.id,
        user: user.name,
        handle: user.handle,
        avatar: user.avatar || user.avatar_url,
        text: data.text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: false, // Will be false for others
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic on error
      setMessages((prev) => prev.filter((m) => m.id !== newMessage.id));
    }
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] md:h-[calc(100vh-4rem)] bg-[#0d1117] overflow-hidden w-full relative">
      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col relative h-full w-full min-w-0">
        {/* HEADER */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Hash size={24} className="text-zinc-500" />
            <div>
              <h1 className="text-white font-bold text-lg leading-none">
                global-chat
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                The main hub for all developers
              </p>
            </div>
          </div>
        </div>

        {/* MESSAGE STREAM */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 no-scrollbar flex flex-col">
          <div className="mt-8 mb-8 text-center">
            <div className="w-16 h-16 bg-[#161b22] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <Hash size={32} className="text-zinc-500" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Welcome to #global-chat!
            </h2>
            <p className="text-zinc-500 text-sm mt-2">
              This is the start of the legendary conversation.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-zinc-500">Loading messages...</div>
          ) : (
            <div className="flex flex-col gap-1 pb-4">
              {messages.map((msg, index) => {
                const isSequence =
                  index > 0 &&
                  messages[index - 1].user === msg.user &&
                  new Date("1970/01/01 " + msg.time).getTime() -
                    new Date(
                      "1970/01/01 " + messages[index - 1].time,
                    ).getTime() <
                    5 * 60000;

                return (
                  <div
                    key={msg.id}
                    className={`group flex gap-4 px-2 py-1 hover:bg-[#161b22]/50 -mx-2 rounded pointer-events-auto transition-colors ${!isSequence ? "mt-4" : ""}`}
                  >
                    {/* Avatar */}
                    <div className="w-10 flex-shrink-0 pt-1">
                      {!isSequence &&
                        (msg.avatar ? (
                          <img
                            src={msg.avatar}
                            className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition"
                            alt={msg.user}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-white/5">
                            {msg.user && msg.user.length > 0
                              ? msg.user[0]
                              : "?"}
                          </div>
                        ))}
                      {isSequence && (
                        <span className="text-[10px] text-zinc-600 hidden group-hover:block ml-2 w-full text-right align-middle pt-1 select-none">
                          {msg.time.split(" ")[0]}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {!isSequence && (
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`font-semibold hover:underline cursor-pointer ${msg.isMe ? "text-blue-400" : "text-white"}`}
                          >
                            {msg.user}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {msg.time}
                          </span>
                        </div>
                      )}
                      <div
                        className={`text-zinc-300 leading-relaxed whitespace-pre-wrap ${!isSequence ? "mt-1" : ""}`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="p-4 px-4 md:px-6 bg-[#0d1117] relative">
          {showEmojiPicker && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowEmojiPicker(false)}
              />
              <div className="absolute bottom-16 right-0 md:right-6 z-40 shadow-2xl rounded-xl overflow-hidden border border-white/10 max-w-[95vw] sm:max-w-xs md:max-w-sm">
                <EmojiPicker
                  theme="dark"
                  onEmojiClick={onEmojiClick}
                  lazyLoadEmojis={true}
                  width="100%"
                  height={400}
                  previewConfig={{ showPreview: false }}
                />
              </div>
            </>
          )}
          <div className="relative bg-[#161b22] rounded-xl flex items-center p-2 border border-white/10 focus-within:border-zinc-500 transition">
            <button
              type="button"
              className="p-2 text-zinc-400 hover:text-white transition rounded-full hover:bg-white/5"
            >
              <MoreVertical size={20} />
            </button>
            <form onSubmit={handleSendMessage} className="flex-1 mx-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  user ? "Message #global-chat" : "Login to send messages"
                }
                disabled={!user}
                className="w-full bg-transparent border-none outline-none text-white placeholder-zinc-500 py-2 disabled:cursor-not-allowed"
              />
            </form>
            <div className="flex items-center gap-1 pr-1">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2 transition rounded-full hover:bg-white/5 ${showEmojiPicker ? "text-yellow-400" : "text-zinc-400 hover:text-white"}`}
              >
                <Smile size={20} />
              </button>
              {message.trim() && user && (
                <button
                  onClick={handleSendMessage}
                  className="p-2 text-blue-500 hover:text-blue-400 transition ml-1"
                >
                  <Send size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
