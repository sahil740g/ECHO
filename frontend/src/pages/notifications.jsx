import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Heart, MessageSquare, UserPlus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const { notifications, markAllAsRead } = useNotifications();
    const navigate = useNavigate();

    const getIcon = (type) => {
        switch (type) {
            case 'like': return <Heart size={16} className="text-red-500 fill-red-500" />;
            case 'comment': return <MessageSquare size={16} className="text-blue-500 fill-blue-500" />;
            case 'reply': return <MessageSquare size={16} className="text-blue-500 fill-blue-500" />;
            case 'follow': return <UserPlus size={16} className="text-green-500" />;
            default: return <div className="w-2 h-2 rounded-full bg-blue-500" />;
        }
    };

    return (
        <div className="max-w-2xl mx-auto min-h-screen md:border-x border-[#2F3336]">
            <div className="sticky top-16 z-10 bg-black/80 backdrop-blur-md border-b border-[#2F3336] p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">Notifications</h1>
                <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                >
                    Mark all as read
                </button>
            </div>

            <div className="divide-y divide-[#2F3336]">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 hover:bg-[#16181C] transition cursor-pointer flex gap-4 ${!notification.read ? 'bg-[#161b22]/50' : ''}`}
                            onClick={() => {
                                // Logic to navigate to post/profile could go here
                            }}
                        >
                            <div className="mt-1">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <img
                                        src={notification.avatar}
                                        alt={notification.user}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span className="font-bold text-white text-sm">{notification.user}</span>
                                    <span className="text-gray-500 text-xs ml-auto">{notification.time}</span>
                                </div>
                                <p className="text-zinc-300 text-sm">{notification.text}</p>
                            </div>
                            {!notification.read && (
                                <div className="self-center">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No notifications yet
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
