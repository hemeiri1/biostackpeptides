import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — BioStack Peptides",
  description: "How BioStack Peptides collects, uses, and protects your personal data. GDPR compliant.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-brand-muted text-sm mb-10">Last updated: April 2026</p>

      <div className="prose-sm space-y-8 text-brand-muted leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
          <p>We collect the following information when you create an account, place an order, or contact us:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Shipping and billing address</li>
            <li>Payment information (processed securely by Stripe — we never store card details)</li>
            <li>Order history and preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations, shipping updates, and delivery notifications</li>
            <li>Manage your account and loyalty rewards</li>
            <li>Send promotional emails (only with your consent — you can unsubscribe anytime)</li>
            <li>Improve our website, products, and customer experience</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Cookies</h2>
          <p>We use cookies and local storage to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Keep you logged in to your account</li>
            <li>Remember your cart items and currency preference</li>
            <li>Analyze site traffic and usage patterns</li>
            <li>Improve your browsing experience</li>
          </ul>
          <p className="mt-2">You can disable cookies in your browser settings, though some features may not work properly.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
          <p>We use the following trusted third-party services:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Stripe</strong> — Secure payment processing</li>
            <li><strong>Resend</strong> — Transactional email delivery</li>
            <li><strong>Vercel</strong> — Website hosting and analytics</li>
          </ul>
          <p className="mt-2">These services have their own privacy policies and are GDPR-compliant. We do not sell your data to any third party.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Data Retention</h2>
          <p>We retain your account data for as long as your account is active. Order records are kept for 5 years for legal and accounting purposes. You may request deletion of your account and personal data at any time.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Export your data in a portable format</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, contact us at Contact@biostackpeptide.com.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Security</h2>
          <p>We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Contact</h2>
          <p>For privacy-related questions or requests:</p>
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
