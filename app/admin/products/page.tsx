"use client";

import { useState, useEffect } from "react";
import { Pencil, Save, Check, X } from "lucide-react";

interface EditableProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  sizes: { label: string; price: number }[];
}

export default function ProductEditorPage() {
  const [products, setProducts] = useState<EditableProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSizes, setEditSizes] = useState<{ label: string; price: number }[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  function startEdit(product: EditableProduct) {
    setEditingId(product.id);
    setEditName(product.name);
    setEditSizes(product.sizes.map((s) => ({ ...s })));
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editName, sizes: editSizes }),
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, name: editName, sizes: editSizes, price: editSizes[0].price } : p
        )
      );
      setEditingId(null);
      setSavedMsg(`${editName} updated!`);
      setTimeout(() => setSavedMsg(""), 3000);
    } catch {
      alert("Failed to save.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Pencil className="w-6 h-6 text-brand-cyan" />
            Product Editor
          </h1>
          <p className="text-brand-muted text-sm mt-1">
            Edit product names and prices. Changes apply instantly.
          </p>
        </div>
        {savedMsg && (
          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
            <Check className="w-4 h-4" />
            {savedMsg}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 rounded-xl border border-brand-border bg-white"
          >
            {editingId === product.id ? (
              // Edit mode
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-brand-muted mb-1 block">Product Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm text-gray-900 focus:outline-none focus:border-brand-cyan/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-brand-muted mb-1 block">Sizes & Prices (AED)</label>
                  {editSizes.map((size, idx) => (
                    <div key={idx} className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={size.label}
                        onChange={(e) => {
                          const updated = [...editSizes];
                          updated[idx].label = e.target.value;
                          setEditSizes(updated);
                        }}
                        className="w-24 px-3 py-2 border border-brand-border rounded-lg text-sm text-gray-900 focus:outline-none focus:border-brand-cyan/50"
                        placeholder="Size"
                      />
                      <span className="text-brand-muted text-sm">AED</span>
                      <input
                        type="number"
                        value={size.price}
                        onChange={(e) => {
                          const updated = [...editSizes];
                          updated[idx].price = parseFloat(e.target.value) || 0;
                          setEditSizes(updated);
                        }}
                        className="w-28 px-3 py-2 border border-brand-border rounded-lg text-sm text-gray-900 focus:outline-none focus:border-brand-cyan/50"
                        placeholder="Price"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => saveEdit(product.id)}
                    disabled={saving}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-brand-cyan text-white text-sm font-medium hover:bg-brand-cyan/90 transition-colors"
                  >
                    <Save className="w-3 h-3" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-brand-border text-brand-muted text-sm font-medium hover:text-gray-900 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 font-medium text-sm">{product.name}</p>
                  <p className="text-brand-muted text-xs mt-1">
                    {product.sizes.map((s) => `${s.label}: AED ${s.price}`).join(" · ")}
                  </p>
                </div>
                <button
                  onClick={() => startEdit(product)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-brand-border text-brand-muted text-xs font-medium hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
