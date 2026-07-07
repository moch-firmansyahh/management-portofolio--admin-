import React from "react";
import { LayoutDashboard, Code2, Briefcase, LogOut } from "lucide-react";

interface SidebarProps {
  activeMenu: "dashboard" | "skills" | "projects";
  setActiveMenu: (menu: "dashboard" | "skills" | "projects") => void;
  skillsCount: number;
  projectsCount: number;
  gitProfile: {
    name?: string;
    avatar_url?: string;
  } | null;
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
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col justify-between shrink-0">
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-gray-150 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e1b4b] text-white">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-gray-950">I-BOARD</h1>
            <span className="text-[10px] text-[#4f46e5] font-bold uppercase tracking-widest">Analytics</span>
          </div>
        </div>

        {/* Nav List */}
        <nav className="p-4 space-y-1.5">
          <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Main Menu</span>
          
          <button
            onClick={() => setActiveMenu("dashboard")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeMenu === "dashboard"
                ? "bg-[#1e1b4b] text-white shadow-md font-semibold"
                : "text-gray-600 hover:text-gray-950 hover:bg-gray-100/70"
            }`}
          >
            <LayoutDashboard className="h-4.5 w-4.5" />
            <span>Dashboard Analitik</span>
          </button>

          <button
            onClick={() => setActiveMenu("skills")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeMenu === "skills"
                ? "bg-[#1e1b4b] text-white shadow-md font-semibold"
                : "text-gray-600 hover:text-gray-950 hover:bg-gray-100/70"
            }`}
          >
            <Code2 className="h-4.5 w-4.5" />
            <span>Kelola Skills ({skillsCount})</span>
          </button>

          <button
            onClick={() => setActiveMenu("projects")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeMenu === "projects"
                ? "bg-[#1e1b4b] text-white shadow-md font-semibold"
                : "text-gray-600 hover:text-gray-950 hover:bg-gray-100/70"
            }`}
          >
            <Briefcase className="h-4.5 w-4.5" />
            <span>Kelola Projects ({projectsCount})</span>
          </button>
        </nav>
      </div>

      {/* Profile Card & Logout */}
      <div className="p-4 border-t border-gray-150 space-y-3">
        <div className="flex items-center gap-3 px-2 py-1">
          <img 
            src={getAvatarUrl()} 
            alt="avatar" 
            className="h-10 w-10 rounded-full border border-gray-250 object-cover"
            onError={handleImgError}
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate text-gray-950">{gitProfile?.name || "Moch Firmansyah"}</p>
            <span className="text-[10px] text-gray-400 font-medium">Super Admin</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-gray-50 border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-200"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Keluar Dashboard</span>
        </button>
      </div>
    </aside>
  );
}
