import React from "react";
import { Upload } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

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
      <form onSubmit={onSubmit} className="admin-modal max-w-md w-full bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl space-y-5">
        <h2 className="text-xl font-bold border-b border-gray-150 pb-3 text-gray-900">
          {isEdit ? "Edit Proyek" : "Tambah Proyek"}
        </h2>
        
        <div className="admin-input-group space-y-1.5">
          <label htmlFor="project-title" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Judul Proyek</label>
          <input
            type="text"
            id="project-title"
            value={data.title}
            onChange={(e) =>
              setData(prev => ({ ...prev, title: e.target.value }))
            }
            placeholder="Contoh: E-Commerce Web App"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#4f46e5] focus:bg-white transition"
            required
          />
        </div>

        <div className="admin-input-group space-y-1.5">
          <label htmlFor="project-desc" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Deskripsi Singkat</label>
          <textarea
            id="project-desc"
            value={data.description}
            onChange={(e) =>
              setData(prev => ({ ...prev, description: e.target.value }))
            }
            placeholder="Tulis deskripsi proyek..."
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#4f46e5] focus:bg-white transition resize-none"
            required
          ></textarea>
        </div>

        <div className="admin-input-group space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Gambar Proyek</label>
          
          {/* Image Preview */}
          {data.image && (
            <div className="relative h-32 w-full rounded-xl overflow-hidden border border-gray-150 bg-gray-50 flex items-center justify-center">
              <img
                src={data.image}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as any).onerror = null;
                  (e.target as any).src = "https://api.dicebear.com/7.x/identicon/svg";
                }}
              />
              <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-semibold">
                Aktif
              </div>
            </div>
          )}

          {/* File Input Zone */}
          <div className="relative">
            <input
              type="file"
              id="project-image-file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="project-image-file"
              className="flex items-center justify-center gap-2 cursor-pointer w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-[#4f46e5] bg-gray-50 px-4 py-3.5 text-xs text-gray-600 hover:text-[#4f46e5] transition font-bold"
            >
              <Upload className="h-4 w-4 text-gray-400" />
              <span>{uploadingImage ? "Mengunggah..." : "Pilih File Gambar (PNG, JPG)"}</span>
            </label>
          </div>
        </div>

        <div className="admin-input-group space-y-1.5">
          <label htmlFor="project-link" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Link Proyek / Demo</label>
          <input
            type="text"
            id="project-link"
            value={data.link}
            onChange={(e) =>
              setData(prev => ({ ...prev, link: e.target.value }))
            }
            placeholder="https://github.com/..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#4f46e5] focus:bg-white transition"
            required
          />
        </div>

        <div className="flex gap-3 pt-3 border-t border-gray-150">
          <button
            type="button"
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition"
            onClick={onClose}
          >
            Kembali
          </button>
          <button 
            type="submit" 
            className="flex-1.5 rounded-xl bg-[#1e1b4b] hover:bg-[#1a1843] py-3 text-sm font-semibold text-white transition"
          >
            Simpan Proyek
          </button>
        </div>
      </form>
    </div>
  );
}
