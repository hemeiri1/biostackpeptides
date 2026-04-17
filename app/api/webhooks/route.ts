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

// Webhook secret to prevent unauthorized access
const WEBHOOK_SECRET = "bsp-webhook-2026-secure";

function validateSecret(req: Request): boolean {
  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${WEBHOOK_SECRET}`;
}

// GET — Available webhook endpoints info
export async function GET(req: Request) {
  if (!validateSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    endpoints: {
      "GET /api/webhooks": "This info page",
      "POST /api/webhooks/orders": "Get all orders",
      "POST /api/webhooks/stats": "Get site stats (orders, revenue, subscribers)",
      "POST /api/webhooks/stock": "Get/update stock levels",
      "POST /api/webhooks/subscribers": "Get newsletter subscribers",
      "POST /api/webhooks/customers": "Get customer list",
    },
    auth: "Bearer token in Authorization header",
  });
}

// POST — Handle different webhook actions
export async function POST(req: Request) {
  if (!validateSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body;

  try {
    // Get all orders
    if (action === "get-orders") {
      const { result: orderIds } = await redisCommand(["LRANGE", "orders:list", "0", "99"]);
      if (!orderIds || orderIds.length === 0) return NextResponse.json({ orders: [] });

      const orders = await Promise.all(
        orderIds.map(async (id: string) => {
          const { result } = await redisCommand(["GET", `order:${id}`]);
          return result ? JSON.parse(result) : null;
        })
      );

      return NextResponse.json({ orders: orders.filter(Boolean) });
    }

    // Get new orders (since last check)
    if (action === "get-new-orders") {
      const { result: orderIds } = await redisCommand(["LRANGE", "orders:list", "0", "19"]);
      if (!orderIds) return NextResponse.json({ orders: [] });

      const orders = await Promise.all(
        orderIds.map(async (id: string) => {
          const { result } = await redisCommand(["GET", `order:${id}`]);
          return result ? JSON.parse(result) : null;
        })
      );

      const since = body.since ? new Date(body.since) : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const newOrders = orders.filter(Boolean).filter((o: any) => new Date(o.createdAt) > since);

      return NextResponse.json({ orders: newOrders, count: newOrders.length });
    }

    // Get site stats
    if (action === "get-stats") {
      const { result: orderIds } = await redisCommand(["LRANGE", "orders:list", "0", "999"]);
      const orders = orderIds
        ? await Promise.all(
            orderIds.map(async (id: string) => {
              const { result } = await redisCommand(["GET", `order:${id}`]);
              return result ? JSON.parse(result) : null;
            })
          )
        : [];

      const validOrders = orders.filter(Boolean);
      const totalRevenue = validOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      const { result: subscriberCount } = await redisCommand(["SCARD", "newsletter-subscribers"]);

      return NextResponse.json({
        totalOrders: validOrders.length,
        pendingOrders: validOrders.filter((o: any) => o.status === "pending").length,
        confirmedOrders: validOrders.filter((o: any) => o.status === "confirmed").length,
        shippedOrders: validOrders.filter((o: any) => o.status === "shipped").length,
        deliveredOrders: validOrders.filter((o: any) => o.status === "delivered").length,
        totalRevenue,
        newsletterSubscribers: subscriberCount || 0,
      });
    }

    // Get newsletter subscribers
    if (action === "get-subscribers") {
      const { result } = await redisCommand(["SMEMBERS", "newsletter-subscribers"]);
      return NextResponse.json({ subscribers: result || [] });
    }

    // Update order status (for automations)
    if (action === "update-order") {
      const { orderId, status, trackingNumber } = body;
      const { result } = await redisCommand(["GET", `order:${orderId}`]);
      if (!result) return NextResponse.json({ error: "Order not found" }, { status: 404 });

      const order = JSON.parse(result);
      order.status = status || order.status;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      order.updatedAt = new Date().toISOString();

      await redisCommand(["SET", `order:${orderId}`, JSON.stringify(order)]);
      return NextResponse.json({ success: true, order });
    }

    // Get stock levels
    if (action === "get-stock") {
      const { products } = await import("@/data/products");
      const stockList = await Promise.all(
        products.map(async (p) => {
          const { result } = await redisCommand(["GET", `stock:${p.id}`]);
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            inStock: result !== null ? result === "true" : p.inStock,
          };
        })
      );
      return NextResponse.json({ products: stockList });
    }

    // Update stock
    if (action === "update-stock") {
      const { productId, inStock } = body;
      await redisCommand(["SET", `stock:${productId}`, String(inStock)]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
