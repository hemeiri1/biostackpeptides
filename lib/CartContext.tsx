"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  size: string;
  sizePrice: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load cart from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("biostack-cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.map((item: any) => ({
              ...item,
              sizePrice: item.sizePrice || item.product?.price || 0,
              quantity: item.quantity || 1,
            }))
          );
        }
      }
    } catch {
      // Corrupted data — start fresh
      localStorage.removeItem("biostack-cart");
    }
    setLoaded(true);
  }, []);

  // Save cart to localStorage on change (only after initial load)
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("biostack-cart", JSON.stringify(items));
    }
  }, [items, loaded]);

  const addToCart = useCallback((product: Product, size: string) => {
    const sizeObj = product.sizes.find((s) => s.label === size);
    const sizePrice = sizeObj ? sizeObj.price : product.price;
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.size === size
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, size, sizePrice, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.size === size))
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, size);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId && i.size === size
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalBeforeGift = items
    .filter(i => !i.product.id.startsWith("FREE-"))
    .reduce((sum, i) => sum + (i.sizePrice || 0) * i.quantity, 0);

  // Free BAC Water 3ml for orders over 500 AED
  const FREE_BAC_WATER_ID = "FREE-BAC-WATER";
  const qualifiesForFreeGift = subtotalBeforeGift >= 500;
  const hasFreeGift = items.some(i => i.product.id === FREE_BAC_WATER_ID);

  useEffect(() => {
    if (!loaded) return;
    if (qualifiesForFreeGift && !hasFreeGift) {
      setItems(prev => [
        ...prev,
        {
          product: {
            id: FREE_BAC_WATER_ID,
            slug: "bac-water",
            name: "Bacteriostatic Water 3ml",
            shortName: "BAC Water (FREE)",
            category: "Accessories",
            price: 0,
            sizes: [{ label: "3ml", price: 0 }],
            defaultSize: "3ml",
            description: "FREE gift — orders over 500 AED",
            longDescription: "",
            benefits: [],
            usage: "",
            storage: "",
            inStock: true,
            featured: false,
            image: "/images/bacwater.jpg",
            salesCount: 0,
          } as any,
          size: "3ml",
          sizePrice: 0,
          quantity: 1,
        },
      ]);
    } else if (!qualifiesForFreeGift && hasFreeGift) {
      setItems(prev => prev.filter(i => i.product.id !== FREE_BAC_WATER_ID));
    }
  }, [qualifiesForFreeGift, hasFreeGift, loaded]);

  const totalPrice = items.reduce(
    (sum, i) => sum + (i.sizePrice || 0) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
