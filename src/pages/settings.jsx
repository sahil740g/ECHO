import { useState } from "react";
import { User, Bell, Shield, Palette, Save } from "lucide-react";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "account", label: "Account", icon: Shield },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? "bg-white/10 text-white"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-[#161b22] border border-white/5 rounded-xl p-6">
                    {activeTab === "profile" && <ProfileSettings />}
                    {activeTab === "account" && <AccountSettings />}
                    {activeTab === "notifications" && <NotificationSettings />}
                </div>
            </div>
        </div>
    );
};

const ProfileSettings = () => (
    <div className="space-y-6">
        <div>
            <h2 className="text-xl font-bold text-white mb-1">Profile Settings</h2>
            <p className="text-zinc-500 text-sm">Manage how you appear to others on ECHO.</p>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Display Name</label>
                <input type="text" className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none transition" defaultValue="Dishant Savadia" />
            </div>
            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Bio</label>
                <textarea rows={4} className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none transition" defaultValue="Full Stack Developer 👨‍💻 | React, Node.js, Python" />
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition text-sm">
                <Save size={16} />
                Save Changes
            </button>
        </div>
    </div>
);

const AccountSettings = () => (
    <div className="space-y-6">
        <div>
            <h2 className="text-xl font-bold text-white mb-1">Account Security</h2>
            <p className="text-zinc-500 text-sm">Manage your account credentials and security.</p>
        </div>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email Address</label>
                <input type="email" className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none transition" defaultValue="dishant@example.com" />
            </div>
            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">New Password</label>
                <input type="password" className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none transition" placeholder="••••••••" />
            </div>
            <div className="pt-4 border-t border-white/5">
                <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
                <button className="text-red-400 hover:text-red-300 text-sm hover:underline">Delete Account</button>
            </div>
        </div>
    </div>
);

const NotificationSettings = () => (
    <div className="space-y-6">
        <div>
            <h2 className="text-xl font-bold text-white mb-1">Notifications</h2>
            <p className="text-zinc-500 text-sm">Choose what you want to be notified about.</p>
        </div>
        <div className="space-y-3">
            {["Email notifications", "Push notifications", "Mentions", "New followers"].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg border border-white/5">
                    <span className="text-zinc-300 text-sm">{item}</span>
                    <input type="checkbox" defaultChecked={i < 2} className="accent-blue-500 h-4 w-4 rounded border-gray-300" />
                </div>
            ))}
        </div>
    </div>
);

export default Settings;
