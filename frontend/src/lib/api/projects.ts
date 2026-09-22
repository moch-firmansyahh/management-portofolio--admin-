import { supabaseServer } from "../supabaseServer";
import { supabase } from "../supabase";
import { Project } from "../../types";

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabaseServer
    .from("projects")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return (data || []) as Project[];
}

export async function createProject(project: Omit<Project, "id">): Promise<Project> {
  const { data, error } = await supabaseServer
    .from("projects")
    .insert([project])
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, project: Partial<Project>): Promise<Project> {
  const { data, error } = await supabaseServer
    .from("projects")
    .update(project)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabaseServer.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadProjectImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  const filePath = `projects/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio-assets")
    .upload(filePath, file, { cacheControl: "3600", upsert: true });

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from("portfolio-assets")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
