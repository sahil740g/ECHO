import { Search } from "lucide-react";

const SearchBar=()=>{
  return(
    <div className="flex items-center w-full max-w-md bg-gray-100 px-3 py-2 rounded-full">
      <Search size={20} strokeWidth={4} className="text-black" />
      <input
        type="text"
        placeholder="Search for anything..."
        className="bg-transparent outline-none px-2 w-full text-sm text-black placeholder:text-black text-center"
      />
    </div>
  );
};
export default SearchBar;