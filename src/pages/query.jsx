import CommunityStats from "../components/stats/communitystats";
import TrendingLanguages from "../components/trending/trendinglanguages";
import { usePosts } from "../context/postscontext";
import PostCard from "../components/postcard/postcard";
import { MessageCircleQuestion } from "lucide-react";

export default function Query() {
    const { posts } = usePosts();
    const queryPosts = posts.filter(post => post.type === 'query');

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h1 className="text-2xl font-bold mb-4">Community Queries</h1>

                    {queryPosts.length > 0 ? (
                        queryPosts.map(post => (
                            <PostCard key={post.id} {...post} />
                        ))
                    ) : (
                        <div className="bg-[#1A1A1A] p-10 rounded-xl border border-gray-800 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                <MessageCircleQuestion size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No queries yet</h3>
                            <p className="text-gray-400 max-w-md">
                                Be the first to ask a question to the community! Click "New Query" in the navigation bar.
                            </p>
                        </div>
                    )}
                </div>
                <div className="hidden lg:block space-y-6 sticky top-24 h-fit">
                    <CommunityStats />
                    <TrendingLanguages />
                </div>
            </div>
        </div>
    );
}