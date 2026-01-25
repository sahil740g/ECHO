import { useSearchParams } from "react-router-dom";
import { usePosts } from "../context/postscontext";
import PostCard from "../components/postcard/postcard";
import { Search, Info } from "lucide-react";
import { mockUsers } from "../data/mockUsers";
import { useNavigate } from "react-router-dom";
import FeedLayout from "../components/layout/FeedLayout";

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q")?.toLowerCase() || "";
    const { posts } = usePosts();

    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(query) ||
            post.description.toLowerCase().includes(query) ||
            post.tags.some((tag) => tag.toLowerCase().includes(query))
    );

    const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.handle.toLowerCase().includes(query)
    );

    return (
        <div className="w-full md:w-[calc(100vw-13rem)] mx-auto py-8 px-4 md:px-0 flex flex-col min-h-[calc(100vh-4rem)]">
            <h1 className="text-2xl font-bold mb-6 flex items-center justify-center md:justify-start gap-3">
                <Search className="text-blue-500" />
                Search Results for <span className="text-blue-400">"{query}"</span>
            </h1>

            {/* Users Results */}
            {filteredUsers.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Users</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUsers.map(user => (
                            <div key={user.handle}
                                onClick={() => navigate(`/profile/${user.handle.replace('@', '')}`)}
                                className="bg-[#161b22] p-4 rounded-xl border border-white/10 flex items-center gap-4 hover:border-blue-500/50 cursor-pointer transition"
                            >
                                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-12 h-12 rounded-full" />
                                <div>
                                    <h3 className="text-white font-medium">{user.name}</h3>
                                    <p className="text-zinc-500 text-sm">{user.handle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {filteredPosts.length > 0 || filteredUsers.length > 0 ? (
                <div className="space-y-6">
                    {filteredPosts.length > 0 && <h2 className="text-xl font-semibold text-white mb-4">Posts</h2>}
                    {filteredPosts.map((post) => (
                        <PostCard key={post.id} {...post} />
                    ))}
                </div>
            ) : (

                <div className="flex-1 flex flex-col items-center justify-center text-center mx-auto w-full">
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 text-zinc-500">
                        <Info size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No results found</h3>
                    <p className="text-zinc-500 text-lg max-w-md">
                        We couldn't find any posts matching "<span className="text-zinc-300">{query}</span>".
                        <br className="mb-2" />
                        Try different keywords or check for typos.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
