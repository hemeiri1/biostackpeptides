"use client";

import { useState, useEffect } from "react";
import { Lock, LogOut, Brain } from "lucide-react";

const ADMIN_PASSWORD = "BioStack2026!";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem("biostack_admin");
    if (saved === "authenticated") {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("biostack_admin", "authenticated");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("biostack_admin");
    setAuthenticated(false);
  }

  if (checking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-brand-cyan" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-brand-muted text-sm mt-2">BioStack Command Center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter admin password"
                className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-brand-muted text-sm focus:outline-none transition-colors ${
                  error ? "border-red-400 focus:border-red-400" : "border-brand-border focus:border-brand-cyan/50"
                }`}
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-xs mt-2">Wrong password. Try again.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-cyan text-white font-semibold hover:bg-brand-cyan/90 transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Admin top bar */}
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-brand-cyan" />
          <span className="font-medium">BioStack Command Center</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-3 h-3" />
          Logout
        </button>
      </div>
      {children}
    </div>
  );
}
