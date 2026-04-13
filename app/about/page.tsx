import Link from "next/link";
import { ArrowRight, FlaskConical, Shield, Users, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-cyan text-sm font-medium mb-3">About Us</p>
          <h1 className="text-5xl font-bold text-white mb-6">
            Advancing Research Through{" "}
            <span className="text-gradient">Premium Peptides</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            BioStackPeptides was founded with a single mission: provide researchers with
            the highest-quality research peptides, backed by rigorous testing and transparent
            documentation.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-brand-border bg-brand-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "99%+", label: "Purity Guaranteed" },
              { value: "50+", label: "Peptide Products" },
              { value: "1000+", label: "Researchers Served" },
              { value: "48h", label: "Max Ship Time" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-brand-cyan mb-1">{value}</p>
                <p className="text-brand-muted text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand-cyan text-sm font-medium mb-3">Our Mission</p>
            <h2 className="text-3xl font-bold text-white mb-6">
              Quality You Can Count On
            </h2>
            <p className="text-brand-muted leading-relaxed mb-6">
              Every peptide in our catalog is synthesized to the highest pharmaceutical standards
              and independently verified through third-party HPLC and mass spectrometry testing.
              We believe researchers deserve complete transparency — which is why we publish
              full Certificates of Analysis for every batch.
            </p>
            <p className="text-brand-muted leading-relaxed mb-8">
              From lyophilization to cold-chain shipping, every step of our process is designed
              to preserve the integrity and potency of our research compounds.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-cyan text-brand-darker font-semibold hover:bg-brand-cyan/90 transition-colors"
            >
              Browse Our Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: FlaskConical,
                title: "Lab Tested",
                desc: "Every batch verified by independent third-party laboratories",
              },
              {
                icon: Shield,
                title: "Purity Certified",
                desc: "HPLC and mass spec verification on all products",
              },
              {
                icon: Users,
                title: "Researcher Focused",
                desc: "Built for scientists, by people who understand research",
              },
              {
                icon: Award,
                title: "COA Provided",
                desc: "Full Certificate of Analysis included with every order",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-5 rounded-xl border border-brand-border bg-brand-card"
              >
                <Icon className="w-6 h-6 text-brand-cyan mb-3" />
                <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                <p className="text-brand-muted text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-card/30 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <p className="text-brand-cyan text-sm font-medium mb-3">Our Values</p>
            <h2 className="text-3xl font-bold text-white">How We Operate</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparency",
                description:
                  "We publish batch-specific COAs, storage conditions, and synthesis details. No black-box sourcing — you know exactly what you're getting.",
                emoji: "🔍",
              },
              {
                title: "Integrity",
                description:
                  "We never cut corners on quality. If a batch doesn't meet our purity standards, it doesn't ship — period. Our reputation depends on yours.",
                emoji: "⚖️",
              },
              {
                title: "Responsibility",
                description:
                  "All products are sold strictly for legitimate research purposes. We comply with applicable laws and verify research context on all orders.",
                emoji: "🛡️",
              },
            ].map(({ title, description, emoji }) => (
              <div
                key={title}
                className="p-8 rounded-xl border border-brand-border bg-brand-card"
              >
                <span className="text-4xl mb-5 block">{emoji}</span>
                <h3 className="text-white font-semibold text-lg mb-3">{title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Have Questions?</h2>
        <p className="text-brand-muted mb-8 max-w-lg mx-auto">
          Our team is here to help with protocol questions, storage guidance, and product
          selection.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-brand-cyan text-brand-darker font-semibold hover:bg-brand-cyan/90 transition-colors"
        >
          Contact Us
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
