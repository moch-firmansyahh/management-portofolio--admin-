import React, { useState } from "react";
import { User, Save, Sparkles, Mail, Globe, Github, Linkedin, Instagram, FileText, Loader2 } from "lucide-react";
import { ProfileData } from "../../types";

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
  const [activeSubTab, setActiveSubTab] = useState<"general" | "about" | "contact">("general");

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
            Atur identitas profil beranda, narasi seksi tentang saya, dan tautan kontak yang tampil di portofolio-web.
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
          <span>Profil &amp; Beranda (Hero)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("about")}
          className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
            activeSubTab === "about"
              ? "border-zinc-900 text-zinc-900 font-semibold bg-white"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Seksi Tentang Saya (About)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("contact")}
          className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
            activeSubTab === "contact"
              ? "border-zinc-900 text-zinc-900 font-semibold bg-white"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Kontak &amp; Sosial Media</span>
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={onSaveProfile} className="p-6 sm:p-8 space-y-6">
        {/* TAB 1: General / Hero Info */}
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
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                    Nama Panggilan
                  </label>
                  <span className="text-[10px] text-zinc-400">Tampil di Footer besar web</span>
                </div>
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
                Profesi / Role Utama (Judul Besar Hero Web)
              </label>
              <input
                type="text"
                required
                value={profile.role || ""}
                onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                placeholder="Frontend Developer & Security Enthusiast"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
              />
              <p className="text-[11px] text-zinc-400">
                Gunakan tanda &ldquo;&amp;&rdquo; untuk membagi teks menjadi dua baris di Hero Section website.
              </p>
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Deskripsi Singkat Hero / Subheadline
                </label>
                <span className="text-[10px] text-zinc-400">Tampil di Hero Section web</span>
              </div>
              <textarea
                rows={3}
                value={profile.about || ""}
                onChange={(e) => setProfile((p) => ({ ...p, about: e.target.value }))}
                placeholder="Mahasiswa Informatika Telkom University yang fokus memadukan Frontend Development modern dengan pemahaman Network & Web Security untuk menciptakan aplikasi web yang responsif, interaktif, dan aman."
                className="w-full rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* TAB 2: About Section */}
        {activeSubTab === "about" && (
          <div className="space-y-4 max-w-2xl">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Tagline / Judul Utama Seksi About
                </label>
                <span className="text-[10px] text-zinc-400">Judul Besar di Seksi About</span>
              </div>
              <input
                type="text"
                value={profile.tagline || ""}
                onChange={(e) => setProfile((p) => ({ ...p, tagline: e.target.value }))}
                placeholder="Code that looks good. Systems that stay safe."
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Deskripsi Lengkap Tentang Saya (Seksi About Web)
              </label>
              <textarea
                rows={9}
                value={profile.bio || ""}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tuliskan latar belakang pendidikan, pengalaman proyek, dan fokus keahlian Anda di sini..."
                className="w-full rounded-lg border border-zinc-200 bg-white p-3.5 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all leading-relaxed"
              />
              <p className="text-[11px] text-zinc-400">
                Tips: Gunakan dua baris Enter untuk memisahkan paragraf baru. Anda juga dapat menggunakan format **teks tebal** untuk menebalkan kata kunci.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: Contacts & Social Links */}
        {activeSubTab === "contact" && (
          <div className="space-y-4 max-w-2xl">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-zinc-500" />
                <span>Email Kontak</span>
              </label>
              <input
                type="email"
                value={profile.email || ""}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                placeholder="firmanajah366@gmail.com"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
              />
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-zinc-900 block">
                Tautan Media Sosial (Tampil di Contact Section &amp; Command Palette Web)
              </span>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub</span>
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
                    <span>LinkedIn</span>
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
                    placeholder="https://www.linkedin.com/in/moch-firmansyah-532122323/"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                    <Instagram className="h-3.5 w-3.5" />
                    <span>Instagram</span>
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
                    <span>TikTok</span>
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

        {/* Action Button Footer */}
        <div className="pt-6 border-t border-zinc-200/80 flex items-center justify-end">
          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 text-xs font-medium shadow-2xs transition disabled:opacity-60 active:scale-98 cursor-pointer disabled:cursor-not-allowed"
          >
            {savingProfile ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Simpan Perubahan Profil</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
