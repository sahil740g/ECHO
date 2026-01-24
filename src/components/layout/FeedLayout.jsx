import React from 'react';
import CommunityStats from "../stats/communitystats";
import TrendingLanguages from "../trending/trendinglanguages";

const FeedLayout = ({ children, title, showSidebar = true }) => {
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            {/* 3 Column Grid System - 2/3 Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content Area - Always occupies exactly 2 columns (66%) */}
                <div className="lg:col-span-2 space-y-4 w-full">
                    {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}
                    {children}
                </div>

                {/* Sidebar Area - Always occupies exactly 1 column (33%) */}
                {/* Even if empty, it preserves the grid structure for consistency */}
                <div className="hidden lg:block">
                    {showSidebar ? (
                        <div className="space-y-6 sticky top-24 h-fit">
                            <CommunityStats />
                            <TrendingLanguages />
                        </div>
                    ) : (
                        <div className="h-full w-full">
                            {/* Empty spacer to maintain 2/3 layout */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedLayout;
