import { Trash2, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

function MessageContextMenu({
    isOpen,
    onClose,
    position,
    onDeleteForMe,
    onDeleteForEveryone,
    isSender
}) {
    const menuRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Menu */}
            <div
                ref={menuRef}
                className="fixed z-50 bg-[#16181C] border border-white/10 rounded-lg shadow-2xl min-w-[200px] animate-in zoom-in-95 duration-150"
                style={{
                    top: `${position.y}px`,
                    left: `${position.x}px`,
                }}
            >
                <div className="py-2">
                    <button
                        onClick={() => {
                            onDeleteForMe();
                            onClose();
                        }}
                        className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-white/5 transition text-zinc-300 hover:text-white"
                    >
                        <Trash2 size={16} />
                        <span>Delete for Me</span>
                    </button>

                    {isSender && (
                        <button
                            onClick={() => {
                                onDeleteForEveryone();
                                onClose();
                            }}
                            className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-500/10 transition text-red-400 hover:text-red-300"
                        >
                            <Trash2 size={16} />
                            <span>Delete for Everyone</span>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default MessageContextMenu;
