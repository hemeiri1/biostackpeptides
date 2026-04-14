"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Award, ShoppingBag, Star, Gift, LogOut, ArrowRight } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name: string;
  loyaltyPoints: number;
  orderCount: number;
  bonusCredit: number;
}

export default function AccountPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("biostack_token");
    const saved = localStorage.getItem("biostack_user");

    if (!token || !saved) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(saved));
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

  if (loading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full" />
      </div>
    );
  }

  const nextMilestone = Math.ceil(user.orderCount / 5) * 5;
  const ordersToBonus = nextMilestone - user.orderCount;
  const progressPercent = ((user.orderCount % 5) / 5) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center">
            <User className="w-7 h-7 text-brand-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-5 rounded-xl border border-brand-border bg-white">
          <ShoppingBag className="w-5 h-5 text-brand-cyan mb-2" />
          <p className="text-2xl font-bold text-gray-900">{user.orderCount}</p>
          <p className="text-brand-muted text-xs">Total Orders</p>
        </div>
        <div className="p-5 rounded-xl border border-brand-border bg-white">
          <Star className="w-5 h-5 text-brand-cyan mb-2" />
          <p className="text-2xl font-bold text-gray-900">{user.loyaltyPoints}</p>
          <p className="text-brand-muted text-xs">Loyalty Points</p>
        </div>
        <div className="p-5 rounded-xl border border-brand-border bg-white">
          <Gift className="w-5 h-5 text-brand-cyan mb-2" />
          <p className="text-2xl font-bold text-gray-900">AED {user.bonusCredit}</p>
          <p className="text-brand-muted text-xs">Bonus Credit</p>
        </div>
      </div>

      {/* Loyalty Progress */}
      <div className="p-6 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-brand-cyan" />
          <h2 className="text-gray-900 font-semibold">Loyalty Progress</h2>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-brand-muted mb-1">
            <span>{user.orderCount % 5} of 5 orders</span>
            <span>{ordersToBonus} more for AED 50 bonus</span>
          </div>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-brand-border">
            <div
              className="h-full bg-brand-cyan rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <p className="text-brand-muted text-xs">
          Place {ordersToBonus} more order{ordersToBonus !== 1 ? "s" : ""} to earn <strong className="text-brand-cyan">AED 50 bonus credit</strong>. Credits are applied automatically at checkout.
        </p>
      </div>

      {/* How it works */}
      <div className="p-6 rounded-xl border border-brand-border bg-white mb-10">
        <h3 className="text-gray-900 font-semibold mb-4">How Loyalty Rewards Work</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-brand-cyan/10 flex items-center justify-center mx-auto mb-2">
              <span className="text-brand-cyan font-bold">1</span>
            </div>
            <p className="text-gray-900 font-medium">Shop</p>
            <p className="text-brand-muted text-xs">Earn 10 points every order</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-brand-cyan/10 flex items-center justify-center mx-auto mb-2">
              <span className="text-brand-cyan font-bold">2</span>
            </div>
            <p className="text-gray-900 font-medium">Reach 5 Orders</p>
            <p className="text-brand-muted text-xs">Hit the milestone</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-brand-cyan/10 flex items-center justify-center mx-auto mb-2">
              <span className="text-brand-cyan font-bold">3</span>
            </div>
            <p className="text-gray-900 font-medium">Get AED 50</p>
            <p className="text-brand-muted text-xs">Bonus credit added automatically</p>
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
