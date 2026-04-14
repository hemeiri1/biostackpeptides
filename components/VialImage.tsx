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
        viewBox="0 0 240 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[200px] max-h-[300px]"
      >
        {/* === DARK BACKGROUND === */}
        <rect width="240" height="360" rx="12" fill="#0A0F1A" />

        {/* === GLOW EFFECT behind vial === */}
        <ellipse cx="120" cy="180" rx="70" ry="120" fill="url(#glowGrad)" opacity="0.5" />
        <ellipse cx="120" cy="300" rx="80" ry="20" fill="url(#reflectGrad)" opacity="0.3" />

        {/* === FLIP-OFF CAP (blue) === */}
        <ellipse cx="120" cy="42" rx="20" ry="4" fill="#4A7A9E" />
        <rect x="100" y="30" width="40" height="16" rx="3" fill="#5A8FB5" />
        <rect x="102" y="32" width="36" height="6" rx="2" fill="#6FA8CC" />
        <ellipse cx="120" cy="30" rx="18" ry="3" fill="#6FA8CC" />
        {/* Cap shine */}
        <rect x="106" y="33" width="10" height="4" rx="1.5" fill="rgba(255,255,255,0.2)" />

        {/* === ALUMINUM CRIMP === */}
        <rect x="96" y="46" width="48" height="14" rx="1.5" fill="#B8C4D0" />
        <rect x="96" y="46" width="48" height="4" fill="#CDD5DE" />
        <rect x="96" y="56" width="48" height="4" rx="1" fill="#A0ACB8" />
        {/* Crimp ridges */}
        {[0, 4, 8, 36, 40, 44].map((x) => (
          <line key={x} x1={98 + x} y1="50" x2={98 + x} y2="58" stroke="#929EAA" strokeWidth="0.6" />
        ))}

        {/* === GLASS NECK === */}
        <rect x="106" y="60" width="28" height="26" fill="rgba(180,210,240,0.15)" stroke="rgba(150,185,220,0.4)" strokeWidth="0.8" />
        <rect x="108" y="61" width="5" height="24" fill="rgba(255,255,255,0.08)" />

        {/* === GLASS BODY === */}
        <path
          d="M82 86 L82 290 Q82 308 100 308 L140 308 Q158 308 158 290 L158 86 Z"
          fill="rgba(160,200,240,0.08)"
          stroke="rgba(150,185,220,0.35)"
          strokeWidth="1"
        />

        {/* Left glass edge highlight */}
        <path d="M86 90 L86 286 Q86 302 98 304" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />

        {/* Center glass reflection */}
        <path d="M118 90 L118 286" stroke="rgba(255,255,255,0.04)" strokeWidth="12" />

        {/* Right glass edge */}
        <path d="M154 90 L154 286" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />

        {/* === WHITE LABEL === */}
        <rect x="87" y="120" width="66" height="140" rx="2" fill="white" />

        {/* Logo hexagon */}
        <g transform="translate(106, 126)">
          <polygon points="14,0 26,7 26,19 14,26 2,19 2,7" fill="#1B3A5C" />
          <polygon points="14,3.5 23,8 23,18 14,22.5 5,18 5,8" fill="#2D5F8A" />
          <polygon points="14,7 19,10 19,16 14,19 9,16 9,10" fill="#5B9BD5" />
          <polygon points="14,10 16,11.5 16,14.5 14,16 12,14.5 12,11.5" fill="#B0D8F5" />
        </g>

        {/* BioStack */}
        <text x="120" y="163" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="12" fontWeight="800" fill="#1B3A5C">BioStack</text>

        {/* PEPTIDES */}
        <text x="120" y="174" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="6.5" fontWeight="600" fill="#5B9BD5" letterSpacing="2.5">PEPTIDES</text>

        {/* Line */}
        <line x1="96" y1="182" x2="144" y2="182" stroke="#D0D8E0" strokeWidth="0.6" />

        {/* Product Name */}
        <text x="120" y="200" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize={name.length > 14 ? "7" : name.length > 10 ? "8.5" : "10.5"} fontWeight="800" fill="#1B3A5C">
          {name}
        </text>

        {/* Dosage */}
        <text x="120" y="215" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="11" fontWeight="700" fill="#1B3A5C">
          {size}
        </text>

        {/* Line */}
        <line x1="96" y1="224" x2="144" y2="224" stroke="#D0D8E0" strokeWidth="0.6" />

        {/* Purity */}
        <text x="120" y="236" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="4.5" fontWeight="600" fill="#8FA8C0" letterSpacing="0.3">≥99% PURITY · COA CERTIFIED</text>

        {/* === POWDER at bottom === */}
        <path d="M86 278 Q120 288 154 278 L154 290 Q154 304 140 304 L100 304 Q86 304 86 290 Z" fill="rgba(255,255,255,0.06)" />
        <ellipse cx="120" cy="278" rx="34" ry="5" fill="rgba(255,255,255,0.04)" />

        {/* === REFLECTIVE SURFACE === */}
        <line x1="30" y1="320" x2="210" y2="320" stroke="rgba(100,150,200,0.15)" strokeWidth="0.5" />
        {/* Vial reflection below */}
        <path
          d="M90 320 L90 340 Q90 345 100 345 L140 345 Q150 345 150 340 L150 320 Z"
          fill="url(#reflectionGrad)"
          opacity="0.15"
        />

        {/* === GRADIENTS === */}
        <defs>
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0066FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#0044AA" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="reflectGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0066FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="reflectionGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4488CC" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
