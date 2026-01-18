import {Search} from "lucide-react";
const SearchBar=()=>{
  return(
    <div className="flex items-center w-full max-w-md bg-gray-100 px-4 py-2 rounded-full transition focus-within:ring-2 focus-within:ring-blue-500">
      <Search size={18} strokeWidth={2} className="text-gray-600" />
      <input
        type="text"
        placeholder="Search for anything..."
        className="bg-transparent outline-none px-2 w-full text-sm text-black text-left placeholder:text-center focus:placeholder:text-left"
      />
    </div>
  );
};
export default SearchBar;