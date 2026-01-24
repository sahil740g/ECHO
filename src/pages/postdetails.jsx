import {useParams} from "react-router-dom";
import PostCard from "../components/postcard/postcard";
import CommentList from "../components/postcard/commentlist";
import CommentComposer from "../components/postcard/commentcomposer";
import {usePosts} from "../context/postscontext";
import {useComments} from "../context/commentscontext";
import CommunityStats from "../components/stats/communitystats";
import TrendingLanguages from "../components/trending/trendinglanguages";

function PostDetails() {
    const {postId}=useParams();
    const {posts}=usePosts();
    const {posts:commentPosts}=useComments();

    // We're looking for the post in posts context to display details
    // But for comments, we look up by ID in comments context
    // Note: The mocked post in PostCard uses ID '1' implicitly in navigation, but let's be safe.
    // If the URL is /post/1, postId is '1'.

    const post=posts.find(p => p.id == postId);
    const postComments=commentPosts[postId]?.comments || [];

    if(!post)return <div className="text-white text-center mt-10">Post not found</div>;

    return(
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <PostCard {...post} />
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <h3 className="text-lg font-semibold text-white mb-6">Comments ({postComments.length})</h3>
                        <CommentComposer postId={postId} />
                        <CommentList comments={postComments} postId={postId} />
                    </div>
                </div>
                <div className="hidden lg:block space-y-6 sticky top-24 h-fit">
                    <CommunityStats />
                    <TrendingLanguages />
                </div>
            </div>
        </div>
    );
}
export default PostDetails;