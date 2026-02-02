import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./authcontext";
import { useNotifications } from "./NotificationContext";

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const { user } = useAuth();
  const { createNotification } = useNotifications();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from Supabase on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Create a promise that rejects after 5 seconds to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 5000)
      );

      const fetchPromise = supabase
        .from("posts")
        .select(
          `
                    *,
                    profiles:author_id (
                        id,
                        name,
                        handle,
                        avatar_url
                    ),
                    comments (count)
                `,
        )
        .order("created_at", { ascending: false });

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error) throw error;

      // Fetch user's votes if logged in
      let userVotesMap = {};
      if (user) {
        const { data: votesData } = await supabase
          .from("votes")
          .select("post_id, vote_type")
          .eq("user_id", user.id);

        if (votesData) {
          votesData.forEach(v => {
            userVotesMap[v.post_id] = v.vote_type;
          });
        }
      }

      // Transform data to match frontend structure
      const transformedPosts = data.map((post) => ({
        id: post.id,
        votes: post.votes || 0,
        username: post.profiles?.name || "Anonymous",
        handle: post.profiles?.handle || "@anonymous",
        avatar: post.profiles?.avatar_url,
        authorId: post.author_id,
        time: getRelativeTime(post.created_at),
        title: post.title,
        description: post.description,
        tags: post.tags || [],
        commentsCount: post.comments?.[0]?.count || 0, // Extract count from response
        codeSnippet: post.code_snippet,
        type: post.type || "post",
        userVote: userVotesMap[post.id] || null, // Set correct user vote
      }));

      setPosts(transformedPosts);

      // Fetch user's votes if logged in
      if (user) {
        await fetchUserVotes(transformedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Ensure we don't leave the user with nothing if it was just a timeout
      // setPosts([]); // Optional: clear posts or keep empty
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async (postsData) => {
    if (!user) return;
    try {
      const { data: votes, error } = await supabase
        .from("votes")
        .select("post_id, vote_type")
        .eq("user_id", user.id);

      if (error) throw error;

      const voteMap = {};
      votes?.forEach((v) => {
        voteMap[v.post_id] = v.vote_type;
      });

      setPosts((prev) =>
        prev.map((post) => ({
          ...post,
          userVote: voteMap[post.id] || null,
        })),
      );
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  };

  // Re-fetch votes when user changes
  useEffect(() => {
    if (user && posts.length > 0) {
      fetchUserVotes(posts);
    }
  }, [user]);

  const addPost = async (newPost) => {
    if (!user) {
      console.error("Must be logged in to create a post");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          author_id: user.id,
          title: newPost.title,
          description: newPost.description,
          code_snippet: newPost.codeSnippet,
          tags: newPost.tags || [],
          type: newPost.type || "post",
          votes: 0,
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

      const post = {
        id: data.id,
        votes: 0,
        username: data.profiles?.name || user.name,
        handle: data.profiles?.handle || user.handle,
        avatar: data.profiles?.avatar_url || user.avatar,
        authorId: data.author_id,
        time: "Just now",
        title: data.title,
        description: data.description,
        tags: data.tags || [],
        commentsCount: 0,
        codeSnippet: data.code_snippet,
        type: data.type,
        userVote: null,
      };

      setPosts((prev) => [post, ...prev]);
      return post;
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post: " + error.message);
      return null;
    }
  };

  const votePost = async (postId, type) => {
    if (!user) {
      console.error("Must be logged in to vote");
      return;
    }

    // Optimistic update
    let finalVoteCount = 0; // To capture the calculated value

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          let newVoteCount = post.votes;
          let newUserVote = post.userVote;

          if (newUserVote === type) {
            newVoteCount = type === "up" ? newVoteCount - 1 : newVoteCount + 1;
            newUserVote = null;
          } else if (!newUserVote) {
            newVoteCount = type === "up" ? newVoteCount + 1 : newVoteCount - 1;
            newUserVote = type;
          } else {
            newVoteCount = type === "up" ? newVoteCount + 2 : newVoteCount - 2;
            newUserVote = type;
          }

          // Clamp vote count to 0 to ensure no negative numbers are stored or displayed
          newVoteCount = Math.max(0, newVoteCount);

          finalVoteCount = newVoteCount; // Capture for server update
          return { ...post, votes: newVoteCount, userVote: newUserVote };
        }
        return post;
      }),
    );

    try {
      const post = posts.find((p) => p.id === postId);
      const currentVote = post?.userVote;

      if (currentVote === type) {
        // Remove vote
        await supabase
          .from("votes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);
      } else if (!currentVote) {
        // New vote
        await supabase
          .from("votes")
          .insert({ user_id: user.id, post_id: postId, vote_type: type });
      } else {
        // Update vote
        await supabase
          .from("votes")
          .update({ vote_type: type })
          .eq("user_id", user.id)
          .eq("post_id", postId);
      }

      // Update post votes count with the CALCULATED value from optimistic update
      // We rely on finalVoteCount which was captured from the robust prevPosts logic
      await supabase.from("posts").update({ votes: finalVoteCount }).eq("id", postId);

      // Notification for Like
      if (type === "up" && (!currentVote || currentVote !== "up") && user.id !== post.authorId) {
        createNotification({
          userId: post.authorId,
          type: "like",
          actorId: user.id,
          postId: postId
        });
      }

    } catch (error) {
      console.error("Error voting:", error);
      // Revert on error
      fetchPosts();
    }
  };

  const getTrendingTags = (limit = 5) => {
    const tagCounts = {};

    posts.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          const normalizedTag = tag.trim();
          tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
        });
      }
    });

    const sortedTags = Object.entries(tagCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, limit)
      .map(([name, count]) => ({
        name,
        count: `${count} posts`,
      }));

    return sortedTags;
  };

  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    totalPosts: 0,
  });

  const fetchStats = async () => {
    try {
      const [
        { count: postsCount, error: postsError },
        { count: usersCount, error: usersError }
      ] = await Promise.all([
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true })
      ]);

      if (postsError) throw postsError;
      if (usersError) throw usersError;

      // Heuristic for online users (random variation for liveness effect)
      // Base it on total users to seem realistic: ~15-20% online
      const onlineCount = Math.floor(usersCount * (0.15 + Math.random() * 0.05)) + 1;

      setStats({
        totalUsers: usersCount || 0,
        onlineUsers: onlineCount,
        totalPosts: postsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats every 2 minutes
    const interval = setInterval(fetchStats, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        addPost,
        votePost,
        getTrendingTags,
        stats,
        refetchPosts: fetchPosts,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

// Helper function
function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export const usePosts = () => useContext(PostsContext);
