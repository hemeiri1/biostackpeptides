"use client";

import Link from "next/link";
import { ShoppingCart, FlaskConical } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.defaultSize);
  const [added, setAdded] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden hover:border-brand-cyan/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.08)] h-full flex flex-col">
        {/* Image area */}
        <div className="relative bg-gradient-to-br from-brand-dark to-brand-card h-48 flex items-center justify-center overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-cyan/20 to-brand-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <FlaskConical className="w-10 h-10 text-brand-cyan/70" />
          </div>
          {product.badge && (
            <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded bg-brand-cyan text-brand-darker">
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-brand-darker/70 flex items-center justify-center">
              <span className="text-brand-muted text-sm font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-1">
            <span className="text-xs text-brand-cyan font-medium">{product.category}</span>
          </div>
          <h3 className="text-white font-semibold text-base mb-2 group-hover:text-brand-cyan transition-colors">
            {product.name}
          </h3>
          <p className="text-brand-muted text-sm leading-relaxed flex-1 mb-4">
            {product.description}
          </p>

          {/* Size selector */}
          <div className="flex gap-2 mb-4" onClick={(e) => e.preventDefault()}>
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSize(size);
                }}
                className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                  selectedSize === size
                    ? "border-brand-cyan bg-brand-cyan/10 text-brand-cyan"
                    : "border-brand-border text-brand-muted hover:border-brand-muted"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Price + Add to cart */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white font-bold text-lg">${product.price}</span>
              {product.originalPrice && (
                <span className="text-brand-muted text-sm line-through ml-2">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                added
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan hover:text-brand-darker"
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
