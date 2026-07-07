import React from "react";
import { Plus, Edit3, Trash2, RefreshCw } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  logo: string;
  percent: number;
}

interface SkillsTabProps {
  skills: Skill[];
  syncingSkills: boolean;
  handleSyncSkillsGitHub: () => void;
  openAddSkill: () => void;
  openEditSkill: (skill: Skill) => void;
  handleDeleteSkill: (id: string) => void;
}

export default function SkillsTab({
  skills,
  syncingSkills,
  handleSyncSkillsGitHub,
  openAddSkill,
  openEditSkill,
  handleDeleteSkill,
}: SkillsTabProps) {
  return (
    <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Keahlian Terdaftar</h3>
          <p className="text-xs text-gray-500">Total {skills.length} keahlian aktif di database.</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={handleSyncSkillsGitHub}
            disabled={syncingSkills}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2.5 rounded-xl text-xs font-bold transition border border-gray-200 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncingSkills ? "animate-spin" : ""}`} />
            <span>Sinkronisasi Skill GitHub</span>
          </button>
          <button 
            onClick={openAddSkill}
            className="flex items-center gap-1.5 bg-[#1e1b4b] hover:bg-[#1a1843] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Skill</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-150 text-gray-400 font-bold text-xs uppercase tracking-wider">
              <th className="py-4 px-4">Singkatan</th>
              <th className="py-4 px-4">Nama Keahlian</th>
              <th className="py-4 px-4">Tingkat Penguasaan</th>
              <th className="py-4 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition duration-150">
                <td className="py-4 px-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-bold uppercase text-[#4f46e5]">
                    {skill.logo}
                  </span>
                </td>
                <td className="py-4 px-4 font-semibold text-gray-900">{skill.name}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold w-10 text-xs text-gray-700">{skill.percent}%</span>
                    <div className="w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-[#4f46e5] h-full" style={{ width: `${skill.percent}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => openEditSkill(skill)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-[#4f46e5] hover:text-[#4f46e5] transition shadow-sm"
                      title="Edit"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-red-500 hover:text-red-500 transition shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {skills.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">Belum ada data skill di Supabase.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
