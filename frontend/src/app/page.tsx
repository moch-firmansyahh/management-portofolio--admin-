"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { GitHubCalendar } from "react-github-calendar";
import { 
  LayoutDashboard, 
  Code2, 
  Briefcase, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Github, 
  Users, 
  FolderGit2, 
  ExternalLink,
  ChevronDown,
  LogOut,
  Bell,
  Search,
  CheckCircle,
  AlertCircle,
  Upload
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  logo: string;
  percent: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface GitHubProfile {
  name: string;
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  bio: string;
  html_url: string;
}

const POPULAR_SKILLS = [
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

export default function AdminDashboard() {
  // Authentication states
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

  // Active Menu sidebar
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "skills" | "projects">("dashboard");

  // Form Modal states
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

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    
    // 1. Fetch Skills from Supabase
    try {
      const { data: skillsData, error: skillsError } = await supabase
        .from("skills")
        .select("*")
        .order("id", { ascending: true });

      if (skillsError) throw skillsError;
      setSkills(skillsData || []);
    } catch (err) {
      console.warn("Error loading skills from Supabase:", err);
    }

    // 2. Fetch Projects from Supabase
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: true });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);
    } catch (err) {
      console.warn("Error loading projects from Supabase:", err);
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
      
      // Filter out repos that are already in Supabase projects list (check by title or link)
      const existingLinks = new Set(projects.map(p => p.link.toLowerCase()));
      const newRepos = repos.filter((r: any) => !existingLinks.has(r.html_url.toLowerCase()));

      if (newRepos.length === 0) {
        showToast("Semua repositori GitHub sudah tersinkronisasi!", "info");
        setSyncingGit(false);
        return;
      }

      triggerConfirm(
        "Sinkronisasi Proyek GitHub",
        `Ditemukan ${newRepos.length} repositori GitHub baru. Apakah Anda yakin ingin menyinkronkan proyek-proyek ini ke database Supabase?`,
        async () => {
          setSyncingGit(true);
          try {
            const insertData = newRepos.map((r: any) => ({
              title: r.name.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
              description: r.description || "Repositori project open source di GitHub.",
              image: "/assets/portofolio.png",
              link: r.html_url
            }));

            const { error } = await supabase.from("projects").insert(insertData);
            if (error) throw error;

            showToast(`Berhasil menyinkronkan ${insertData.length} proyek dari GitHub!`, "success");
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

  // Sync and analyze programming languages from GitHub public repositories as Skills
  const handleSyncSkillsGitHub = async () => {
    setSyncingSkills(true);
    try {
      const res = await fetch("https://api.github.com/users/moch-firmansyahh/repos?per_page=100");
      if (!res.ok) throw new Error("Gagal mengambil data repositori dari GitHub");
      
      const repos = await res.json();
      
      // Extract unique languages, filtering out null/empty values
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

      // Check which languages are already in existing skills (case-insensitive match)
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
            const insertData = newLanguages.map(lang => {
              const foundPopular = POPULAR_SKILLS.find(ps => ps.name.toLowerCase() === lang.toLowerCase());
              let logoVal = "";
              
              if (foundPopular) {
                logoVal = foundPopular.logo;
              } else {
                logoVal = lang.substring(0, 3).toUpperCase();
              }

              return {
                name: lang,
                logo: logoVal,
                percent: 70
              };
            });

            const { error } = await supabase.from("skills").insert(insertData);
            if (error) throw error;

            showToast(`Berhasil mengimpor ${insertData.length} skill baru!`, "success");
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

  // Skill CRUD operations
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
          const { error } = await supabase.from("skills").delete().eq("id", id);
          if (error) throw error;
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
    const finalPercent = parseInt(data.percent as any) || 0;
    try {
      if (isEdit) {
        const { error } = await supabase
          .from("skills")
          .update({ name: data.name, logo: data.logo, percent: finalPercent })
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("skills")
          .insert([{ name: data.name, logo: data.logo, percent: finalPercent }]);
        if (error) throw error;
      }
      setSkillModal({ ...skillModal, isOpen: false });
      showToast("Skill berhasil disimpan!", "success");
      fetchData();
    } catch (err) {
      showToast("Gagal menyimpan: " + (err as Error).message, "error");
    }
  };

  // Project CRUD operations
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
          const { error } = await supabase.from("projects").delete().eq("id", id);
          if (error) throw error;
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

      if (!res.ok) throw new Error("Gagal mengunggah gambar");

      const data = await res.json();
      setProjectModal(prev => ({
        ...prev,
        data: { ...prev.data, image: data.url }
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
        const { error } = await supabase
          .from("projects")
          .update({
            title: data.title,
            description: data.description,
            image: finalImage,
            link: data.link,
          })
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([{
            title: data.title,
            description: data.description,
            image: finalImage,
            link: data.link,
          }]);
        if (error) throw error;
      }
      setProjectModal({ ...projectModal, isOpen: false });
      showToast("Proyek berhasil disimpan!", "success");
      fetchData();
    } catch (err) {
      showToast("Gagal menyimpan: " + (err as Error).message, "error");
    }
  };

  // Login Screen Render
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6] px-4 font-sans">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e1b4b] text-white shadow-lg">
              <Github className="h-7 w-7" />
            </div>
          </div>
          
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Analytical Board Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Akses dashboard analitik portofolio & database Supabase.
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

  // Fallback image helper with error avoidance (prevents infinite loop spam)
  const getAvatarUrl = () => {
    return gitProfile?.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg?seed=Firmansyah";
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; // Unbind error handler to prevent loop
    target.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=Firmansyah";
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] text-gray-900 font-sans antialiased">
      
      {/* Sidebar Panel */}
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
              <span>Kelola Skills ({skills.length})</span>
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
              <span>Kelola Projects ({projects.length})</span>
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
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-gray-50 border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-200"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-20 border-b border-gray-200 bg-white/90 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center gap-3 bg-gray-100 border border-gray-200/50 rounded-xl px-3.5 py-2 w-80">
            <Search className="h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search metrics, reports..." 
              className="bg-transparent border-none text-xs outline-none text-gray-800 w-full placeholder-gray-400"
            />
            <span className="text-[9px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200 shadow-sm">⌘ K</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all shadow-sm">
              <Bell className="h-4.5 w-4.5" />
            </button>
            <button 
              onClick={fetchData} 
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 space-y-8 flex-1">
          {/* Header Title */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Your Analytical Board</h2>
              <p className="text-sm text-gray-500 mt-1">Status dan ringkasan metrik pengembangan portofolio Anda secara terpusat.</p>
            </div>
            {activeMenu === "projects" && (
              <button
                onClick={handleSyncGitHub}
                disabled={syncingGit}
                className="flex items-center gap-2 bg-[#1e1b4b] hover:bg-[#1a1843] font-bold px-4 py-2.5 rounded-xl text-xs text-white shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${syncingGit ? "animate-spin" : ""}`} />
                <span>{syncingGit ? "Menyinkronkan..." : "Sinkronisasi GitHub"}</span>
              </button>
            )}
          </div>

          {/* METRIC CARD ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Projects</span>
                <Briefcase className="h-4.5 w-4.5 text-[#4f46e5]" />
              </div>
              <p className="text-3xl font-black mt-4 text-gray-950">{projects.length}</p>
              <span className="text-[10px] text-gray-400 font-medium block mt-1">Tersimpan di database</span>
            </div>

            <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Skills</span>
                <Code2 className="h-4.5 w-4.5 text-[#4f46e5]" />
              </div>
              <p className="text-3xl font-black mt-4 text-gray-950">{skills.length}</p>
              <span className="text-[10px] text-gray-400 font-medium block mt-1">Keahlian terdaftar</span>
            </div>

            <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Git Repositories</span>
                <FolderGit2 className="h-4.5 w-4.5 text-[#4f46e5]" />
              </div>
              <p className="text-3xl font-black mt-4 text-gray-950">{gitProfile?.public_repos || 0}</p>
              <span className="text-[10px] text-gray-400 font-medium block mt-1">Repo Publik GitHub</span>
            </div>

            <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Git Followers</span>
                <Users className="h-4.5 w-4.5 text-[#4f46e5]" />
              </div>
              <p className="text-3xl font-black mt-4 text-gray-950">{gitProfile?.followers || 0}</p>
              <span className="text-[10px] text-gray-400 font-medium block mt-1">Pengikut profil GitHub</span>
            </div>
          </div>

          {/* DYNAMIC CONTENT AREA */}
          {activeMenu === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* GitHub Contribution Calendar */}
              <div className="lg:col-span-2 rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                    <Github className="h-5 w-5 text-[#4f46e5]" />
                    <span>GitHub Contributions</span>
                  </h3>
                  <span className="text-xs text-gray-500">Username: moch-firmansyahh</span>
                </div>
                
                <div className="flex justify-center py-4 overflow-x-auto w-full">
                  <GitHubCalendar 
                    username="moch-firmansyahh" 
                    theme={{
                      light: ["#ebedf0", "#d6b5f2", "#b37ae6", "#8e05c2", "#5c037f"],
                      dark: ["#ebedf0", "#d6b5f2", "#b37ae6", "#8e05c2", "#5c037f"]
                    }}
                    colorScheme="light"
                  />
                </div>
              </div>

              {/* GitHub Profile Details */}
              <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                    <h3 className="font-bold text-lg text-gray-900">GitHub Info</h3>
                    <a 
                      href={gitProfile?.html_url || "https://github.com/moch-firmansyahh"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#4f46e5] hover:underline text-xs flex items-center gap-1 font-bold"
                    >
                      <span>Lihat GitHub</span> <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getAvatarUrl()} 
                        alt="git avatar" 
                        className="h-14 w-14 rounded-xl border border-gray-200 object-cover"
                        onError={handleImgError}
                      />
                      <div>
                        <h4 className="font-bold text-base text-gray-900">{gitProfile?.name || "Moch Firmansyah"}</h4>
                        <span className="text-xs text-gray-400">@{gitProfile?.login || "moch-firmansyahh"}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 border border-gray-100 p-3 rounded-xl italic">
                      "{gitProfile?.bio || "Front-End Developer Enthusiast."}"
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-6">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Repositori Terbaru</span>
                  <div className="space-y-2">
                    {gitRepos.slice(0, 3).map((r: any) => (
                      <div key={r.id} className="flex justify-between items-center text-xs">
                        <span className="font-bold truncate text-gray-700 w-44">{r.name}</span>
                        <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-[#4f46e5] font-bold px-2 py-0.5 rounded-full uppercase">{r.language || "JS"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SKILLS TABLE TAB */}
          {activeMenu === "skills" && (
            <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Keahlian Terdaftar</h3>
                  <p className="text-xs text-gray-500">Total {skills.length} keahlian aktif di database.</p>
                </div>
                <div className="flex gap-2.5">
                  <button
                    onClick={handleSyncSkillsGitHub}
                    disabled={syncingSkills}
                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2.5 rounded-xl text-xs font-bold transition border border-gray-200 shadow-sm disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${syncingSkills ? "animate-spin" : ""}`} />
                    <span>Sinkronisasi Skill GitHub</span>
                  </button>
                  <button 
                    onClick={openAddSkill}
                    className="flex items-center gap-1.5 bg-[#1e1b4b] hover:bg-[#1a1843] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Skill</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-150 text-gray-400 font-bold text-xs uppercase tracking-wider">
                      <th className="py-4 px-4">Singkatan</th>
                      <th className="py-4 px-4">Nama Keahlian</th>
                      <th className="py-4 px-4">Tingkat Penguasaan</th>
                      <th className="py-4 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill) => (
                      <tr key={skill.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition duration-150">
                        <td className="py-4 px-4">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-bold uppercase text-[#4f46e5]">
                            {skill.logo}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-900">{skill.name}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className="font-bold w-10 text-xs text-gray-700">{skill.percent}%</span>
                            <div className="w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="bg-[#4f46e5] h-full" style={{ width: `${skill.percent}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => openEditSkill(skill)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-[#4f46e5] hover:text-[#4f46e5] transition shadow-sm"
                              title="Edit"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-red-500 hover:text-red-500 transition shadow-sm"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {skills.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-400">Belum ada data skill di Supabase.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROJECTS TABLE TAB */}
          {activeMenu === "projects" && (
            <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Proyek Terdaftar</h3>
                  <p className="text-xs text-gray-500">Total {projects.length} proyek aktif di database.</p>
                </div>
                <button 
                  onClick={openAddProject}
                  className="flex items-center gap-1.5 bg-[#1e1b4b] hover:bg-[#1a1843] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Proyek</span>
                </button>
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
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition duration-150">
                        <td className="py-4 px-4">
                          <img 
                            src={project.image || "/assets/portofolio.png"} 
                            alt={project.title} 
                            className="h-10 w-16 object-cover rounded-lg border border-gray-200"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/assets/portofolio.png"; }}
                          />
                        </td>
                        <td className="py-4 px-4 font-semibold truncate max-w-[150px] text-gray-900">{project.title}</td>
                        <td className="py-4 px-4 text-gray-500 text-xs truncate max-w-[250px]" title={project.description}>
                          {project.description}
                        </td>
                        <td className="py-4 px-4">
                          {project.link !== "#" ? (
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
                              title="Edit"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-red-500 hover:text-red-500 transition shadow-sm"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">Belum ada data proyek di Supabase.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Skill Modal */}
      {skillModal.isOpen && (
        <div className="admin-modal-overlay">
          <form onSubmit={saveSkillModal} className="admin-modal max-w-md w-full bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl space-y-5">
            <h2 className="text-xl font-bold border-b border-gray-150 pb-3 text-gray-900">
              {skillModal.isEdit ? "Edit Skill" : "Tambah Skill"}
            </h2>
            
            <div className="admin-input-group space-y-1.5">
              <label htmlFor="skill-name" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Nama Skill</label>
              <input
                type="text"
                id="skill-name"
                list="popular-skills"
                value={skillModal.data.name}
                onChange={(e) => {
                  const customName = e.target.value;
                  
                  // Auto-fill logo if customName matches one of our popular skills
                  const foundPopular = POPULAR_SKILLS.find(s => s.name.toLowerCase() === customName.toLowerCase());
                  let logoVal = skillModal.data.logo;

                  if (foundPopular) {
                    logoVal = foundPopular.logo;
                  } else {
                    if (customName.length > 0) {
                      const words = customName.split(" ").filter(w => w);
                      if (words.length >= 2) {
                        logoVal = (words[0][0] + words[1][0]).toUpperCase().substring(0, 3);
                      } else {
                        logoVal = customName.substring(0, 3).toUpperCase();
                      }
                    } else {
                      logoVal = "";
                    }
                  }

                  setSkillModal({
                    ...skillModal,
                    data: { ...skillModal.data, name: customName, logo: logoVal }
                  });
                }}
                placeholder="Pilih atau ketik nama skill..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#4f46e5] focus:bg-white transition"
                required
              />
              <datalist id="popular-skills">
                {POPULAR_SKILLS.map(s => (
                  <option key={s.name} value={s.name} />
                ))}
              </datalist>
            </div>

            <div className="admin-input-group space-y-1.5">
              <label htmlFor="skill-logo" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Logo / Singkatan (Maksimal 3 karakter)</label>
              <input
                type="text"
                id="skill-logo"
                value={skillModal.data.logo}
                onChange={(e) =>
                  setSkillModal({ ...skillModal, data: { ...skillModal.data, logo: e.target.value.substring(0, 3) } })
                }
                placeholder="Contoh: JS, PY, Re"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#4f46e5] focus:bg-white transition"
                required
              />
            </div>

            <div className="admin-input-group space-y-1.5">
              <label htmlFor="skill-percent" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Persentase Penguasaan (%)</label>
              <input
                type="number"
                id="skill-percent"
                min="0"
                max="100"
                value={skillModal.data.percent}
                onChange={(e) => {
                  const val = e.target.value;
                  setSkillModal({
                    ...skillModal,
                    data: {
                      ...skillModal.data,
                      percent: val === "" ? "" as any : parseInt(val)
                    }
                  });
                }}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#4f46e5] focus:bg-white transition"
                required
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-gray-150">
              <button
                type="button"
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition"
                onClick={() => setSkillModal({ ...skillModal, isOpen: false })}
              >
                Kembali
              </button>
              <button 
                type="submit" 
                className="flex-1.5 rounded-xl bg-[#1e1b4b] hover:bg-[#1a1843] py-3 text-sm font-semibold text-white transition"
              >
                Simpan Keahlian
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Project Modal */}
      {projectModal.isOpen && (
        <div className="admin-modal-overlay">
          <form onSubmit={saveProjectModal} className="admin-modal max-w-md w-full bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl space-y-5">
            <h2 className="text-xl font-bold border-b border-gray-150 pb-3 text-gray-900">
              {projectModal.isEdit ? "Edit Proyek" : "Tambah Proyek"}
            </h2>
            
            <div className="admin-input-group space-y-1.5">
              <label htmlFor="project-title" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Judul Proyek</label>
              <input
                type="text"
                id="project-title"
                value={projectModal.data.title}
                onChange={(e) =>
                  setProjectModal({ ...projectModal, data: { ...projectModal.data, title: e.target.value } })
                }
                placeholder="Contoh: E-Commerce Web App"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#4f46e5] focus:bg-white transition"
                required
              />
            </div>

            <div className="admin-input-group space-y-1.5">
              <label htmlFor="project-desc" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Deskripsi Singkat</label>
              <textarea
                id="project-desc"
                value={projectModal.data.description}
                onChange={(e) =>
                  setProjectModal({ ...projectModal, data: { ...projectModal.data, description: e.target.value } })
                }
                placeholder="Tulis deskripsi proyek..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#4f46e5] focus:bg-white transition resize-none"
                required
              ></textarea>
            </div>

            <div className="admin-input-group space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Gambar Proyek</label>
              
              {/* Image Preview */}
              {projectModal.data.image && (
                <div className="relative h-32 w-full rounded-xl overflow-hidden border border-gray-150 bg-gray-50 flex items-center justify-center">
                  <img
                    src={projectModal.data.image}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as any).onerror = null;
                      (e.target as any).src = "https://api.dicebear.com/7.x/identicon/svg";
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-semibold">
                    Aktif
                  </div>
                </div>
              )}

              {/* File Input Zone */}
              <div className="relative">
                <input
                  type="file"
                  id="project-image-file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="project-image-file"
                  className="flex items-center justify-center gap-2 cursor-pointer w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-[#4f46e5] bg-gray-50 px-4 py-3.5 text-xs text-gray-600 hover:text-[#4f46e5] transition font-bold"
                >
                  <Upload className="h-4 w-4 text-gray-400" />
                  <span>{uploadingImage ? "Mengunggah..." : "Pilih File Gambar (PNG, JPG)"}</span>
                </label>
              </div>
            </div>

            <div className="admin-input-group space-y-1.5">
              <label htmlFor="project-link" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Link Proyek / Demo</label>
              <input
                type="text"
                id="project-link"
                value={projectModal.data.link}
                onChange={(e) =>
                  setProjectModal({ ...projectModal, data: { ...projectModal.data, link: e.target.value } })
                }
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#4f46e5] focus:bg-white transition"
                required
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-gray-150">
              <button
                type="button"
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition"
                onClick={() => setProjectModal({ ...projectModal, isOpen: false })}
              >
                Kembali
              </button>
              <button 
                type="submit" 
                className="flex-1.5 rounded-xl bg-[#1e1b4b] hover:bg-[#1a1843] py-3 text-sm font-semibold text-white transition"
              >
                Simpan Proyek
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toast Notification */}
      {toast.isOpen && (
        <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 bg-white border border-gray-200 px-5 py-3.5 rounded-2xl shadow-xl animate-fade-in-up">
          {toast.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {toast.type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
          {toast.type === "info" && <RefreshCw className="h-5 w-5 text-[#4f46e5] animate-spin" />}
          <span className="text-sm font-semibold text-gray-800">{toast.message}</span>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="admin-modal-overlay">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl max-w-sm w-full space-y-5">
            <h3 className="text-lg font-bold text-gray-900">{confirmModal.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 py-2.5 text-xs font-bold text-gray-700 transition"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              >
                Batal
              </button>
              <button
                type="button"
                className={`flex-1 rounded-xl py-2.5 text-xs font-bold text-white transition shadow-md ${
                  confirmModal.isDanger 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-[#1e1b4b] hover:bg-[#1a1843]"
                }`}
                onClick={confirmModal.onConfirm}
              >
                {confirmModal.confirmText || "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
