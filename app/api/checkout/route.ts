import { NextResponse } from "next/server";

const ZIINA_API_KEY = "2hTgHTIkXp/Srka6rbvNSJlrnjNUYd7jPyKgSjcTye9XlnGDPt9+Ulh5HzeI4mm4";

export async function POST(req: Request) {
  try {
    const { items, total, discountPercent } = await req.json();

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
