import { supabaseServer as supabase } from "../supabaseServer";
import { ContactMessage } from "../../types";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getMessages(): Promise<ContactMessage[]> {
  try {
    const res = await fetch(`${BACKEND_API}/messages`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((m: any) => ({
          ...m,
          read: m.read === true || m.status === "read",
          createdAt: m.created_at || m.createdAt || new Date().toISOString(),
        }));
      }
    }
  } catch {
    // Fallback direct to Supabase
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    const fallback = await supabase.from("messages").select("*");
    if (fallback.error) throw fallback.error;
    return (fallback.data || []).map((m: any) => ({
      ...m,
      read: m.status === "read" || m.read === true,
      createdAt: m.createdAt || m.created_at || new Date().toISOString(),
    }));
  }

  return (data || []).map((m: any) => ({
    ...m,
    read: m.status === "read" || m.read === true,
    createdAt: m.createdAt || m.created_at || new Date().toISOString(),
  }));
}

export async function updateMessageStatus(id: string, read: boolean): Promise<void> {
  try {
    const res = await fetch(`${BACKEND_API}/messages/${id}/read`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    if (res.ok) return;
  } catch {
    // Fallback direct to Supabase
  }

  const { error } = await supabase
    .from("messages")
    .update({ status: read ? "read" : "unread" })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  try {
    const res = await fetch(`${BACKEND_API}/messages/${id}`, {
      method: "DELETE",
    });
    if (res.ok) return;
  } catch {
    // Fallback direct to Supabase
  }

  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw error;
}
