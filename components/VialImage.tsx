"use client";

interface VialImageProps {
  name: string;
  size: string;
  className?: string;
}

export default function VialImage({ name, size, className = "" }: VialImageProps) {
  const displayName = `${name} ${size}`;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 260 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[220px] max-h-[300px]"
      >
        {/* === SOFT BLUE-GRAY BACKGROUND === */}
        <rect width="260" height="340" rx="8" fill="#C8D5E0" />
        {/* Lighter center area */}
        <ellipse cx="130" cy="170" rx="100" ry="140" fill="#D4DFE8" opacity="0.7" />
        {/* Surface / table */}
        <rect x="0" y="280" width="260" height="60" rx="0" fill="#BCC9D4" />
        <line x1="0" y1="280" x2="260" y2="280" stroke="#B0BDC8" strokeWidth="0.5" />

        {/* === SHADOW under vial === */}
        <ellipse cx="130" cy="278" rx="40" ry="5" fill="rgba(0,0,0,0.08)" />

        {/* === BLUE RUBBER STOPPER CAP (flat) === */}
        <ellipse cx="130" cy="36" rx="22" ry="5" fill="#7A94AC" />
        <rect x="108" y="24" width="44" height="14" rx="2" fill="#8BA3B8" />
        <ellipse cx="130" cy="24" rx="22" ry="4" fill="#96AEC2" />
        {/* Cap top highlight */}
        <ellipse cx="124" cy="24" rx="8" ry="2" fill="rgba(255,255,255,0.2)" />

        {/* === ALUMINUM CRIMP SEAL === */}
        <rect x="104" y="38" width="52" height="14" rx="1" fill="#C8CED5" />
        <rect x="104" y="38" width="52" height="3" fill="#D8DEE4" />
        <rect x="104" y="49" width="52" height="3" rx="0.5" fill="#B0B8C2" />
        {/* Crimp edge details */}
        <rect x="102" y="44" width="56" height="2" fill="#BCC4CC" />

        {/* === GLASS NECK === */}
        <rect x="112" y="52" width="36" height="24" fill="rgba(210,225,240,0.3)" stroke="rgba(180,200,220,0.5)" strokeWidth="0.8" />
        {/* Neck left shine */}
        <rect x="114" y="53" width="5" height="22" fill="rgba(255,255,255,0.2)" />
        {/* Neck right edge */}
        <rect x="143" y="53" width="2" height="22" fill="rgba(255,255,255,0.1)" />

        {/* === GLASS BODY === */}
        <path
          d="M92 76 L92 268 Q92 278 104 278 L156 278 Q168 278 168 268 L168 76 Z"
          fill="rgba(215,230,245,0.2)"
          stroke="rgba(170,195,220,0.45)"
          strokeWidth="1"
        />

        {/* Left glass reflection (bright) */}
        <path d="M96 80 L96 264 Q96 274 104 276" stroke="rgba(255,255,255,0.3)" strokeWidth="5" />

        {/* Center broad highlight */}
        <rect x="120" y="80" width="16" height="190" fill="rgba(255,255,255,0.07)" />

        {/* Right glass edge highlight */}
        <path d="M164 80 L164 264" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />

        {/* === WHITE LABEL === */}
        <rect x="96" y="130" width="68" height="112" rx="2" fill="white" />

        {/* --- Label content: Logo + BioStack side by side --- */}
        {/* Hexagon logo */}
        <g transform="translate(102, 136)">
          <polygon points="10,0 18,5 18,15 10,20 2,15 2,5" fill="#1B3A5C" />
          <polygon points="10,3 16,6.5 16,13.5 10,17 4,13.5 4,6.5" fill="#2D5F8A" />
          <polygon points="10,6 14,8.5 14,12 10,14.5 6,12 6,8.5" fill="#5B9BD5" />
          <polygon points="10,8.5 12,9.8 12,12 10,13 8,12 8,9.8" fill="#A8D4F5" />
        </g>

        {/* BioStack text (right of logo) */}
        <text x="126" y="147" fontFamily="system-ui, -apple-system, sans-serif" fontSize="11" fontWeight="800" fill="#1B3A5C">BioStack</text>

        {/* PEPTIDES */}
        <text x="126" y="157" fontFamily="system-ui, -apple-system, sans-serif" fontSize="6" fontWeight="600" fill="#5B9BD5" letterSpacing="1.5">PEPTIDES</text>

        {/* Separator line */}
        <line x1="102" y1="166" x2="158" y2="166" stroke="#E0E4E8" strokeWidth="0.6" />

        {/* Product name + size */}
        <text x="130" y="184" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize={displayName.length > 16 ? "7.5" : displayName.length > 12 ? "9" : "10.5"} fontWeight="800" fill="#1B3A5C">
          {name}
        </text>
        <text x="130" y="198" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="10" fontWeight="700" fill="#1B3A5C">
          {size}
        </text>

        {/* Separator */}
        <line x1="102" y1="206" x2="158" y2="206" stroke="#E0E4E8" strokeWidth="0.6" />

        {/* Purity text */}
        <text x="130" y="218" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="4.2" fontWeight="600" fill="#8A9AAC" letterSpacing="0.2">≥99% PURITY · COA CERTIFIED</text>

        {/* === WHITE POWDER at bottom === */}
        <ellipse cx="130" cy="258" rx="32" ry="6" fill="rgba(240,240,245,0.5)" />
        <rect x="98" y="248" width="64" height="12" fill="rgba(245,245,248,0.35)" />

        {/* === BOTTOM OF VIAL (curved glass) === */}
        <path d="M92 268 Q92 278 104 278 L156 278 Q168 278 168 268" fill="none" stroke="rgba(170,195,220,0.45)" strokeWidth="1" />

        {/* === SUBTLE VIAL REFLECTION on surface === */}
        <path
          d="M100 282 L100 300 Q100 305 108 305 L152 305 Q160 305 160 300 L160 282 Z"
          fill="rgba(170,195,220,0.08)"
        />
      </svg>
    </div>
  );
}
