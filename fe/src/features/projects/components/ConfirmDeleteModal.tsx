import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] transition-all duration-200"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl 
                   animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 pl-1">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 
                       text-white rounded-xl font-medium shadow-md 
                       hover:from-red-600 hover:to-red-700 
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-all duration-150"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 
                       text-gray-700 dark:text-gray-200 rounded-xl font-medium 
                       hover:bg-gray-200 dark:hover:bg-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 
                       disabled:opacity-50 transition-all duration-150"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}