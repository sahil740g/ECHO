import {createContext,useContext,useState,useEffect} from "react";
const AuthContext=createContext();
export const AuthProvider=({ children }) => {
    // Default to null (logged out)
    const [user,setUser]=useState(null);
    const login=()=>{
        // Simulating a login
        setUser({
            id: "curr_user",
            name: "Current User",
            handle: "@currentuser",
            avatar: null, // or a default image URL
            savedPosts: [] // Array of post IDs
        });
    };
    const logout=()=>{
        setUser(null);
    };
    const updateUser=(userData)=>{
        setUser(prev=>({ ...prev, ...userData }));
    };
    const toggleBookmark=(postId)=>{
        setUser(prev=>{
            if(!prev)return null;
            const isSaved=prev.savedPosts.includes(postId);
            let newSavedPosts;
            if(isSaved){
                newSavedPosts=prev.savedPosts.filter(id => id !== postId);
            }else{
                newSavedPosts=[...prev.savedPosts, postId];
            }
            return{
                ...prev,
                savedPosts: newSavedPosts
            };
        });
    };
    return(
        <AuthContext.Provider value={{ user, login, logout, updateUser, toggleBookmark }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);