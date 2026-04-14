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
        viewBox="0 0 180 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[150px] max-h-[280px]"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.12))" }}
      >
        {/* === FLIP-OFF CAP (blue) === */}
        <ellipse cx="90" cy="12" rx="24" ry="5" fill="#5A7FA0" />
        <rect x="66" y="8" width="48" height="22" rx="3" fill="#6B92B5" />
        <rect x="68" y="10" width="44" height="8" rx="2" fill="#7DA5C4" />
        <ellipse cx="90" cy="30" rx="24" ry="4" fill="#5A7FA0" />
        {/* Cap highlight */}
        <rect x="74" y="12" width="12" height="6" rx="2" fill="rgba(255,255,255,0.25)" />

        {/* === ALUMINUM CRIMP SEAL === */}
        <rect x="60" y="32" width="60" height="16" rx="2" fill="#C5CDD5" />
        <rect x="60" y="32" width="60" height="5" rx="1" fill="#D8DFE6" />
        <rect x="60" y="44" width="60" height="4" rx="1" fill="#B0B9C4" />
        {/* Crimp ridges */}
        <line x1="62" y1="38" x2="62" y2="46" stroke="#AAB4BE" strokeWidth="0.5" />
        <line x1="66" y1="38" x2="66" y2="46" stroke="#AAB4BE" strokeWidth="0.5" />
        <line x1="70" y1="38" x2="70" y2="46" stroke="#AAB4BE" strokeWidth="0.5" />
        <line x1="110" y1="38" x2="110" y2="46" stroke="#AAB4BE" strokeWidth="0.5" />
        <line x1="114" y1="38" x2="114" y2="46" stroke="#AAB4BE" strokeWidth="0.5" />
        <line x1="118" y1="38" x2="118" y2="46" stroke="#AAB4BE" strokeWidth="0.5" />

        {/* === GLASS NECK === */}
        <rect x="72" y="48" width="36" height="30" fill="rgba(220,235,248,0.4)" stroke="#C8D8E8" strokeWidth="1" />
        {/* Neck shine */}
        <rect x="75" y="49" width="6" height="28" fill="rgba(255,255,255,0.3)" />

        {/* === GLASS BODY === */}
        {/* Main body */}
        <path d="M50 78 L50 290 Q50 310 70 310 L110 310 Q130 310 130 290 L130 78 Z" fill="rgba(230,240,250,0.35)" stroke="#C0D0E0" strokeWidth="1.2" />

        {/* Left glass reflection */}
        <path d="M54 82 L54 286 Q54 302 66 306" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="6" />

        {/* Right subtle reflection */}
        <path d="M126 82 L126 286" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />

        {/* === WHITE LABEL === */}
        <rect x="55" y="120" width="70" height="140" rx="3" fill="white" stroke="#E8ECF0" strokeWidth="0.8" />

        {/* Logo hexagon */}
        <g transform="translate(74, 128)">
          <polygon points="16,0 28,7 28,21 16,28 4,21 4,7" fill="#1B3A5C" />
          <polygon points="16,4 25,9 25,19 16,24 7,19 7,9" fill="#2D5F8A" />
          <polygon points="16,8 21,11 21,17 16,20 11,17 11,11" fill="#5B9BD5" />
          <polygon points="16,11 18,12.5 18,15.5 16,17 14,15.5 14,12.5" fill="#A8D4F5" />
        </g>

        {/* BioStack text */}
        <text x="90" y="168" textAnchor="middle" fontFamily="system-ui, Arial, sans-serif" fontSize="13" fontWeight="800" fill="#1B3A5C">BioStack</text>

        {/* PEPTIDES text */}
        <text x="90" y="180" textAnchor="middle" fontFamily="system-ui, Arial, sans-serif" fontSize="7.5" fontWeight="600" fill="#5B9BD5" letterSpacing="3">PEPTIDES</text>

        {/* Separator line */}
        <line x1="66" y1="188" x2="114" y2="188" stroke="#E2E8F0" strokeWidth="0.8" />

        {/* Product name */}
        <text x="90" y="206" textAnchor="middle" fontFamily="system-ui, Arial, sans-serif" fontSize={name.length > 14 ? "7.5" : name.length > 10 ? "9" : "11"} fontWeight="800" fill="#1B3A5C">
          {name}
        </text>

        {/* Dosage */}
        <text x="90" y="222" textAnchor="middle" fontFamily="system-ui, Arial, sans-serif" fontSize="12" fontWeight="700" fill="#1B3A5C">
          {size}
        </text>

        {/* Separator */}
        <line x1="66" y1="232" x2="114" y2="232" stroke="#E2E8F0" strokeWidth="0.8" />

        {/* Purity text */}
        <text x="90" y="244" textAnchor="middle" fontFamily="system-ui, Arial, sans-serif" fontSize="5" fontWeight="600" fill="#8FA8C0" letterSpacing="0.3">≥99% PURITY · COA CERTIFIED</text>

        {/* === POWDER at bottom === */}
        <path d="M54 280 Q90 290 126 280 L126 290 Q126 306 110 306 L70 306 Q54 306 54 290 Z" fill="rgba(240,240,240,0.5)" />
        <ellipse cx="90" cy="280" rx="36" ry="5" fill="rgba(230,230,230,0.4)" />

        {/* === Bottom of vial (curved glass) === */}
        <path d="M50 290 Q50 310 70 310 L110 310 Q130 310 130 290" fill="none" stroke="#C0D0E0" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
