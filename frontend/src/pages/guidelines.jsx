import React from 'react';
import { Shield, Users, MessageSquare, AlertTriangle, Check, Heart, X } from 'lucide-react';

const Guidelines = () => {
    return (
        <div className="max-w-3xl mx-auto p-6 md:p-8 min-h-screen">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-3">Community Guidelines</h1>
                <p className="text-zinc-400 text-lg leading-relaxed">
                    ECHO is a community for developers to share, learn, and grow. These guidelines help us keep it that way.
                </p>
            </div>

            <div className="space-y-6">
                <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-400" />
                        The Essentials
                    </h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1 p-1 bg-green-500/10 rounded-md text-green-400 shrink-0">
                                <Check size={16} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-lg">Be Kind and Respectful</h3>
                                <p className="text-zinc-400 mt-1">Harassment, hate speech, and personal attacks are not tolerated. We're all here to learn.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 p-1 bg-green-500/10 rounded-md text-green-400 shrink-0">
                                <Check size={16} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-lg">Share Knowledge</h3>
                                <p className="text-zinc-400 mt-1">Found a solution? Share it. See a question you can answer? Help out.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-400" />
                        Safety & Quality
                    </h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1 p-1 bg-blue-500/10 rounded-md text-blue-400 shrink-0">
                                <Shield size={16} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-lg">No Spam or Ads</h3>
                                <p className="text-zinc-400 mt-1">Keep the feed clean. Automated posts, excessive self-promotion, and malicious links will be removed.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 p-1 bg-blue-500/10 rounded-md text-blue-400 shrink-0">
                                <Shield size={16} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-lg">Original Content</h3>
                                <p className="text-zinc-400 mt-1">Post content that brings value. If you share someone else's work, please give them credit.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        What Not To Do
                    </h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1 p-1 bg-red-500/10 rounded-md text-red-500 shrink-0">
                                <X size={16} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-lg">Hateful Conduct</h3>
                                <p className="text-zinc-400 mt-1">Do not bully, shame, or degrade others. We have zero tolerance for hate speech or harassment.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 p-1 bg-red-500/10 rounded-md text-red-500 shrink-0">
                                <X size={16} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-lg">NSFW Content</h3>
                                <p className="text-zinc-400 mt-1">ECHO is a professional community. Nudity, sexual content, and graphic violence are not allowed.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Guidelines;
