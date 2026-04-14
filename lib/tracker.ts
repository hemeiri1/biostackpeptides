import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const TRACKER_FILE = join(process.cwd(), "data", "analytics.json");

interface DailyStats {
  date: string;
  pageViews: number;
  uniqueVisitors: string[];
}

interface Analytics {
  totalPageViews: number;
  totalUniqueVisitors: number;
  daily: DailyStats[];
}

function getAnalytics(): Analytics {
  try {
    const data = readFileSync(TRACKER_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { totalPageViews: 0, totalUniqueVisitors: 0, daily: [] };
  }
}

function saveAnalytics(analytics: Analytics) {
  writeFileSync(TRACKER_FILE, JSON.stringify(analytics, null, 2));
}

export function trackVisit(visitorId: string) {
  const analytics = getAnalytics();
  const today = new Date().toISOString().split("T")[0];

  let todayStats = analytics.daily.find((d) => d.date === today);
  if (!todayStats) {
    todayStats = { date: today, pageViews: 0, uniqueVisitors: [] };
    analytics.daily.push(todayStats);
  }

  todayStats.pageViews++;
  analytics.totalPageViews++;

  if (!todayStats.uniqueVisitors.includes(visitorId)) {
    todayStats.uniqueVisitors.push(visitorId);
    analytics.totalUniqueVisitors++;
  }

  // Keep only last 30 days
  if (analytics.daily.length > 30) {
    analytics.daily = analytics.daily.slice(-30);
  }

  saveAnalytics(analytics);
  return analytics;
}

export function getStats() {
  return getAnalytics();
}
