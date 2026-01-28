import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            user: "Alice",
            avatar: "https://i.pravatar.cc/150?u=alice",
            type: "like",
            text: "liked your post 'Optimizing React Performance'",
            time: "2m ago",
            read: false,
        },
        {
            id: 2,
            user: "Bob",
            avatar: "https://i.pravatar.cc/150?u=bob",
            type: "comment",
            text: "commented on your query 'How to center a div?'",
            time: "1h ago",
            read: false,
        },
        {
            id: 3,
            user: "Charlie",
            avatar: "https://i.pravatar.cc/150?u=charlie",
            type: "follow",
            text: "started following you",
            time: "3h ago",
            read: true,
        },
        {
            id: 4,
            user: "David",
            avatar: "https://i.pravatar.cc/150?u=david",
            type: "reply",
            text: "replied to your comment",
            time: "5h ago",
            read: true,
        }
    ]);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
