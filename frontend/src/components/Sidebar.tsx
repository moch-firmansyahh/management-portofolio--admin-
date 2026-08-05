import React from "react";
import { LayoutDashboard, Code2, Briefcase, LogOut, Shield, ChevronRight } from "lucide-react";
import { GitHubProfile } from "./DashboardTab";

interface SidebarProps {
  activeMenu: "dashboard" | "skills" | "projects";
  setActiveMenu: (menu: "dashboard" | "skills" | "projects") => void;
  skillsCount: number;
  projectsCount: number;
  gitProfile: GitHubProfile | null;
  handleImgError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  handleLogout: () => void;
}

export default function Sidebar({
  activeMenu,
  setActiveMenu,
  skillsCount,
  projectsCount,
  gitProfile,
  handleImgError,
  handleLogout,
}: SidebarProps) {
  const getAvatarUrl = () => {
    return gitProfile?.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg?seed=Firmansyah";
  };

  return (
    <aside className="w-64 border-r border-zinc-200/80 bg-white flex flex-col justify-between shrink-0 min-h-screen select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-zinc-150 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-900/10">
              <LayoutDashboard className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-tight text-zinc-900 leading-none">
                Admin Board
              </h1>
              <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase mt-1 block">
                Portfolio Suite
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 border border-zinc-200">
            <Shield className="h-2.5 w-2.5 text-zinc-500" />
            <span>v2.0</span>
          </span>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-6">
          {/* Main Menu */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Ringkasan Utama
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveMenu("dashboard")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  activeMenu === "dashboard"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard Analitik</span>
                </div>
                {activeMenu === "dashboard" && (
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                )}
              </button>
            </nav>
          </div>

          {/* Management Menu */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Manajemen Data
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveMenu("skills")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  activeMenu === "skills"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Code2 className="h-4 w-4" />
                  <span>Keahlian & Skills</span>
                </div>
                <span
                  className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                    activeMenu === "skills"
                      ? "bg-zinc-800 text-zinc-200"
                      : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                  }`}
                >
                  {skillsCount}
                </span>
              </button>

              <button
                onClick={() => setActiveMenu("projects")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  activeMenu === "projects"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="h-4 w-4" />
                  <span>Proyek & Portofolio</span>
                </div>
                <span
                  className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                    activeMenu === "projects"
                      ? "bg-zinc-800 text-zinc-200"
                      : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                  }`}
                >
                  {projectsCount}
                </span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-zinc-200/80 bg-zinc-50/50 space-y-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <img
            src={getAvatarUrl()}
            alt="avatar"
            className="h-9 w-9 rounded-full ring-1 ring-zinc-300 object-cover shrink-0"
            onError={handleImgError}
          />
          <div className="overflow-hidden min-w-0">
            <p className="text-xs font-semibold text-zinc-900 truncate">
              {gitProfile?.name || "Moch Firmansyah"}
            </p>
            <p className="text-[10px] text-zinc-500 truncate">
              @{gitProfile?.login || "moch-firmansyahh"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 bg-white border border-zinc-200/80 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-150 shadow-2xs"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}
