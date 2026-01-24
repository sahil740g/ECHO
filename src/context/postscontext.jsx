import { createContext, useContext, useState } from "react";

const PostsContext = createContext();

export function PostsProvider({ children }) {
    const [posts, setPosts] = useState([
        {
            id: 1,
            votes: 142,
            username: "Dishant Savadia",
            handle: "@dishantsav123",
            time: "2h ago",
            title: "Building a Real-Time Collaboration Tool with WebSockets",
            description: "Just finished implementing a real-time collaboration, The performance are incredible",
            tags: ["WebSockets", "JavaScript"],
            commentsCount: 15,
            codeSnippet: `const socket = new WebSocket("ws://localhost:8080");
socket.onmessage = (event) => {
    console.log(event.data);
};`,
            userVote: null
        },
        {
            id: 2,
            votes: 89,
            username: "Sarah Jenkins",
            handle: "@sarahj_dev",
            time: "4h ago",
            title: "Why you should use TypeScript in 2024",
            description: "TypeScript has become the industry standard for large scale applications. Here is why...",
            tags: ["TypeScript", "WebDev"],
            commentsCount: 32,
            userVote: null
        },
        {
            id: 3,
            votes: 12,
            username: "Alex Chen",
            handle: "@alexc_dev",
            time: "1h ago",
            title: "How to fix React hydration error with extensive use of random values?",
            description: "I'm getting 'Text content does not match server-rendered HTML' when using Math.random() in my components. What is the best practice for this?",
            tags: ["React", "NextJS", "Hydration"],
            commentsCount: 5,
            userVote: null,
            type: 'query'
        },
    ]);

    const addPost = (newPost) => {
        const post = {
            id: Date.now(),
            votes: 0,
            username: "Current User", // Hardcoded for now
            handle: "@currentuser",
            time: "Just now",
            commentsCount: 0,
            ...newPost,
            userVote: null // Initialize with no vote
        };
        setPosts([post, ...posts]);
    };

    const votePost = (postId, type) => {
        setPosts(prevPosts => prevPosts.map(post => {
            if (post.id === postId) {
                let newVoteCount = post.votes;
                let newUserVote = post.userVote;

                if (newUserVote === type) {
                    // Toggle off (remove vote)
                    newVoteCount = type === 'up' ? newVoteCount - 1 : newVoteCount + 1;
                    newUserVote = null;
                } else if (!newUserVote) {
                    // Add new vote
                    newVoteCount = type === 'up' ? newVoteCount + 1 : newVoteCount - 1;
                    newUserVote = type;
                } else {
                    // Switch vote
                    newVoteCount = type === 'up' ? newVoteCount + 2 : newVoteCount - 2;
                    newUserVote = type;
                }

                return { ...post, votes: newVoteCount, userVote: newUserVote };
            }
            return post;
        }));
    };

    return (
        <PostsContext.Provider value={{ posts, addPost, votePost }}>
            {children}
        </PostsContext.Provider>
    );
}

export const usePosts = () => useContext(PostsContext);
