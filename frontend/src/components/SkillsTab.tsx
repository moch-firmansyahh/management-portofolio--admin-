import React, { useState } from "react";
import { Plus, Edit3, Trash2, RefreshCw, Code2, Sparkles } from "lucide-react";
import { SKILL_CATEGORIES } from "./SkillModal";

export interface Skill {
  id: string;
  name: string;
  logo: string;
  percent: number | string;
  category?: string;
}

interface SkillsTabProps {
  skills: Skill[];
  searchQuery: string;
  syncingSkills: boolean;
  handleSyncSkillsGitHub: () => void;
  openAddSkill: (defaultCategory?: string) => void;
  openEditSkill: (skill: Skill) => void;
  handleDeleteSkill: (id: string) => void;
  handleSeedDefaultSkills?: () => void;
  isSeedingSkills?: boolean;
}

export default function SkillsTab({
  skills,
  searchQuery,
  syncingSkills,
  handleSyncSkillsGitHub,
  openAddSkill,
  openEditSkill,
  handleDeleteSkill,
  handleSeedDefaultSkills,
  isSeedingSkills = false,
}: SkillsTabProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");

  // Dynamically include any custom categories created by the user
  const customCategories = Array.from(
    new Set(skills.map((s) => s.category).filter(Boolean) as string[])
  ).filter((c) => !SKILL_CATEGORIES.includes(c));

  const categories = ["Semua", ...SKILL_CATEGORIES, ...customCategories];

  const filteredSkills = skills.filter((skill) => {
    // 1. Filter by category
    const skillCat = skill.category || "Front-End Web Development";
    if (activeCategory !== "Semua" && skillCat.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }

    // 2. Filter by search query
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      skill.name.toLowerCase().includes(query) ||
      skill.logo.toLowerCase().includes(query) ||
      skillCat.toLowerCase().includes(query)
    );
  });

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-2xs space-y-0 overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-zinc-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
        <div>
          <h3 className="font-semibold text-base text-zinc-900 flex items-center gap-2">
            <Code2 className="h-4.5 w-4.5 text-zinc-900" />
            <span>Keahlian &amp; Technical Skills</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Total {skills.length} keahlian terkelola dalam 5 kategori teknis di Firestore.
            {searchQuery && (
              <span className="text-zinc-900 font-medium ml-1">
                (Menampilkan {filteredSkills.length} hasil)
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {handleSeedDefaultSkills && (
            <button
              onClick={handleSeedDefaultSkills}
              disabled={isSeedingSkills}
              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-2 rounded-lg text-xs font-medium border border-emerald-200/80 shadow-2xs transition disabled:opacity-50 active:scale-98 cursor-pointer"
              title="Impor seluruh keahlian bawaan website ke Firestore"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSeedingSkills ? "animate-spin" : ""}`} />
              <span>{isSeedingSkills ? "Menyinkronkan..." : "Impor Skill Bawaan Web"}</span>
            </button>
          )}

          <button
            onClick={handleSyncSkillsGitHub}
            disabled={syncingSkills}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-zinc-50 text-zinc-800 px-3 py-2 rounded-lg text-xs font-medium border border-zinc-200/80 shadow-2xs transition disabled:opacity-50 active:scale-98 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncingSkills ? "animate-spin" : ""}`} />
            <span>{syncingSkills ? "Menyinkronkan..." : "Impor GitHub"}</span>
          </button>
          
          <button
            onClick={() => openAddSkill(activeCategory !== "Semua" ? activeCategory : "Front-End Web Development")}
            className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-lg text-xs font-medium shadow-2xs transition active:scale-98 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Skill</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills (Matching exact UI) */}
      <div className="p-4 px-6 border-b border-zinc-150 bg-zinc-50/50 flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const count =
            cat === "Semua"
              ? skills.length
              : skills.filter((s) => (s.category || "Front-End Web Development").toLowerCase() === cat.toLowerCase()).length;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-zinc-900 text-white shadow-xs"
                  : "bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200/90 hover:border-zinc-400"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Shadcn Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-zinc-500 font-semibold tracking-wider uppercase text-[10px]">
              <th className="py-3 px-6">Badge / Logo</th>
              <th className="py-3 px-6">Nama Skill</th>
              <th className="py-3 px-6">Kategori</th>
              <th className="py-3 px-6">Penguasaan (%)</th>
              <th className="py-3 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-150">
            {filteredSkills.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Code2 className="h-8 w-8 text-zinc-300 stroke-[1.5]" />
                    <span className="font-medium text-xs text-zinc-600">
                      {searchQuery ? "Tidak ada skill yang cocok dengan pencarian." : `Belum ada skill dalam kategori "${activeCategory}".`}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Klik &ldquo;Tambah Skill&rdquo; untuk menambahkan keahlian baru ke dalam kategori ini.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSkills.map((skill) => (
                <tr key={skill.id} className="hover:bg-zinc-50/60 transition-colors group">
                  <td className="py-3.5 px-6">
                    <span className="h-8 w-8 rounded-lg bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                      {skill.logo}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-medium text-zinc-900 text-xs">
                    {skill.name}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {skill.category || "Front-End Web Development"}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-medium text-zinc-700 w-8">
                        {skill.percent}%
                      </span>
                      <div className="w-36 h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/60">
                        <div 
                          className="bg-zinc-900 h-full rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(100, Math.max(0, Number(skill.percent) || 0))}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <button 
                        onClick={() => openEditSkill(skill)}
                        className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition cursor-pointer"
                        title="Edit Skill"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer"
                        title="Hapus Skill"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
