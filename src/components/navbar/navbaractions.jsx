import { PlusSquare, UserCircle, User, Bookmark, Settings, LogOut, Search, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NewPostModal from "./newpostmodal";
import AuthModal from "./authmodal";
import { useAuth } from "../../context/authcontext";

const NavbarActions = () => {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  // Removed local auth modal state in favor of context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");
  const dropdownRef = useRef(null);
  const { user, login, logout, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleMobileSearch = (e) => {
    if (e.key === "Enter" && mobileQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(mobileQuery)}`);
      setShowMobileSearch(false);
      setMobileQuery("");
    }
  };
  return (
    <div className="flex items-center gap-3 whitespace-nowrap">
      {showMobileSearch && (
        <div className="absolute top-0 left-0 w-full h-16 bg-[#0d1117] flex items-center px-4 z-50 border-b border-white/10 md:hidden">
          <button onClick={() => setShowMobileSearch(false)} className="text-zinc-400 mr-4">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 flex items-center bg-zinc-800/50 rounded-full px-4 py-2">
            <Search size={18} className="text-zinc-500 mr-2" />
            <input
              autoFocus
              type="text"
              value={mobileQuery}
              onChange={(e) => setMobileQuery(e.target.value)}
              onKeyDown={handleMobileSearch}
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-white w-full text-sm"
            />
          </div>
        </div>
      )}
      <button onClick={() => setShowMobileSearch(true)} className="p-2 text-zinc-400 hover:text-white md:hidden">
        <Search size={24} />
      </button>
      <button onClick={() => setIsNewPostModalOpen(true)} className="hidden md:flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm hover:bg-blue-500 hover:text-white cursor-pointer transition">
        <PlusSquare size={18} />
        {location.pathname === '/query' ? 'New Query' : 'New Post'}
      </button>
      {!user ? (<button onClick={openLoginModal} className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black transition cursor-pointer">Log in</button>) : (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`p-2 rounded-full hover:bg-white/10 cursor-pointer transition ${isDropdownOpen ? "text-white bg-white/10" : "text-zinc-400 hover:text-white"}`}
          >
            <UserCircle size={40} className="hidden md:block" />
            <Settings size={24} className="block md:hidden" />
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

      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        isQuery={location.pathname === '/query'}
      />
      <AuthModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div >
  );
};
export default NavbarActions;