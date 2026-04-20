import { NextResponse } from "next/server";

const UPSTASH_URL = "https://devoted-gorilla-69499.upstash.io";
const UPSTASH_TOKEN = "gQAAAAAAAQ97AAIncDE2Y2VlODA1ZDJhOWQ0MGQ2Yjg0NWIzMWQyNmQzYjE5YXAxNjk0OTk";

// Default discount codes
const DEFAULT_CODES: Record<string, { discount: number; maxUses: number }> = {
  "BIOSTACK10": { discount: 10, maxUses: 999 },
  "PEPTIDE10": { discount: 10, maxUses: 999 },
  "RESEARCH10": { discount: 10, maxUses: 999 },
  "LAUNCH10": { discount: 10, maxUses: 999 },
  "MAY15": { discount: 15, maxUses: 999 },
  "STACK15": { discount: 15, maxUses: 999 },
  "COMEBACK10": { discount: 10, maxUses: 999 },
};

async function redisCommand(command: string[]) {
  const res = await fetch(`${UPSTASH_URL}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  return res.json();
}

export async function POST(req: Request) {
  const { code } = await req.json();
  const upperCode = (code || "").trim().toUpperCase();

  const codeConfig = DEFAULT_CODES[upperCode];
  if (!codeConfig) {
    return NextResponse.json({ valid: false, message: "Invalid discount code" });
  }

  // Check usage count from Redis
  const { result: usedStr } = await redisCommand(["GET", `discount-used:${upperCode}`]);
  const usedCount = usedStr ? parseInt(usedStr) : 0;

  if (usedCount >= codeConfig.maxUses) {
    return NextResponse.json({ valid: false, message: "This code has expired" });
  }

  // Increment usage
  await redisCommand(["INCR", `discount-used:${upperCode}`]);

  return NextResponse.json({
    valid: true,
    discount: codeConfig.discount,
    message: `${codeConfig.discount}% discount applied!`,
  });
}
