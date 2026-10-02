import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "../../../../lib/supabaseServer";

// In-memory rate limiter untuk proteksi brute force login
interface LoginAttempt {
  count: number;
  resetTime: number;
}

const loginAttempts = new Map<string, LoginAttempt>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_PERIOD_MS = 15 * 60 * 1000; // 15 menit

function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(ip, { count: 0, resetTime: now + LOCKOUT_PERIOD_MS });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    return { allowed: false, remainingAttempts: 0 };
  }

  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - attempt.count };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + LOCKOUT_PERIOD_MS });
  } else {
    attempt.count += 1;
  }
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  try {
    // 1. Dapatkan IP klien
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown-ip";

    // 2. Periksa limit percobaan login (brute force protection)
    const { allowed, remainingAttempts } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Terlalu banyak percobaan login yang gagal. Akun dikunci sementara. Silakan coba lagi setelah 15 menit.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password } = body;
    const cleanUsername = (username || "").trim().toLowerCase();

    if (!cleanUsername || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    let isAuthenticated = false;

    // 3. Verifikasi kredensial langsung terhadap Database Supabase (auth.users)
    try {
      const { data: usersData, error: listError } = await supabaseServer.auth.admin.listUsers();
      if (!listError && usersData?.users && usersData.users.length > 0) {
        // Cari user yang sesuai username/alias/email di database
        const dbUser = usersData.users.find((u: any) => {
          const metaUsername = (u.user_metadata?.username || "").toLowerCase();
          const aliases: string[] = (u.user_metadata?.aliases || []).map((a: string) =>
            a.toLowerCase()
          );
          const email = (u.email || "").toLowerCase();
          return (
            metaUsername === cleanUsername ||
            aliases.includes(cleanUsername) ||
            email === cleanUsername ||
            email.startsWith(`${cleanUsername}@`)
          );
        });

        if (dbUser && dbUser.email) {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
          const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
          const authClient = createClient(supabaseUrl, supabaseAnonKey);

          const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
            email: dbUser.email,
            password: password,
          });

          if (!authError && authData.session) {
            isAuthenticated = true;
          }
        }
      }
    } catch (dbErr) {
      console.warn("Supabase database auth check error:", dbErr);
    }

    // 4. Fallback ke Environment Variable server jika Supabase Auth belum terhubung
    if (!isAuthenticated) {
      const validPassword = process.env.ADMIN_PASSWORD;
      const envUsername = (process.env.ADMIN_USERNAME || "admin").toLowerCase().trim();
      const allowedUsernames = new Set([envUsername, "admin", "firman", "moch-firmansyahh"]);
      if (validPassword && password === validPassword && allowedUsernames.has(cleanUsername)) {
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated) {
      recordFailedAttempt(ip);
      const remaining = remainingAttempts - 1;
      return NextResponse.json(
        {
          success: false,
          message:
            remaining > 0
              ? `Username atau password salah. Sisa kesempatan: ${remaining} kali.`
              : "Terlalu banyak percobaan gagal. Akun dikunci sementara selama 15 menit.",
        },
        { status: 401 }
      );
    }

    // 5. Login berhasil: reset counter percobaan
    clearAttempts(ip);

    const response = NextResponse.json({
      success: true,
      message: "Autentikasi berhasil.",
    });

    // 5. Set HttpOnly Cookie yang aman
    response.cookies.set("portfolio_admin_token", "authenticated_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi gangguan internal saat memproses autentikasi." },
      { status: 500 }
    );
  }
}
