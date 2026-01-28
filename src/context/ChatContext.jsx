import { createContext, useContext, useState, useEffect } from "react";
import { mockChats } from "../data/mockChats";
import { useAuth } from "./authcontext";

const ChatContext = createContext({});

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);

    useEffect(() => {
        // In a real app, we would fetch chats for the logged-in user
        // For now, we utilize the mock data
        setChats(mockChats);
    }, []);

    const activeChat = chats.find((c) => c.id === activeChatId);

    const sendMessage = (chatId, text) => {
        // if (!user) return; // Removed to allow fallback to "curr_user" for demo


        const newMessage = {
            id: `msg_${Date.now()}`,
            senderId: user?.id || "curr_user", // Fallback for safety
            text,
            timestamp: new Date().toISOString(),
        };

        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.id === chatId
                    ? { ...chat, messages: [...chat.messages, newMessage] }
                    : chat
            )
        );
    };

    const selectChat = (chatId) => {
        setActiveChatId(chatId);
    }

    const getOrCreateChat = (participantHandle) => {
        // Check if chat already exists
        const existingChat = chats.find(chat =>
            chat.participants.includes(participantHandle) &&
            chat.participants.includes(user?.id || "curr_user")
        );

        if (existingChat) {
            return existingChat;
        }

        // Create new chat
        const newChat = {
            id: `chat_${Date.now()}`,
            participants: [user?.id || "curr_user", participantHandle],
            messages: []
        };

        setChats(prev => [...prev, newChat]);
        return newChat;
    };

    return (
        <ChatContext.Provider
            value={{
                chats,
                activeChatId,
                activeChat,
                selectChat,
                activeChat,
                selectChat,
                sendMessage,
                getOrCreateChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
