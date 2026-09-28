import React from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Github, ExternalLink, GitBranch, ShieldCheck } from "lucide-react";
import { Skill, Project, Experience, ContactMessage, GitHubProfile, GitHubRepo } from "../../types";
import { getAvatarUrl } from "../../lib/utils";
import { GITHUB_USERNAME } from "../../lib/constants";

interface DashboardTabProps {
  gitProfile: GitHubProfile | null;
  gitRepos: GitHubRepo[];
  skills: Skill[];
  projects: Project[];
  experiences?: Experience[];
  messages?: ContactMessage[];
  handleImgError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export default function DashboardTab({
  gitProfile,
  gitRepos,
  skills,
  projects,
  experiences = [],
  messages = [],
  handleImgError,
  showToast,
}: DashboardTabProps) {

  const username = gitProfile?.login || GITHUB_USERNAME;

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
            <span>@{username}</span>
          </span>
        </div>
        
        <div className="flex justify-center py-2 overflow-x-auto w-full">
          <GitHubCalendar 
            username={username}
            theme={{
              light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
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
              href={gitProfile?.html_url || `https://github.com/${username}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:underline cursor-pointer"
            >
              <span>Buka GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={getAvatarUrl(gitProfile)} 
                alt="git avatar" 
                className="h-12 w-12 rounded-full border border-zinc-200 object-cover shadow-2xs"
                onError={handleImgError}
              />
              <div>
                <h4 className="font-semibold text-sm text-zinc-900">{gitProfile?.name || "Moch Firmansyah"}</h4>
                <p className="text-xs text-zinc-500 font-mono">@{username}</p>
              </div>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-lg text-xs text-zinc-600 leading-relaxed italic">
              &ldquo;{gitProfile?.bio || "Front-End Developer Enthusiast."}&rdquo;
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
            {gitRepos.slice(0, 4).map((r) => (
              <div key={r.id || r.name} className="flex justify-between items-center text-xs p-1.5 rounded-md hover:bg-zinc-50 transition">
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-800 hover:text-zinc-900 truncate max-w-[170px] cursor-pointer"
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
    </div>
  );
}
