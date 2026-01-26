import { createContext, useContext, useState } from "react";
const CommentsContext = createContext();
export function CommentsProvider({ children }) {
  const [posts, setPosts] = useState({
    1: {
      id: "1",
      comments: [
        {
          id: 1,
          text: "This is amazing! WebSockets are truly powerful for real-time apps. 🚀",
          user: "Alice Johnson",
          time: "2 hours ago",
          likes: 12,
          dislikes: 0,
          replies: []
        },
        {
          id: 2,
          text: "Great explanation! Have you considered using Socket.io for fallback support?",
          user: "Bob Smith",
          time: "1 hour ago",
          likes: 8,
          dislikes: 1,
          replies: [
            {
              id: 101,
              text: "Yes, Socket.io is great, but native WebSockets are lighter if you don't need all the features.",
              user: "Dishant Savadia",
              time: "45 mins ago",
              likes: 5,
              dislikes: 0
            }
          ]
        },
        {
          id: 3,
          text: "Can you share the repo link? Would love to check out the code!",
          user: "Charlie",
          time: "30 mins ago",
          likes: 3,
          dislikes: 0,
          replies: []
        }
      ]
    }
  });
  const addComment = (postId, text, codeSnippet = null) => {
    setPosts(prev => {
      const existingPost = prev[postId] || { id: postId, comments: [] };
      return {
        ...prev,
        [postId]: {
          ...existingPost,
          comments: [
            ...existingPost.comments,
            {
              id: Date.now(),
              text,
              codeSnippet,
              user: "Guest",
              time: "just now",
              likes: 0,
              dislikes: 0,
              userVote: null,
              replies: []
            }
          ]
        }
      };
    });
  };

  /* 
   * Helper to update specific comment recursively 
   */
  const updateCommentVote = (comments, commentId, type) => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        let newLikes = comment.likes;
        let newDislikes = comment.dislikes;
        let newUserVote = comment.userVote;

        if (newUserVote === type) {
          // Toggle off
          if (type === 'up') newLikes--;
          else newDislikes--;
          newUserVote = null;
        } else if (newUserVote) {
          // Switch vote
          if (type === 'up') {
            newLikes++;
            newDislikes--;
          } else {
            newLikes--;
            newDislikes++;
          }
          newUserVote = type;
        } else {
          // Add vote
          if (type === 'up') newLikes++;
          else newDislikes++;
          newUserVote = type;
        }

        return {
          ...comment,
          likes: newLikes,
          dislikes: newDislikes,
          userVote: newUserVote
        };
      }

      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentVote(comment.replies, commentId, type)
        };
      }

      return comment;
    });
  };

  const likeComment = (postId, commentId, type) => {
    setPosts(prev => {
      const post = prev[postId];
      if (!post) return prev;

      return {
        ...prev,
        [postId]: {
          ...post,
          comments: updateCommentVote(post.comments, commentId, type)
        }
      };
    });
  };

  const addReply = (postId, commentId, text, codeSnippet = null) => {
    setPosts(prev => {
      const post = prev[postId];
      if (!post) return prev;

      const addReplyToComments = (comments) => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: Date.now(),
                  text,
                  codeSnippet,
                  user: "Guest",
                  time: "just now",
                  likes: 0,
                  dislikes: 0,
                  userVote: null,
                  replies: []
                }
              ]
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyToComments(comment.replies)
            };
          }
          return comment;
        });
      };

      return {
        ...prev,
        [postId]: {
          ...post,
          comments: addReplyToComments(post.comments)
        }
      };
    });
  };

  const getCommentCount = (postId) => {
    const post = posts[postId];
    if (!post || !post.comments) return 0;

    const countRecursive = (comments) => {
      let count = 0;
      comments.forEach(c => {
        count++;
        if (c.replies && c.replies.length > 0) {
          count += countRecursive(c.replies);
        }
      });
      return count;
    };

    return countRecursive(post.comments);
  };

  return (
    <CommentsContext.Provider value={{ posts, addComment, likeComment, addReply, getCommentCount }}>
      {children}
    </CommentsContext.Provider>
  );
}
export const useComments = () => useContext(CommentsContext);