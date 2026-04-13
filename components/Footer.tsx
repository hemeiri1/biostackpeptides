import Link from "next/link";
import { FlaskConical, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-darker border-t border-brand-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-brand-cyan to-brand-blue flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                BioStack<span className="text-brand-cyan">Peptides</span>
              </span>
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed max-w-sm">
              Premium research peptides for scientific and research purposes. All
              products are intended for in-vitro research and laboratory use only.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 rounded border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-cyan hover:border-brand-cyan transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:Contact@biostackpeptide.com"
                className="w-9 h-9 rounded border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-cyan hover:border-brand-cyan transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Products
            </h4>
            <ul className="space-y-3">
              {[
                "Healing & Recovery",
                "Growth Peptides",
                "Weight Management",
                "Longevity",
                "Cognitive",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-brand-muted hover:text-white transition-colors text-sm"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
                { label: "Shipping Policy", href: "/faq#shipping" },
                { label: "Privacy Policy", href: "/faq#privacy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-muted hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-brand-border">
          <p className="text-xs text-brand-muted leading-relaxed mb-4">
            <strong className="text-yellow-500">Research Use Only Disclaimer:</strong> All
            products sold by BioStackPeptides are intended for in-vitro research and laboratory
            use only. They are not intended for human consumption, veterinary use, or any other
            use. These products have not been evaluated by any regulatory authority. Not for
            human or animal use. By purchasing our products, you confirm that you are a
            qualified researcher and that the compounds will be used only for lawful research
            purposes.
          </p>
          <p className="text-xs text-brand-muted">
            © {new Date().getFullYear()} BioStackPeptides. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
