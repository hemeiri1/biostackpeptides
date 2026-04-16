"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Package } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // Get pending order from localStorage (saved before Ziina redirect)
    const pending = localStorage.getItem("biostack-pending-order");
    if (pending) {
      const order = JSON.parse(pending);

      // Save the order to the database now that payment is confirmed
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...order,
          paymentMethod: "ziina",
          status: "confirmed",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.orderId) {
            setOrderId(data.orderId);
            // Send order confirmation email to customer
            if (order.customerEmail) {
              fetch("/api/order-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.orderId,
                  customerEmail: order.customerEmail,
                  customerName: order.customerName,
                  items: order.items,
                  total: order.total,
                  discountPercent: order.discountPercent || 0,
                }),
              }).catch(() => {});
            }
          }
        })
        .catch(() => {});

      // Clean up
      localStorage.removeItem("biostack-pending-order");
    }

    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
        {orderId && (
          <p className="text-brand-cyan font-mono font-bold text-sm mb-2">Order {orderId}</p>
        )}
        <p className="text-brand-muted mb-8">
          Thank you for your purchase. You&apos;ll receive a confirmation email with your order details and tracking information shortly.
        </p>

        <div className="p-5 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20 mb-8">
          <div className="flex items-center gap-3 justify-center mb-2">
            <Package className="w-5 h-5 text-brand-cyan" />
            <p className="text-sm font-semibold text-gray-900">What&apos;s Next?</p>
          </div>
          <ul className="text-sm text-brand-muted space-y-1">
            <li>Your order ships within 24 hours</li>
            <li>Tracking number sent via email</li>
            <li>Delivery in 2-3 business days (UAE)</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-cyan text-white font-semibold hover:bg-brand-cyan/90 transition-colors"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/tracking"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-brand-border text-gray-900 font-semibold hover:border-brand-cyan/50 transition-colors"
          >
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}
