import React from "react";
import { 
  LayoutDashboard, 
  User, 
  Code2, 
  Briefcase, 
  GraduationCap, 
  Inbox, 
  LogOut, 
  ChevronsLeft,
  ChevronsRight,
  X 
} from "lucide-react";
import { GitHubProfile, AdminTab } from "../types";
import { getAvatarUrl } from "../lib/utils";

export type { AdminTab };

interface SidebarProps {
  activeMenu: AdminTab;
  setActiveMenu: (menu: AdminTab) => void;
  skillsCount: number;
  projectsCount: number;
  experienceCount: number;
  unreadMessagesCount: number;
  gitProfile: GitHubProfile | null;
  handleImgError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  handleLogout: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
  onToggleCollapse?: () => void;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  dot?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function Sidebar({
  activeMenu,
  setActiveMenu,
  skillsCount,
  projectsCount,
  experienceCount,
  unreadMessagesCount,
  gitProfile,
  handleImgError,
  handleLogout,
  isMobileOpen = false,
  setIsMobileOpen,
  isSidebarOpen = true,
  setIsSidebarOpen,
  onToggleCollapse,
}: SidebarProps) {
  const handleNavClick = (menu: AdminTab) => {
    setActiveMenu(menu);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else if (setIsSidebarOpen) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const navGroups: NavGroup[] = [
    {
      title: "Ringkasan",
      items: [
        {
          id: "dashboard" as AdminTab,
          label: "Dashboard Analitik",
          icon: LayoutDashboard,
        },
        {
          id: "messages" as AdminTab,
          label: "Pesan Masuk",
          icon: Inbox,
          badge: unreadMessagesCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-2xs animate-pulse">
              {unreadMessagesCount}
            </span>
          ) : (
            <span className="text-[10px] text-zinc-400">0</span>
          ),
          dot: unreadMessagesCount > 0,
        },
      ],
    },
    {
      title: "Manajemen Konten",
      items: [
        {
          id: "about" as AdminTab,
          label: "Profil & About",
          icon: User,
        },
        {
          id: "projects" as AdminTab,
          label: "Proyek & Portofolio",
          icon: Briefcase,
          badge: (
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
              {projectsCount}
            </span>
          ),
        },
        {
          id: "skills" as AdminTab,
          label: "Keahlian & Skills",
          icon: Code2,
          badge: (
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
              {skillsCount}
            </span>
          ),
        },
        {
          id: "experience" as AdminTab,
          label: "Pengalaman & Karier",
          icon: GraduationCap,
          badge: (
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
              {experienceCount}
            </span>
          ),
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-zinc-950/40 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`bg-white select-none z-30 border-r border-zinc-200/80 flex flex-col justify-between shrink-0 transition-[width] duration-300 ease-in-out fixed inset-y-0 left-0 lg:sticky lg:top-0 h-screen ${
          isMobileOpen
            ? "translate-x-0 w-[260px] shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        } ${
          isSidebarOpen ? "w-[260px]" : "w-[76px]"
        }`}
      >
        {/* Tombol Bulat Melayang di TENGAH VERTIKAL Garis Border Sidebar (Khas SimGizi) */}
        <button
          type="button"
          onClick={handleToggle}
          className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-zinc-200/90 text-zinc-500 hover:text-zinc-900 shadow-sm hover:scale-110 active:scale-95 transition-all duration-200 items-center justify-center z-40 cursor-pointer"
          title={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
          aria-label={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
        >
          {isSidebarOpen ? (
            <ChevronsLeft className="w-3.5 h-3.5 stroke-[2.2]" />
          ) : (
            <ChevronsRight className="w-3.5 h-3.5 stroke-[2.2]" />
          )}
        </button>

        {/* Top Header & Navigation */}
        <div className="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Brand Header - Height h-16 Sejajar Sempurna dengan Topbar h-16 */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-200/80 shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div 
                onClick={!isSidebarOpen ? handleToggle : undefined}
                className={`w-9 h-9 rounded-xl bg-zinc-900 text-white font-extrabold font-mono text-base shadow-xs flex items-center justify-center shrink-0 select-none ${
                  !isSidebarOpen ? "cursor-pointer hover:bg-zinc-800 transition" : ""
                }`}
                title={!isSidebarOpen ? "Klik untuk buka sidebar" : undefined}
              >
                F
              </div>
              <span
                className={`font-semibold text-sm tracking-tight text-zinc-900 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  !isSidebarOpen
                    ? "max-w-0 opacity-0 ml-0"
                    : "max-w-[150px] opacity-100"
                }`}
              >
                portofolio-firman
              </span>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className="lg:hidden w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-700 cursor-pointer"
              aria-label="Tutup Sidebar"
            >
              <X className="w-4 h-4 stroke-[1.8]" />
            </button>
          </div>

          {/* Navigation Menus List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div
                  className={`px-2.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                    !isSidebarOpen
                      ? "max-w-0 opacity-0 h-0 my-0 py-0"
                      : "max-w-[160px] opacity-100 mb-1.5"
                  }`}
                >
                  {group.title}
                </div>

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      title={!isSidebarOpen ? item.label : undefined}
                      className={`w-full h-10 px-2.5 rounded-xl flex items-center transition-all duration-200 group cursor-pointer text-left ${
                        isActive
                          ? "bg-zinc-900 text-white shadow-xs"
                          : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 font-medium"
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
                        <Icon
                          className={`w-[18px] h-[18px] transition-colors stroke-[1.8] ${
                            isActive
                              ? "text-white stroke-[2.2]"
                              : "text-zinc-400 group-hover:text-zinc-700"
                          }`}
                        />
                        {item.dot && !isSidebarOpen && (
                          <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full ring-2 ring-white animate-pulse" />
                        )}
                      </div>

                      <span
                        className={`text-xs whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                          !isSidebarOpen
                            ? "max-w-0 opacity-0 ml-0"
                            : "max-w-[160px] opacity-100 ml-3"
                        }`}
                      >
                        {item.label}
                      </span>

                      {item.badge && (
                        <span
                          className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                            !isSidebarOpen
                              ? "max-w-0 opacity-0 p-0 m-0 border-0"
                              : "max-w-[40px] opacity-100 ml-auto"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-zinc-200/80 bg-zinc-50/50 space-y-2 shrink-0">
          <div className="flex items-center px-1 py-1 overflow-hidden">
            <img
              src={getAvatarUrl(gitProfile)}
              alt="avatar"
              className="h-9 w-9 rounded-full ring-1 ring-zinc-300 object-cover shrink-0"
              onError={handleImgError}
              title={!isSidebarOpen ? gitProfile?.name || "Moch Firmansyah" : undefined}
            />
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                !isSidebarOpen
                  ? "max-w-0 opacity-0 ml-0"
                  : "max-w-[140px] opacity-100 ml-2.5"
              }`}
            >
              <p className="text-xs font-semibold text-zinc-900 truncate">
                {gitProfile?.name || "Moch Firmansyah"}
              </p>
              <p className="text-[10px] text-zinc-500 truncate">
                @{gitProfile?.login || "moch-firmansyahh"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title={!isSidebarOpen ? "Keluar Sesi" : undefined}
            className="w-full h-9 px-2 rounded-lg border border-zinc-200/80 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center cursor-pointer text-xs font-medium text-zinc-700 shadow-2xs group"
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-red-600" />
            </div>
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                !isSidebarOpen
                  ? "max-w-0 opacity-0 ml-0"
                  : "max-w-[100px] opacity-100 ml-2"
              }`}
            >
              Keluar Sesi
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
