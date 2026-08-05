import React from "react";
import { Plus, Edit3, Trash2, RefreshCw, ExternalLink, Briefcase, Image as ImageIcon } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface ProjectsTabProps {
  projects: Project[];
  searchQuery: string;
  syncingGit: boolean;
  handleSyncGitHub: () => void;
  openAddProject: () => void;
  openEditProject: (project: Project) => void;
  handleDeleteProject: (id: string) => void;
  getProjectPreview: (image: string, link: string) => string;
}

export default function ProjectsTab({
  projects,
  searchQuery,
  syncingGit,
  handleSyncGitHub,
  openAddProject,
  openEditProject,
  handleDeleteProject,
  getProjectPreview,
}: ProjectsTabProps) {
  const filteredProjects = projects.filter((project) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.link.toLowerCase().includes(query)
    );
  });

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-2xs space-y-0 overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-zinc-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
        <div>
          <h3 className="font-semibold text-base text-zinc-900 flex items-center gap-2">
            <Briefcase className="h-4.5 w-4.5 text-zinc-900" />
            <span>Daftar Proyek & Portofolio</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Total {projects.length} proyek aktif tersimpan di Firestore.
            {searchQuery && (
              <span className="text-zinc-900 font-medium ml-1">
                (Menampilkan {filteredProjects.length} hasil)
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSyncGitHub}
            disabled={syncingGit}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-zinc-50 text-zinc-800 px-3 py-2 rounded-lg text-xs font-medium border border-zinc-200/80 shadow-2xs transition disabled:opacity-50 active:scale-98"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncingGit ? "animate-spin" : ""}`} />
            <span>{syncingGit ? "Menyinkronkan..." : "Impor Repositori GitHub"}</span>
          </button>

          <button
            onClick={openAddProject}
            className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-lg text-xs font-medium shadow-2xs transition active:scale-98"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Proyek</span>
          </button>
        </div>
      </div>

      {/* Shadcn Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-zinc-500 font-semibold tracking-wider uppercase text-[10px]">
              <th className="py-3 px-6">Preview</th>
              <th className="py-3 px-6">Judul Proyek</th>
              <th className="py-3 px-6">Deskripsi</th>
              <th className="py-3 px-6">Tautan Demo</th>
              <th className="py-3 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/60">
            {filteredProjects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-zinc-50/60 transition-colors"
              >
                <td className="py-3.5 px-6">
                  <div className="h-10 w-16 bg-zinc-100 rounded-md overflow-hidden border border-zinc-200/80 flex items-center justify-center shrink-0">
                    <img
                      src={getProjectPreview(project.image, project.link)}
                      alt={project.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.onerror = null;
                        img.src = "/assets/portofolio.png";
                      }}
                    />
                  </div>
                </td>
                <td className="py-3.5 px-6 font-semibold text-zinc-900 max-w-[200px] truncate">
                  {project.title}
                </td>
                <td
                  className="py-3.5 px-6 text-zinc-500 max-w-[300px] truncate"
                  title={project.description}
                >
                  {project.description}
                </td>
                <td className="py-3.5 px-6">
                  {project.link && project.link !== "#" ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-zinc-800 hover:text-zinc-900 hover:underline"
                    >
                      <span>Preview</span>
                      <ExternalLink className="h-3 w-3 text-zinc-500" />
                    </a>
                  ) : (
                    <span className="text-zinc-400 font-mono text-[11px]">n/a</span>
                  )}
                </td>
                <td className="py-3.5 px-6 text-right">
                  <div className="flex justify-end items-center gap-1">
                    <button
                      onClick={() => openEditProject(project)}
                      className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition"
                      title="Edit Proyek"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                      title="Hapus Proyek"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-zinc-400 text-xs">
                  {searchQuery
                    ? `Tidak ada proyek yang cocok dengan kata kunci "${searchQuery}".`
                    : "Belum ada data proyek di database Firestore."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
