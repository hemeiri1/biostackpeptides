"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Phone } from "lucide-react";

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: loginMethod === "email" ? email : undefined,
          phone: loginMethod === "phone" ? phone : undefined,
          password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("biostack_token", data.token);
        localStorage.setItem("biostack_user", JSON.stringify(data.user));
        if (data.birthdayReward) {
          localStorage.setItem("biostack_birthday_code", data.birthdayReward);
        }
        router.push("/account");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-7 h-7 text-brand-cyan" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-brand-muted text-sm mt-2">Log in to your BioStack account</p>
        </div>

        {/* Toggle: Email or Phone */}
        <div className="flex rounded-xl border border-brand-border overflow-hidden mb-6">
          <button
            type="button"
            onClick={() => { setLoginMethod("email"); setError(""); }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              loginMethod === "email"
                ? "bg-brand-cyan text-white"
                : "bg-white text-brand-muted hover:text-gray-900"
            }`}
          >
            <Mail className="w-4 h-4" /> Email
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod("phone"); setError(""); }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              loginMethod === "phone"
                ? "bg-brand-cyan text-white"
                : "bg-white text-brand-muted hover:text-gray-900"
            }`}
          >
            <Phone className="w-4 h-4" /> Phone
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {loginMethod === "email" ? (
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-brand-border rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-cyan/50"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-brand-border rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-cyan/50"
                  placeholder="+971 50 123 4567"
                />
              </div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-900 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-brand-border rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-cyan/50"
                placeholder="Your password"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-cyan text-white font-semibold hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-brand-muted text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-cyan hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
