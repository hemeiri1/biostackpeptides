import { NextResponse } from "next/server";

// In-memory stock store (persists while serverless function is warm)
// For permanent persistence, upgrade to Vercel KV
const stockOverrides: Map<string, boolean> = new Map();

// GET — return all products with stock status
export async function GET() {
  const { products } = await import("@/data/products");

  const productList = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    inStock: stockOverrides.has(p.id) ? stockOverrides.get(p.id)! : p.inStock,
    salesCount: p.salesCount,
  }));

  return NextResponse.json(productList);
}

// POST — update stock statuses
export async function POST(req: Request) {
  const updates: { id: string; inStock: boolean }[] = await req.json();

  updates.forEach((item) => {
    stockOverrides.set(item.id, item.inStock);
  });

  return NextResponse.json({ success: true, updated: updates.length });
}
