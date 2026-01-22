import { ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react";
import CommentList from "./commentlist";
import { useComments } from "../../context/commentscontext";
import { useState } from "react";

function Comment({ comment, postId = "1" }) {
    const { likeComment, addReply } = useComments();
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        addReply(postId, comment.id, replyText);
        setReplyText("");
        setIsReplying(false);
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
                    {comment.text}
                </p>

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
                    <form onSubmit={handleReplySubmit} className="mt-3 flex gap-2">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
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
