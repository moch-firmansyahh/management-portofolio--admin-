import React, { useState, useEffect } from "react";
import { Upload, Loader2, X, Star, Link2, FileText, CheckCircle2, BookOpen, Layers, Globe, Code2 } from "lucide-react";
import { Project } from "../../types";
import { PROJECT_CATEGORIES } from "../../lib/constants";

interface ProjectModalProps {
  isOpen: boolean;
  isEdit: boolean;
  data: Project;
  setData: React.Dispatch<React.SetStateAction<Project>>;
  uploadingImage: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  initialTab?: "general" | "case_study" | "links";
}

export default function ProjectModal({
  isOpen,
  isEdit,
  data,
  setData,
  uploadingImage,
  handleImageUpload,
  onSubmit,
  onClose,
  initialTab = "general",
}: ProjectModalProps) {
  const [activeSection, setActiveSection] = useState<"general" | "case_study" | "links">(initialTab);

  // Sync active section when modal opens or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveSection(initialTab || "general");
    }
  }, [isOpen, initialTab]);

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
        className="max-w-2xl w-full bg-white border border-zinc-200/90 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-dialog-show"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-150 px-6 py-4 bg-zinc-50/50">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
              <span>{isEdit ? "Edit Data Proyek & Studi Kasus" : "Tambah Proyek Baru"}</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Kelola informasi proyek dan detail studi kasus untuk website.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-zinc-200/80 px-6 bg-white gap-2 text-xs font-medium text-zinc-600">
          <button
            type="button"
            onClick={() => setActiveSection("general")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeSection === "general"
                ? "border-zinc-900 text-zinc-900 font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>1. Info Utama</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("case_study")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeSection === "case_study"
                ? "border-zinc-900 text-zinc-900 font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-zinc-900" />
            <span>2. Detail Studi Kasus</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] bg-zinc-100 text-zinc-700 font-mono font-normal">
              /projects/[id]
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("links")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeSection === "links"
                ? "border-zinc-900 text-zinc-900 font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>3. Tech Stack &amp; Media</span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: General Info */}
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
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all cursor-pointer"
                  >
                    {PROJECT_CATEGORIES.map(c => (
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
                      className="rounded text-zinc-900 focus:ring-zinc-900 h-4 w-4 cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5 text-xs text-zinc-800 font-medium">
                      <Star className={`h-3.5 w-3.5 ${data.featured ? "text-amber-500 fill-amber-500" : "text-zinc-400"}`} />
                      <span>Tampilkan sebagai Proyek Unggulan (Featured)</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                    Deskripsi Ringkas (Tampil di Card Depan Web) *
                  </label>
                  <span className="text-[10px] text-zinc-400">Ringkasan singkat 1-2 kalimat</span>
                </div>
                <textarea
                  value={data.description || ""}
                  onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan portofolio..."
                  rows={2}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all resize-none leading-relaxed"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 2: Case Study Details (Halaman /projects/[id]) */}
          {activeSection === "case_study" && (
            <div className="space-y-5">
              {/* Informative banner */}
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2.5">
                <Globe className="h-4 w-4 text-zinc-700 mt-0.5 shrink-0" />
                <div className="space-y-0.5 text-xs text-zinc-800">
                  <p className="font-semibold text-zinc-900">Seksi Halaman Detail Studi Kasus</p>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Data di bawah ini ditampilkan lengkap ketika pengunjung website mengklik tombol <strong>&ldquo;Lihat Detail Studi Kasus&rdquo;</strong> pada kartu proyek di website.
                  </p>
                </div>
              </div>

              {/* 1. Latar Belakang & Solusi (longDescription) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Latar Belakang &amp; Solusi (Overview Studi Kasus)</span>
                  </label>
                  <span className="text-[10px] text-zinc-400">Tampil di seksi Overview studi kasus</span>
                </div>
                <textarea
                  value={data.longDescription || ""}
                  onChange={(e) => setData(prev => ({ ...prev, longDescription: e.target.value }))}
                  placeholder="Jelaskan latar belakang masalah, kebutuhan pengguna, serta solusi arsitektur perangkat lunak yang Anda buat..."
                  rows={5}
                  className="w-full rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all resize-y leading-relaxed"
                />
              </div>

              {/* 2. Poin Highlights & Kemampuan Sistem (highlights) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Kemampuan Sistem &amp; Fitur Utama (Highlights Checklist)</span>
                  </label>
                  <span className="text-[10px] text-zinc-400">1 baris = 1 poin checklist</span>
                </div>
                <textarea
                  defaultValue={highlightsInputValue}
                  onChange={(e) => handleHighlightsChange(e.target.value)}
                  placeholder="Dashboard Ringkasan Real-Time dengan 4 Stat Card interaktif&#10;Manajemen Unit Kamar dengan Instant Search dan riwayat transaksi&#10;Sistem Checkout dan generate invoice otomatis"
                  rows={5}
                  className="w-full rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all resize-y leading-relaxed"
                />
                
                {/* Live Checklist Preview */}
                {data.highlights && data.highlights.length > 0 && (
                  <div className="mt-2 p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 space-y-1.5">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                      Pratinjau Checklist Studi Kasus ({data.highlights.length} Poin):
                    </span>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {data.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-zinc-700">
                          <CheckCircle2 className="h-3.5 w-3.5 text-zinc-900 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Key Metrics / Sorotan */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-700">
                  Key Metrics / Sorotan Singkat Proyek
                </label>
                <input
                  type="text"
                  value={data.metrics || ""}
                  onChange={(e) => setData(prev => ({ ...prev, metrics: e.target.value }))}
                  placeholder="Contoh: Full-Stack • Real-time Stats • PWA Ready"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                />
                <p className="text-[10px] text-zinc-400">Tampil di kolom spesifikasi cepat halaman studi kasus.</p>
              </div>
            </div>
          )}

          {/* TAB 3: Tech Stack & Media */}
          {activeSection === "links" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Tech Stack / Tags (Pisahkan dengan koma)</span>
                </label>
                <input
                  type="text"
                  defaultValue={tagsInputValue}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="Next.js 16, TypeScript, Tailwind CSS, PostgreSQL, JWT"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 font-mono outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                />
                <p className="text-[10px] text-zinc-400">Contoh: Next.js, React, Node.js, PostgreSQL</p>
              </div>

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
            {activeSection === "case_study" && "Tab 2 dari 3: Detail Studi Kasus"}
            {activeSection === "links" && "Tab 3 dari 3: Tech Stack & Media"}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-700 transition cursor-pointer"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={uploadingImage || !data.title.trim() || !data.description.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-xs font-medium text-white shadow-2xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
