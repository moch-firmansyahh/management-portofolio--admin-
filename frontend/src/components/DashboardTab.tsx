import React, { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Github, ExternalLink, GitBranch, ShieldCheck, Download, Server, HardDrive, Database, CheckCircle2, AlertTriangle } from "lucide-react";
import { Skill } from "./SkillsTab";
import { Project } from "./ProjectsTab";

export interface GitHubProfile {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  html_url: string;
}

interface DashboardTabProps {
  gitProfile: GitHubProfile | null;
  gitRepos: any[];
  skills: Skill[];
  projects: Project[];
  handleImgError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export default function DashboardTab({
  gitProfile,
  gitRepos,
  skills,
  projects,
  handleImgError,
  showToast,
}: DashboardTabProps) {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [backendLatency, setBackendLatency] = useState<number | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3002";
      const start = performance.now();
      try {
        const res = await fetch(`${backendUrl}/api/health`, { method: "GET", cache: "no-store" });
        const latency = Math.round(performance.now() - start);
        if (res.ok) {
          setBackendStatus("online");
          setBackendLatency(latency);
        } else {
          setBackendStatus("offline");
        }
      } catch (_) {
        setBackendStatus("offline");
      }
    };

    checkBackend();
  }, []);

  const handleExportBackup = () => {
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        version: "2.0.0",
        stats: {
          skillsCount: skills.length,
          projectsCount: projects.length,
        },
        skills,
        projects,
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast("Berhasil mengekspor data backup JSON!", "success");
    } catch (err: any) {
      showToast("Gagal mengekspor data: " + err.message, "error");
    }
  };

  const getAvatarUrl = () => {
    return gitProfile?.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg?seed=Firmansyah";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* GitHub Contribution Calendar */}
      <div className="lg:col-span-2 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 flex items-center gap-2">
              <Github className="h-4 w-4 text-zinc-900" />
              <span>Aktivitas Kontribusi GitHub</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Grafik kontribusi komit repositori publik tahunan.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-mono border border-zinc-200">
            <GitBranch className="h-3 w-3 text-zinc-500" />
            <span>@{gitProfile?.login || "moch-firmansyahh"}</span>
          </span>
        </div>
        
        <div className="flex justify-center py-2 overflow-x-auto w-full">
          <GitHubCalendar 
            username="moch-firmansyahh" 
            theme={{
              light: ["#f4f4f5", "#e4e4e7", "#a1a1aa", "#52525b", "#18181b"],
              dark: ["#18181b", "#27272a", "#52525b", "#a1a1aa", "#f4f4f5"]
            }}
            colorScheme="light"
          />
        </div>
      </div>

      {/* GitHub Profile Details */}
      <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
            <h3 className="font-semibold text-sm text-zinc-900">Profil GitHub</h3>
            <a 
              href={gitProfile?.html_url || "https://github.com/moch-firmansyahh"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:underline"
            >
              <span>Buka GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={getAvatarUrl()} 
                alt="git avatar" 
                className="h-12 w-12 rounded-full border border-zinc-200 object-cover shadow-2xs"
                onError={handleImgError}
              />
              <div>
                <h4 className="font-semibold text-sm text-zinc-900">{gitProfile?.name || "Moch Firmansyah"}</h4>
                <p className="text-xs text-zinc-500 font-mono">@{gitProfile?.login || "moch-firmansyahh"}</p>
              </div>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-lg text-xs text-zinc-600 leading-relaxed italic">
              "{gitProfile?.bio || "Front-End Developer Enthusiast."}"
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-100 pt-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Repositori Terkini</span>
            <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" /> Live API
            </span>
          </div>
          <div className="space-y-2">
            {gitRepos.slice(0, 4).map((r: any) => (
              <div key={r.id} className="flex justify-between items-center text-xs p-1.5 rounded-md hover:bg-zinc-50 transition">
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-800 hover:text-zinc-900 truncate max-w-[170px]"
                >
                  {r.name}
                </a>
                <span className="text-[10px] bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono font-medium px-2 py-0.5 rounded-md uppercase shrink-0">
                  {r.language || "JS"}
                </span>
              </div>
            ))}
            {gitRepos.length === 0 && (
              <p className="text-xs text-zinc-400 italic">Tidak ada data repositori.</p>
            )}
          </div>
        </div>
      </div>

      {/* System Status & Quick Tools */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backend & Cloud Database Status */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
              backendStatus === "online" 
                ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                : backendStatus === "offline"
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-zinc-100 text-zinc-600 border-zinc-200"
            }`}>
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-xs text-zinc-900">Status Backend API</h4>
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  backendStatus === "online"
                    ? "bg-emerald-100/70 text-emerald-700"
                    : backendStatus === "offline"
                    ? "bg-red-100/70 text-red-700"
                    : "bg-zinc-100 text-zinc-600"
                }`}>
                  {backendStatus === "online" && <CheckCircle2 className="h-2.5 w-2.5" />}
                  {backendStatus === "offline" && <AlertTriangle className="h-2.5 w-2.5" />}
                  {backendStatus === "online" ? `Online (${backendLatency}ms)` : backendStatus === "offline" ? "Offline" : "Memeriksa..."}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Express Multer Server di port 3002 & Firebase Firestore Cloud DB.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200/70">
            <Database className="h-3.5 w-3.5 text-zinc-500" />
            <span>Firestore Live</span>
          </div>
        </div>

        {/* Data Backup & Export Tool */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-zinc-900 text-white border border-zinc-900 shadow-2xs">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-zinc-900">Cadangan Data Portofolio</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Ekspor seluruh data ({skills.length} skills & {projects.length} proyek) ke format JSON.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportBackup}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium border border-zinc-200 transition active:scale-98 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Ekspor JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
}
