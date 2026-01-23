import CommunityStats from "../components/stats/communitystats";
import TrendingLanguages from "../components/trending/trendinglanguages";

export default function Trending() {
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h1 className="text-2xl font-bold mb-4">Trending</h1>
                    {/* Placeholder for Trending page content */}
                    <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800 text-gray-400 text-center">
                        <p>Trending content goes here</p>
                    </div>
                </div>
                <div className="hidden lg:block space-y-6 sticky top-24 h-fit">
                    <CommunityStats />
                    <TrendingLanguages />
                </div>
            </div>
        </div>
    );
}