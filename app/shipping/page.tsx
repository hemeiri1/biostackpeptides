import Link from "next/link";
import { Truck, Clock, Package, Shield, MapPin } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Policy</h1>
      <p className="text-brand-muted text-sm mb-10">Fast, discreet, and temperature-stable delivery</p>

      {/* Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Truck, label: "Free Shipping", sub: "Orders 300+ AED" },
          { icon: Clock, label: "Ships in 24h", sub: "Same-day processing" },
          { icon: Package, label: "Discreet", sub: "Plain packaging" },
          { icon: Shield, label: "Insured", sub: "Full protection" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="p-4 rounded-xl border border-brand-border bg-white text-center">
            <Icon className="w-6 h-6 text-brand-cyan mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">{label}</p>
            <p className="text-xs text-brand-muted">{sub}</p>
          </div>
        ))}
      </div>

      <div className="prose-sm space-y-8 text-brand-muted leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Processing Time</h2>
          <p>All orders are processed within 1-2 business days. Orders placed before 2:00 PM GST on business days are typically shipped the same day. You will receive a confirmation email with tracking information once your order has shipped.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Delivery Times</h2>
          <div className="rounded-xl border border-brand-border overflow-hidden mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Region</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Delivery Time</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                <tr>
                  <td className="px-4 py-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-cyan" /> UAE</td>
                  <td className="px-4 py-3">2-3 business days</td>
                  <td className="px-4 py-3">Free over AED 300</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-cyan" /> GCC</td>
                  <td className="px-4 py-3">3-5 business days</td>
                  <td className="px-4 py-3">Free over AED 500</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-cyan" /> International</td>
                  <td className="px-4 py-3">5-10 business days</td>
                  <td className="px-4 py-3">Calculated at checkout</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Packaging</h2>
          <p>All orders are shipped in discreet, plain packaging with no external branding or product descriptions. Peptides are shipped in temperature-stable, vacuum-sealed containers to ensure product integrity during transit. Each vial is individually wrapped and cushioned.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Order Tracking</h2>
          <p>Tracking is provided for all orders. Once shipped, you will receive an email with your tracking number. You can also track your order anytime on our <Link href="/tracking" className="text-brand-cyan hover:underline">Track Order</Link> page.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Free Shipping</h2>
          <p>Orders over AED 300 qualify for free standard shipping within the UAE. Orders over AED 500 include free shipping to GCC countries and a complimentary 3ml BAC Water.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Damaged or Lost Packages</h2>
          <p>All shipments are insured. If your package arrives damaged or is lost in transit, contact us immediately at Contact@biostackpeptide.com with your order number and photos (if applicable). We will arrange a replacement or full refund at no additional cost.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact</h2>
          <p>For shipping questions:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Email: Contact@biostackpeptide.com</li>
            <li>Phone: +1 (872) 366-1398</li>
          </ul>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-brand-border">
        <Link href="/" className="text-brand-cyan hover:underline text-sm">← Back to Home</Link>
      </div>
    </div>
  );
}
