"use client";

interface VialImageProps {
  name: string;
  size: string;
  className?: string;
}

export default function VialImage({ name, size, className = "" }: VialImageProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[160px] max-h-[260px] drop-shadow-lg"
      >
        {/* Vial cap - blue/gray */}
        <rect x="70" y="10" width="60" height="20" rx="4" fill="#7B9AB8" />
        <rect x="74" y="6" width="52" height="10" rx="3" fill="#8FAFC8" />

        {/* Cap ring - silver */}
        <rect x="65" y="28" width="70" height="14" rx="2" fill="#C0C8D0" />
        <rect x="65" y="28" width="70" height="4" rx="1" fill="#D8DFE6" />

        {/* Vial neck */}
        <rect x="72" y="42" width="56" height="20" rx="2" fill="rgba(220,235,248,0.6)" stroke="#B8CCE0" strokeWidth="1" />

        {/* Vial body - glass effect */}
        <rect x="52" y="62" width="96" height="200" rx="8" fill="rgba(235,243,250,0.5)" stroke="#B8CCE0" strokeWidth="1.5" />

        {/* Glass shine left */}
        <rect x="56" y="66" width="8" height="190" rx="4" fill="rgba(255,255,255,0.5)" />

        {/* Glass shine right subtle */}
        <rect x="136" y="66" width="4" height="190" rx="2" fill="rgba(255,255,255,0.3)" />

        {/* Label background */}
        <rect x="60" y="100" width="80" height="130" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="0.5" />

        {/* Logo hexagon */}
        <g transform="translate(76, 108)">
          {/* Outer hexagon */}
          <polygon points="12,0 22,6 22,18 12,24 2,18 2,6" fill="#1B3A5C" />
          {/* Middle hexagon */}
          <polygon points="12,3 19,7 19,17 12,21 5,17 5,7" fill="#2D5F8A" />
          {/* Inner hexagon */}
          <polygon points="12,6 16,8.5 16,14 12,17 8,14 8,8.5" fill="#5B9BD5" />
          {/* Center */}
          <polygon points="12,9 14,10 14,13 12,14.5 10,13 10,10" fill="#A8D4F5" />
        </g>

        {/* BioStack text */}
        <text x="100" y="142" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="#1B3A5C">BioStack</text>

        {/* PEPTIDES text */}
        <text x="100" y="154" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="500" fill="#5B9BD5" letterSpacing="2">PEPTIDES</text>

        {/* Divider line */}
        <line x1="70" y1="162" x2="130" y2="162" stroke="#E2E8F0" strokeWidth="0.5" />

        {/* Product name */}
        <text x="100" y="178" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={name.length > 12 ? "8" : name.length > 8 ? "10" : "11"} fontWeight="700" fill="#1B3A5C">
          {name}
        </text>

        {/* Size/dosage */}
        <text x="100" y="192" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="600" fill="#1B3A5C">
          {size}
        </text>

        {/* Divider */}
        <line x1="70" y1="200" x2="130" y2="200" stroke="#E2E8F0" strokeWidth="0.5" />

        {/* Purity text */}
        <text x="100" y="212" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="5.5" fontWeight="500" fill="#7B9AB8" letterSpacing="0.5">≥99% PURITY · COA CERTIFIED</text>

        {/* Powder at bottom */}
        <ellipse cx="100" cy="252" rx="38" ry="6" fill="rgba(220,220,220,0.3)" />
        <rect x="62" y="240" width="76" height="14" rx="0" fill="rgba(245,245,245,0.4)" />

        {/* Vial bottom curve */}
        <path d="M52 254 Q52 270 68 270 L132 270 Q148 270 148 254" fill="rgba(235,243,250,0.3)" stroke="#B8CCE0" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
