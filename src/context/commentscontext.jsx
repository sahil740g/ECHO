import {createContext,useContext,useState} from "react";
const CommentsContext=createContext();
export function CommentsProvider({children}) {
  const [posts,setPosts]=useState({
    p1:{
      id:"p1",
      comments:[]
    }
  });
  const addComment = (postId, text) => {
    setPosts(prev => ({
      ...prev,
      [postId]:{
        ...prev[postId],
        comments:[
          ...prev[postId].comments,
          {
            id: Date.now(),
            text,
            user: "Guest",
            time: "just now",
            likes: 0,
            dislikes: 0,
            replies: []
          }
        ]
      }
    }));
  };
  return (
    <CommentsContext.Provider value={{posts,addComment}}>
      {children}
    </CommentsContext.Provider>
  );
}
export const useComments=()=>useContext(CommentsContext);