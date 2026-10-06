import { supabaseServer as supabase } from "../supabaseServer";
import { ProfileData } from "../../types";
import { BACKEND_API } from "../constants";

export async function getProfile(): Promise<ProfileData | null> {
  try {
    const res = await fetch(`${BACKEND_API}/profile`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data as ProfileData | null;
    }
  } catch {
    // Fallback direct to Supabase
  }

  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return data as ProfileData;
}

// Kolom yang ada di tabel 'profile' database Supabase
const VALID_DB_PROFILE_COLUMNS = [
  "id",
  "name",
  "title",
  "role",
  "shortName",
  "tagline",
  "about",
  "bio",
  "status",
  "email",
  "phone",
  "github",
  "linkedin",
  "instagram",
  "resumeUrl",
  "socialLinks",
  "stats",
  "updatedAt",
];

export async function saveProfile(profile: ProfileData): Promise<{ missingColumns?: string[] }> {
  try {
    const res = await fetch(`${BACKEND_API}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return {};
    }
  } catch {
    // Fallback direct to Supabase
  }

  const rawPayload: Record<string, any> = {
    id: "main",
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  // Hanya kirim kolom yang valid di database agar tidak memicu error 400 Bad Request
  const payload: Record<string, any> = {};
  for (const col of VALID_DB_PROFILE_COLUMNS) {
    if (col in rawPayload && rawPayload[col] !== undefined) {
      payload[col] = rawPayload[col];
    }
  }

  let result = await supabase.from("profile").upsert(payload);

  if (result.error && result.error.message && result.error.message.includes("Could not find the '")) {
    const missingCols: string[] = [];
    let currentError: any = result.error;
    while (currentError && currentError.message && currentError.message.includes("Could not find the '")) {
      const match = currentError.message.match(/Could not find the '([^']+)' column/i);
      if (match && match[1]) {
        const col = match[1];
        missingCols.push(col);
        delete payload[col];
        const retry: any = await supabase.from("profile").upsert(payload);
        currentError = retry.error;
      } else {
        break;
      }
    }
    if (currentError) throw currentError;
    return { missingColumns: missingCols };
  }

  if (result.error) throw result.error;
  return {};
}
