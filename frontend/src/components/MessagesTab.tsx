import React from "react";
import { Mail, MailOpen, Trash2, Reply, Search, Calendar, User, CheckCircle2, Inbox } from "lucide-react";
import { ContactMessage } from "./MessageModal";

interface MessagesTabProps {
  messages: ContactMessage[];
  searchQuery: string;
  onOpenMessage: (msg: ContactMessage) => void;
  onToggleRead: (id: string, currentStatus: boolean) => void;
  onDeleteMessage: (id: string) => void;
}

export default function MessagesTab({
  messages,
  searchQuery,
  onOpenMessage,
  onToggleRead,
  onDeleteMessage,
}: MessagesTabProps) {
  const filteredMessages = messages.filter((msg) => {
    const query = searchQuery.toLowerCase();
    return (
      msg.name.toLowerCase().includes(query) ||
      msg.email.toLowerCase().includes(query) ||
      (msg.subject && msg.subject.toLowerCase().includes(query)) ||
      msg.message.toLowerCase().includes(query)
    );
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Baru saja";
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-2xs space-y-0 overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-zinc-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
        <div>
          <h3 className="font-semibold text-base text-zinc-900 flex items-center gap-2">
            <Inbox className="h-4.5 w-4.5 text-zinc-900" />
            <span>Pesan Masuk (Inbox)</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-2xs animate-pulse">
                {unreadCount} Baru
              </span>
            )}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Pesan dan penawaran kerja sama yang dikirimkan oleh pengunjung melalui form kontak website portofolio.
          </p>
        </div>
      </div>

      {/* Messages list */}
      <div className="divide-y divide-zinc-150">
        {filteredMessages.length === 0 ? (
          <div className="py-16 text-center text-zinc-400">
            <div className="flex flex-col items-center justify-center gap-2">
              <Mail className="h-10 w-10 text-zinc-300 stroke-[1.5]" />
              <span className="font-medium text-xs text-zinc-600">
                {searchQuery ? "Tidak ada pesan yang sesuai dengan pencarian." : "Belum ada pesan masuk dari pengunjung web."}
              </span>
              <p className="text-[11px] text-zinc-400 max-w-sm">
                Setiap pesan yang dikirimkan melalui form kontak di website akan otomatis tersimpan dan muncul di sini.
              </p>
            </div>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => onOpenMessage(msg)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer hover:bg-zinc-50/80 ${
                !msg.read ? "bg-blue-50/30 border-l-4 border-l-blue-600" : "bg-white"
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                    !msg.read
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                  }`}
                >
                  {msg.name ? msg.name.substring(0, 2).toUpperCase() : "U"}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-semibold ${!msg.read ? "text-zinc-950 font-bold" : "text-zinc-800"}`}>
                      {msg.name}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      &lt;{msg.email}&gt;
                    </span>
                    {!msg.read && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                        Baru
                      </span>
                    )}
                  </div>

                  <h4 className={`text-xs truncate ${!msg.read ? "font-semibold text-zinc-900" : "text-zinc-700"}`}>
                    {msg.subject || "(Tanpa Subjek)"}
                  </h4>

                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>

              {/* Date and Quick Actions */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-[11px] text-zinc-400 font-mono">
                  {formatDate(msg.createdAt)}
                </span>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggleRead(msg.id, msg.read)}
                    className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
                    title={msg.read ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
                  >
                    {msg.read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                  </button>

                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "Pesan dari Portofolio")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
                    title="Balas via Email"
                  >
                    <Reply className="h-3.5 w-3.5" />
                  </a>

                  <button
                    onClick={() => onDeleteMessage(msg.id)}
                    className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Hapus Pesan"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
