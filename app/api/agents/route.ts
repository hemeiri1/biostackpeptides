import { NextResponse } from "next/server";
import {
  uptimeAgent,
  errorAgent,
  trafficAgent,
  inventoryAgent,
  socialAgent,
  supportAgent,
  overseerAgent,
} from "@/lib/agents";
import { products } from "@/data/products";

export async function GET(req: Request) {
  // Run all agents in parallel
  const [uptimeReport, errorReport] = await Promise.all([
    uptimeAgent(),
    errorAgent(),
  ]);

  // Sync agents
  // Fetch real traffic data
  let todayViews = 0;
  let todayVisitors = 0;
  try {
    const trackRes = await fetch(new URL("/api/track", req.url).toString(), { cache: "no-store" });
    const trackData = await trackRes.json();
    todayViews = trackData.todayPageViews || 0;
    todayVisitors = trackData.todayUniqueVisitors || 0;
  } catch {}
  const trafficReport = trafficAgent(todayViews, todayVisitors);
  const inventoryReport = inventoryAgent(
    products.map((p) => ({ name: p.name, inStock: p.inStock, salesCount: p.salesCount }))
  );
  const socialReport = socialAgent();
  const supportReport = supportAgent(0); // Connect to support system later

  // Overseer aggregates all reports
  const allReports = [
    uptimeReport,
    errorReport,
    trafficReport,
    inventoryReport,
    socialReport,
    supportReport,
  ];

  const overseerReport = overseerAgent(allReports);

  return NextResponse.json(overseerReport);
}
