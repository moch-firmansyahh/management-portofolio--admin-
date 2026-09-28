export interface ProfileSocialLinks {
  github?: string;
  linkedin?: string;
  instagram?: string;
  tiktok?: string;
  [key: string]: string | undefined;
}

export interface ProfileStat {
  label: string;
  value: string;
}

export interface ProfileData {
  id?: string;
  name: string;
  shortName?: string;
  title?: string;
  role: string;
  tagline: string;
  about?: string;
  bio: string;
  status: string;
  location?: string;
  email: string;
  phone?: string;
  resumeUrl: string;
  socialLinks: ProfileSocialLinks;
  stats: ProfileStat[];
  updatedAt?: string;
}

export interface Project {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  tags: string[];
  category: string;
  featured?: boolean;
  image?: string;
  link?: string;
  demoUrl?: string;
  githubUrl?: string;
  metrics?: string;
  highlights?: string[];
  year?: string;
}

export interface Skill {
  id?: string;
  name: string;
  logo: string;
  percent: number;
  category: string;
}

export interface Experience {
  id?: string;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  technologies: string[];
  type?: "Work" | "Education";
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  created_at: string;
}
