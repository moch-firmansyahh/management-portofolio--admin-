import React, { useState } from "react";
import { User, Save, Sparkles, MapPin, Mail, Phone, Globe, Github, Linkedin, Instagram, FileText, CheckCircle2 } from "lucide-react";

export interface ProfileData {
  name: string;
  shortName: string;
  role: string;
  tagline: string;
  bio: string;
  status: string;
  location: string;
  email: string;
  phone: string;
  resumeUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
    tiktok: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
}

interface AboutTabProps {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
  onSaveProfile: (e: React.FormEvent) => void;
  savingProfile: boolean;
  onResetDefault: () => void;
}

export default function AboutTab({
  profile,
  setProfile,
  onSaveProfile,
  savingProfile,
  onResetDefault,
}: AboutTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"general" | "bio" | "socials" | "stats">("general");

  const handleStatChange = (index: number, field: "label" | "value", val: string) => {
    const updatedStats = [...(profile.stats || [])];
    if (updatedStats[index]) {
      updatedStats[index] = { ...updatedStats[index], [field]: val };
      setProfile((prev) => ({ ...prev, stats: updatedStats }));
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-2xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-zinc-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
        <div>
          <h3 className="font-semibold text-base text-zinc-900 flex items-center gap-2">
            <User className="h-4.5 w-4.5 text-zinc-900" />
            <span>Profil &amp; Informasi Tentang Saya</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Atur identitas, bio deskriptif, tautan sosial, dan metrik yang tampil di website portofolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetDefault}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-zinc-50 text-zinc-700 px-3 py-2 rounded-lg text-xs font-medium border border-zinc-200 shadow-2xs transition active:scale-98 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
            <span>Muat Data Asli Web</span>
          </button>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex border-b border-zinc-200/80 px-6 bg-zinc-50/50 gap-2 text-xs font-medium text-zinc-600">
        <button
          type="button"
          onClick={() => setActiveSubTab("general")}
          className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
            activeSubTab === "general"
              ? "border-zinc-900 text-zinc-900 font-semibold bg-white"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Informasi Utama</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("bio")}
          className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
            activeSubTab === "bio"
              ? "border-zinc-900 text-zinc-900 font-semibold bg-white"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Bio &amp; Deskripsi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("socials")}
          className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
            activeSubTab === "socials"
              ? "border-zinc-900 text-zinc-900 font-semibold bg-white"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Kontak &amp; Sosial Media</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("stats")}
          className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
            activeSubTab === "stats"
              ? "border-zinc-900 text-zinc-900 font-semibold bg-white"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Statistik &amp; Metrik</span>
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={onSaveProfile} className="p-6 sm:p-8 space-y-6">
        {/* TAB 1: General Info */}
        {activeSubTab === "general" && (
          <div className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={profile.name || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Moch. Firmansyah"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  value={profile.shortName || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, shortName: e.target.value }))}
                  placeholder="Firman"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Profesi / Role Utama
              </label>
              <input
                type="text"
                required
                value={profile.role || ""}
                onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                placeholder="Frontend Developer & Security Enthusiast"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Headline / Tagline Utama
              </label>
              <input
                type="text"
                value={profile.tagline || ""}
                onChange={(e) => setProfile((p) => ({ ...p, tagline: e.target.value }))}
                placeholder="Code that looks good. Systems that stay safe."
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Status Ketersediaan
                </label>
                <input
                  type="text"
                  value={profile.status || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, status: e.target.value }))}
                  placeholder="Available for opportunities"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Lokasi Domisili
                </label>
                <input
                  type="text"
                  value={profile.location || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                  placeholder="Bandung, Indonesia"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Bio & Description */}
        {activeSubTab === "bio" && (
          <div className="space-y-4 max-w-2xl">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Deskripsi Lengkap Tentang Saya (Paragraf Pisahkan dengan Dua Enter)
              </label>
              <textarea
                rows={9}
                value={profile.bio || ""}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tuliskan latar belakang pendidikan, ketertarikan teknologi, dan fokus karir Anda di sini..."
                className="w-full rounded-lg border border-zinc-200 bg-white p-3.5 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all leading-relaxed"
              />
              <p className="text-[11px] text-zinc-400">
                Gunakan dua baris baru (enter 2x) untuk memisahkan antar paragraf pada tampilan web.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Tautan Resume / CV (PDF / Google Drive)
              </label>
              <input
                type="text"
                value={profile.resumeUrl || ""}
                onChange={(e) => setProfile((p) => ({ ...p, resumeUrl: e.target.value }))}
                placeholder="https://drive.google.com/..."
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
              />
            </div>
          </div>
        )}

        {/* TAB 3: Contacts & Social Links */}
        {activeSubTab === "socials" && (
          <div className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Email Kontak Publik</span>
                </label>
                <input
                  type="email"
                  value={profile.email || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Nomor Telepon / WhatsApp</span>
                </label>
                <input
                  type="text"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+62 812-3456-7890"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-zinc-900 block">Tautan Media Sosial</span>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                    <Github className="h-3.5 w-3.5" />
                    <span>Profil GitHub</span>
                  </label>
                  <input
                    type="text"
                    value={profile.socialLinks?.github || ""}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        socialLinks: { ...p.socialLinks, github: e.target.value },
                      }))
                    }
                    placeholder="https://github.com/moch-firmansyahh"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                    <Linkedin className="h-3.5 w-3.5" />
                    <span>Profil LinkedIn</span>
                  </label>
                  <input
                    type="text"
                    value={profile.socialLinks?.linkedin || ""}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        socialLinks: { ...p.socialLinks, linkedin: e.target.value },
                      }))
                    }
                    placeholder="https://www.linkedin.com/in/moch-firmansyah..."
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                    <Instagram className="h-3.5 w-3.5" />
                    <span>Profil Instagram</span>
                  </label>
                  <input
                    type="text"
                    value={profile.socialLinks?.instagram || ""}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        socialLinks: { ...p.socialLinks, instagram: e.target.value },
                      }))
                    }
                    placeholder="https://www.instagram.com/frmzyxx/"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    <span>Profil TikTok</span>
                  </label>
                  <input
                    type="text"
                    value={profile.socialLinks?.tiktok || ""}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        socialLinks: { ...p.socialLinks, tiktok: e.target.value },
                      }))
                    }
                    placeholder="https://www.tiktok.com/@frmnzy_"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Stats Counters */}
        {activeSubTab === "stats" && (
          <div className="space-y-4 max-w-2xl">
            <p className="text-xs text-zinc-500">
              Ubah 4 metrik ringkasan yang muncul pada kartu statistik di beranda web.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(profile.stats || []).map((stat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Label Metrik #{idx + 1}
                    </label>
                    <input
                      type="text"
                      value={stat.label || ""}
                      onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                      placeholder="Contoh: Proyek Selesai"
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Nilai Metrik
                    </label>
                    <input
                      type="text"
                      value={stat.value || ""}
                      onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                      placeholder="Contoh: 5+ atau 98%"
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button Footer */}
        <div className="pt-6 border-t border-zinc-200/80 flex items-center justify-end">
          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 text-xs font-medium shadow-2xs transition disabled:opacity-50 active:scale-98 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{savingProfile ? "Menyimpan ke Firestore..." : "Simpan Perubahan Profil"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
