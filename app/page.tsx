import Link from "next/link";
import { ArrowRight, Shield, Zap, FlaskConical, Truck, Star, ChevronRight, Award, Beaker } from "lucide-react";
import { getFeaturedProducts, getBestSellers } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CountdownBanner from "@/components/CountdownBanner";
import RecentlyViewed from "@/components/RecentlyViewed";
import HeroAnimation from "@/components/HeroAnimation";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const bestSellers = getBestSellers(4);

  return (
    <div>
      {/* Cinematic Hero with DNA/Molecular Animation */}
      <HeroAnimation />

      {/* Trust Bar — Like UAE Peptides press logos */}
      <section className="border-y border-[#e8edf2] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              { icon: Shield, label: "99%+ Purity", sub: "HPLC Verified" },
              { icon: Award, label: "COA Certified", sub: "Every Batch Tested" },
              { icon: Truck, label: "Free Shipping", sub: "Orders Over AED 300" },
              { icon: Zap, label: "Ships in 24h", sub: "Fast Processing" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f0f4ff] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-brand-cyan" />
                </div>
                <div>
                  <p className="text-[#1B3A5C] text-sm font-bold">{label}</p>
                  <p className="text-[#8a9bab] text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Feature Cards — Like UAE Peptides bundles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Healing & Recovery",
              description: "BPC-157, TB-500, Wolverine Stack — accelerate tissue repair and reduce inflammation.",
              href: "/products?category=Healing+%26+Recovery",
              icon: "🩹",
              color: "from-green-50 to-emerald-50 border-green-200",
            },
            {
              title: "Weight Management",
              description: "Retatrutide, Tesamorelin, 5-Amino-1MQ — advanced fat metabolism research compounds.",
              href: "/products?category=Weight+Management",
              icon: "⚖️",
              color: "from-blue-50 to-cyan-50 border-blue-200",
            },
            {
              title: "Anti-Aging & Longevity",
              description: "NAD+, GHK-Cu, MOTS-C — cellular rejuvenation and longevity pathway activation.",
              href: "/products?category=Longevity",
              icon: "🧬",
              color: "from-purple-50 to-indigo-50 border-purple-200",
            },
          ].map(({ title, description, href, icon, color }) => (
            <Link
              key={title}
              href={href}
              className={`block p-8 rounded-2xl bg-gradient-to-br ${color} border hover:shadow-lg transition-all duration-300 group`}
            >
              <span className="text-4xl block mb-4">{icon}</span>
              <h3 className="text-[#1B3A5C] text-lg font-bold mb-2 group-hover:text-brand-cyan transition-colors">
                {title}
              </h3>
              <p className="text-[#5a6f80] text-sm leading-relaxed mb-4">{description}</p>
              <span className="text-brand-cyan text-sm font-semibold flex items-center gap-1">
                Browse Products <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Welcome / About Section — Two column */}
      <section className="bg-[#f8faff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-cyan/5 rounded-3xl blur-xl" />
              <img
                src="/logo.jpg"
                alt="BioStack Peptides"
                className="relative z-10 w-full max-w-sm mx-auto"
              />
            </div>
            <div>
              <p className="text-brand-cyan text-sm font-bold tracking-wider uppercase mb-3">About BioStack</p>
              <h2 className="text-3xl font-extrabold text-[#1B3A5C] mb-6">
                Premium Peptides for<br />Serious Research
              </h2>
              <p className="text-[#5a6f80] leading-relaxed mb-6">
                BioStack Peptides is the UAE&apos;s trusted source for pharmaceutical-grade research peptides.
                Every product undergoes third-party HPLC testing to ensure ≥99% purity, with batch-specific
                Certificates of Analysis included with every order.
              </p>
              <p className="text-[#5a6f80] leading-relaxed mb-8">
                From healing compounds like BPC-157 to advanced weight management peptides like Retatrutide,
                we stock 20+ research compounds for qualified researchers. All orders ship within 24 hours
                in temperature-stable, discreet packaging.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-brand-cyan font-semibold hover:gap-3 transition-all"
              >
                Learn More About Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Banner */}
      <CountdownBanner />

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-cyan text-sm font-bold tracking-wider uppercase mb-2">Most Popular</p>
            <h2 className="text-3xl font-extrabold text-[#1B3A5C]">Best Sellers</h2>
          </div>
          <Link
            href="/products"
            className="text-brand-cyan hover:text-brand-cyan/80 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#f8faff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-cyan text-sm font-bold tracking-wider uppercase mb-2">Curated Selection</p>
              <h2 className="text-3xl font-extrabold text-[#1B3A5C]">Featured Products</h2>
            </div>
            <Link
              href="/products"
              className="text-brand-cyan hover:text-brand-cyan/80 text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-brand-cyan text-sm font-bold tracking-wider uppercase mb-2">Browse By</p>
          <h2 className="text-3xl font-extrabold text-[#1B3A5C]">Research Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: "Healing & Recovery", emoji: "🩹", count: "5 products" },
            { name: "Growth Peptides", emoji: "💪", count: "4 products" },
            { name: "Weight Management", emoji: "⚖️", count: "3 products" },
            { name: "Longevity", emoji: "🧬", count: "3 products" },
            { name: "Cognitive", emoji: "🧠", count: "3 products" },
          ].map(({ name, emoji, count }) => (
            <Link
              key={name}
              href={`/products?category=${encodeURIComponent(name)}`}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-[#e8edf2] bg-white hover:border-brand-cyan/40 hover:shadow-md transition-all duration-300 group text-center"
            >
              <span className="text-3xl">{emoji}</span>
              <div>
                <p className="text-sm font-bold text-[#1B3A5C] group-hover:text-brand-cyan transition-colors">{name}</p>
                <p className="text-xs text-[#8a9bab]">{count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why BioStack — 3 columns */}
      <section className="bg-[#1B3A5C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <p className="text-brand-cyan text-sm font-bold tracking-wider uppercase mb-2">Why Choose Us</p>
            <h2 className="text-3xl font-extrabold text-white">The BioStack Standard</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Rigorous Quality Control",
                description: "Every batch undergoes third-party HPLC testing. We publish Certificates of Analysis for every product — no exceptions.",
                icon: "🧪",
              },
              {
                title: "Expert Research Support",
                description: "Our team guides you on protocols, storage, and reconstitution. AI assistant available 24/7 for instant answers.",
                icon: "💡",
              },
              {
                title: "Fast & Discreet Shipping",
                description: "Orders ship within 24 hours in vacuum-sealed, temperature-stable packaging. Free shipping over AED 300.",
                icon: "📦",
              },
            ].map(({ title, description, icon }) => (
              <div
                key={title}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <span className="text-4xl mb-6 block">{icon}</span>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-blue-200/80 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-brand-cyan text-sm font-bold tracking-wider uppercase mb-2">Testimonials</p>
          <h2 className="text-3xl font-extrabold text-[#1B3A5C]">Trusted by Researchers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Dr. R. Hoffman",
              role: "Sports Medicine Researcher",
              text: "Consistently high purity, fast delivery, and excellent COAs. BioStack is now my go-to supplier for peptide research.",
            },
            {
              name: "J. Martinez",
              role: "Independent Researcher",
              text: "The BPC-157 and TB-500 stack has been central to my recovery research. Quality is consistently outstanding batch after batch.",
            },
            {
              name: "Dr. S. Chen",
              role: "Longevity Research Lab",
              text: "Epithalon from BioStack is the best I've sourced. The team answered all my protocol questions promptly. Highly recommended.",
            },
          ].map(({ name, role, text }) => (
            <div
              key={name}
              className="p-6 rounded-2xl border border-[#e8edf2] bg-white hover:shadow-md transition-all"
            >
              <div className="flex gap-1 mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
              </div>
              <p className="text-[#5a6f80] text-sm leading-relaxed mb-4">&ldquo;{text}&rdquo;</p>
              <div>
                <p className="text-[#1B3A5C] text-sm font-bold">{name}</p>
                <p className="text-[#8a9bab] text-xs">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1B3A5C] to-[#0B2341] p-12 lg:p-16 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-brand-cyan to-transparent" />
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-cyan/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-brand-cyan/5 rounded-full blur-3xl" />

          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 relative z-10">
            Ready to Start Your Research?
          </h2>
          <p className="text-blue-200/80 mb-8 max-w-lg mx-auto relative z-10">
            Browse our full catalog of research-grade peptides. Fast shipping, third-party
            tested, with COA on every order.
          </p>
          <Link
            href="/products"
            className="relative z-10 inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-brand-cyan text-white font-bold text-base hover:bg-brand-cyan/90 transition-all shadow-lg shadow-brand-cyan/20"
          >
            Shop All Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
