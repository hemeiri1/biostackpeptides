import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const STOCK_FILE = join(process.cwd(), "data", "stock.json");

function getStock(): Record<string, boolean> {
  try {
    const data = readFileSync(STOCK_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveStock(stock: Record<string, boolean>) {
  writeFileSync(STOCK_FILE, JSON.stringify(stock, null, 2));
}

// GET — return all products with stock status
export async function GET() {
  // Dynamic import to avoid build issues
  const { products } = await import("@/data/products");
  const stock = getStock();

  const productList = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    inStock: stock[p.id] !== undefined ? stock[p.id] : p.inStock,
    salesCount: p.salesCount,
  }));

  return NextResponse.json(productList);
}

// POST — update stock statuses
export async function POST(req: Request) {
  const updates: { id: string; inStock: boolean }[] = await req.json();

  const stock: Record<string, boolean> = {};
  updates.forEach((item) => {
    stock[item.id] = item.inStock;
  });

  saveStock(stock);

  return NextResponse.json({ success: true, updated: updates.length });
}
