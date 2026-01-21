import { useSearchParams } from "react-router-dom";
import { usePosts } from "../context/postscontext";
import PostCard from "../components/postcard/postcard";
import { Search, Info } from "lucide-react";

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q")?.toLowerCase() || "";
    const { posts } = usePosts();

    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(query) ||
            post.description.toLowerCase().includes(query) ||
            post.tags.some((tag) => tag.toLowerCase().includes(query))
    );

    return (
        <div className="w-full md:w-[calc(100vw-13rem)] mx-auto py-8 flex flex-col min-h-[calc(100vh-4rem)]">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Search className="text-blue-500" />
                Search Results for <span className="text-blue-400">"{query}"</span>
            </h1>

            {filteredPosts.length > 0 ? (
                <div className="space-y-6">
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
