import React from 'react';
import { BarChart2 } from 'lucide-react';

const CommunityStats = () => {
    return (
        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-800 shadow-lg mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <BarChart2 className="w-5 h-5 text-blue-400 mr-2" /> Community Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-lg text-center">
                    <span className="block text-2xl font-bold text-blue-400">12.5k</span>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Users</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-center">
                    <span className="block text-2xl font-bold text-green-400">1.2k</span>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Online Now</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-center col-span-2">
                    <span className="block text-2xl font-bold text-purple-400">85,420</span>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Posts Shared</span>
                </div>
            </div>
        </div>
    );
};

export default CommunityStats;
