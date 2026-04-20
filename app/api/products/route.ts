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

export async function GET() {
  const { products } = await import("@/data/products");

  const productList = await Promise.all(
    products.map(async (p) => {
      const override = await redisGet(`product:${p.id}`);
      const parsed = override ? JSON.parse(override) : null;
      return {
        id: p.id,
        slug: p.slug,
        name: parsed?.name || p.name,
        price: parsed?.sizes ? parsed.sizes[0].price : p.price,
        sizes: parsed?.sizes || p.sizes,
      };
    })
  );

  return NextResponse.json(productList);
}

export async function POST(req: Request) {
  const { id, name, sizes } = await req.json();

  await redisSet(`product:${id}`, JSON.stringify({ name, sizes }));

  return NextResponse.json({ success: true });
}
