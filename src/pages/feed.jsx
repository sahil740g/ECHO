import PostCard from "../components/postcard/postcard";
import { usePosts } from "../context/postscontext";
function Feed() {
    const { posts } = usePosts();
    return (
        <div className="p-6 max-w-3xl mx-auto space-y-4">
            {posts.map(post => (
                <PostCard key={post.id} {...post} />
            ))}
        </div>
    )
}
export default Feed;