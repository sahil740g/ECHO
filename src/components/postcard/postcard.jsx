import { ThumbsUp, ThumbsDown, MessageSquare, Code, Check, Bookmark, Share2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePosts } from "../../context/postscontext";
import { useComments } from "../../context/commentscontext";
import { useAuth } from "../../context/authcontext";

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

    commentsCount: initialCommentsCount = 15, // Rename prop to avoid conflict/confusion
    codeSnippet = null,
    language = "javascript",
    image = null
}) {
    const { votePost } = usePosts();
    const { getCommentCount } = useComments();
    const { user, toggleBookmark } = useAuth();
    const [showCode, setShowCode] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isShared, setIsShared] = useState(false);

    const isBookmarked = user?.savedPosts?.includes(id);

    // Derived state for display
    const voteCount = votes;
    const userVote = propsUserVote;

    // Get real comment count from context, fallback to prop if not found (or if 0 and maybe prop has value? context implies source of truth though)
    const realCommentCount = getCommentCount(id);
    const displayCommentsCount = realCommentCount > 0 ? realCommentCount : initialCommentsCount;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeSnippet);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
            setIsShared(true);
            setTimeout(() => setIsShared(false), 2000);
        } catch (err) {
            console.error("Failed to copy link!", err);
        }
    };

    const navigate = useNavigate();
    return (
        <article className="block w-full bg-[#161b22]/80 backdrop-blur-sm border border-white/5 rounded-xl p-3 md:p-5 shadow-lg hover:shadow-[0_0_20px_-5px_rgba(56,189,248,0.3)] hover:border-blue-500/30 transition duration-300 group">
            <div className="flex gap-3 md:gap-4 h-full">
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
                <div className="flex-1 flex flex-col min-h-[180px]">
                    <div className="flex items-center gap-3 mb-2 cursor-pointer group/user" onClick={(e) => {
                        e.stopPropagation();
                        // Remove @ and navigate
                        const profilePath = handle.startsWith('@') ? handle.substring(1) : handle;
                        navigate(`/profile/${profilePath}`);
                    }}>
                        <img src={avatar || "https://i.pravatar.cc/100"}
                            className="w-9 h-9 rounded-full border border-white/10 group-hover/user:border-blue-500/50 transition" />
                        <div className="text-xs text-zinc-400 group-hover/user:text-zinc-300 transition">
                            <span className="text-white font-medium group-hover/user:text-blue-400 transition">{handle}</span>
                            <span className="ml-2">{time}</span>
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold text-white leading-snug mb-1 break-all">{title}</h2>
                    {/* Description with basic tag parsing */}
                    <p className="text-sm text-zinc-400 leading-relaxed mb-3 break-all">
                        {description.split(/(@[\w_]+)/g).map((part, i) => {
                            if (part.startsWith('@')) {
                                const handle = part;
                                return (
                                    <Link
                                        key={i}
                                        to={`/profile/${handle.substring(1)}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-blue-400 hover:underline"
                                    >
                                        {part}
                                    </Link>
                                );
                            }
                            return part;
                        })}
                    </p>
                    {image && (
                        <>
                            <div
                                className="mb-4 rounded-xl overflow-hidden border border-white/10 cursor-zoom-in"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowImagePreview(true);
                                }}
                            >
                                <img src={image} alt="Post content" className="w-full object-cover max-h-[400px]" />
                            </div>
                            {showImagePreview && (
                                <div
                                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowImagePreview(false);
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt="Full preview"
                                        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
                                    />
                                </div>
                            )}
                        </>
                    )}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {tags.map((tag, i) => (
                                <span key={i}
                                    className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium tracking-wide">#{tag}</span>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-zinc-400 mt-auto">
                        <div className="flex gap-4">
                            <button onClick={() => navigate(`/post/${id}`)} className="flex items-center gap-2 hover:text-white transition">
                                <MessageSquare size={14} />
                                <span>{displayCommentsCount} comments</span>
                            </button>
                            <button onClick={() => toggleBookmark(id)} className={`flex items-center gap-2 transition ${isBookmarked ? "text-yellow-500" : "hover:text-white"}`}>
                                <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
                                <span>{isBookmarked ? "Saved" : "Save"}</span>
                            </button>
                            <button onClick={handleShare} className="flex items-center gap-2 hover:text-white transition">
                                {isShared ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                                <span className={isShared ? "text-green-500" : ""}>{isShared ? "Copied Link" : "Share"}</span>
                            </button>
                        </div>
                        {codeSnippet && (
                            <button onClick={() => setShowCode(!showCode)} className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                                <Code size={14} />{showCode ? "Hide Code" : "View Code"}
                            </button>
                        )}
                    </div>
                    {showCode && codeSnippet && (
                        <div className="mt-4 mb-4 rounded-lg border border-white/10 overflow-hidden bg-[#0d1117]">
                            <div className="flex justify-between items-center px-4 py-2 bg-[#0d1117] border-b border-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                </div>
                                <span className="text-xs font-mono text-zinc-500 capitalized">{language}</span>
                                <button onClick={handleCopy}
                                    className="flex items-center gap-1.5 hover:text-white transition text-xs font-medium text-zinc-400">
                                    {isCopied ? <Check size={14} className="text-green-500" /> : <div className="i-lucide-copy" />}
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