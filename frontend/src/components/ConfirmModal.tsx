import React from "react";
import { AlertTriangle } from "lucide-react";

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
      <div className="bg-white border border-zinc-200/90 p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4 animate-dialog-show">
        <div className="flex items-start gap-3">
          <div
            className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border ${
              isDanger
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-zinc-100 text-zinc-900 border-zinc-200"
            }`}
          >
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t border-zinc-150 justify-end">
          <button
            type="button"
            className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3.5 py-2 text-xs font-medium text-zinc-700 transition"
            onClick={onCancel}
          >
            Batal
          </button>
          <button
            type="button"
            className={`rounded-lg px-3.5 py-2 text-xs font-medium text-white transition shadow-2xs ${
              isDanger 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-zinc-900 hover:bg-zinc-800"
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
