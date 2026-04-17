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
  try {
    await fetch(`${UPSTASH_URL}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(["SET", key, value]),
    });
  } catch {
    console.error("Redis set failed for", key);
  }
}

// GET — return all products with stock status
export async function GET() {
  const { products } = await import("@/data/products");

  const productList = await Promise.all(
    products.map(async (p) => {
      const stockOverride = await redisGet(`stock:${p.id}`);
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        inStock: stockOverride !== null ? stockOverride === "true" : p.inStock,
        salesCount: p.salesCount,
      };
    })
  );

  return NextResponse.json(productList);
}

// POST — update stock statuses
export async function POST(req: Request) {
  const updates: { id: string; inStock: boolean }[] = await req.json();

  await Promise.all(
    updates.map((item) => redisSet(`stock:${item.id}`, String(item.inStock)))
  );

  return NextResponse.json({ success: true, updated: updates.length });
}
