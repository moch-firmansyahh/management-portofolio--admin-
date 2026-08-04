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
  Info
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
  { name: "HTML", logo: "HTML" },
  { name: "CSS", logo: "CSS" },
  { name: "JavaScript", logo: "JS" },
  { name: "TypeScript", logo: "TS" },
  { name: "React", logo: "RE" },
  { name: "Next.js", logo: "NX" },
  { name: "Node.js", logo: "ND" },
  { name: "Go", logo: "Go" },
  { name: "C++", logo: "C++" },
  { name: "Python", logo: "PY" },
  { name: "Figma", logo: "FG" },
  { name: "Canva", logo: "CN" },
  { name: "PHP", logo: "PHP" },
  { name: "Laravel", logo: "LA" },
  { name: "MySQL", logo: "SQL" },
  { name: "Git", logo: "Git" }
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
    "Sistem siap digunakan dengan database Firebase Firestore.",
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
    // Add to activity list
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

  // Simple local passcode check
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

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6] px-4 font-sans">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e1b4b] text-white shadow-lg">
              <Github className="h-7 w-7" />
            </div>
          </div>
          
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Analytical Board Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Akses dashboard analitik portofolio & database Firebase.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Password Admin
              </label>
              <input
                type="password"
                id="password"
                placeholder="Masukkan password admin..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition duration-300 focus:border-[#4f46e5] focus:bg-white focus:ring-1 focus:ring-[#4f46e5]"
                required
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#1e1b4b] py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-[#1a1843] active:scale-95 transition-all duration-300"
            >
              Masuk ke Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] text-gray-900 font-sans antialiased">
      
      {/* Modular Sidebar Panel */}
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
        <header className="h-20 border-b border-gray-200 bg-white/90 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3 bg-gray-100 border border-gray-200/60 rounded-xl px-3.5 py-2 w-80 focus-within:ring-2 focus-within:ring-[#4f46e5]/30 transition-all">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari skill, proyek, link..." 
              className="bg-transparent border-none text-xs outline-none text-gray-800 w-full placeholder-gray-400"
            />
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery("")} 
                className="text-gray-400 hover:text-gray-600 text-xs"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <span className="text-[9px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200 shadow-sm shrink-0">
                ⌘ K
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all shadow-sm relative"
              title="Notifikasi Aktivitas"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#4f46e5]"></span>
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute top-12 right-12 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50 animate-fade-in-up">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-[#4f46e5]" />
                    <span>Aktivitas Terkini</span>
                  </h4>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notificationsList.map((note, index) => (
                    <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 leading-relaxed">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={fetchData} 
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4.5 w-4.5 ${loading ? "animate-spin text-[#4f46e5]" : ""}`} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 space-y-8 flex-1">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {activeMenu === "dashboard" && "Your Analytical Board"}
                {activeMenu === "skills" && "Manajemen Skills"}
                {activeMenu === "projects" && "Manajemen Projects"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Status dan ringkasan metrik pengembangan portofolio Anda secara terpusat.
              </p>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard 
              title="Total Projects"
              value={projects.length}
              icon={<Briefcase className="h-4.5 w-4.5 text-[#4f46e5]" />}
              subtitle="Tersimpan di Firebase"
            />
            <StatCard 
              title="Total Skills"
              value={skills.length}
              icon={<Code2 className="h-4.5 w-4.5 text-[#4f46e5]" />}
              subtitle="Keahlian terdaftar"
            />
            <StatCard 
              title="Git Repositories"
              value={gitProfile?.public_repos || 0}
              icon={<FolderGit2 className="h-4.5 w-4.5 text-[#4f46e5]" />}
              subtitle="Repo Publik GitHub"
            />
            <StatCard 
              title="Git Followers"
              value={gitProfile?.followers || 0}
              icon={<Users className="h-4.5 w-4.5 text-[#4f46e5]" />}
              subtitle="Pengikut GitHub"
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
