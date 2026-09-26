"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { 
  Briefcase, 
  Code2, 
  GraduationCap, 
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Search,
  Command,
  Bell,
  Info,
  X,
  RefreshCw,
  Menu
} from "lucide-react";

import Sidebar, { AdminTab } from "../components/Sidebar";
import DashboardTab from "../components/tabs/DashboardTab";
import SkillsTab from "../components/tabs/SkillsTab";
import ProjectsTab from "../components/tabs/ProjectsTab";
import AboutTab from "../components/tabs/AboutTab";
import ExperienceTab from "../components/tabs/ExperienceTab";
import MessagesTab from "../components/tabs/MessagesTab";

import SkillModal from "../components/modals/SkillModal";
import ProjectModal from "../components/modals/ProjectModal";
import CaseStudyModal from "../components/modals/CaseStudyModal";
import ExperienceModal from "../components/modals/ExperienceModal";
import MessageModal from "../components/modals/MessageModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import Toast from "../components/ui/Toast";
import StatCard from "../components/ui/StatCard";
import { 
  StatCardSkeleton, 
  DashboardSkeleton, 
  AboutSkeleton, 
  SkillsSkeleton, 
  ProjectsSkeleton, 
  ExperienceSkeleton, 
  MessagesSkeleton,
  AuthLoadingSkeleton 
} from "../components/ui/Skeleton";

import { 
  Skill, 
  Project, 
  Experience, 
  ContactMessage, 
  GitHubProfile, 
  GitHubRepo,
  ToastState,
  ConfirmModalState 
} from "../types";

import { useAuth } from "../hooks/useAuth";
import { useSkills } from "../hooks/useSkills";
import { useProjects } from "../hooks/useProjects";
import { useExperiences } from "../hooks/useExperiences";
import { useMessages } from "../hooks/useMessages";
import { useProfile } from "../hooks/useProfile";

import { fetchGitHubProfile, fetchGitHubRepos } from "../lib/api/github";
import { POPULAR_SKILLS, GITHUB_USERNAME } from "../lib/constants";
import { getProjectPreview } from "../lib/utils";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {
  // 1. Authentication via useAuth (server-side verification)
  const {
    isAuthenticated,
    isLoadingAuth,
    loginError,
    login,
    logout,
  } = useAuth();
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 2. Toast notification state with race-condition prevention (useRef timer)
  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    message: "",
    type: "info",
  });
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: ToastState["type"] = "info") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ isOpen: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, isOpen: false }));
    }, 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // 3. Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const triggerConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      isDanger = false,
      confirmText = "Konfirmasi",
      onCancel?: () => void
    ) => {
      setConfirmModal({
        isOpen: true,
        title,
        message,
        confirmText,
        isDanger,
        onConfirm: () => {
          onConfirm();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        },
        onCancel: () => {
          if (onCancel) onCancel();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
    },
    []
  );

  // 4. Domain Data Custom Hooks
  const {
    skills,
    fetchSkills,
    handleSaveSkill,
    handleDeleteSkill: deleteSkillItem,
    handleDeleteCategory: deleteCategoryItem,
    handleSeedDefaultSkills,
    isSeedingSkills,
  } = useSkills(showToast);

  const {
    projects,
    fetchProjects,
    handleSaveProject,
    handleDeleteProject: deleteProjectItem,
    handleUploadImage,
    handleSeedDefaultProjects,
    isSeedingProjects,
    uploadingImage,
  } = useProjects(showToast);

  const {
    experiences,
    fetchExperiences,
    handleSaveExperience,
    handleDeleteExperience: deleteExperienceItem,
    handleSeedDefaultExperience,
    isSeedingExperiences,
  } = useExperiences(showToast);

  const {
    messages,
    unreadMessagesCount,
    fetchMessages,
    handleSetMessageReadStatus,
    handleDeleteMessage: deleteMessageItem,
  } = useMessages(showToast);

  const {
    profile,
    setProfile,
    savingProfile,
    fetchProfile,
    handleSaveProfile,
    handleResetDefaultProfile,
  } = useProfile(showToast);

  // 5. GitHub Live Stats State
  const [gitProfile, setGitProfile] = useState<GitHubProfile | null>(null);
  const [gitRepos, setGitRepos] = useState<GitHubRepo[]>([]);
  const [syncingGit, setSyncingGit] = useState(false);
  const [syncingSkills, setSyncingSkills] = useState(false);

  // 6. Navigation, Search & Layout States
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<AdminTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // 7. Modals State
  const [skillModal, setSkillModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    data: Skill;
  }>({
    isOpen: false,
    isEdit: false,
    data: { name: "", logo: "", percent: 80, category: "Front-End Web Development" },
  });

  const [projectModal, setProjectModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    initialTab?: "general" | "case_study" | "links";
    data: Project;
  }>({
    isOpen: false,
    isEdit: false,
    initialTab: "general",
    data: {
      title: "",
      subtitle: "",
      description: "",
      longDescription: "",
      tags: [],
      category: "Web App",
      featured: false,
      image: "",
      link: "",
      demoUrl: "",
      githubUrl: "",
      metrics: "",
      highlights: [],
      year: new Date().getFullYear().toString(),
    },
  });

  const [caseStudyModal, setCaseStudyModal] = useState<{
    isOpen: boolean;
    project: Project | null;
  }>({
    isOpen: false,
    project: null,
  });

  const [experienceModal, setExperienceModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    data: Experience;
  }>({
    isOpen: false,
    isEdit: false,
    data: {
      period: "",
      role: "",
      company: "",
      location: "Bandung, West Java, Indonesia",
      description: "",
      technologies: [],
      type: "Work",
    },
  });

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // 8. Dynamic Notifications List
  const notificationsList = useMemo(() => {
    const list: string[] = [
      "Sistem CMS siap digunakan.",
    ];
    if (unreadMessagesCount > 0) {
      list.push(`Terdapat ${unreadMessagesCount} pesan baru dari pengunjung web.`);
    } else {
      list.push("Tidak ada pesan baru yang belum dibaca.");
    }
    list.push(`Total ${projects.length} proyek dan ${skills.length} keahlian aktif tersinkronisasi.`);
    return list;
  }, [unreadMessagesCount, projects.length, skills.length]);

  // 9. Initial Data Fetching
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.allSettled([
        fetchSkills(),
        fetchProjects(),
        fetchExperiences(),
        fetchMessages(),
        fetchProfile(),
        fetchGitHubProfile(GITHUB_USERNAME).then((res) => res && setGitProfile(res)),
        fetchGitHubRepos(GITHUB_USERNAME).then((res) => setGitRepos(res)),
      ]);
    } catch (err: any) {
      showToast("Gagal memuat seluruh data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [fetchSkills, fetchProjects, fetchExperiences, fetchMessages, fetchProfile, showToast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  // Background auto-sync saat tab admin kembali difokuskan
  useEffect(() => {
    if (!isAuthenticated) return;
    const handleFocus = () => {
      fetchSkills();
      fetchProjects();
      fetchExperiences();
      fetchProfile();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isAuthenticated, fetchSkills, fetchProjects, fetchExperiences, fetchProfile]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 10. Authentication Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const success = await login(passwordInput);
    setIsLoggingIn(false);
    if (success) {
      setPasswordInput("");
    }
  };

  const handleLogoutAction = () => {
    triggerConfirm(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar dari sesi Dashboard Admin?",
      () => {
        logout();
        setPasswordInput("");
      },
      false,
      "Keluar"
    );
  };

  // 11. Modal Opener & Submitter Handlers
  // --- Skills ---
  const openAddSkill = (defaultCategory?: string) => {
    setSkillModal({
      isOpen: true,
      isEdit: false,
      data: {
        name: "",
        logo: "",
        percent: 80,
        category: defaultCategory || "Front-End Web Development",
      },
    });
  };

  const openEditSkill = (skill: Skill) => {
    setSkillModal({
      isOpen: true,
      isEdit: true,
      data: { ...skill },
    });
  };

  const saveSkillModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSaveSkill(skillModal.data, skillModal.isEdit);
    if (success) {
      setSkillModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleDeleteSkill = (id?: string) => {
    if (!id) return;
    triggerConfirm(
      "Hapus Keahlian",
      "Apakah Anda yakin ingin menghapus keahlian ini dari database?",
      () => deleteSkillItem(id),
      true,
      "Hapus"
    );
  };

  const handleDeleteCategory = (category: string) => {
    if (!category || category === "Semua") return;
    const count = skills.filter(
      (s) => (s.category || "").toLowerCase() === category.toLowerCase()
    ).length;

    triggerConfirm(
      `Hapus Kategori "${category}"`,
      `Apakah Anda yakin ingin menghapus kategori "${category}" beserta ${count} keahlian di dalamnya dari database? Tindakan ini tidak dapat dibatalkan.`,
      () => deleteCategoryItem(category),
      true,
      "Hapus Kategori"
    );
  };

  // Sync skills from GitHub
  const handleSyncSkillsGitHub = () => {
    const languagesMap = new Set<string>();
    for (const repo of gitRepos) {
      if (repo.language) {
        languagesMap.add(repo.language);
      }
    }
    const existingSkillNames = new Set(skills.map((s) => s.name.toLowerCase()));
    const newLanguages = Array.from(languagesMap).filter(
      (lang) => !existingSkillNames.has(lang.toLowerCase())
    );

    if (newLanguages.length === 0) {
      showToast("Semua bahasa dari GitHub sudah ada dalam daftar skill!", "info");
      return;
    }

    triggerConfirm(
      "Sinkronkan Skill dari GitHub",
      `Ditemukan ${newLanguages.length} bahasa pemrograman baru: ${newLanguages.join(", ")}. Apakah Anda ingin menambahkannya ke database?`,
      async () => {
        setSyncingSkills(true);
        try {
          const items = newLanguages.map((lang) => {
            let logoVal = lang.substring(0, 3).toUpperCase();
            let categoryVal = "Programming Languages";
            const found = POPULAR_SKILLS.find(
              (s) => s.name.toLowerCase() === lang.toLowerCase()
            );
            if (found) {
              logoVal = found.logo;
              if (found.category) categoryVal = found.category;
            }
            return {
              name: lang,
              logo: logoVal,
              percent: 75,
              category: categoryVal,
            };
          });

          const { error } = await supabase.from("skills").insert(items);
          if (error) throw error;

          showToast(`Berhasil mengimpor ${newLanguages.length} skill baru!`, "success");
          await fetchSkills();
        } catch (err: any) {
          showToast("Gagal sinkronisasi skill: " + err.message, "error");
        } finally {
          setSyncingSkills(false);
        }
      },
      false,
      "Impor Skill",
      () => setSyncingSkills(false)
    );
  };

  // --- Projects ---
  const openAddProject = () => {
    setProjectModal({
      isOpen: true,
      isEdit: false,
      initialTab: "general",
      data: {
        title: "",
        subtitle: "",
        description: "",
        longDescription: "",
        tags: [],
        category: "Web App",
        featured: false,
        image: "",
        link: "",
        demoUrl: "",
        githubUrl: "",
        metrics: "",
        highlights: [],
        year: new Date().getFullYear().toString(),
      },
    });
  };

  const openEditProject = (project: Project) => {
    setProjectModal({
      isOpen: true,
      isEdit: true,
      initialTab: "general",
      data: { ...project },
    });
  };

  const openCaseStudy = (project: Project) => {
    setCaseStudyModal({
      isOpen: true,
      project,
    });
  };

  const openEditCaseStudy = (project: Project) => {
    setCaseStudyModal({ isOpen: false, project: null });
    setProjectModal({
      isOpen: true,
      isEdit: true,
      initialTab: "case_study",
      data: { ...project },
    });
  };

  const saveProjectModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSaveProject(projectModal.data, projectModal.isEdit);
    if (success) {
      setProjectModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleDeleteProject = (id?: string) => {
    if (!id) return;
    triggerConfirm(
      "Hapus Data Proyek",
      "Apakah Anda yakin ingin menghapus data proyek ini?",
      () => deleteProjectItem(id),
      true,
      "Hapus"
    );
  };

  const handleImageUploadEvent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleUploadImage(file);
    if (url) {
      setProjectModal((prev) => ({ ...prev, data: { ...prev.data, image: url } }));
    }
  };

  // Sync projects from GitHub
  const handleSyncGitHub = () => {
    const existingProjectLinks = new Set(
      projects.map((p) => (p.githubUrl || p.link || "").toLowerCase())
    );
    const newRepos = gitRepos.filter(
      (repo) => !existingProjectLinks.has(repo.html_url.toLowerCase())
    );

    if (newRepos.length === 0) {
      showToast("Semua repositori GitHub sudah tersinkronisasi!", "info");
      return;
    }

    triggerConfirm(
      "Sinkronkan Repositori GitHub",
      `Ditemukan ${newRepos.length} repositori baru yang belum ada di database. Impor sekarang?`,
      async () => {
        setSyncingGit(true);
        try {
          const items = newRepos.map((repo) => ({
            title: repo.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            subtitle: repo.description || "Proyek repositori publik GitHub",
            description: repo.description || "Repositori yang dikembangkan secara terbuka di akun GitHub saya.",
            longDescription: repo.description || "Studi kasus pengembangan perangkat lunak berbasis repositori GitHub.",
            tags: repo.language ? [repo.language, "Open Source"] : ["Software Project"],
            category: "Web App",
            featured: false,
            image: "/projects/manajemen-kontrakan.png",
            link: repo.homepage || repo.html_url,
            demoUrl: repo.homepage || "",
            githubUrl: repo.html_url,
            metrics: `${repo.stargazers_count || 0} Bintang • ${repo.forks_count || 0} Forks`,
            highlights: [
              `Bahasa utama: ${repo.language || "Multi-stack"}`,
              `Terakhir diperbarui: ${new Date(repo.updated_at).toLocaleDateString("id-ID")}`,
            ],
            year: new Date(repo.created_at).getFullYear().toString(),
          }));

          const { error } = await supabase.from("projects").insert(items);
          if (error) throw error;

          showToast(`Berhasil mengimpor ${newRepos.length} proyek dari GitHub!`, "success");
          await fetchProjects();
        } catch (err: any) {
          showToast("Gagal mengimpor proyek: " + err.message, "error");
        } finally {
          setSyncingGit(false);
        }
      },
      false,
      "Impor Proyek",
      () => setSyncingGit(false)
    );
  };

  // --- Experiences ---
  const openAddExperience = () => {
    setExperienceModal({
      isOpen: true,
      isEdit: false,
      data: {
        period: "",
        role: "",
        company: "",
        location: "Bandung, West Java, Indonesia",
        description: "",
        technologies: [],
        type: "Work",
      },
    });
  };

  const openEditExperience = (exp: Experience) => {
    setExperienceModal({
      isOpen: true,
      isEdit: true,
      data: { ...exp },
    });
  };

  const saveExperienceModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSaveExperience(experienceModal.data, experienceModal.isEdit);
    if (success) {
      setExperienceModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleDeleteExperience = (id?: string) => {
    if (!id) return;
    triggerConfirm(
      "Hapus Riwayat Pengalaman",
      "Apakah Anda yakin ingin menghapus data pengalaman ini?",
      () => deleteExperienceItem(id),
      true,
      "Hapus"
    );
  };

  // --- Messages ---
  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsMessageModalOpen(true);
    if (!msg.read) {
      handleSetMessageReadStatus(msg.id, true, false);
    }
  };

  const handleDeleteMessage = (id: string) => {
    triggerConfirm(
      "Hapus Pesan Masuk",
      "Apakah Anda yakin ingin menghapus pesan ini dari inbox?",
      async () => {
        const ok = await deleteMessageItem(id);
        if (ok && selectedMessage?.id === id) {
          setSelectedMessage(null);
          setIsMessageModalOpen(false);
        }
      },
      true,
      "Hapus"
    );
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/projects/manajemen-kontrakan.png";
  };

  // 12. Render Login Screen
  if (isLoadingAuth) {
    return <AuthLoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans select-none antialiased">
        <div className="max-w-md w-full bg-white border border-zinc-200/90 rounded-2xl shadow-xl p-8 space-y-6 animate-dialog-show">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-12 w-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-md">
              <Lock className="h-6 w-6 stroke-[1.75]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">
              Admin Portal Login
            </h1>
            <p className="text-xs text-zinc-500 max-w-xs">
              Masukkan password pengelola untuk mengakses CMS &amp; database.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
              >
                Password Pengelola
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ketik password..."
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white py-2.5 text-xs font-medium shadow-2xs transition-all cursor-pointer"
            >
              <span>{isLoggingIn ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 13. Main Dashboard UI
  return (
    <div className="min-h-screen bg-[#FDFDFC] flex font-sans antialiased text-zinc-900">
      {/* Sidebar with Mobile Drawer support */}
      <Sidebar 
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        skillsCount={skills.length}
        projectsCount={projects.length}
        experienceCount={experiences.length}
        unreadMessagesCount={unreadMessagesCount}
        gitProfile={gitProfile}
        handleImgError={handleImgError}
        handleLogout={handleLogoutAction}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition cursor-pointer"
              title="Buka Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari konten, proyek, riwayat, pesan... (Ctrl+K)"
                className="w-full rounded-lg border border-zinc-200/80 bg-zinc-50/50 pl-9 pr-8 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
              />
              <span className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5 text-[10px] font-mono text-zinc-400 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                <Command className="h-2.5 w-2.5" /> K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-white border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all shadow-2xs relative cursor-pointer"
              title="Notifikasi"
            >
              <Bell className="h-4 w-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-white animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-12 top-11 w-80 bg-white border border-zinc-200 rounded-xl shadow-xl p-4 z-50 animate-dialog-show space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-150 pb-2">
                  <span className="font-semibold text-xs text-zinc-900 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-blue-600" />
                    <span>Pemberitahuan Sistem</span>
                  </span>
                  <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-zinc-700 cursor-pointer">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {unreadMessagesCount > 0 && (
                    <div 
                      onClick={() => {
                        setActiveMenu("messages");
                        setShowNotifications(false);
                      }}
                      className="text-xs text-blue-900 bg-blue-50 p-2.5 rounded-lg border border-blue-200 leading-relaxed cursor-pointer hover:bg-blue-100 transition flex items-center justify-between"
                    >
                      <span>Ada {unreadMessagesCount} pesan baru di Inbox!</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    </div>
                  )}
                  {notificationsList.map((note, index) => (
                    <div key={index} className="text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-150 leading-relaxed">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={fetchAllData} 
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-white border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all shadow-2xs cursor-pointer"
              title="Segarkan Data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-zinc-900" : ""}`} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-8 space-y-6 flex-1">
          {/* Page Title Header */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              {activeMenu === "dashboard" && "Dashboard Analitik & Ringkasan"}
              {activeMenu === "about" && "Manajemen Profil & Tentang Saya"}
              {activeMenu === "skills" && "Manajemen Keahlian & Skills"}
              {activeMenu === "projects" && "Manajemen Proyek & Portofolio"}
              {activeMenu === "experience" && "Manajemen Pengalaman & Karier"}
              {activeMenu === "messages" && "Pesan Masuk (Inbox Pengunjung)"}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {activeMenu === "dashboard" && "Ringkasan metrik pengembangan dan manajemen database portofolio secara terpusat."}
              {activeMenu === "about" && "Atur identitas profil beranda, narasi seksi tentang saya, dan tautan kontak website."}
              {activeMenu === "skills" && "Kelola daftar keahlian, teknologi pemrograman, dan persentase penguasaan."}
              {activeMenu === "projects" && "Kelola katalog portofolio proyek lengkap dengan foto lokal, tags, dan link live."}
              {activeMenu === "experience" && "Kelola riwayat studi, organisasi, dan karir yang tampil pada garis waktu website."}
              {activeMenu === "messages" && "Daftar pertanyaan dan penawaran proyek yang dikirimkan pengunjung dari halaman website."}
            </p>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard 
                  title="Total Projects"
                  value={projects.length}
                  icon={<Briefcase className="h-4 w-4 text-zinc-700" />}
                  subtitle="Tersimpan di Database"
                />
                <StatCard 
                  title="Total Skills"
                  value={skills.length}
                  icon={<Code2 className="h-4 w-4 text-zinc-700" />}
                  subtitle="Tersimpan di Database"
                />
                <StatCard 
                  title="Riwayat Karier"
                  value={experiences.length}
                  icon={<GraduationCap className="h-4 w-4 text-zinc-700" />}
                  subtitle="Timeline Pengalaman"
                />
                <StatCard 
                  title="Pesan Masuk"
                  value={unreadMessagesCount > 0 ? `${unreadMessagesCount} Baru` : messages.length}
                  icon={<Mail className="h-4 w-4 text-zinc-700" />}
                  subtitle={unreadMessagesCount > 0 ? "Perlu ditinjau" : "Total Pesan"}
                />
              </>
            )}
          </div>

          {/* Tab Content Skeletons */}
          {loading && (
            <>
              {activeMenu === "dashboard" && <DashboardSkeleton />}
              {activeMenu === "about" && <AboutSkeleton />}
              {activeMenu === "skills" && <SkillsSkeleton />}
              {activeMenu === "projects" && <ProjectsSkeleton />}
              {activeMenu === "experience" && <ExperienceSkeleton />}
              {activeMenu === "messages" && <MessagesSkeleton />}
            </>
          )}

          {/* TAB 1: Dashboard */}
          {!loading && activeMenu === "dashboard" && (
            <DashboardTab 
              gitProfile={gitProfile}
              gitRepos={gitRepos}
              skills={skills}
              projects={projects}
              experiences={experiences}
              messages={messages}
              handleImgError={handleImgError}
              showToast={showToast}
            />
          )}

          {/* TAB 2: About / Profile */}
          {!loading && activeMenu === "about" && (
            <AboutTab 
              profile={profile}
              setProfile={setProfile}
              onSaveProfile={handleSaveProfile}
              savingProfile={savingProfile}
              onResetDefault={handleResetDefaultProfile}
            />
          )}

          {/* TAB 3: Skills */}
          {!loading && activeMenu === "skills" && (
            <SkillsTab 
              skills={skills}
              searchQuery={searchQuery}
              syncingSkills={syncingSkills}
              handleSyncSkillsGitHub={handleSyncSkillsGitHub}
              openAddSkill={openAddSkill}
              openEditSkill={openEditSkill}
              handleDeleteSkill={handleDeleteSkill}
              handleDeleteCategory={handleDeleteCategory}
              handleSeedDefaultSkills={handleSeedDefaultSkills}
              isSeedingSkills={isSeedingSkills}
            />
          )}

          {/* TAB 4: Projects */}
          {!loading && activeMenu === "projects" && (
            <ProjectsTab 
              projects={projects}
              searchQuery={searchQuery}
              syncingGit={syncingGit}
              handleSyncGitHub={handleSyncGitHub}
              openAddProject={openAddProject}
              openEditProject={openEditProject}
              openCaseStudy={openCaseStudy}
              handleDeleteProject={handleDeleteProject}
              getProjectPreview={getProjectPreview}
              handleSeedDefaultData={handleSeedDefaultProjects}
              isSeeding={isSeedingProjects}
            />
          )}

          {/* TAB 5: Experience */}
          {!loading && activeMenu === "experience" && (
            <ExperienceTab 
              experiences={experiences}
              searchQuery={searchQuery}
              isSeeding={isSeedingExperiences}
              handleSeedDefaultExperience={handleSeedDefaultExperience}
              openAddExperience={openAddExperience}
              openEditExperience={openEditExperience}
              handleDeleteExperience={handleDeleteExperience}
            />
          )}

          {/* TAB 6: Messages (Inbox) */}
          {!loading && activeMenu === "messages" && (
            <MessagesTab 
              messages={messages}
              searchQuery={searchQuery}
              onOpenMessage={handleOpenMessage}
              onToggleRead={(id, status) => handleSetMessageReadStatus(id, !status, true)}
              onDeleteMessage={handleDeleteMessage}
            />
          )}
        </div>
      </main>

      {/* Skill Form Modal */}
      <SkillModal 
        isOpen={skillModal.isOpen}
        isEdit={skillModal.isEdit}
        data={skillModal.data}
        setData={(action) => {
          if (typeof action === "function") {
            setSkillModal((prev) => ({ ...prev, data: action(prev.data) }));
          } else {
            setSkillModal((prev) => ({ ...prev, data: action }));
          }
        }}
        popularSkills={POPULAR_SKILLS}
        onSubmit={saveSkillModal}
        onClose={() => setSkillModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Project Form Modal */}
      <ProjectModal 
        isOpen={projectModal.isOpen}
        isEdit={projectModal.isEdit}
        initialTab={projectModal.initialTab}
        data={projectModal.data}
        setData={(action) => {
          if (typeof action === "function") {
            setProjectModal((prev) => ({ ...prev, data: action(prev.data) }));
          } else {
            setProjectModal((prev) => ({ ...prev, data: action }));
          }
        }}
        uploadingImage={uploadingImage}
        handleImageUpload={handleImageUploadEvent}
        onSubmit={saveProjectModal}
        onClose={() => setProjectModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Case Study Preview & Navigation Modal */}
      <CaseStudyModal
        isOpen={caseStudyModal.isOpen}
        project={caseStudyModal.project}
        onClose={() => setCaseStudyModal({ isOpen: false, project: null })}
        onEdit={(proj) => openEditCaseStudy(proj)}
      />

      {/* Experience Form Modal */}
      <ExperienceModal 
        isOpen={experienceModal.isOpen}
        isEdit={experienceModal.isEdit}
        data={experienceModal.data}
        setData={(action) => {
          if (typeof action === "function") {
            setExperienceModal((prev) => ({ ...prev, data: action(prev.data) }));
          } else {
            setExperienceModal((prev) => ({ ...prev, data: action }));
          }
        }}
        onSubmit={saveExperienceModal}
        onClose={() => setExperienceModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Message Reader Modal */}
      <MessageModal 
        isOpen={isMessageModalOpen}
        message={selectedMessage}
        onClose={() => setIsMessageModalOpen(false)}
        onToggleRead={(id, status) => handleSetMessageReadStatus(id, !status, true)}
        onDelete={handleDeleteMessage}
      />

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        isDanger={confirmModal.isDanger}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel || (() => setConfirmModal((prev) => ({ ...prev, isOpen: false })))}
      />

      {/* Toast Notification */}
      <Toast 
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}
