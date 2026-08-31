import React, { useState } from "react";
import { Upload, Loader2, X, Star, Link2, Code, FileText, CheckCircle2 } from "lucide-react";
import { Project } from "./ProjectsTab";

interface ProjectModalProps {
  isOpen: boolean;
  isEdit: boolean;
  data: Project;
  setData: React.Dispatch<React.SetStateAction<Project>>;
  uploadingImage: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const CATEGORIES = ["Web App", "E-Commerce", "Dashboard", "Landing Page", "Mobile App", "Cyber Security"];

export default function ProjectModal({
  isOpen,
  isEdit,
  data,
  setData,
  uploadingImage,
  handleImageUpload,
  onSubmit,
  onClose,
}: ProjectModalProps) {
  const [activeSection, setActiveSection] = useState<"general" | "details" | "links">("general");

  if (!isOpen) return null;

  // Helpers for tags & highlights
  const tagsInputValue = (data.tags || []).join(", ");
  const highlightsInputValue = (data.highlights || []).join("\n");

  const handleTagsChange = (val: string) => {
    const arr = val.split(",").map(s => s.trim()).filter(Boolean);
    setData(prev => ({ ...prev, tags: arr }));
  };

  const handleHighlightsChange = (val: string) => {
    const arr = val.split("\n").map(s => s.trim()).filter(Boolean);
    setData(prev => ({ ...prev, highlights: arr }));
  };

  return (
    <div className="admin-modal-overlay">
      <form
        onSubmit={onSubmit}
        className="max-w-xl w-full bg-white border border-zinc-200/90 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-dialog-show"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-150 px-6 py-4 bg-zinc-50/50">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
              <span>{isEdit ? "Edit Data Proyek" : "Tambah Proyek Baru"}</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Data akan otomatis disinkronkan langsung ke Firestore & Website.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-zinc-200/80 px-6 bg-white gap-2 text-xs font-medium text-zinc-600">
          <button
            type="button"
            onClick={() => setActiveSection("general")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSection === "general"
                ? "border-zinc-900 text-zinc-900 font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Info Utama</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("details")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSection === "details"
                ? "border-zinc-900 text-zinc-900 font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Detail & Highlights</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("links")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSection === "links"
                ? "border-zinc-900 text-zinc-900 font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>Media & Tautan</span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeSection === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                    Judul Proyek *
                  </label>
                  <input
                    type="text"
                    value={data.title || ""}
                    onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Contoh: Kontrakan Pa Iman"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                    Kategori Proyek
                  </label>
                  <select
                    value={data.category || "Web App"}
                    onChange={(e) => setData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Subtitle / Tagline Singkat
                </label>
                <input
                  type="text"
                  value={data.subtitle || ""}
                  onChange={(e) => setData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Contoh: Sistem Manajemen Kost Digital Modern & Responsif"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                    Tahun Pembuatan
                  </label>
                  <input
                    type="text"
                    value={data.year || new Date().getFullYear().toString()}
                    onChange={(e) => setData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2026"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer bg-zinc-50 border border-zinc-200/80 px-3.5 py-2 rounded-lg hover:bg-zinc-100/80 transition">
                    <input
                      type="checkbox"
                      checked={!!data.featured}
                      onChange={(e) => setData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded text-zinc-900 focus:ring-zinc-900 h-4 w-4"
                    />
                    <div className="flex items-center gap-1.5 text-xs text-zinc-800 font-medium">
                      <Star className={`h-3.5 w-3.5 ${data.featured ? "text-amber-500 fill-amber-500" : "text-zinc-400"}`} />
                      <span>Tampilkan sebagai Proyek Unggulan (Featured)</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Deskripsi Ringkas (Tampil di Card Web) *
                </label>
                <textarea
                  value={data.description || ""}
                  onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan portofolio..."
                  rows={2}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all resize-none"
                  required
                />
              </div>
            </div>
          )}

          {activeSection === "details" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Tech Stack / Tags (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  defaultValue={tagsInputValue}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="Next.js 16, TypeScript, Tailwind CSS, Supabase, JWT"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                />
                <p className="text-[10px] text-zinc-400">Contoh: Next.js, React, Node.js, PostgreSQL</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Key Metrics / Badges
                </label>
                <input
                  type="text"
                  value={data.metrics || ""}
                  onChange={(e) => setData(prev => ({ ...prev, metrics: e.target.value }))}
                  placeholder="Full-Stack • Real-time Stats • PWA Ready"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Poin Highlights & Fitur Utama (1 baris per poin)
                </label>
                <textarea
                  defaultValue={highlightsInputValue}
                  onChange={(e) => handleHighlightsChange(e.target.value)}
                  placeholder="Dashboard Ringkasan Real-Time dengan 4 Stat Card interaktif&#10;Manajemen Unit Kamar dengan Instant Search&#10;Sistem Autentikasi JWT terenkripsi"
                  rows={4}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Deskripsi Lengkap (Halaman Detail)
                </label>
                <textarea
                  value={data.longDescription || ""}
                  onChange={(e) => setData(prev => ({ ...prev, longDescription: e.target.value }))}
                  placeholder="Penjelasan arsitektur, tantangan, dan solusi mendalam..."
                  rows={3}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all resize-y"
                />
              </div>
            </div>
          )}

          {activeSection === "links" && (
            <div className="space-y-4">
              {/* Image Upload Area */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Gambar Cover Proyek
                </label>
                
                {data.image && (
                  <div className="relative h-32 w-full rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                    <img
                      src={data.image}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as any).onerror = null;
                        (e.target as any).src = "/assets/portofolio.png";
                      }}
                    />
                    <span className="absolute bottom-2 right-2 bg-zinc-900/80 px-2 py-0.5 rounded text-[10px] text-white font-mono">
                      Preview
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="file"
                      id="project-image-file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="project-image-file"
                      className={`flex items-center justify-center gap-2 cursor-pointer w-full rounded-lg border border-dashed border-zinc-300 hover:border-zinc-900 bg-zinc-50/60 px-3.5 py-2 text-xs text-zinc-600 hover:text-zinc-900 transition font-medium ${
                        uploadingImage ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-900" />
                          <span>Mengunggah...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5 text-zinc-500" />
                          <span>Unggah Gambar Lokal</span>
                        </>
                      )}
                    </label>
                  </div>

                  <input
                    type="text"
                    value={data.image || ""}
                    onChange={(e) => setData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Atau tempel URL gambar /projects/..."
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 font-mono transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  URL Live Demo Website
                </label>
                <input
                  type="text"
                  value={data.demoUrl || data.link || ""}
                  onChange={(e) => setData(prev => ({ ...prev, demoUrl: e.target.value, link: e.target.value }))}
                  placeholder="https://manajemen-kontrakan-iman.vercel.app/"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  URL GitHub Repository
                </label>
                <input
                  type="text"
                  value={data.githubUrl || ""}
                  onChange={(e) => setData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/moch-firmansyahh/manajemen-kost-v2"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 px-6 border-t border-zinc-150 bg-zinc-50/50">
          <div className="text-[11px] text-zinc-400">
            {activeSection === "general" && "Tab 1 dari 3: Info Utama"}
            {activeSection === "details" && "Tab 2 dari 3: Detail & Highlights"}
            {activeSection === "links" && "Tab 3 dari 3: Media & Tautan"}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-700 transition"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={uploadingImage || !data.title.trim() || !data.description.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-xs font-medium text-white shadow-2xs transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Simpan Proyek</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

