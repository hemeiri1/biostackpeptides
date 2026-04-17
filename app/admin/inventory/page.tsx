"use client";

import { useState, useEffect } from "react";
import { Package, Check, X, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

interface ProductStock {
  id: string;
  slug: string;
  name: string;
  inStock: boolean;
  salesCount: number;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

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

  async function toggleStock(id: string, currentStatus: boolean) {
    setSavingId(id);
    const newStatus = !currentStatus;

    // Update UI immediately
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: newStatus } : p))
    );

    // Save to Redis
    try {
      await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ id, inStock: newStatus }]),
      });
    } catch {
      // Revert on error
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, inStock: currentStatus } : p))
      );
      alert("Failed to update. Try again.");
    }
    setSavingId(null);
  }

  const outOfStock = products.filter((p) => !p.inStock);

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
            Toggle stock status. Changes save instantly.
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

      {outOfStock.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-800 font-medium text-sm">
              {outOfStock.length} product{outOfStock.length > 1 ? "s" : ""} out of stock
            </p>
            <p className="text-yellow-600 text-xs mt-1">
              {outOfStock.map((p) => p.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {products.map((product) => (
          <div
            key={product.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
              product.inStock
                ? "bg-white border-brand-border"
                : "bg-red-50/50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <div>
                <p className="text-gray-900 font-medium text-sm">{product.name}</p>
                <p className="text-brand-muted text-xs">{product.salesCount} sales</p>
              </div>
            </div>

            <button
              onClick={() => toggleStock(product.id, product.inStock)}
              disabled={savingId === product.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${
                product.inStock
                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                  : "bg-red-50 text-red-700 border-red-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
              }`}
            >
              {savingId === product.id ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : product.inStock ? (
                <>
                  <Check className="w-3 h-3" />
                  In Stock
                </>
              ) : (
                <>
                  <X className="w-3 h-3" />
                  Out of Stock
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
