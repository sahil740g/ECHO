import { useState } from "react";
import { Send } from "lucide-react";
import { useComments } from "../../context/commentscontext";

function CommentComposer({ postId }) {
    const [text, setText] = useState("");
    const { addComment } = useComments();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        addComment(postId, text);
        setText("");
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
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
