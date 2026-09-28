import { supabaseServer } from "../supabaseServer";
import { supabase } from "../supabase";
import { Project } from "../../types";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${BACKEND_API}/projects`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) return json.data;
    }
  } catch {
    // Fallback direct to Supabase
  }

  const { data, error } = await supabaseServer
    .from("projects")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return (data || []) as Project[];
}

export async function createProject(project: Omit<Project, "id">): Promise<Project> {
  try {
    const res = await fetch(`${BACKEND_API}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch {
    // Fallback direct to Supabase
  }

  const { data, error } = await supabaseServer
    .from("projects")
    .insert([project])
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, project: Partial<Project>): Promise<Project> {
  try {
    const res = await fetch(`${BACKEND_API}/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch {
    // Fallback direct to Supabase
  }

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
  try {
    const res = await fetch(`${BACKEND_API}/projects/${id}`, {
      method: "DELETE",
    });
    if (res.ok) return;
  } catch {
    // Fallback direct to Supabase
  }

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
