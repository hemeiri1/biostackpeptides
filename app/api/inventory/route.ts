import { NextResponse } from "next/server";

let kv: any = null;

async function getKV() {
  if (kv) return kv;
  try {
    const mod = await import("@vercel/kv");
    kv = mod.kv;
    return kv;
  } catch {
    return null;
  }
}

// Fallback in-memory store
const memoryStock: Map<string, boolean> = new Map();

async function getStock(productId: string): Promise<boolean | null> {
  const store = await getKV();
  if (store) {
    const val = await store.get(`stock:${productId}`);
    return val !== null ? val as boolean : null;
  }
  return memoryStock.has(productId) ? memoryStock.get(productId)! : null;
}

async function setStock(productId: string, inStock: boolean) {
  const store = await getKV();
  if (store) {
    await store.set(`stock:${productId}`, inStock);
  } else {
    memoryStock.set(productId, inStock);
  }
}

// GET — return all products with stock status
export async function GET() {
  const { products } = await import("@/data/products");

  const productList = await Promise.all(
    products.map(async (p) => {
      const stockOverride = await getStock(p.id);
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        inStock: stockOverride !== null ? stockOverride : p.inStock,
        salesCount: p.salesCount,
      };
    })
  );

  return NextResponse.json(productList);
}

// POST — update stock statuses
export async function POST(req: Request) {
  const updates: { id: string; inStock: boolean }[] = await req.json();

  await Promise.all(updates.map((item) => setStock(item.id, item.inStock)));

  return NextResponse.json({ success: true, updated: updates.length });
}
