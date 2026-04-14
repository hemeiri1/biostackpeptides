"use client";

import { useState, useEffect } from "react";
import { Package, Check, X, Save, AlertTriangle } from "lucide-react";

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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  function toggleStock(id: string) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products),
      });
      setSaved(true);
    } catch {
      alert("Failed to save. Try again.");
    }
    setSaving(false);
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
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-cyan" />
            Inventory Manager
          </h1>
          <p className="text-brand-muted text-sm mt-1">
            Toggle product stock status. Changes apply instantly to the website.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
            saved
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-brand-cyan text-white hover:bg-brand-cyan/90"
          } disabled:opacity-60`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </>
          )}
        </button>
      </div>

      {/* Out of stock alert */}
      {outOfStock.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-800 font-medium text-sm">
              {outOfStock.length} product{outOfStock.length > 1 ? "s" : ""} marked as out of stock
            </p>
            <p className="text-yellow-600 text-xs mt-1">
              {outOfStock.map((p) => p.name).join(", ")}
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
              product.inStock
                ? "bg-white border-brand-border"
                : "bg-red-50/50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <div>
                <p className="text-gray-900 font-medium text-sm">{product.name}</p>
                <p className="text-brand-muted text-xs">{product.salesCount} total sales tracked</p>
              </div>
            </div>

            <button
              onClick={() => toggleStock(product.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                product.inStock
                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                  : "bg-red-50 text-red-700 border-red-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
              }`}
            >
              {product.inStock ? (
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

      <p className="text-center text-brand-muted text-xs mt-8">
        Inventory Agent monitors these statuses and alerts the Overseer when products go out of stock.
      </p>
    </div>
  );
}
