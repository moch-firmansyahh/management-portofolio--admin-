import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Konfirmasi",
  isDanger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl max-w-sm w-full space-y-5">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 py-2.5 text-xs font-bold text-gray-700 transition"
            onClick={onCancel}
          >
            Batal
          </button>
          <button
            type="button"
            className={`flex-1 rounded-xl py-2.5 text-xs font-bold text-white transition shadow-md ${
              isDanger 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-[#1e1b4b] hover:bg-[#1a1843]"
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
