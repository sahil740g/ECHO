import {ArrowUp,MessageSquare,Code} from "lucide-react";
import {useState} from "react";
function PostCard({
    votes=142,
    username="Dishant Savadia",
    handle="@dishantsav123",
    time="2h ago",
    title="Building a Real-Time Collaboration Tool with WebSockets",
    description="Just finished implementing a real-time collaboration, The performance are incredible",
    tags=["WebSockets","JavaScript"],
    comments=23,
    avatar,
    codeSnippet = `const socket = new WebSocket("ws://localhost:8080");
    socket.onmessage = (event) => {
        console.log(event.data);
    };`
    })
{
    const[showCode,setShowCode]=useState(false);
    return(
        <div className="bg-gray-900 border border-zinc-800 rounded-lg p-4 flex gap-4 hover:border-zinc-700 transition">
            <div className="flex flex-col items-center text-zinc-400 min-w-[28px]">
                <ArrowUp size={16} className="hover:text-blue-500 cursor-pointer"/>
                <span className="text-sm font-medium text-white">{votes}</span>
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <img src={avatar || "https://i.pravatar.cc/100"} alt="avatar" className="w-8 h-8 rounded-full object-cover"/>
                    <div className="text-xs">
                        <span className="text-white font-medium">{username}</span>
                        <span className="text-zinc-400 ml-2">{handle}</span>
                        <span className="text-zinc-500 ml-2">{time}</span>
                    </div>
                </div>
                <h2 className="text-base font-semibold text-white leading-snug mb-1">{title}</h2>
                <p className="text-sm text-zinc-400 leading-snug mb-2">{description}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {tags.map((tag,index)=>(
                        <span key={index} className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer">#{tag}</span>
                    ))}
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                    <MessageSquare size={16}/>
                    <span>{comments} comments</span>
                </div>
                <button onClick={()=>setShowCode(!showCode)} className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                    <Code size={14}/>
                    {showCode ? "Hide code":"View code"}
                </button>
            </div>
            {showCode &&(
                <pre className="mt-3 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm overflow-x-auto">
                    <code className="text-green-400 whitespace-pre">
                        {codeSnippet}
                    </code>
                </pre>
            )}
        </div>
    )
}
export default PostCard;