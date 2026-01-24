import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Plus, Trophy, Share2, MapPin, Link as LinkIcon, Calendar, X, Github, Linkedin, Instagram, Tag } from "lucide-react";
import { useAuth } from "../context/authcontext";
import { usePosts } from "../context/postscontext";
import PostCard from "../components/postcard/postcard";

import EditProfileModal from "../components/profile/editprofilemodal";

function Profile() {
    const { user, updateUser } = useAuth();
    const { posts } = usePosts();
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

    const savedPostsIds = user?.savedPosts || [];
    const savedPosts = posts.filter(post => savedPostsIds.includes(post.id));

    // Mock data for display since user object is minimal
    const profileData = {
        name: user?.name || "Dishant Savadia",
        handle: user?.handle || "@dishantsav123",
        bio: user?.bio || "Full Stack Developer 👨‍💻 | React, Node.js, Python | Building cool stuff 🚀 | Open Source Enthusiast",
        location: user?.location || "Mumbai, India",
        website: user?.website || "portfolio.dev",
        avatar: user?.avatar,
        coverImage: user?.coverImage || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80",
        joinDate: "January 2024",
        socials: user?.socials || {}, // fallback to empty object
        stats: {
            followers: 1240,
            following: 56,
            posts: 42
        },
        achievements: [
            { icon: <Trophy className="text-yellow-500" size={20} />, title: "Top Contributor", desc: "Top 1% in Jan" },
            { icon: <Share2 className="text-blue-500" size={20} />, title: "Viral Post", desc: "Post reached 10k views" },
            { icon: <Edit2 className="text-green-500" size={20} />, title: "Writer", desc: "Published 10+ articles" },
        ]
    };

    const handleSaveProfile = (updatedData) => {
        updateUser(updatedData);
        setIsEditModalOpen(false);
    };

    const [activeTab, setActiveTab] = React.useState('posts');

    // Mock posts data
    const mockPosts = Array(6).fill(null).map((_, i) => ({
        id: i,
        image: `https://picsum.photos/seed/${i + 10}/400/400`,
        likes: 120 + i * 5,
        comments: 20 + i
    }));

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/feed");
        }
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pt-6">
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={profileData}
                onSave={handleSaveProfile}
            />
            {/* Cover Image */}
            <div className="h-48 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 mb-8 overflow-hidden relative group">
                <img
                    src={profileData.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-700"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                {/* Main Content */}
                <div className="flex-1">
                    {/* Header - Minimalist */}
                    <div className="mb-12">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0">
                            <div className="flex gap-4 md:gap-6 items-start w-full md:w-auto">
                                <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-full bg-zinc-800 overflow-hidden relative group">
                                    {profileData.avatar ? (
                                        <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-3xl font-bold text-white">
                                            {profileData.name[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-1 md:pt-2 flex-1">
                                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">{profileData.name}</h1>
                                    <p className="text-zinc-500 text-sm mb-3 md:mb-4">{profileData.handle}</p>

                                    <div className="flex gap-4 md:gap-6 text-sm">
                                        <div className="text-zinc-300"><span className="font-bold text-white">{profileData.stats.posts}</span> posts</div>
                                        <div className="text-zinc-300"><span className="font-bold text-white">{profileData.stats.followers}</span> followers</div>
                                        <div className="text-zinc-300"><span className="font-bold text-white">{profileData.stats.following}</span> following</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full md:w-auto px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition mt-4 md:mt-0"
                            >
                                Edit profile
                            </button>
                        </div>

                        <div className="mt-8">
                            <p className="text-zinc-300 leading-relaxed max-w-lg">
                                {profileData.bio}
                            </p>

                            <div className="flex gap-6 mt-4 text-sm text-zinc-500">
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} />
                                    {profileData.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <LinkIcon size={14} />
                                    <a
                                        href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition"
                                    >
                                        {profileData.website}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Tabs */}
                    <div className="border-t border-zinc-800">
                        <div className="flex justify-center gap-12 text-xs font-medium tracking-wider uppercase text-zinc-500 mb-8">
                            {['posts', 'saved', 'tagged'].map((tab) => (
                                <div
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 cursor-pointer transition relative ${activeTab === tab ? 'text-white' : 'hover:text-zinc-300'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'posts' ? (
                            <div className="grid grid-cols-1 gap-6">
                                {posts.map((post) => (
                                    <PostCard key={post.id} {...post} />
                                ))}
                            </div>
                        ) : activeTab === 'saved' ? (
                            <div className="space-y-6">
                                {savedPosts.length > 0 ? (
                                    savedPosts.map(post => (
                                        <PostCard key={post.id} {...post} />
                                    ))
                                ) : (
                                    <div className="py-20 text-center">
                                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500">
                                            <Share2 size={24} />
                                        </div>
                                        <h3 className="text-white font-bold mb-2">No saved posts</h3>
                                        <p className="text-zinc-500 text-sm">Posts you bookmark will appear here</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500">
                                    <Tag size={24} />
                                </div>
                                <h3 className="text-white font-bold mb-2">No tagged posts</h3>
                                <p className="text-zinc-500 text-sm">Posts you are tagged in will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Minimalist */}
                <div className="w-72 flex flex-col gap-10 pt-2">
                    {/* Achievements */}
                    <div>
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-5">Achievements</h3>
                        <div className="space-y-5">
                            {profileData.achievements.map((ach, i) => (
                                <div key={i} className="flex gap-3 items-center group cursor-pointer">
                                    <div className="text-zinc-400 group-hover:text-white transition">
                                        {ach.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-zinc-200 text-sm font-medium">{ach.title}</h4>
                                        <p className="text-zinc-500 text-xs mt-0.5">{ach.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">On the web</h3>
                        </div>

                        <div className="space-y-4">
                            {profileData.socials.x && (
                                <a href={profileData.socials.x} className="flex items-center gap-3 text-zinc-400 hover:text-white transition text-sm">
                                    <X size={16} />
                                    X
                                </a>
                            )}
                            {profileData.socials.github && (
                                <a href={profileData.socials.github} className="flex items-center gap-3 text-zinc-400 hover:text-white transition text-sm">
                                    <Github size={16} />
                                    GitHub
                                </a>
                            )}
                            {profileData.socials.linkedin && (
                                <a href={profileData.socials.linkedin} className="flex items-center gap-3 text-zinc-400 hover:text-white transition text-sm">
                                    <Linkedin size={16} />
                                    LinkedIn
                                </a>
                            )}
                            {profileData.socials.instagram && (
                                <a href={profileData.socials.instagram} className="flex items-center gap-3 text-zinc-400 hover:text-white transition text-sm">
                                    <Instagram size={16} />
                                    Instagram
                                </a>
                            )}

                            {!profileData.socials.x && !profileData.socials.github && !profileData.socials.linkedin && !profileData.socials.instagram && (
                                <div className="text-zinc-500 text-sm italic">
                                    No links added
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="mt-6 text-sm text-zinc-500 hover:text-zinc-300 transition flex items-center gap-2"
                        >
                            <Plus size={14} />
                            Add link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
