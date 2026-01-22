import React, { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose, initialData, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        location: '',
        website: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                handle: initialData.handle || '',
                bio: initialData.bio || '',
                location: initialData.location || '',
                website: initialData.website || '',
                avatar: initialData.avatar || '',
                coverImage: initialData.coverImage || '',
                x: initialData.socials?.x || '',
                github: initialData.socials?.github || '',
                linkedin: initialData.socials?.linkedin || '',
                instagram: initialData.socials?.instagram || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'handle') {
            // Enforce @ prefix
            let newValue = value;
            if (!newValue.startsWith('@')) {
                newValue = '@' + newValue;
            }
            // Prevent deleting the @ if it's the only character
            if (newValue === '' || newValue === '@') {
                newValue = '@';
            }

            setFormData(prev => ({
                ...prev,
                [name]: newValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    [field]: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Structure the data to match expected profile format
        const profileData = {
            name: formData.name,
            handle: formData.handle,
            bio: formData.bio,
            location: formData.location,
            website: formData.website,
            avatar: formData.avatar,
            coverImage: formData.coverImage,
            socials: {
                x: formData.x,
                github: formData.github,
                linkedin: formData.linkedin,
                instagram: formData.instagram
            }
        };
        onSave(profileData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-zinc-800 flex-shrink-0">
                    <h2 className="text-lg font-bold text-white">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Header Image & Avatar Placeholder */}
                        <div className="relative mb-8">
                            <div className="h-24 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg"></div>
                            <div className="absolute -bottom-6 left-6">
                                <div className="w-20 h-20 rounded-full bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                    {initialData?.handle ? (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                                            {initialData.name?.[0]}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-zinc-700"></div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                        <Camera size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Basic Info</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-zinc-800 border-none rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Username</label>
                                    <input
                                        type="text"
                                        name="handle"
                                        value={formData.handle}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-zinc-800 border-none rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                        placeholder="@username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-2.5 bg-zinc-800 border-none rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
                                    placeholder="Tell us about yourself"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-zinc-800 border-none rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                        placeholder="City, Country"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Website</label>
                                    <input
                                        type="text"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-zinc-800 border-none rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                        placeholder="yourwebsite.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Images</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Avatar</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            name="avatar"
                                            value={formData.avatar}
                                            onChange={handleChange}
                                            className="flex-1 px-4 py-2.5 bg-zinc-800 border-none rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                            placeholder="Image URL"
                                        />
                                        <label className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg cursor-pointer transition whitespace-nowrap">
                                            Upload
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(e, 'avatar')}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Banner</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            name="coverImage"
                                            value={formData.coverImage}
                                            onChange={handleChange}
                                            className="flex-1 px-4 py-2.5 bg-zinc-800 border-none rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                            placeholder="Image URL"
                                        />
                                        <label className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg cursor-pointer transition whitespace-nowrap">
                                            Upload
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(e, 'coverImage')}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Social Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">X</label>
                                    <input
                                        type="text"
                                        name="x"
                                        value={formData.x}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-zinc-800 border-none rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                        placeholder="X URL"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">GitHub</label>
                                    <input
                                        type="text"
                                        name="github"
                                        value={formData.github}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-zinc-800 border-none rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                        placeholder="GitHub URL"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">LinkedIn</label>
                                    <input
                                        type="text"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-zinc-800 border-none rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                        placeholder="LinkedIn URL"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Instagram</label>
                                    <input
                                        type="text"
                                        name="instagram"
                                        value={formData.instagram}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-zinc-800 border-none rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                        placeholder="Instagram URL"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-4 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition"
                    >
                        Save Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
