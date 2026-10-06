import { supabaseServer } from "../supabaseServer";
import { Project } from "../../types";
import { BACKEND_API } from "../constants";

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
  // Upload via Next.js API route (server-side, bypass RLS menggunakan Service Role Key)
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    const errorMsg = json.error || `Upload gagal (status ${res.status})`;
    console.error("Upload API error:", errorMsg);
    throw new Error(errorMsg);
  }

  return json.url;
}

