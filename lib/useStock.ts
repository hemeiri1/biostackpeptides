"use client";

import { useState, useEffect } from "react";

interface SizeStock {
  label: string;
  quantity: number;
}

interface ProductStockData {
  inStock: boolean;
  sizes: SizeStock[];
}

interface StockStatus {
  [productId: string]: ProductStockData;
}

let cachedStock: StockStatus | null = null;

export function useStock() {
  const [stock, setStock] = useState<StockStatus>(cachedStock || {});

  useEffect(() => {
    if (cachedStock) return;
    fetch("/api/inventory", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { id: string; inStock: boolean; sizes: SizeStock[] }[]) => {
        const stockMap: StockStatus = {};
        data.forEach((p) => {
          stockMap[p.id] = { inStock: p.inStock, sizes: p.sizes || [] };
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

  function isSizeInStock(productId: string, sizeLabel: string): boolean {
    if (productId in stock) {
      const size = stock[productId].sizes.find((s) => s.label === sizeLabel);
      if (size) return size.quantity > 0;
    }
    return true; // default to in stock
  }

  function getSizeQuantity(productId: string, sizeLabel: string): number {
    if (productId in stock) {
      const size = stock[productId].sizes.find((s) => s.label === sizeLabel);
      if (size) return size.quantity;
    }
    return 10;
  }

  return { isInStock, isSizeInStock, getSizeQuantity };
}
