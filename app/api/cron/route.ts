import { NextResponse } from "next/server";
import { Resend } from "resend";

const UPSTASH_URL = "https://devoted-gorilla-69499.upstash.io";
const UPSTASH_TOKEN = "gQAAAAAAAQ97AAIncDE2Y2VlODA1ZDJhOWQ0MGQ2Yjg0NWIzMWQyNmQzYjE5YXAxNjk0OTk";
const resend = new Resend("re_UERzjhTv_AsudSTaXQM8HFYwXn3DJ369f");

async function redisCommand(command: string[]) {
  const res = await fetch(`${UPSTASH_URL}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  return res.json();
}

// This endpoint is called by Vercel Cron or external cron service
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const task = searchParams.get("task");
  const secret = searchParams.get("secret");

  // Security check
  if (secret !== "bsp-cron-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ========== TASK: Check for new orders (every 15 min) ==========
    if (task === "new-orders") {
      const lastCheck = await redisCommand(["GET", "cron:last-order-check"]);
      const since = lastCheck.result || new Date(Date.now() - 15 * 60 * 1000).toISOString();

      const { result: orderIds } = await redisCommand(["LRANGE", "orders:list", "0", "19"]);
      if (!orderIds || orderIds.length === 0) {
        await redisCommand(["SET", "cron:last-order-check", new Date().toISOString()]);
        return NextResponse.json({ message: "No orders", newOrders: 0 });
      }

      const orders = await Promise.all(
        orderIds.map(async (id: string) => {
          const { result } = await redisCommand(["GET", `order:${id}`]);
          return result ? JSON.parse(result) : null;
        })
      );

      const newOrders = orders.filter(Boolean).filter((o: any) => new Date(o.createdAt) > new Date(since));

      if (newOrders.length > 0) {
        const orderRows = newOrders.map((o: any) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #eee;font-size:13px;">${o.id}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;font-size:13px;">${o.customerName}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;font-size:13px;">${o.customerPhone || "-"}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;font-size:13px;">${o.items?.length || 0} items</td>
            <td style="padding:8px;border-bottom:1px solid #eee;font-size:13px;font-weight:700;">AED ${o.total?.toFixed(2)}</td>
          </tr>
        `).join("");

        await resend.emails.send({
          from: "BioStack Peptides <noreply@biostackpeptide.com>",
          to: "Contact@biostackpeptide.com",
          subject: `🔔 ${newOrders.length} New Order${newOrders.length > 1 ? "s" : ""} — AED ${newOrders.reduce((s: number, o: any) => s + (o.total || 0), 0).toFixed(0)}`,
          html: `
            <div style="font-family:system-ui;max-width:500px;margin:0 auto;padding:20px;">
              <h2 style="color:#1B3A5C;margin:0 0 16px;">New Order Alert</h2>
              <table style="width:100%;border-collapse:collapse;">
                <thead><tr style="background:#f1f5f9;">
                  <th style="padding:8px;text-align:left;font-size:11px;color:#64748b;">Order</th>
                  <th style="padding:8px;text-align:left;font-size:11px;color:#64748b;">Customer</th>
                  <th style="padding:8px;text-align:left;font-size:11px;color:#64748b;">Phone</th>
                  <th style="padding:8px;text-align:left;font-size:11px;color:#64748b;">Items</th>
                  <th style="padding:8px;text-align:left;font-size:11px;color:#64748b;">Total</th>
                </tr></thead>
                <tbody>${orderRows}</tbody>
              </table>
              <p style="font-size:12px;color:#888;margin-top:16px;">
                <a href="https://biostackpeptide.com/admin/orders" style="color:#0066FF;">View in Admin Panel →</a>
              </p>
            </div>
          `,
        });
      }

      await redisCommand(["SET", "cron:last-order-check", new Date().toISOString()]);
      return NextResponse.json({ message: "Checked", newOrders: newOrders.length });
    }

    // ========== TASK: Daily stats report (once per day) ==========
    if (task === "daily-report") {
      const { result: orderIds } = await redisCommand(["LRANGE", "orders:list", "0", "999"]);
      const orders = orderIds
        ? await Promise.all(orderIds.map(async (id: string) => {
            const { result } = await redisCommand(["GET", `order:${id}`]);
            return result ? JSON.parse(result) : null;
          }))
        : [];

      const validOrders = orders.filter(Boolean);
      const today = new Date().toISOString().slice(0, 10);
      const todayOrders = validOrders.filter((o: any) => o.createdAt?.startsWith(today));
      const totalRevenue = validOrders.reduce((s: number, o: any) => s + (o.total || 0), 0);
      const todayRevenue = todayOrders.reduce((s: number, o: any) => s + (o.total || 0), 0);
      const { result: subCount } = await redisCommand(["SCARD", "newsletter-subscribers"]);

      await resend.emails.send({
        from: "BioStack Peptides <noreply@biostackpeptide.com>",
        to: "Contact@biostackpeptide.com",
        subject: `📊 Daily Report — ${today}`,
        html: `
          <div style="font-family:system-ui;max-width:500px;margin:0 auto;padding:20px;">
            <h2 style="color:#1B3A5C;margin:0 0 20px;">Daily Business Report</h2>
            <div style="display:flex;gap:12px;margin-bottom:20px;">
              <div style="flex:1;background:#f0f7ff;border-radius:12px;padding:16px;text-align:center;">
                <p style="font-size:24px;font-weight:800;color:#1B3A5C;margin:0;">${todayOrders.length}</p>
                <p style="font-size:11px;color:#64748b;margin:4px 0 0;">Today's Orders</p>
              </div>
              <div style="flex:1;background:#f0fdf4;border-radius:12px;padding:16px;text-align:center;">
                <p style="font-size:24px;font-weight:800;color:#16a34a;margin:0;">AED ${todayRevenue.toFixed(0)}</p>
                <p style="font-size:11px;color:#64748b;margin:4px 0 0;">Today's Revenue</p>
              </div>
            </div>
            <table style="width:100%;font-size:13px;color:#333;">
              <tr><td style="padding:6px 0;">Total Orders (all time)</td><td style="text-align:right;font-weight:600;">${validOrders.length}</td></tr>
              <tr><td style="padding:6px 0;">Total Revenue (all time)</td><td style="text-align:right;font-weight:600;">AED ${totalRevenue.toFixed(0)}</td></tr>
              <tr><td style="padding:6px 0;">Pending Orders</td><td style="text-align:right;font-weight:600;">${validOrders.filter((o: any) => o.status === "pending").length}</td></tr>
              <tr><td style="padding:6px 0;">Newsletter Subscribers</td><td style="text-align:right;font-weight:600;">${subCount || 0}</td></tr>
            </table>
            <p style="font-size:12px;color:#888;margin-top:16px;">
              <a href="https://biostackpeptide.com/admin" style="color:#0066FF;">Open Admin Panel →</a>
            </p>
          </div>
        `,
      });

      return NextResponse.json({ message: "Daily report sent" });
    }

    // ========== TASK: Follow-up emails (3 days after order) ==========
    if (task === "follow-up") {
      const { result: orderIds } = await redisCommand(["LRANGE", "orders:list", "0", "99"]);
      if (!orderIds) return NextResponse.json({ message: "No orders", followUps: 0 });

      const orders = await Promise.all(
        orderIds.map(async (id: string) => {
          const { result } = await redisCommand(["GET", `order:${id}`]);
          return result ? JSON.parse(result) : null;
        })
      );

      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
      let sent = 0;

      for (const order of orders.filter(Boolean)) {
        const orderDate = new Date(order.createdAt);
        // Only send for orders placed 3-4 days ago that haven't been followed up
        if (orderDate > fourDaysAgo && orderDate < threeDaysAgo && order.customerEmail && !order.followUpSent) {
          await resend.emails.send({
            from: "BioStack Peptides <noreply@biostackpeptide.com>",
            to: order.customerEmail,
            subject: "How was your BioStack order?",
            html: `
              <div style="font-family:system-ui;max-width:480px;margin:0 auto;padding:40px 20px;">
                <h1 style="color:#1B3A5C;font-size:22px;">How was your order?</h1>
                <p style="color:#555;font-size:14px;line-height:1.6;">
                  Hi ${order.customerName},<br><br>
                  We hope your BioStack Peptides order arrived safely! We'd love to hear about your experience.
                </p>
                <div style="text-align:center;margin:24px 0;">
                  <a href="https://biostackpeptide.com/products" style="background:#0066FF;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;">
                    Leave a Review
                  </a>
                </div>
                <p style="color:#555;font-size:13px;">
                  Use code <strong>COMEBACK10</strong> for 10% off your next order!
                </p>
                <hr style="border:none;border-top:1px solid #eee;margin:30px 0;" />
                <p style="color:#999;font-size:11px;text-align:center;">
                  BioStack Peptides — biostackpeptide.com
                </p>
              </div>
            `,
          });

          // Mark as followed up
          order.followUpSent = true;
          await redisCommand(["SET", `order:${order.id}`, JSON.stringify(order)]);
          sent++;
        }
      }

      return NextResponse.json({ message: "Follow-ups processed", sent });
    }

    // ========== TASK: Low stock alert ==========
    if (task === "stock-alert") {
      const { products } = await import("@/data/products");
      const outOfStock = [];

      for (const p of products) {
        const { result } = await redisCommand(["GET", `stock:${p.id}`]);
        if (result === "false") {
          outOfStock.push(p.name);
        }
      }

      if (outOfStock.length > 0) {
        await resend.emails.send({
          from: "BioStack Peptides <noreply@biostackpeptide.com>",
          to: "Contact@biostackpeptide.com",
          subject: `⚠️ ${outOfStock.length} Product${outOfStock.length > 1 ? "s" : ""} Out of Stock`,
          html: `
            <div style="font-family:system-ui;max-width:480px;margin:0 auto;padding:20px;">
              <h2 style="color:#1B3A5C;">Stock Alert</h2>
              <p style="color:#555;font-size:14px;">The following products are marked as out of stock:</p>
              <ul style="color:#333;font-size:14px;">
                ${outOfStock.map((n) => `<li style="padding:4px 0;">${n}</li>`).join("")}
              </ul>
              <p style="font-size:12px;color:#888;margin-top:16px;">
                <a href="https://biostackpeptide.com/admin/inventory" style="color:#0066FF;">Manage Inventory →</a>
              </p>
            </div>
          `,
        });
      }

      return NextResponse.json({ message: "Stock check done", outOfStock: outOfStock.length });
    }

    // Run all tasks at once (for Hobby plan — one daily cron)
    if (task === "all") {
      const baseUrl = req.url.split("/api/cron")[0];
      const tasks = ["new-orders", "daily-report", "follow-up", "stock-alert"];
      const results: Record<string, any> = {};
      for (const t of tasks) {
        try {
          const res = await fetch(`${baseUrl}/api/cron?task=${t}&secret=bsp-cron-2026`);
          results[t] = await res.json();
        } catch (e: any) {
          results[t] = { error: e.message };
        }
      }
      return NextResponse.json({ message: "All tasks completed", results });
    }

    return NextResponse.json({ error: "Unknown task" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
