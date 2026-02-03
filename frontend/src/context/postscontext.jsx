import { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./authcontext";
import { useNotifications } from "./NotificationContext";
import { socket } from "../lib/socket";

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const { user } = useAuth();
  const { createNotification } = useNotifications();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track pending vote requests to prevent race conditions
  const pendingVotes = useRef(new Set());

  // Fetch posts from Supabase on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Real-time subscription for vote updates
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          console.log('[REALTIME] Post updated:', payload.new);
          // Update the specific post with new vote count
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === payload.new.id
                ? { ...post, votes: payload.new.votes }
                : post
            )
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

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
      // Note: User votes are already mapped above in lines 48-58, no need to fetch again
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

    // Prevent race conditions: Skip if there's already a pending vote for this post
    const voteKey = `${postId}-${user.id}`;
    if (pendingVotes.current.has(voteKey)) {
      console.warn(`Vote already in progress for post ${postId}, skipping...`);
      return;
    }

    // Mark this vote as pending
    pendingVotes.current.add(voteKey);

    // IMPORTANT: Capture current state BEFORE optimistic update to avoid stale closure
    const post = posts.find((p) => p.id === postId);
    if (!post) {
      pendingVotes.current.delete(voteKey);
      console.error(`Post ${postId} not found`);
      return;
    }

    const currentVote = post.userVote;
    const currentAuthorId = post.authorId;
    const previousVoteCount = post.votes;

    // Optimistic update
    let finalVoteCount = 0; // To capture the calculated value (for database)
    let newUserVote = null;

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          let newVoteCount = p.votes;
          let calculatedUserVote = p.userVote;

          if (calculatedUserVote === type) {
            // Removing vote
            newVoteCount = type === "up" ? newVoteCount - 1 : newVoteCount + 1;
            calculatedUserVote = null;
          } else if (!calculatedUserVote) {
            // Adding new vote
            newVoteCount = type === "up" ? newVoteCount + 1 : newVoteCount - 1;
            calculatedUserVote = type;
          } else {
            // Switching votes (up to down or down to up)
            newVoteCount = type === "up" ? newVoteCount + 2 : newVoteCount - 2;
            calculatedUserVote = type;
          }

          // Save accurate count for database and display (can be negative)
          finalVoteCount = newVoteCount;
          newUserVote = calculatedUserVote;

          return { ...p, votes: newVoteCount, userVote: calculatedUserVote };
        }
        return p;
      }),
    );

    try {
      console.log(`[VOTE] Processing ${type} vote for post ${postId}`, {
        currentVote,
        previousCount: previousVoteCount,
        newCount: finalVoteCount,
        newUserVote
      });

      if (currentVote === type) {
        // Remove vote
        const { error } = await supabase
          .from("votes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);

        if (error) throw error;
        console.log(`[VOTE] Successfully removed ${type} vote from post ${postId}`);
      } else if (!currentVote) {
        // New vote
        const { error } = await supabase
          .from("votes")
          .insert({ user_id: user.id, post_id: postId, vote_type: type });

        if (error) throw error;
        console.log(`[VOTE] Successfully added ${type} vote to post ${postId}`);
      } else {
        // Update vote
        const { error } = await supabase
          .from("votes")
          .update({ vote_type: type })
          .eq("user_id", user.id)
          .eq("post_id", postId);

        if (error) throw error;
        console.log(`[VOTE] Successfully changed vote from ${currentVote} to ${type} on post ${postId}`);
      }

      // Update post votes count with the CALCULATED value from optimistic update
      const { error: updateError } = await supabase
        .from("posts")
        .update({ votes: finalVoteCount })
        .eq("id", postId);

      if (updateError) throw updateError;
      console.log(`[VOTE] Successfully updated post vote count to ${finalVoteCount}`);

      // Notification for Like (using captured currentAuthorId to avoid stale closure)
      if (type === "up" && (!currentVote || currentVote !== "up") && user.id !== currentAuthorId) {
        createNotification({
          userId: currentAuthorId,
          type: "like",
          actorId: user.id,
          postId: postId
        });
      }

    } catch (error) {
      console.error(`[VOTE ERROR] Failed to record vote for post ${postId}:`, error);

      // Improved error handling: Revert ONLY the affected post, not entire list
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? { ...p, votes: previousVoteCount, userVote: currentVote }
            : p
        )
      );

      // Optional: Show user-friendly error (could integrate with toast notifications)
      console.warn("Vote failed - state reverted. Please try again.");
    } finally {
      // Always remove from pending votes
      pendingVotes.current.delete(voteKey);
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

      // Get real online count from Socket.io backend
      socket.emit('stats:request');

      setStats(prev => ({
        ...prev,
        totalUsers: usersCount || 0,
        totalPosts: postsCount || 0,
      }));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();

    // Listen for real-time stats updates from Socket.io
    socket.on('stats:response', (data) => {
      console.log('[STATS] Received online count:', data.onlineUsers);
      setStats(prev => ({
        ...prev,
        onlineUsers: data.onlineUsers || 0
      }));
    });

    // Refresh stats every 2 minutes
    const interval = setInterval(fetchStats, 120000);

    return () => {
      clearInterval(interval);
      socket.off('stats:response');
    };
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
