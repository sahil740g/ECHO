import PostCard from "../components/postcard/postcard";
import { usePosts } from "../context/postscontext";
import FeedLayout from "../components/layout/FeedLayout";
import { Loader2 } from "lucide-react";

function Feed() {
  const { posts, loading } = usePosts();

  // Filter out query-type posts
  const feedPosts = posts.filter((post) => post.type !== "query");

  if (loading) {
    return (
      <FeedLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </FeedLayout>
    );
  }

  if (feedPosts.length === 0) {
    return (
      <FeedLayout>
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No posts yet</h2>
          <p className="text-zinc-500">
            Be the first to share something with the community!
          </p>
        </div>
      </FeedLayout>
    );
  }

  return (
    <FeedLayout>
      {feedPosts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </FeedLayout>
  );
}
export default Feed;
