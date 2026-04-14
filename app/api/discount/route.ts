import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DISCOUNT_FILE = join(process.cwd(), "data", "discounts.json");

interface DiscountCode {
  discount: number;
  maxUses: number;
  usedCount: number;
}

function getDiscounts(): Record<string, DiscountCode> {
  try {
    const data = readFileSync(DISCOUNT_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveDiscounts(discounts: Record<string, DiscountCode>) {
  writeFileSync(DISCOUNT_FILE, JSON.stringify(discounts, null, 2));
}

// POST — validate and apply a discount code
export async function POST(req: Request) {
  const { code } = await req.json();
  const upperCode = (code || "").trim().toUpperCase();

  const discounts = getDiscounts();
  const discount = discounts[upperCode];

  if (!discount) {
    return NextResponse.json({ valid: false, message: "Invalid discount code" });
  }

  if (discount.usedCount >= discount.maxUses) {
    return NextResponse.json({ valid: false, message: "This code has expired" });
  }

  // Increment usage
  discount.usedCount++;
  saveDiscounts(discounts);

  return NextResponse.json({
    valid: true,
    discount: discount.discount,
    message: `${discount.discount}% discount applied!`,
    remaining: discount.maxUses - discount.usedCount,
  });
}
