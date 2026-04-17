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

export async function POST(req: Request) {
  const { action, page, event, productId, productName } = await req.json();

  const today = new Date().toISOString().slice(0, 10);
  const hour = new Date().getHours();

  try {
    if (action === "pageview") {
      // Track daily page views
      await redisCommand(["HINCRBY", `analytics:pageviews:${today}`, page || "/", "1"]);
      // Track total views
      await redisCommand(["INCR", `analytics:total-views:${today}`]);
      // Track unique visitors (approximate by IP or session)
      await redisCommand(["INCR", `analytics:hourly:${today}:${hour}`]);
      return NextResponse.json({ success: true });
    }

    if (action === "event") {
      // Track events: add_to_cart, checkout, purchase, signup
      await redisCommand(["HINCRBY", `analytics:events:${today}`, event, "1"]);
      if (productId) {
        await redisCommand(["HINCRBY", `analytics:product-views:${today}`, productId, "1"]);
      }
      return NextResponse.json({ success: true });
    }

    if (action === "get-stats") {
      // Get today and last 7 days
      const days: string[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
      }

      const dailyViews: { date: string; views: number }[] = [];
      const dailyEvents: { date: string; events: Record<string, number> }[] = [];

      for (const day of days) {
        const { result: views } = await redisCommand(["GET", `analytics:total-views:${day}`]);
        dailyViews.push({ date: day, views: parseInt(views) || 0 });

        const { result: events } = await redisCommand(["HGETALL", `analytics:events:${day}`]);
        const eventMap: Record<string, number> = {};
        if (events) {
          for (let i = 0; i < events.length; i += 2) {
            eventMap[events[i]] = parseInt(events[i + 1]) || 0;
          }
        }
        dailyEvents.push({ date: day, events: eventMap });
      }

      // Today's page breakdown
      const { result: todayPages } = await redisCommand(["HGETALL", `analytics:pageviews:${today}`]);
      const pageBreakdown: Record<string, number> = {};
      if (todayPages) {
        for (let i = 0; i < todayPages.length; i += 2) {
          pageBreakdown[todayPages[i]] = parseInt(todayPages[i + 1]) || 0;
        }
      }

      // Today's product views
      const { result: productViews } = await redisCommand(["HGETALL", `analytics:product-views:${today}`]);
      const productBreakdown: Record<string, number> = {};
      if (productViews) {
        for (let i = 0; i < productViews.length; i += 2) {
          productBreakdown[productViews[i]] = parseInt(productViews[i + 1]) || 0;
        }
      }

      // Orders data
      const { result: orderIds } = await redisCommand(["LRANGE", "orders:list", "0", "999"]);
      let totalOrders = 0;
      let totalRevenue = 0;
      let todayOrders = 0;
      let todayRevenue = 0;

      if (orderIds) {
        for (const id of orderIds) {
          const { result } = await redisCommand(["GET", `order:${id}`]);
          if (result) {
            const order = JSON.parse(result);
            totalOrders++;
            totalRevenue += order.total || 0;
            if (order.createdAt?.startsWith(today)) {
              todayOrders++;
              todayRevenue += order.total || 0;
            }
          }
        }
      }

      // Subscribers
      const { result: subCount } = await redisCommand(["SCARD", "newsletter-subscribers"]);

      return NextResponse.json({
        dailyViews,
        dailyEvents,
        pageBreakdown,
        productBreakdown,
        totalOrders,
        totalRevenue,
        todayOrders,
        todayRevenue,
        subscribers: parseInt(subCount) || 0,
      });
    }

    return NextResponse.json({ error: "Unknown action" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
