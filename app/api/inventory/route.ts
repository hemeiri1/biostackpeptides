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

// GET — return all products with per-size stock quantities
export async function GET() {
  const { products } = await import("@/data/products");

  const productList = await Promise.all(
    products.map(async (p) => {
      const sizes = await Promise.all(
        p.sizes.map(async (s) => {
          const qtyStr = await redisGet(`stock-size:${p.id}:${s.label}`);
          return {
            label: s.label,
            quantity: qtyStr !== null ? parseInt(qtyStr) : 10,
          };
        })
      );

      const totalQty = sizes.reduce((sum, s) => sum + s.quantity, 0);

      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        inStock: totalQty > 0,
        sizes,
        salesCount: p.salesCount,
      };
    })
  );

  return NextResponse.json(productList);
}

// POST — update stock for a specific size
export async function POST(req: Request) {
  const body = await req.json();

  // New format: { productId, sizeLabel, quantity }
  if (body.productId && body.sizeLabel !== undefined) {
    await redisSet(`stock-size:${body.productId}:${body.sizeLabel}`, String(body.quantity));
    const inStock = body.quantity > 0;
    await redisSet(`stock:${body.productId}`, String(inStock));
    return NextResponse.json({ success: true });
  }

  // Legacy format: [{ id, inStock, quantity }]
  if (Array.isArray(body)) {
    await Promise.all(
      body.map(async (item: any) => {
        await redisSet(`stock:${item.id}`, String(item.inStock));
        if (item.quantity !== undefined) {
          await redisSet(`stock-qty:${item.id}`, String(item.quantity));
        }
      })
    );
    return NextResponse.json({ success: true, updated: body.length });
  }

  return NextResponse.json({ success: false, message: "Invalid format" });
}
