"use client";

import { useState, useEffect } from "react";

interface ProductOverride {
  id: string;
  name: string;
  price: number;
  sizes: { label: string; price: number }[];
}

let cachedProducts: ProductOverride[] | null = null;

export function useProducts() {
  const [overrides, setOverrides] = useState<ProductOverride[]>(cachedProducts || []);

  useEffect(() => {
    if (cachedProducts) return;
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: ProductOverride[]) => {
        cachedProducts = data;
        setOverrides(data);
      })
      .catch(() => {});
  }, []);

  function getProductSizes(productId: string, defaultSizes: { label: string; price: number }[]) {
    const override = overrides.find((p) => p.id === productId);
    return override?.sizes || defaultSizes;
  }

  function getProductName(productId: string, defaultName: string) {
    const override = overrides.find((p) => p.id === productId);
    return override?.name || defaultName;
  }

  return { getProductSizes, getProductName };
}
