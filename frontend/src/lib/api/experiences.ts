import { supabaseServer as supabase } from "../supabaseServer";
import { Experience } from "../../types";
import { DEFAULT_EXPERIENCES, BACKEND_API } from "../constants";

export async function getExperiences(): Promise<Experience[]> {
  try {
    const res = await fetch(`${BACKEND_API}/experiences`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) return json.data;
    }
  } catch {
    // Fallback direct to Supabase
  }

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return (data || []) as Experience[];
}

export async function createExperience(exp: Omit<Experience, "id">): Promise<Experience> {
  try {
    const res = await fetch(`${BACKEND_API}/experiences`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exp),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch {
    // Fallback direct to Supabase
  }

  const { data, error } = await supabase
    .from("experiences")
    .insert([exp])
    .select()
    .single();

  if (error) throw error;
  return data as Experience;
}

export async function updateExperience(id: string, exp: Partial<Experience>): Promise<Experience> {
  try {
    const res = await fetch(`${BACKEND_API}/experiences/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exp),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch {
    // Fallback direct to Supabase
  }

  const { data, error } = await supabase
    .from("experiences")
    .update(exp)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Experience;
}

export async function deleteExperience(id: string): Promise<void> {
  try {
    const res = await fetch(`${BACKEND_API}/experiences/${id}`, {
      method: "DELETE",
    });
    if (res.ok) return;
  } catch {
    // Fallback direct to Supabase
  }

  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw error;
}

export async function seedExperiences(): Promise<number> {
  const { error } = await supabase.from("experiences").insert(DEFAULT_EXPERIENCES);
  if (error) throw error;
  return DEFAULT_EXPERIENCES.length;
}
