"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    section: "Orders & Shipping",
    questions: [
      {
        q: "How long does shipping take?",
        a: "We currently ship across the UAE with orders processed within 24 hours. Standard delivery takes 1–3 business days within the UAE. GCC shipping (Saudi Arabia, Kuwait, Qatar, Bahrain, Oman) is coming soon. All orders ship in discreet, temperature-stable packaging.",
      },
      {
        q: "Do you ship internationally?",
        a: "We currently offer shipping across the entire UAE with 1–3 business day delivery. GCC shipping (Saudi Arabia, Kuwait, Qatar, Bahrain, and Oman) is coming soon. Sign up for updates to be notified when we expand to your region.",
      },
      {
        q: "How is my order packaged?",
        a: "All peptides ship in vacuum-sealed, opaque packaging. Lyophilized peptides are packed with desiccant packs to maintain stability during transit. Cold-sensitive peptides ship with ice packs and insulated packaging.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards via Stripe. Cryptocurrency payment options are also available — contact us for details.",
      },
    ],
  },
  {
    section: "Products & Quality",
    questions: [
      {
        q: "What purity levels do your peptides achieve?",
        a: "All our peptides achieve 99%+ purity as verified by third-party HPLC analysis. Mass spectrometry is also used to confirm molecular weight and identity. COAs are available for every product batch.",
      },
      {
        q: "Do you provide Certificates of Analysis?",
        a: "Yes. Every order includes a batch-specific COA with HPLC chromatograph, purity percentage, and mass spec confirmation. COAs can also be viewed on each product page.",
      },
      {
        q: "How should I store my peptides?",
        a: "Lyophilized (freeze-dried) peptides should be stored at -20°C for long-term storage. Once reconstituted, store at 4°C and use within 30 days. Keep all peptides away from light and moisture.",
      },
      {
        q: "How do I reconstitute a lyophilized peptide?",
        a: "Use bacteriostatic water (BW) for reconstitution. Add BW slowly along the side of the vial, never inject directly onto the powder. Gently swirl — never shake. Typical concentration is 1–2mg/mL depending on your protocol.",
      },
    ],
  },
  {
    section: "Research & Legal",
    questions: [
      {
        q: "Are these products for human use?",
        a: "No. All products sold by BioStackPeptides are strictly for in-vitro research and laboratory use only. They are not intended for human consumption, veterinary use, or any other non-research application.",
      },
      {
        q: "Do I need to verify my research credentials?",
        a: "We may request verification of research context for certain products or order sizes. By purchasing from us, you confirm you are a qualified researcher using products for lawful research purposes only.",
      },
      {
        q: "Are your products legal to purchase?",
        a: "Research peptides occupy different legal categories in different jurisdictions. It is the buyer's sole responsibility to ensure compliance with local laws before purchasing. We recommend consulting legal counsel if uncertain.",
      },
    ],
  },
  {
    section: "Returns & Support",
    questions: [
      {
        q: "What is your return policy?",
        a: "Due to the nature of research compounds, we do not accept returns. However, if you receive a damaged or incorrect order, contact us within 48 hours with photos and we will arrange a replacement or refund.",
      },
      {
        q: "How do I contact support?",
        a: "Email us at info@biostackpeptides.com or use the Contact page. We typically respond within 24 hours on business days.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-brand-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className={`text-sm font-medium transition-colors ${open ? "text-brand-cyan" : "text-gray-900"}`}>
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-brand-muted shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-brand-cyan" : ""}`}
        />
      </button>
      {open && (
        <p className="text-brand-muted text-sm leading-relaxed pb-5">{a}</p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <p className="text-brand-cyan text-sm font-medium mb-3">Help Center</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-brand-muted">
          Can&apos;t find your answer? Email us at{" "}
          <a href="mailto:Contact@biostackpeptide.com" className="text-brand-cyan hover:underline">
            Contact@biostackpeptide.com
          </a>
        </p>
      </div>

      <div className="space-y-10">
        {faqs.map(({ section, questions }) => (
          <div key={section}>
            <h2 className="text-brand-cyan text-xs font-bold uppercase tracking-widest mb-4">
              {section}
            </h2>
            <div className="rounded-xl border border-brand-border bg-brand-card px-6">
              {questions.map(({ q, a }) => (
                <FAQItem key={q} q={q} a={a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
