import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit2, Plus, Trophy, Share2, MapPin, Link as LinkIcon, Calendar, X, Github, Linkedin, Instagram, Tag, UserCircle, MessageSquare } from "lucide-react";
import { useAuth } from "../context/authcontext";
import { useChat } from "../context/ChatContext";

import { usePosts } from "../context/postscontext";
import { useComments } from "../context/commentscontext";
import PostCard from "../components/postcard/postcard";
import { mockUsers } from "../data/mockUsers";

import EditProfileModal from "../components/profile/editprofilemodal";
import UserListModal from "../components/profile/userlistmodal";

function Profile() {
    const { username } = useParams();
    const { user, updateUser, toggleFollow, openLoginModal } = useAuth();
    const { posts } = usePosts();
    const { posts: commentsData } = useComments();
    const { getOrCreateChat, selectChat } = useChat();
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    // Initialize state properly inside useEffect or use derived state
    const [isFollowing, setIsFollowing] = React.useState(false);

    // Modal State
    const [isUserListModalOpen, setIsUserListModalOpen] = React.useState(false);
    const [userListTitle, setUserListTitle] = React.useState("");
    const [userListUsers, setUserListUsers] = React.useState([]);

    const navigate = useNavigate();

    // Determine which user to display
    let displayUser;
    let isOwnProfile = false;

    if (!username) {
        // No username param -> My Profile
        displayUser = user;
        isOwnProfile = true;
    } else {
        // Check if param matches logged-in user's handle (without @)
        const myHandle = user?.handle?.replace('@', '');
        if (myHandle === username) {
            displayUser = user;
            isOwnProfile = true;
        } else {
            // Look up in mockUsers
            displayUser = mockUsers.find(u => u.handle.replace('@', '') === username);
        }
    }

    const savedPostsIds = displayUser?.savedPosts || [];
    const savedPosts = posts.filter(post => savedPostsIds.includes(post.id));
    const userPosts = displayUser ? posts.filter(post => post.handle.toLowerCase() === displayUser.handle.toLowerCase()) : [];

    const taggedPosts = displayUser ? posts.filter(post => {
        const handle = displayUser.handle.toLowerCase();
        // Check description
        if (post.description && post.description.toLowerCase().includes(handle)) return true;

        // Check comments
        const postCommentsData = commentsData[post.id];
        if (postCommentsData && postCommentsData.comments) {
            const checkComments = (comments) => {
                for (const c of comments) {
                    if (c.text.toLowerCase().includes(handle)) return true;
                    if (c.replies && checkComments(c.replies)) return true;
                }
                return false;
            };
            if (checkComments(postCommentsData.comments)) return true;
        }
        return false;
    }) : [];

    // Consolidate profile data
    const profileData = displayUser ? {
        name: displayUser.name,
        handle: displayUser.handle,
        bio: displayUser.bio || "Full Stack Developer 👨‍💻 | React, Node.js, Python | Building cool stuff 🚀 | Open Source Enthusiast",
        location: displayUser.location || "Mumbai, India",
        website: displayUser.website || "portfolio.dev",
        avatar: displayUser.avatar,
        coverImage: displayUser.coverImage || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80",
        joinDate: displayUser.joinDate || "January 2024",
        socials: displayUser.socials || {},
        stats: displayUser.stats || { followers: 1240, following: 56, posts: 42 },
        achievements: displayUser.achievements || [
            { icon: <Trophy className="text-yellow-500" size={20} />, title: "Top Contributor", desc: "Top 1% in Jan" },
            { icon: <Share2 className="text-blue-500" size={20} />, title: "Viral Post", desc: "Post reached 10k views" },
            { icon: <Edit2 className="text-green-500" size={20} />, title: "Writer", desc: "Published 10+ articles" },
        ]
    } : null;


    const handleSaveProfile = (updatedData) => {
        updateUser(updatedData);
        setIsEditModalOpen(false);
    };

    const handleFollowToggle = () => {
        if (!user) {
            openLoginModal();
            return;
        }
        if (!displayUser) return;
        toggleFollow(displayUser.handle);
        setIsFollowing(!isFollowing);
    };

    const handleMessage = () => {
        if (!user) {
            openLoginModal();
            return;
        }
        if (!displayUser) return;

        const chat = getOrCreateChat(displayUser.handle);
        // selectChat(chat.id); // No longer needed as we navigate directly
        navigate(`/chat/${chat.id}`);
    };

    // Update local state when user or displayUser changes
    useEffect(() => {
        if (user && displayUser) {
            setIsFollowing(user.following?.includes(displayUser.handle));
        }
    }, [user, displayUser]);

    const [activeTab, setActiveTab] = React.useState('posts');

    // Mock posts data
    const mockPosts = Array(6).fill(null).map((_, i) => ({
        id: i,
        image: `https://picsum.photos/seed/${i + 10}/400/400`,
        likes: 120 + i * 5,
        comments: 20 + i
    }));



    useEffect(() => {
        // Only redirect if visiting /profile (own profile) and not logged in
        if (!user && !username) {
            navigate("/feed");
        }
    }, [user, username, navigate]);

    if (!displayUser && username) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-400">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-white mb-2">User not found</h2>
                <p>The user <span className="text-blue-400">@{username}</span> does not exist.</p>
                <button onClick={() => navigate('/feed')} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition">
                    Go Home
                </button>
            </div>
        );
    }

    if (!profileData) return null; // Loading or just fallback

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pt-6">
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={profileData}
                onSave={handleSaveProfile}
            />
            <UserListModal
                isOpen={isUserListModalOpen}
                onClose={() => setIsUserListModalOpen(false)}
                title={userListTitle}
                users={userListUsers}
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
                                        <div className="w-full h-full overflow-hidden">
                                            <img
                                                src={profileData.avatar}
                                                alt={profileData.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
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
                                        <div className="text-zinc-300">
                                            <span className="font-bold text-white">{profileData.stats.posts}</span> posts
                                        </div>

                                        <button
                                            onClick={() => {
                                                setUserListTitle("Followers");
                                                // Function to get mock followers
                                                const followers = mockUsers.filter((_, i) => i % 2 === 0); // Mock data: assume half of users follow
                                                setUserListUsers(followers);
                                                setIsUserListModalOpen(true);
                                            }}
                                            className="text-zinc-300 hover:text-white transition cursor-pointer"
                                        >
                                            <span className="font-bold text-white">
                                                {/* Optimistic update for followers count */}
                                                {profileData.stats.followers + (isFollowing ? 1 : 0)}
                                            </span> followers
                                        </button>

                                        <button
                                            onClick={() => {
                                                setUserListTitle("Following");
                                                let followingUsers = [];
                                                if (isOwnProfile && user?.following) {
                                                    followingUsers = mockUsers.filter(u => user.following.includes(u.handle));
                                                } else {
                                                    // Mock following for others
                                                    followingUsers = mockUsers.filter((_, i) => i % 3 === 0);
                                                }
                                                setUserListUsers(followingUsers);
                                                setIsUserListModalOpen(true);
                                            }}
                                            className="text-zinc-300 hover:text-white transition cursor-pointer"
                                        >
                                            <span className="font-bold text-white">
                                                {/* Show actual following count for own profile, otherwise mocked */}
                                                {isOwnProfile ? (user?.following?.length || 0) : profileData.stats.following}
                                            </span> following
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {isOwnProfile && (
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-full md:w-auto px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition mt-4 md:mt-0"
                                >
                                    Edit profile
                                </button>
                            )}

                            {!isOwnProfile && (
                                <button
                                    onClick={handleFollowToggle}
                                    className={`w-full md:w-auto px-6 py-2 text-sm font-medium rounded-md transition mt-4 md:mt-0 ${isFollowing
                                        ? "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                                        : "bg-white text-black hover:bg-zinc-200"
                                        }`}
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </button>
                            )}
                            {/* Message Button - Only defined if not own profile and following */}
                            {!isOwnProfile && isFollowing && (
                                <div className="md:ml-4 flex mt-4 md:mt-0 w-full md:w-auto">
                                    <button
                                        onClick={handleMessage}
                                        className="w-full md:w-auto px-6 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare size={18} />
                                        Message
                                    </button>
                                </div>
                            )}
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
                        <div className="flex justify-center gap-6 md:gap-12 text-xs font-medium tracking-wider uppercase text-zinc-500 mb-8">
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
                        {/* Tab Content */}
                        {activeTab === 'posts' ? (
                            <div className="grid grid-cols-1 gap-6">
                                {userPosts.length > 0 ? (
                                    userPosts.map((post) => (
                                        <PostCard key={post.id} {...post} />
                                    ))
                                ) : (
                                    <div className="py-20 text-center">
                                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500">
                                            <Edit2 size={24} />
                                        </div>
                                        <h3 className="text-white font-bold mb-2">No posts yet</h3>
                                        <p className="text-zinc-500 text-sm">Posts created by {profileData.name} will appear here</p>
                                    </div>
                                )}
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
                            <div className="space-y-6">
                                {taggedPosts.length > 0 ? (
                                    taggedPosts.map(post => (
                                        <PostCard key={post.id} {...post} />
                                    ))
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
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Minimalist */}
                <div className="w-full md:w-72 flex flex-col gap-10 pt-2">
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
                                <a href={profileData.socials.x} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-400 hover:text-white transition text-sm">
                                    <X size={16} />
                                    X
                                </a>
                            )}
                            {profileData.socials.github && (
                                <a href={profileData.socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-400 hover:text-white transition text-sm">
                                    <Github size={16} />
                                    GitHub
                                </a>
                            )}
                            {profileData.socials.linkedin && (
                                <a href={profileData.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-400 hover:text-white transition text-sm">
                                    <Linkedin size={16} />
                                    LinkedIn
                                </a>
                            )}
                            {profileData.socials.instagram && (
                                <a href={profileData.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-400 hover:text-white transition text-sm">
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

                        {isOwnProfile && (
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="mt-6 text-sm text-zinc-500 hover:text-zinc-300 transition flex items-center gap-2"
                            >
                                <Plus size={14} />
                                Add link
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Profile;
