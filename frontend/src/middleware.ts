import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Daftar endpoint API yang dikecualikan dari proteksi auth
const PUBLIC_API_PATHS = [
  "/api/auth/login",
  "/api/auth/session",
  "/api/auth/logout",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Proteksi seluruh API Route Admin (/api/*)
  if (pathname.startsWith("/api/")) {
    // Izinkan endpoint auth publik
    const isPublicAuth = PUBLIC_API_PATHS.some((path) => pathname.startsWith(path));
    if (isPublicAuth) {
      return NextResponse.next();
    }

    // Verifikasi cookie sesi admin
    const token = request.cookies.get("portfolio_admin_token")?.value;
    if (token !== "authenticated_session") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Akses ditolak. Sesi login admin diperlukan.",
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
