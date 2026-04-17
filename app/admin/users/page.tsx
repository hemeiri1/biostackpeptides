"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Crown, Star, Gift, ShoppingBag, ArrowLeft, RefreshCw, Search, TrendingUp } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  loyaltyPoints: number;
  orderCount: number;
  bonusCredit: number;
  totalSpent: number;
  tier: "Bronze" | "Silver" | "Gold";
  referralCode: string;
  createdAt: string;
}

const TIER_COLORS = {
  Bronze: "bg-amber-50 text-amber-700 border-amber-200",
  Silver: "bg-gray-100 text-gray-600 border-gray-300",
  Gold: "bg-yellow-50 text-yellow-700 border-yellow-300",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter((u) =>
    search === "" ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  const stats = {
    total: users.length,
    bronze: users.filter((u) => u.tier === "Bronze").length,
    silver: users.filter((u) => u.tier === "Silver").length,
    gold: users.filter((u) => u.tier === "Gold").length,
    totalPoints: users.reduce((sum, u) => sum + u.loyaltyPoints, 0),
    totalSpent: users.reduce((sum, u) => sum + u.totalSpent, 0),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-brand-muted hover:text-gray-900 text-sm flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-cyan" /> Customers
          </h1>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-cyan text-white text-sm font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div className="p-4 rounded-xl border border-brand-border bg-white text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-brand-muted">Total Users</p>
        </div>
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-center">
          <p className="text-2xl font-bold text-amber-700">{stats.bronze}</p>
          <p className="text-xs text-amber-600">Bronze</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-300 bg-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-600">{stats.silver}</p>
          <p className="text-xs text-gray-500">Silver</p>
        </div>
        <div className="p-4 rounded-xl border border-yellow-300 bg-yellow-50 text-center">
          <p className="text-2xl font-bold text-yellow-700">{stats.gold}</p>
          <p className="text-xs text-yellow-600">Gold</p>
        </div>
        <div className="p-4 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 text-center">
          <p className="text-2xl font-bold text-brand-cyan">{stats.totalPoints}</p>
          <p className="text-xs text-brand-muted">Total Points</p>
        </div>
        <div className="p-4 rounded-xl border border-green-200 bg-green-50 text-center">
          <p className="text-2xl font-bold text-green-700">AED {stats.totalSpent.toFixed(0)}</p>
          <p className="text-xs text-green-600">Lifetime Revenue</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-cyan/50"
        />
      </div>

      {/* Users list */}
      {loading && users.length === 0 ? (
        <div className="text-center py-20">
          <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin mx-auto mb-4" />
          <p className="text-brand-muted">Loading customers...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-brand-muted mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-1">No customers found</p>
          <p className="text-brand-muted text-sm">Customers appear here when they sign up.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="bg-white border border-brand-border rounded-xl p-4 hover:border-brand-cyan/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 font-semibold text-sm">{user.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${TIER_COLORS[user.tier]}`}>
                        {user.tier}
                      </span>
                    </div>
                    <p className="text-brand-muted text-xs">{user.email || user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center hidden sm:block">
                    <p className="font-bold text-gray-900">{user.loyaltyPoints}</p>
                    <p className="text-[10px] text-brand-muted">Points</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="font-bold text-gray-900">{user.orderCount}</p>
                    <p className="text-[10px] text-brand-muted">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900">AED {user.totalSpent.toFixed(0)}</p>
                    <p className="text-[10px] text-brand-muted">Spent</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan text-lg font-bold">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selectedUser.name}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${TIER_COLORS[selectedUser.tier]}`}>
                      {selectedUser.tier} Tier
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="text-brand-muted hover:text-gray-900 text-xl">&times;</button>
              </div>

              {/* Contact Info */}
              <div className="mb-6 p-4 rounded-xl bg-gray-50 space-y-2 text-sm">
                {selectedUser.email && <p className="text-gray-900"><strong className="text-brand-muted">Email:</strong> {selectedUser.email}</p>}
                {selectedUser.phone && <p className="text-gray-900"><strong className="text-brand-muted">Phone:</strong> {selectedUser.phone}</p>}
                <p className="text-gray-900"><strong className="text-brand-muted">Referral Code:</strong> {selectedUser.referralCode}</p>
                <p className="text-gray-900"><strong className="text-brand-muted">Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}</p>
                <p className="text-gray-900"><strong className="text-brand-muted">Verified:</strong> {selectedUser.verified ? "Yes" : "No"}</p>
              </div>

              {/* Loyalty Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl border border-brand-border text-center">
                  <Star className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">{selectedUser.loyaltyPoints}</p>
                  <p className="text-[10px] text-brand-muted">Loyalty Points</p>
                </div>
                <div className="p-3 rounded-xl border border-brand-border text-center">
                  <ShoppingBag className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">{selectedUser.orderCount}</p>
                  <p className="text-[10px] text-brand-muted">Orders</p>
                </div>
                <div className="p-3 rounded-xl border border-brand-border text-center">
                  <TrendingUp className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">AED {selectedUser.totalSpent.toFixed(0)}</p>
                  <p className="text-[10px] text-brand-muted">Total Spent</p>
                </div>
                <div className="p-3 rounded-xl border border-brand-border text-center">
                  <Gift className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">AED {selectedUser.bonusCredit}</p>
                  <p className="text-[10px] text-brand-muted">Bonus Credit</p>
                </div>
              </div>

              {/* Tier Progress */}
              <div className="p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-brand-cyan" />
                  <p className="text-sm font-semibold text-gray-900">{selectedUser.tier} Tier</p>
                </div>
                {selectedUser.tier !== "Gold" && (
                  <p className="text-xs text-brand-muted">
                    AED {selectedUser.tier === "Bronze" ? (1000 - selectedUser.totalSpent).toFixed(0) : (3000 - selectedUser.totalSpent).toFixed(0)} more to {selectedUser.tier === "Bronze" ? "Silver" : "Gold"}
                  </p>
                )}
                {selectedUser.tier === "Gold" && (
                  <p className="text-xs text-brand-muted">Highest tier achieved!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
