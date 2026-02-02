import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // In a real app, fetch data by ID. Here we use passed state or fallback.
    const post = location.state?.post || {
        id: id,
        title: "Article Not Found",
        excerpt: "This post could not be loaded.",
        category: "Error",
        date: "N/A",
        readTime: "0 min",
        tags: [],
        content: "Please try navigating back to the blog list."
    };

    // Generic content filler for demo purposes
    const fullContent = `
        <p class="mb-6">
            Software development is constantly evolving. In this article, we'll explore the core concepts that define modern engineering practices. From architecture to deployment, every step matters.
        </p>
        <h3 class="text-2xl font-bold text-white mb-4">The Core Concepts</h3>
        <p class="mb-6">
            Understanding the fundamentals is key. Whether you're working with <strong>React</strong>, <strong>Vue</strong>, or server-side languages like <strong>Rust</strong>, the principles of clean code remain the same.
        </p>
        <ul class="list-disc pl-6 mb-6 space-y-2">
            <li>Keep it simple (KISS)</li>
            <li>Don't repeat yourself (DRY)</li>
            <li>Optimize for readability</li>
        </ul>
        <h3 class="text-2xl font-bold text-white mb-4">Looking Ahead</h3>
        <p>
            As we move into 2026, we can expect to see more integration of AI tools, better compiler optimizations, and a shift towards edge computing. Stay curious and keep building.
        </p>
    `;

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 min-h-screen">
            <button
                onClick={() => navigate('/blog')}
                className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Blog
            </button>

            <article>
                <header className="mb-8 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-md font-medium border border-blue-600/20">
                            {post.category}
                        </span>
                        <span className="text-zinc-500 text-sm flex items-center gap-1">
                            <Calendar size={14} /> {post.date}
                        </span>
                        <span className="text-zinc-500 text-sm flex items-center gap-1">
                            <Clock size={14} /> {post.readTime}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white">
                            <User size={20} />
                        </div>
                        <div>
                            <div className="text-white font-medium text-sm">Sarah Engineer</div>
                            <div className="text-zinc-500 text-xs">Senior Developer</div>
                        </div>
                    </div>
                </header>

                <div className="prose prose-invert prose-lg max-w-none text-zinc-300">
                    <p className="text-xl text-zinc-200 mb-8 font-light italic border-l-4 border-blue-500 pl-4 bg-blue-500/5 py-4 pr-4 rounded-r-lg">
                        {post.excerpt}
                    </p>
                    {/* Render generic content for demo */}
                    <div dangerouslySetInnerHTML={{ __html: fullContent }} />
                </div>

                <div className="mt-12 pt-8 border-t border-white/5">
                    <h4 className="text-sm font-bold text-zinc-500 mb-4 uppercase tracking-wider">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 text-sm text-zinc-300 bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-default">
                                <Tag size={12} /> {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    );
};
export default BlogPost;