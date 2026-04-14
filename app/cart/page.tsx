"use client";

import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Plus, Droplets } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { products } from "@/data/products";

export default function CartPage() {
  const { items, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { format } = useCurrency();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <ShoppingBag className="w-16 h-16 text-brand-muted mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
        <p className="text-brand-muted mb-8">Add some research peptides to get started.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-cyan text-brand-darker font-semibold hover:bg-brand-cyan/90 transition-colors"
        >
          Browse Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-brand-muted hover:text-gray-900 text-sm mb-10 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-10">
        Your Cart ({totalItems} item{totalItems !== 1 ? "s" : ""})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}`}
              className="flex gap-4 p-5 rounded-xl border border-brand-border bg-brand-card"
            >
              {/* Icon placeholder */}
              <div className="w-20 h-20 rounded-lg bg-brand-dark flex items-center justify-center shrink-0">
                <span className="text-brand-cyan text-2xl">🧪</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-gray-900 font-semibold">{item.product.name}</h3>
                    <p className="text-brand-muted text-sm">Size: {item.size}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.size)}
                    className="text-brand-muted hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded border border-brand-border text-gray-900 hover:border-brand-cyan/50 transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-gray-900 font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded border border-brand-border text-gray-900 hover:border-brand-cyan/50 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-900 font-semibold">
                    {format(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-xl border border-brand-border bg-brand-card sticky top-24">
            <h2 className="text-gray-900 font-semibold text-lg mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Subtotal</span>
                <span className="text-gray-900">{format(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Shipping</span>
                <span className="text-green-400">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-brand-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-900 font-semibold">Total</span>
                <span className="text-gray-900 font-bold text-xl">{format(totalPrice)}</span>
              </div>
            </div>

            <button
              className="w-full py-3 rounded-xl bg-brand-cyan text-brand-darker font-semibold hover:bg-brand-cyan/90 transition-colors flex items-center justify-center gap-2"
              onClick={() => alert("Stripe checkout coming soon!")}
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-brand-muted text-xs mt-4">
              Secure checkout powered by Stripe
            </p>
          </div>

          {/* BAC Water Upsell */}
          {!items.some((i) => i.product.slug === "bac-water") && (
            <div className="mt-4 p-4 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <img src="/images/bacwater.jpg" alt="BAC Water" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <Droplets className="w-3 h-3 text-brand-cyan" />
                    <p className="text-xs font-semibold text-brand-cyan">Need BAC Water?</p>
                  </div>
                  <p className="text-xs text-brand-muted mb-2">
                    Essential for reconstituting your peptides. Don&apos;t forget to add it!
                  </p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const bacWater = products.find((p) => p.slug === "bac-water");
                      if (!bacWater) return null;
                      return bacWater.sizes.map((size) => (
                        <button
                          key={size.label}
                          onClick={() => addToCart(bacWater, size.label)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-cyan text-white hover:bg-brand-cyan/90 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          {size.label} — {format(size.price)}
                        </button>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
