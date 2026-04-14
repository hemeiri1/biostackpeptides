"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const [step, setStep] = useState<"signup" | "verify" | "done">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", name, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("verify");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", email, code: inputCode }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("done");
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
        {step === "signup" && (
          <>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-7 h-7 text-brand-cyan" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
              <p className="text-brand-muted text-sm mt-2">Join BioStack Peptides and earn loyalty rewards</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-brand-border rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-cyan/50"
                    placeholder="Your name"
                  />
                </div>
              </div>
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
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-brand-border rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-cyan/50"
                    placeholder="Min. 6 characters"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-cyan text-white font-semibold hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-brand-muted text-sm mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-cyan hover:underline">Log in</Link>
            </p>
          </>
        )}

        {step === "verify" && (
          <>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-brand-cyan" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
              <p className="text-brand-muted text-sm mt-2">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="text"
                required
                maxLength={6}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-gray-900 text-sm text-center tracking-widest text-lg font-bold focus:outline-none focus:border-brand-cyan/50"
                placeholder="000000"
              />
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-cyan text-white font-semibold hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Verified!</h1>
            <p className="text-brand-muted text-sm mb-6">
              Welcome to BioStack Peptides. You&apos;re now part of our loyalty program.
            </p>
            <div className="p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20 mb-6">
              <p className="text-brand-cyan text-sm font-medium">Loyalty Rewards</p>
              <p className="text-brand-muted text-xs mt-1">Earn 10 points per order. Every 5 orders = AED 50 bonus credit!</p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-cyan text-white font-semibold hover:bg-brand-cyan/90 transition-colors"
            >
              Log In Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
