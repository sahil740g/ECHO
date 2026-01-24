import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Image, Code } from "lucide-react";
import { usePosts } from "../../context/postscontext";

const NewPostModal = ({ isOpen, onClose, isQuery = false }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [codeSnippet, setCodeSnippet] = useState("");
    const [showCodeInput, setShowCodeInput] = useState(false);

    const { addPost } = usePosts();

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPost = {
            title,
            description,
            tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            codeSnippet: showCodeInput ? codeSnippet : null,
            type: isQuery ? 'query' : 'post' // You might want to track this in your post data
        };

        addPost(newPost);

        // Reset and close
        setTitle("");
        setDescription("");
        setTags("");
        setCodeSnippet("");
        setShowCodeInput(false);
        onClose();
    };

    const handleKeyDown = (e) => {
        // Submit on Enter (without Shift) for EVERYTHING
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm">
            <div className="bg-[#161b22] border border-white/10 rounded-xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
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

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isQuery ? "Describe your issue..." : "Share your thoughts..."}
                            rows={3}
                            className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition resize-none"
                            required
                        />
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
                                <label className="block text-xs font-medium text-zinc-400">Code Snippet</label>
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

                    <div className="flex items-center justify-between pt-4">
                        <div className="flex gap-2">
                            <button type="button" className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition">
                                <Image size={20} />
                            </button>
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
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition cursor-pointer"
                        >
                            {isQuery ? "Ask Query" : "Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default NewPostModal;
