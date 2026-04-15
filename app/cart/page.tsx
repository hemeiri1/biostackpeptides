"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Plus, Droplets, Tag, Check, User, Phone, Mail } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { useProducts } from "@/lib/useProducts";
import { products } from "@/data/products";

export default function CartPage() {
  const { items, addToCart, removeFromCart, updateQuantity, totalItems, liveTotalPrice } = useCart();
  const { format } = useCurrency();
  const { getProductSizes } = useProducts();

  // Get live prices for cart items
  function getLivePrice(item: any) {
    const liveSizes = getProductSizes(item.product.id, item.product.sizes);
    const match = liveSizes.find((s: any) => s.label === item.size);
    return match ? match.price : item.sizePrice;
  }

  const liveTotalPrice = items.reduce((sum, i) => sum + getLivePrice(i) * i.quantity, 0);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountMsg, setDiscountMsg] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [applyingCode, setApplyingCode] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const discountAmount = liveTotalPrice * (discountPercent / 100);
  const finalPrice = liveTotalPrice - discountAmount;

  async function applyDiscount() {
    if (!discountCode.trim()) return;
    setApplyingCode(true);
    setDiscountError("");
    setDiscountMsg("");
    try {
      const res = await fetch("/api/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscountPercent(data.discount);
        setDiscountMsg(data.message);
        setDiscountError("");
      } else {
        setDiscountError(data.message);
        setDiscountPercent(0);
      }
    } catch {
      setDiscountError("Failed to validate code");
    }
    setApplyingCode(false);
  }

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
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                <img
                  src={item.product.image || "/vial-base.jpg"}
                  alt={item.product.name}
                  className="w-full h-full object-contain"
                />
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
                    {format(getLivePrice(item) * item.quantity)}
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

            {/* Discount Code */}
            <div className="mb-6">
              <label className="text-xs font-medium text-brand-muted mb-2 block">Discount Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  disabled={discountPercent > 0}
                  className="flex-1 px-3 py-2 bg-white border border-brand-border rounded-lg text-sm text-gray-900 placeholder-brand-muted focus:outline-none focus:border-brand-cyan/50 disabled:opacity-50"
                />
                {discountPercent > 0 ? (
                  <button
                    onClick={() => { setDiscountPercent(0); setDiscountCode(""); setDiscountMsg(""); }}
                    className="px-3 py-2 rounded-lg border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={applyDiscount}
                    disabled={applyingCode || !discountCode.trim()}
                    className="px-4 py-2 rounded-lg bg-brand-cyan text-white text-xs font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-40"
                  >
                    {applyingCode ? "..." : "Apply"}
                  </button>
                )}
              </div>
              {discountMsg && (
                <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {discountMsg}
                </p>
              )}
              {discountError && (
                <p className="text-red-500 text-xs mt-2">{discountError}</p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Subtotal</span>
                <span className="text-gray-900">{format(liveTotalPrice)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Discount ({discountPercent}%)
                  </span>
                  <span className="text-green-600">-{format(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Shipping</span>
                {liveTotalPrice >= 300 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span className="text-brand-muted">AED {(300 - liveTotalPrice).toFixed(0)} more for free shipping</span>
                )}
              </div>
            </div>

            {/* Free shipping / BAC water offers */}
            <div className="space-y-2 mb-6">
              {liveTotalPrice >= 300 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-green-700 text-xs font-medium">Free shipping applied!</p>
                </div>
              )}
              {liveTotalPrice >= 500 && !items.some((i) => i.product.slug === "bac-water" && i.product.price === 0) && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
                  <Droplets className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-green-700 text-xs font-medium">Free 3ml BAC Water included with your order!</p>
                </div>
              )}
              {liveTotalPrice < 300 && (
                <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-blue-700 text-xs">Spend <strong>AED {(300 - liveTotalPrice).toFixed(0)}</strong> more for <strong>free shipping</strong></p>
                </div>
              )}
              {liveTotalPrice >= 300 && liveTotalPrice < 500 && (
                <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-blue-700 text-xs">Spend <strong>AED {(500 - liveTotalPrice).toFixed(0)}</strong> more for a <strong>free 3ml BAC Water</strong></p>
                </div>
              )}
            </div>

            <div className="border-t border-brand-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-900 font-semibold">Total</span>
                <span className="text-gray-900 font-bold text-xl">{format(finalPrice)}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-3 mb-6">
              <p className="text-xs font-medium text-brand-muted">Your Details</p>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-cyan/50"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone Number (required)"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-cyan/50"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-cyan/50"
                />
              </div>
            </div>

            <button
              className="w-full py-3 rounded-xl bg-brand-cyan text-white font-semibold hover:bg-brand-cyan/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={checkingOut}
              onClick={async () => {
                if (!customerName.trim() || !customerPhone.trim()) {
                  alert("Please enter your name and phone number.");
                  return;
                }
                setCheckingOut(true);
                try {
                  const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      items: items.map((i) => ({
                        name: i.product.name,
                        size: i.size,
                        quantity: i.quantity,
                        price: i.sizePrice,
                      })),
                      total: finalPrice,
                      discountPercent,
                      customerName,
                      customerPhone,
                      customerEmail,
                    }),
                  });
                  const data = await res.json();
                  if (data.success && data.url) {
                    window.location.href = data.url;
                  } else {
                    alert(data.message || "Checkout failed. Please try again.");
                    setCheckingOut(false);
                  }
                } catch {
                  alert("Something went wrong. Please try again.");
                  setCheckingOut(false);
                }
              }}
            >
              {checkingOut ? "Redirecting to payment..." : "Proceed to Checkout"}
              {!checkingOut && <ArrowRight className="w-4 h-4" />}
            </button>

            <p className="text-center text-brand-muted text-xs mt-4">
              Secure checkout powered by Ziina
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
