"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = 700;

    // DNA Helix particles
    interface Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      opacity: number;
      speed: number;
      angle: number;
      type: "helix" | "float" | "molecule";
      color: string;
    }

    const particles: Particle[] = [];

    // Create helix particles (left side)
    for (let i = 0; i < 40; i++) {
      const y = (i / 40) * height;
      particles.push({
        x: 0, y,
        baseX: width * 0.15,
        baseY: y,
        size: 3 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.4,
        speed: 0.02 + Math.random() * 0.01,
        angle: (i / 40) * Math.PI * 6,
        type: "helix",
        color: `rgba(0, 102, 255, `,
      });
      // Mirror helix
      particles.push({
        x: 0, y,
        baseX: width * 0.15,
        baseY: y,
        size: 3 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.4,
        speed: 0.02 + Math.random() * 0.01,
        angle: (i / 40) * Math.PI * 6 + Math.PI,
        type: "helix",
        color: `rgba(91, 155, 213, `,
      });
    }

    // Floating particles (background)
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        size: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.3,
        speed: 0.5 + Math.random() * 1,
        angle: Math.random() * Math.PI * 2,
        type: "float",
        color: `rgba(0, 102, 255, `,
      });
    }

    // Molecule nodes (right side)
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: width * 0.7 + Math.random() * width * 0.25,
        y: 100 + Math.random() * (height - 200),
        baseX: width * 0.7 + Math.random() * width * 0.25,
        baseY: 100 + Math.random() * (height - 200),
        size: 4 + Math.random() * 4,
        opacity: 0.2 + Math.random() * 0.3,
        speed: 0.3 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        type: "molecule",
        color: `rgba(0, 102, 255, `,
      });
    }

    let time = 0;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      time += 0.01;

      // Draw connections between nearby molecule particles
      const molecules = particles.filter(p => p.type === "molecule");
      for (let i = 0; i < molecules.length; i++) {
        for (let j = i + 1; j < molecules.length; j++) {
          const dx = molecules[i].x - molecules[j].x;
          const dy = molecules[i].y - molecules[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(molecules[i].x, molecules[i].y);
            ctx.lineTo(molecules[j].x, molecules[j].y);
            ctx.strokeStyle = `rgba(0, 102, 255, ${0.1 * (1 - dist / 200)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw helix connections
      const helixParticles = particles.filter(p => p.type === "helix");
      for (let i = 0; i < helixParticles.length - 2; i += 2) {
        // Connect rungs
        ctx.beginPath();
        ctx.moveTo(helixParticles[i].x, helixParticles[i].y);
        ctx.lineTo(helixParticles[i + 1].x, helixParticles[i + 1].y);
        ctx.strokeStyle = `rgba(0, 102, 255, 0.08)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Update and draw particles
      for (const p of particles) {
        if (p.type === "helix") {
          p.angle += p.speed;
          const helixRadius = 60;
          p.x = p.baseX + Math.cos(p.angle + time * 2) * helixRadius;
          p.y = p.baseY + Math.sin(time * 0.5) * 5;
        } else if (p.type === "float") {
          p.y -= p.speed * 0.3;
          p.x += Math.sin(time + p.angle) * 0.3;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        } else if (p.type === "molecule") {
          p.x = p.baseX + Math.sin(time * p.speed + p.angle) * 20;
          p.y = p.baseY + Math.cos(time * p.speed + p.angle) * 15;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ")";
        ctx.fill();

        // Glow effect for molecules
        if (p.type === "molecule") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          gradient.addColorStop(0, p.color + "0.1)");
          gradient.addColorStop(1, p.color + "0)");
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = 700;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative bg-[#0a1628] overflow-hidden" style={{ minHeight: "700px" }}>
      {/* Animated canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.8 }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/50 to-[#0a1628]/80" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan text-xs font-semibold mb-8 transition-all duration-1000 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-2 h-2 bg-brand-cyan rounded-full animate-pulse" />
            Premium Research Grade · ≥99% Purity
          </div>

          {/* Title */}
          <h1
            className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 transition-all duration-1000 delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Advancing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-[#5B9BD5]">
              Peptide
            </span>
            <br />
            Research
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg text-blue-200/70 leading-relaxed mb-10 max-w-lg transition-all duration-1000 delay-400 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Pharmaceutical-grade peptides for the next generation of scientific discovery.
            BPC-157, Retatrutide, NAD+, and 20+ research compounds.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-wrap gap-4 mb-12 transition-all duration-1000 delay-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-cyan text-white font-bold text-base hover:bg-brand-cyan/90 transition-all shadow-lg shadow-brand-cyan/25"
            >
              Explore Products
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/peptides"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all"
            >
              What Are Peptides?
            </Link>
          </div>

          {/* Stats */}
          <div
            className={`flex gap-10 transition-all duration-1000 delay-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {[
              { value: "20+", label: "Research Compounds" },
              { value: "99%+", label: "HPLC Purity" },
              { value: "24h", label: "UAE Shipping" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-white">{value}</p>
                <p className="text-xs text-blue-300/50 font-medium mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
