"use client";

import { useState, useCallback } from "react";
import { Skill } from "../types";
import { getSkills, createSkill, updateSkill, deleteSkill, seedSkills } from "../lib/api/skills";

export function useSkills(showToast: (msg: string, type?: "success" | "error" | "info") => void) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [isSeedingSkills, setIsSeedingSkills] = useState(false);

  const fetchSkills = useCallback(async () => {
    setLoadingSkills(true);
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (err: any) {
      showToast("Gagal memuat data skill: " + err.message, "error");
    } finally {
      setLoadingSkills(false);
    }
  }, [showToast]);

  const handleSaveSkill = useCallback(async (skillData: Skill, isEdit: boolean) => {
    try {
      if (isEdit && skillData.id) {
        const updated = await updateSkill(skillData.id, {
          name: skillData.name,
          logo: skillData.logo,
          percent: Number(skillData.percent) || 0,
          category: skillData.category || "Front-End Web Development",
        });
        setSkills((prev) => prev.map((s) => (s.id === skillData.id ? updated : s)));
        showToast("Skill berhasil diperbarui!", "success");
      } else {
        const created = await createSkill({
          name: skillData.name,
          logo: skillData.logo,
          percent: Number(skillData.percent) || 0,
          category: skillData.category || "Front-End Web Development",
        });
        setSkills((prev) => [...prev, created]);
        showToast("Skill baru berhasil ditambahkan!", "success");
      }
      return true;
    } catch (err: any) {
      showToast("Gagal menyimpan skill: " + err.message, "error");
      return false;
    }
  }, [showToast]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      showToast("Skill berhasil dihapus.", "success");
      return true;
    } catch (err: any) {
      showToast("Gagal menghapus skill: " + err.message, "error");
      return false;
    }
  }, [showToast]);

  const handleSeed = useCallback(async () => {
    setIsSeedingSkills(true);
    try {
      const count = await seedSkills();
      showToast(`Berhasil menyinkronkan ${count} keahlian bawaan!`, "success");
      await fetchSkills();
    } catch (err: any) {
      showToast("Gagal impor skill bawaan: " + err.message, "error");
    } finally {
      setIsSeedingSkills(false);
    }
  }, [showToast, fetchSkills]);

  return {
    skills,
    setSkills,
    loadingSkills,
    isSeedingSkills,
    setIsSeedingSkills,
    fetchSkills,
    handleSaveSkill,
    handleDeleteSkill: handleDelete,
    handleSeedDefaultSkills: handleSeed,
  };
}
