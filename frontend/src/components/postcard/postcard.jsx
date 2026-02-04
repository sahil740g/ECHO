import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Code,
  Check,
  Bookmark,
  Share2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePosts } from "../../context/postscontext";
import DeleteConfirmModal from "../DeleteConfirmModal";
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
  authorId,
  commentsCount: initialCommentsCount = 15,
  codeSnippet = null,
  language = "javascript",
  image = null,
}) {
  const { votePost, deletePost } = usePosts();
  const { getCommentCount } = useComments();
  const { user, toggleBookmark, openLoginModal } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isAuthor = user && user.id === authorId;
  const [showCode, setShowCode] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const isBookmarked = user?.savedPosts?.includes(id);

  // Use vote count directly (can be negative, like Reddit)
  const voteCount = votes;
  const userVote = propsUserVote;

  // Get real comment count from context
  const realCommentCount = getCommentCount(id);
  const displayCommentsCount =
    realCommentCount > 0 ? realCommentCount : initialCommentsCount;

  const handleVote = (e, type) => {
    e.stopPropagation();
    if (!user) {
      openLoginModal();
      return;
    }
    votePost(id, type);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (!user) {
      openLoginModal();
      return;
    }
    toggleBookmark(id);
  };

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
      await navigator.clipboard.writeText(
        `${window.location.origin}/post/${id}`,
      );
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    } catch (err) {
      console.error("Failed to copy link!", err);
    }
  };

  const navigate = useNavigate();
  return (
    <>
      {/* Main Post Card */}
      <article className="block w-full bg-[#161b22]/80 backdrop-blur-sm border border-white/5 rounded-xl p-4 md:p-5 shadow-lg hover:shadow-[0_0_20px_-5px_rgba(56,189,248,0.3)] hover:border-blue-500/30 transition duration-300 group">
        <div className="flex gap-3 md:gap-4 h-full">
          <div className="flex flex-col items-center gap-2 w-10 md:w-12 flex-shrink-0">
            <button
              onClick={(e) => handleVote(e, "up")}
              className={`p-2 rounded-lg transition ${userVote === "up" ? "text-blue-500 bg-blue-500/10" : "text-zinc-400 hover:text-blue-400 hover:bg-white/5"}`}
            >
              <ThumbsUp size={20} />
            </button>
            <span
              className={`text-sm font-bold transition tabular-nums text-center ${userVote === "up" ? "text-blue-500" : userVote === "down" ? "text-red-500" : "text-white"}`}
            >
              {voteCount}
            </span>
            <button
              onClick={(e) => handleVote(e, "down")}
              className={`p-2 rounded-lg transition ${userVote === "down" ? "text-red-500 bg-red-500/10" : "text-zinc-400 hover:text-red-400 hover:bg-white/5"}`}
            >
              <ThumbsDown size={20} />
            </button>
          </div>
          <div className="flex-1 min-w-0 flex flex-col min-h-[180px]">
            <div
              className="flex items-center gap-3 mb-2 cursor-pointer group/user"
              onClick={(e) => {
                e.stopPropagation();
                // Remove @ and navigate
                const safeHandle = handle || "";
                const profilePath = safeHandle.startsWith("@")
                  ? safeHandle.substring(1)
                  : safeHandle;
                navigate(`/profile/${profilePath}`);
              }}
            >
              <img
                src={avatar || "https://i.pravatar.cc/100"}
                className="w-9 h-9 rounded-full border border-white/10 group-hover/user:border-blue-500/50 transition"
              />
              <div className="text-xs text-zinc-400 group-hover/user:text-zinc-300 transition">
                <span className="text-white font-medium group-hover/user:text-blue-400 transition">
                  {handle || "Anonymous"}
                </span>
                <span className="ml-2">{time}</span>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-white leading-snug mb-1 break-words">
              {title}
            </h2>
            {/* Description with basic tag parsing */}
            <p className="text-sm text-zinc-400 leading-relaxed mb-3 break-words">
              {(description || "").split(/(@[\w_]+)/g).map((part, i) => {
                if (part.startsWith("@")) {
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
                  <img
                    src={image}
                    alt="Post content"
                    className="w-full object-cover max-h-[400px]"
                  />
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
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/trending?tag=${encodeURIComponent(tag)}`);
                    }}
                    className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium tracking-wide hover:bg-blue-500/20 transition cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-zinc-400 mt-auto md:pt-2">
              <div className="flex gap-4 md:gap-6">
                <button
                  onClick={() => navigate(`/post/${id}`)}
                  className="flex items-center gap-2 hover:text-white transition py-1"
                >
                  <MessageSquare size={16} />
                  <span className="hidden sm:inline">
                    {displayCommentsCount} comments
                  </span>
                  <span className="sm:hidden">{displayCommentsCount}</span>
                </button>
                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 transition py-1 ${isBookmarked ? "text-yellow-500" : "hover:text-white"}`}
                >
                  <Bookmark
                    size={16}
                    fill={isBookmarked ? "currentColor" : "none"}
                  />
                  <span className="hidden sm:inline">
                    {isBookmarked ? "Saved" : "Save"}
                  </span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 hover:text-white transition py-1"
                >
                  {isShared ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Share2 size={16} />
                  )}
                  <span className="hidden sm:inline">
                    {isShared ? "Copied" : "Share"}
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                {codeSnippet && (
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
                  >
                    <Code size={14} />
                    {showCode ? "Hide Code" : "View Code"}
                  </button>
                )}
                {isAuthor && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 size={14} />
                    <span className="hidden md:inline">Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Separate Code Card - Appears Below Post */}
      {showCode && codeSnippet && (
        <div className="mt-3 w-full bg-[#161b22]/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center px-4 md:px-5 py-3 bg-[#0d1117] border-b border-white/5">
            <div className="flex gap-2 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <span className="text-xs md:text-sm font-mono text-zinc-400 uppercase tracking-wider flex-1 text-center">
              {language}
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
          <pre className="p-4 md:p-6 text-xs md:text-sm overflow-x-auto bg-[#0d1117]">
            <code className="text-green-400 whitespace-pre font-mono">
              {codeSnippet}
            </code>
          </pre>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          await deletePost(id);
        }}
        title="Delete Post?"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </>
  );
}
export default PostCard;
