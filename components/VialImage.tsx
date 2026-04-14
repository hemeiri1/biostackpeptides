"use client";

interface VialImageProps {
  name: string;
  size: string;
  className?: string;
}

export default function VialImage({ name, size, className = "" }: VialImageProps) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      {/* Real vial photo */}
      <img
        src="/vial-base.jpg"
        alt={`${name} ${size}`}
        className="w-full h-full object-contain select-none"
        draggable={false}
      />

      {/* White cover over original "GH-KU 50mg" text on the label */}
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

      {/* Product name overlay - positioned on label */}
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
    </div>
  );
}
