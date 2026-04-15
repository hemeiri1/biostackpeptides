import { NextResponse } from "next/server";
import { Resend } from "resend";

const ZIINA_API_KEY = "2hTgHTIkXp/Srka6rbvNSJlrnjNUYd7jPyKgSjcTye9XlnGDPt9+Ulh5HzeI4mm4";
const resend = new Resend("re_UERzjhTv_AsudSTaXQM8HFYwXn3DJ369f");

export async function POST(req: Request) {
  try {
    const { items, total, discountPercent, customerName, customerEmail, customerPhone } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" });
    }

    // Build order description
    const description = items
      .map((item: any) => `${item.name} (${item.size}) x${item.quantity}`)
      .join(", ");

    // Amount in fils (1 AED = 100 fils)
    const amountInFils = Math.round(total * 100);

    const res = await fetch("https://api-v2.ziina.com/api/payment_intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ZIINA_API_KEY}`,
      },
      body: JSON.stringify({
        amount: amountInFils,
        currency_code: "AED",
        message: `BioStack Peptides Order: ${description}`,
        success_url: "https://biostackpeptide.com/checkout/success",
        cancel_url: "https://biostackpeptide.com/cart",
        test: false,
      }),
    });

    const data = await res.json();

    if (data.redirect_url) {
      // Send order notification email to you
      const itemRows = items
        .map((item: any) => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.size}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">AED ${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `)
        .join("");

      await resend.emails.send({
        from: "BioStack Peptides <onboarding@resend.dev>",
        to: "Contact@biostackpeptide.com",
        subject: `New Order — AED ${total.toFixed(2)}`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 30px 20px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #1B3A5C; font-size: 22px; margin: 0;">New Order Received!</h1>
              <p style="color: #888; font-size: 13px; margin: 4px 0 0;">${new Date().toLocaleString("en-AE", { timeZone: "Asia/Dubai" })}</p>
            </div>

            ${customerName || customerEmail || customerPhone ? `
              <div style="background: #f8f9fa; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
                <p style="color: #1B3A5C; font-size: 13px; font-weight: 600; margin: 0 0 6px;">Customer</p>
                ${customerName ? `<p style="color: #555; font-size: 13px; margin: 2px 0;">Name: ${customerName}</p>` : ""}
                ${customerEmail ? `<p style="color: #555; font-size: 13px; margin: 2px 0;">Email: ${customerEmail}</p>` : ""}
                ${customerPhone ? `<p style="color: #555; font-size: 13px; margin: 2px 0;">Phone: ${customerPhone}</p>` : ""}
              </div>
            ` : ""}

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #333;">
              <thead>
                <tr style="background: #f0f7ff;">
                  <th style="padding: 8px; text-align: left;">Product</th>
                  <th style="padding: 8px; text-align: left;">Size</th>
                  <th style="padding: 8px; text-align: center;">Qty</th>
                  <th style="padding: 8px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>

            ${discountPercent > 0 ? `
              <p style="color: #16a34a; font-size: 13px; margin: 12px 0 0;">Discount: ${discountPercent}% applied</p>
            ` : ""}

            <div style="background: #1B3A5C; border-radius: 8px; padding: 16px; margin-top: 16px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">Total</p>
              <p style="color: white; font-size: 28px; font-weight: 800; margin: 4px 0 0;">AED ${total.toFixed(2)}</p>
            </div>

            <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">
              Payment via Ziina — Check your Ziina dashboard for payment status
            </p>
          </div>
        `,
      }).catch(() => {});

      return NextResponse.json({ success: true, url: data.redirect_url });
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || "Payment creation failed",
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
