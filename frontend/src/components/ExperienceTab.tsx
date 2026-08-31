import React from "react";
import { Plus, Edit3, Trash2, RefreshCw, Briefcase, MapPin, Calendar, Building2 } from "lucide-react";
import { Experience } from "./ExperienceModal";

interface ExperienceTabProps {
  experiences: Experience[];
  searchQuery: string;
  isSeeding: boolean;
  handleSeedDefaultExperience: () => void;
  openAddExperience: () => void;
  openEditExperience: (exp: Experience) => void;
  handleDeleteExperience: (id: string) => void;
}

export default function ExperienceTab({
  experiences,
  searchQuery,
  isSeeding,
  handleSeedDefaultExperience,
  openAddExperience,
  openEditExperience,
  handleDeleteExperience,
}: ExperienceTabProps) {
  const filteredExperiences = experiences.filter((exp) => {
    const query = searchQuery.toLowerCase();
    const techStr = (exp.technologies || []).join(" ").toLowerCase();
    return (
      exp.role.toLowerCase().includes(query) ||
      exp.company.toLowerCase().includes(query) ||
      exp.location.toLowerCase().includes(query) ||
      exp.description.toLowerCase().includes(query) ||
      techStr.includes(query)
    );
  });

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-2xs space-y-0 overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-zinc-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
        <div>
          <h3 className="font-semibold text-base text-zinc-900 flex items-center gap-2">
            <Briefcase className="h-4.5 w-4.5 text-zinc-900" />
            <span>Riwayat Pengalaman &amp; Karier</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Total {experiences.length} riwayat aktif tersimpan di Firestore dan ditampilkan pada timeline website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSeedDefaultExperience}
            disabled={isSeeding}
            className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-2 rounded-lg text-xs font-medium border border-emerald-200/80 shadow-2xs transition disabled:opacity-50 active:scale-98 cursor-pointer"
            title="Impor riwayat bawaan website ke Firestore"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSeeding ? "animate-spin" : ""}`} />
            <span>{isSeeding ? "Menyinkronkan..." : "Impor Pengalaman Bawaan"}</span>
          </button>

          <button
            onClick={openAddExperience}
            className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-lg text-xs font-medium shadow-2xs transition active:scale-98 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Pengalaman</span>
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-zinc-500 font-semibold tracking-wider uppercase text-[10px]">
              <th className="py-3 px-6">Posisi &amp; Instansi</th>
              <th className="py-3 px-6">Periode &amp; Lokasi</th>
              <th className="py-3 px-6">Tipe</th>
              <th className="py-3 px-6">Teknologi / Skill</th>
              <th className="py-3 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-150">
            {filteredExperiences.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Briefcase className="h-8 w-8 text-zinc-300 stroke-[1.5]" />
                    <span className="font-medium text-xs text-zinc-600">
                      {searchQuery ? "Tidak ada riwayat yang cocok." : "Belum ada riwayat pengalaman tersimpan di Firestore."}
                    </span>
                    <p className="text-[11px] text-zinc-400 max-w-sm">
                      Klik tombol &ldquo;Impor Pengalaman Bawaan&rdquo; di atas untuk menyinkronkan riwayat studi &amp; organisasi dari website.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredExperiences.map((exp) => (
                <tr key={exp.id} className="hover:bg-zinc-50/60 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-zinc-900 text-xs">{exp.role}</h4>
                      <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-zinc-400" />
                        <span>{exp.company}</span>
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-0.5">
                      <span className="font-medium text-zinc-800 text-xs flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-zinc-400" />
                        {exp.period}
                      </span>
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-zinc-400" />
                        {exp.location}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                        exp.type === "Education"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : exp.type === "Freelance"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {exp.type || "Work"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(exp.technologies || []).slice(0, 3).map((t) => (
                        <span key={t} className="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px] border border-zinc-200/60">
                          {t}
                        </span>
                      ))}
                      {(exp.technologies || []).length > 3 && (
                        <span className="px-1.5 py-0.5 bg-zinc-50 text-zinc-400 rounded text-[10px]">
                          +{(exp.technologies || []).length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <button
                        onClick={() => openEditExperience(exp)}
                        className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition cursor-pointer"
                        title="Edit Riwayat"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer"
                        title="Hapus Riwayat"
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
