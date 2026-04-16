"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { useToast } from "@/components/Toast";
import { Package, Plus, X, ShoppingCart, Percent, Check } from "lucide-react";
import VialImage from "@/components/VialImage";

export default function BundlePage() {
  const [selected, setSelected] = useState<{ id: string; sizeIdx: number }[]>([]);
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);

  const bundleProducts = selected.map(({ id, sizeIdx }) => {
    const p = products.find((pr) => pr.id === id);
    return p ? { product: p, sizeIdx } : null;
  }).filter(Boolean) as { product: typeof products[0]; sizeIdx: number }[];

  const subtotal = bundleProducts.reduce((sum, { product, sizeIdx }) => sum + product.sizes[sizeIdx].price, 0);
  const discount = selected.length >= 3 ? 0.10 : 0;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  const eligible = products.filter((p) => p.category !== "Accessories" && p.category !== "Stacks");

  function addProduct(id: string) {
    if (selected.length >= 5) return;
    if (selected.some((s) => s.id === id)) return;
    setSelected([...selected, { id, sizeIdx: 0 }]);
  }

  function removeProduct(id: string) {
    setSelected(selected.filter((s) => s.id !== id));
  }

  function changeSizeIdx(id: string, sizeIdx: number) {
    setSelected(selected.map((s) => s.id === id ? { ...s, sizeIdx } : s));
  }

  function addBundleToCart() {
    bundleProducts.forEach(({ product, sizeIdx }) => {
      addToCart(product, product.sizes[sizeIdx].label);
    });
    showToast(`Bundle of ${bundleProducts.length} peptides added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <Package className="w-8 h-8 text-brand-cyan mx-auto mb-3" />
        <h1 className="text-3xl font-extrabold text-[#1B3A5C] mb-2">Build Your Stack</h1>
        <p className="text-[#5a6f80] text-sm">Pick 3+ peptides and get <strong className="text-brand-cyan">10% off</strong> your custom bundle.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product picker */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold text-[#1B3A5C] mb-3">Choose Your Peptides</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {eligible.map((p) => {
              const isSelected = selected.some((s) => s.id === p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => isSelected ? removeProduct(p.id) : addProduct(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-brand-cyan bg-brand-cyan/5 shadow-sm"
                      : "border-[#e8edf2] bg-white hover:border-brand-cyan/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <VialImage name={p.shortName} size="" slug={p.slug} className="h-12" />
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-brand-cyan flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#1B3A5C] truncate">{p.shortName}</p>
                  <p className="text-[10px] text-[#8a9bab]">From {format(p.sizes[0].price)}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bundle summary */}
        <div>
          <div className="sticky top-24 p-5 rounded-2xl border border-[#e8edf2] bg-white">
            <h3 className="font-bold text-[#1B3A5C] mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-cyan" /> Your Bundle
            </h3>

            {bundleProducts.length === 0 ? (
              <p className="text-[#8a9bab] text-sm text-center py-6">Select peptides to build your stack</p>
            ) : (
              <div className="space-y-3 mb-4">
                {bundleProducts.map(({ product, sizeIdx }) => (
                  <div key={product.id} className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1B3A5C] truncate">{product.shortName}</p>
                      <select
                        value={sizeIdx}
                        onChange={(e) => changeSizeIdx(product.id, Number(e.target.value))}
                        className="text-xs text-[#5a6f80] bg-transparent border-none p-0 focus:outline-none cursor-pointer"
                      >
                        {product.sizes.map((s, i) => (
                          <option key={s.label} value={i}>{s.label} — {format(s.price)}</option>
                        ))}
                      </select>
                    </div>
                    <button onClick={() => removeProduct(product.id)} className="text-[#8a9bab] hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {bundleProducts.length > 0 && (
              <>
                <div className="border-t border-[#e8edf2] pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8a9bab]">Subtotal</span>
                    <span className="text-[#1B3A5C]">{format(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-600 flex items-center gap-1"><Percent className="w-3 h-3" /> Bundle discount</span>
                      <span className="text-green-600">-{format(discountAmount)}</span>
                    </div>
                  )}
                  {selected.length < 3 && (
                    <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                      Add {3 - selected.length} more for 10% off!
                    </p>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#e8edf2]">
                    <span className="text-[#1B3A5C]">Total</span>
                    <span className="text-[#1B3A5C]">{format(total)}</span>
                  </div>
                </div>

                <button
                  onClick={addBundleToCart}
                  disabled={added}
                  className="w-full mt-4 py-3 rounded-xl bg-brand-cyan text-white font-bold flex items-center justify-center gap-2 hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
                >
                  {added ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingCart className="w-4 h-4" /> Add Bundle to Cart</>}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
