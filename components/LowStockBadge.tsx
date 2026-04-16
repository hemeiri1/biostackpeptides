"use client";

import { useEffect, useState } from "react";

// Generates a consistent "low stock" number for each product
function getStockCount(productId: string): number {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = productId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 5) + 2; // 2-6 left
}

export default function LowStockBadge({ productId }: { productId: string }) {
  const [show, setShow] = useState(false);
  const count = getStockCount(productId);

  useEffect(() => {
    // Show on ~40% of products randomly but consistently
    const shouldShow = getStockCount(productId + "show") > 3;
    setShow(shouldShow);
  }, [productId]);

  if (!show) return null;

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
      <span className="text-orange-600 text-[11px] font-semibold">Only {count} left in stock</span>
    </div>
  );
}
