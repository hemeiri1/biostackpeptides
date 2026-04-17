import { NextResponse } from "next/server";

const UPSTASH_URL = "https://devoted-gorilla-69499.upstash.io";
const UPSTASH_TOKEN = "gQAAAAAAAQ97AAIncDE2Y2VlODA1ZDJhOWQ0MGQ2Yjg0NWIzMWQyNmQzYjE5YXAxNjk0OTk";

async function redisGet(key: string): Promise<string | null> {
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
    });
    const data = await res.json();
    return data.result;
  } catch {
    return null;
  }
}

async function redisSet(key: string, value: string) {
  await fetch(`${UPSTASH_URL}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(["SET", key, value]),
  });
}

// GET — return all products with stock status and quantity
export async function GET() {
  const { products } = await import("@/data/products");

  const productList = await Promise.all(
    products.map(async (p) => {
      const stockOverride = await redisGet(`stock:${p.id}`);
      const quantityStr = await redisGet(`stock-qty:${p.id}`);
      const quantity = quantityStr !== null ? parseInt(quantityStr) : 10; // default 10
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        inStock: stockOverride !== null ? stockOverride === "true" : quantity > 0,
        quantity,
        salesCount: p.salesCount,
      };
    })
  );

  return NextResponse.json(productList);
}

// POST — update stock statuses and quantities
export async function POST(req: Request) {
  const updates: { id: string; inStock: boolean; quantity?: number }[] = await req.json();

  await Promise.all(
    updates.map(async (item) => {
      await redisSet(`stock:${item.id}`, String(item.inStock));
      if (item.quantity !== undefined) {
        await redisSet(`stock-qty:${item.id}`, String(item.quantity));
      }
    })
  );

  return NextResponse.json({ success: true, updated: updates.length });
}
