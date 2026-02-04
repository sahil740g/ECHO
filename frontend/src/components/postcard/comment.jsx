import { ThumbsUp, ThumbsDown, MessageSquare, Send, Code, Check } from "lucide-react";
import CommentList from "./commentlist";
import { useComments } from "../../context/commentscontext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { searchUsers, getUserByHandle } from "../../lib/user";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/authcontext";

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

    const handleTextChange = async (e) => {
        const val = e.target.value;
        setReplyText(val);

        const lastWord = val.split(' ').pop();
        if (lastWord.startsWith('@') && lastWord.length > 1) {
            const query = lastWord.slice(1).toLowerCase();
            try {
                const results = await searchUsers(query);
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
        const words = replyText.split(' ');
        words.pop(); // Remove partial @
        const newText = [...words, handle].join(' ') + ' ';
        setReplyText(newText);
        setShowSuggestions(false);
    };

    const { createNotification } = useNotifications();
    const { user } = useAuth(); // We need the current user for actor_id

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        const newReply = await addReply(postId, comment.id, replyText);

        if (newReply) {
            // Process mentions
            const mentionRegex = /@(\w+)/g;
            const matches = replyText.match(mentionRegex);

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
                            commentId: newReply.id
                        });
                    }
                });
            } else {
                // Also notify the parent comment author if not mentioned explicitly (optional, but good UX usually covered by 'reply' type)
                // But wait, NotificationContext says 'reply' type is "replied to your comment".
                // That logic should probably be in AddReply or here.
                // Currently AddReply didn't seem to trigger notifications automatically.
                // Let's rely on Mention logic for now as requested.
                // However, the user request specifically said "when i tag user".
            }

            // If we want to notify the parent comment author about the reply itself (even without tag):
            if (comment.authorId && comment.authorId !== user.id) {
                createNotification({
                    userId: comment.authorId,
                    type: 'reply',
                    actorId: user.id,
                    postId: postId,
                    commentId: newReply.id
                });
            }
        }

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
                            <div className="w-full bg-[#161b22]/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-lg">
                                <div className="flex justify-between items-center px-4 md:px-5 py-3 bg-[#0d1117] border-b border-white/5">
                                    <div className="flex gap-2 shrink-0">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                    </div>
                                    <span className="text-xs md:text-sm font-mono text-zinc-400 uppercase tracking-wider flex-1 text-center">
                                        {comment.language || 'javascript'}
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 hover:text-white transition text-xs md:text-sm font-medium text-zinc-400 shrink-0 w-[110px] md:w-[120px] justify-end whitespace-nowrap"
                                    >
                                        {isCopied ? (
                                            <Check size={16} className="text-green-500" />
                                        ) : (
                                            <Code size={16} />
                                        )}
                                        <span className="hidden sm:inline">{isCopied ? "Copied!" : "Copy Code"}</span>
                                        <span className="sm:hidden">{isCopied ? "✓" : "Copy"}</span>
                                    </button>
                                </div>
                                <pre className="p-4 md:p-6 text-xs md:text-sm overflow-x-auto bg-[#0d1117] max-w-full">
                                    <code className="text-green-400 whitespace-pre font-mono block">
                                        {comment.codeSnippet}
                                    </code>
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
                        <ThumbsUp size={14} className={comment.userVote === 'up' ? 'fill-blue-500' : ''} /> {comment.likes || 0}
                    </button>
                    <button
                        onClick={() => likeComment(postId, comment.id, 'down')}
                        className={`flex items-center gap-1 transition ${comment.userVote === 'down' ? 'text-red-500' : 'hover:text-white'}`}
                    >
                        <ThumbsDown size={14} className={comment.userVote === 'down' ? 'fill-red-500' : ''} /> {comment.dislikes || 0}
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
