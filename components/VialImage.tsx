"use client";

interface VialImageProps {
  name: string;
  size: string;
  slug: string;
  className?: string;
}

const PRODUCT_IMAGES: Record<string, string> = {
  "retatrutide": "/images/retatrutide.jpg",
};

export default function VialImage({ name, size, slug, className = "" }: VialImageProps) {
  const hasCustomImage = slug in PRODUCT_IMAGES;
  const imageSrc = hasCustomImage ? PRODUCT_IMAGES[slug] : "/vial-base.jpg";

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={`${name} ${size}`}
        className="w-full h-full object-contain select-none"
        draggable={false}
      />

      {/* Only overlay text on the base vial photo */}
      {!hasCustomImage && (
        <>
          <div
            className="absolute"
            style={{
              top: "53.5%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "28%",
              height: "8%",
              backgroundColor: "white",
            }}
          />
          <div
            className="absolute flex flex-col items-start justify-center pointer-events-none"
            style={{
              top: "53%",
              left: "37%",
              width: "30%",
              height: "9%",
            }}
          >
            <p
              className="font-extrabold leading-none"
              style={{
                color: "#1B3A5C",
                fontSize: name.length > 14 ? "0.45rem" : name.length > 10 ? "0.55rem" : "0.65rem",
              }}
            >
              {name} {size}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
