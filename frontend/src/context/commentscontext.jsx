import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./authcontext";
import { supabase } from "../lib/supabase";

const CommentsContext = createContext();

export function CommentsProvider({ children }) {
  const { user } = useAuth();
  const [commentsByPost, setCommentsByPost] = useState({});
  const [loadingPosts, setLoadingPosts] = useState({});

  // Fetch comments for a specific post
  // forceRefresh bypasses the loading check to handle cases where navigation interrupted a fetch
  const fetchComments = useCallback(
    async (postId, forceRefresh = false) => {
      if (loadingPosts[postId] && !forceRefresh) return;

      setLoadingPosts((prev) => ({ ...prev, [postId]: true }));

      try {
        const { data, error } = await supabase
          .from("comments")
          .select(
            `
          *,
          profiles:author_id (
            id,
            name,
            handle,
            avatar_url
          )
        `,
          )
          .eq("post_id", postId)
          .order("created_at", { ascending: true });

        if (error) throw error;

        // Build nested structure from flat data
        const commentsMap = {};
        const rootComments = [];

        data.forEach((comment) => {
          commentsMap[comment.id] = {
            id: comment.id,
            text: comment.text,
            codeSnippet: comment.code_snippet,
            language: comment.language,
            user: comment.profiles?.name || "Anonymous",
            avatar: comment.profiles?.avatar_url,
            authorId: comment.author_id,
            time: getRelativeTime(comment.created_at),
            likes: comment.likes || 0,
            dislikes: comment.dislikes || 0,
            userVote: null,
            parentId: comment.parent_id,
            replies: [],
          };
        });

        // Fetch user's votes if logged in
        if (user && data.length > 0) {
          const commentIds = data.map((c) => c.id);
          const { data: userVotes, error: votesError } = await supabase
            .from("comment_votes")
            .select("comment_id, vote_type")
            .eq("user_id", user.id)
            .in("comment_id", commentIds);

          if (!votesError && userVotes) {
            userVotes.forEach((vote) => {
              if (commentsMap[vote.comment_id]) {
                commentsMap[vote.comment_id].userVote = vote.vote_type;
              }
            });
          }
        }

        // Build tree
        Object.values(commentsMap).forEach((comment) => {
          if (comment.parentId && commentsMap[comment.parentId]) {
            commentsMap[comment.parentId].replies.push(comment);
          } else if (!comment.parentId) {
            rootComments.push(comment);
          }
        });

        setCommentsByPost((prev) => ({
          ...prev,
          [postId]: { id: postId, comments: rootComments },
        }));
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoadingPosts((prev) => ({ ...prev, [postId]: false }));
      }
    },
    [loadingPosts],
  );

  const addComment = async (
    postId,
    text,
    codeSnippet = null,
    language = null,
  ) => {
    if (!user) {
      console.error("Must be logged in to comment");
      return;
    }

    // Optimistic update
    const tempId = `temp_${Date.now()}`;
    const optimisticComment = {
      id: tempId,
      text,
      codeSnippet,
      language,
      user: user.name,
      avatar: user.avatar || user.avatar_url,
      authorId: user.id, // Added: maintain consistency with real comment structure
      time: "just now",
      likes: 0,
      dislikes: 0,
      userVote: null,
      replies: [],
    };

    setCommentsByPost((prev) => {
      const existing = prev[postId] || { id: postId, comments: [] };
      return {
        ...prev,
        [postId]: {
          ...existing,
          comments: [...existing.comments, optimisticComment],
        },
      };
    });

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          author_id: user.id,
          text,
          code_snippet: codeSnippet,
          language,
        })
        .select(
          `
          *,
          profiles:author_id (
            id,
            name,
            handle,
            avatar_url
          )
        `,
        )
        .single();

      if (error) throw error;

      // Replace optimistic with real
      setCommentsByPost((prev) => {
        const existing = prev[postId];
        if (!existing) return prev;

        return {
          ...prev,
          [postId]: {
            ...existing,
            comments: existing.comments.map((c) =>
              c.id === tempId
                ? {
                  id: data.id,
                  text: data.text,
                  codeSnippet: data.code_snippet,
                  language: data.language,
                  user: data.profiles?.name || user.name,
                  avatar: data.profiles?.avatar_url || user.avatar,
                  time: "just now",
                  likes: 0,
                  dislikes: 0,
                  userVote: null,
                  replies: [],
                }
                : c,
            ),
          },
        };
      });
      return { id: data.id, ...data };
    } catch (error) {
      console.error("Error adding comment:", error);
      // Remove optimistic on error
      setCommentsByPost((prev) => {
        const existing = prev[postId];
        if (!existing) return prev;
        return {
          ...prev,
          [postId]: {
            ...existing,
            comments: existing.comments.filter((c) => c.id !== tempId),
          },
        };
      });
      return null;
    }
  };

  const addReply = async (
    postId,
    parentCommentId,
    text,
    codeSnippet = null,
    language = null,
  ) => {
    if (!user) {
      console.error("Must be logged in to reply");
      return;
    }

    const tempId = `temp_${Date.now()}`;
    const optimisticReply = {
      id: tempId,
      text,
      codeSnippet,
      language,
      user: user.name,
      avatar: user.avatar || user.avatar_url,
      authorId: user.id, // Added: maintain consistency with real comment structure
      time: "just now",
      likes: 0,
      dislikes: 0,
      userVote: null,
      replies: [],
    };

    // Optimistic update
    const addReplyToComments = (comments) => {
      return comments.map((comment) => {
        if (comment.id === parentCommentId) {
          return { ...comment, replies: [...comment.replies, optimisticReply] };
        }
        if (comment.replies?.length > 0) {
          return { ...comment, replies: addReplyToComments(comment.replies) };
        }
        return comment;
      });
    };

    setCommentsByPost((prev) => {
      const existing = prev[postId];
      if (!existing) return prev;
      return {
        ...prev,
        [postId]: {
          ...existing,
          comments: addReplyToComments(existing.comments),
        },
      };
    });

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          author_id: user.id,
          parent_id: parentCommentId,
          text,
          code_snippet: codeSnippet,
          language,
        })
        .select()
        .single();

      if (error) throw error;

      // Replace temp with real ID
      const replaceTemp = (comments) => {
        return comments.map((comment) => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: comment.replies.map((r) =>
                r.id === tempId ? { ...r, id: data.id } : r,
              ),
            };
          }
          if (comment.replies?.length > 0) {
            return { ...comment, replies: replaceTemp(comment.replies) };
          }
          return comment;
        });
      };

      setCommentsByPost((prev) => {
        const existing = prev[postId];
        if (!existing) return prev;
        return {
          ...prev,
          [postId]: {
            ...existing,
            comments: replaceTemp(existing.comments),
          },
        };
      });
      return { id: data.id, ...data };
    } catch (error) {
      console.error("Error adding reply:", error);
      // Revert on error
      fetchComments(postId);
      return null;
    }
  };

  const likeComment = async (postId, commentId, type) => {
    if (!user) {
      console.error("Must be logged in to vote on comments");
      return;
    }

    // Optimistic update - update local state immediately
    const updateVote = (comments) => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          let newLikes = comment.likes;
          let newDislikes = comment.dislikes;
          let newUserVote = comment.userVote;

          if (newUserVote === type) {
            // Remove vote
            if (type === "up") newLikes--;
            else newDislikes--;
            newUserVote = null;
          } else if (newUserVote) {
            // Change vote
            if (type === "up") {
              newLikes++;
              newDislikes--;
            } else {
              newLikes--;
              newDislikes++;
            }
            newUserVote = type;
          } else {
            // New vote
            if (type === "up") newLikes++;
            else newDislikes++;
            newUserVote = type;
          }

          return {
            ...comment,
            likes: Math.max(0, newLikes),
            dislikes: Math.max(0, newDislikes),
            userVote: newUserVote,
          };
        }
        if (comment.replies?.length > 0) {
          return { ...comment, replies: updateVote(comment.replies) };
        }
        return comment;
      });
    };

    // Apply optimistic update
    setCommentsByPost((prev) => {
      const existing = prev[postId];
      if (!existing) return prev;
      return {
        ...prev,
        [postId]: {
          ...existing,
          comments: updateVote(existing.comments),
        },
      };
    });

    // Persist to database
    try {
      const { data: existingVote, error: fetchError } = await supabase
        .from("comment_votes")
        .select("*")
        .eq("user_id", user.id)
        .eq("comment_id", commentId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingVote?.vote_type === type) {
        // Remove vote
        const { error: deleteError } = await supabase
          .from("comment_votes")
          .delete()
          .eq("user_id", user.id)
          .eq("comment_id", commentId);

        if (deleteError) throw deleteError;

        // Update comment count
        const { error: rpcError } = await supabase.rpc("decrement_comment_vote", {
          comment_id: commentId,
          vote_type: type,
        });

        if (rpcError) throw rpcError;
      } else if (existingVote) {
        // Change vote
        const { error: updateError } = await supabase
          .from("comment_votes")
          .update({ vote_type: type })
          .eq("user_id", user.id)
          .eq("comment_id", commentId);

        if (updateError) throw updateError;

        // Update counts (decrement old, increment new)
        const { error: rpcError } = await supabase.rpc("toggle_comment_vote", {
          comment_id: commentId,
          old_type: existingVote.vote_type,
          new_type: type,
        });

        if (rpcError) throw rpcError;
      } else {
        // New vote
        const { error: insertError } = await supabase
          .from("comment_votes")
          .insert({
            user_id: user.id,
            comment_id: commentId,
            vote_type: type,
          });

        if (insertError) throw insertError;

        // Increment count
        const { error: rpcError } = await supabase.rpc("increment_comment_vote", {
          comment_id: commentId,
          vote_type: type,
        });

        if (rpcError) throw rpcError;
      }
    } catch (error) {
      console.error("Error updating comment vote:", error);
      // Revert optimistic update on error
      fetchComments(postId);
    }
  };

  const getCommentCount = (postId) => {
    const post = commentsByPost[postId];
    if (!post?.comments) return 0;

    const countRecursive = (comments) => {
      let count = 0;
      comments.forEach((c) => {
        count++;
        if (c.replies?.length > 0) {
          count += countRecursive(c.replies);
        }
      });
      return count;
    };

    return countRecursive(post.comments);
  };

  return (
    <CommentsContext.Provider
      value={{
        posts: commentsByPost,
        addComment,
        likeComment,
        addReply,
        getCommentCount,
        fetchComments,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
}

function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export const useComments = () => useContext(CommentsContext);
