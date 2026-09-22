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
        const localAuth = localStorage.getItem("portfolio_admin_auth");
        if (localAuth === "true") {
          setIsAuthenticated(true);
        }

        const res = await fetch("/api/auth/session");
        if (res.ok) {
          setIsAuthenticated(true);
          localStorage.setItem("portfolio_admin_auth", "true");
        } else if (!localAuth) {
          setIsAuthenticated(false);
        }
      } catch {
        // Fallback to local flag if offline
        const localAuth = localStorage.getItem("portfolio_admin_auth");
        if (localAuth === "true") {
          setIsAuthenticated(true);
        }
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
        localStorage.setItem("portfolio_admin_auth", "true");
        return true;
      } else {
        setLoginError(data.message || "Kredensial tidak valid. Silakan periksa kembali.");
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
