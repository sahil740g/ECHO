import PostCard from "../components/postcard/postcard";
function Feed() {
    return (
        <div className="p-6 max-w-3xl mx-auto space-y-4">
            <PostCard postId="1" />
            <PostCard postId="2" />
            <PostCard postId="3" />
            <PostCard postId="4" />
        </div>
    )
}
export default Feed;