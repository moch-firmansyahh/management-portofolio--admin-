import { supabaseServer as supabase } from "../supabaseServer";
import { Skill } from "../../types";
import { POPULAR_SKILLS } from "../constants";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getSkills(): Promise<Skill[]> {
  try {
    const res = await fetch(`${BACKEND_API}/skills`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) return json.data;
    }
  } catch {
    // Fallback direct to Supabase
  }

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return (data || []) as Skill[];
}

export async function createSkill(skill: Omit<Skill, "id">): Promise<Skill> {
  try {
    const res = await fetch(`${BACKEND_API}/skills`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skill),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch {
    // Fallback direct to Supabase
  }

  const { data, error } = await supabase
    .from("skills")
    .insert([skill])
    .select()
    .single();

  if (error) throw error;
  return data as Skill;
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<Skill> {
  try {
    const res = await fetch(`${BACKEND_API}/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skill),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch {
    // Fallback direct to Supabase
  }

  const { data, error } = await supabase
    .from("skills")
    .update(skill)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Skill;
}

export async function deleteSkill(id: string): Promise<void> {
  try {
    const res = await fetch(`${BACKEND_API}/skills/${id}`, {
      method: "DELETE",
    });
    if (res.ok) return;
  } catch {
    // Fallback direct to Supabase
  }

  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteSkillsByCategory(category: string): Promise<void> {
  const { error } = await supabase.from("skills").delete().eq("category", category);
  if (error) throw error;
}

export async function seedSkills(): Promise<number> {
  const items = POPULAR_SKILLS.map((s) => ({
    name: s.name,
    logo: s.logo,
    percent: 85,
    category: s.category || "Front-End Web Development",
  }));

  const { error } = await supabase.from("skills").insert(items);
  if (error) throw error;
  return items.length;
}
