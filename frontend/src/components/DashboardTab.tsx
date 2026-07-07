import React from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Github, ExternalLink } from "lucide-react";

interface GitHubProfile {
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
  handleImgError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export default function DashboardTab({
  gitProfile,
  gitRepos,
  handleImgError,
}: DashboardTabProps) {
  const getAvatarUrl = () => {
    return gitProfile?.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg?seed=Firmansyah";
  };

  return (
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
            {gitRepos.length === 0 && (
              <span className="text-xs text-gray-400 italic">Tidak ada data repositori.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
