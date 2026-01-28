import { useState, useRef, useEffect } from "react";
import { Send, Hash, Users, MoreVertical, Smile } from "lucide-react";
import { useAuth } from "../context/authcontext";

import EmojiPicker from 'emoji-picker-react';

export default function Community() {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Mock Messages Data
    const [messages, setMessages] = useState([
        { id: 1, user: "Alex Chen", handle: "@alexc_dev", avatar: "https://i.pravatar.cc/150?u=1", text: "Has anyone tried the new React compiler yet?", time: "10:30 AM", isMe: false },
        { id: 2, user: "Sarah Jenkins", handle: "@sarahj_dev", avatar: "https://i.pravatar.cc/150?u=2", text: "Yes! It's actually insane. No more useMemo for everything 😅", time: "10:32 AM", isMe: false },
        { id: 3, user: "Dishant Savadia", handle: "@dishantsav123", avatar: "https://i.pravatar.cc/150?u=3", text: "I'm waiting for the stable release. But the benchmarks look promising.", time: "10:35 AM", isMe: false },
        { id: 4, user: "Mike Ross", handle: "@mikeross", avatar: "https://i.pravatar.cc/150?u=4", text: "Can someone help me with a Tailwind grid issue?", time: "10:40 AM", isMe: false },
    ]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onEmojiClick = (emojiObject) => {
        setMessage(prev => prev + emojiObject.emoji);
        // setShowEmojiPicker(false); // Optional: keep open for multiple emojis
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        setShowEmojiPicker(false);
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now(),
            user: user?.name || "Guest User",
            handle: user?.handle || "@guest",
            avatar: user?.avatar,
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        setMessages([...messages, newMessage]);
        setMessage("");

        // ECHO Bot Logic
        if (Math.random() > 0.7) {
            setTimeout(() => {
                const reply = {
                    id: Date.now() + 1,
                    user: "ECHO Bot",
                    handle: "@echobot",
                    avatar: null,
                    text: "That's an interesting point! 🤔",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isMe: false
                };
                setMessages(prev => [...prev, reply]);
            }, 2000);
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
                            <h1 className="text-white font-bold text-lg leading-none">global-chat</h1>
                            <p className="text-xs text-zinc-500 mt-1">The main hub for all developers</p>
                        </div>
                    </div>
                </div>

                {/* MESSAGE STREAM */}
                <div className="flex-1 overflow-y-auto px-4 md:px-6 no-scrollbar flex flex-col">
                    <div className="mt-8 mb-8 text-center">
                        <div className="w-16 h-16 bg-[#161b22] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <Hash size={32} className="text-zinc-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Welcome to #global-chat!</h2>
                        <p className="text-zinc-500 text-sm mt-2">This is the start of the legendary conversation.</p>
                    </div>

                    <div className="flex flex-col gap-1 pb-4">
                        {messages.map((msg, index) => {
                            const isSequence = index > 0 &&
                                messages[index - 1].user === msg.user &&
                                (new Date("1970/01/01 " + msg.time).getTime() - new Date("1970/01/01 " + messages[index - 1].time).getTime() < 5 * 60000);

                            return (
                                <div
                                    key={msg.id}
                                    className={`group flex gap-4 px-2 py-1 hover:bg-[#161b22]/50 -mx-2 rounded pointer-events-auto transition-colors ${!isSequence ? "mt-4" : ""}`}
                                >
                                    {/* Avatar */}
                                    <div className="w-10 flex-shrink-0 pt-1">
                                        {!isSequence && (
                                            msg.avatar ? (
                                                <img src={msg.avatar} className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition" alt={msg.user} />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-white/5">
                                                    {(msg.user && msg.user.length > 0) ? msg.user[0] : "?"}
                                                </div>
                                            )
                                        )}
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
                                                <span className={`font-semibold hover:underline cursor-pointer ${msg.isMe ? "text-blue-400" : "text-white"}`}>
                                                    {msg.user}
                                                </span>
                                                <span className="text-xs text-zinc-500">{msg.time}</span>
                                            </div>
                                        )}
                                        <div className={`text-zinc-300 leading-relaxed whitespace-pre-wrap ${!isSequence ? "mt-1" : ""}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* INPUT AREA */}
                <div className="p-4 px-4 md:px-6 bg-[#0d1117] relative">
                    {showEmojiPicker && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setShowEmojiPicker(false)} />
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
                        <button type="button" className="p-2 text-zinc-400 hover:text-white transition rounded-full hover:bg-white/5">
                            <MoreVertical size={20} />
                        </button>
                        <form onSubmit={handleSendMessage} className="flex-1 mx-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Message #global-chat"
                                className="w-full bg-transparent border-none outline-none text-white placeholder-zinc-500 py-2"
                            />
                        </form>
                        <div className="flex items-center gap-1 pr-1">
                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-2 transition rounded-full hover:bg-white/5 ${showEmojiPicker ? 'text-yellow-400' : 'text-zinc-400 hover:text-white'}`}
                            >
                                <Smile size={20} />
                            </button>
                            {message.trim() && (
                                <button onClick={handleSendMessage} className="p-2 text-blue-500 hover:text-blue-400 transition ml-1">
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