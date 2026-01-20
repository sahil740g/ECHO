import { useParams } from "react-router-dom";
import PostCard from "../components/postcard/postcard";
import { Bookmark, Share2 } from "lucide-react";
import { useState } from "react";

function PostDetails() {
    const { postId } = useParams();
    const [sortBy, setSortBy] = useState("best");
    const [isBookmarked, setIsBookmarked] = useState(false);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <PostCard postId={postId} />
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
