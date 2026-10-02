"use client";

import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // Inisialisasi status loading: jika tidak ada sesi di sessionStorage, langsung false (halaman login tampil instan)
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("portfolio_admin_session");
    }
    return true;
  });
  const [loginError, setLoginError] = useState<string>("");

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Hapus sisa-sisa localStorage lama yang membypass login
        localStorage.removeItem("portfolio_admin_auth");

        // Cek apakah di tab/sesi browser saat ini sudah login
        const hasSession = sessionStorage.getItem("portfolio_admin_session");
        if (!hasSession) {
          // Jika tidak ada sesi aktif, tetap di halaman login
          setIsAuthenticated(false);
          setIsLoadingAuth(false);
          return;
        }

        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            return;
          }
        }

        // Jika verifikasi cookie server gagal
        setIsAuthenticated(false);
        sessionStorage.removeItem("portfolio_admin_session");
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkSession();
  }, []);

  // Saat pengguna berada di halaman login (!isAuthenticated dan sudah selesai check loading),
  // pastikan sessionStorage bersih sehingga refresh di halaman login TIDAK PERNAH masuk dashboard.
  useEffect(() => {
    if (!isAuthenticated && !isLoadingAuth) {
      try {
        sessionStorage.removeItem("portfolio_admin_session");
        localStorage.removeItem("portfolio_admin_auth");
      } catch {}
    }
  }, [isAuthenticated, isLoadingAuth]);

  const login = useCallback(async (password: string): Promise<boolean> => {
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("portfolio_admin_session", "true");
        setIsAuthenticated(true);
        return true;
      } else {
        setLoginError(data.message || "Password salah. Silakan periksa kembali.");
        return false;
      }
    } catch {
      setLoginError("Gagal menghubungi server autentikasi.");
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    // 1. Bersihkan state dan storage client-side secara instan & sinkron
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem("portfolio_admin_session");
      localStorage.removeItem("portfolio_admin_auth");
    } catch {}

    // 2. Hapus cookie HttpOnly di server-side
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    }
  }, []);

  return {
    isAuthenticated,
    setIsAuthenticated,
    isLoadingAuth,
    loginError,
    setLoginError,
    login,
    logout,
  };
}
