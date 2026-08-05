import React from "react";
import { Upload, Loader2, X } from "lucide-react";
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
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <form onSubmit={onSubmit} className="max-w-md w-full bg-white border border-zinc-200/90 p-6 rounded-xl shadow-xl space-y-4 animate-dialog-show">
        <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              {isEdit ? "Edit Proyek" : "Tambah Proyek Baru"}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Isi data detail proyek portofolio Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="project-title" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Judul Proyek
          </label>
          <input
            type="text"
            id="project-title"
            value={data.title}
            onChange={(e) =>
              setData(prev => ({ ...prev, title: e.target.value }))
            }
            placeholder="Contoh: Modern E-Commerce Dashboard"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="project-desc" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Deskripsi Singkat
          </label>
          <textarea
            id="project-desc"
            value={data.description}
            onChange={(e) =>
              setData(prev => ({ ...prev, description: e.target.value }))
            }
            placeholder="Tulis ringkasan singkat mengenai fitur dan teknologi proyek..."
            rows={3}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all resize-none"
            required
          ></textarea>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Gambar Header / Cover Proyek
          </label>
          
          {data.image && (
            <div className="relative h-28 w-full rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 flex items-center justify-center">
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
              className={`flex items-center justify-center gap-2 cursor-pointer w-full rounded-lg border border-dashed border-zinc-300 hover:border-zinc-900 bg-zinc-50/60 px-3.5 py-2.5 text-xs text-zinc-600 hover:text-zinc-900 transition font-medium ${
                uploadingImage ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              {uploadingImage ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-900" />
                  <span>Mengunggah Berkas...</span>
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Unggah Gambar (PNG, JPG, WEBP)</span>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="project-link" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Tautan Demo / GitHub Repository
          </label>
          <input
            type="text"
            id="project-link"
            value={data.link}
            onChange={(e) =>
              setData(prev => ({ ...prev, link: e.target.value }))
            }
            placeholder="https://github.com/moch-firmansyahh/..."
            className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 font-mono placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
            required
          />
        </div>

        <div className="flex gap-2 pt-3 border-t border-zinc-150 justify-end">
          <button
            type="button"
            className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-700 transition"
            onClick={onClose}
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={uploadingImage}
            className="rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-xs font-medium text-white shadow-2xs transition disabled:opacity-50"
          >
            Simpan Proyek
          </button>
        </div>
      </form>
    </div>
  );
}
