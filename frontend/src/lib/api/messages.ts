import { supabaseServer as supabase } from "../supabaseServer";
import { ContactMessage } from "../../types";

export async function getMessages(): Promise<ContactMessage[]> {
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
  const { error } = await supabase
    .from("messages")
    .update({ status: read ? "read" : "unread" })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw error;
}
