import Link from "next/link";
import { ArrowRight, Shield, Zap, FlaskConical, Truck, Star } from "lucide-react";
import { getFeaturedProducts, getBestSellers } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const bestSellers = getBestSellers(4);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse" />
              Premium Research Grade Peptides
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Advanced{" "}
              <span className="text-gradient">Peptide</span>
              <br />
              Research Solutions
            </h1>

            <p className="text-brand-muted text-lg leading-relaxed mb-10 max-w-xl">
              Pharmaceutical-grade research peptides with rigorous quality control.
              BPC-157, TB-500, Semaglutide, and more — for serious researchers.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-cyan text-brand-darker font-semibold hover:bg-brand-cyan/90 transition-colors"
              >
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-brand-border text-gray-900 hover:border-brand-cyan/50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-brand-border bg-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, label: "99%+ Purity", sub: "Lab verified" },
              { icon: FlaskConical, label: "Research Grade", sub: "Pharmaceutical quality" },
              { icon: Truck, label: "Fast Shipping", sub: "Discreet packaging" },
              { icon: Zap, label: "Lyophilized", sub: "Extended shelf life" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-cyan" />
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-semibold">{label}</p>
                  <p className="text-brand-muted text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-brand-cyan text-sm font-medium mb-2">Top Picks</p>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          </div>
          <Link
            href="/products"
            className="text-brand-muted hover:text-brand-cyan text-sm flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-brand-cyan text-sm font-medium mb-2">Most Popular</p>
            <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
          </div>
          <Link
            href="/products"
            className="text-brand-muted hover:text-brand-cyan text-sm flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-blue-50/30 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <p className="text-brand-cyan text-sm font-medium mb-2">Shop by Category</p>
            <h2 className="text-3xl font-bold text-gray-900">Research Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: "Healing & Recovery", emoji: "🩹" },
              { name: "Growth Peptides", emoji: "💪" },
              { name: "Weight Management", emoji: "⚖️" },
              { name: "Longevity", emoji: "🔬" },
              { name: "Cognitive", emoji: "🧠" },
            ].map(({ name, emoji }) => (
              <Link
                key={name}
                href={`/products?category=${encodeURIComponent(name)}`}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border border-brand-border bg-brand-card hover:border-brand-cyan/40 hover:bg-brand-cyan/5 transition-all duration-200 group text-center"
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-sm font-medium text-brand-muted group-hover:text-gray-900 transition-colors">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why BioStack */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-brand-cyan text-sm font-medium mb-2">Why Choose Us</p>
          <h2 className="text-3xl font-bold text-gray-900">The BioStack Standard</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Rigorous Quality Control",
              description:
                "Every batch undergoes third-party HPLC testing to ensure 99%+ purity. We publish Certificates of Analysis for every product.",
              icon: "🧪",
            },
            {
              title: "Expert Support",
              description:
                "Our team includes researchers and scientists who can guide you on protocols, storage, and reconstitution for your studies.",
              icon: "💡",
            },
            {
              title: "Discreet & Fast Shipping",
              description:
                "Orders ship within 24 hours in vacuum-sealed, temperature-stable packaging. Discreet labeling on all shipments.",
              icon: "📦",
            },
          ].map(({ title, description, icon }) => (
            <div
              key={title}
              className="p-8 rounded-xl border border-brand-border bg-brand-card hover:border-brand-cyan/30 transition-colors"
            >
              <span className="text-4xl mb-6 block">{icon}</span>
              <h3 className="text-gray-900 font-semibold text-lg mb-3">{title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-blue-50/30 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <p className="text-brand-cyan text-sm font-medium mb-2">Testimonials</p>
            <h2 className="text-3xl font-bold text-gray-900">Trusted by Researchers</h2>
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
                className="p-6 rounded-xl border border-brand-border bg-brand-card"
              >
                <div className="flex gap-1 mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-brand-cyan text-brand-cyan"
                      />
                    ))}
                </div>
                <p className="text-brand-muted text-sm leading-relaxed mb-4">&ldquo;{text}&rdquo;</p>
                <div>
                  <p className="text-gray-900 text-sm font-semibold">{name}</p>
                  <p className="text-brand-muted text-xs">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative rounded-2xl border border-brand-cyan/20 bg-gradient-to-br from-brand-cyan/5 to-brand-blue/5 p-12 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-brand-cyan to-transparent" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Research?
          </h2>
          <p className="text-brand-muted mb-8 max-w-lg mx-auto">
            Browse our full catalog of research-grade peptides. Fast shipping, third-party
            tested, with COA on every order.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-brand-cyan text-brand-darker font-semibold hover:bg-brand-cyan/90 transition-colors"
          >
            Shop All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
