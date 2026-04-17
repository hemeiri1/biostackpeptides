"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AuthContextValue {
  loggedIn: boolean;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const refreshAuth = useCallback(() => {
    const token = localStorage.getItem("biostack_token");
    const saved = localStorage.getItem("biostack_user");
    if (token && saved) {
      setLoggedIn(true);
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    } else {
      setLoggedIn(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshAuth();

    // Listen for login/logout from other components
    window.addEventListener("biostack-auth-change", refreshAuth);
    // Also listen for storage changes (other tabs)
    window.addEventListener("storage", refreshAuth);

    return () => {
      window.removeEventListener("biostack-auth-change", refreshAuth);
      window.removeEventListener("storage", refreshAuth);
    };
  }, [refreshAuth]);

  const login = useCallback((token: string, userData: any) => {
    localStorage.setItem("biostack_token", token);
    localStorage.setItem("biostack_user", JSON.stringify(userData));
    setLoggedIn(true);
    setUser(userData);
    window.dispatchEvent(new Event("biostack-auth-change"));
  }, []);

  const logout = useCallback(() => {
    const token = localStorage.getItem("biostack_token");
    if (token) {
      fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout", token }),
      }).catch(() => {});
    }
    localStorage.removeItem("biostack_token");
    localStorage.removeItem("biostack_user");
    setLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event("biostack-auth-change"));
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
