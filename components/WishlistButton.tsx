"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export function getWishlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem("biostack-wishlist") || "[]");
  } catch {
    return [];
  }
}

function saveWishlist(list: string[]) {
  localStorage.setItem("biostack-wishlist", JSON.stringify(list));
}

export default function WishlistButton({ productId, size = "sm" }: { productId: string; size?: "sm" | "lg" }) {
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setWishlisted(getWishlist().includes(productId));
  }, [productId]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const list = getWishlist();
    if (list.includes(productId)) {
      saveWishlist(list.filter((id) => id !== productId));
      setWishlisted(false);
    } else {
      saveWishlist([...list, productId]);
      setWishlisted(true);
    }
  }

  const sizeClasses = size === "lg" ? "w-10 h-10" : "w-8 h-8";
  const iconSize = size === "lg" ? "w-5 h-5" : "w-4 h-4";

  return (
    <button
      onClick={toggle}
      className={`${sizeClasses} rounded-full flex items-center justify-center transition-all ${
        wishlisted
          ? "bg-red-50 text-red-500 border border-red-200"
          : "bg-white/80 text-[#8a9bab] border border-[#e8edf2] hover:text-red-400 hover:border-red-200"
      }`}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`${iconSize} ${wishlisted ? "fill-red-500" : ""}`} />
    </button>
  );
}
