import { supabaseServer as supabase } from "../supabaseServer";
import { Experience } from "../../types";
import { DEFAULT_EXPERIENCES } from "../constants";

export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return (data || []) as Experience[];
}

export async function createExperience(exp: Omit<Experience, "id">): Promise<Experience> {
  const { data, error } = await supabase
    .from("experiences")
    .insert([exp])
    .select()
    .single();

  if (error) throw error;
  return data as Experience;
}

export async function updateExperience(id: string, exp: Partial<Experience>): Promise<Experience> {
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
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw error;
}

export async function seedExperiences(): Promise<number> {
  const { error } = await supabase.from("experiences").insert(DEFAULT_EXPERIENCES);
  if (error) throw error;
  return DEFAULT_EXPERIENCES.length;
}
