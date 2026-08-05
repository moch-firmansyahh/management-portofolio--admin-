import React from "react";
import { Plus, Edit3, Trash2, RefreshCw, Code2 } from "lucide-react";

export interface Skill {
  id: string;
  name: string;
  logo: string;
  percent: number;
}

interface SkillsTabProps {
  skills: Skill[];
  searchQuery: string;
  syncingSkills: boolean;
  handleSyncSkillsGitHub: () => void;
  openAddSkill: () => void;
  openEditSkill: (skill: Skill) => void;
  handleDeleteSkill: (id: string) => void;
}

export default function SkillsTab({
  skills,
  searchQuery,
  syncingSkills,
  handleSyncSkillsGitHub,
  openAddSkill,
  openEditSkill,
  handleDeleteSkill,
}: SkillsTabProps) {
  const filteredSkills = skills.filter((skill) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      skill.name.toLowerCase().includes(query) ||
      skill.logo.toLowerCase().includes(query)
    );
  });

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-2xs space-y-0 overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-zinc-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
        <div>
          <h3 className="font-semibold text-base text-zinc-900 flex items-center gap-2">
            <Code2 className="h-4.5 w-4.5 text-zinc-900" />
            <span>Keahlian & Technical Skills</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Daftar total {skills.length} keahlian yang tersinkronisasi di Firestore.
            {searchQuery && (
              <span className="text-zinc-900 font-medium ml-1">
                (Menampilkan {filteredSkills.length} hasil)
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSyncSkillsGitHub}
            disabled={syncingSkills}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-zinc-50 text-zinc-800 px-3 py-2 rounded-lg text-xs font-medium border border-zinc-200/80 shadow-2xs transition disabled:opacity-50 active:scale-98"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncingSkills ? "animate-spin" : ""}`} />
            <span>{syncingSkills ? "Menyinkronkan..." : "Impor GitHub"}</span>
          </button>
          
          <button
            onClick={openAddSkill}
            className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-lg text-xs font-medium shadow-2xs transition active:scale-98"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Skill</span>
          </button>
        </div>
      </div>

      {/* Shadcn Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-zinc-500 font-semibold tracking-wider uppercase text-[10px]">
              <th className="py-3 px-6">Badge / Badge Code</th>
              <th className="py-3 px-6">Nama Keahlian</th>
              <th className="py-3 px-6">Tingkat Penguasaan</th>
              <th className="py-3 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/60">
            {filteredSkills.map((skill) => (
              <tr key={skill.id} className="hover:bg-zinc-50/60 transition-colors">
                <td className="py-3.5 px-6">
                  <span className="inline-flex h-8 w-9 items-center justify-center rounded-md bg-zinc-100 border border-zinc-200 text-zinc-900 font-mono font-bold text-[11px]">
                    {skill.logo}
                  </span>
                </td>
                <td className="py-3.5 px-6 font-medium text-zinc-900 text-xs">
                  {skill.name}
                </td>
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-medium text-zinc-700 w-8">
                      {skill.percent}%
                    </span>
                    <div className="w-36 h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/60">
                      <div 
                        className="bg-zinc-900 h-full rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(100, Math.max(0, skill.percent))}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-6 text-right">
                  <div className="flex justify-end items-center gap-1">
                    <button 
                      onClick={() => openEditSkill(skill)}
                      className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition"
                      title="Edit Skill"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                      title="Hapus Skill"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSkills.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-zinc-400 text-xs">
                  {searchQuery 
                    ? `Tidak ada keahlian yang cocok dengan pencarian "${searchQuery}".` 
                    : "Belum ada keahlian terdaftar di database."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
