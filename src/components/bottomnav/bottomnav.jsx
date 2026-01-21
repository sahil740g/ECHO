import { Newspaper, MessageCircleQuestion, TrendingUp, Users, User, Plus } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

const BottomNav = () => {
    return (
        <>
            <Link
                to="/create-post"
                className="fixed bottom-20 right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg md:hidden z-50 hover:bg-blue-600 transition"
            >
                <Plus size={24} />
            </Link>
            <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#0d1117]/90 backdrop-blur-md border-t border-white/5 z-50 md:hidden pb-safe">
                <div className="flex justify-around items-center h-full px-2">
                    <BottomNavItem to="/feed" icon={Newspaper} label="Feed" />
                    <BottomNavItem to="/query" icon={MessageCircleQuestion} label="Query" />
                    <BottomNavItem to="/trending" icon={TrendingUp} label="Trend" />
                    <BottomNavItem to="/community" icon={Users} label="Comm" />
                    <BottomNavItem to="/profile" icon={User} label="Profile" />
                </div>
            </div>
        </>
    );
};

const BottomNavItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors ${isActive ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
            }`
        }

    >
        <Icon size={20} />
        <span className="text-[10px] font-medium">{label}</span>
    </NavLink >
);

export default BottomNav;
