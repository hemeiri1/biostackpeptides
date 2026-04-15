import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-brand-muted text-sm mb-10">Last updated: April 2026</p>

      <div className="prose-sm space-y-8 text-brand-muted leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Research Use Only</h2>
          <p>All products sold by BioStack Peptides are intended strictly for in-vitro research and laboratory use only. They are not intended for human consumption, veterinary use, or any therapeutic application. These products have not been evaluated by any regulatory authority. By purchasing, you confirm you are a qualified researcher and will use products solely for lawful research purposes.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Age Requirement</h2>
          <p>You must be at least 18 years old to purchase products from BioStack Peptides. By placing an order, you confirm that you meet this age requirement.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately at Contact@biostackpeptide.com if you suspect unauthorized access.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Pricing & Payment</h2>
          <p>All prices are listed in AED (United Arab Emirates Dirham) unless otherwise specified. We reserve the right to change prices at any time. Payment is processed securely through Stripe. Orders are confirmed only after successful payment processing.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Returns & Refunds</h2>
          <p>We accept returns within 7 days of delivery for unopened, undamaged products in their original packaging. Opened or reconstituted products cannot be returned due to the nature of research chemicals. To initiate a return, contact us at Contact@biostackpeptide.com with your order number. Refunds are processed within 5-7 business days after receiving the returned product.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Product Quality</h2>
          <p>All products are manufactured under strict quality control and tested for purity (≥99%) via third-party HPLC analysis. Certificates of Analysis (COA) are available for every product and batch. While we ensure the highest quality, we make no claims regarding the suitability of products for any specific research application.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
          <p>All content on biostackpeptide.com — including text, graphics, logos, images, and software — is the property of BioStack Peptides and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written consent.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
          <p>BioStack Peptides shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the amount paid for the specific product in question. We are not responsible for any misuse of our products.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Governing Law</h2>
          <p>These terms are governed by the laws of the United Arab Emirates. Any disputes shall be resolved through the courts of Dubai, UAE.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Contact</h2>
          <p>For questions about these terms, contact us at:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Email: Contact@biostackpeptide.com</li>
            <li>Phone: +1 (872) 366-1398</li>
            <li>Website: biostackpeptide.com</li>
          </ul>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-brand-border">
        <Link href="/" className="text-brand-cyan hover:underline text-sm">← Back to Home</Link>
      </div>
    </div>
  );
}
