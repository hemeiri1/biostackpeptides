"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { products } from "@/data/products";
import { useCurrency } from "@/lib/CurrencyContext";
import VialImage from "@/components/VialImage";

export function trackProductView(slug: string) {
  try {
    const viewed = JSON.parse(localStorage.getItem("biostack-recently-viewed") || "[]");
    const filtered = viewed.filter((s: string) => s !== slug);
    filtered.unshift(slug);
    localStorage.setItem("biostack-recently-viewed", JSON.stringify(filtered.slice(0, 8)));
  } catch {}
}

export default function RecentlyViewed({ currentSlug }: { currentSlug?: string }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const { format } = useCurrency();

  useEffect(() => {
    try {
      const viewed = JSON.parse(localStorage.getItem("biostack-recently-viewed") || "[]");
      setSlugs(viewed.filter((s: string) => s !== currentSlug).slice(0, 4));
    } catch {}
  }, [currentSlug]);

  const recentProducts = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean) as typeof products;

  if (recentProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h3 className="text-lg font-bold text-[#1B3A5C] mb-6">Recently Viewed</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {recentProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="group">
            <div className="rounded-xl border border-[#e8edf2] bg-white overflow-hidden hover:border-brand-cyan/40 hover:shadow-md transition-all">
              <div className="bg-gradient-to-b from-slate-50 to-white h-32 flex items-center justify-center p-3">
                <VialImage name={product.shortName} size="" slug={product.slug} className="h-28 group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-[#1B3A5C] truncate">{product.name}</p>
                <p className="text-xs text-brand-cyan font-bold">{format(product.price)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
