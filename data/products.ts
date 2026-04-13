export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: string;
  price: number;
  originalPrice?: number;
  sizes: string[];
  defaultSize: string;
  description: string;
  longDescription: string;
  benefits: string[];
  usage: string;
  storage: string;
  badge?: string;
  inStock: boolean;
  featured: boolean;
  image: string;
}

export const categories = [
  "All",
  "Healing & Recovery",
  "Growth Peptides",
  "Weight Management",
  "Longevity",
  "Cognitive",
];

export const products: Product[] = [
  {
    id: "1",
    slug: "bpc-157",
    name: "BPC-157",
    shortName: "BPC-157",
    category: "Healing & Recovery",
    price: 49.99,
    originalPrice: 64.99,
    sizes: ["5mg", "10mg"],
    defaultSize: "5mg",
    description: "Body Protection Compound — accelerates healing of tendons, ligaments, and gut tissue.",
    longDescription:
      "BPC-157 (Body Protection Compound-157) is a synthetic peptide derived from a protective protein found in human gastric juice. It has demonstrated remarkable regenerative properties in numerous research studies, particularly for musculoskeletal and gastrointestinal healing. Research indicates it promotes angiogenesis, modulates growth factor signaling, and exhibits neuroprotective properties.",
    benefits: [
      "Accelerates tendon and ligament healing",
      "Supports gut lining repair",
      "Reduces inflammation",
      "Promotes angiogenesis",
      "Neuroprotective properties",
    ],
    usage: "For research purposes only. Typical research protocols: 250–500mcg per administration.",
    storage: "Store lyophilized peptide at -20°C. Once reconstituted, store at 4°C and use within 30 days.",
    badge: "Best Seller",
    inStock: true,
    featured: true,
    image: "/images/bpc157.jpg",
  },
  {
    id: "2",
    slug: "tb-500",
    name: "TB-500",
    shortName: "TB-500",
    category: "Healing & Recovery",
    price: 54.99,
    sizes: ["5mg", "10mg"],
    defaultSize: "5mg",
    description: "Thymosin Beta-4 fragment — promotes cellular repair, flexibility, and recovery.",
    longDescription:
      "TB-500 is a synthetic version of the naturally occurring peptide Thymosin Beta-4, present in virtually all human and animal cells. Research suggests it plays a critical role in building new blood vessels, new muscle tissue fibers, promotes cell migration and proliferation, and reduces inflammation in injured tissue.",
    benefits: [
      "Promotes muscle repair and growth",
      "Enhances flexibility",
      "Reduces chronic inflammation",
      "Improves blood vessel formation",
      "Accelerates wound healing",
    ],
    usage: "For research purposes only. Typical research protocols: 2–2.5mg twice weekly.",
    storage: "Store lyophilized peptide at -20°C. Once reconstituted, store at 4°C and use within 30 days.",
    badge: "Popular",
    inStock: true,
    featured: true,
    image: "/images/tb500.jpg",
  },
  {
    id: "3",
    slug: "semaglutide",
    name: "Semaglutide",
    shortName: "Semaglutide",
    category: "Weight Management",
    price: 89.99,
    originalPrice: 109.99,
    sizes: ["2mg", "5mg", "10mg"],
    defaultSize: "5mg",
    description: "GLP-1 receptor agonist — research peptide for metabolic and weight studies.",
    longDescription:
      "Semaglutide is a GLP-1 (glucagon-like peptide-1) receptor agonist used in research studies related to metabolic function, appetite regulation, and weight management. It mimics the GLP-1 hormone that targets areas of the brain involved in appetite regulation and has been extensively studied for its effects on body weight and glycemic control.",
    benefits: [
      "Appetite regulation research",
      "Metabolic function studies",
      "Blood glucose research",
      "Cardiovascular research applications",
      "Weight management studies",
    ],
    usage: "For research purposes only.",
    storage: "Store at 2–8°C. Do not freeze. Protect from light.",
    badge: "New",
    inStock: true,
    featured: true,
    image: "/images/semaglutide.jpg",
  },
  {
    id: "4",
    slug: "cjc-1295",
    name: "CJC-1295 DAC",
    shortName: "CJC-1295",
    category: "Growth Peptides",
    price: 44.99,
    sizes: ["2mg", "5mg"],
    defaultSize: "2mg",
    description: "Growth hormone releasing hormone analogue — extends GH secretion window.",
    longDescription:
      "CJC-1295 DAC (with Drug Affinity Complex) is a tetrasubstituted peptide analogue of growth hormone-releasing hormone (GHRH). The DAC addition extends its half-life significantly by binding to serum albumin, allowing for less frequent dosing while maintaining elevated GH and IGF-1 levels in research subjects.",
    benefits: [
      "Sustained GH release stimulation",
      "Extended half-life vs standard GHRH",
      "IGF-1 elevation",
      "Supports muscle research protocols",
      "Fat metabolism studies",
    ],
    usage: "For research purposes only. Often studied alongside Ipamorelin.",
    storage: "Store lyophilized peptide at -20°C. Once reconstituted, store at 4°C and use within 30 days.",
    inStock: true,
    featured: false,
    image: "/images/cjc1295.jpg",
  },
  {
    id: "5",
    slug: "ipamorelin",
    name: "Ipamorelin",
    shortName: "Ipamorelin",
    category: "Growth Peptides",
    price: 39.99,
    sizes: ["2mg", "5mg"],
    defaultSize: "2mg",
    description: "Selective GH secretagogue — clean GH pulse with minimal side effect profile.",
    longDescription:
      "Ipamorelin is a third-generation GHRP (Growth Hormone Releasing Peptide) and selective agonist of the ghrelin/growth hormone secretagogue receptor. It is highly selective for GH release with minimal effect on cortisol, prolactin, or ACTH, making it one of the most studied peptides for clean GH pulse research.",
    benefits: [
      "Selective GH secretion",
      "Minimal cortisol impact",
      "Clean hormonal profile in research",
      "Synergistic with CJC-1295",
      "Recovery and repair studies",
    ],
    usage: "For research purposes only. Commonly paired with CJC-1295 DAC.",
    storage: "Store lyophilized peptide at -20°C. Once reconstituted, store at 4°C and use within 30 days.",
    inStock: true,
    featured: false,
    image: "/images/ipamorelin.jpg",
  },
  {
    id: "6",
    slug: "epithalon",
    name: "Epithalon",
    shortName: "Epithalon",
    category: "Longevity",
    price: 59.99,
    sizes: ["10mg", "20mg"],
    defaultSize: "10mg",
    description: "Telomere-activating tetrapeptide — longevity and anti-aging research.",
    longDescription:
      "Epithalon (also known as Epitalon) is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) derived from the naturally occurring polypeptide Epithalamin, produced in the pineal gland. It is primarily studied for its role in activating telomerase, an enzyme that helps maintain telomere length — a key biomarker of cellular aging.",
    benefits: [
      "Telomerase activation research",
      "Telomere length maintenance",
      "Antioxidant properties",
      "Sleep cycle regulation studies",
      "Pineal gland function research",
    ],
    usage: "For research purposes only.",
    storage: "Store lyophilized peptide at -20°C. Once reconstituted, store at 4°C and use within 30 days.",
    badge: "Premium",
    inStock: true,
    featured: true,
    image: "/images/epithalon.jpg",
  },
  {
    id: "7",
    slug: "selank",
    name: "Selank",
    shortName: "Selank",
    category: "Cognitive",
    price: 44.99,
    sizes: ["5mg"],
    defaultSize: "5mg",
    description: "Anxiolytic peptide — cognitive enhancement and stress research.",
    longDescription:
      "Selank is a synthetic heptapeptide based on the sequence of the human immunoglobulin G (IgG). It is an analogue of the endogenous tetrapeptide tuftsin, extended with the sequence Pro-Gly-Pro. Research has focused on its anxiolytic, nootropic, and immunomodulatory properties without the sedative effects associated with traditional anxiolytics.",
    benefits: [
      "Anxiolytic effects without sedation",
      "Cognitive function enhancement",
      "Memory and learning research",
      "Immune modulation studies",
      "Neuroprotective properties",
    ],
    usage: "For research purposes only.",
    storage: "Store at -20°C. Once reconstituted, store at 4°C and use within 30 days.",
    inStock: true,
    featured: false,
    image: "/images/selank.jpg",
  },
  {
    id: "8",
    slug: "tirzepatide",
    name: "Tirzepatide",
    shortName: "Tirzepatide",
    category: "Weight Management",
    price: 99.99,
    originalPrice: 124.99,
    sizes: ["5mg", "10mg"],
    defaultSize: "5mg",
    description: "Dual GIP/GLP-1 receptor agonist — next-generation metabolic research peptide.",
    longDescription:
      "Tirzepatide is a novel dual glucose-dependent insulinotropic polypeptide (GIP) and GLP-1 receptor agonist. It represents the next generation of metabolic research peptides, with research demonstrating superior outcomes in weight management and glycemic control studies compared to single-agonist approaches.",
    benefits: [
      "Dual GIP and GLP-1 receptor activation",
      "Superior metabolic research outcomes",
      "Appetite regulation studies",
      "Glycemic control research",
      "Cardiovascular studies",
    ],
    usage: "For research purposes only.",
    storage: "Store at 2–8°C. Do not freeze. Protect from light.",
    badge: "Hot",
    inStock: true,
    featured: true,
    image: "/images/tirzepatide.jpg",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter((p) => p.category === category);
}
