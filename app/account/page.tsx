"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, Award, ShoppingBag, Star, Gift, LogOut, ArrowRight,
  Copy, Check, Crown, Zap, Calendar, MessageSquare, TrendingUp,
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name: string;
  loyaltyPoints: number;
  orderCount: number;
  bonusCredit: number;
  totalSpent: number;
  monthlySpent: number;
  tier: "Bronze" | "Silver" | "Gold";
  referralCode: string;
  referredBy: string;
  birthday: string;
  lastOrderDate: string;
  reviewCount: number;
}

const TIER_CONFIG = {
  Bronze: { color: "amber", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "text-amber-500", next: "Silver", nextSpend: 1000, multiplier: "1x" },
  Silver: { color: "gray", bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-600", icon: "text-gray-400", next: "Gold", nextSpend: 3000, multiplier: "1.5x" },
  Gold: { color: "yellow", bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", icon: "text-yellow-500", next: null, nextSpend: 0, multiplier: "2x" },
};

export default function AccountPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("biostack_token");
    const saved = localStorage.getItem("biostack_user");

    if (!token || !saved) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(saved);
    // Fill defaults for old user data missing new fields
    setUser({
      totalSpent: 0,
      monthlySpent: 0,
      tier: "Bronze",
      referralCode: "",
      referredBy: "",
      birthday: "",
      lastOrderDate: "",
      reviewCount: 0,
      ...parsed,
    });
    setLoading(false);
  }, [router]);

  function handleLogout() {
    const token = localStorage.getItem("biostack_token");
    if (token) {
      fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout", token }),
      });
    }
    localStorage.removeItem("biostack_token");
    localStorage.removeItem("biostack_user");
    router.push("/");
  }

  function copyReferral() {
    if (!user) return;
    const link = `https://biostackpeptide.com/signup?ref=${user.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full" />
      </div>
    );
  }

  const tierInfo = TIER_CONFIG[user.tier] || TIER_CONFIG.Bronze;
  const nextMilestone = Math.ceil((user.orderCount || 1) / 5) * 5;
  const ordersToBonus = nextMilestone - user.orderCount;
  const progressPercent = ((user.orderCount % 5) / 5) * 100;

  // Tier progress
  const tierProgressPercent = tierInfo.next
    ? Math.min(100, (user.totalSpent / tierInfo.nextSpend) * 100)
    : 100;
  const spentToNextTier = tierInfo.next ? Math.max(0, tierInfo.nextSpend - user.totalSpent) : 0;

  // Monthly spend progress toward AED 75 bonus
  const monthlyProgressPercent = Math.min(100, (user.monthlySpent / 1000) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center">
            <User className="w-7 h-7 text-brand-cyan" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tierInfo.bg} ${tierInfo.border} ${tierInfo.text} border`}>
                {user.tier}
              </span>
            </div>
            <p className="text-brand-muted text-sm">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-border text-brand-muted text-sm hover:text-red-500 hover:border-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="p-4 rounded-xl border border-brand-border bg-white">
          <ShoppingBag className="w-5 h-5 text-brand-cyan mb-2" />
          <p className="text-2xl font-bold text-gray-900">{user.orderCount}</p>
          <p className="text-brand-muted text-xs">Total Orders</p>
        </div>
        <div className="p-4 rounded-xl border border-brand-border bg-white">
          <Star className="w-5 h-5 text-brand-cyan mb-2" />
          <p className="text-2xl font-bold text-gray-900">{user.loyaltyPoints}</p>
          <p className="text-brand-muted text-xs">Loyalty Points</p>
        </div>
        <div className="p-4 rounded-xl border border-brand-border bg-white">
          <Gift className="w-5 h-5 text-brand-cyan mb-2" />
          <p className="text-2xl font-bold text-gray-900">AED {user.bonusCredit}</p>
          <p className="text-brand-muted text-xs">Bonus Credit</p>
        </div>
        <div className="p-4 rounded-xl border border-brand-border bg-white">
          <TrendingUp className="w-5 h-5 text-brand-cyan mb-2" />
          <p className="text-2xl font-bold text-gray-900">AED {user.totalSpent}</p>
          <p className="text-brand-muted text-xs">Lifetime Spent</p>
        </div>
      </div>

      {/* Tier Progress */}
      <div className={`p-5 rounded-xl ${tierInfo.bg} ${tierInfo.border} border mb-6`}>
        <div className="flex items-center gap-2 mb-3">
          <Crown className={`w-5 h-5 ${tierInfo.icon}`} />
          <h2 className={`font-semibold ${tierInfo.text}`}>
            {user.tier} Tier — {tierInfo.multiplier} Points
          </h2>
        </div>

        {tierInfo.next ? (
          <>
            <div className="flex justify-between text-xs text-brand-muted mb-1">
              <span>AED {user.totalSpent.toFixed(0)} spent</span>
              <span>AED {spentToNextTier.toFixed(0)} to {tierInfo.next}</span>
            </div>
            <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-brand-border">
              <div
                className="h-full bg-brand-cyan rounded-full transition-all duration-500"
                style={{ width: `${tierProgressPercent}%` }}
              />
            </div>
            <p className="text-brand-muted text-xs mt-2">
              Spend <strong>AED {spentToNextTier.toFixed(0)}</strong> more to unlock <strong>{tierInfo.next}</strong> tier and earn <strong>{tierInfo.next === "Silver" ? "1.5x" : "2x"}</strong> points on every order!
            </p>
          </>
        ) : (
          <p className={`text-sm ${tierInfo.text}`}>
            You&apos;re at the highest tier! Enjoy 2x points on every order, free shipping, and exclusive perks.
          </p>
        )}

        {/* Tier Benefits */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { tier: "Bronze", perks: ["1 pt / AED 10", "Standard shipping", "Birthday reward"] },
            { tier: "Silver", perks: ["1.5x points", "Free shipping", "Priority support"] },
            { tier: "Gold", perks: ["2x points", "Free shipping", "Early access"] },
          ].map((t) => (
            <div key={t.tier} className={`p-3 rounded-lg border text-xs ${user.tier === t.tier ? "bg-white border-brand-cyan shadow-sm" : "bg-white/50 border-brand-border"}`}>
              <p className={`font-bold mb-1 ${user.tier === t.tier ? "text-brand-cyan" : "text-brand-muted"}`}>{t.tier}</p>
              {t.perks.map((p) => (
                <p key={p} className="text-brand-muted">{p}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Order Milestone */}
        <div className="p-5 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-gray-900 font-semibold">Order Milestone</h2>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-xs text-brand-muted mb-1">
              <span>{user.orderCount % 5} of 5 orders</span>
              <span>{ordersToBonus} more for AED 50</span>
            </div>
            <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-brand-border">
              <div
                className="h-full bg-brand-cyan rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <p className="text-brand-muted text-xs">
            Every 5 orders = <strong className="text-brand-cyan">AED 50 bonus credit</strong>
          </p>
        </div>

        {/* Monthly Spend Bonus */}
        <div className="p-5 rounded-xl border border-purple-200 bg-purple-50">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-purple-500" />
            <h2 className="text-gray-900 font-semibold">Monthly Bonus</h2>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-xs text-brand-muted mb-1">
              <span>AED {user.monthlySpent} this month</span>
              <span>{user.monthlySpent >= 1000 ? "Earned!" : `AED ${(1000 - user.monthlySpent).toFixed(0)} to go`}</span>
            </div>
            <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-brand-border">
              <div
                className="h-full bg-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${monthlyProgressPercent}%` }}
              />
            </div>
          </div>
          <p className="text-brand-muted text-xs">
            Spend AED 1,000+ this month = <strong className="text-purple-600">AED 75 bonus credit</strong>
          </p>
        </div>
      </div>

      {/* Referral Section */}
      <div className="p-5 rounded-xl border border-green-200 bg-green-50 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-green-600" />
          <h2 className="text-gray-900 font-semibold">Refer a Friend — Get AED 25 Each</h2>
        </div>
        <p className="text-brand-muted text-sm mb-3">
          Share your referral code. When a friend signs up with it, you both get <strong>AED 25 bonus credit</strong>.
        </p>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 px-4 py-3 bg-white rounded-xl border border-green-200 font-mono text-sm text-gray-900 font-bold tracking-wide">
            {user.referralCode}
          </div>
          <button
            onClick={copyReferral}
            className="px-4 py-3 rounded-xl bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Link</>}
          </button>
        </div>
        <p className="text-green-700 text-xs">
          Copies your personal signup link: biostackpeptide.com/signup?ref={user.referralCode}
        </p>
      </div>

      {/* How Points Work */}
      <div className="p-5 rounded-xl border border-brand-border bg-white mb-8">
        <h3 className="text-gray-900 font-semibold mb-4">How to Earn Points</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="text-center p-3 rounded-lg bg-gray-50">
            <ShoppingBag className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
            <p className="text-gray-900 font-medium text-xs">Shop</p>
            <p className="text-brand-cyan text-xs font-bold">1pt / AED 10</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50">
            <Star className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
            <p className="text-gray-900 font-medium text-xs">Buy a Stack</p>
            <p className="text-brand-cyan text-xs font-bold">+25 bonus pts</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50">
            <MessageSquare className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
            <p className="text-gray-900 font-medium text-xs">Write Review</p>
            <p className="text-brand-cyan text-xs font-bold">+20 pts</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50">
            <Calendar className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
            <p className="text-gray-900 font-medium text-xs">Birthday</p>
            <p className="text-brand-cyan text-xs font-bold">Special code</p>
          </div>
        </div>

        {/* Points Multiplier Event */}
        <div className="mt-4 p-3 rounded-lg bg-brand-cyan/5 border border-brand-cyan/20 flex items-center gap-3">
          <Zap className="w-5 h-5 text-brand-cyan shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-900">Points Multiplier Events</p>
            <p className="text-xs text-brand-muted">Watch for double & triple point weekends! Your tier multiplier stacks with event multipliers.</p>
          </div>
        </div>
      </div>

      <Link
        href="/products"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-cyan text-white font-semibold hover:bg-brand-cyan/90 transition-colors"
      >
        Shop Now <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
