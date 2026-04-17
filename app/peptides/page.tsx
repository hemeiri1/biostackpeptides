import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FlaskConical, Dna, Shield, Zap, Brain, Heart, Sparkles, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "What Are Peptides? — BioStack Peptides",
  description: "A comprehensive guide to peptides — what they are, how they work, research categories, reconstitution, storage, and why purity matters.",
};

export default function PeptidesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f8faff] via-white to-[#f0f4ff] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/20 bg-white text-brand-cyan text-xs font-semibold mb-6 shadow-sm">
            <FlaskConical className="w-3.5 h-3.5" />
            Research Education
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1B3A5C] mb-6">
            What Are <span className="text-brand-cyan">Peptides</span>?
          </h1>
          <p className="text-lg text-[#5a6f80] leading-relaxed max-w-2xl mx-auto">
            A comprehensive guide to peptides — what they are, how they work, and why they&apos;re at the forefront of modern scientific research.
          </p>
        </div>
      </section>

      {/* What are peptides */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-extrabold text-[#1B3A5C] mb-4">What Are Peptides Made Of?</h2>
            <p className="text-[#5a6f80] leading-relaxed mb-4">
              Peptides are short chains of <strong className="text-[#1B3A5C]">amino acids</strong> — the fundamental building blocks of life. When two amino acids link together, they form a <strong className="text-[#1B3A5C]">dipeptide</strong>. Three create a tripeptide. Chains of 2-50 amino acids are classified as peptides, while longer chains (50+) become proteins.
            </p>
            <p className="text-[#5a6f80] leading-relaxed mb-4">
              Your body naturally produces thousands of peptides that act as <strong className="text-[#1B3A5C]">signaling molecules</strong> — they tell your cells what to do. They regulate everything from growth and repair to immune function, sleep, and metabolism.
            </p>
            <p className="text-[#5a6f80] leading-relaxed">
              As we age, peptide production declines. This is why researchers are intensely studying synthetic peptides — to understand how restoring these signals could impact healing, aging, and disease pathways.
            </p>
          </div>
          <div className="lg:col-span-2">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
              <Dna className="w-8 h-8 text-brand-cyan mb-4" />
              <h3 className="text-[#1B3A5C] font-bold mb-3">The Building Blocks</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-brand-cyan shadow-sm">2</span>
                  <span className="text-[#5a6f80]">Amino acids → <strong className="text-[#1B3A5C]">Dipeptide</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-brand-cyan shadow-sm">3</span>
                  <span className="text-[#5a6f80]">Amino acids → <strong className="text-[#1B3A5C]">Tripeptide</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-brand-cyan shadow-sm">2-50</span>
                  <span className="text-[#5a6f80]">Amino acids → <strong className="text-[#1B3A5C]">Peptides</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-brand-cyan shadow-sm">50+</span>
                  <span className="text-[#5a6f80]">Amino acids → <strong className="text-[#1B3A5C]">Proteins</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How peptides work */}
      <section className="bg-[#f8faff]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-extrabold text-[#1B3A5C] mb-4">How Do Peptides Work?</h2>
          <p className="text-[#5a6f80] leading-relaxed mb-4">
            Peptides function as <strong className="text-[#1B3A5C]">biological messengers</strong>. They bind to specific receptors on cells and trigger targeted responses — like telling a cell to produce more collagen, release growth hormone, reduce inflammation, or repair damaged tissue.
          </p>
          <p className="text-[#5a6f80] leading-relaxed mb-4">
            What makes peptides remarkable in research is their <strong className="text-[#1B3A5C]">specificity</strong>. Unlike broad-acting compounds, each peptide has a precise target. BPC-157 signals tissue repair. Semax enhances BDNF in the brain. Retatrutide targets three metabolic receptors simultaneously. This precision is what makes them so valuable for scientific study.
          </p>
          <p className="text-[#5a6f80] leading-relaxed">
            Research has shown that certain short-chain peptides can act as <strong className="text-[#1B3A5C]">&ldquo;gene switches&rdquo;</strong> — activating or deactivating specific genes related to aging, repair, and cellular function. GHK-Cu, for example, has been shown to upregulate 31 genes and downregulate 32 genes associated with aging.
          </p>
        </div>
      </section>

      {/* Categories of peptides */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-extrabold text-[#1B3A5C] mb-3">Categories of Research Peptides</h2>
          <p className="text-[#5a6f80] max-w-2xl mx-auto">Each peptide targets specific biological pathways. Here are the main research categories:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Heart,
              title: "Healing & Recovery",
              peptides: "BPC-157, TB-500, KPV",
              description: "Target tissue repair, reduce inflammation, accelerate wound healing, and support gut health. The most widely researched category.",
              color: "from-green-50 to-emerald-50 border-green-200 text-green-600",
            },
            {
              icon: Zap,
              title: "Growth Hormone",
              peptides: "CJC-1295, Ipamorelin, GHRP-6, Tesamorelin, IGF-1 LR3",
              description: "Stimulate natural growth hormone release or directly activate growth pathways. Studied for lean mass, recovery, and metabolic function.",
              color: "from-blue-50 to-cyan-50 border-blue-200 text-blue-600",
            },
            {
              icon: Scale,
              title: "Weight Management",
              peptides: "Retatrutide, 5-Amino-1MQ",
              description: "Target metabolic receptors to influence appetite, fat metabolism, and energy expenditure. Retatrutide is the most advanced triple-agonist.",
              color: "from-orange-50 to-amber-50 border-orange-200 text-orange-600",
            },
            {
              icon: Brain,
              title: "Cognitive Enhancement",
              peptides: "Semax, Selank, DSIP",
              description: "Enhance BDNF, modulate neurotransmitters, reduce anxiety, and improve sleep quality. Studied for neuroprotection and cognitive performance.",
              color: "from-purple-50 to-indigo-50 border-purple-200 text-purple-600",
            },
            {
              icon: Sparkles,
              title: "Anti-Aging & Longevity",
              peptides: "NAD+, GHK-Cu, MOTS-C",
              description: "Activate sirtuins, repair DNA, restore mitochondrial function, and reverse age-related gene expression. The frontier of longevity science.",
              color: "from-pink-50 to-rose-50 border-pink-200 text-pink-600",
            },
            {
              icon: Shield,
              title: "Skin & Beauty",
              peptides: "GHK-Cu, Glow Stack, Klow Stack",
              description: "Stimulate collagen and elastin synthesis, promote wound healing, and enhance skin regeneration. Also studied for hair follicle growth.",
              color: "from-teal-50 to-cyan-50 border-teal-200 text-teal-600",
            },
          ].map(({ icon: Icon, title, peptides, description, color }) => (
            <div key={title} className={`p-6 rounded-2xl bg-gradient-to-br ${color} border`}>
              <Icon className="w-7 h-7 mb-4" />
              <h3 className="text-[#1B3A5C] font-bold text-lg mb-1">{title}</h3>
              <p className="text-brand-cyan text-xs font-semibold mb-3">{peptides}</p>
              <p className="text-[#5a6f80] text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Purity & Quality */}
      <section className="bg-[#1B3A5C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-white mb-3">Why Purity Matters</h2>
            <p className="text-blue-200/80 max-w-2xl mx-auto">
              In peptide research, purity directly impacts results. Impure peptides introduce variables that compromise data integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { value: "≥99%", label: "Purity", detail: "Third-party HPLC verified" },
              { value: "COA", label: "Certified", detail: "Batch-specific documentation" },
              { value: "GMP", label: "Standards", detail: "Pharmaceutical-grade manufacturing" },
            ].map(({ value, label, detail }) => (
              <div key={label} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-3xl font-extrabold text-brand-cyan mb-1">{value}</p>
                <p className="text-white font-bold text-sm">{label}</p>
                <p className="text-blue-200/60 text-xs mt-1">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to reconstitute */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-extrabold text-[#1B3A5C] mb-4">How to Reconstitute Peptides</h2>
        <p className="text-[#5a6f80] leading-relaxed mb-8">
          Most research peptides come as a lyophilized (freeze-dried) powder. Before use, they must be reconstituted with <strong className="text-[#1B3A5C]">bacteriostatic water (BAC water)</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Draw BAC Water", desc: "Use a sterile syringe to draw the desired amount of bacteriostatic water." },
            { step: "2", title: "Add to Vial", desc: "Inject slowly along the inside wall of the vial — never directly onto the powder." },
            { step: "3", title: "Swirl Gently", desc: "Roll the vial between your fingers. Never shake — this can damage the peptide structure." },
            { step: "4", title: "Refrigerate", desc: "Store reconstituted peptides at 2-8°C. Use within 30 days for best results." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="p-5 rounded-2xl border border-[#e8edf2] bg-white">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan font-extrabold text-lg mb-3">
                {step}
              </div>
              <h3 className="text-[#1B3A5C] font-bold text-sm mb-2">{title}</h3>
              <p className="text-[#5a6f80] text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-5 rounded-2xl bg-brand-cyan/5 border border-brand-cyan/20 flex items-center gap-4">
          <FlaskConical className="w-8 h-8 text-brand-cyan shrink-0" />
          <div>
            <p className="text-[#1B3A5C] font-bold text-sm">Need exact dosing calculations?</p>
            <p className="text-[#5a6f80] text-xs">Use our <Link href="/calculator" className="text-brand-cyan font-semibold hover:underline">Peptide Calculator</Link> for precise reconstitution volumes.</p>
          </div>
        </div>
      </section>

      {/* Storage */}
      <section className="bg-[#f8faff]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-extrabold text-[#1B3A5C] mb-6">Storage Guidelines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Lyophilized Powder", temp: "-20°C", detail: "Freezer storage for long-term stability. Can last months to years when stored properly.", icon: "❄️" },
              { title: "Reconstituted", temp: "2-8°C", detail: "Refrigerator storage. Use within 30 days of reconstitution for optimal potency.", icon: "🧊" },
              { title: "BAC Water", temp: "Room Temp", detail: "Store at room temperature away from light. Use within 28 days after opening.", icon: "💧" },
            ].map(({ title, temp, detail, icon }) => (
              <div key={title} className="p-6 rounded-2xl border border-[#e8edf2] bg-white">
                <span className="text-3xl block mb-3">{icon}</span>
                <h3 className="text-[#1B3A5C] font-bold mb-1">{title}</h3>
                <p className="text-brand-cyan font-extrabold text-lg mb-2">{temp}</p>
                <p className="text-[#5a6f80] text-xs leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[#1B3A5C] mb-3">Ready to Explore Our Products?</h2>
          <p className="text-[#5a6f80] mb-8 max-w-lg mx-auto">
            Browse our full catalog of 20+ research-grade peptides. All ≥99% purity, COA certified, with fast UAE shipping.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-cyan text-white font-bold hover:bg-brand-cyan/90 transition-all shadow-lg shadow-brand-cyan/20"
            >
              Shop All Products <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-[#1B3A5C]/10 text-[#1B3A5C] font-semibold hover:border-brand-cyan/50 transition-all"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-[#1B3A5C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-blue-200/60 text-xs text-center leading-relaxed">
            <strong className="text-blue-200/80">Research Use Only Disclaimer:</strong> All products sold by BioStack Peptides are intended for in-vitro research and laboratory use only. They are not intended for human consumption, veterinary use, or any therapeutic application. These products have not been evaluated by any regulatory authority. By purchasing, you confirm that you are a qualified researcher.
          </p>
        </div>
      </section>
    </div>
  );
}
