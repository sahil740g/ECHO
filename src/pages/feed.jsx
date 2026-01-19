import PostCard from "../components/postcard/postcard";
function Feed(){
    return(
        <div className="p-6 max-w-3xl space-y-4">
            <PostCard/>
            <PostCard/>
            <PostCard/>
            <PostCard/>
            </div>
    )
}
export default Feed;