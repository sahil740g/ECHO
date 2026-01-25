import { useState } from "react";
import { Send } from "lucide-react";
import { useComments } from "../../context/commentscontext";
import { mockUsers } from "../../data/mockUsers";

function CommentComposer({ postId }) {
    const [text, setText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { addComment } = useComments();

    const handleTextChange = (e) => {
        const val = e.target.value;
        setText(val);

        const lastWord = val.split(' ').pop();
        if (lastWord.startsWith('@') && lastWord.length > 1) {
            const query = lastWord.slice(1).toLowerCase();
            const filtered = mockUsers.filter(u =>
                u.name.toLowerCase().includes(query) ||
                u.handle.toLowerCase().includes(query)
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelectUser = (handle) => {
        const words = text.split(' ');
        words.pop(); // Remove partial @
        const newText = [...words, handle].join(' ') + ' ';
        setText(newText);
        setShowSuggestions(false);
        // Focus input logic could be added here if ref was used
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        addComment(postId, text);
        setText("");
        setShowSuggestions(false);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-3 relative">
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
                <input
                    type="text"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Write a comment..."
                    className="w-full bg-[#161b22] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition"
                />
                <button
                    type="submit"
                    disabled={!text.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <Send size={18} />
                </button>
            </div>
        </form>
    );
}

export default CommentComposer;
