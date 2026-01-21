import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
    }
  }, [searchParams]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex items-center w-full max-w-md bg-zinc-800/50 border border-white/5 px-4 py-2 rounded-full transition focus-within:ring-1 focus-within:ring-blue-500/50 focus-within:bg-zinc-800 focus-within:border-blue-500/50">
      <Search size={18} strokeWidth={2} className="text-zinc-500" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for anything..."
        className="bg-transparent outline-none px-3 w-full text-sm text-zinc-200 placeholder:text-zinc-500"
      />
    </div>
  );
};
export default SearchBar;