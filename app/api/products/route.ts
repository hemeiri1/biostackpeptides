import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const OVERRIDES_FILE = join(process.cwd(), "data", "product-overrides.json");

function getOverrides(): Record<string, { name?: string; sizes?: { label: string; price: number }[] }> {
  try {
    const data = readFileSync(OVERRIDES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveOverrides(overrides: Record<string, { name?: string; sizes?: { label: string; price: number }[] }>) {
  writeFileSync(OVERRIDES_FILE, JSON.stringify(overrides, null, 2));
}

export async function GET() {
  const { products } = await import("@/data/products");
  const overrides = getOverrides();

  const productList = products.map((p) => {
    const override = overrides[p.id];
    return {
      id: p.id,
      slug: p.slug,
      name: override?.name || p.name,
      price: override?.sizes ? override.sizes[0].price : p.price,
      sizes: override?.sizes || p.sizes,
    };
  });

  return NextResponse.json(productList);
}

export async function POST(req: Request) {
  const { id, name, sizes } = await req.json();

  const overrides = getOverrides();
  overrides[id] = { name, sizes };
  saveOverrides(overrides);

  return NextResponse.json({ success: true });
}
