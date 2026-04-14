"use client";

interface VialImageProps {
  name: string;
  size: string;
  slug: string;
  className?: string;
}

const PRODUCT_IMAGES: Record<string, string> = {
  "retatrutide": "/images/retatrutide.jpg",
  "bpc-157": "/images/bpc157.jpg",
  "tb-500": "/images/tb500.jpg",
  "ghk-cu": "/images/ghkcu.jpg",
  "mots-c": "/images/motsc.jpg",
  "dsip": "/images/dsip.jpg",
  "semax": "/images/semax.jpg",
  "selank": "/images/selank.jpg",
  "cjc-1295": "/images/cjc1295.jpg",
  "5-amino-1mq": "/images/5amino1mq.jpg",
  "kpv": "/images/kpv.jpg",
  "igf-1-lr3": "/images/igf1lr3.jpg",
  "ghrp-6": "/images/ghrp6.jpg",
  "nad-plus": "/images/nad.jpg",
  "cjc-ipamorelin": "/images/ipamorelin.jpg",
  "tesamorelin": "/images/tesamorelin.jpg",
  "glow-stack": "/images/glowstack.jpg",
  "klow-stack": "/images/klowstack.jpg",
  "wolverine-stack": "/images/wolverinestack.jpg",
  "bac-water": "/images/bacwater.jpg",
};

export default function VialImage({ name, size, slug, className = "" }: VialImageProps) {
  const imageSrc = PRODUCT_IMAGES[slug] || "/vial-base.jpg";

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={`${name} ${size}`}
        className="w-full h-full object-contain select-none"
        draggable={false}
      />
    </div>
  );
}
