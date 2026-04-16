"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import VialImage from "@/components/VialImage";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { useStock } from "@/lib/useStock";
import { useProducts } from "@/lib/useProducts";
import { useToast } from "@/components/Toast";
import WishlistButton from "@/components/WishlistButton";
import LowStockBadge from "@/components/LowStockBadge";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const { isInStock } = useStock();
  const { getProductSizes, getProductName } = useProducts();
  const { showToast } = useToast();
  const inStock = isInStock(product.id, product.inStock);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [added, setAdded] = useState(false);

  const liveSizes = getProductSizes(product.id, product.sizes);
  const liveName = getProductName(product.id, product.name);
  const currentSize = liveSizes[selectedSizeIdx];
  const currentPrice = currentSize.price;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(product, currentSize.label);
    showToast(`${product.shortName} (${currentSize.label}) added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white border border-brand-border rounded-xl overflow-hidden hover:border-brand-cyan/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,102,255,0.08)] h-full flex flex-col">
        {/* Image area */}
        <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50/50 h-56 flex items-center justify-center overflow-hidden p-4">
          <div className="group-hover:scale-110 transition-transform duration-500 ease-out">
            <VialImage name={product.shortName} size="" slug={product.slug} className="h-48" />
          </div>
          {product.badge && (
            <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded bg-brand-cyan text-white">
              {product.badge}
            </span>
          )}
          {/* Purity badge + Wishlist */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">
              ≥99% Pure
            </span>
            <WishlistButton productId={product.id} />
          </div>
          {!inStock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="text-brand-muted text-sm font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-1">
            <span className="text-xs text-brand-cyan font-medium">{product.category}</span>
          </div>
          <h3 className="text-gray-900 font-semibold text-base mb-2 group-hover:text-brand-cyan transition-colors">
            {liveName}
          </h3>
          <p className="text-brand-muted text-sm leading-relaxed flex-1 mb-4">
            {product.description}
          </p>

          {/* Size selector — always show all sizes with prices */}
          <div className="flex flex-wrap gap-2 mb-3" onClick={(e) => e.preventDefault()}>
            {liveSizes.map((size, idx) => (
              <button
                key={size.label}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSizeIdx(idx);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  selectedSizeIdx === idx
                    ? "border-brand-cyan bg-brand-cyan/10 text-brand-cyan"
                    : "border-brand-border text-brand-muted hover:border-brand-muted"
                }`}
              >
                {size.label} — {format(size.price)}
              </button>
            ))}
          </div>

          {inStock && <LowStockBadge productId={product.id} />}

          {/* Price + Add to cart */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-900 font-bold text-lg">{format(currentPrice)}</span>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                added
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan hover:text-white"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <ShoppingCart className="w-4 h-4" />
              {added ? "Added!" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
