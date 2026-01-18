import {HousePlus, MessageCircleQuestionMark, TrendingUp, Users} from "lucide-react";
const Sidebar=()=>{
    return(
        <aside className="fixed top-16 left-0 w-50 h-[calc(100vh-4rem)] bg-gray-900 border-r border-gray-600 z-40">
            <nav className="space-y-1">
                <SidebarItem icon={HousePlus} text="Home"/>
                <SidebarItem icon={MessageCircleQuestionMark} text="Query"/>
                <SidebarItem icon={TrendingUp} text="Trending"/>
                <SidebarItem icon={Users} text="Community"/>
            </nav>
        </aside>
    )
}
function SidebarItem({icon:Icon,text}){
    return(
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition hover:bg-gray-800">
            <Icon size={20} strokeWidth={2}/>
            <span className="text-sm font-medium">{text}</span>
        </div>
    )
}
export default Sidebar;