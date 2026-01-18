import { PlusSquare, UserCircle } from "lucide-react";

const NavbarActions=()=>{
  return(
    <div className="flex items-center gap-3 whitespace-nowrap">
      <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm hover:bg-blue-500 hover:text-white cursor-pointer">
        <PlusSquare size={18}/>
        New Post
      </button>
      <button className="p-2 rounded-full hover:bg-transparent cursor-pointer">
        <UserCircle size={42}/>
      </button>
    </div>
  );
};
export default NavbarActions;