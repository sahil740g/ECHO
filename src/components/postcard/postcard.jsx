import { ThumbsUp, ThumbsDown, MessageSquare, Code, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../context/postscontext";
function PostCard({
    id,
    votes = 142,
    userVote: propsUserVote = null,
    username = "Dishant Savadia",
    handle = "@dishantsav123",
    time = "2h ago",
    title = "Building a Real-Time Collaboration Tool with WebSockets",
    description = "Just finished implementing a real-time collaboration, The performance are incredible",
    tags = ["WebSockets", "JavaScript"],
    avatar,
    commentsCount = 15,
    codeSnippet = `const socket = new WebSocket("ws://localhost:8080");
    socket.onmessage = (event) => {
        console.log(event.data);
    };`
}) {
    const { votePost } = usePosts();
    const [showCode, setShowCode] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Derived state for display
    const voteCount = votes;
    const userVote = propsUserVote;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeSnippet);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    const navigate = useNavigate();
    return (
        <article className="bg-[#161b22]/80 backdrop-blur-sm border border-white/5 rounded-xl p-3 md:p-5 shadow-lg hover:shadow-[0_0_20px_-5px_rgba(56,189,248,0.3)] hover:border-blue-500/30 transition duration-300 group">
            <div className="flex gap-3 md:gap-4">
                <div className="flex flex-col items-center gap-1 w-12 flex-shrink-0">
                    <button onClick={() => votePost(id, 'up')}
                        className={`p-1 rounded transition ${userVote === "up" ? "text-blue-500" : "text-zinc-400 hover:text-blue-400"}`}>
                        <ThumbsUp size={18} />
                    </button>
                    <span className={`text-sm font-semibold transition tabular-nums text-center ${userVote === "up" ? "text-blue-500" : userVote === "down" ? "text-red-500" : "text-white"}`}>{voteCount}</span>
                    <button onClick={() => votePost(id, 'down')}
                        className={`p-1 rounded transition ${userVote === "down" ? "text-red-500" : "text-zinc-400 hover:text-red-400"}`}>
                        <ThumbsDown size={18} />
                    </button>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <img src={avatar || "https://i.pravatar.cc/100"}
                            className="w-9 h-9 rounded-full border border-white/10" />
                        <div className="text-xs text-zinc-400">
                            <span className="text-white font-medium">{username}</span>
                            <span className="ml-2">{handle}</span>
                            <span className="ml-2">{time}</span>
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold text-white leading-snug mb-1">{title}</h2>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-3">{description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, i) => (
                            <span key={i}
                                className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium tracking-wide">#{tag}</span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                        <button onClick={() => navigate(`/post/1`)} className="flex items-center gap-2 hover:text-white transition">
                            <MessageSquare size={14} />
                            <span>{commentsCount} comments</span>
                        </button>
                        <button onClick={() => setShowCode(!showCode)} className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                            <Code size={14} />{showCode ? "Hide Code" : "View Code"}
                        </button>
                    </div>
                    {showCode && (
                        <div className="mt-4 mb-4 rounded-lg border border-white/10 overflow-hidden bg-[#0d1117]">
                            <div className="flex justify-between items-center px-3 py-2 bg-[#161b22] text-xs text-zinc-400">
                                <span>JavaScript</span>
                                <button onClick={handleCopy}
                                    className="flex items-center gap-1 hover:text-white transition text-xs">
                                    {isCopied ? <Check size={14} className="text-green-500" /> : null}
                                    {isCopied ? "Copied!" : "Copy"}
                                </button>
                            </div>
                            <pre className="p-4 text-sm overflow-x-auto">
                                <code className="text-green-400 whitespace-pre">{codeSnippet}</code>
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}
export default PostCard;