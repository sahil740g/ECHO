import { usePosts } from "../context/postscontext";
import PostCard from "../components/postcard/postcard";
import FeedLayout from "../components/layout/FeedLayout";
import { MessageCircleQuestion } from "lucide-react";

export default function Query() {
    const { posts } = usePosts();

    // STRICTLY Filter posts for only those of type 'query'
    const queryPosts = posts.filter(post => post.type === 'query');

    return (
        <FeedLayout title="Community Queries" showSidebar={true}>
            {queryPosts.length > 0 ? (
                <div className="space-y-4">
                    {queryPosts.map(post => (
                        <PostCard key={post.id} {...post} />
                    ))}
                </div>
            ) : (
                <div className="w-full bg-[#161b22]/80 backdrop-blur-sm border border-white/5 rounded-xl p-12 shadow-lg flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 text-blue-400">
                        <MessageCircleQuestion size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No queries yet</h3>
                    <p className="text-zinc-400 max-w-md mx-auto mb-8 text-lg">
                        Have a technical question? Ask the community and get help!
                    </p>
                </div>
            )}
        </FeedLayout>
    );
}