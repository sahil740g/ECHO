import { Newspaper, MessageCircleQuestion, TrendingUp, Users, BookOpen, ChevronDown, ChevronRight, FileText, HelpCircle, Shield, Info } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);

    return (
        <aside className="fixed top-16 left-0 w-52 h-[calc(100vh-4rem)] bg-gray-900 border-r border-gray-600 z-40">
            <nav className="space-y-1 p-2">
                <SidebarItem to="/feed" icon={Newspaper} text="Feed" />
                <SidebarItem to="/query" icon={MessageCircleQuestion} text="Query" />
                <SidebarItem to="/trending" icon={TrendingUp} text="Trending" />
                <SidebarItem to="/community" icon={Users} text="Community" />
                <div className="h-px bg-gray-500 w-[90%] mx-auto my-2"></div>

                <div>
                    <button
                        onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                        className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-zinc-300 hover:bg-gray-800 hover:text-white transition cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <BookOpen size={20} />
                            <span className="text-sm font-medium">Resources</span>
                        </div>
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${isResourcesOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {isResourcesOpen && (
                        <div className="mt-1 ml-4 space-y-1 pl-2">
                            <SidebarItem to="/blog" icon={FileText} text="Blog" small />
                            <SidebarItem to="/help" icon={HelpCircle} text="Help Center" small />
                            <SidebarItem to="/guidelines" icon={Shield} text="Guidelines" small />
                            <SidebarItem to="/about" icon={Info} text="About" small />
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    )
}

function SidebarItem({ icon: Icon, text, to, small = false }) {
    return (
        <NavLink to={to} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${isActive ? "bg-white text-gray-900" : "text-zinc-300 hover:bg-gray-800 hover:text-white"} ${small ? "text-xs" : "text-sm"}`}>
            <Icon size={small ? 16 : 20} />
            <span className={`font-medium ${small ? "text-xs" : "text-sm"}`}>{text}</span>
        </NavLink>
    )
}

export default Sidebar;