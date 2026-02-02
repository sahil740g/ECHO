import { Trophy, Share2, Edit2, Code, Terminal, Coffee } from "lucide-react";

export const mockUsers = [
    {
        name: "Dishant Savadia",
        handle: "@dishantsav123",
        bio: "Full Stack Developer 👨‍💻 | React, Node.js, Python | Building cool stuff 🚀 | Open Source Enthusiast",
        location: "Mumbai, India",
        website: "portfolio.dev",
        avatar: null, // Using initial fallback
        coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80",
        joinDate: "January 2024",
        socials: {
            x: "https://x.com/dishantsav",
            github: "https://github.com/dishantsav",
            linkedin: "https://linkedin.com/in/dishantsav"
        },
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
    },
    {
        name: "Sarah Jenkins",
        handle: "@sarahj_dev",
        bio: "Frontend Specialist | CSS Wizard 🎨 | Accessibility Advocate",
        location: "San Francisco, CA",
        website: "sarahjenkins.io",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        coverImage: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80",
        joinDate: "March 2024",
        socials: {
            x: "https://x.com/sarahj_dev",
            github: "https://github.com/sarahj_dev"
        },
        stats: {
            followers: 890,
            following: 120,
            posts: 15
        },
        achievements: [
            { icon: <Code className="text-purple-500" size={20} />, title: "Bug Hunter", desc: "Fixed 50+ bugs" },
            { icon: <Coffee className="text-amber-700" size={20} />, title: "Night Owl", desc: "Most commits after midnight" }
        ]
    },
    {
        name: "Alex Chen",
        handle: "@alexc_dev",
        bio: "Backend Engineer @ TechCorp | Go & Rust | System Design",
        location: "Toronto, Canada",
        website: "alexc.dev",
        avatar: "https://i.pravatar.cc/150?u=alex",
        coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
        joinDate: "February 2024",
        socials: {
            github: "https://github.com/alexc_dev",
            linkedin: "https://linkedin.com/in/alexc_dev"
        },
        stats: {
            followers: 2100,
            following: 80,
            posts: 28
        },
        achievements: [
            { icon: <Terminal className="text-green-400" size={20} />, title: "System Architect", desc: "Designed core infra" }
        ]
    }
];
