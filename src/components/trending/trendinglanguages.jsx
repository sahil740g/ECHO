import React from 'react';
import { Flame } from 'lucide-react';

const TrendingLanguages = () => {
    const languages = [
        { name: 'JavaScript', count: '120k posts', rank: 1, color: '#F7DF1E' },
        { name: 'Python', count: '98k posts', rank: 2, color: '#3776AB' },
        { name: 'Rust', count: '45k posts', rank: 3, color: '#DEA584' },
        { name: 'TypeScript', count: '38k posts', rank: 4, color: '#3178C6' },
        { name: 'Go', count: '25k posts', rank: 5, color: '#00ADD8' },
    ];

    return (
        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-800 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <Flame className="w-5 h-5 text-orange-500 mr-2" /> Trending Languages
            </h2>
            <div className="space-y-3">
                {languages.map((lang, index) => (
                    <div
                        key={lang.name}
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
                ))}
            </div>
            <button className="w-full mt-4 py-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors border-t border-gray-800">
                View All
            </button>
        </div>
    );
};

export default TrendingLanguages;
