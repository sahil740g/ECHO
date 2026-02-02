import { X, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserListModal = ({ isOpen, onClose, title, users }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#161b22] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-1 p-4 space-y-3">
                    {users && users.length > 0 ? (
                        users.map((user) => (
                            <div
                                key={user.handle}
                                onClick={() => {
                                    onClose();
                                    navigate(`/profile/${user.handle.replace('@', '')}`);
                                }}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full border border-white/10"
                                    />
                                    <div>
                                        <h3 className="text-white font-medium text-sm group-hover:text-blue-400 transition">{user.name}</h3>
                                        <p className="text-zinc-500 text-xs">{user.handle}</p>
                                    </div>
                                </div>
                                <button className="px-3 py-1 bg-white/5 text-white text-xs font-medium rounded-full hover:bg-white/10 transition">
                                    View
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500">
                                <UserCircle size={24} />
                            </div>
                            <p className="text-zinc-400 text-sm">No users found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserListModal;
