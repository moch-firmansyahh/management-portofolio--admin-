import React from "react";
import { X, Mail, Reply, Calendar, Trash2, CheckCircle2, User } from "lucide-react";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt?: any;
}

interface MessageModalProps {
  isOpen: boolean;
  message: ContactMessage | null;
  onClose: () => void;
  onToggleRead: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export default function MessageModal({
  isOpen,
  message,
  onClose,
  onToggleRead,
  onDelete,
}: MessageModalProps) {
  if (!isOpen || !message) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Baru saja";
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
      });
    }
    return new Date(timestamp).toLocaleString("id-ID");
  };

  const mailtoHref = `mailto:${message.email}?subject=Re: ${encodeURIComponent(
    message.subject || "Pesan dari Portofolio"
  )}&body=${encodeURIComponent(`\n\n---\nPada ${formatDate(message.createdAt)}, ${message.name} menulis:\n${message.message}`)}`;

  return (
    <div className="admin-modal-overlay">
      <div className="max-w-xl w-full bg-white border border-zinc-200/90 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-dialog-show">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-150 px-6 py-4 bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Pesan dari {message.name}
              </h2>
              <p className="text-xs text-zinc-500 font-mono">{message.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Metadata banner */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
            <div className="flex items-center justify-between text-zinc-500 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                <span>{formatDate(message.createdAt)}</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  message.read
                    ? "bg-zinc-200/70 text-zinc-600"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {message.read ? "Sudah Dibaca" : "Pesan Baru"}
              </span>
            </div>

            <div className="pt-2 border-t border-zinc-200/60">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                Topik / Subjek:
              </span>
              <p className="font-semibold text-zinc-900 text-sm mt-0.5">
                {message.subject || "(Tanpa Subjek)"}
              </p>
            </div>
          </div>

          {/* Message content */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase font-semibold text-zinc-400 tracking-wider">
              Isi Pesan:
            </span>
            <div className="p-5 rounded-xl bg-white border border-zinc-200 text-zinc-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans selection:bg-zinc-900 selection:text-white">
              {message.message}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 px-6 border-t border-zinc-150 bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleRead(message.id, message.read)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 shadow-2xs transition cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" />
              <span>{message.read ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onDelete(message.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-100 text-xs font-medium text-red-700 shadow-2xs transition cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Hapus</span>
            </button>
          </div>

          <a
            href={mailtoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-xs font-medium text-white shadow-2xs transition cursor-pointer"
          >
            <Reply className="h-3.5 w-3.5" />
            <span>Balas via Email</span>
          </a>
        </div>
      </div>
    </div>
  );
}
