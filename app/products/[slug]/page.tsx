"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Package,
  Thermometer,
} from "lucide-react";
import { getProductBySlug, products } from "@/data/products";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { useToast } from "@/components/Toast";
import ProductCard from "@/components/ProductCard";
import VialImage from "@/components/VialImage";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);

  const { addToCart } = useCart();
  const { format } = useCurrency();
  const { showToast } = useToast();
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [liveSizes, setLiveSizes] = useState<{ label: string; price: number }[] | null>(null);

  useEffect(() => {
    if (!product) return;
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: any[]) => {
        const match = data.find((p: any) => p.id === product.id);
        if (match?.sizes) setLiveSizes(match.sizes);
      })
      .catch(() => {});
  }, [product]);

  if (!product) return notFound();

  const sizes = liveSizes || product.sizes;
  const currentSize = sizes[selectedSizeIdx];

  function handleAddToCart() {
    addToCart(product!, currentSize!.label);
    showToast(`${product!.shortName} (${currentSize!.label}) added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Back */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-brand-muted hover:text-gray-900 text-sm mb-10 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Image */}
        <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50/50 rounded-2xl border border-brand-border h-96 lg:h-[500px] flex items-center justify-center p-8">
          <VialImage name={product.shortName} size="" slug={product.slug} className="h-96" />
          {product.badge && (
            <span className="absolute top-4 left-4 text-sm font-bold px-3 py-1 rounded-lg bg-brand-cyan text-brand-darker">
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-brand-cyan text-sm font-medium">{product.category}</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>
          <p className="text-brand-muted leading-relaxed mb-8">{product.longDescription}</p>

          {/* Purity badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-medium mb-4">
            ≥99% Purity · COA Certified
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl font-bold text-gray-900">{format(currentSize!.price)}</span>
          </div>

          {/* Size */}
          {product.sizes.length > 1 && (
            <div className="mb-6">
              <p className="text-gray-900 text-sm font-medium mb-3">Select Size</p>
              <div className="flex gap-3">
                {product.sizes.map((size, idx) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSizeIdx(idx)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                      selectedSizeIdx === idx
                        ? "border-brand-cyan bg-brand-cyan/10 text-brand-cyan"
                        : "border-brand-border text-brand-muted hover:border-brand-muted"
                    }`}
                  >
                    {size.label} — {format(size.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <p className="text-gray-900 text-sm font-medium mb-3">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-lg border border-brand-border text-gray-900 hover:border-brand-cyan/50 transition-colors flex items-center justify-center text-lg"
              >
                −
              </button>
              <span className="text-gray-900 font-medium w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-lg border border-brand-border text-gray-900 hover:border-brand-cyan/50 transition-colors flex items-center justify-center text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-base transition-all duration-200 mb-4 ${
              added
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-brand-cyan text-brand-darker hover:bg-brand-cyan/90"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <ShoppingCart className="w-5 h-5" />
            {added ? "Added to Cart!" : product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>

          {/* Research disclaimer */}
          <div className="flex gap-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
            <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-yellow-500/80 text-xs leading-relaxed">
              For research purposes only. Not intended for human consumption or veterinary use.
            </p>
          </div>
        </div>
      </div>

      {/* Details tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {/* Benefits */}
        <div className="p-6 rounded-xl border border-brand-border bg-brand-card">
          <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-brand-cyan" />
            Research Benefits
          </h3>
          <ul className="space-y-2">
            {product.benefits.map((b) => (
              <li key={b} className="text-brand-muted text-sm flex items-start gap-2">
                <span className="text-brand-cyan mt-1">›</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Usage */}
        <div className="p-6 rounded-xl border border-brand-border bg-brand-card">
          <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-cyan" />
            Usage Guidelines
          </h3>
          <p className="text-brand-muted text-sm leading-relaxed">{product.usage}</p>
        </div>

        {/* Storage */}
        <div className="p-6 rounded-xl border border-brand-border bg-brand-card">
          <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-brand-cyan" />
            Storage & Handling
          </h3>
          <p className="text-brand-muted text-sm leading-relaxed">{product.storage}</p>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
