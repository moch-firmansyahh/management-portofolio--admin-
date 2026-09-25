"use client";

import { useState, useCallback } from "react";
import { ProfileData } from "../types";
import { getProfile, saveProfile } from "../lib/api/profile";
import { DEFAULT_PROFILE } from "../lib/constants";

export function useProfile(showToast: (msg: string, type?: "success" | "error" | "info") => void) {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const data = await getProfile();
      if (data) {
        setProfile({
          ...DEFAULT_PROFILE,
          ...data,
          socialLinks: {
            ...DEFAULT_PROFILE.socialLinks,
            ...(data.socialLinks || {}),
          },
          stats: (data.stats && data.stats.length > 0) ? data.stats : DEFAULT_PROFILE.stats,
        });
      }
    } catch (err: any) {
      showToast("Gagal memuat profil: " + err.message, "error");
    } finally {
      setLoadingProfile(false);
    }
  }, [showToast]);

  const handleSaveProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSavingProfile(true);
      try {
        await saveProfile(profile);
        showToast("Profil berhasil diperbarui!", "success");
        return true;
      } catch (err: any) {
        showToast("Gagal menyimpan profil: " + err.message, "error");
        return false;
      } finally {
        setSavingProfile(false);
      }
    },
    [profile, showToast]
  );

  const handleResetDefaultProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
    showToast("Profil direset ke template bawaan website. Klik 'Simpan Perubahan Profil' untuk menerapkan.", "info");
  }, [showToast]);

  return {
    profile,
    setProfile,
    loadingProfile,
    savingProfile,
    fetchProfile,
    handleSaveProfile,
    handleResetDefaultProfile,
  };
}
