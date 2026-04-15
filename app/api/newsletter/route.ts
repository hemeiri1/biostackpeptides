import { NextResponse } from "next/server";

const UPSTASH_URL = "https://devoted-gorilla-69499.upstash.io";
const UPSTASH_TOKEN = "gQAAAAAAAQ97AAIncDE2Y2VlODA1ZDJhOWQ0MGQ2Yjg0NWIzMWQyNmQzYjE5YXAxNjk0OTk";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ success: false, message: "Email required" });

    // Store in Upstash Redis set
    await fetch(`${UPSTASH_URL}/sadd/newsletter-subscribers/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to subscribe" });
  }
}
