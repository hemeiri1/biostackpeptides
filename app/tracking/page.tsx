"use client";

import { useState } from "react";
import { Package, Search, Truck, CheckCircle, Clock, MapPin } from "lucide-react";

interface TrackingStep {
  status: string;
  location: string;
  date: string;
  completed: boolean;
}

export default function TrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [searched, setSearched] = useState(false);
  const [tracking, setTracking] = useState<TrackingStep[] | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
    // Placeholder — would connect to shipping API (e.g. ShipStation, AfterShip)
    setTracking(null);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-medium mb-4">
          <Truck className="w-3 h-3" />
          Order Tracking
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
        <p className="text-brand-muted max-w-lg mx-auto">
          Enter your order number or tracking ID to see the current status of your shipment.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-12">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter order number or tracking ID (e.g. BSP-10234)"
              required
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-brand-border rounded-xl text-gray-900 placeholder-brand-muted text-sm focus:outline-none focus:border-brand-cyan/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-brand-cyan text-white font-semibold hover:bg-brand-cyan/90 transition-colors shrink-0"
          >
            Track
          </button>
        </div>
      </form>

      {/* Result */}
      {searched && (
        <div>
          {tracking ? (
            <div className="space-y-4">
              {tracking.map((step, i) => (
                <div
                  key={i}
                  className={`flex gap-4 p-4 rounded-xl border ${
                    step.completed
                      ? "border-green-200 bg-green-50/50"
                      : "border-brand-border bg-white"
                  }`}
                >
                  <div className="shrink-0 mt-1">
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-brand-muted" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium text-sm">{step.status}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-brand-muted" />
                      <p className="text-brand-muted text-xs">{step.location}</p>
                      <span className="text-brand-muted text-xs">•</span>
                      <p className="text-brand-muted text-xs">{step.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 rounded-xl border border-brand-border bg-blue-50/30">
              <Package className="w-12 h-12 text-brand-muted mx-auto mb-4" />
              <h3 className="text-gray-900 font-semibold mb-2">Order Not Found</h3>
              <p className="text-brand-muted text-sm mb-4">
                We couldn&apos;t find an order with ID <strong>&ldquo;{orderId}&rdquo;</strong>.
                Please check the order number and try again.
              </p>
              <p className="text-brand-muted text-xs">
                If you recently placed an order, it may take up to 2 hours for tracking
                to become available. Contact us at{" "}
                <a href="mailto:Contact@biostackpeptide.com" className="text-brand-cyan hover:underline">
                  Contact@biostackpeptide.com
                </a>{" "}
                or call <a href="tel:+18723661398" className="text-brand-cyan hover:underline">+1 (872) 366-1398</a> for help.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Package,
            title: "Processing",
            desc: "Orders are processed within 24 hours of confirmation.",
          },
          {
            icon: Truck,
            title: "In Transit",
            desc: "Standard delivery takes 3–5 business days. Express available.",
          },
          {
            icon: CheckCircle,
            title: "Delivered",
            desc: "All packages ship with signature confirmation.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="p-5 rounded-xl border border-brand-border bg-white text-center"
          >
            <Icon className="w-6 h-6 text-brand-cyan mx-auto mb-2" />
            <h4 className="text-gray-900 font-semibold text-sm mb-1">{title}</h4>
            <p className="text-brand-muted text-xs">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
