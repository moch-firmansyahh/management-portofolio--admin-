import { NextRequest, NextResponse } from "next/server";

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
    const { password } = body;
    const validPassword = process.env.ADMIN_PASSWORD || "firman2026";

    // 3. Verifikasi password
    if (!password || password !== validPassword) {
      recordFailedAttempt(ip);
      const remaining = remainingAttempts - 1;
      return NextResponse.json(
        {
          success: false,
          message:
            remaining > 0
              ? `Password salah. Sisa kesempatan: ${remaining} kali.`
              : "Terlalu banyak percobaan gagal. Akun dikunci sementara selama 15 menit.",
        },
        { status: 401 }
      );
    }

    // 4. Login berhasil: reset counter percobaan
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
      maxAge: 60 * 60 * 24 * 7, // 7 hari
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
