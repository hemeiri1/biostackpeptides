import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend("re_UERzjhTv_AsudSTaXQM8HFYwXn3DJ369f");

export async function POST(req: Request) {
  try {
    const { orderId, customerEmail, customerName, items, total, discountPercent } = await req.json();

    if (!customerEmail) return NextResponse.json({ success: false, message: "No email" });

    const itemRows = items
      .map((item: any) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333;">${item.name}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #666; text-align: center;">${item.size}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #666; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: right; font-weight: 600;">AED ${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `)
      .join("");

    await resend.emails.send({
      from: "BioStack Peptides <noreply@biostackpeptide.com>",
      to: customerEmail,
      subject: `Order Confirmed — ${orderId}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1B3A5C; font-size: 24px; margin: 0;">BioStack Peptides</h1>
            <p style="color: #5B9BD5; font-size: 12px; letter-spacing: 2px; margin: 4px 0 0;">PEPTIDES</p>
          </div>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <p style="color: #16a34a; font-size: 18px; font-weight: 700; margin: 0;">Order Confirmed!</p>
            <p style="color: #166534; font-size: 13px; margin: 6px 0 0;">Your order has been received and is being processed.</p>
          </div>

          <p style="color: #333; font-size: 15px; margin-bottom: 4px;">Hi ${customerName},</p>
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your purchase! Here are your order details:
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
            <div style="background: #1B3A5C; padding: 10px 12px;">
              <p style="color: white; font-size: 12px; font-weight: 600; margin: 0;">Order ${orderId}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f1f5f9;">
                  <th style="padding: 8px 12px; text-align: left; font-size: 11px; color: #64748b; font-weight: 600;">Product</th>
                  <th style="padding: 8px 12px; text-align: center; font-size: 11px; color: #64748b; font-weight: 600;">Size</th>
                  <th style="padding: 8px 12px; text-align: center; font-size: 11px; color: #64748b; font-weight: 600;">Qty</th>
                  <th style="padding: 8px 12px; text-align: right; font-size: 11px; color: #64748b; font-weight: 600;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>
            ${discountPercent > 0 ? `
              <div style="padding: 10px 12px; border-top: 1px solid #e2e8f0;">
                <p style="color: #16a34a; font-size: 13px; margin: 0;">Discount: ${discountPercent}% applied</p>
              </div>
            ` : ""}
            <div style="background: #1B3A5C; padding: 14px 12px; text-align: right;">
              <span style="color: #94a3b8; font-size: 12px;">Total: </span>
              <span style="color: white; font-size: 20px; font-weight: 800;">AED ${total.toFixed(2)}</span>
            </div>
          </div>

          <div style="background: #f0f7ff; border: 1px solid #d0e3f5; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="color: #1B3A5C; font-size: 14px; font-weight: 600; margin: 0 0 8px;">What's Next?</p>
            <p style="color: #555; font-size: 13px; margin: 0; line-height: 1.6;">
              • Your order will ship within 24 hours<br>
              • You'll receive a tracking number via email<br>
              • Delivery: 2-3 business days (UAE)
            </p>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://biostackpeptide.com/tracking" style="background: #0066FF; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
              Track Your Order
            </a>
          </div>

          <p style="color: #555; font-size: 13px; line-height: 1.6;">
            If you have any questions about your order, contact us at <a href="mailto:Contact@biostackpeptide.com" style="color: #0066FF;">Contact@biostackpeptide.com</a> or WhatsApp +1 (872) 366-1398.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="color: #999; font-size: 11px; text-align: center;">
            BioStack Peptides — Premium Research Peptides<br>
            biostackpeptide.com | Contact@biostackpeptide.com
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
