export interface Skill {
  id?: string;
  name: string;
  logo: string;
  percent: number | string;
  category?: string;
  createdAt?: string;
}

export interface PopularSkill {
  name: string;
  logo: string;
  category?: string;
}

export interface Project {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  tags: string[];
  category: string;
  featured: boolean;
  image: string;
  link: string;
  demoUrl: string;
  githubUrl: string;
  metrics: string;
  highlights: string[];
  year: string;
  createdAt?: string;
}

export interface Experience {
  id?: string;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  technologies: string[];
  type: "Work" | "Education" | "Freelance";
  createdAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt?: string;
}

export interface ProfileStat {
  label: string;
  value: string;
}

export interface ProfileSocialLinks {
  github: string;
  linkedin: string;
  instagram: string;
  tiktok: string;
  telegram?: string;
  email?: string;
  phone?: string;
  cvUrl?: string;
  [key: string]: string | undefined;
}

export interface ProfileData {
  id?: string;
  name: string;
  shortName?: string;
  role: string;
  tagline: string;
  about?: string;
  bio: string;
  status: string;
  location: string;
  email: string;
  phone?: string;
  resumeUrl: string;
  avatarUrl?: string;
  socialLinks: ProfileSocialLinks;
  stats: ProfileStat[];
  updatedAt?: string;
}

export interface GitHubProfile {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  html_url: string;
}

export interface GitHubRepo {
  id?: number;
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  private?: boolean;
  fork?: boolean;
}

export type AdminTab = "dashboard" | "about" | "skills" | "projects" | "experience" | "messages";

export interface ToastState {
  isOpen: boolean;
  message: string;
  type: "success" | "error" | "info";
}

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}
