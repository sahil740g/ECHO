import { Newspaper, MessageCircleQuestion, TrendingUp, Users, User, Plus, MessageSquare } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import NewPostModal from "../navbar/newpostmodal";
import AuthModal from "../navbar/authmodal";
import { useAuth } from "../../context/authcontext";
import { useLocation } from "react-router-dom";
const BottomNav = () => {
    const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    // Hide only if we are in a specific chat (e.g. /chat/123), but show for chat list (/chat)
    // We check if it starts with /chat/ (with slash)
    if (location.pathname.startsWith('/chat/')) return null;

    // Pages where the "New Post" (+) button should be visible
    const showNewPostButton = ['/feed', '/query', '/trending'].some(path =>
        location.pathname === path || location.pathname.startsWith(path + '/')
    );

    return (
        <>
            {showNewPostButton && (
                <button onClick={() => setIsNewPostModalOpen(true)} className="fixed bottom-20 right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg md:hidden z-50 hover:bg-blue-600 transition cursor-pointer">
                    <Plus size={24} />
                </button>
            )}
            <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#0d1117]/90 backdrop-blur-md border-t border-white/5 z-50 md:hidden pb-safe">
                <div className="flex justify-around items-center h-full px-2">
                    <BottomNavItem to="/feed" icon={Newspaper} label="Feed" />
                    <BottomNavItem to="/query" icon={MessageCircleQuestion} label="Query" />
                    <BottomNavItem to="/chat" icon={MessageSquare} label="Chat" />
                    <BottomNavItem to="/trending" icon={TrendingUp} label="Trend" />
                    <BottomNavItem to="/community" icon={Users} label="Comm" />
                    {user ? (
                        <BottomNavItem to="/profile" icon={User} label="Profile" end />
                    ) : (
                        <button onClick={() => setIsAuthModalOpen(true)} className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors text-zinc-500 hover:text-zinc-300">
                            <User size={20} />
                            <span className="text-[10px] font-medium">Profile</span>
                        </button>
                    )}
                </div>
            </div>
            <NewPostModal isOpen={isNewPostModalOpen} onClose={() => setIsNewPostModalOpen(false)} isQuery={true} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
};
const BottomNavItem = ({ to, icon: Icon, label, end }) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors ${isActive ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"}`}>
        <Icon size={20} />
        <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
);
export default BottomNav;