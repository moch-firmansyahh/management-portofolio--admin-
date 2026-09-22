"use client";

import { useState, useCallback, useMemo } from "react";
import { ContactMessage } from "../types";
import { getMessages, updateMessageStatus, deleteMessage } from "../lib/api/messages";

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
