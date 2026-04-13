"use client";

import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <ShoppingBag className="w-16 h-16 text-brand-muted mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-3">Your cart is empty</h1>
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
        className="inline-flex items-center gap-2 text-brand-muted hover:text-white text-sm mb-10 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold text-white mb-10">
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
                    <h3 className="text-white font-semibold">{item.product.name}</h3>
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
                      className="w-8 h-8 rounded border border-brand-border text-white hover:border-brand-cyan/50 transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-white font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded border border-brand-border text-white hover:border-brand-cyan/50 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-white font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-xl border border-brand-border bg-brand-card sticky top-24">
            <h2 className="text-white font-semibold text-lg mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Subtotal</span>
                <span className="text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Shipping</span>
                <span className="text-green-400">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-brand-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-bold text-xl">${totalPrice.toFixed(2)}</span>
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
        </div>
      </div>
    </div>
  );
}
