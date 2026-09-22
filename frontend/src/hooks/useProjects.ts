"use client";

import { useState, useCallback } from "react";
import { Project } from "../types";
import { getProjects, createProject, updateProject, deleteProject, uploadProjectImage } from "../lib/api/projects";
import { DEFAULT_SEED_PROJECTS } from "../lib/constants";
import { supabase } from "../lib/supabase";

export function useProjects(showToast: (msg: string, type?: "success" | "error" | "info") => void) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [isSeedingProjects, setIsSeedingProjects] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err: any) {
      showToast("Gagal memuat data proyek: " + err.message, "error");
    } finally {
      setLoadingProjects(false);
    }
  }, [showToast]);

  const handleSaveProject = useCallback(async (projectData: Project, isEdit: boolean) => {
    try {
      const payload = {
        title: projectData.title.trim(),
        subtitle: projectData.subtitle || projectData.description,
        description: projectData.description.trim(),
        longDescription: projectData.longDescription || projectData.description,
        tags: projectData.tags || [],
        category: projectData.category || "Web App",
        featured: !!projectData.featured,
        image: projectData.image || "/projects/manajemen-kontrakan.png",
        link: projectData.demoUrl || projectData.link || "",
        demoUrl: projectData.demoUrl || projectData.link || "",
        githubUrl: projectData.githubUrl || "",
        metrics: projectData.metrics || "Interactive UI",
        highlights: projectData.highlights || [],
        year: projectData.year || new Date().getFullYear().toString(),
      };

      if (isEdit && projectData.id) {
        const updated = await updateProject(projectData.id, payload);
        setProjects((prev) => prev.map((p) => (p.id === projectData.id ? updated : p)));
        showToast("Proyek berhasil diperbarui!", "success");
      } else {
        const created = await createProject(payload);
        setProjects((prev) => [created, ...prev]);
        showToast("Proyek baru berhasil ditambahkan!", "success");
      }
      return true;
    } catch (err: any) {
      showToast("Gagal menyimpan proyek: " + err.message, "error");
      return false;
    }
  }, [showToast]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast("Proyek berhasil dihapus.", "success");
      return true;
    } catch (err: any) {
      showToast("Gagal menghapus proyek: " + err.message, "error");
      return false;
    }
  }, [showToast]);

  const handleUploadImage = useCallback(async (file: File) => {
    setUploadingImage(true);
    try {
      const publicUrl = await uploadProjectImage(file);
      showToast("Gambar proyek berhasil diunggah!", "success");
      return publicUrl;
    } catch (err: any) {
      showToast("Gagal mengunggah gambar: " + err.message, "error");
      return null;
    } finally {
      setUploadingImage(false);
    }
  }, [showToast]);

  const handleSeed = useCallback(async () => {
    setIsSeedingProjects(true);
    try {
      const existingTitles = new Set(projects.map((p) => p.title.toLowerCase()));
      const newItemsToInsert = DEFAULT_SEED_PROJECTS.filter(
        (p) => !existingTitles.has(p.title.toLowerCase())
      );

      if (newItemsToInsert.length === 0) {
        showToast("Semua data proyek bawaan web sudah ada di database!", "info");
        return;
      }

      const { error } = await supabase.from("projects").insert(newItemsToInsert);
      if (error) throw error;

      showToast(`Berhasil menambahkan ${newItemsToInsert.length} proyek bawaan!`, "success");
      await fetchProjects();
    } catch (err: any) {
      showToast("Gagal impor data proyek: " + err.message, "error");
    } finally {
      setIsSeedingProjects(false);
    }
  }, [showToast, projects, fetchProjects]);

  return {
    projects,
    setProjects,
    loadingProjects,
    isSeedingProjects,
    uploadingImage,
    fetchProjects,
    handleSaveProject,
    handleDeleteProject: handleDelete,
    handleUploadImage,
    handleSeedDefaultProjects: handleSeed,
  };
}
