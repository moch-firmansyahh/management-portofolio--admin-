"use client";

import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
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
          // Jika sesi baru dibuka, WAJIB login terlebih dahulu
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
        setIsAuthenticated(true);
        sessionStorage.setItem("portfolio_admin_session", "true");
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
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    } finally {
      sessionStorage.removeItem("portfolio_admin_session");
      localStorage.removeItem("portfolio_admin_auth");
      setIsAuthenticated(false);
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
