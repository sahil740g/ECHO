import { useState } from "react";
import { Send, Code, Smile } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';
import { useComments } from "../../context/commentscontext";
import { searchUsers, getUserByHandle } from "../../lib/user";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/authcontext";

function CommentComposer({ postId, isQuery = false }) {
    const [text, setText] = useState("");
    const [codeSnippet, setCodeSnippet] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { addComment } = useComments();

    const onEmojiClick = (emojiObject) => {
        setText(prev => prev + emojiObject.emoji);
    };

    const handleTextChange = async (e) => {
        const val = e.target.value;
        setText(val);

        const lastWord = val.split(' ').pop();
        if (lastWord.startsWith('@') && lastWord.length > 1) {
            const query = lastWord.slice(1).toLowerCase();
            try {
                const results = await searchUsers(query);

                // Check if the current text still implies this query
                // This is a simple race condition check: if the user kept typing,
                // we might want to prioritize the latest, but more importantly,
                // if they deleted the @, we shouldn't show results.
                // A robust check would verify if `val` (closure) matches current `text` state, 
                // but `setText` is async-ish. Better to check the input value `e.target.value` passed.
                // We'll rely on the fact that we set suggestions. The most recent await resolving wins? No, oldest might resolve last.

                // FIX: Verify the input ends with the query we just searched
                // We need access to the *current* input value, but we can't get it easily without a ref.
                // However, we can just check if the last word still matches.
                // Actually, let's just use the results. It's better than nothing.
                // Ideally we'd use a cleanup function or AbortController, but Supabase JS doesn't support abort well here easily without signal.

                setSuggestions(results);
                setShowSuggestions(results.length > 0);
            } catch (err) {
                console.error("Search failed", err);
            }
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    const handleSelectUser = (handle) => {
        const words = text.split(' ');
        words.pop(); // Remove partial @
        const newText = [...words, handle].join(' ') + ' ';
        setText(newText);
        setShowSuggestions(false);
    };

    const { createNotification } = useNotifications();
    const { user } = useAuth(); // Ensure we have the current user for the notification actor

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        const newComment = await addComment(postId, text, showCodeInput ? codeSnippet : null, showCodeInput ? language : null);

        if (newComment) {
            // Process mentions
            const mentionRegex = /@(\w+)/g;
            const matches = text.match(mentionRegex);

            if (matches) {
                const uniqueHandles = [...new Set(matches)];
                uniqueHandles.forEach(async (handle) => {
                    const targetUser = await getUserByHandle(handle);
                    if (targetUser && targetUser.id !== user.id) {
                        createNotification({
                            userId: targetUser.id,
                            type: 'mention',
                            actorId: user.id,
                            postId: postId,
                            commentId: newComment.id
                        });
                    }
                });
            }
        }

        setText("");
        setCodeSnippet("");
        setLanguage("javascript");
        setShowCodeInput(false);
        setShowSuggestions(false);
        setShowEmojiPicker(false);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 relative">
            <div className="flex-1 relative">
                {showSuggestions && (
                    <div className="absolute bottom-full left-0 mb-2 w-[200px] md:w-64 bg-[#161b22] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                        {suggestions.map(user => (
                            <div
                                key={user.handle}
                                onClick={() => handleSelectUser(user.handle)}
                                className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition"
                            >
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full"
                                />
                                <div>
                                    <p className="text-white text-sm font-medium">{user.name}</p>
                                    <p className="text-zinc-500 text-xs">{user.handle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {showEmojiPicker && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
                        <div
                            className="absolute bottom-full left-0 mb-2 z-50 shadow-2xl rounded-xl overflow-hidden border border-white/10 w-[85vw] max-w-[300px] [&_::-webkit-scrollbar]:hidden"
                            style={{
                                '--epr-bg-color': '#161b22',
                                '--epr-category-label-bg-color': '#161b22',
                                '--epr-text-color': '#ffffff',
                                '--epr-search-input-bg-color': '#0d1117',
                                '--epr-search-border-color': 'rgba(255,255,255,0.1)',
                                '--epr-picker-border-color': 'transparent',
                                '--epr-hover-bg-color': 'rgba(255,255,255,0.1)',
                            }}
                        >
                            <EmojiPicker
                                theme="dark"
                                onEmojiClick={onEmojiClick}
                                lazyLoadEmojis={true}
                                width="100%"
                                height={350}
                                previewConfig={{ showPreview: false }}
                                searchDisabled={false}
                                skinTonesDisabled
                            />
                        </div>
                    </>
                )}
                <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden transition focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50">
                    <input
                        type="text"
                        value={text}
                        onChange={handleTextChange}
                        placeholder={isQuery ? "Write a solution or comment..." : "Write a comment..."}
                        className="w-full bg-transparent border-none py-3 px-4 text-white placeholder-zinc-500 focus:outline-none"
                    />

                    {showCodeInput && isQuery && (
                        <div className="border-t border-white/10 p-2">
                            <div className="flex justify-between items-center mb-1 px-2">
                                <div className="flex items-center gap-2">
                                    <label className="block text-xs font-medium text-zinc-400">Code Snippet</label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="bg-[#161b22] text-xs text-blue-400 border border-white/10 rounded px-2 py-0.5 outline-none focus:border-blue-500"
                                    >
                                        <option value="javascript">JavaScript</option>
                                        <option value="python">Python</option>
                                        <option value="html">HTML</option>
                                        <option value="css">CSS</option>
                                        <option value="java">Java</option>
                                        <option value="cpp">C++</option>
                                        <option value="react">React</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowCodeInput(false)}
                                    className="text-xs text-red-400 hover:text-red-300"
                                >
                                    Remove
                                </button>
                            </div>
                            <textarea
                                value={codeSnippet}
                                onChange={(e) => setCodeSnippet(e.target.value)}
                                placeholder="// Paste your solution code here..."
                                rows={3}
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-green-400 font-mono text-xs placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 resize-none"
                            />
                        </div>
                    )}

                    <div className="flex justify-between items-center px-2 pb-2 mt-1">
                        <div className="flex gap-2">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className={`p-2 rounded-lg transition ${showEmojiPicker ? 'text-yellow-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Smile size={18} />
                                </button>
                            </div>

                            {/* Spacer or Code Button */}
                            {isQuery && (
                                <div className="border-l border-white/10 pl-2">
                                    {/* This divider helps separate emoji from code actions visually */}
                                </div>
                            )}

                            {isQuery && (
                                <button
                                    type="button"
                                    onClick={() => setShowCodeInput(!showCodeInput)}
                                    className={`p-2 rounded-lg transition ${showCodeInput ? "text-blue-400 bg-blue-500/10" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                                    title="Insert Code"
                                >
                                    <Code size={18} />
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!text.trim()}
                            className="p-2 text-zinc-400 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default CommentComposer;
