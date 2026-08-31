import React from "react";
import { X, CheckCircle2 } from "lucide-react";

export interface Experience {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  technologies: string[];
  type: "Work" | "Education" | "Freelance";
  createdAt?: any;
}

interface ExperienceModalProps {
  isOpen: boolean;
  isEdit: boolean;
  data: Experience;
  setData: React.Dispatch<React.SetStateAction<Experience>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function ExperienceModal({
  isOpen,
  isEdit,
  data,
  setData,
  onSubmit,
  onClose,
}: ExperienceModalProps) {
  if (!isOpen) return null;

  const isFormValid =
    data.role.trim().length > 0 &&
    data.company.trim().length > 0 &&
    data.period.trim().length > 0;

  const techsInputValue = (data.technologies || []).join(", ");

  const handleTechsChange = (val: string) => {
    const arr = val.split(",").map((s) => s.trim()).filter(Boolean);
    setData((prev) => ({ ...prev, technologies: arr }));
  };

  return (
    <div className="admin-modal-overlay">
      <form
        onSubmit={onSubmit}
        className="max-w-lg w-full bg-white border border-zinc-200/90 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-dialog-show"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-150 px-6 py-4 bg-zinc-50/50">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              {isEdit ? "Edit Riwayat Pengalaman" : "Tambah Riwayat Pengalaman"}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Data akan tampil pada garis waktu (timeline) di portofolio web.
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Posisi / Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={data.role || ""}
                onChange={(e) => setData((prev) => ({ ...prev, role: e.target.value }))}
                placeholder="Study Group Member / Frontend Dev"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Instansi / Perusahaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={data.company || ""}
                onChange={(e) => setData((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="Telkom University / Google"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Periode Waktu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={data.period || ""}
                onChange={(e) => setData((prev) => ({ ...prev, period: e.target.value }))}
                placeholder="Feb 2026 - Present"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Tipe Pengalaman
              </label>
              <select
                value={data.type || "Work"}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    type: e.target.value as "Work" | "Education" | "Freelance",
                  }))
                }
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900"
              >
                <option value="Work">Work / Organisasi</option>
                <option value="Education">Education / Studi</option>
                <option value="Freelance">Freelance / Proyek</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
              Lokasi
            </label>
            <input
              type="text"
              value={data.location || ""}
              onChange={(e) => setData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Bandung, West Java, Indonesia"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
              Deskripsi Tanggung Jawab &amp; Kontribusi
            </label>
            <textarea
              rows={4}
              value={data.description || ""}
              onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Deskripsikan peran, kontribusi, dan hal yang dipelajari selama kegiatan..."
              className="w-full rounded-lg border border-zinc-200 bg-white p-3.5 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
              Teknologi / Skill yang Digunakan (Pisahkan Koma)
            </label>
            <input
              type="text"
              value={techsInputValue}
              onChange={(e) => handleTechsChange(e.target.value)}
              placeholder="Next.js, React, Tailwind CSS, REST API"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 font-mono"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 p-4 px-6 border-t border-zinc-150 bg-zinc-50/50">
          <button
            type="button"
            className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-700 transition"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-xs font-medium text-white shadow-2xs transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Simpan Pengalaman</span>
          </button>
        </div>
      </form>
    </div>
  );
}
