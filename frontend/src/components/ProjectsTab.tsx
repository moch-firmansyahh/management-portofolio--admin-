import React from "react";
import { Plus, Edit3, Trash2, RefreshCw, ExternalLink, Briefcase } from "lucide-react";

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
    <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-[#4f46e5]" />
            <span>Proyek Terdaftar</span>
          </h3>
          <p className="text-xs text-gray-500">
            Total {projects.length} proyek aktif di database Firebase.
            {searchQuery && (
              <span className="text-[#4f46e5] font-semibold ml-1">
                (Menampilkan {filteredProjects.length} hasil pencarian)
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSyncGitHub}
            disabled={syncingGit}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2.5 rounded-xl text-xs font-bold transition border border-gray-200 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncingGit ? "animate-spin" : ""}`} />
            <span>{syncingGit ? "Menyinkronkan..." : "Sinkronisasi GitHub"}</span>
          </button>

          <button
            onClick={openAddProject}
            className="flex items-center gap-1.5 bg-[#1e1b4b] hover:bg-[#1a1843] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Proyek</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-150 text-gray-400 font-bold text-xs uppercase tracking-wider">
              <th className="py-4 px-4">Preview</th>
              <th className="py-4 px-4">Judul Proyek</th>
              <th className="py-4 px-4">Deskripsi</th>
              <th className="py-4 px-4">Link Demo</th>
              <th className="py-4 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition duration-150"
              >
                <td className="py-4 px-4">
                  <img
                    src={getProjectPreview(project.image, project.link)}
                    alt={project.title}
                    className="h-10 w-16 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.onerror = null;
                      img.src = "/assets/portofolio.png";
                    }}
                  />
                </td>
                <td className="py-4 px-4 font-semibold text-gray-900 truncate max-w-[180px]">
                  {project.title}
                </td>
                <td
                  className="py-4 px-4 text-gray-500 text-xs truncate max-w-[280px]"
                  title={project.description}
                >
                  {project.description}
                </td>
                <td className="py-4 px-4">
                  {project.link && project.link !== "#" ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4f46e5] hover:underline flex items-center gap-1 text-xs font-semibold"
                    >
                      <span>Demo</span> <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs">Tidak ada</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEditProject(project)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-[#4f46e5] hover:text-[#4f46e5] transition shadow-sm"
                      title="Edit Proyek"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-red-500 hover:text-red-500 transition shadow-sm"
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
                <td colSpan={5} className="py-10 text-center text-gray-400 text-sm">
                  {searchQuery
                    ? `Tidak ada proyek yang cocok dengan kata kunci "${searchQuery}".`
                    : "Belum ada data proyek di database Firebase."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
