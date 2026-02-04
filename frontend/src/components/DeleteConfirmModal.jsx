import { X } from "lucide-react";

function DeleteConfirmModal({ isOpen, onClose, onConfirm, title = "Delete Post?", message = "This action cannot be undone." }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#16181C] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition p-1 hover:bg-white/5 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="text-gray-400 mb-6">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-[#2F3336] hover:bg-[#3A3D41] text-white rounded-full font-medium transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;
