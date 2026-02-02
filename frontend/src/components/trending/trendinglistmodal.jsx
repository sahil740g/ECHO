import React from 'react';
import { X, Flame } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const TrendingListModal = ({ isOpen, onClose, tags }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleTagClick = (tagName) => {
        navigate(`/trending?tag=${encodeURIComponent(tagName)}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#161b22] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <Flame className="w-5 h-5 text-orange-500 mr-2" /> Top 10 Trending
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-1 p-4 space-y-3">
                    {tags && tags.length > 0 ? (
                        tags.map((tag, index) => (
                            <div
                                key={tag.name}
                                onClick={() => handleTagClick(tag.name)}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition group"
                            >
                                <div className="flex items-center space-x-4">
                                    <span className={`font-mono text-sm w-4 flex justify-center ${index < 3 ? 'text-orange-500 font-bold' : 'text-gray-500'}`}>
                                        {index + 1}
                                    </span>
                                    <div
                                        className="w-2 h-8 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                        style={{ backgroundColor: tag.color }}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-white text-base font-semibold group-hover:text-blue-400 transition-colors">
                                            {tag.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {tag.count}
                                        </span>
                                    </div>
                                </div>
                                {index < 3 && (
                                    <div className="text-[10px] font-bold px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                        HOT
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center text-zinc-500">
                            No trending topics yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrendingListModal;
