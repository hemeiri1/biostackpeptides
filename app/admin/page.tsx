"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Globe,
  Bug,
  BarChart3,
  Package,
  Instagram,
  MessageSquare,
  Brain,
  Bell,
} from "lucide-react";

interface AgentReport {
  agent: string;
  status: "ok" | "warning" | "critical";
  message: string;
  details?: string;
  timestamp: string;
}

interface OverseerReport {
  overallStatus: "ok" | "warning" | "critical";
  reports: AgentReport[];
  generatedAt: string;
  notifications: string[];
}

const agentIcons: Record<string, typeof Globe> = {
  "Uptime Monitor": Globe,
  "Error Monitor": Bug,
  "Traffic Monitor": BarChart3,
  "Inventory Monitor": Package,
  "Social Media Monitor": Instagram,
  "Support Monitor": MessageSquare,
};

const statusColors = {
  ok: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: "text-green-500" },
  warning: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", icon: "text-yellow-500" },
  critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "text-red-500" },
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "ok") return <CheckCircle className="w-5 h-5 text-green-500" />;
  if (status === "warning") return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  return <XCircle className="w-5 h-5 text-red-500" />;
};

export default function AdminDashboard() {
  const [report, setReport] = useState<OverseerReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  async function fetchReport() {
    setLoading(true);
    try {
      const res = await fetch("/api/agents", { cache: "no-store" });
      const data = await res.json();
      setReport(data);
      setLastRefresh(new Date());
    } catch {
      console.error("Failed to fetch agent reports");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchReport();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchReport, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const overallColor = report ? statusColors[report.overallStatus] : statusColors.ok;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-7 h-7 text-brand-cyan" />
            <h1 className="text-3xl font-bold text-gray-900">Overseer Dashboard</h1>
          </div>
          <p className="text-brand-muted">
            Multi-agent monitoring system for BioStackPeptides
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              autoRefresh
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-brand-border text-brand-muted"
            }`}
          >
            {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          </button>
          <button
            onClick={fetchReport}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-cyan text-white font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Overall Status */}
      {report && (
        <div className={`${overallColor.bg} ${overallColor.border} border rounded-2xl p-6 mb-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${overallColor.bg} flex items-center justify-center`}>
                <Shield className={`w-6 h-6 ${overallColor.icon}`} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${overallColor.text}`}>
                  {report.overallStatus === "ok" && "All Systems Operational"}
                  {report.overallStatus === "warning" && "Warning — Attention Needed"}
                  {report.overallStatus === "critical" && "Critical — Immediate Action Required"}
                </h2>
                <p className="text-brand-muted text-sm mt-1">
                  {report.reports.filter((r) => r.status === "ok").length}/{report.reports.length} agents reporting OK
                  {lastRefresh && ` · Last checked ${lastRefresh.toLocaleTimeString()}`}
                </p>
              </div>
            </div>
            <div className={`text-3xl font-bold ${overallColor.text} uppercase`}>
              {report.overallStatus}
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {report && report.notifications.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-brand-cyan" />
            Notifications
          </h3>
          <div className="space-y-2">
            {report.notifications.map((notif, i) => (
              <div
                key={i}
                className="px-4 py-3 rounded-lg bg-white border border-brand-border text-sm text-gray-900"
              >
                {notif}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Grid */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.reports.map((agentReport) => {
            const colors = statusColors[agentReport.status];
            const Icon = agentIcons[agentReport.agent] || Globe;

            return (
              <div
                key={agentReport.agent}
                className={`${colors.bg} ${colors.border} border rounded-xl p-5 transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                    <h3 className="font-semibold text-gray-900 text-sm">{agentReport.agent}</h3>
                  </div>
                  <StatusIcon status={agentReport.status} />
                </div>
                <p className={`font-medium text-sm ${colors.text} mb-2`}>{agentReport.message}</p>
                {agentReport.details && (
                  <p className="text-xs text-brand-muted leading-relaxed">{agentReport.details}</p>
                )}
                <p className="text-[10px] text-brand-muted mt-3">
                  {new Date(agentReport.timestamp).toLocaleTimeString()}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading state */}
      {loading && !report && (
        <div className="text-center py-24">
          <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin mx-auto mb-4" />
          <p className="text-brand-muted">Running all agents...</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-10 mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/admin/inventory" className="flex items-center gap-3 p-4 rounded-xl border border-brand-border bg-white hover:border-brand-cyan/40 hover:shadow-md transition-all">
            <Package className="w-5 h-5 text-brand-cyan" />
            <div>
              <p className="text-gray-900 font-medium text-sm">Inventory Manager</p>
              <p className="text-brand-muted text-xs">Toggle product stock on/off</p>
            </div>
          </Link>
          <Link href="/products" className="flex items-center gap-3 p-4 rounded-xl border border-brand-border bg-white hover:border-brand-cyan/40 hover:shadow-md transition-all">
            <BarChart3 className="w-5 h-5 text-brand-cyan" />
            <div>
              <p className="text-gray-900 font-medium text-sm">View Store</p>
              <p className="text-brand-muted text-xs">See live product pages</p>
            </div>
          </Link>
          <Link href="/contact" className="flex items-center gap-3 p-4 rounded-xl border border-brand-border bg-white hover:border-brand-cyan/40 hover:shadow-md transition-all">
            <MessageSquare className="w-5 h-5 text-brand-cyan" />
            <div>
              <p className="text-gray-900 font-medium text-sm">Support Inbox</p>
              <p className="text-brand-muted text-xs">Check contact submissions</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Agent Architecture */}
      <div className="mt-12 p-6 rounded-xl border border-brand-border bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">Agent Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-brand-muted mb-2"><strong className="text-gray-900">Overseer Agent</strong> — Aggregates all sub-agent reports, determines overall system health, and generates notifications.</p>
            <p className="text-brand-muted mb-2"><strong className="text-gray-900">Uptime Agent</strong> — Pings biostackpeptide.com every 60 seconds, monitors response time and HTTP status.</p>
            <p className="text-brand-muted"><strong className="text-gray-900">Error Agent</strong> — Watches Vercel deployment logs for build failures and runtime errors.</p>
          </div>
          <div>
            <p className="text-brand-muted mb-2"><strong className="text-gray-900">Traffic Agent</strong> — Tracks page views, unique visitors, and engagement metrics. Connect Vercel Analytics to activate.</p>
            <p className="text-brand-muted mb-2"><strong className="text-gray-900">Inventory Agent</strong> — Monitors product stock levels, tracks best sellers, and alerts on out-of-stock items.</p>
            <p className="text-brand-muted"><strong className="text-gray-900">Support Agent</strong> — Monitors incoming contact form submissions and response times.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
