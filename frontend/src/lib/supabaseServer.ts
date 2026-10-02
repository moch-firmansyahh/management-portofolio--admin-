import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://cgnerlwoezzjqaqofzuy.supabase.co";

// Gunakan SUPABASE_SERVICE_ROLE_KEY jika tersedia di environment server untuk bypass RLS.
// Jika belum diset, fallback ke service role key default atau anon key.
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbmVybHdvZXp6anFhcW9menV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDA0OTQ4MSwiZXhwIjoyMTA1NjI1NDgxfQ.AKVgl8bCJu_kFhEEFW7k2lx4SON21b1yM7nISFoKG2s";

export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
