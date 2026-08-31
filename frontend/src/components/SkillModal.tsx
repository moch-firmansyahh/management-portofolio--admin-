import React, { useState } from "react";
import { X, Plus, Check } from "lucide-react";

export interface Skill {
  id: string;
  name: string;
  logo: string;
  percent: number | string;
  category?: string;
}

export interface PopularSkill {
  name: string;
  logo: string;
  category?: string;
}

export const SKILL_CATEGORIES = [
  "Front-End Web Development",
  "Programming Languages",
  "Developer Tools",
  "Soft Skills & Professional",
  "Achievements & Certifications",
];

interface SkillModalProps {
  isOpen: boolean;
  isEdit: boolean;
  data: Skill;
  setData: React.Dispatch<React.SetStateAction<Skill>>;
  popularSkills: PopularSkill[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function SkillModal({
  isOpen,
  isEdit,
  data,
  setData,
  popularSkills,
  onSubmit,
  onClose,
}: SkillModalProps) {
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  if (!isOpen) return null;

  const currentCategory = data.category || "Front-End Web Development";
  const isPredefined = SKILL_CATEGORIES.includes(currentCategory);

  const isFormValid =
    data.name.trim().length > 0 &&
    data.logo.trim().length > 0 &&
    currentCategory.trim().length > 0 &&
    data.percent !== "" &&
    !isNaN(Number(data.percent)) &&
    Number(data.percent) > 0 &&
    Number(data.percent) <= 100;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const customName = e.target.value;
    
    // Auto-fill logo and category if customName matches one of popular skills
    const foundPopular = popularSkills.find(s => s.name.toLowerCase() === customName.toLowerCase());
    let logoVal = data.logo;
    let categoryVal = data.category || "Front-End Web Development";

    if (foundPopular) {
      logoVal = foundPopular.logo;
      if (foundPopular.category) {
        categoryVal = foundPopular.category;
      }
    } else {
      if (customName.length > 0) {
        const words = customName.split(" ").filter(w => w);
        if (words.length >= 2) {
          logoVal = (words[0][0] + words[1][0]).toUpperCase().substring(0, 3);
        } else {
          logoVal = customName.substring(0, 3).toUpperCase();
        }
      } else {
        logoVal = "";
      }
    }

    setData(prev => ({
      ...prev,
      name: customName,
      logo: logoVal,
      category: categoryVal
    }));
  };

  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === "") {
      setData(prev => ({ ...prev, percent: "" }));
      return;
    }
    const val = parseInt(rawVal, 10);
    if (isNaN(val)) {
      setData(prev => ({ ...prev, percent: "" }));
      return;
    }
    const clamped = Math.max(1, Math.min(100, val));
    setData(prev => ({ ...prev, percent: clamped }));
  };

  return (
    <div className="admin-modal-overlay">
      <form onSubmit={onSubmit} className="max-w-md w-full bg-white border border-zinc-200/90 p-6 rounded-xl shadow-xl space-y-4 animate-dialog-show">
        <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              {isEdit ? "Edit Keahlian" : "Tambah Keahlian Baru"}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Pilih atau buat kategori baru, isi nama keahlian, dan persentase.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Category Selector with Custom Category Option */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="skill-category" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Kategori Keahlian
            </label>
            <button
              type="button"
              onClick={() => setIsCustomCategory(!isCustomCategory)}
              className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition cursor-pointer"
            >
              {isCustomCategory ? "Pilih dari daftar" : "+ Kategori Baru"}
            </button>
          </div>

          {isCustomCategory || (!isPredefined && isEdit) ? (
            <input
              type="text"
              id="skill-category-custom"
              value={data.category || ""}
              onChange={(e) => setData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Ketik nama kategori baru..."
              className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-medium"
              required
            />
          ) : (
            <select
              id="skill-category"
              value={data.category || "Front-End Web Development"}
              onChange={(e) => {
                if (e.target.value === "__custom__") {
                  setIsCustomCategory(true);
                  setData(prev => ({ ...prev, category: "" }));
                } else {
                  setData(prev => ({ ...prev, category: e.target.value }));
                }
              }}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-medium cursor-pointer"
            >
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__custom__">+ Tambah Kategori Kustom...</option>
            </select>
          )}
        </div>

        {/* Skill Name Input */}
        <div className="space-y-1.5">
          <label htmlFor="skill-name" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Nama Skill
          </label>
          <input
            type="text"
            id="skill-name"
            list="popular-skills"
            value={data.name}
            onChange={handleNameChange}
            placeholder="Pilih atau ketik nama skill..."
            className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
            required
          />
          <datalist id="popular-skills">
            {popularSkills.map(s => (
              <option key={s.name} value={s.name} />
            ))}
          </datalist>
        </div>

        {/* Badge / Shortcode */}
        <div className="space-y-1.5">
          <label htmlFor="skill-logo" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Badge / Singkatan (Maks 3 Karakter)
          </label>
          <input
            type="text"
            id="skill-logo"
            value={data.logo}
            onChange={(e) =>
              setData(prev => ({ ...prev, logo: e.target.value.substring(0, 3) }))
            }
            placeholder="Contoh: TS, PY, GO, GOO"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 font-mono placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
            required
          />
        </div>

        {/* Percentage */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="skill-percent" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Persentase Penguasaan (%)
            </label>
            <span className="text-[10px] text-zinc-400 font-mono">1 - 100%</span>
          </div>
          <input
            type="number"
            id="skill-percent"
            min="1"
            max="100"
            value={data.percent}
            onChange={handlePercentChange}
            placeholder="Ketik persentase (1 - 100)..."
            className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 font-mono placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
            required
          />
        </div>

        <div className="flex gap-2 pt-3 border-t border-zinc-150 justify-end">
          <button
            type="button"
            className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-700 transition cursor-pointer"
            onClick={onClose}
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={!isFormValid}
            className="rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 text-xs font-medium text-white shadow-2xs transition cursor-pointer"
          >
            Simpan Skill
          </button>
        </div>
      </form>
    </div>
  );
}
