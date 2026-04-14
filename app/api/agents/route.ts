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

export async function GET() {
  // Run all agents in parallel
  const [uptimeReport, errorReport] = await Promise.all([
    uptimeAgent(),
    errorAgent(),
  ]);

  // Sync agents
  const trafficReport = trafficAgent(0, 0); // Connect to analytics later
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
