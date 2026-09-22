import { supabaseServer as supabase } from "../supabaseServer";
import { Skill } from "../../types";
import { POPULAR_SKILLS } from "../constants";

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return (data || []) as Skill[];
}

export async function createSkill(skill: Omit<Skill, "id">): Promise<Skill> {
  const { data, error } = await supabase
    .from("skills")
    .insert([skill])
    .select()
    .single();

  if (error) throw error;
  return data as Skill;
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<Skill> {
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
