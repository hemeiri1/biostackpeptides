"use client";

import { useState, useEffect } from "react";

interface StockData {
  inStock: boolean;
  quantity: number;
}

interface StockStatus {
  [productId: string]: StockData;
}

let cachedStock: StockStatus | null = null;

export function useStock() {
  const [stock, setStock] = useState<StockStatus>(cachedStock || {});

  useEffect(() => {
    if (cachedStock) return;
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data: { id: string; inStock: boolean; quantity: number }[]) => {
        const stockMap: StockStatus = {};
        data.forEach((p) => {
          stockMap[p.id] = { inStock: p.inStock, quantity: p.quantity };
        });
        cachedStock = stockMap;
        setStock(stockMap);
      })
      .catch(() => {});
  }, []);

  function isInStock(productId: string, defaultValue: boolean): boolean {
    if (productId in stock) return stock[productId].inStock;
    return defaultValue;
  }

  function getQuantity(productId: string): number {
    if (productId in stock) return stock[productId].quantity;
    return 10;
  }

  return { isInStock, getQuantity };
}
