import { NextResponse } from "next/server";

const UPSTASH_URL = "https://devoted-gorilla-69499.upstash.io";
const UPSTASH_TOKEN = "gQAAAAAAAQ97AAIncDE2Y2VlODA1ZDJhOWQ0MGQ2Yjg0NWIzMWQyNmQzYjE5YXAxNjk0OTk";

async function redisCommand(command: string[]) {
  const res = await fetch(`${UPSTASH_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  return res.json();
}

export async function GET() {
  try {
    // Get all order IDs (sorted by timestamp, newest first)
    const { result: orderIds } = await redisCommand(["LRANGE", "orders:list", "0", "99"]);

    if (!orderIds || orderIds.length === 0) {
      return NextResponse.json([]);
    }

    // Get each order
    const orders = await Promise.all(
      orderIds.map(async (id: string) => {
        const { result } = await redisCommand(["GET", `order:${id}`]);
        return result ? JSON.parse(result) : null;
      })
    );

    return NextResponse.json(orders.filter(Boolean));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const order = await req.json();

    const orderId = "ORD-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();

    const orderData = {
      id: orderId,
      ...order,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Store order
    await redisCommand(["SET", `order:${orderId}`, JSON.stringify(orderData)]);
    // Add to list (newest first)
    await redisCommand(["LPUSH", "orders:list", orderId]);

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function PUT(req: Request) {
  try {
    const { orderId, status, trackingNumber } = await req.json();

    const { result } = await redisCommand(["GET", `order:${orderId}`]);
    if (!result) return NextResponse.json({ success: false, message: "Order not found" });

    const order = JSON.parse(result);
    order.status = status || order.status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.updatedAt = new Date().toISOString();

    await redisCommand(["SET", `order:${orderId}`, JSON.stringify(order)]);

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
