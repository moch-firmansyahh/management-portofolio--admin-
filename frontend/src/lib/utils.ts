import { GitHubProfile } from "../types";

/**
 * Returns avatar URL from GitHub profile or fallback adventurer SVG
 */
export function getAvatarUrl(gitProfile?: GitHubProfile | null): string {
  return gitProfile?.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg?seed=Firmansyah";
}

/**
 * Formats ISO date or timestamp into Indonesian locale date (e.g. "12 Mar 2026")
 */
export function formatDate(timestamp?: string | number | null): string {
  if (!timestamp) return "Baru saja";
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return "Baru saja";
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Baru saja";
  }
}

/**
 * Formats ISO date or timestamp into full Indonesian date & time
 */
export function formatDateTime(timestamp?: string | number | null): string {
  if (!timestamp) return "Baru saja";
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return "Baru saja";
    return d.toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    });
  } catch {
    return "Baru saja";
  }
}

/**
 * Sanitizes payload object before sending to Supabase to prevent unexpected columns
 */
export function sanitizePayload<T extends Record<string, any>>(obj: T, allowedKeys?: (keyof T)[]): Partial<T> {
  if (!allowedKeys) return { ...obj };
  const sanitized: Partial<T> = {};
  for (const key of allowedKeys) {
    if (obj[key] !== undefined) {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
}

/**
 * Returns project image preview or OpenGraph GitHub preview
 */
export function getProjectPreview(image: string, link: string): string {
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
}
