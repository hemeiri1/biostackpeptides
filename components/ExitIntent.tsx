"use client";

import { useState, useEffect } from "react";
import { X, Tag } from "lucide-react";

export default function ExitIntent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const shown = localStorage.getItem("biostack-exit-shown");
    if (shown) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY < 10) {
        setShow(true);
        localStorage.setItem("biostack-exit-shown", "true");
        document.removeEventListener("mouseout", handleMouseLeave);
      }
    }

    // Only trigger after 10 seconds on site
    const timer = setTimeout(() => {
      document.addEventListener("mouseout", handleMouseLeave);
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShow(false)}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-[#1B3A5C] to-[#0B2341] p-8 text-center relative">
          <button onClick={() => setShow(false)} className="absolute top-3 right-3 text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
          <Tag className="w-10 h-10 text-brand-cyan mx-auto mb-3" />
          <h2 className="text-2xl font-extrabold text-white mb-2">Wait! Don&apos;t Leave Empty-Handed</h2>
          <p className="text-blue-200 text-sm">Here&apos;s a special offer just for you</p>
        </div>
        <div className="p-8 text-center">
          <div className="inline-block px-6 py-3 rounded-xl bg-brand-cyan/10 border-2 border-dashed border-brand-cyan mb-4">
            <p className="text-brand-cyan text-2xl font-extrabold tracking-widest">BIOSTACK10</p>
          </div>
          <p className="text-[#1B3A5C] font-bold text-lg mb-1">10% OFF Your First Order</p>
          <p className="text-[#5a6f80] text-sm mb-6">Use code at checkout. Valid on all products.</p>
          <a
            href="/products"
            className="block w-full py-3 rounded-xl bg-brand-cyan text-white font-bold hover:bg-brand-cyan/90 transition-colors"
          >
            Shop Now
          </a>
          <button onClick={() => setShow(false)} className="text-[#8a9bab] text-xs mt-4 hover:text-[#5a6f80] transition-colors">
            No thanks, I&apos;ll pay full price
          </button>
        </div>
      </div>
    </div>
  );
}
