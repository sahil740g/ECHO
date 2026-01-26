import React from 'react';
import { BarChart2 } from 'lucide-react';
import { usePosts } from '../../context/postscontext';

const CommunityStats = () => {
    const context = usePosts();

    if (!context || !context.getCommunityStats) {
        return null; // Fail silently if context is missing to prevent crashes
    }

    const { getCommunityStats } = context;

    let stats;
    try {
        stats = getCommunityStats();
    } catch (error) {
        console.error("CommunityStats Error:", error);
        return null;
    }

    if (!stats) return null;

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num;
    };

    return (
        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-800 shadow-lg mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <BarChart2 className="w-5 h-5 text-blue-400 mr-2" /> Community Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-lg text-center">
                    <span className="block text-2xl font-bold text-blue-400">
                        {formatNumber(stats.totalUsers)}
                    </span>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Users</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-center">
                    <span className="block text-2xl font-bold text-green-400">
                        {formatNumber(stats.onlineUsers)}
                    </span>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Online Now</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-center col-span-2">
                    <span className="block text-2xl font-bold text-purple-400">
                        {stats.totalPosts.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Posts Shared</span>
                </div>
            </div>
        </div>
    );
};

export default CommunityStats;
