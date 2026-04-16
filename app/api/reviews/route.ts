import { NextResponse } from "next/server";

const UPSTASH_URL = "https://devoted-gorilla-69499.upstash.io";
const UPSTASH_TOKEN = "gQAAAAAAAQ97AAIncDE2Y2VlODA1ZDJhOWQ0MGQ2Yjg0NWIzMWQyNmQzYjE5YXAxNjk0OTk";

async function redisCommand(command: string[]) {
  const res = await fetch(`${UPSTASH_URL}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  return res.json();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json([]);

  const { result } = await redisCommand(["LRANGE", `reviews:${productId}`, "0", "49"]);
  if (!result) return NextResponse.json([]);

  return NextResponse.json(result.map((r: string) => JSON.parse(r)));
}

export async function POST(req: Request) {
  const { productId, name, rating, comment } = await req.json();
  if (!productId || !name || !rating) {
    return NextResponse.json({ success: false, message: "Missing fields" });
  }

  const review = {
    id: "rev_" + Date.now().toString(36),
    name,
    rating: Math.min(5, Math.max(1, rating)),
    comment: comment || "",
    date: new Date().toISOString(),
  };

  await redisCommand(["LPUSH", `reviews:${productId}`, JSON.stringify(review)]);

  return NextResponse.json({ success: true, review });
}
