"use client";

import { useState, useCallback } from "react";
import { Experience } from "../types";
import { getExperiences, createExperience, updateExperience, deleteExperience, seedExperiences } from "../lib/api/experiences";

export function useExperiences(showToast: (msg: string, type?: "success" | "error" | "info") => void) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loadingExperiences, setLoadingExperiences] = useState(false);
  const [isSeedingExperiences, setIsSeedingExperiences] = useState(false);

  const fetchExperiences = useCallback(async () => {
    setLoadingExperiences(true);
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (err: any) {
      showToast("Gagal memuat riwayat pengalaman: " + err.message, "error");
    } finally {
      setLoadingExperiences(false);
    }
  }, [showToast]);

  const handleSaveExperience = useCallback(async (expData: Experience, isEdit: boolean) => {
    try {
      const payload: Omit<Experience, "id"> = {
        role: expData.role.trim(),
        company: expData.company.trim(),
        period: expData.period.trim(),
        location: expData.location || "Bandung, West Java, Indonesia",
        description: expData.description.trim(),
        technologies: expData.technologies || [],
        type: expData.type || "Work",
      };

      if (isEdit && expData.id) {
        const updated = await updateExperience(expData.id, payload);
        setExperiences((prev) => prev.map((e) => (e.id === expData.id ? updated : e)));
        showToast("Riwayat pengalaman berhasil diperbarui!", "success");
      } else {
        const created = await createExperience(payload);
        setExperiences((prev) => [created, ...prev]);
        showToast("Riwayat pengalaman berhasil ditambahkan!", "success");
      }
      return true;
    } catch (err: any) {
      showToast("Gagal menyimpan pengalaman: " + err.message, "error");
      return false;
    }
  }, [showToast]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteExperience(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      showToast("Riwayat pengalaman berhasil dihapus.", "success");
      return true;
    } catch (err: any) {
      showToast("Gagal menghapus pengalaman: " + err.message, "error");
      return false;
    }
  }, [showToast]);

  const handleSeed = useCallback(async () => {
    setIsSeedingExperiences(true);
    try {
      const count = await seedExperiences();
      showToast(`Berhasil menambahkan ${count} riwayat pengalaman bawaan!`, "success");
      await fetchExperiences();
    } catch (err: any) {
      showToast("Gagal impor pengalaman bawaan: " + err.message, "error");
    } finally {
      setIsSeedingExperiences(false);
    }
  }, [showToast, fetchExperiences]);

  return {
    experiences,
    setExperiences,
    loadingExperiences,
    isSeedingExperiences,
    fetchExperiences,
    handleSaveExperience,
    handleDeleteExperience: handleDelete,
    handleSeedDefaultExperience: handleSeed,
  };
}
