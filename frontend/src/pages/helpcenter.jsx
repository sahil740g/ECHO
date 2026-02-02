import React, { useState } from 'react';
import { Search, HelpCircle, FileText, Lock, Settings, Mail, ChevronDown, ChevronUp } from 'lucide-react';

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const faqs = [
        {
            category: "Getting Started",
            icon: <FileText className="w-5 h-5 text-blue-400" />,
            questions: [
                { q: "What is ECHO?", a: "ECHO is a community-driven platform for developers to share knowledge, ask questions, and connect with peers." },
                { q: "Is it free to use?", a: "Yes, ECHO is completely free for all developers." },
            ]
        },
        {
            category: "Account & Settings",
            icon: <Settings className="w-5 h-5 text-purple-400" />,
            questions: [
                { q: "How do I change my username?", a: "Go to your Profile page and click the 'Edit Profile' button." },
                { q: "Can I delete my account?", a: "Yes, you can request account deletion from the Settings menu." },
            ]
        },
        {
            category: "Privacy & Security",
            icon: <Lock className="w-5 h-5 text-green-400" />,
            questions: [
                { q: "Is my data private?", a: "We take privacy seriously. Your personal data is encrypted and never shared with third parties without consent." },
                { q: "How do I report a user?", a: "Use the report button on their profile or post, or contact us directly." },
            ]
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const filteredFaqs = faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0);

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 min-h-screen">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-2xl mb-6">
                    <HelpCircle className="w-10 h-10 text-blue-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">How can we help?</h1>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-4 bg-[#161b22] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-lg"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-8">
                {filteredFaqs.map((section, sIndex) => (
                    <div key={sIndex} className="bg-[#161b22] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-[#1c2128]/50">
                            {section.icon}
                            <h2 className="text-xl font-bold text-white">{section.category}</h2>
                        </div>
                        <div className="divide-y divide-white/5">
                            {section.questions.map((faq, qIndex) => {
                                const globalIndex = `${sIndex}-${qIndex}`;
                                const isOpen = openFaqIndex === globalIndex;
                                return (
                                    <div key={qIndex} className="group">
                                        <button
                                            onClick={() => toggleFaq(globalIndex)}
                                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                                        >
                                            <span className={`font-medium transition-colors ${isOpen ? 'text-blue-400' : 'text-zinc-200 group-hover:text-white'}`}>
                                                {faq.q}
                                            </span>
                                            {isOpen ? <ChevronUp size={18} className="text-blue-400" /> : <ChevronDown size={18} className="text-zinc-500" />}
                                        </button>
                                        {isOpen && (
                                            <div className="px-6 pb-4 text-zinc-400 leading-relaxed text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {filteredFaqs.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                        <p>No results found for "{searchQuery}"</p>
                    </div>
                )}
            </div>

            <div className="mt-16 text-center">
                <p className="text-zinc-400 mb-4">Still need help?</p>
                <a href="mailto:support@echo.com" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors">
                    <Mail size={18} />
                    Contact Support
                </a>
            </div>
        </div>
    );
};

export default HelpCenter;
