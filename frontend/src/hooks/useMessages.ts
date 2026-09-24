"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { ContactMessage } from "../types";
import { getMessages, updateMessageStatus, deleteMessage } from "../lib/api/messages";
import { supabase } from "../lib/supabase";

export function useMessages(showToast: (msg: string, type?: "success" | "error" | "info") => void) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err: any) {
      showToast("Gagal memuat pesan masuk: " + err.message, "error");
    } finally {
      setLoadingMessages(false);
    }
  }, [showToast]);

  // Realtime subscription untuk pesan masuk baru & perubahan status
  useEffect(() => {
    const channel = supabase
      .channel("realtime-messages-admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newRow = payload.new as any;
          const newMsg: ContactMessage = {
            id: newRow.id,
            name: newRow.name || "Anonim",
            email: newRow.email || "",
            subject: newRow.subject || "",
            message: newRow.message || "",
            createdAt: newRow.created_at || new Date().toISOString(),
            read: newRow.status === "read" || newRow.read === true,
          };
          setMessages((prev) => [newMsg, ...prev.filter((m) => m.id !== newMsg.id)]);
          showToast(`📨 Pesan baru diterima dari ${newMsg.name}!`, "info");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const updatedRow = payload.new as any;
          if (updatedRow && updatedRow.id) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === updatedRow.id
                  ? {
                      ...m,
                      name: updatedRow.name || m.name,
                      email: updatedRow.email || m.email,
                      subject: updatedRow.subject || m.subject,
                      message: updatedRow.message || m.message,
                      read: updatedRow.status === "read" || updatedRow.read === true,
                    }
                  : m
              )
            );
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          const deletedId = (payload.old as any)?.id;
          if (deletedId) {
            setMessages((prev) => prev.filter((m) => m.id !== deletedId));
          }
        }
      )
      .subscribe();

    // Auto-sync saat kembali fokus ke tab admin
    const handleFocus = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch {
        // Abaikan error background sync
      }
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("focus", handleFocus);
    };
  }, [showToast]);

  const handleSetMessageReadStatus = useCallback(
    async (id: string, newReadStatus: boolean, notify = true) => {
      try {
        await updateMessageStatus(id, newReadStatus);
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: newReadStatus } : m))
        );
        if (notify) {
          showToast(
            newReadStatus ? "Pesan ditandai sudah dibaca." : "Pesan ditandai belum dibaca.",
            "info"
          );
        }
      } catch (err: any) {
        showToast("Gagal memperbarui status pesan: " + err.message, "error");
      }
    },
    [showToast]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteMessage(id);
        setMessages((prev) => prev.filter((m) => m.id !== id));
        showToast("Pesan berhasil dihapus.", "success");
        return true;
      } catch (err: any) {
        showToast("Gagal menghapus pesan: " + err.message, "error");
        return false;
      }
    },
    [showToast]
  );

  const unreadMessagesCount = useMemo(() => {
    return messages.filter((m) => !m.read).length;
  }, [messages]);

  return {
    messages,
    setMessages,
    loadingMessages,
    unreadMessagesCount,
    fetchMessages,
    handleSetMessageReadStatus,
    handleDeleteMessage: handleDelete,
  };
}
