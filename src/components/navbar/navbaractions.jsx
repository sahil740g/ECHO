import { PlusSquare, UserCircle, User, Bookmark, Settings, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import NewPostModal from "./newpostmodal";
import AuthModal from "./authmodal";
import { useAuth } from "../../context/authcontext";

const NavbarActions = () => {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, login, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3 whitespace-nowrap">
      <button
        onClick={() => setIsNewPostModalOpen(true)}
        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm hover:bg-blue-500 hover:text-white cursor-pointer transition"
      >
        <PlusSquare size={18} />
        New Post
      </button>
      {!user ? (
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black transition cursor-pointer"
        >
          Log in
        </button>
      ) : (

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`p-2 rounded-full hover:bg-white/10 cursor-pointer transition ${isDropdownOpen ? "text-white bg-white/10" : "text-zinc-400 hover:text-white"}`}
          >
            <UserCircle size={40} />
          </button>

          {
            isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#161b22] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
                <div className="p-4 border-b border-white/5">
                  <p className="text-white font-medium truncate">{user.name}</p>
                  <p className="text-zinc-500 text-xs truncate">{user.handle}</p>
                </div>
                <div className="p-2">
                  <Link to="/profile" className="w-full flex items-center gap-3 px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition text-sm text-left">
                    <User size={18} />
                    View Profile
                  </Link>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition text-sm text-left">
                    <Bookmark size={18} />
                    Bookmarked Posts
                  </button>
                </div>
                <div className="p-2 border-t border-white/5">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition text-sm text-left">
                    <Settings size={18} />
                    Settings
                  </button>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition text-sm text-left"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                </div>
              </div>
            )
          }
        </div >
      )}

      <NewPostModal isOpen={isNewPostModalOpen} onClose={() => setIsNewPostModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div >
  );
};
export default NavbarActions;