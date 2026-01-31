import { useState, useEffect } from "react";
import { User, Bell, Shield, Save, Loader2 } from "lucide-react";
import { useAuth } from "../context/authcontext";

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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
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

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Initialize form with current user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);

    try {
      await updateUser({ name, bio });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Profile Settings</h2>
        <p className="text-zinc-500 text-sm">
          Manage how you appear to others on ECHO.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your display name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Bio
          </label>
          <textarea
            rows={4}
            className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none transition resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white px-6 py-2 rounded-lg font-medium transition text-sm"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

const AccountSettings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Account Security</h2>
        <p className="text-zinc-500 text-sm">
          Manage your account credentials and security.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white/60 cursor-not-allowed"
            value={user?.email || ""}
            disabled
          />
          <p className="text-xs text-zinc-500 mt-1">
            Email cannot be changed. Contact support if needed.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            New Password
          </label>
          <input
            type="password"
            className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none transition"
            placeholder="••••••••"
          />
          <p className="text-xs text-zinc-500 mt-1">
            Password change via Supabase Auth coming soon.
          </p>
        </div>
        <div className="pt-4 border-t border-white/5">
          <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
          <button className="text-red-400 hover:text-red-300 text-sm hover:underline">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-white mb-1">Notifications</h2>
      <p className="text-zinc-500 text-sm">
        Choose what you want to be notified about.
      </p>
    </div>
    <div className="space-y-3">
      {[
        "Email notifications",
        "Push notifications",
        "Mentions",
        "New followers",
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg border border-white/5"
        >
          <span className="text-zinc-300 text-sm">{item}</span>
          <input
            type="checkbox"
            defaultChecked={i < 2}
            className="accent-blue-500 h-4 w-4 rounded border-gray-300"
          />
        </div>
      ))}
    </div>
  </div>
);

export default Settings;
