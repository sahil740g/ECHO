import {Newspaper, MessageCircleQuestion, TrendingUp, Users} from "lucide-react";
import {NavLink} from "react-router-dom";
const Sidebar=()=>{
    return(
        <aside className="fixed top-16 left-0 w-52 h-[calc(100vh-4rem)] bg-gray-900 border-r border-gray-600 z-40">
            <nav className="space-y-1 p-2">
                <SidebarItem to="/feed" icon={Newspaper} text="Feed"/>
                <SidebarItem to="/query" icon={MessageCircleQuestion} text="Query"/>
                <SidebarItem to="/trending" icon={TrendingUp} text="Trending"/>
                <SidebarItem to="/community" icon={Users} text="Community"/>
            </nav>
        </aside>
    )
}
function SidebarItem({icon:Icon,text,to}){
    return(
        <NavLink to={to} className={({isActive})=>`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition ${isActive ? "bg-white text-gray-900":"text-zinc-300 hover:bg-gray-800 hover:text-white"}`}>
            <Icon size={20}/>
            <span className="text-sm font-medium">{text}</span>
        </NavLink>
    )
}
export default Sidebar;