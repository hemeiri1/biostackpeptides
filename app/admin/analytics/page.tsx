"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3, ArrowLeft, RefreshCw, Eye, ShoppingCart, CreditCard,
  Users, TrendingUp, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

interface DailyViews {
  date: string;
  views: number;
}

interface DailyEvents {
  date: string;
  events: Record<string, number>;
}

interface AnalyticsData {
  dailyViews: DailyViews[];
  dailyEvents: DailyEvents[];
  pageBreakdown: Record<string, number>;
  productBreakdown: Record<string, number>;
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  subscribers: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-stats" }),
      });
      const result = await res.json();
      setData(result);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  if (loading || !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin mx-auto mb-4" />
        <p className="text-brand-muted">Loading analytics...</p>
      </div>
    );
  }

  const todayViews = data.dailyViews[0]?.views || 0;
  const yesterdayViews = data.dailyViews[1]?.views || 0;
  const viewsChange = yesterdayViews > 0 ? ((todayViews - yesterdayViews) / yesterdayViews * 100).toFixed(0) : "0";
  const weekViews = data.dailyViews.reduce((sum, d) => sum + d.views, 0);

  const todayAddToCart = data.dailyEvents[0]?.events?.add_to_cart || 0;
  const todayCheckouts = data.dailyEvents[0]?.events?.checkout || 0;
  const todaySignups = data.dailyEvents[0]?.events?.signup || 0;

  const conversionRate = todayViews > 0 ? ((data.todayOrders / todayViews) * 100).toFixed(1) : "0";

  // Sort pages by views
  const topPages = Object.entries(data.pageBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Sort products by views
  const topProducts = Object.entries(data.productBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Bar chart (simple CSS bars)
  const maxViews = Math.max(...data.dailyViews.map(d => d.views), 1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-brand-muted hover:text-gray-900 text-sm flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-cyan" /> Analytics
          </h1>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-cyan text-white text-sm font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div className="p-4 rounded-xl border border-brand-border bg-white">
          <Eye className="w-4 h-4 text-brand-cyan mb-2" />
          <p className="text-2xl font-bold text-gray-900">{todayViews}</p>
          <p className="text-xs text-brand-muted">Today&apos;s Views</p>
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${Number(viewsChange) >= 0 ? "text-green-600" : "text-red-500"}`}>
            {Number(viewsChange) >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {viewsChange}% vs yesterday
          </div>
        </div>
        <div className="p-4 rounded-xl border border-brand-border bg-white">
          <ShoppingCart className="w-4 h-4 text-brand-cyan mb-2" />
          <p className="text-2xl font-bold text-gray-900">{todayAddToCart}</p>
          <p className="text-xs text-brand-muted">Add to Cart</p>
        </div>
        <div className="p-4 rounded-xl border border-brand-border bg-white">
          <CreditCard className="w-4 h-4 text-brand-cyan mb-2" />
          <p className="text-2xl font-bold text-gray-900">{data.todayOrders}</p>
          <p className="text-xs text-brand-muted">Today&apos;s Orders</p>
        </div>
        <div className="p-4 rounded-xl border border-green-200 bg-green-50">
          <TrendingUp className="w-4 h-4 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-green-700">AED {data.todayRevenue.toFixed(0)}</p>
          <p className="text-xs text-green-600">Today&apos;s Revenue</p>
        </div>
        <div className="p-4 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5">
          <TrendingUp className="w-4 h-4 text-brand-cyan mb-2" />
          <p className="text-2xl font-bold text-brand-cyan">{conversionRate}%</p>
          <p className="text-xs text-brand-muted">Conversion Rate</p>
        </div>
        <div className="p-4 rounded-xl border border-brand-border bg-white">
          <Users className="w-4 h-4 text-brand-cyan mb-2" />
          <p className="text-2xl font-bold text-gray-900">{data.subscribers}</p>
          <p className="text-xs text-brand-muted">Subscribers</p>
        </div>
      </div>

      {/* 7-Day Views Chart */}
      <div className="p-6 rounded-xl border border-brand-border bg-white mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Page Views — Last 7 Days ({weekViews} total)</h3>
        <div className="flex items-end gap-2 h-40">
          {[...data.dailyViews].reverse().map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-gray-900">{day.views}</span>
              <div
                className="w-full bg-brand-cyan/20 rounded-t-lg relative overflow-hidden"
                style={{ height: `${(day.views / maxViews) * 100}%`, minHeight: day.views > 0 ? "8px" : "2px" }}
              >
                <div className="absolute inset-0 bg-brand-cyan rounded-t-lg" style={{ opacity: day.date === data.dailyViews[0]?.date ? 1 : 0.5 }} />
              </div>
              <span className="text-[10px] text-brand-muted">
                {new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Pages */}
        <div className="p-6 rounded-xl border border-brand-border bg-white">
          <h3 className="font-bold text-gray-900 mb-4">Top Pages Today</h3>
          {topPages.length === 0 ? (
            <p className="text-brand-muted text-sm text-center py-8">No data yet today</p>
          ) : (
            <div className="space-y-2">
              {topPages.map(([page, views]) => (
                <div key={page} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 truncate max-w-[200px]">{page}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-cyan rounded-full"
                        style={{ width: `${(views / (topPages[0]?.[1] || 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-900 w-8 text-right">{views}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Events Funnel */}
        <div className="p-6 rounded-xl border border-brand-border bg-white">
          <h3 className="font-bold text-gray-900 mb-4">Today&apos;s Funnel</h3>
          <div className="space-y-3">
            {[
              { label: "Page Views", value: todayViews, color: "bg-blue-500", icon: Eye },
              { label: "Product Views", value: data.dailyEvents[0]?.events?.product_view || 0, color: "bg-cyan-500", icon: Eye },
              { label: "Add to Cart", value: todayAddToCart, color: "bg-amber-500", icon: ShoppingCart },
              { label: "Checkout Started", value: todayCheckouts, color: "bg-orange-500", icon: CreditCard },
              { label: "Orders Completed", value: data.todayOrders, color: "bg-green-500", icon: CreditCard },
              { label: "Signups", value: todaySignups, color: "bg-purple-500", icon: Users },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-brand-muted shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-brand-muted">{label}</span>
                    <span className="font-bold text-gray-900">{value}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full`}
                      style={{ width: `${todayViews > 0 ? (value / todayViews) * 100 : 0}%`, minWidth: value > 0 ? "4px" : "0" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="p-6 rounded-xl bg-[#1B3A5C] text-white">
        <h3 className="font-bold mb-4">Lifetime Stats</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-extrabold">{data.totalOrders}</p>
            <p className="text-blue-200/60 text-sm">Total Orders</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold">AED {data.totalRevenue.toFixed(0)}</p>
            <p className="text-blue-200/60 text-sm">Total Revenue</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold">{data.subscribers}</p>
            <p className="text-blue-200/60 text-sm">Newsletter Subs</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold">{weekViews}</p>
            <p className="text-blue-200/60 text-sm">Views This Week</p>
          </div>
        </div>
      </div>
    </div>
  );
}
