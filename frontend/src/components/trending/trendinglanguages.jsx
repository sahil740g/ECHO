import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../context/postscontext';
import TrendingListModal from './trendinglistmodal';

const TrendingLanguages = () => {
    const { getTrendingTags } = usePosts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Get top 5 for sidebar
    const top5Tags = getTrendingTags(5);
    // Get top 10 for modal
    const top10Tags = getTrendingTags(10);

    // Simple hash function for consistent colors
    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    };

    const formatTags = (tags) => tags.map((tag, index) => ({
        ...tag,
        rank: index + 1,
        color: stringToColor(tag.name)
    }));

    const languages = formatTags(top5Tags);

    const handleTagClick = (tagName) => {
        navigate(`/trending?tag=${encodeURIComponent(tagName)}`);
    };

    return (
        <>
            <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-800 shadow-lg">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Flame className="w-5 h-5 text-orange-500 mr-2" /> Trending Technologies
                </h2>
                <div className="space-y-3">
                    {languages.length > 0 ? (
                        languages.map((lang, index) => (
                            <div
                                key={lang.name}
                                onClick={() => handleTagClick(lang.name)}
                                className="flex items-center justify-between group cursor-pointer p-1.5 rounded-lg hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-500 font-mono text-xs w-3">
                                        {index + 1}
                                    </span>
                                    <div
                                        className="w-1.5 h-6 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                        style={{ backgroundColor: lang.color }}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-semibold group-hover:text-blue-400 transition-colors">
                                            {lang.name}
                                        </span>
                                        <span className="text-[10px] text-gray-500">
                                            {lang.count}
                                        </span>
                                    </div>
                                </div>
                                {index < 3 && (
                                    <div className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        Hot
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-sm italic text-center py-4">
                            No trending topics yet
                        </div>
                    )}
                </div>
                {languages.length > 0 && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full mt-4 py-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors border-t border-gray-800"
                    >
                        View All
                    </button>
                )}
            </div>

            <TrendingListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tags={formatTags(top10Tags)}
            />
        </>
    );
};

export default TrendingLanguages;
