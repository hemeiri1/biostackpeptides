"use client";

import { useState, useEffect } from "react";
import { Package, AlertTriangle, RefreshCw, Minus, Plus } from "lucide-react";
import Link from "next/link";

interface SizeStock {
  label: string;
  quantity: number;
}

interface ProductStock {
  id: string;
  name: string;
  sizes: SizeStock[];
}

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/inventory", { cache: "no-store" });
      const data = await res.json();
      setProducts(data);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { fetchProducts(); }, []);

  async function updateSizeStock(productId: string, sizeLabel: string, quantity: number) {
    const key = `${productId}-${sizeLabel}`;
    setSavingKey(key);

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, sizeLabel, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, sizes: p.sizes.map((s) => s.label === sizeLabel ? { ...s, quantity } : s) }
              : p
          )
        );
      }
    } catch {
      alert("Failed to update. Try again.");
    }
    setSavingKey(null);
  }

  const outOfStockItems: string[] = [];
  const lowStockItems: string[] = [];
  products.forEach((p) => {
    p.sizes.forEach((s) => {
      if (s.quantity === 0) outOfStockItems.push(`${p.name} ${s.label}`);
      else if (s.quantity <= 3) lowStockItems.push(`${p.name} ${s.label} (${s.quantity})`);
    });
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full mx-auto" />
        <p className="text-brand-muted mt-4">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-brand-muted hover:text-gray-900 text-sm flex items-center gap-1 mb-2">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-cyan" />
            Inventory Manager
          </h1>
          <p className="text-brand-muted text-sm mt-1">
            Set stock per size. 0 = Out of Stock.
          </p>
        </div>
        <button
          onClick={fetchProducts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-cyan text-white text-sm font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {outOfStockItems.length > 0 && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium text-sm">{outOfStockItems.length} out of stock</p>
            <p className="text-red-600 text-xs mt-1">{outOfStockItems.join(", ")}</p>
          </div>
        </div>
      )}
      {lowStockItems.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-800 font-medium text-sm">{lowStockItems.length} low stock</p>
            <p className="text-yellow-600 text-xs mt-1">{lowStockItems.join(", ")}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="rounded-xl border border-brand-border bg-white overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-brand-border">
              <p className="text-gray-900 font-semibold text-sm">{product.name}</p>
            </div>
            <div className="divide-y divide-brand-border">
              {product.sizes.map((size) => {
                const key = `${product.id}-${size.label}`;
                const isSaving = savingKey === key;
                return (
                  <div key={size.label} className={`flex items-center justify-between px-4 py-3 ${size.quantity === 0 ? "bg-red-50/50" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${size.quantity === 0 ? "bg-red-500" : size.quantity <= 3 ? "bg-yellow-500" : "bg-green-500"}`} />
                      <div>
                        <p className="text-gray-900 text-sm font-medium">{size.label}</p>
                        <p className="text-brand-muted text-xs">
                          {size.quantity === 0 ? "Out of stock" : `${size.quantity} in stock`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-brand-border">
                        <button
                          onClick={() => updateSizeStock(product.id, size.label, Math.max(0, size.quantity - 1))}
                          disabled={isSaving || size.quantity === 0}
                          className="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-red-500 transition-colors disabled:opacity-30"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          value={size.quantity}
                          onChange={(e) => {
                            const val = Math.max(0, parseInt(e.target.value) || 0);
                            setProducts((prev) =>
                              prev.map((p) =>
                                p.id === product.id
                                  ? { ...p, sizes: p.sizes.map((s) => s.label === size.label ? { ...s, quantity: val } : s) }
                                  : p
                              )
                            );
                          }}
                          onBlur={(e) => {
                            const val = Math.max(0, parseInt(e.target.value) || 0);
                            updateSizeStock(product.id, size.label, val);
                          }}
                          className="w-12 h-8 text-center text-sm font-bold text-gray-900 bg-transparent border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          onClick={() => updateSizeStock(product.id, size.label, size.quantity + 1)}
                          disabled={isSaving}
                          className="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-green-500 transition-colors disabled:opacity-30"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {isSaving && <RefreshCw className="w-4 h-4 text-brand-cyan animate-spin" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
