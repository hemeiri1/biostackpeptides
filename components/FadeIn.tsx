"use client";

import { useRef, useState, useEffect } from "react";

interface FadeInProps {
  children: React.ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
}

export default function FadeIn({ children, direction = "up", delay = 0, className = "" }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const transforms = {
    up: "translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${transforms[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
}
