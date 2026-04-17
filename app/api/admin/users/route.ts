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

export async function GET() {
  try {
    // Scan for all user keys
    let cursor = "0";
    const userIds: string[] = [];

    do {
      const { result } = await redisCommand(["SCAN", cursor, "MATCH", "user:usr_*", "COUNT", "100"]);
      cursor = result[0];
      const keys = result[1] as string[];
      userIds.push(...keys);
    } while (cursor !== "0");

    // Get all users
    const users = await Promise.all(
      userIds.map(async (key: string) => {
        const { result } = await redisCommand(["GET", key]);
        if (!result) return null;
        const user = JSON.parse(result);
        // Don't send password to frontend
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          verified: user.verified,
          loyaltyPoints: user.loyaltyPoints || 0,
          orderCount: user.orderCount || 0,
          bonusCredit: user.bonusCredit || 0,
          totalSpent: user.totalSpent || 0,
          tier: user.tier || "Bronze",
          referralCode: user.referralCode || "",
          createdAt: user.createdAt,
        };
      })
    );

    return NextResponse.json(users.filter(Boolean).sort((a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
