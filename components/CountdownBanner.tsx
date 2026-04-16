"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set end to next Sunday midnight
    function getNextSunday() {
      const now = new Date();
      const day = now.getDay();
      const daysUntilSunday = day === 0 ? 7 : 7 - day;
      const next = new Date(now);
      next.setDate(now.getDate() + daysUntilSunday);
      next.setHours(23, 59, 59, 0);
      return next;
    }

    const end = getNextSunday();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = end.getTime() - now;

      if (distance <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#1B3A5C] to-[#0B2341] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-brand-cyan" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Weekend Sale — Use Code BIOSTACK10</p>
            <p className="text-blue-200/70 text-xs">10% off all products. Ends Sunday.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {[
            { value: timeLeft.days, label: "D" },
            { value: timeLeft.hours, label: "H" },
            { value: timeLeft.minutes, label: "M" },
            { value: timeLeft.seconds, label: "S" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white font-extrabold text-lg">{String(value).padStart(2, "0")}</span>
              </div>
              <span className="text-blue-200/50 text-[10px]">{label}</span>
            </div>
          ))}
          <Link
            href="/products"
            className="ml-2 px-5 py-2.5 rounded-lg bg-brand-cyan text-white text-sm font-bold hover:bg-brand-cyan/90 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
