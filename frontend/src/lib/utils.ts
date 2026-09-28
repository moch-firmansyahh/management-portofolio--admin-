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

const MONTH_NAMES_MAP: Record<string, number> = {
  jan: 1, januari: 1, january: 1,
  feb: 2, februari: 2, february: 2,
  mar: 3, maret: 3, march: 3,
  apr: 4, april: 4,
  mei: 5, may: 5,
  jun: 6, juni: 6, june: 6,
  jul: 7, juli: 7, july: 7,
  agu: 8, ags: 8, agust: 8, agustus: 8, aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  okt: 10, oct: 10, oktober: 10, october: 10,
  nov: 11, nop: 11, november: 11,
  des: 12, dec: 12, desember: 12, december: 12,
};

function parseSingleDateScore(str?: string, isEnd = false): number {
  if (!str) return 0;
  const s = str.trim().toLowerCase();
  if (["present", "sekarang", "current", "saat ini", "now", "skrg"].some((k) => s.includes(k))) {
    return 999999;
  }
  const yearMatch = s.match(/\b(19\d\d|20\d\d)\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 0;
  if (!year) return 0;

  let month = isEnd ? 12 : 1;
  for (const [mName, mNum] of Object.entries(MONTH_NAMES_MAP)) {
    const regex = new RegExp(`\\b${mName}\\b`, "i");
    if (regex.test(s)) {
      month = mNum;
      break;
    }
  }
  return year * 100 + month;
}

/**
 * Sorts experiences descending (newest to oldest) based on period dates.
 * 'Present' / 'Sekarang' roles come first, followed by most recent end date, then start date.
 */
export function sortExperiences<T extends { period?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const periodA = a.period || "";
    const periodB = b.period || "";

    const partsA = periodA.split(/[-–—]/);
    const partsB = periodB.split(/[-–—]/);

    const endA = partsA.length >= 2 ? parseSingleDateScore(partsA[1], true) : parseSingleDateScore(partsA[0], false);
    const endB = partsB.length >= 2 ? parseSingleDateScore(partsB[1], true) : parseSingleDateScore(partsB[0], false);

    if (endA !== endB) {
      return endB - endA;
    }

    const startA = parseSingleDateScore(partsA[0], false);
    const startB = parseSingleDateScore(partsB[0], false);
    return startB - startA;
  });
}
