import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import CommentList from "./commentlist";

function Comment({ comment }) {
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
                    <button className="flex items-center gap-1 hover:text-white transition">
                        <ThumbsUp size={14} /> {comment.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-white transition">
                        <ThumbsDown size={14} />
                    </button>
                    <button className="flex items-center gap-1 hover:text-white transition">
                        <MessageSquare size={14} /> Reply
                    </button>
                </div>

                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 ml-2 border-l-2 border-white/10 pl-4">
                        <CommentList comments={comment.replies} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comment;
