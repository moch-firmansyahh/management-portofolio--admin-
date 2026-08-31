import React from "react";
import { Plus, Edit3, Trash2, RefreshCw, ExternalLink, Briefcase, Star, Github } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  tags?: string[];
  category?: "Web App" | "E-Commerce" | "Dashboard" | "Landing Page" | string;
  featured?: boolean;
  image: string;
  link?: string;
  demoUrl?: string;
  githubUrl?: string;
  metrics?: string;
  highlights?: string[];
  year?: string;
  createdAt?: any;
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
  handleSeedDefaultData?: () => void;
  isSeeding?: boolean;
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
  handleSeedDefaultData,
  isSeeding,
}: ProjectsTabProps) {
  const filteredProjects = projects.filter((project) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const tagsStr = (project.tags || []).join(" ").toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      (project.subtitle && project.subtitle.toLowerCase().includes(query)) ||
      (project.category && project.category.toLowerCase().includes(query)) ||
      tagsStr.includes(query) ||
      (project.link && project.link.toLowerCase().includes(query)) ||
      (project.demoUrl && project.demoUrl.toLowerCase().includes(query))
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
            Total {projects.length} proyek aktif tersimpan di Firestore dan terhubung ke Website.
            {searchQuery && (
              <span className="text-zinc-900 font-medium ml-1">
                (Menampilkan {filteredProjects.length} hasil)
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {handleSeedDefaultData && (
            <button
              onClick={handleSeedDefaultData}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-2 rounded-lg text-xs font-medium border border-emerald-200/80 shadow-2xs transition disabled:opacity-50 active:scale-98"
              title="Sinkronkan data bawaan web ke Firestore"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSeeding ? "animate-spin" : ""}`} />
              <span>{isSeeding ? "Menyinkronkan..." : "Impor Data Bawaan Web"}</span>
            </button>
          )}

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
              <th className="py-3 px-6">Judul & Kategori</th>
              <th className="py-3 px-6">Deskripsi & Tags</th>
              <th className="py-3 px-6">Tautan Live / Repo</th>
              <th className="py-3 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/60">
            {filteredProjects.map((project) => {
              const previewUrl = getProjectPreview(project.image, project.demoUrl || project.link || "");
              return (
                <tr
                  key={project.id}
                  className="hover:bg-zinc-50/60 transition-colors"
                >
                  <td className="py-3.5 px-6">
                    <div className="h-12 w-20 bg-zinc-100 rounded-md overflow-hidden border border-zinc-200/80 flex items-center justify-center shrink-0 relative">
                      <img
                        src={previewUrl}
                        alt={project.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.onerror = null;
                          img.src = "/assets/portofolio.png";
                        }}
                      />
                      {project.featured && (
                        <span className="absolute top-1 right-1 bg-amber-500 text-white p-0.5 rounded-full shadow-xs" title="Featured Project">
                          <Star className="h-2.5 w-2.5 fill-current" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-6 max-w-[220px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-zinc-900 truncate block">
                        {project.title}
                      </span>
                      {project.category && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {project.category}
                        </span>
                      )}
                    </div>
                    {project.subtitle && (
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {project.subtitle}
                      </p>
                    )}
                  </td>
                  <td
                    className="py-3.5 px-6 text-zinc-500 max-w-[280px]"
                  >
                    <p className="truncate text-zinc-700" title={project.description}>
                      {project.description}
                    </p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-1">
                        {project.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-1 py-0.2 rounded text-[9px] bg-zinc-100 text-zinc-600">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[9px] text-zinc-400">+{project.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex flex-col gap-1">
                      {(project.demoUrl || project.link) && (project.demoUrl || project.link) !== "#" ? (
                        <a
                          href={project.demoUrl || project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : null}
                      {project.githubUrl && project.githubUrl !== "#" ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:underline"
                        >
                          <Github className="h-3 w-3" />
                          <span>GitHub</span>
                        </a>
                      ) : null}
                      {!project.demoUrl && !project.githubUrl && (!project.link || project.link === "#") && (
                        <span className="text-zinc-400 font-mono text-[11px]">n/a</span>
                      )}
                    </div>
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
              );
            })}
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

