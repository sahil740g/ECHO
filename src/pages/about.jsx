import React from 'react';
import { Target, Globe2, Sparkles, Github, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-8 min-h-screen">
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-white mb-4">About ECHO</h1>
                <p className="text-xl text-zinc-400 leading-relaxed">
                    We are building the digital town square for the next generation of software engineers.
                </p>
            </div>

            <div className="space-y-12">
                <div>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        Our Mission
                    </h2>
                    <p className="text-zinc-400 leading-relaxed">
                        ECHO was born from a simple idea: coding shouldn't be a solitary pursuit. In a world of increasing complexity, we believe that collective intelligence is the only way forward. We're building tools that empower developers to share not just code, but context.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        Our Values
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <h3 className="text-white font-medium mb-1">Open by Default</h3>
                            <p className="text-sm text-zinc-500">Knowledge grows when it's shared. We optimize for transparency and accessibility.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-medium mb-1">Developer First</h3>
                            <p className="text-sm text-zinc-500">No ads, no tracking, no distractions. Just pure signal for those who build.</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white mb-6">Meet the Builders</h2>
                    <div className="grid gap-6">
                        {[
                            {
                                name: "Dishant Savadia",
                                role: "Backend Head",
                                desc: "I’m a BCA student who learns best by building real projects. I enjoy turning ideas into clean and functional web experiences using React and modern frontend tools. Recently, I built DevMap — a roadmap-style website to help students learn tech in the right order.",
                                github: "https://github.com/dishant11max",
                                githubUser: "dishant11max",
                                linkedin: "https://www.linkedin.com/in/dishant-savadia-b38b0a289/",
                                linkedinUser: "Dishant Savadia"
                            },
                            {
                                name: "Mohammed Sahil",
                                role: "Frontend Lead",
                                desc: "I’m always eager to learn and adapt to new technologies. I believe in continuous learning, collaboration, and leveraging technology to solve real-world problems. Currently learning Backend and Android Development, with an interest in Project Management",
                                github: "https://github.com/sahil740g",
                                githubUser: "sahil740g",
                                linkedin: "https://www.linkedin.com/in/mohammed-sahil-49399731b",
                                linkedinUser: "Mohammed Sahil"
                            },
                            {
                                name: "Sk Tahsin Ali",
                                role: "Frontend Developer",
                                desc: "Crafting distinct visual identities and seamless workflows. Tahsin bridges the gap between engineering and art, ensuring that every pixel serves a purpose. He is a minimalist at heart and a typography nerd.",
                                github: "#",
                                githubUser: "tahsinali",
                                linkedin: "#",
                                linkedinUser: "Sk Tahsin Ali"
                            },
                            {
                                name: "Swatipayal Mohanty",
                                role: "Backend Developer",
                                desc: "Building bridges between ECHO and the global developer ecosystem. Swatipayal organizes our hackathons, manages the mentorship program, and ensures that every voice in the community is heard and valued.",
                                github: "#",
                                githubUser: "swatipayal",
                                linkedin: "#",
                                linkedinUser: "Swatipayal Mohanty"
                            }
                        ].map((dev, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 bg-[#161b22] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                                <div>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <h3 className="text-white font-medium">{dev.name}</h3>
                                        <span className="text-blue-400 text-xs font-medium">{dev.role}</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">{dev.desc}</p>
                                    <div className="flex flex-wrap gap-4">
                                        <a href={dev.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs group">
                                            <Github size={14} className="group-hover:scale-110 transition-transform" />
                                            <span>{dev.githubUser}</span>
                                        </a>
                                        <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-500 hover:text-blue-400 transition-colors text-xs group">
                                            <Linkedin size={14} className="group-hover:scale-110 transition-transform" />
                                            <span>{dev.linkedinUser}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                    <button
                        onClick={() => navigate('/community')}
                        className="bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-zinc-200 transition-colors text-sm"
                    >
                        Join the Conversation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default About;
