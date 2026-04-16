"use client";

interface VialImageProps {
  name: string;
  size: string;
  slug: string;
  className?: string;
}

// Default images (fallback when no size-specific image)
const PRODUCT_IMAGES: Record<string, string> = {
  "retatrutide": "/images/retatrutide-10mg.jpg",
  "bpc-157": "/images/bpc157-5mg.jpg",
  "tb-500": "/images/tb500-5mg.jpg",
  "ghk-cu": "/images/ghkcu-50mg.jpg",
  "mots-c": "/images/motsc-10mg.jpg",
  "dsip": "/images/dsip-5mg.jpg",
  "semax": "/images/semax-5mg.jpg",
  "selank": "/images/selank-5mg.jpg",
  "cjc-1295": "/images/cjc1295-2mg.jpg",
  "5-amino-1mq": "/images/5amino1mq-5mg.jpg",
  "kpv": "/images/kpv-10mg.jpg",
  "igf-1-lr3": "/images/igf1lr3-1mg.jpg",
  "ghrp-6": "/images/ghrp6-5mg.jpg",
  "nad-plus": "/images/nad-100mg.jpg",
  "cjc-ipamorelin": "/images/cjcipa.jpg",
  "tesamorelin": "/images/tesamorelin-10mg.jpg",
  "glow-stack": "/images/glowstack-70mg.jpg",
  "klow-stack": "/images/klowstack-80mg.jpg",
  "wolverine-stack": "/images/wolverinestack-10mg.jpg",
  "bac-water": "/images/bacwater-3ml.jpg",
};

// Size-specific images
const SIZE_IMAGES: Record<string, Record<string, string>> = {
  "bpc-157": {
    "5mg": "/images/bpc157-5mg.jpg",
    "10mg": "/images/bpc157-10mg.jpg",
  },
  "retatrutide": {
    "10mg": "/images/retatrutide-10mg.jpg",
    "20mg": "/images/retatrutide-20mg.jpg",
  },
  "tb-500": {
    "5mg": "/images/tb500-5mg.jpg",
    "10mg": "/images/tb500-10mg.jpg",
  },
  "ghk-cu": {
    "50mg": "/images/ghkcu-50mg.jpg",
    "100mg": "/images/ghkcu-100mg.jpg",
  },
  "nad-plus": {
    "100mg": "/images/nad-100mg.jpg",
    "500mg": "/images/nad-500mg.jpg",
  },
  "mots-c": {
    "10mg": "/images/motsc-10mg.jpg",
    "40mg": "/images/motsc-40mg.jpg",
  },
  "dsip": {
    "5mg": "/images/dsip-5mg.jpg",
    "10mg": "/images/dsip-10mg.jpg",
  },
  "semax": {
    "5mg": "/images/semax-5mg.jpg",
    "10mg": "/images/semax-10mg.jpg",
  },
  "selank": {
    "5mg": "/images/selank-5mg.jpg",
    "10mg": "/images/selank-10mg.jpg",
  },
  "cjc-1295": {
    "2mg": "/images/cjc1295-2mg.jpg",
    "5mg": "/images/cjc1295-5mg.jpg",
    "10mg": "/images/cjc1295-10mg.jpg",
  },
  "5-amino-1mq": {
    "5mg": "/images/5amino1mq-5mg.jpg",
    "50mg": "/images/5amino1mq-50mg.jpg",
  },
  "tesamorelin": {
    "10mg": "/images/tesamorelin-10mg.jpg",
    "20mg": "/images/tesamorelin-20mg.jpg",
  },
  "bac-water": {
    "3ml": "/images/bacwater-3ml.jpg",
    "10ml": "/images/bacwater-10ml.jpg",
  },
  "kpv": {
    "10mg": "/images/kpv-10mg.jpg",
  },
  "igf-1-lr3": {
    "1mg": "/images/igf1lr3-1mg.jpg",
  },
  "ghrp-6": {
    "5mg": "/images/ghrp6-5mg.jpg",
  },
  "wolverine-stack": {
    "10mg": "/images/wolverinestack-10mg.jpg",
  },
  "glow-stack": {
    "70mg": "/images/glowstack-70mg.jpg",
  },
  "klow-stack": {
    "80mg": "/images/klowstack-80mg.jpg",
  },
};

export default function VialImage({ name, size, slug, className = "" }: VialImageProps) {
  const sizeImage = size && SIZE_IMAGES[slug]?.[size];
  const imageSrc = sizeImage || PRODUCT_IMAGES[slug] || "/vial-base.jpg";

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-24 h-24 bg-brand-cyan/5 rounded-full blur-2xl" />
      </div>
      <img
        src={imageSrc}
        alt={`${name} ${size}`}
        className="w-full h-full object-contain select-none drop-shadow-lg relative z-10"
        draggable={false}
      />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-3 bg-black/5 rounded-full blur-md z-0" />
    </div>
  );
}
