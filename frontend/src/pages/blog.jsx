import React from 'react';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
    const navigate = useNavigate();
    const posts = [
        {
            id: 1,
            title: "The Future of React: What to Expect in 2026",
            excerpt: "Exploring the new compiler features, server components, and how they will reshape the way we build web applications.",
            date: "Jan 28, 2026",
            readTime: "5 min read",
            category: "Development",
            tags: ["React", "JavaScript"]
        },
        {
            id: 2,
            title: "Mastering Tailwind CSS Grids",
            excerpt: "A comprehensive guide to building complex layouts with utility classes.",
            date: "Jan 25, 2026",
            readTime: "8 min read",
            category: "Design",
            tags: ["CSS", "Tailwind"]
        },
        {
            id: 3,
            title: "Understanding AI Agents",
            excerpt: "How autonomous agents are changing the landscape of software engineering.",
            date: "Jan 20, 2026",
            readTime: "6 min read",
            category: "AI",
            tags: ["AI", "Agents"]
        },
        {
            id: 4,
            title: "Optimizing Web Performance",
            excerpt: "Tips and tricks to make your applications load faster and run smoother.",
            date: "Jan 15, 2026",
            readTime: "7 min read",
            category: "Performance",
            tags: ["Web", "Optimization"]
        },
        {
            id: 5,
            title: "The State of TypeScript in 2026",
            excerpt: "New features and best practices for writing type-safe code at scale.",
            date: "Jan 10, 2026",
            readTime: "10 min read",
            category: "Development",
            tags: ["TypeScript"]
        },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 min-h-screen">
            <div className="mb-8 border-b border-white/5 pb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Blog</h1>
                <p className="text-zinc-400">Latest thoughts and tutorials from the team.</p>
            </div>

            <div className="space-y-4">
                {posts.map(post => (
                    <article
                        key={post.id}
                        onClick={() => navigate(`/blog/${post.id}`, { state: { post } })}
                        className="group bg-[#161b22] border border-white/5 rounded-xl p-6 hover:bg-[#1c2128] transition-colors cursor-pointer"
                    >
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                                    {post.category}
                                </span>
                                <span className="text-zinc-600 text-[10px]">•</span>
                                <span className="text-zinc-500 text-xs flex items-center gap-1">
                                    {post.date}
                                </span>
                            </div>
                            <span className="hidden md:block text-zinc-600 text-[10px]">•</span>
                            <span className="text-zinc-500 text-xs flex items-center gap-1">
                                <Clock size={12} /> {post.readTime}
                            </span>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {post.title}
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4 max-w-2xl">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center gap-3">
                            {post.tags.map(tag => (
                                <span key={tag} className="text-[10px] text-zinc-500 bg-white/5 px-2 py-1 rounded">
                                    #{tag}
                                </span>
                            ))}
                            <div className="ml-auto text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                Read <ArrowRight size={14} />
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Blog;
