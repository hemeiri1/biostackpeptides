"use client";

import { useState, useEffect } from "react";
import { Package, Check, X, AlertTriangle, RefreshCw, Minus, Plus } from "lucide-react";
import Link from "next/link";

interface ProductStock {
  id: string;
  slug: string;
  name: string;
  inStock: boolean;
  quantity: number;
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

  async function updateStock(id: string, quantity: number) {
    setSavingId(id);
    const inStock = quantity > 0;

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ id, inStock, quantity }]),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, inStock, quantity } : p))
        );
      }
    } catch {
      alert("Failed to update. Try again.");
    }
    setSavingId(null);
  }

  const outOfStock = products.filter((p) => !p.inStock || p.quantity === 0);
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= 3);

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
            Set stock quantities. Products with 0 stock show as &quot;Out of Stock&quot;.
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

      {/* Alerts */}
      {outOfStock.length > 0 && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium text-sm">
              {outOfStock.length} product{outOfStock.length > 1 ? "s" : ""} out of stock
            </p>
            <p className="text-red-600 text-xs mt-1">
              {outOfStock.map((p) => p.name).join(", ")}
            </p>
          </div>
        </div>
      )}
      {lowStock.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-800 font-medium text-sm">
              {lowStock.length} product{lowStock.length > 1 ? "s" : ""} low stock (≤3)
            </p>
            <p className="text-yellow-600 text-xs mt-1">
              {lowStock.map((p) => `${p.name} (${p.quantity})`).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Product list */}
      <div className="space-y-2">
        {products.map((product) => (
          <div
            key={product.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
              product.quantity === 0
                ? "bg-red-50/50 border-red-200"
                : product.quantity <= 3
                ? "bg-yellow-50/50 border-yellow-200"
                : "bg-white border-brand-border"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  product.quantity === 0 ? "bg-red-500" : product.quantity <= 3 ? "bg-yellow-500" : "bg-green-500"
                }`}
              />
              <div>
                <p className="text-gray-900 font-medium text-sm">{product.name}</p>
                <p className="text-brand-muted text-xs">
                  {product.quantity === 0 ? "Out of stock" : `${product.quantity} in stock`}
                  {" · "}{product.salesCount} sales
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Quantity controls */}
              <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-brand-border">
                <button
                  onClick={() => updateStock(product.id, Math.max(0, product.quantity - 1))}
                  disabled={savingId === product.id || product.quantity === 0}
                  className="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-red-500 transition-colors disabled:opacity-30"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => {
                    const val = Math.max(0, parseInt(e.target.value) || 0);
                    setProducts((prev) =>
                      prev.map((p) => (p.id === product.id ? { ...p, quantity: val } : p))
                    );
                  }}
                  onBlur={(e) => {
                    const val = Math.max(0, parseInt(e.target.value) || 0);
                    updateStock(product.id, val);
                  }}
                  className="w-12 h-8 text-center text-sm font-bold text-gray-900 bg-transparent border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => updateStock(product.id, product.quantity + 1)}
                  disabled={savingId === product.id}
                  className="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-green-500 transition-colors disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick set buttons */}
              <button
                onClick={() => updateStock(product.id, 0)}
                disabled={savingId === product.id}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                Set 0
              </button>
              <button
                onClick={() => updateStock(product.id, 10)}
                disabled={savingId === product.id}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-green-200 text-green-600 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                Set 10
              </button>

              {savingId === product.id && (
                <RefreshCw className="w-4 h-4 text-brand-cyan animate-spin" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
