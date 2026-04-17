"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Amino acid abbreviations
const AMINO_ACIDS = ["Ala", "Arg", "Asn", "Asp", "Cys", "Glu", "Gly", "His", "Ile", "Leu", "Lys", "Met", "Phe", "Pro", "Ser", "Thr", "Trp", "Tyr", "Val"];
const PEPTIDE_NAMES = ["BPC-157", "TB-500", "GHK-Cu", "NAD+", "MOTS-C", "DSIP", "Semax", "Selank", "KPV", "IGF-1"];

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
    let height = canvas.height = 750;
    let mouse = { x: width / 2, y: height / 2 };

    // Track mouse for interactive effects
    function handleMouse(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    canvas.addEventListener("mousemove", handleMouse);

    // Peptide chain nodes
    interface ChainNode {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      label: string;
      color: string;
      pulse: number;
      pulseSpeed: number;
    }

    // Floating elements
    interface FloatElement {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      type: "circle" | "hex" | "ring" | "text";
      label?: string;
      rotation: number;
      rotSpeed: number;
      color: string;
    }

    // Create a peptide chain across the screen
    const chainNodes: ChainNode[] = [];
    const chainLength = 12;
    const chainStartX = width * 0.05;
    const chainEndX = width * 0.95;

    for (let i = 0; i < chainLength; i++) {
      const t = i / (chainLength - 1);
      const x = chainStartX + t * (chainEndX - chainStartX);
      const waveY = Math.sin(t * Math.PI * 2) * 40;
      chainNodes.push({
        x, y: height * 0.5 + waveY,
        targetX: x,
        targetY: height * 0.5 + waveY,
        size: 14 + Math.random() * 6,
        label: AMINO_ACIDS[Math.floor(Math.random() * AMINO_ACIDS.length)],
        color: i % 3 === 0 ? "#0066FF" : i % 3 === 1 ? "#5B9BD5" : "#3B82F6",
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      });
    }

    // Floating background elements
    const floats: FloatElement[] = [];

    // Hexagonal molecular structures
    for (let i = 0; i < 8; i++) {
      floats.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 20 + Math.random() * 30,
        opacity: 0.05 + Math.random() * 0.08,
        type: "hex",
        rotation: Math.random() * Math.PI,
        rotSpeed: 0.003 + Math.random() * 0.005,
        color: "#0066FF",
      });
    }

    // Ring structures (like benzene rings)
    for (let i = 0; i < 6; i++) {
      floats.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: 30 + Math.random() * 40,
        opacity: 0.04 + Math.random() * 0.06,
        type: "ring",
        rotation: Math.random() * Math.PI,
        rotSpeed: 0.002 + Math.random() * 0.004,
        color: "#5B9BD5",
      });
    }

    // Floating amino acid text labels
    for (let i = 0; i < 15; i++) {
      floats.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.3,
        size: 10,
        opacity: 0.08 + Math.random() * 0.12,
        type: "text",
        label: Math.random() > 0.5 ? AMINO_ACIDS[Math.floor(Math.random() * AMINO_ACIDS.length)] : PEPTIDE_NAMES[Math.floor(Math.random() * PEPTIDE_NAMES.length)],
        rotation: 0,
        rotSpeed: 0,
        color: "#0066FF",
      });
    }

    // Small particles
    for (let i = 0; i < 80; i++) {
      floats.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.3 - Math.random() * 0.5,
        size: 1 + Math.random() * 2.5,
        opacity: 0.1 + Math.random() * 0.3,
        type: "circle",
        rotation: 0,
        rotSpeed: 0,
        color: Math.random() > 0.5 ? "#0066FF" : "#5B9BD5",
      });
    }

    let time = 0;

    function drawHexagon(cx: number, cy: number, size: number, rotation: number) {
      if (!ctx) return;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rotation;
        const x = cx + size * Math.cos(angle);
        const y = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      // === BACKGROUND FLOATING ELEMENTS ===
      for (const f of floats) {
        f.x += f.vx;
        f.y += f.vy;
        f.rotation += f.rotSpeed;

        // Wrap around
        if (f.y < -50) { f.y = height + 50; f.x = Math.random() * width; }
        if (f.x < -50) f.x = width + 50;
        if (f.x > width + 50) f.x = -50;

        // Mouse repulsion (subtle)
        const dx = f.x - mouse.x;
        const dy = f.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          f.x += (dx / dist) * 0.5;
          f.y += (dy / dist) * 0.5;
        }

        if (f.type === "hex") {
          drawHexagon(f.x, f.y, f.size, f.rotation);
          ctx.strokeStyle = `rgba(0, 102, 255, ${f.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Inner hex
          drawHexagon(f.x, f.y, f.size * 0.5, f.rotation + 0.5);
          ctx.strokeStyle = `rgba(0, 102, 255, ${f.opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (f.type === "ring") {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(91, 155, 213, ${f.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Double ring
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size * 0.7, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(91, 155, 213, ${f.opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          // Bond lines
          for (let i = 0; i < 3; i++) {
            const a = f.rotation + (Math.PI * 2 / 3) * i;
            ctx.beginPath();
            ctx.moveTo(f.x + Math.cos(a) * f.size * 0.7, f.y + Math.sin(a) * f.size * 0.7);
            ctx.lineTo(f.x + Math.cos(a) * f.size, f.y + Math.sin(a) * f.size);
            ctx.strokeStyle = `rgba(91, 155, 213, ${f.opacity * 0.3})`;
            ctx.stroke();
          }
        } else if (f.type === "text" && f.label) {
          ctx.font = "11px monospace";
          ctx.fillStyle = `rgba(0, 102, 255, ${f.opacity})`;
          ctx.fillText(f.label, f.x, f.y);
        } else if (f.type === "circle") {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 102, 255, ${f.opacity})`;
          ctx.fill();
        }
      }

      // === PEPTIDE CHAIN ===
      // Update chain wave
      for (let i = 0; i < chainNodes.length; i++) {
        const node = chainNodes[i];
        const t = i / (chainLength - 1);
        node.targetY = height * 0.48 + Math.sin(t * Math.PI * 2 + time * 3) * 35;
        node.x += (node.targetX - node.x) * 0.05;
        node.y += (node.targetY - node.y) * 0.05;
        node.pulse += node.pulseSpeed;
      }

      // Draw peptide bonds (connections)
      for (let i = 0; i < chainNodes.length - 1; i++) {
        const a = chainNodes[i];
        const b = chainNodes[i + 1];
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2 - 15;

        // Curved bond
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(midX, midY, b.x, b.y);
        ctx.strokeStyle = `rgba(0, 102, 255, 0.25)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Peptide bond label
        if (i % 2 === 0) {
          ctx.font = "9px monospace";
          ctx.fillStyle = "rgba(91, 155, 213, 0.3)";
          ctx.fillText("—C—N—", midX - 15, midY - 5);
        }
      }

      // Draw chain nodes (amino acids)
      for (const node of chainNodes) {
        const pulseSize = node.size + Math.sin(node.pulse) * 3;

        // Outer glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulseSize * 2.5);
        gradient.addColorStop(0, node.color + "15");
        gradient.addColorStop(1, node.color + "00");
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = node.color + "20";
        ctx.fill();
        ctx.strokeStyle = node.color + "60";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.font = "bold 10px system-ui";
        ctx.fillStyle = node.color + "CC";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.label, node.x, node.y);
      }

      // === SIDE CHAIN BRANCHES ===
      for (let i = 0; i < chainNodes.length; i += 2) {
        const node = chainNodes[i];
        const branchAngle = Math.sin(time * 2 + i) * 0.3 + (i % 4 === 0 ? -Math.PI / 2 : Math.PI / 2);
        const branchLen = 30 + Math.sin(time + i) * 10;
        const bx = node.x + Math.cos(branchAngle) * branchLen;
        const by = node.y + Math.sin(branchAngle) * branchLen;

        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = "rgba(91, 155, 213, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(91, 155, 213, 0.2)";
        ctx.fill();

        // R-group label
        ctx.font = "8px monospace";
        ctx.fillStyle = "rgba(91, 155, 213, 0.25)";
        ctx.textAlign = "center";
        ctx.fillText("R", bx, by - 8);
      }

      // === HYDROGEN BONDS (dotted lines between distant nodes) ===
      for (let i = 0; i < chainNodes.length; i++) {
        for (let j = i + 3; j < chainNodes.length; j += 3) {
          const a = chainNodes[i];
          const b = chainNodes[j];
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (dist < 200) {
            ctx.beginPath();
            ctx.setLineDash([3, 6]);
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0, 102, 255, ${0.06 * (1 - dist / 200)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";

      animationId = requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = 750;
      // Reposition chain
      for (let i = 0; i < chainNodes.length; i++) {
        const t = i / (chainLength - 1);
        chainNodes[i].targetX = width * 0.05 + t * (width * 0.9);
      }
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      canvas!.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <section className="relative bg-[#060e1a] overflow-hidden" style={{ minHeight: "750px" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Top gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060e1a] via-transparent to-[#060e1a]/80" />
      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 lg:pt-24">
        <div className="max-w-2xl">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 backdrop-blur-sm text-brand-cyan text-xs font-semibold mb-8 transition-all duration-1000 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-2 h-2 bg-brand-cyan rounded-full animate-pulse" />
            Amino Acid Sequenced · ≥99% Purity
          </div>

          <h1
            className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 transition-all duration-1000 delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            The Science of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-[#5B9BD5] to-[#3B82F6]">
              Peptide
            </span>
            <br />
            Innovation
          </h1>

          <p
            className={`text-lg text-blue-200/60 leading-relaxed mb-10 max-w-lg transition-all duration-1000 delay-400 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            From amino acid sequences to breakthrough research compounds.
            20+ pharmaceutical-grade peptides for the next frontier of scientific discovery.
          </p>

          <div
            className={`flex flex-wrap gap-4 mb-14 transition-all duration-1000 delay-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-cyan text-white font-bold text-base hover:bg-brand-cyan/90 transition-all shadow-lg shadow-brand-cyan/25 hover:shadow-brand-cyan/40"
            >
              Explore Products
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/peptides"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/15 text-white/90 font-semibold hover:bg-white/5 backdrop-blur-sm transition-all"
            >
              How Peptides Work
            </Link>
          </div>

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
                <p className="text-xs text-blue-300/40 font-medium mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
