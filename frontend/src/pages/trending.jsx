import { useSearchParams } from "react-router-dom";
import { usePosts } from "../context/postscontext";
import FeedLayout from "../components/layout/FeedLayout";
import PostCard from "../components/postcard/postcard";
import TrendingLanguages from "../components/trending/trendinglanguages";

export default function Trending() {
    const { posts, getTrendingTags } = usePosts();
    const [searchParams] = useSearchParams();
    const tagParam = searchParams.get('tag');

    let trendingPosts;
    let title;

    if (tagParam) {
        // Filter by specific tag from URL
        trendingPosts = posts.filter(post =>
            post.tags && post.tags.some(tag => tag.toLowerCase() === tagParam.toLowerCase())
        );
        title = `Trending in #${tagParam}`;
    } else {
        // Default: Show posts from top 5 trending tags
        const trendingTags = getTrendingTags(5).map(t => t.name);
        trendingPosts = posts.filter(post =>
            post.tags && post.tags.some(tag => trendingTags.includes(tag))
        );
        title = "Trending Now";
    }

    return (
        <FeedLayout title={title}>
            {/* Mobile-only Trending Widgets */}
            <div className="block lg:hidden mb-6">
                <TrendingLanguages />
            </div>

            <div className="space-y-4">
                {trendingPosts.length > 0 ? (
                    trendingPosts.map(post => (
                        <PostCard key={post.id} {...post} />
                    ))
                ) : (
                    <div className="bg-[#1A1A1A] p-8 rounded-xl border border-gray-800 text-gray-400 text-center">
                        <p>No trending posts found {tagParam ? `for #${tagParam}` : 'at the moment'}.</p>
                        <p className="text-sm mt-2 opacity-60">Topics become trending when multiple people talk about them!</p>
                    </div>
                )}
            </div>
        </FeedLayout>
    );
}