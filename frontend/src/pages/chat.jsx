import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/authcontext";
import { Send, ArrowLeft, Search, MoreVertical, Smile, Image, Loader } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useNavigate, useParams } from "react-router-dom";
import MessageContextMenu from "../components/MessageContextMenu";

const Chat = () => {
  // Rename context's selectChat to avoid collision
  const { chats, sendMessage, sendMediaMessage, selectChat: setContextActiveChat, deleteMessageForMe, deleteMessageForEveryone } = useChat();
  const { user } = useAuth();
  const { chatId } = useParams();
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, messageId: null, position: { x: 0, y: 0 }, isSender: false });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Sync URL param with Context State to trigger message fetching
  useEffect(() => {
    if (chatId) {
      setContextActiveChat(chatId);
    }
  }, [chatId, setContextActiveChat]);

  const activeChatId = chatId;
  const activeChat = chats.find((c) => c.id === chatId);

  const handleChatSelect = (id) => {
    if (id) {
      navigate(`/chat/${id}`);
    } else {
      navigate("/chat");
    }
  };

  // Helper to find the "other" participant in a chat
  const getOtherParticipant = (chat) => {
    // If we have prepared profiles from context, use them
    if (chat.participantProfiles && chat.participantProfiles.length > 0) {
      const other =
        chat.participantProfiles.find((p) => p.id !== user?.id) ||
        chat.participantProfiles[0];
      return other;
    }

    // Fallback
    const participants = chat.participants || [];
    const otherId = participants.find((id) => id !== (user?.id || "curr_user"));
    return { name: "User", handle: otherId || "Unknown", avatar: null };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!activeChatId) return;

    if (selectedFile) {
      // Send media message with optional text
      await sendMediaMessage(activeChatId, selectedFile, messageInput);
      setSelectedFile(null);
      setFilePreview(null);
      setMessageInput("");
    } else if (messageInput.trim()) {
      // Send text-only message
      sendMessage(activeChatId, messageInput);
      setMessageInput("");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert("Please select an image or video file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    // Clear file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleUserClick = (handle, e) => {
    e.stopPropagation(); // Prevent chat selection
    if (handle) {
      const cleanHandle = handle.replace('@', '');
      navigate(`/profile/${cleanHandle}`);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const onEmojiClick = (emojiObject) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleMessageRightClick = (e, msg) => {
    e.preventDefault();
    const isMe = msg.senderId === user?.id;
    setContextMenu({
      isOpen: true,
      messageId: msg.id,
      position: { x: e.clientX, y: e.clientY },
      isSender: isMe,
    });
  };

  const handleDeleteForMe = () => {
    if (contextMenu.messageId) {
      deleteMessageForMe(contextMenu.messageId);
    }
  };

  const handleDeleteForEveryone = () => {
    if (contextMenu.messageId && activeChatId) {
      deleteMessageForEveryone(contextMenu.messageId, activeChatId);
    }
  };

  return (
    // FIX: height calculation to prevent input from being pushed off-screen
    <div className="flex h-[calc(100dvh-4rem)] bg-black text-white overflow-hidden">
      {/* Contact List */}
      <div
        className={`w-full md:w-1/3 lg:w-1/4 border-r border-[#2F3336] flex flex-col ${activeChatId ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 border-b border-[#2F3336]">
          <h1 className="text-xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search Direct Messages"
              className="w-full bg-[#202327] rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const otherUser = getOtherParticipant(chat);
            const lastMessage = chat.messages && chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1]
              : null;

            return (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`flex items-center p-4 hover:bg-[#16181C] cursor-pointer transition-colors ${activeChatId === chat.id ? "bg-[#16181C] border-r-2 border-blue-500" : ""}`}
              >
                <div
                  onClick={(e) => handleUserClick(otherUser.handle, e)}
                  className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden shrink-0 mr-3 cursor-pointer hover:opacity-80 hover:ring-2 hover:ring-blue-500 transition"
                >
                  {otherUser.avatar ? (
                    <img
                      src={otherUser.avatar}
                      alt={otherUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold bg-gradient-to-tr from-blue-500 to-purple-500">
                      {otherUser.name?.[0] || "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span
                      onClick={(e) => handleUserClick(otherUser.handle, e)}
                      className="font-bold truncate cursor-pointer hover:text-blue-400 transition"
                    >
                      {otherUser.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {lastMessage ? formatTime(lastMessage.timestamp) : ""}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm truncate">
                    {lastMessage ? (
                      <>
                        {lastMessage.senderId === (user?.id || "curr_user")
                          ? "You: "
                          : ""}
                        {lastMessage.text}
                      </>
                    ) : (
                      "Start a conversation"
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`w-full md:w-2/3 lg:w-3/4 flex flex-col ${!activeChatId ? "hidden md:flex" : "flex"}`}
      >
        {activeChatId && activeChat ? (
          <>
            <div className="px-4 py-3 border-b border-[#2F3336] flex items-center justify-between backdrop-blur-md bg-black/80 sticky top-0 z-10">
              <div className="flex items-center">
                <button
                  onClick={() => handleChatSelect(null)}
                  className="md:hidden mr-3 text-white"
                >
                  <ArrowLeft size={24} />
                </button>
                <div
                  onClick={() => handleUserClick(getOtherParticipant(activeChat).handle, { stopPropagation: () => { } })}
                  className="w-9 h-9 rounded-full bg-gray-600 overflow-hidden mr-3 cursor-pointer hover:opacity-80 hover:ring-2 hover:ring-blue-500 transition"
                >
                  {getOtherParticipant(activeChat).avatar ? (
                    <img
                      src={getOtherParticipant(activeChat).avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold bg-gradient-to-tr from-blue-500 to-purple-500">
                      {getOtherParticipant(activeChat).name?.[0] || "?"}
                    </div>
                  )}
                </div>
                <div>
                  <h2
                    onClick={() => handleUserClick(getOtherParticipant(activeChat).handle, { stopPropagation: () => { } })}
                    className="font-bold cursor-pointer hover:text-blue-400 transition"
                  >
                    {getOtherParticipant(activeChat).name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {getOtherParticipant(activeChat).handle}
                  </p>
                </div>
              </div>
              <MoreVertical
                size={20}
                className="text-gray-400 cursor-pointer"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeChat.messages && activeChat.messages.map((msg, index) => {
                const isMe = msg.senderId === (user?.id || "curr_user");
                const isDeleted = msg.deletedForEveryone || msg.text === "This message was deleted";
                const hasMedia = msg.mediaUrl && msg.mediaType;

                return (
                  <div
                    key={msg.id || index}
                    className={`w-full flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl overflow-hidden ${hasMedia ? "p-0" : "px-4 py-2"} text-sm ${isMe
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-[#2F3336] text-white rounded-bl-none"
                        } ${!isDeleted ? "cursor-pointer" : "italic opacity-60"}`}
                      onContextMenu={(e) => !isDeleted && handleMessageRightClick(e, msg)}
                    >
                      {/* Media Content */}
                      {hasMedia && !isDeleted && (
                        <div className="relative">
                          {msg.uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                              <Loader className="animate-spin" size={24} />
                            </div>
                          )}
                          {msg.mediaType === "image" ? (
                            <img
                              src={msg.mediaUrl}
                              alt="Shared image"
                              className="max-w-full h-auto max-h-96 object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <video
                              src={msg.mediaUrl}
                              controls
                              className="max-w-full h-auto max-h-96"
                            />
                          )}
                        </div>
                      )}

                      {/* Text Content */}
                      {(msg.text || isDeleted) && (
                        <div className={hasMedia ? "px-4 py-2" : ""}>
                          <p>{isDeleted ? "🚫 This message was deleted" : msg.text}</p>
                        </div>
                      )}

                      {/* Timestamp */}
                      <p
                        className={`text-[10px] mt-1 text-right ${hasMedia ? "px-4 pb-2" : ""} ${isMe ? "text-blue-100" : "text-gray-400"}`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 md:p-4 border-t border-[#2F3336] bg-black">
              {/* File Preview */}
              {filePreview && selectedFile && (
                <div className="mb-3 relative inline-block">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-blue-500">
                    {selectedFile.type.startsWith("image/") ? (
                      <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <video src={filePreview} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={clearFileSelection}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}

              <form
                onSubmit={handleSend}
                className="flex items-center gap-1 md:gap-2 bg-[#202327] rounded-full px-2 md:px-4 py-2 relative"
              >
                {showEmojiPicker && (
                  <div className="absolute bottom-14 left-0 z-50">
                    <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} />
                  </div>
                )}

                {/* File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Media Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 hover:bg-blue-500/10 p-1.5 md:p-2 rounded-full transition-colors shrink-0"
                >
                  <Image size={18} className="md:w-5 md:h-5" />
                </button>

                {/* Emoji Button */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-blue-500 hover:bg-blue-500/10 p-1.5 md:p-2 rounded-full transition-colors shrink-0"
                >
                  <Smile size={18} className="md:w-5 md:h-5" />
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={selectedFile ? "Add a caption (optional)" : "Start a new message"}
                  className="flex-1 min-w-0 bg-transparent border-none focus:outline-none text-white placeholder-gray-500 text-sm md:text-base"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!messageInput.trim() && !selectedFile}
                  className="text-blue-500 disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-blue-500/10 p-1.5 md:p-2 rounded-full transition-colors shrink-0"
                >
                  <Send size={18} className="md:w-5 md:h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 rounded-full bg-[#16181C] flex items-center justify-center mb-4">
              <Send size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Select a message
            </h2>
            <p>
              Choose from your existing conversations, start a new one, or just
              get swiping.
            </p>
            <button
              onClick={() => navigate("/search")}
              className="mt-6 px-6 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition-colors"
            >
              New Message
            </button>
          </div>
        )}
      </div>

      <MessageContextMenu
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
        position={contextMenu.position}
        onDeleteForMe={handleDeleteForMe}
        onDeleteForEveryone={handleDeleteForEveryone}
        isSender={contextMenu.isSender}
      />
    </div>
  );
};

export default Chat;
