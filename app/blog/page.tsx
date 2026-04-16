import Link from "next/link";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

const articles = [
  {
    slug: "bpc-157-complete-guide",
    title: "BPC-157: The Complete Research Guide",
    excerpt: "Everything researchers need to know about BPC-157 — mechanisms, stability, reconstitution, and the latest studies on tissue healing.",
    category: "Peptide Guide",
    readTime: "8 min",
    date: "April 12, 2026",
    image: "/images/bpc157.jpg",
  },
  {
    slug: "reconstitution-guide",
    title: "How to Reconstitute Peptides — Step by Step",
    excerpt: "A visual guide to properly reconstituting lyophilized peptides with bacteriostatic water. Avoid common mistakes that compromise results.",
    category: "Lab Guide",
    readTime: "5 min",
    date: "April 8, 2026",
    image: "/images/bacwater.jpg",
  },
  {
    slug: "best-healing-peptides",
    title: "Top 5 Peptides for Healing Research in 2026",
    excerpt: "Comparing BPC-157, TB-500, KPV, GHK-Cu, and Wolverine Stack — which healing peptide is right for your research goals?",
    category: "Comparison",
    readTime: "6 min",
    date: "April 5, 2026",
    image: "/images/wolverinestack.jpg",
  },
  {
    slug: "nad-longevity",
    title: "NAD+ and the Science of Longevity",
    excerpt: "Why NAD+ is at the center of aging research. How it activates sirtuins, repairs DNA, and restores mitochondrial function.",
    category: "Research",
    readTime: "7 min",
    date: "March 28, 2026",
    image: "/images/nad.jpg",
  },
  {
    slug: "peptide-storage-guide",
    title: "Peptide Storage: How to Maintain Potency",
    excerpt: "Temperature requirements, light exposure, and shelf life — everything you need to know to keep your peptides stable.",
    category: "Lab Guide",
    readTime: "4 min",
    date: "March 22, 2026",
    image: "/images/dsip.jpg",
  },
  {
    slug: "weight-loss-peptides",
    title: "Retatrutide vs Semaglutide: What Researchers Need to Know",
    excerpt: "A deep comparison of the two most studied weight management peptides — mechanisms, potency, and research applications.",
    category: "Comparison",
    readTime: "9 min",
    date: "March 15, 2026",
    image: "/images/retatrutide.jpg",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/20 bg-white text-brand-cyan text-xs font-semibold mb-4 shadow-sm">
          <BookOpen className="w-3.5 h-3.5" />
          Research Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B3A5C] mb-3">Articles & Guides</h1>
        <p className="text-[#5a6f80] max-w-xl mx-auto">Research guides, peptide comparisons, and lab protocols to support your work.</p>
      </div>

      {/* Featured article */}
      <Link href={`/peptides`} className="block mb-12 group">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl border border-[#e8edf2] bg-white hover:shadow-lg transition-all">
          <div className="bg-gradient-to-b from-slate-50 to-white rounded-xl h-64 flex items-center justify-center overflow-hidden">
            <img src="/images/bpc157.jpg" alt="Featured" className="h-56 object-contain group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-brand-cyan text-xs font-bold uppercase tracking-wider mb-2">Featured Guide</span>
            <h2 className="text-2xl font-extrabold text-[#1B3A5C] mb-3 group-hover:text-brand-cyan transition-colors">What Are Peptides? — Complete Guide</h2>
            <p className="text-[#5a6f80] text-sm leading-relaxed mb-4">A comprehensive introduction to peptides — what they are, how they work, categories, reconstitution, storage, and why purity matters in research.</p>
            <span className="text-brand-cyan font-semibold text-sm flex items-center gap-1">Read Full Guide <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </div>
        </div>
      </Link>

      {/* Article grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article.slug} href="/peptides" className="group block">
            <div className="rounded-2xl border border-[#e8edf2] bg-white overflow-hidden hover:shadow-lg hover:border-brand-cyan/30 transition-all h-full flex flex-col">
              <div className="bg-gradient-to-b from-slate-50 to-white h-44 flex items-center justify-center overflow-hidden p-4">
                <img src={article.image} alt={article.title} className="h-36 object-contain group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider">{article.category}</span>
                  <span className="flex items-center gap-1 text-[10px] text-[#8a9bab]"><Clock className="w-3 h-3" /> {article.readTime}</span>
                </div>
                <h3 className="text-[#1B3A5C] font-bold text-base mb-2 group-hover:text-brand-cyan transition-colors leading-snug">{article.title}</h3>
                <p className="text-[#5a6f80] text-xs leading-relaxed flex-1">{article.excerpt}</p>
                <p className="text-[10px] text-[#8a9bab] mt-3">{article.date}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
