import PostCard from "../components/postcard/postcard";
import { usePosts } from "../context/postscontext";
import FeedLayout from "../components/layout/FeedLayout";

function Feed() {
    const { posts } = usePosts();
    return (
        <FeedLayout>
            {posts.filter(post => post.type !== 'query').map(post => (
                <PostCard key={post.id} {...post} />
            ))}
        </FeedLayout>
    )
}
export default Feed;