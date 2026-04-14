"use client";

interface VialImageProps {
  name: string;
  size: string;
  className?: string;
}

export default function VialImage({ name, size, className = "" }: VialImageProps) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      {/* Real vial photo as background */}
      <img
        src="/vial-base.jpg"
        alt={`${name} ${size} vial`}
        className="w-full h-full object-contain"
        draggable={false}
      />
      {/* Product name + dosage overlay on the label area */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="mt-[18%] text-center">
          <p
            className="font-extrabold text-[#1B3A5C] leading-tight"
            style={{ fontSize: name.length > 14 ? "0.55rem" : name.length > 10 ? "0.65rem" : "0.75rem" }}
          >
            {name}
          </p>
          <p className="font-bold text-[#1B3A5C] text-[0.7rem] leading-tight mt-0.5">
            {size}
          </p>
        </div>
      </div>
    </div>
  );
}
