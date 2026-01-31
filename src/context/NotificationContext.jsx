import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./authcontext";
import { supabase } from "../lib/supabase";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
                    *,
                    actor:actor_id (
                        id,
                        name,
                        handle,
                        avatar_url
                    ),
                    post:post_id (
                        id,
                        description
                    )
                `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      const transformed = data.map((n) => ({
        id: n.id,
        user: n.actor?.name || "Someone",
        avatar:
          n.actor?.avatar_url ||
          `https://ui-avatars.com/api/?name=${n.actor?.name || "U"}&background=random`,
        type: n.type,
        text: getNotificationText(n),
        time: formatTimeAgo(n.created_at),
        read: n.read,
        postId: n.post_id,
      }));

      setNotifications(transformed);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Generate notification text based on type
  const getNotificationText = (notification) => {
    switch (notification.type) {
      case "like":
        return `liked your post`;
      case "comment":
        return `commented on your post`;
      case "reply":
        return `replied to your comment`;
      case "follow":
        return `started following you`;
      case "mention":
        return `mentioned you in a post`;
      default:
        return `interacted with you`;
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchNotifications]);

  const markAllAsRead = async () => {
    if (!user) return;

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      // Revert on error
      fetchNotifications();
    }
  };

  const markAsRead = async (notificationId) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Helper to create notifications (used by other contexts)
  const createNotification = async ({
    userId,
    type,
    actorId,
    postId,
    commentId,
  }) => {
    // Don't notify yourself
    if (userId === actorId) return;

    try {
      const { error } = await supabase.from("notifications").insert({
        user_id: userId,
        type,
        actor_id: actorId,
        post_id: postId,
        comment_id: commentId,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAllAsRead,
        markAsRead,
        createNotification,
        refetch: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
