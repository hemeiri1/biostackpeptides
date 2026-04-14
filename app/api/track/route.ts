import { NextResponse } from "next/server";
import { trackVisit, getStats } from "@/lib/tracker";

export async function POST(req: Request) {
  const { visitorId } = await req.json();
  trackVisit(visitorId || "anonymous");
  return NextResponse.json({ success: true });
}

export async function GET() {
  const stats = getStats();
  const today = new Date().toISOString().split("T")[0];
  const todayStats = stats.daily.find((d) => d.date === today);

  return NextResponse.json({
    totalPageViews: stats.totalPageViews,
    totalUniqueVisitors: stats.totalUniqueVisitors,
    todayPageViews: todayStats?.pageViews || 0,
    todayUniqueVisitors: todayStats?.uniqueVisitors.length || 0,
    last7Days: stats.daily.slice(-7),
  });
}
