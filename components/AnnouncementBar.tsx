"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const messages = [
  "Free Shipping on Orders Over AED 300",
  "Use Code BIOSTACK10 for 10% Off Your First Order",
  "Free BAC Water on Orders Over AED 500",
  "≥99% Purity — COA Certified on Every Product",
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const hidden = localStorage.getItem("biostack-announcement-hidden");
    if (!hidden) setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible]);

  function handleClose() {
    setVisible(false);
    localStorage.setItem("biostack-announcement-hidden", "true");
  }

  if (!visible) return null;

  return (
    <div className="bg-[#1B3A5C] text-white py-2 px-4 text-xs text-center relative z-[60]">
      <span
        className="transition-opacity duration-400"
        style={{ opacity: fade ? 1 : 0 }}
      >
        {messages[index]}
      </span>
      <button
        onClick={handleClose}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
