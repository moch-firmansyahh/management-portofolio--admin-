"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  writeBatch,
  serverTimestamp 
} from "firebase/firestore";
import { 
  Briefcase, 
  Code2, 
  FolderGit2, 
  Users, 
  Github, 
  Search, 
  Bell, 
  RefreshCw, 
  AlertCircle, 
  X,
  Info,
  Command,
  Lock,
  ArrowRight
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import DashboardTab, { GitHubProfile } from "../components/DashboardTab";
import SkillsTab, { Skill } from "../components/SkillsTab";
import ProjectsTab, { Project } from "../components/ProjectsTab";
import SkillModal, { PopularSkill } from "../components/SkillModal";
import ProjectModal from "../components/ProjectModal";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import StatCard from "../components/StatCard";

const POPULAR_SKILLS: PopularSkill[] = [
  { name: "HTML", logo: "HTM" },
  { name: "CSS", logo: "CSS" },
  { name: "JavaScript", logo: "JS" },
  { name: "TypeScript", logo: "TS" },
  { name: "React", logo: "RE" },
  { name: "Next.js", logo: "NX" },
  { name: "Node.js", logo: "ND" },
  { name: "Go", logo: "GO" },
  { name: "C++", logo: "CPP" },
  { name: "Python", logo: "PY" },
  { name: "Figma", logo: "FG" },
  { name: "Canva", logo: "CN" },
  { name: "PHP", logo: "PHP" },
  { name: "Laravel", logo: "LAR" },
  { name: "MySQL", logo: "SQL" },
  { name: "Git", logo: "GIT" }
];

const getProjectPreview = (image: string, link: string) => {
  if (!image || image === "/assets/portofolio.png") {
    if (link && link.includes("github.com/")) {
      const parts = link.split("github.com/");
      if (parts.length > 1) {
        const repoPath = parts[1].split("?")[0];
        return `https://opengraph.githubassets.com/1/${repoPath}`;
      }
    }
  }
  return image || "/assets/portofolio.png";
};

export default function AdminDashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Data states
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [gitProfile, setGitProfile] = useState<GitHubProfile | null>(null);
  const [gitRepos, setGitRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingGit, setSyncingGit] = useState(false);
  const [syncingSkills, setSyncingSkills] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Search & Navigation states
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "skills" | "projects">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Notifications Popover state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState<string[]>([
    "Sistem siap digunakan dengan Firebase Firestore.",
    "Buka tab Skills atau Projects untuk mengelola data."
  ]);

  // Modals state
  const [skillModal, setSkillModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    data: Skill;
  }>({
    isOpen: false,
    isEdit: false,
    data: { id: "", name: "", logo: "", percent: 0 },
  });

  const [projectModal, setProjectModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    data: Project;
  }>({
    isOpen: false,
    isEdit: false,
    data: { id: "", title: "", description: "", image: "", link: "" },
  });

  // Toast state
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    message: "",
    type: "success"
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ isOpen: true, message, type });
    setNotificationsList(prev => [message, ...prev.slice(0, 9)]);
    setTimeout(() => {
      setToast(prev => ({ ...prev, isOpen: false }));
    }, 3000);
  };

  // Custom Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  const triggerConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    isDanger = false,
    confirmText = "Konfirmasi"
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      isDanger,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Fetch initial data from Firebase & GitHub API
  const fetchData = async () => {
    setLoading(true);
    
    // 1. Fetch Skills from Firebase Firestore
    try {
      const skillsSnapshot = await getDocs(collection(db, "skills"));
      const skillsData = skillsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          logo: data.logo || "",
          percent: data.percent || 0,
          createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) : new Date(0)
        };
      });
      skillsData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      setSkills(skillsData);
    } catch (err) {
      console.warn("Error loading skills from Firebase:", err);
    }

    // 2. Fetch Projects from Firebase Firestore
    try {
      const projectsSnapshot = await getDocs(collection(db, "projects"));
      const projectsData = projectsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
          image: data.image || "",
          link: data.link || "",
          createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) : new Date(0)
        };
      });
      projectsData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      setProjects(projectsData);
    } catch (err) {
      console.warn("Error loading projects from Firebase:", err);
    }

    // 3. Fetch GitHub Profile & Repos
    try {
      const profileRes = await fetch("https://api.github.com/users/moch-firmansyahh");
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setGitProfile(profileData);
      }

      const reposRes = await fetch("https://api.github.com/users/moch-firmansyahh/repos?sort=updated&per_page=10");
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        setGitRepos(reposData);
      }
    } catch (err) {
      console.warn("Error loading GitHub data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Passcode check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "admin123") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Password salah! Silakan coba lagi.");
    }
  };

  // Sync projects from GitHub public repositories
  const handleSyncGitHub = async () => {
    setSyncingGit(true);
    try {
      const res = await fetch("https://api.github.com/users/moch-firmansyahh/repos?per_page=30");
      if (!res.ok) throw new Error("Gagal mengambil repositori GitHub");
      
      const repos = await res.json();
      
      const existingLinks = new Set(projects.map(p => p.link.toLowerCase()));
      const newRepos = repos.filter((r: any) => !existingLinks.has(r.html_url.toLowerCase()));

      if (newRepos.length === 0) {
        showToast("Semua repositori GitHub sudah tersinkronisasi!", "info");
        setSyncingGit(false);
        return;
      }

      triggerConfirm(
        "Sinkronisasi Proyek GitHub",
        `Ditemukan ${newRepos.length} repositori GitHub baru. Apakah Anda yakin ingin menyinkronkan proyek-proyek ini ke database Firebase?`,
        async () => {
          setSyncingGit(true);
          try {
            const batch = writeBatch(db);
            newRepos.forEach((r: any) => {
              const repoPath = r.html_url.split("github.com/")[1]?.split("?")[0] || `moch-firmansyahh/${r.name}`;
              const ogImageUrl = `https://opengraph.githubassets.com/1/${repoPath}`;
              
              const docRef = doc(collection(db, "projects"));
              batch.set(docRef, {
                title: r.name.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
                description: r.description || "Repositori project open source di GitHub.",
                image: ogImageUrl,
                link: r.html_url,
                createdAt: serverTimestamp()
              });
            });
            await batch.commit();

            showToast(`Berhasil menyinkronkan ${newRepos.length} proyek dari GitHub!`, "success");
            fetchData();
          } catch (err) {
            showToast("Gagal sinkronisasi: " + (err as Error).message, "error");
          } finally {
            setSyncingGit(false);
          }
        },
        false,
        "Sinkronisasi"
      );
    } catch (err) {
      showToast("Gagal sinkronisasi: " + (err as Error).message, "error");
      setSyncingGit(false);
    }
  };

  // Sync programming languages from GitHub public repositories as Skills
  const handleSyncSkillsGitHub = async () => {
    setSyncingSkills(true);
    try {
      const res = await fetch("https://api.github.com/users/moch-firmansyahh/repos?per_page=100");
      if (!res.ok) throw new Error("Gagal mengambil data repositori dari GitHub");
      
      const repos = await res.json();
      
      const languagesSet = new Set<string>();
      repos.forEach((r: any) => {
        if (r.language) {
          languagesSet.add(r.language);
        }
      });

      const detectedLanguages = Array.from(languagesSet);

      if (detectedLanguages.length === 0) {
        showToast("Tidak ditemukan bahasa pemrograman publik di GitHub!", "error");
        setSyncingSkills(false);
        return;
      }

      const existingSkillNames = new Set(skills.map(s => s.name.toLowerCase()));
      const newLanguages = detectedLanguages.filter(lang => !existingSkillNames.has(lang.toLowerCase()));

      if (newLanguages.length === 0) {
        showToast("Semua bahasa pemrograman dari GitHub sudah terdaftar!", "info");
        setSyncingSkills(false);
        return;
      }

      triggerConfirm(
        "Sinkronisasi Skill GitHub",
        `Ditemukan ${newLanguages.length} keahlian bahasa pemrograman baru: ${newLanguages.join(", ")}. Tambahkan ke database sekarang dengan penguasaan default 70%?`,
        async () => {
          setSyncingSkills(true);
          try {
            const batch = writeBatch(db);
            newLanguages.forEach(lang => {
              const foundPopular = POPULAR_SKILLS.find(ps => ps.name.toLowerCase() === lang.toLowerCase());
              let logoVal = foundPopular ? foundPopular.logo : lang.substring(0, 3).toUpperCase();
              
              const docRef = doc(collection(db, "skills"));
              batch.set(docRef, {
                name: lang,
                logo: logoVal,
                percent: 70,
                createdAt: serverTimestamp()
              });
            });
            await batch.commit();

            showToast(`Berhasil mengimpor ${newLanguages.length} skill baru!`, "success");
            fetchData();
          } catch (err) {
            showToast("Gagal sinkronisasi skill: " + (err as Error).message, "error");
          } finally {
            setSyncingSkills(false);
          }
        },
        false,
        "Impor Skill"
      );
    } catch (err) {
      showToast("Gagal sinkronisasi: " + (err as Error).message, "error");
      setSyncingSkills(false);
    }
  };

  // Skill CRUD handlers
  const openAddSkill = () => {
    setSkillModal({
      isOpen: true,
      isEdit: false,
      data: { id: "", name: "", logo: "", percent: 50 },
    });
  };

  const openEditSkill = (skill: Skill) => {
    setSkillModal({
      isOpen: true,
      isEdit: true,
      data: { ...skill },
    });
  };

  const handleDeleteSkill = async (id: string) => {
    triggerConfirm(
      "Hapus Keahlian",
      "Apakah Anda yakin ingin menghapus keahlian ini? Tindakan ini tidak dapat dibatalkan.",
      async () => {
        try {
          await deleteDoc(doc(db, "skills", id));
          showToast("Skill berhasil dihapus!", "success");
          fetchData();
        } catch (err) {
          showToast("Gagal menghapus: " + (err as Error).message, "error");
        }
      },
      true,
      "Hapus"
    );
  };

  const saveSkillModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isEdit, data } = skillModal;
    const finalPercent = Math.max(0, Math.min(100, parseInt(data.percent as any) || 0));
    try {
      if (isEdit) {
        await updateDoc(doc(db, "skills", data.id), {
          name: data.name,
          logo: data.logo,
          percent: finalPercent
        });
      } else {
        await addDoc(collection(db, "skills"), {
          name: data.name,
          logo: data.logo,
          percent: finalPercent,
          createdAt: serverTimestamp()
        });
      }
      setSkillModal(prev => ({ ...prev, isOpen: false }));
      showToast("Skill berhasil disimpan!", "success");
      fetchData();
    } catch (err) {
      showToast("Gagal menyimpan: " + (err as Error).message, "error");
    }
  };

  // Project CRUD handlers
  const openAddProject = () => {
    setProjectModal({
      isOpen: true,
      isEdit: false,
      data: { id: "", title: "", description: "", image: "", link: "" },
    });
  };

  const openEditProject = (project: Project) => {
    setProjectModal({
      isOpen: true,
      isEdit: true,
      data: { ...project },
    });
  };

  const handleDeleteProject = async (id: string) => {
    triggerConfirm(
      "Hapus Proyek",
      "Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan.",
      async () => {
        try {
          await deleteDoc(doc(db, "projects", id));
          showToast("Proyek berhasil dihapus!", "success");
          fetchData();
        } catch (err) {
          showToast("Gagal menghapus: " + (err as Error).message, "error");
        }
      },
      true,
      "Hapus"
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3002";
      const res = await fetch(`${backendUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Gagal mengunggah gambar");

      setProjectModal(prev => ({
        ...prev,
        data: { ...prev.data, image: resData.url }
      }));
      showToast("Gambar berhasil diunggah!", "success");
    } catch (err) {
      showToast("Gagal unggah: " + (err as Error).message, "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProjectModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isEdit, data } = projectModal;
    const finalImage = data.image || "/assets/portofolio.png";
    try {
      if (isEdit) {
        await updateDoc(doc(db, "projects", data.id), {
          title: data.title,
          description: data.description,
          image: finalImage,
          link: data.link
        });
      } else {
        await addDoc(collection(db, "projects"), {
          title: data.title,
          description: data.description,
          image: finalImage,
          link: data.link,
          createdAt: serverTimestamp()
        });
      }
      setProjectModal(prev => ({ ...prev, isOpen: false }));
      showToast("Proyek berhasil disimpan!", "success");
      fetchData();
    } catch (err) {
      showToast("Gagal menyimpan: " + (err as Error).message, "error");
    }
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=Firmansyah";
  };

  // Modern Shadcn Login Screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 font-sans select-none">
        <div className="w-full max-w-sm rounded-xl border border-zinc-200/90 bg-white p-8 shadow-xl animate-dialog-show space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-2xs">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              Admin Suite Login
            </h2>
            <p className="text-xs text-zinc-500">
              Akses panel manajemen portofolio & Firestore.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Password Akses
              </label>
              <input
                type="password"
                id="password"
                placeholder="Masukkan password admin..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                required
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2.5 text-xs font-medium text-white shadow-2xs hover:bg-zinc-800 active:scale-98 transition-all"
            >
              <span>Masuk Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans antialiased">
      
      {/* Sidebar Panel */}
      <Sidebar 
        activeMenu={activeMenu}
        setActiveMenu={(menu) => {
          setActiveMenu(menu);
          setSearchQuery("");
        }}
        skillsCount={skills.length}
        projectsCount={projects.length}
        gitProfile={gitProfile}
        handleImgError={handleImgError}
        handleLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2.5 bg-zinc-100/70 border border-zinc-200/80 rounded-lg px-3 py-1.5 w-72 focus-within:ring-2 focus-within:ring-zinc-900 focus-within:bg-white transition-all">
            <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari data skill, proyek..." 
              className="bg-transparent border-none text-xs outline-none text-zinc-800 w-full placeholder:text-zinc-400"
            />
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery("")} 
                className="text-zinc-400 hover:text-zinc-600 text-xs"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 text-[10px] font-mono text-zinc-500 shadow-2xs">
                <Command className="h-2.5 w-2.5" /> K
              </kbd>
            )}
          </div>

          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-white border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all shadow-2xs relative"
              title="Notifikasi Aktivitas"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-zinc-900"></span>
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute top-11 right-10 w-80 bg-white border border-zinc-200 rounded-xl shadow-xl p-4 z-50 animate-dialog-show space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <h4 className="font-semibold text-xs text-zinc-800 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-zinc-900" />
                    <span>Aktivitas Terkini</span>
                  </h4>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {notificationsList.map((note, index) => (
                    <div key={index} className="text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-150 leading-relaxed">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={fetchData} 
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-white border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all shadow-2xs"
              title="Segarkan Data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-zinc-900" : ""}`} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 space-y-6 flex-1">
          {/* Page Title */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              {activeMenu === "dashboard" && "Dashboard Analitik & Ringkasan"}
              {activeMenu === "skills" && "Manajemen Keahlian & Skills"}
              {activeMenu === "projects" && "Manajemen Proyek & Portofolio"}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Ringkasan metrik pengembangan dan manajemen database portofolio secara terpusat.
            </p>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total Projects"
              value={projects.length}
              icon={<Briefcase className="h-4 w-4 text-zinc-700" />}
              subtitle="Tersimpan di Firestore"
            />
            <StatCard 
              title="Total Skills"
              value={skills.length}
              icon={<Code2 className="h-4 w-4 text-zinc-700" />}
              subtitle="Tersimpan di Firestore"
            />
            <StatCard 
              title="Repositori GitHub"
              value={gitProfile?.public_repos || 0}
              icon={<FolderGit2 className="h-4 w-4 text-zinc-700" />}
              subtitle="Repo Publik Active"
            />
            <StatCard 
              title="Pengikut GitHub"
              value={gitProfile?.followers || 0}
              icon={<Users className="h-4 w-4 text-zinc-700" />}
              subtitle="GitHub Profile Followers"
            />
          </div>

          {/* Tab Views */}
          {activeMenu === "dashboard" && (
            <DashboardTab 
              gitProfile={gitProfile}
              gitRepos={gitRepos}
              handleImgError={handleImgError}
            />
          )}

          {activeMenu === "skills" && (
            <SkillsTab 
              skills={skills}
              searchQuery={searchQuery}
              syncingSkills={syncingSkills}
              handleSyncSkillsGitHub={handleSyncSkillsGitHub}
              openAddSkill={openAddSkill}
              openEditSkill={openEditSkill}
              handleDeleteSkill={handleDeleteSkill}
            />
          )}

          {activeMenu === "projects" && (
            <ProjectsTab 
              projects={projects}
              searchQuery={searchQuery}
              syncingGit={syncingGit}
              handleSyncGitHub={handleSyncGitHub}
              openAddProject={openAddProject}
              openEditProject={openEditProject}
              handleDeleteProject={handleDeleteProject}
              getProjectPreview={getProjectPreview}
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
            setSkillModal(prev => ({ ...prev, data: action(prev.data) }));
          } else {
            setSkillModal(prev => ({ ...prev, data: action }));
          }
        }}
        popularSkills={POPULAR_SKILLS}
        onSubmit={saveSkillModal}
        onClose={() => setSkillModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Project Form Modal */}
      <ProjectModal 
        isOpen={projectModal.isOpen}
        isEdit={projectModal.isEdit}
        data={projectModal.data}
        setData={(action) => {
          if (typeof action === "function") {
            setProjectModal(prev => ({ ...prev, data: action(prev.data) }));
          } else {
            setProjectModal(prev => ({ ...prev, data: action }));
          }
        }}
        uploadingImage={uploadingImage}
        handleImageUpload={handleImageUpload}
        onSubmit={saveProjectModal}
        onClose={() => setProjectModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        isDanger={confirmModal.isDanger}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
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
