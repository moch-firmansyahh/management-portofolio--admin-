import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://cgnerlwoezzjqaqofzuy.supabase.co";

// Gunakan SUPABASE_SERVICE_ROLE_KEY jika tersedia di environment server untuk bypass RLS.
// Jika belum diset, fallback ke anon key / publishable key.
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_8B0fFkdbM16eYuHmBz5FPQ_LGvHKBha";

export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
