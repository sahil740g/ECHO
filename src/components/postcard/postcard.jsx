import {ThumbsUp,ThumbsDown,MessageSquare,Code} from "lucide-react";
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
    const[voteCount,setVoteCount]=useState(votes);
    const[userVote,setUserVote]=useState(null);
    return(
        <article className="bg-gray-900 border border-white/10 rounded-xl p-5 shadow-lg hover:shadow-xl transition">
            <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                    <button onClick={()=>{
                        if (userVote==="up"){
                            setVoteCount(voteCount-1);
                            setUserVote(null);
                        }else{
                            setVoteCount(userVote==="down"?voteCount+2:voteCount+1);
                            setUserVote("up");
                        }
                    }}
                className={`p-1 rounded transition ${userVote==="up"?"text-blue-500":"text-zinc-400 hover:text-blue-400"}`}>
                <ThumbsUp size={18}/>
                </button>
                <span className={`text-sm font-semibold transition ${userVote === "up" ? "text-blue-500" : userVote === "down" ? "text-red-500" : "text-white"}`}>{voteCount}</span>
                <button onClick={()=>{
                    if (userVote === "down"){
                        setVoteCount(voteCount+1);
                        setUserVote(null);
                    }else{
                        setVoteCount(userVote === "up" ? voteCount-2:voteCount-1);
                        setUserVote("down");
                    }
                }}
                className={`p-1 rounded transition ${userVote==="down"?"text-red-500":"text-zinc-400 hover:text-red-400"}`}>
                    <ThumbsDown size={18}/>
                </button>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <img src={avatar || "https://i.pravatar.cc/100"}
                        className="w-9 h-9 rounded-full border border-white/10"/>
                        <div className="text-xs text-zinc-400">
                            <span className="text-white font-medium">{username}</span>
                            <span className="ml-2">{handle}</span>
                            <span className="ml-2">{time}</span>
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold text-white leading-snug mb-1">{title}</h2>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-3">{description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag,i)=>(
                            <span key={i}
                            className="text-xs px-2 py-1 rounded-md bg-white/5 text-white">#{tag}</span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={14}/>
                            <span>{comments}comments</span>
                        </div>
                        <button onClick={()=>setShowCode(!showCode)} className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                            <Code size={14}/>{showCode?"Hide Code":"View Code"}
                        </button>
                        </div>
                        {showCode &&(
                            <div className="mt-4 mb-4 rounded-lg border border-white/10 overflow-hidden bg-[#0d1117]">
                                <div className="flex justify-between items-center px-3 py-2 bg-[#161b22] text-xs text-zinc-400">
                                    <span>JavaScript</span>
                                    <button onClick={()=>navigator.clipboard.writeText(codeSnippet)}
                                    className="hover:text-white">Copy</button>
                                </div>
                                <pre className="p-4 text-sm overflow-x-auto">
                                    <code className="text-green-400 whitespace-pre">{codeSnippet}</code>
                                </pre>
                                </div>
                        )}
                        </div>
                    </div>
        </article>
    )
}
export default PostCard;