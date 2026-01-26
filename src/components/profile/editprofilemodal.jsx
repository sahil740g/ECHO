import React, { useState, useEffect, useCallback } from 'react';
import { X, Camera, ZoomIn, ZoomOut, Check } from 'lucide-react';
import Cropper from 'react-easy-crop';

// Canvas Helper to create the cropped image
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    // set canvas size to match the bounding box
    canvas.width = image.width;
    canvas.height = image.height;

    // draw image
    ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height
    );

    // croppedAreaPixels values are relative to the image size
    // so we can extract the cropped image using those values
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    );

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0);

    // As Base64 string
    return canvas.toDataURL('image/jpeg');
};

const EditProfileModal = ({ isOpen, onClose, initialData, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        handle: '',
        bio: '',
        location: '',
        website: '',
        avatar: '',
        coverImage: '',
        x: '',
        github: '',
        linkedin: '',
        instagram: ''
    });

    // Cropping State
    const [croppingImage, setCroppingImage] = useState(null); // 'avatar' or 'coverImage'
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
            let newValue = value;
            if (!newValue.startsWith('@')) {
                newValue = '@' + newValue;
            }
            if (newValue === '' || newValue === '@') {
                newValue = '@';
            }
            setFormData(prev => ({ ...prev, [name]: newValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = async (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                setCroppingImage(field);
                setZoom(1);
                setCrop({ x: 0, y: 0 });
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSaveCrop = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImage) {
                setFormData(prev => ({
                    ...prev,
                    [croppingImage]: croppedImage
                }));
                // Reset cropping state
                setCroppingImage(null);
                setImageSrc(null);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleCancelCrop = () => {
        setCroppingImage(null);
        setImageSrc(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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

    // Cropping View
    if (croppingImage && imageSrc) {
        return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4">
                <div className="w-full max-w-2xl bg-zinc-900 rounded-xl overflow-hidden flex flex-col max-h-[85vh] h-full shadow-2xl border border-zinc-800">
                    <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                        <h3 className="text-white font-bold">
                            Crop {croppingImage === 'avatar' ? 'Profile Picture' : 'Banner'}
                        </h3>
                        <button onClick={handleCancelCrop} className="text-zinc-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative flex-1 bg-black">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={croppingImage === 'avatar' ? 1 : 3 / 1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            cropShape={croppingImage === 'avatar' ? 'round' : 'rect'}
                            showGrid={true}
                        />
                    </div>

                    <div className="p-4 bg-zinc-900 border-t border-zinc-800 space-y-4 pb-8 md:pb-4">
                        <div className="flex items-center gap-4">
                            <ZoomOut size={20} className="text-zinc-400" />
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(e.target.value)}
                                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <ZoomIn size={20} className="text-zinc-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:flex md:justify-end">
                            <button
                                onClick={handleCancelCrop}
                                className="px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition font-medium text-center"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveCrop}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition flex items-center justify-center gap-2 font-medium"
                            >
                                <Check size={18} />
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[85vh] h-full flex flex-col">
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
                        {/* Banner & Avatar Preview */}
                        <div className="relative mb-20">
                            <div className="h-24 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg overflow-hidden group relative">
                                {formData.coverImage && (
                                    <img
                                        src={formData.coverImage}
                                        alt="Banner"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                        <Camera size={16} /> Edit Banner
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, 'coverImage')}
                                    />
                                </label>
                            </div>

                            <div className="absolute -bottom-6 left-6 z-10">
                                <div className="w-20 h-20 rounded-full bg-zinc-800 border-4 border-zinc-900 block relative group cursor-pointer overflow-hidden">
                                    {formData.avatar ? (
                                        <img
                                            src={formData.avatar}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                                            {initialData?.name?.[0]}
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
                                        <Camera size={20} className="text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, 'avatar')}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Basic Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="p-4 border-t border-zinc-800 grid grid-cols-2 gap-3 md:flex md:justify-end bg-zinc-900 flex-shrink-0 pb-8 md:pb-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition text-center"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition text-center"
                    >
                        Save Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
