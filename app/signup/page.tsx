"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, ArrowRight, CheckCircle, Calendar, Users, Phone } from "lucide-react";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="animate-spin w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full" /></div>}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const [step, setStep] = useState<"signup" | "verify" | "done">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState("");
  const [referralMsg, setReferralMsg] = useState("");

  // Auto-fill referral code from URL (?ref=BSP-XXXX)
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCode(ref.toUpperCase());
      checkReferral(ref.toUpperCase());
    }
  }, [searchParams]);
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");
  const [bonusMsg, setBonusMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  async function checkReferral(code: string) {
    if (code.length < 6) { setReferralMsg(""); return; }
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check-referral", code }),
      });
      const data = await res.json();
      setReferralMsg(data.success ? data.message : "");
    } catch { setReferralMsg(""); }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "signup",
          name,
          email: email || undefined,
          phone,
          password,
          birthday,
          referralCode: referralCode || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBonusMsg(data.bonusApplied || "");
        setStep(data.needsVerification ? "verify" : "done");
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
        body: JSON.stringify({ action: "verify", email: email || undefined, phone: phone || undefined, code: inputCode }),
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
              <p className="text-brand-muted text-sm mt-2">Join BioStack Peptides and start earning rewards</p>
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
                <label className="text-sm font-medium text-gray-900 mb-1 block">Email <span className="text-red-500">*</span></label>
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
                <label className="text-sm font-medium text-gray-900 mb-1 block">Phone Number <span className="text-red-500">*</span></label>
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
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1 block">Birthday <span className="text-brand-muted font-normal">(optional — earn a reward!)</span></label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-brand-border rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-cyan/50"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1 block">Referral Code <span className="text-brand-muted font-normal">(optional)</span></label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => { setReferralCode(e.target.value.toUpperCase()); checkReferral(e.target.value.toUpperCase()); }}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-brand-border rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-cyan/50"
                    placeholder="e.g. BSP-JOHN4X2K"
                  />
                </div>
                {referralMsg && <p className="text-green-600 text-xs mt-1">{referralMsg}</p>}
              </div>
              {/* Age confirmation */}
              <label className="flex items-start gap-3 p-3 rounded-xl border border-brand-border bg-gray-50 cursor-pointer hover:border-brand-cyan/50 transition-colors">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-cyan focus:ring-brand-cyan"
                />
                <span className="text-xs text-brand-muted">I confirm that I am <strong className="text-gray-900">18 years of age or older</strong>.</span>
              </label>

              {/* Terms */}
              <label className="flex items-start gap-3 p-3 rounded-xl border border-brand-border bg-gray-50 cursor-pointer hover:border-brand-cyan/50 transition-colors">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-cyan focus:ring-brand-cyan"
                />
                <span className="text-xs text-brand-muted">
                  I agree to the <a href="/terms" className="text-brand-cyan hover:underline">Terms of Service</a> and understand all products are for <strong className="text-gray-900">in-vitro research and laboratory use only</strong>, not for human consumption.
                </span>
              </label>

              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading || !ageConfirmed || !termsAccepted}
                className="w-full py-3 rounded-xl bg-brand-cyan text-white font-semibold hover:bg-brand-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                We sent a 6-digit code to <strong>{email || phone}</strong>
              </p>
              {bonusMsg && (
                <p className="text-green-600 text-sm mt-2 font-medium">{bonusMsg}</p>
              )}
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

            {/* Tier System */}
            <div className="p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20 mb-4">
              <p className="text-brand-cyan text-sm font-medium mb-2">Loyalty Tiers</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="font-bold text-amber-700">Bronze</p>
                  <p className="text-amber-600">1x points</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-100 border border-gray-300">
                  <p className="font-bold text-gray-600">Silver</p>
                  <p className="text-gray-500">1.5x points</p>
                </div>
                <div className="p-2 rounded-lg bg-yellow-50 border border-yellow-300">
                  <p className="font-bold text-yellow-700">Gold</p>
                  <p className="text-yellow-600">2x points</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20 mb-6">
              <p className="text-brand-cyan text-sm font-medium">Earn Points</p>
              <p className="text-brand-muted text-xs mt-1">1 point per AED 10 spent. Stack bonus, review rewards, referral credits & more!</p>
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
