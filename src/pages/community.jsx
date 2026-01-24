import { useState, useRef, useEffect } from "react";
import { Send, Hash, Users, MoreVertical, Smile, Paperclip, Search, Bell } from "lucide-react";
import { useAuth } from "../context/authcontext";

export default function Community() {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    const [showSidebar, setShowSidebar] = useState(false); // Mobile sidebar toggle

    // Simulated initial messages
    const [messages, setMessages] = useState([
        { id: 1, user: "Alex Chen", handle: "@alexc_dev", avatar: "https://i.pravatar.cc/150?u=1", text: "Has anyone tried the new React compiler yet?", time: "10:30 AM", isMe: false },
        { id: 2, user: "Sarah Jenkins", handle: "@sarahj_dev", avatar: "https://i.pravatar.cc/150?u=2", text: "Yes! It's actually insane. No more useMemo for everything 😅", time: "10:32 AM", isMe: false },
        { id: 3, user: "Dishant Savadia", handle: "@dishantsav123", avatar: "https://i.pravatar.cc/150?u=3", text: "I'm waiting for the stable release. But the benchmarks look promising.", time: "10:35 AM", isMe: false },
        { id: 4, user: "Mike Ross", handle: "@mikeross", avatar: "https://i.pravatar.cc/150?u=4", text: "Can someone help me with a Tailwind grid issue?", time: "10:40 AM", isMe: false },
    ]);

    // Simulated Online Users
    const onlineUsers = [
        { id: 1, name: "Alex Chen", avatar: "https://i.pravatar.cc/150?u=1", status: "online" },
        { id: 2, name: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?u=2", status: "busy" },
        { id: 3, name: "Dishant Savadia", avatar: "https://i.pravatar.cc/150?u=3", status: "online" },
        { id: 4, name: "Mike Ross", avatar: "https://i.pravatar.cc/150?u=4", status: "idle" },
        { id: 5, name: "Emily Blunt", avatar: "https://i.pravatar.cc/150?u=5", status: "offline" },
        { id: 6, name: "John Doe", avatar: "https://i.pravatar.cc/150?u=6", status: "online" },
        { id: 7, name: "Alice Cooper", avatar: "https://i.pravatar.cc/150?u=7", status: "online" },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
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

        // ECHO Bot Logic (Restored)
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
        <div className="flex h-[calc(100dvh-9rem)] md:h-[calc(100vh-4rem)] bg-[#0d1117] overflow-hidden w-full">

            {/* LEFT SIDEBAR - Online Users / Channels */}
            {/* Visible on Desktop, Toggleable on Mobile */}
            <div className={`
                fixed md:relative z-20 w-64 h-full bg-[#161b22] border-r border-white/5 flex flex-col transition-transform duration-300
                ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="p-4 border-b border-white/5 bg-[#161b22]">
                    <h2 className="text-white font-bold flex items-center gap-2">
                        <Users size={18} className="text-zinc-400" />
                        Active Users
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar">
                    {onlineUsers.map(u => (
                        <div key={u.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer group transition">
                            <div className="relative">
                                <img src={u.avatar} className="w-8 h-8 rounded-full bg-zinc-800" alt={u.name} />
                                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#161b22] ${u.status === 'online' ? 'bg-green-500' :
                                    u.status === 'busy' ? 'bg-red-500' :
                                        u.status === 'idle' ? 'bg-yellow-500' : 'bg-zinc-500'
                                    }`} />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-zinc-300 group-hover:text-white">{u.name}</h3>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wide">{u.status}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile formatting: Close button for sidebar */}
                <button
                    onClick={() => setShowSidebar(false)}
                    className="md:hidden absolute top-4 right-4 text-zinc-400"
                >
                    ✕
                </button>
            </div>

            {/* OVERLAY for Mobile Sidebar */}
            {showSidebar && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden backdrop-blur-sm"
                    onClick={() => setShowSidebar(false)}
                />
            )}

            {/* MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col relative h-full w-full min-w-0">

                {/* HEADER */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="md:hidden text-zinc-400 hover:text-white"
                        >
                            <Users size={20} />
                        </button>
                        <Hash size={24} className="text-zinc-500" />
                        <div>
                            <h1 className="text-white font-bold text-lg leading-none">global-chat</h1>
                            <p className="text-xs text-zinc-500 mt-1">The main hub for all developers</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search and Notifications removed */}
                    </div>
                </div>

                {/* MESSAGE STREAM */}
                <div className="flex-1 overflow-y-auto px-4 md:px-6 no-scrollbar flex flex-col">
                    {/* Welcome Spacer */}
                    <div className="mt-8 mb-8 text-center">
                        <div className="w-16 h-16 bg-[#161b22] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <Hash size={32} className="text-zinc-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Welcome to #global-chat!</h2>
                        <p className="text-zinc-500 text-sm mt-2">This is the start of the legendary conversation.</p>
                    </div>

                    {/* Grouped Message Layout (Discord Style) */}
                    <div className="flex flex-col gap-1 pb-4">
                        {messages.map((msg, index) => {
                            // Check if previous message was from same user within 5 minutes to group them
                            const isSequence = index > 0 &&
                                messages[index - 1].user === msg.user &&
                                (new Date("1970/01/01 " + msg.time).getTime() - new Date("1970/01/01 " + messages[index - 1].time).getTime() < 5 * 60000);

                            return (
                                <div
                                    key={msg.id}
                                    className={`group flex gap-4 px-2 py-1 hover:bg-[#161b22]/50 -mx-2 rounded pointer-events-auto transition-colors ${!isSequence ? "mt-4" : ""}`}
                                >
                                    {/* Avatar Column */}
                                    <div className="w-10 flex-shrink-0 pt-1">
                                        {!isSequence ? (
                                            msg.avatar ? (
                                                <img src={msg.avatar} className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition" alt={msg.user} />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-white/5">
                                                    {msg.user[0]}
                                                </div>
                                            )
                                        ) : (
                                            <span className="text-[10px] text-zinc-600 hidden group-hover:block ml-2 w-full text-right align-middle pt-1 select-none">
                                                {msg.time.split(" ")[0]}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1 min-w-0">
                                        {!isSequence && (
                                            <div className="flex items-baseline gap-2">
                                                <span className={`font-semibold hover:underline cursor-pointer ${msg.isMe ? "text-blue-400" : "text-white"}`}>
                                                    {msg.user}
                                                </span>
                                                <span className="text-xs text-zinc-500">{msg.time}</span>
                                                {msg.user === '"ECHO Bot"' && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1 rounded border border-blue-500/20">BOT</span>}
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
                <div className="p-4 px-4 md:px-6 bg-[#0d1117]">
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
                            <button type="button" className="p-2 text-zinc-400 hover:text-white transition rounded-full hover:bg-white/5">
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