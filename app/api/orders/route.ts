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

    // Decrease stock for each item purchased
    if (order.items && Array.isArray(order.items)) {
      const { products } = await import("@/data/products");
      for (const item of order.items) {
        const product = products.find((p) => p.name === item.name);
        if (product) {
          const sizeLabel = item.size;
          const { result: currentQty } = await redisCommand(["GET", `stock-size:${product.id}:${sizeLabel}`]);
          const qty = currentQty !== null ? parseInt(currentQty) : 10;
          const newQty = Math.max(0, qty - (item.quantity || 1));
          await redisCommand(["SET", `stock-size:${product.id}:${sizeLabel}`, String(newQty)]);
          // Update overall stock status
          if (newQty === 0) {
            await redisCommand(["SET", `stock:${product.id}`, "false"]);
          }
        }
      }
    }

    // Award loyalty points to logged-in user
    if (order.customerEmail || order.customerPhone) {
      try {
        // Find user by email or phone
        let userId = null;
        if (order.customerEmail) {
          const { result } = await redisCommand(["GET", `user-email:${order.customerEmail}`]);
          userId = result;
        }
        if (!userId && order.customerPhone) {
          const { result } = await redisCommand(["GET", `user-phone:${order.customerPhone}`]);
          userId = result;
        }

        if (userId) {
          const { result: userData } = await redisCommand(["GET", `user:${userId}`]);
          if (userData) {
            const user = JSON.parse(userData);
            const total = order.total || 0;

            // Check if order has a stack
            const stackSlugs = ["wolverine-stack", "glow-stack", "klow-stack", "cjc-ipamorelin"];
            const { products } = await import("@/data/products");
            const hasStack = order.items?.some((item: any) => {
              const p = products.find((pr) => pr.name === item.name);
              return p && stackSlugs.includes(p.slug);
            });

            // Calculate points: 1 point per AED 10 spent
            let points = Math.floor(total / 10);
            if (hasStack) points += 25;

            // Tier multiplier
            const tierMult = user.tier === "Gold" ? 2 : user.tier === "Silver" ? 1.5 : 1;
            points = Math.floor(points * tierMult);

            // Update user
            user.orderCount = (user.orderCount || 0) + 1;
            user.totalSpent = (user.totalSpent || 0) + total;
            user.loyaltyPoints = (user.loyaltyPoints || 0) + points;
            user.lastOrderDate = new Date().toISOString();

            // Monthly spend
            const currentMonth = new Date().toISOString().slice(0, 7);
            if (user.monthlySpentMonth !== currentMonth) {
              user.monthlySpent = 0;
              user.monthlySpentMonth = currentMonth;
            }
            user.monthlySpent = (user.monthlySpent || 0) + total;

            // Every 5 orders = AED 50 bonus
            if (user.orderCount % 5 === 0) {
              user.bonusCredit = (user.bonusCredit || 0) + 50;
            }

            // Monthly spend threshold: AED 1000+ = AED 75 bonus
            if (user.monthlySpent >= 1000 && (user.monthlySpent - total) < 1000) {
              user.bonusCredit = (user.bonusCredit || 0) + 75;
            }

            // Update tier
            if (user.totalSpent >= 3000) user.tier = "Gold";
            else if (user.totalSpent >= 1000) user.tier = "Silver";
            else user.tier = "Bronze";

            // Save updated user
            await redisCommand(["SET", `user:${userId}`, JSON.stringify(user)]);
          }
        }
      } catch {}
    }

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
