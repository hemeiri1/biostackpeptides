"use client";

import { useState, useEffect } from "react";

interface StockStatus {
  [productId: string]: boolean;
}

let cachedStock: StockStatus | null = null;

export function useStock() {
  const [stock, setStock] = useState<StockStatus>(cachedStock || {});

  useEffect(() => {
    if (cachedStock) return;
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data: { id: string; inStock: boolean }[]) => {
        const stockMap: StockStatus = {};
        data.forEach((p) => {
          stockMap[p.id] = p.inStock;
        });
        cachedStock = stockMap;
        setStock(stockMap);
      })
      .catch(() => {});
  }, []);

  function isInStock(productId: string, defaultValue: boolean): boolean {
    if (productId in stock) return stock[productId];
    return defaultValue;
  }

  return { isInStock };
}
