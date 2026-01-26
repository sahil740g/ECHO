import { ThumbsUp, ThumbsDown, MessageSquare, Send, Code, Check } from "lucide-react";
import CommentList from "./commentlist";
import { useComments } from "../../context/commentscontext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { mockUsers } from "../../data/mockUsers";

function Comment({ comment, postId = "1" }) {
    const { likeComment, addReply } = useComments();
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showCode, setShowCode] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(comment.codeSnippet);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    const handleTextChange = (e) => {
        const val = e.target.value;
        setReplyText(val);

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
        const words = replyText.split(' ');
        words.pop(); // Remove partial @
        const newText = [...words, handle].join(' ') + ' ';
        setReplyText(newText);
        setShowSuggestions(false);
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        addReply(postId, comment.id, replyText);
        setReplyText("");
        setIsReplying(false);
        setShowSuggestions(false);
    };

    if (!comment) return null;

    return (
        <div className="flex gap-3">
            <img
                src={comment.avatar || "https://i.pravatar.cc/100"}
                className="w-8 h-8 rounded-full border border-white/10"
                alt="User avatar"
            />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{comment.user}</span>
                    <span className="text-xs text-zinc-500">{comment.time}</span>
                </div>

                <p className="text-sm text-zinc-300 mb-2 leading-relaxed">
                    {comment.text.split(/(@[\w_]+)/g).map((part, i) => {
                        if (part.startsWith('@')) {
                            const handle = part;
                            // Basic check if it looks like a handle, link it
                            return (
                                <Link
                                    key={i}
                                    to={`/profile/${handle.substring(1)}`}
                                    className="text-blue-400 hover:underline"
                                >
                                    {part}
                                </Link>
                            );
                        }
                        return part;
                    })}
                </p>

                {comment.codeSnippet && (
                    <div className="mb-2">
                        <button
                            onClick={() => setShowCode(!showCode)}
                            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mb-2"
                        >
                            <Code size={12} />{showCode ? "Hide Code" : "View Code"}
                        </button>

                        {showCode && (
                            <div className="rounded-lg border border-white/10 overflow-hidden bg-[#0d1117] max-w-2xl">
                                <div className="flex justify-between items-center px-3 py-1 bg-[#161b22] text-[10px] text-zinc-400">
                                    <span>Code Snippet</span>
                                    <button onClick={handleCopy}
                                        className="flex items-center gap-1 hover:text-white transition">
                                        {isCopied ? <Check size={10} className="text-green-500" /> : null}
                                        {isCopied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                                <pre className="p-3 text-xs overflow-x-auto">
                                    <code className="text-green-400 whitespace-pre">{comment.codeSnippet}</code>
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <button
                        onClick={() => likeComment(postId, comment.id, 'up')}
                        className={`flex items-center gap-1 transition ${comment.userVote === 'up' ? 'text-blue-500' : 'hover:text-white'}`}
                    >
                        <ThumbsUp size={14} className={comment.userVote === 'up' ? 'fill-blue-500' : ''} /> {comment.likes}
                    </button>
                    <button
                        onClick={() => likeComment(postId, comment.id, 'down')}
                        className={`flex items-center gap-1 transition ${comment.userVote === 'down' ? 'text-red-500' : 'hover:text-white'}`}
                    >
                        <ThumbsDown size={14} className={comment.userVote === 'down' ? 'fill-red-500' : ''} /> {comment.dislikes > 0 && comment.dislikes}
                    </button>
                    <button
                        onClick={() => setIsReplying(!isReplying)}
                        className={`flex items-center gap-1 transition ${isReplying ? 'text-blue-400' : 'hover:text-white'}`}
                    >
                        <MessageSquare size={14} /> Reply
                    </button>
                </div>

                {isReplying && (
                    <form onSubmit={handleReplySubmit} className="mt-3 flex gap-2 relative">
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
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <div>
                                            <p className="text-white text-xs font-medium">{user.name}</p>
                                            <p className="text-zinc-500 text-[10px]">{user.handle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <input
                            type="text"
                            value={replyText}
                            onChange={handleTextChange}
                            placeholder="Write a reply..."
                            className="flex-1 bg-[#161b22] border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 transition"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!replyText.trim()}
                            className="p-2 text-zinc-400 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 ml-2 border-l-2 border-white/10 pl-4">
                        <CommentList comments={comment.replies} postId={postId} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comment;
