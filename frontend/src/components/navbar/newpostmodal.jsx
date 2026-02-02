import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Image, Code, Smile } from "lucide-react";
import { usePosts } from "../../context/postscontext";
import { useAuth } from "../../context/authcontext";
import { searchUsers, getUserByHandle } from "../../lib/user";
import { useNotifications } from "../../context/NotificationContext";
import EmojiPicker from 'emoji-picker-react';

const NewPostModal = ({ isOpen, onClose, isQuery = false }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [codeSnippet, setCodeSnippet] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [image, setImage] = useState(null);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null); // Import useRef at top level if not imported

    // Tagging state
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { addPost } = usePosts();
    const { user } = useAuth();

    if (!isOpen) return null;

    const handleDescriptionChange = async (e) => {
        const val = e.target.value;
        setDescription(val);

        const lastWord = val.split(/[\s\n]/).pop();
        if (lastWord.startsWith('@') && lastWord.length > 1) {
            const query = lastWord.slice(1).toLowerCase();
            try {
                const results = await searchUsers(query);
                setSuggestions(results);
                setShowSuggestions(results.length > 0);
            } catch (err) {
                console.error("Search failed", err);
            }
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    const handleSelectUser = (handle) => {
        const lastIndex = description.lastIndexOf('@');
        const newText = description.substring(0, lastIndex) + handle + ' ';
        setDescription(newText);
        setShowSuggestions(false);
    };

    const onEmojiClick = (emojiObject) => {
        setDescription(prev => prev + emojiObject.emoji);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPost = {
            title,
            description,
            tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            codeSnippet: showCodeInput ? codeSnippet : null,
            language: showCodeInput ? language : null,
            image: image,
            type: isQuery ? 'query' : 'post',
            username: user ? user.name : "Anonymous",
            handle: user ? user.handle : "@anonymous",
            avatar: user ? user.avatar : null
        };

        const createdPost = await addPost(newPost);

        if (createdPost) {
            // Process mentions in description
            const mentionRegex = /@(\w+)/g;
            const matches = description.match(mentionRegex);

            if (matches) {
                const uniqueHandles = [...new Set(matches)];
                uniqueHandles.forEach(async (handle) => {
                    const targetUser = await getUserByHandle(handle);
                    if (targetUser && targetUser.id !== user.id) {
                        createNotification({
                            userId: targetUser.id,
                            type: 'mention',
                            actorId: user.id,
                            postId: createdPost.id
                        });
                    }
                });
            }
        }

        // Reset and close
        setTitle("");
        setDescription("");
        setTags("");
        setCodeSnippet("");
        setImage(null);
        setShowCodeInput(false);
        setShowEmojiPicker(false);
        setSuggestions([]);
        setShowSuggestions(false);
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] backdrop-blur-sm bg-black/70 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="bg-[#161b22] border border-white/10 rounded-xl w-full max-w-lg p-5 md:p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 my-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-xl font-bold text-white mb-6">{isQuery ? "New Query" : "Create New Post"}</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={isQuery ? "What's your question?" : "What's interesting?"}
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition"
                                required
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                            {showSuggestions && (
                                <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#161b22] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20">
                                    {suggestions.map(user => (
                                        <div
                                            key={user.handle}
                                            onClick={() => handleSelectUser(user.handle)}
                                            className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition"
                                        >
                                            <img
                                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div>
                                                <p className="text-white text-sm font-medium">{user.name}</p>
                                                <p className="text-zinc-500 text-xs">{user.handle}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <textarea
                                value={description}
                                onChange={handleDescriptionChange}
                                onKeyDown={handleKeyDown}
                                placeholder={isQuery ? "Describe your issue..." : "Share your thoughts..."}
                                rows={3}
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition resize-none"
                                required
                            />
                            {image && (
                                <div className="mt-2 relative inline-block">
                                    <img src={image} alt="Preview" className="max-h-40 rounded-lg border border-white/10" />
                                    <button
                                        onClick={() => setImage(null)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="react, javascript, webdev"
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        {showCodeInput && (
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2">
                                        <label className="block text-xs font-medium text-zinc-400">Code Snippet</label>
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="bg-[#161b22] text-xs text-blue-400 border border-white/10 rounded px-2 py-0.5 outline-none focus:border-blue-500"
                                        >
                                            <option value="javascript">JavaScript</option>
                                            <option value="python">Python</option>
                                            <option value="html">HTML</option>
                                            <option value="css">CSS</option>
                                            <option value="java">Java</option>
                                            <option value="cpp">C++</option>
                                            <option value="react">React</option>
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowCodeInput(false)}
                                        className="text-xs text-red-400 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <textarea
                                    value={codeSnippet}
                                    onChange={(e) => setCodeSnippet(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="// Paste your code here..."
                                    rows={4}
                                    className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2 text-green-400 font-mono text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition resize-none"
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-4 relative">
                            {showEmojiPicker && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setShowEmojiPicker(false)} />
                                    <div className="absolute bottom-full left-0 mb-2 z-40 shadow-2xl rounded-xl overflow-hidden border border-white/10 max-w-[85vw] md:max-w-none">
                                        <EmojiPicker
                                            theme="dark"
                                            onEmojiClick={onEmojiClick}
                                            lazyLoadEmojis={true}
                                            width="100%"
                                            height={350}
                                            previewConfig={{ showPreview: false }}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className={`p-2 rounded-lg transition ${showEmojiPicker ? 'text-yellow-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Smile size={20} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`p-2 rounded-lg transition ${image ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Image size={20} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCodeInput(true)}
                                    className={`p-2 rounded-lg transition ${showCodeInput ? "text-blue-400 bg-blue-500/10" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                                >
                                    <Code size={20} />
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-lg font-medium transition cursor-pointer text-sm"
                            >
                                {isQuery ? "Ask Query" : "Post"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default NewPostModal;
