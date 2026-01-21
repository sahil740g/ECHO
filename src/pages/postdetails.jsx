import { useParams } from "react-router-dom";
import PostCard from "../components/postcard/postcard";
import { Bookmark, Share2 } from "lucide-react";
import { useState } from "react";
import { usePosts } from "../context/postscontext";

function PostDetails() {
    const { postId } = useParams();
    const { posts } = usePosts();
    const post = posts.find(p => p.id == postId);

    const [sortBy, setSortBy] = useState("best");
    const [isBookmarked, setIsBookmarked] = useState(false);

    if (!post) return <div className="text-white text-center mt-10">Post not found</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <PostCard {...post} />
            <div className="flex gap-4 mt-4 text-zinc-400">
                <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-2 transition ${isBookmarked ? "text-white" : "hover:text-white"}`}
                >
                    <Bookmark size={16} className={isBookmarked ? "fill-white text-white" : ""} />
                    {isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>
                <button className="flex items-center gap-2 hover:text-white">
                    <Share2 size={16} /> Share
                </button>
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-white">Comments</h3>
            </div>
        </div>
    );
}

export default PostDetails;
