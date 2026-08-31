"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../lib/firebase";
import { 
  collection, 
  getDocs, 
  getDoc,
  setDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  writeBatch,
  serverTimestamp,
  orderBy,
  query
} from "firebase/firestore";
import { 
  Briefcase, 
  Code2, 
  FolderGit2, 
  Users, 
  Search, 
  Bell, 
  RefreshCw, 
  AlertCircle, 
  X,
  Info,
  Command,
  Lock,
  ArrowRight,
  User,
  GraduationCap,
  Inbox,
  Mail
} from "lucide-react";

import Sidebar, { AdminTab } from "../components/Sidebar";
import DashboardTab, { GitHubProfile } from "../components/DashboardTab";
import SkillsTab, { Skill } from "../components/SkillsTab";
import ProjectsTab, { Project } from "../components/ProjectsTab";
import AboutTab, { ProfileData } from "../components/AboutTab";
import ExperienceTab from "../components/ExperienceTab";
import ExperienceModal, { Experience } from "../components/ExperienceModal";
import MessagesTab from "../components/MessagesTab";
import MessageModal, { ContactMessage } from "../components/MessageModal";
import SkillModal, { PopularSkill } from "../components/SkillModal";
import ProjectModal from "../components/ProjectModal";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import StatCard from "../components/StatCard";

const POPULAR_SKILLS: PopularSkill[] = [
  // 1. Front-End Web Development
  { name: "HTML", logo: "HTM", category: "Front-End Web Development" },
  { name: "CSS", logo: "CSS", category: "Front-End Web Development" },
  { name: "JavaScript", logo: "JS", category: "Front-End Web Development" },
  { name: "React", logo: "RE", category: "Front-End Web Development" },
  { name: "Next.js", logo: "NX", category: "Front-End Web Development" },
  { name: "Tailwind CSS", logo: "TW", category: "Front-End Web Development" },
  { name: "TypeScript", logo: "TS", category: "Front-End Web Development" },

  // 2. Programming Languages
  { name: "C++", logo: "CPP", category: "Programming Languages" },
  { name: "Python", logo: "PY", category: "Programming Languages" },
  { name: "Java", logo: "JAV", category: "Programming Languages" },
  { name: "Go (Golang)", logo: "GO", category: "Programming Languages" },

  // 3. Developer Tools
  { name: "Git / GitHub", logo: "GIT", category: "Developer Tools" },
  { name: "VS Code", logo: "VSC", category: "Developer Tools" },
  { name: "Postman", logo: "PST", category: "Developer Tools" },
  { name: "Antigravity", logo: "AGY", category: "Developer Tools" },
  { name: "Figma", logo: "FG", category: "Developer Tools" },
  { name: "Wireshark", logo: "WSH", category: "Developer Tools" },
  { name: "MySQL Workbench", logo: "SQL", category: "Developer Tools" },

  // 4. Soft Skills & Professional
  { name: "Technical Problem-Solving", logo: "TPS", category: "Soft Skills & Professional" },
  { name: "Analytical Thinking", logo: "AT", category: "Soft Skills & Professional" },
  { name: "Team Collaboration", logo: "TC", category: "Soft Skills & Professional" },
  { name: "Time Management", logo: "TM", category: "Soft Skills & Professional" },
  { name: "Client Management", logo: "CM", category: "Soft Skills & Professional" },

  // 5. Achievements & Certifications (Semua 16 Sertifikasi Google AI & Security)
  { name: "Sertifikat Profesional Google AI", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Google Network Security Spesialisasi", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI Fundamentals", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Network Architecture", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI for Research and Insights", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Network Operations", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI for Writing and Communicating", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Secure Against Network Intrusions", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI for Content Creation", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Security Hardening", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI for Data Analysis", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI for App Building", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Network Monitoring and Analysis", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Network Traffic and Logs Using IDS and SIEM Tools", logo: "GOO", category: "Achievements & Certifications" },
  { name: "AI for Brainstorming and Planning", logo: "GOO", category: "Achievements & Certifications" },
  { name: "Introduction to Detection and Incident Response", logo: "GOO", category: "Achievements & Certifications" },
];

const DEFAULT_PROFILE: ProfileData = {
  name: "Moch. Firmansyah",
  shortName: "Firman",
  role: "Frontend Developer & Security Enthusiast",
  tagline: "Code that looks good. Systems that stay safe.",
  bio: "Sebagai mahasiswa Teknik Informatika di Telkom University, saya berdedikasi untuk menerapkan keterampilan analitis dan keahlian teknis saya dalam peran Front-End Developer di industri teknologi. Latar belakang akademik telah membekali saya dengan fondasi yang kuat dalam pemrograman, pengembangan web modern, dan pengelolaan basis data.\n\nSaya memiliki pengalaman langsung dalam membangun aplikasi web menggunakan React dan Next.js, didukung oleh pemahaman yang solid dalam pengembangan front-end maupun back-end, termasuk perancangan dan manajemen database.\n\nDi samping pengembangan antarmuka, saya memiliki ketertarikan mendalam pada Cyber Security dan Network Security. Berbekal sertifikasi spesialisasi dari Google, saya aktif menerapkan prinsip Secure Coding dan validasi data ketat guna memastikan setiap aplikasi web yang saya bangun tidak hanya estetik dan responsif, tetapi juga aman dan terlindungi.",
  status: "Available for opportunities",
  location: "Bandung, Indonesia",
  email: "firmanajah366@gmail.com",
  phone: "+62 812-3456-7890",
  resumeUrl: "#contact",
  socialLinks: {
    github: "https://github.com/moch-firmansyahh",
    linkedin: "https://www.linkedin.com/in/moch-firmansyah-532122323/",
    instagram: "https://www.instagram.com/frmzyxx/",
    tiktok: "https://www.tiktok.com/@frmnzy_",
  },
  stats: [
    { label: "Tahun Belajar & Berkarya", value: "2+" },
    { label: "Proyek Selesai", value: "5+" },
    { label: "Lighthouse Performance", value: "98%" },
    { label: "Dedikasi & Presisi", value: "100%" },
  ],
};

const DEFAULT_EXPERIENCES: Omit<Experience, "id">[] = [
  {
    period: "Feb 2026 - Present",
    role: "Study Group Member",
    company: "Central Computer Improvement Telkom University",
    location: "Bandung, West Java, Indonesia",
    description: "Actively participated in the Central Computer Improvement (CCI) Study Group, specializing in modern web development. Gained hands-on experience building responsive user interfaces with Tailwind CSS and mastering the Next.js framework. Core focus areas included handling complex React state management, implementing dynamic routing architectures, and optimizing data fetching strategies (SSR & Client-Side) using Axios and Fetch to integrate REST APIs efficiently.",
    technologies: ["Next.js", "React", "Tailwind CSS", "REST API", "Front-End Development", "Software System Analysis"],
    type: "Work",
  },
  {
    period: "Nov 2025 - Dec 2025",
    role: "Study Group Member",
    company: "Cyber Physical System Laboratory",
    location: "Bandung, West Java, Indonesia",
    description: "Actively participated in the Website Development Study Group to build web applications end-to-end. Hands-on practice included Front-End development with React.js and Tailwind CSS, Back-End (REST API) architecture with Node.js, Express.js, and MySQL, as well as API testing, integration, and public cloud deployment.",
    technologies: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MySQL", "REST API", "Cloud Deployment"],
    type: "Work",
  },
  {
    period: "Nov 2024 - Jun 2025",
    role: "Study Group Member",
    company: "GDGoC Telkom University Bandung",
    location: "Bandung, West Java, Indonesia",
    description: "Active member of the Web Development Study Group at Google Developer Groups on Campus (GDGoC), learning and practicing modern web development alongside fellow members. Participated in group learning sessions, hands-on workshops, and collaborative projects focusing on web design and modern frontend engineering.",
    technologies: ["Web Development", "Web Design", "JavaScript", "HTML/CSS", "Collaboration"],
    type: "Work",
  },
];

const getProjectPreview = (image: string, link: string) => {
  if (image && (image.startsWith("/projects/") || image.startsWith("http"))) {
    return image;
  }
  if (!image || image === "/assets/portofolio.png") {
    if (link && link.includes("github.com/")) {
      const parts = link.split("github.com/");
      if (parts.length > 1) {
        const repoPath = parts[1].split("?")[0];
        return `https://opengraph.githubassets.com/1/${repoPath}`;
      }
    }
  }
  return image || "/projects/manajemen-kontrakan.png";
};

export default function AdminDashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Data states
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [gitProfile, setGitProfile] = useState<GitHubProfile | null>(null);
  const [gitRepos, setGitRepos] = useState<any[]>([]);

  // Loading & syncing states
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [syncingGit, setSyncingGit] = useState(false);
  const [syncingSkills, setSyncingSkills] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeedingExperience, setIsSeedingExperience] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Search & Navigation states
  const [activeMenu, setActiveMenu] = useState<AdminTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Notifications Popover state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState<string[]>([
    "Sistem CMS siap digunakan dengan Firebase Firestore.",
    "Buka tab Pesan Masuk untuk memeriksa kontak dari pengunjung."
  ]);

  // Modals state
  const [skillModal, setSkillModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    data: Skill;
  }>({
    isOpen: false,
    isEdit: false,
    data: { id: "", name: "", logo: "", percent: "", category: "Front-End Web Development" },
  });
  const [isSeedingSkills, setIsSeedingSkills] = useState(false);

  const [projectModal, setProjectModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    data: Project;
  }>({
    isOpen: false,
    isEdit: false,
    data: {
      id: "",
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

  const [experienceModal, setExperienceModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    data: Experience;
  }>({
    isOpen: false,
    isEdit: false,
    data: {
      id: "",
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

  // Toast state
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    message: "",
    type: "info",
  });

  // Confirmation modal state
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
    onConfirm: () => {},
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ isOpen: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isOpen: false }));
    }, 3500);
  };

  const triggerConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    isDanger: boolean = false,
    confirmText: string = "Konfirmasi"
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

  // Check Local Auth
  useEffect(() => {
    const authSession = localStorage.getItem("portfolio_admin_auth");
    if (authSession === "true") {
      setIsAuthenticated(true);
    }
  }, []);

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

  // Fetch all Firestore collections
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Skills
      const skillsSnap = await getDocs(collection(db, "skills"));
      const skillsList: Skill[] = [];
      skillsSnap.forEach((doc) => {
        skillsList.push({ id: doc.id, ...doc.data() } as Skill);
      });
      setSkills(skillsList);

      // 2. Fetch Projects
      const projectsSnap = await getDocs(collection(db, "projects"));
      const projectsList: Project[] = [];
      projectsSnap.forEach((doc) => {
        projectsList.push({ id: doc.id, ...doc.data() } as Project);
      });
      setProjects(projectsList);

      // 3. Fetch Profile / About
      const profileSnap = await getDoc(doc(db, "profile", "main"));
      if (profileSnap.exists()) {
        const pData = profileSnap.data() as ProfileData;
        setProfile({
          ...DEFAULT_PROFILE,
          ...pData,
          socialLinks: { ...DEFAULT_PROFILE.socialLinks, ...(pData.socialLinks || {}) },
          stats: (pData.stats && pData.stats.length > 0) ? pData.stats : DEFAULT_PROFILE.stats,
        });
      } else {
        setProfile(DEFAULT_PROFILE);
      }

      // 4. Fetch Experiences
      const expQuery = query(collection(db, "experiences"), orderBy("createdAt", "desc"));
      const expSnap = await getDocs(expQuery).catch(async () => {
        return await getDocs(collection(db, "experiences"));
      });
      const expList: Experience[] = [];
      expSnap.forEach((doc) => {
        expList.push({ id: doc.id, ...doc.data() } as Experience);
      });
      setExperiences(expList);

      // 5. Fetch Messages (Inbox)
      const msgQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const msgSnap = await getDocs(msgQuery).catch(async () => {
        return await getDocs(collection(db, "messages"));
      });
      const msgList: ContactMessage[] = [];
      msgSnap.forEach((doc) => {
        msgList.push({ id: doc.id, ...doc.data() } as ContactMessage);
      });
      setMessages(msgList);

      // 6. Fetch GitHub Data
      try {
        const userRes = await fetch("https://api.github.com/users/moch-firmansyahh");
        if (userRes.ok) {
          const userData = await userRes.json();
          setGitProfile(userData);
        }
        const reposRes = await fetch("https://api.github.com/users/moch-firmansyahh/repos?per_page=100&sort=updated");
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          setGitRepos(reposData);
        }
      } catch (gitErr) {
        console.warn("Gagal mengambil data GitHub:", gitErr);
      }
    } catch (err) {
      console.error(err);
      showToast("Gagal memuat data: " + (err as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "admin123" || passwordInput === "firman2026") {
      localStorage.setItem("portfolio_admin_auth", "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Kredensial tidak valid. Silakan periksa kembali.");
    }
  };

  const handleLogout = () => {
    triggerConfirm(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar dari sesi Dashboard Admin?",
      () => {
        localStorage.removeItem("portfolio_admin_auth");
        setIsAuthenticated(false);
        setPasswordInput("");
      },
      false,
      "Keluar"
    );
  };

  // --- PROFILE HANDLERS ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await setDoc(doc(db, "profile", "main"), {
        ...profile,
        updatedAt: serverTimestamp(),
      });
      showToast("Profil dan informasi Tentang Saya berhasil disimpan!", "success");
    } catch (err: any) {
      showToast("Gagal menyimpan profil: " + err.message, "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResetDefaultProfile = () => {
    triggerConfirm(
      "Muat Data Asli Web",
      "Apakah Anda ingin memuat kembali data profil dan statistik bawaan dari portofolio web?",
      () => {
        setProfile(DEFAULT_PROFILE);
        showToast("Data profil dikembalikan ke konfigurasi bawaan web.", "info");
      }
    );
  };

  // --- EXPERIENCE CRUD HANDLERS ---
  const openAddExperience = () => {
    setExperienceModal({
      isOpen: true,
      isEdit: false,
      data: {
        id: "",
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
    const { isEdit, data } = experienceModal;
    if (!data.role.trim() || !data.company.trim() || !data.period.trim()) {
      showToast("Posisi, instansi, dan periode waktu wajib diisi!", "error");
      return;
    }

    try {
      if (isEdit) {
        await updateDoc(doc(db, "experiences", data.id), {
          role: data.role.trim(),
          company: data.company.trim(),
          period: data.period.trim(),
          location: data.location.trim(),
          description: data.description.trim(),
          technologies: data.technologies || [],
          type: data.type || "Work",
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "experiences"), {
          role: data.role.trim(),
          company: data.company.trim(),
          period: data.period.trim(),
          location: data.location.trim(),
          description: data.description.trim(),
          technologies: data.technologies || [],
          type: data.type || "Work",
          createdAt: serverTimestamp(),
        });
      }
      setExperienceModal(prev => ({ ...prev, isOpen: false }));
      showToast("Riwayat pengalaman berhasil disimpan!", "success");
      fetchData();
    } catch (err: any) {
      showToast("Gagal menyimpan riwayat: " + err.message, "error");
    }
  };

  const handleDeleteExperience = async (id: string) => {
    triggerConfirm(
      "Hapus Riwayat Pengalaman",
      "Apakah Anda yakin ingin menghapus riwayat ini? Data akan terhapus dari timeline web.",
      async () => {
        try {
          await deleteDoc(doc(db, "experiences", id));
          showToast("Riwayat pengalaman berhasil dihapus!", "success");
          fetchData();
        } catch (err: any) {
          showToast("Gagal menghapus: " + err.message, "error");
        }
      },
      true,
      "Hapus"
    );
  };

  const handleSeedDefaultExperience = async () => {
    triggerConfirm(
      "Impor Pengalaman Bawaan Web",
      "Apakah Anda ingin mengimpor 3 riwayat studi & organisasi bawaan dari website ke Firestore?",
      async () => {
        setIsSeedingExperience(true);
        try {
          const batch = writeBatch(db);
          for (const item of DEFAULT_EXPERIENCES) {
            const newDocRef = doc(collection(db, "experiences"));
            batch.set(newDocRef, {
              ...item,
              createdAt: serverTimestamp(),
            });
          }
          await batch.commit();
          showToast("Riwayat pengalaman bawaan berhasil diimpor ke Firestore!", "success");
          fetchData();
        } catch (err: any) {
          showToast("Gagal impor pengalaman: " + err.message, "error");
        } finally {
          setIsSeedingExperience(false);
        }
      }
    );
  };

  // --- MESSAGES (INBOX) HANDLERS ---
  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsMessageModalOpen(true);
    if (!msg.read) {
      handleToggleReadMessage(msg.id, false, false);
    }
  };

  const handleToggleReadMessage = async (id: string, currentStatus: boolean, notify = true) => {
    try {
      await updateDoc(doc(db, "messages", id), {
        read: !currentStatus,
      });
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, read: !currentStatus } : m))
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, read: !currentStatus } : null);
      }
      if (notify) {
        showToast(!currentStatus ? "Pesan ditandai sudah dibaca." : "Pesan ditandai belum dibaca.", "info");
      }
    } catch (err: any) {
      showToast("Gagal memperbarui status pesan: " + err.message, "error");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    triggerConfirm(
      "Hapus Pesan Masuk",
      "Apakah Anda yakin ingin menghapus pesan ini secara permanen?",
      async () => {
        try {
          await deleteDoc(doc(db, "messages", id));
          setMessages(prev => prev.filter(m => m.id !== id));
          showToast("Pesan berhasil dihapus dari Inbox!", "success");
        } catch (err: any) {
          showToast("Gagal menghapus pesan: " + err.message, "error");
        }
      },
      true,
      "Hapus"
    );
  };

  // --- SKILL CRUD HANDLERS ---
  const openAddSkill = (defaultCategory: string = "Front-End Web Development") => {
    setSkillModal({
      isOpen: true,
      isEdit: false,
      data: { id: "", name: "", logo: "", percent: "", category: defaultCategory },
    });
  };

  const openEditSkill = (skill: Skill) => {
    setSkillModal({
      isOpen: true,
      isEdit: true,
      data: {
        ...skill,
        category: skill.category || "Front-End Web Development",
      },
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
    const rawVal = data.percent;
    if (rawVal === "" || rawVal === null || isNaN(Number(rawVal)) || Number(rawVal) <= 0) {
      showToast("Persentase penguasaan harus diisi antara 1 - 100%!", "error");
      return;
    }
    const finalPercent = Math.max(1, Math.min(100, parseInt(String(rawVal), 10)));
    try {
      if (isEdit) {
        await updateDoc(doc(db, "skills", data.id), {
          name: data.name.trim(),
          logo: data.logo.trim(),
          percent: finalPercent,
          category: data.category || "Front-End Web Development",
        });
      } else {
        await addDoc(collection(db, "skills"), {
          name: data.name.trim(),
          logo: data.logo.trim(),
          percent: finalPercent,
          category: data.category || "Front-End Web Development",
          createdAt: serverTimestamp(),
        });
      }
      setSkillModal(prev => ({ ...prev, isOpen: false }));
      showToast("Skill berhasil disimpan!", "success");
      fetchData();
    } catch (err) {
      showToast("Gagal menyimpan: " + (err as Error).message, "error");
    }
  };

  const handleSeedDefaultSkills = async () => {
    triggerConfirm(
      "Impor Keahlian Bawaan Web",
      "Apakah Anda ingin menyinkronkan seluruh daftar keahlian dari 5 kategori bawaan web (Front-End, Languages, Tools, Soft Skills, Certifications) ke Firestore?",
      async () => {
        setIsSeedingSkills(true);
        try {
          const batch = writeBatch(db);
          const existingNames = new Set(skills.map(s => s.name.toLowerCase()));
          let addedCount = 0;

          POPULAR_SKILLS.forEach((ps) => {
            if (!existingNames.has(ps.name.toLowerCase())) {
              const docRef = doc(collection(db, "skills"));
              batch.set(docRef, {
                name: ps.name,
                logo: ps.logo,
                percent: ps.category === "Achievements & Certifications" ? 100 : 85,
                category: ps.category || "Front-End Web Development",
                createdAt: serverTimestamp(),
              });
              addedCount++;
            }
          });

          if (addedCount > 0) {
            await batch.commit();
            showToast(`Berhasil menyinkronkan ${addedCount} keahlian ke dalam 5 kategori!`, "success");
            fetchData();
          } else {
            showToast("Semua keahlian bawaan sudah ada dalam daftar!", "info");
          }
        } catch (err: any) {
          showToast("Gagal mengimpor keahlian: " + err.message, "error");
        } finally {
          setIsSeedingSkills(false);
        }
      }
    );
  };

  const handleSyncSkillsGitHub = async () => {
    setSyncingSkills(true);
    try {
      const languagesMap = new Set<string>();
      for (const repo of gitRepos) {
        if (repo.language) {
          languagesMap.add(repo.language);
        }
      }
      const existingSkillNames = new Set(skills.map(s => s.name.toLowerCase()));
      const newLanguages = Array.from(languagesMap).filter(
        lang => !existingSkillNames.has(lang.toLowerCase())
      );

      if (newLanguages.length === 0) {
        showToast("Semua bahasa dari GitHub sudah ada dalam daftar skill!", "info");
        setSyncingSkills(false);
        return;
      }

      triggerConfirm(
        "Sinkronkan Skill dari GitHub",
        `Ditemukan ${newLanguages.length} bahasa pemrograman baru: ${newLanguages.join(", ")}. Apakah Anda ingin menambahkannya ke Firestore?`,
        async () => {
          try {
            const batch = writeBatch(db);
            newLanguages.forEach(lang => {
              let logoVal = lang.substring(0, 3).toUpperCase();
              let categoryVal = "Programming Languages";
              const found = POPULAR_SKILLS.find(s => s.name.toLowerCase() === lang.toLowerCase());
              if (found) {
                logoVal = found.logo;
                if (found.category) categoryVal = found.category;
              }
              
              const docRef = doc(collection(db, "skills"));
              batch.set(docRef, {
                name: lang,
                logo: logoVal,
                percent: 75,
                category: categoryVal,
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

  // --- PROJECT CRUD HANDLERS ---
  const openAddProject = () => {
    setProjectModal({
      isOpen: true,
      isEdit: false,
      data: {
        id: "",
        title: "",
        subtitle: "",
        description: "",
        longDescription: "",
        tags: ["Web App", "Next.js 16"],
        category: "Web App",
        featured: false,
        image: "/projects/manajemen-kontrakan.png",
        link: "",
        demoUrl: "",
        githubUrl: "",
        metrics: "Full-Stack • Interactive",
        highlights: ["Fitur utama dirancang responsif dan interaktif."],
        year: new Date().getFullYear().toString(),
      },
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
    formData.append("image", file);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3002";
      const res = await fetch(`${backendUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Gagal mengupload gambar ke backend server (port 3002)");
      }

      const data = await res.json();
      const finalImageUrl = data.imageUrl || data.url || data.localUrl;
      setProjectModal((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          image: finalImageUrl,
        },
      }));
      showToast("Gambar cover proyek berhasil diupload!", "success");
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProjectModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isEdit, data } = projectModal;
    if (!data.title.trim() || !data.description.trim()) {
      showToast("Judul dan deskripsi proyek wajib diisi!", "error");
      return;
    }

    try {
      const payload = {
        title: data.title.trim(),
        subtitle: data.subtitle || data.description,
        description: data.description.trim(),
        longDescription: data.longDescription || data.description,
        tags: data.tags || [],
        category: data.category || "Web App",
        featured: !!data.featured,
        image: data.image || "/projects/manajemen-kontrakan.png",
        link: data.demoUrl || data.link || "",
        demoUrl: data.demoUrl || data.link || "",
        githubUrl: data.githubUrl || "",
        metrics: data.metrics || "Interactive UI",
        highlights: data.highlights || [],
        year: data.year || new Date().getFullYear().toString(),
      };

      if (isEdit) {
        await updateDoc(doc(db, "projects", data.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "projects"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }
      setProjectModal(prev => ({ ...prev, isOpen: false }));
      showToast("Proyek berhasil disimpan!", "success");
      fetchData();
    } catch (err) {
      showToast("Gagal menyimpan: " + (err as Error).message, "error");
    }
  };

  const handleSeedDefaultData = async () => {
    triggerConfirm(
      "Sinkronkan Proyek Asli dari Web",
      "Tindakan ini akan menyinkronkan proyek unggulan dari portofolio web ('Kontrakan Pa Iman' & 'Voluntrip' menggunakan gambar lokal /projects/...) ke database Firestore. Lanjutkan?",
      async () => {
        setIsSeeding(true);
        try {
          const defaultSeedProjects = [
            {
              title: "Kontrakan Pa Iman",
              subtitle: "Sistem Manajemen Kost Digital Modern & Responsif",
              description: "Aplikasi web Full-Stack Digital Management yang dirancang khusus untuk pemilik kost dalam mengelola unit kamar, data penghuni (aktif & alumni), dan pencatatan riwayat pembayaran bulanan secara efisien, terstruktur, dan otomatis.",
              longDescription: "Kontrakan Pa Iman adalah aplikasi web Full-Stack Digital Management yang dirancang khusus untuk pemilik kost dalam mengelola unit kamar, data penghuni (aktif & alumni), dan pencatatan riwayat pembayaran bulanan secara efisien, terstruktur, dan otomatis. Dibangun dengan arsitektur modern Next.js 16, Express.js 5, Prisma ORM, dan PostgreSQL Supabase untuk menyederhanakan operasional bisnis sewa properti.",
              tags: ["Next.js 16", "TypeScript", "Tailwind CSS v4", "Express.js 5", "Prisma ORM", "PostgreSQL (Supabase)", "Shadcn UI", "JWT Auth", "PWA Ready"],
              category: "Web App",
              featured: true,
              image: "/projects/manajemen-kontrakan.png",
              link: "https://manajemen-kontrakan-iman.vercel.app/",
              demoUrl: "https://manajemen-kontrakan-iman.vercel.app/",
              githubUrl: "https://github.com/moch-firmansyahh/manajemen-kost-v2",
              metrics: "Full-Stack • Real-time Stats • PWA Ready",
              highlights: [
                "Dashboard Ringkasan Real-Time dengan 4 Stat Card interaktif, monitoring tagihan sewa pending, dan popover notifikasi",
                "Manajemen Unit Kamar: Filter & instant search nomor/tipe kamar, modal operasi CRUD, serta histori lengkap transaksi kamar",
                "Manajemen Penghuni: Pengelompokan tab Penghuni Aktif & Alumni, profil identitas lengkap, dan sistem checkout otomatis",
                "Manajemen Pembayaran & Struk: Pencatatan status tagihan sewa bulanan, filter periode transaksi, dan halaman cetak invoice",
                "Keunggulan UI/UX: Dual Theme (Dark/Light mode) mulus, animasi welcome screen & loader kustom, serta instalasi PWA standalone"
              ],
              year: "2026",
            },
            {
              title: "Voluntrip",
              subtitle: "Aplikasi Perencana Trip, Rundown Perjalanan Interaktif & Manajemen Budget Kelompok",
              description: "Platform perencana perjalanan modern yang dirancang untuk mempermudah traveler dan kelompok perjalanan dalam menyusun jadwal kegiatan (rundown), mengelola anggaran (budgeting), dan melacak pengeluaran secara real-time.",
              longDescription: "Voluntrip adalah platform perencana perjalanan modern yang dirancang untuk mempermudah traveler dan kelompok perjalanan dalam menyusun jadwal kegiatan (rundown), mengelola anggaran (budgeting), dan melacak pengeluaran secara real-time. Dengan antarmuka interaktif yang intuitif, Voluntrip memastikan itinerary bebas bentrok jam, fleksibel untuk diubah lewat fitur drag & drop, serta mudah dibagikan ke anggota trip lainnya.",
              tags: ["Next.js 16 (App Router)", "TypeScript", "Tailwind CSS", "Supabase PostgreSQL", "Dnd Kit", "PWA Ready", "JWT Auth", "Leaflet"],
              category: "Web App",
              featured: true,
              image: "/projects/voluntrip.png",
              link: "https://voluntrip-five.vercel.app/",
              demoUrl: "https://voluntrip-five.vercel.app/",
              githubUrl: "https://github.com/moch-firmansyahh/voluntrip",
              metrics: "Drag & Drop • Real-time Budgeting • PWA Ready",
              highlights: [
                "Interactive Itinerary & Rundown Builder dengan Drag & Drop (Dnd-Kit) dan Auto-Reschedule sekuensial bebas tabrakan jam",
                "Autocomplete lokasi destinasi terintegrasi Photon OpenStreetMap API (Komoot) dan visualisasi titik peta Leaflet",
                "Expense Tracker, Budgeting & Split Bill kalkulator otomatis untuk pembagian tagihan rata (equal share) antar anggota trip",
                "Sistem Autentikasi JWT terenkripsi dengan HTTP-only cookie, opsi Ingat Saya 30 hari, dan instant logout",
                "Dukungan Progressive Web App (PWA Standalone), Traveloka-Style Splash Screen, serta Public Share Link dengan token unik"
              ],
              year: "2026",
            }
          ];

          const existingTitles = new Set(projects.map(p => p.title.toLowerCase()));
          const newItemsToInsert = defaultSeedProjects.filter(p => !existingTitles.has(p.title.toLowerCase()));

          if (newItemsToInsert.length === 0) {
            showToast("Semua data proyek bawaan web sudah ada di database!", "info");
            setIsSeeding(false);
            return;
          }

          const batch = writeBatch(db);
          for (const item of newItemsToInsert) {
            const newDocRef = doc(collection(db, "projects"));
            batch.set(newDocRef, {
              ...item,
              createdAt: serverTimestamp()
            });
          }
          await batch.commit();
          showToast(`Berhasil menambahkan ${newItemsToInsert.length} proyek bawaan dari portofolio web!`, "success");
          fetchData();
        } catch (err) {
          showToast("Gagal impor data: " + (err as Error).message, "error");
        } finally {
          setIsSeeding(false);
        }
      },
      false,
      "Sinkronkan"
    );
  };

  const handleSyncGitHub = async () => {
    setSyncingGit(true);
    try {
      const existingProjectLinks = new Set(
        projects.map(p => (p.githubUrl || p.link || "").toLowerCase())
      );
      const newRepos = gitRepos.filter(
        repo => !existingProjectLinks.has(repo.html_url.toLowerCase())
      );

      if (newRepos.length === 0) {
        showToast("Semua repositori GitHub sudah tersinkronisasi!", "info");
        setSyncingGit(false);
        return;
      }

      triggerConfirm(
        "Sinkronkan Repositori GitHub",
        `Ditemukan ${newRepos.length} repositori baru yang belum ada di database. Impor sekarang?`,
        async () => {
          try {
            const batch = writeBatch(db);
            newRepos.forEach(repo => {
              const docRef = doc(collection(db, "projects"));
              batch.set(docRef, {
                title: repo.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
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
                createdAt: serverTimestamp()
              });
            });
            await batch.commit();

            showToast(`Berhasil mengimpor ${newRepos.length} proyek dari GitHub!`, "success");
            fetchData();
          } catch (err) {
            showToast("Gagal mengimpor: " + (err as Error).message, "error");
          } finally {
            setSyncingGit(false);
          }
        },
        false,
        "Impor Repositori"
      );
    } catch (err) {
      showToast("Gagal sinkronisasi: " + (err as Error).message, "error");
      setSyncingGit(false);
    }
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/projects/manajemen-kontrakan.png";
  };

  const unreadMessagesCount = messages.filter(m => !m.read).length;

  // --- LOGIN VIEW ---
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
              Masukkan password pengelola untuk mengakses CMS &amp; database Firestore.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                Password Administrator
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Masukkan kata sandi..."
                autoFocus
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono"
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
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 text-xs font-medium shadow-2xs transition-all cursor-pointer"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFC] flex font-sans antialiased text-zinc-900">
      {/* Dynamic Sidebar */}
      <Sidebar 
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        skillsCount={skills.length}
        projectsCount={projects.length}
        experienceCount={experiences.length}
        unreadMessagesCount={unreadMessagesCount}
        gitProfile={gitProfile}
        handleImgError={handleImgError}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-200/80 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4 flex-1 max-w-md">
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
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-zinc-400 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
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
                  <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-zinc-700">
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
              onClick={fetchData} 
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-white border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all shadow-2xs cursor-pointer"
              title="Segarkan Data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-zinc-900" : ""}`} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 space-y-6 flex-1">
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
              {activeMenu === "about" && "Atur identitas, bio deskriptif, tagline, kontak, dan 4 kartu metrik beranda web."}
              {activeMenu === "skills" && "Kelola daftar keahlian, teknologi pemrograman, dan persentase penguasaan."}
              {activeMenu === "projects" && "Kelola katalog portofolio proyek lengkap dengan foto lokal, tags, dan link live."}
              {activeMenu === "experience" && "Kelola riwayat studi, organisasi, dan karir yang tampil pada garis waktu website."}
              {activeMenu === "messages" && "Daftar pertanyaan dan penawaran proyek yang dikirimkan pengunjung dari halaman website."}
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
          </div>

          {/* TAB 1: Dashboard */}
          {activeMenu === "dashboard" && (
            <DashboardTab 
              gitProfile={gitProfile}
              gitRepos={gitRepos}
              skills={skills}
              projects={projects}
              handleImgError={handleImgError}
              showToast={showToast}
            />
          )}

          {/* TAB 2: About / Profile */}
          {activeMenu === "about" && (
            <AboutTab 
              profile={profile}
              setProfile={setProfile}
              onSaveProfile={handleSaveProfile}
              savingProfile={savingProfile}
              onResetDefault={handleResetDefaultProfile}
            />
          )}

          {/* TAB 3: Skills */}
          {activeMenu === "skills" && (
            <SkillsTab 
              skills={skills}
              searchQuery={searchQuery}
              syncingSkills={syncingSkills}
              handleSyncSkillsGitHub={handleSyncSkillsGitHub}
              openAddSkill={openAddSkill}
              openEditSkill={openEditSkill}
              handleDeleteSkill={handleDeleteSkill}
              handleSeedDefaultSkills={handleSeedDefaultSkills}
              isSeedingSkills={isSeedingSkills}
            />
          )}

          {/* TAB 4: Projects */}
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
              handleSeedDefaultData={handleSeedDefaultData}
              isSeeding={isSeeding}
            />
          )}

          {/* TAB 5: Experience */}
          {activeMenu === "experience" && (
            <ExperienceTab 
              experiences={experiences}
              searchQuery={searchQuery}
              isSeeding={isSeedingExperience}
              handleSeedDefaultExperience={handleSeedDefaultExperience}
              openAddExperience={openAddExperience}
              openEditExperience={openEditExperience}
              handleDeleteExperience={handleDeleteExperience}
            />
          )}

          {/* TAB 6: Messages (Inbox) */}
          {activeMenu === "messages" && (
            <MessagesTab 
              messages={messages}
              searchQuery={searchQuery}
              onOpenMessage={handleOpenMessage}
              onToggleRead={(id, status) => handleToggleReadMessage(id, status, true)}
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

      {/* Experience Form Modal */}
      <ExperienceModal 
        isOpen={experienceModal.isOpen}
        isEdit={experienceModal.isEdit}
        data={experienceModal.data}
        setData={(action) => {
          if (typeof action === "function") {
            setExperienceModal(prev => ({ ...prev, data: action(prev.data) }));
          } else {
            setExperienceModal(prev => ({ ...prev, data: action }));
          }
        }}
        onSubmit={saveExperienceModal}
        onClose={() => setExperienceModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Message Reader Modal */}
      <MessageModal 
        isOpen={isMessageModalOpen}
        message={selectedMessage}
        onClose={() => setIsMessageModalOpen(false)}
        onToggleRead={(id, status) => handleToggleReadMessage(id, status, true)}
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
