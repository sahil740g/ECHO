import PostCard from "../components/postcard/postcard";
import { usePosts } from "../context/postscontext";
import TrendingLanguages from "../components/trending/trendinglanguages";
import CommunityStats from "../components/stats/communitystats";

function Feed() {
    const { posts } = usePosts();
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Feed Content */}
                <div className="lg:col-span-2 space-y-4">
                    {posts.map(post => (
                        <PostCard key={post.id} {...post} />
                    ))}
                </div>

                {/* Right Sidebar - Stats & Trending */}
                <div className="hidden lg:block space-y-6 sticky top-24 h-fit">
                    <CommunityStats />
                    <TrendingLanguages />
                </div>
            </div>
        </div>
    )
}
export default Feed;