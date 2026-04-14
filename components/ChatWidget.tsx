"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { products } from "@/data/products";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_KNOWLEDGE = `You are BioStack Peptides' AI assistant. You help customers with:
- Product information, pricing, and recommendations
- Peptide reconstitution and storage guidance
- Order and shipping questions
- General peptide research questions

Products available (prices in AED):
${products.map((p) => `- ${p.name}: ${p.sizes.map((s) => `${s.label} (AED ${s.price})`).join(", ")} — ${p.description}`).join("\n")}

Key info:
- All products are ≥99% purity, COA certified
- For research purposes only
- Email: Contact@biostackpeptide.com
- Phone/WhatsApp: +1 (872) 366-1398
- Website: biostackpeptide.com
- Shipping: Orders ship within 24 hours, 3-5 business days delivery
- Storage: Most lyophilized peptides at -20°C, reconstituted at 4°C use within 30 days
- Reconstitution: Use bacteriostatic water, add slowly along vial wall, swirl gently

Be helpful, professional, and concise. If asked about medical advice, dosing for humans, or anything outside research use, politely redirect and remind that products are for research purposes only.`;

function generateResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  // Greeting
  if (msg.match(/^(hi|hello|hey|salam|marhaba)/)) {
    return "Hello! Welcome to BioStack Peptides. How can I help you today? I can assist with product information, pricing, reconstitution guidance, or order questions.";
  }

  // Pricing questions
  if (msg.includes("price") || msg.includes("cost") || msg.includes("how much")) {
    const matchedProducts = products.filter(
      (p) =>
        msg.includes(p.name.toLowerCase()) ||
        msg.includes(p.shortName.toLowerCase()) ||
        msg.includes(p.slug)
    );
    if (matchedProducts.length > 0) {
      return matchedProducts
        .map(
          (p) =>
            `**${p.name}**:\n${p.sizes.map((s) => `• ${s.label} — AED ${s.price}`).join("\n")}`
        )
        .join("\n\n");
    }
    return "Which product would you like pricing for? We carry Retatrutide, BPC-157, TB-500, GHK-Cu, MOTS-C, DSIP, Semax, Selank, CJC-1295, 5-Amino-1MQ, KPV, IGF-1 LR3, GHRP-6, NAD+, Tesamorelin, and our BioStack mix stacks (GLOW, KLOW, Wolverine, CJC+Ipamorelin).";
  }

  // Product-specific lookups
  const matchedProduct = products.find(
    (p) =>
      msg.includes(p.name.toLowerCase()) ||
      msg.includes(p.shortName.toLowerCase()) ||
      msg.includes(p.slug)
  );
  if (matchedProduct) {
    return `**${matchedProduct.name}** — ${matchedProduct.description}\n\n**Sizes & Pricing:**\n${matchedProduct.sizes.map((s) => `• ${s.label} — AED ${s.price}`).join("\n")}\n\n**Benefits:** ${matchedProduct.benefits.slice(0, 3).join(", ")}\n\n**Storage:** ${matchedProduct.storage}\n\nWould you like to know anything else about this product?`;
  }

  // Reconstitution
  if (msg.includes("reconstitut") || msg.includes("mix") || msg.includes("bac water") || msg.includes("bacteriostatic")) {
    return "**Reconstitution Guide:**\n\n1. Use bacteriostatic water (we sell 3ml for AED 50 and 10ml for AED 100)\n2. Add water slowly along the vial wall — never inject directly onto the powder\n3. Swirl gently — never shake\n4. Typical concentration: 1–2mg/mL\n5. Store reconstituted peptide at 4°C, use within 30 days\n\nTry our **Peptide Calculator** at biostackpeptide.com/calculator for exact dosing volumes!";
  }

  // Shipping
  if (msg.includes("ship") || msg.includes("delivery") || msg.includes("tracking") || msg.includes("order")) {
    return "**Shipping Info:**\n\n• Orders are processed within 24 hours\n• Standard delivery: 3–5 business days\n• All packages ship in discreet, temperature-stable packaging\n• Track your order at biostackpeptide.com/tracking\n\nFor order support, email Contact@biostackpeptide.com or call +1 (872) 366-1398 with your order number.";
  }

  // Storage
  if (msg.includes("stor") || msg.includes("keep") || msg.includes("refrigerat") || msg.includes("freez")) {
    return "**Storage Guidelines:**\n\n• **Lyophilized (powder):** Store at -20°C for long-term storage\n• **Reconstituted:** Store at 4°C (fridge), use within 30 days\n• Keep away from light and moisture\n• BAC water: Room temperature, use within 28 days of first puncture\n\nAll our products ship with temperature-stable packaging to maintain integrity.";
  }

  // Stacks
  if (msg.includes("stack") || msg.includes("combo") || msg.includes("bundle")) {
    return "**Our Research Stacks:**\n\n• **BioStack KLOW Mix** (AED 1,200) — BPC-157 + KPV + GHK-Cu + TB-500. Ultimate recovery & skin stack\n• **BioStack GLOW Mix** (AED 899) — Skin rejuvenation & collagen stack\n• **Wolverine Stack** (AED 599) — BPC-157 + TB-500 healing synergy\n• **CJC + Ipamorelin** (AED 550) — Gold standard GH research stack\n\nAll stacks are pre-dosed for research convenience. Which interests you?";
  }

  // Best sellers
  if (msg.includes("best") || msg.includes("popular") || msg.includes("recommend")) {
    return "**Our Best Sellers:**\n\n1. **BPC-157** — Most popular healing peptide (AED 299)\n2. **CJC + Ipamorelin Stack** — Top GH research stack (AED 550)\n3. **NAD+** — Leading longevity compound (AED 300)\n4. **TB-500** — Top recovery peptide (AED 320)\n5. **Wolverine Stack** — BPC + TB combo (AED 599)\n\nAll products are ≥99% purity with COA included. Want details on any of these?";
  }

  // Purity / Quality
  if (msg.includes("purity") || msg.includes("quality") || msg.includes("coa") || msg.includes("test")) {
    return "**Quality Assurance:**\n\n• All products are ≥99% purity verified\n• Third-party HPLC and mass spectrometry testing\n• Certificate of Analysis (COA) included with every order\n• Batch-specific documentation available\n\nWe never compromise on quality — if a batch doesn't meet our standards, it doesn't ship.";
  }

  // Contact
  if (msg.includes("contact") || msg.includes("email") || msg.includes("phone") || msg.includes("reach")) {
    return "**Contact Us:**\n\n• Email: Contact@biostackpeptide.com\n• Phone/WhatsApp: +1 (872) 366-1398\n• Available Mon–Sat, 9AM–6PM\n\nOr use our contact form at biostackpeptide.com/contact. We typically respond within 24 hours!";
  }

  // Default
  return "I can help with product information, pricing, reconstitution guidance, storage tips, shipping questions, and more. What would you like to know? You can also ask about specific peptides like BPC-157, TB-500, Semaglutide, or any of our stacks!";
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! Welcome to BioStack Peptides. I'm here to help with product questions, pricing, reconstitution guidance, or anything else. How can I assist you?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 500);
  }

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-cyan text-white shadow-lg hover:bg-brand-cyan/90 transition-all flex items-center justify-center group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-brand-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-brand-cyan text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">BioStack Assistant</p>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    msg.role === "user"
                      ? "bg-brand-cyan/10 text-brand-cyan"
                      : "bg-blue-50 text-brand-cyan"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-3 h-3" />
                  ) : (
                    <Bot className="w-3 h-3" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] px-3 py-2.5 rounded-xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-brand-cyan text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-brand-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our peptides..."
                className="flex-1 px-3 py-2.5 bg-gray-50 border border-brand-border rounded-lg text-sm text-gray-900 placeholder-brand-muted focus:outline-none focus:border-brand-cyan/50"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-lg bg-brand-cyan text-white hover:bg-brand-cyan/90 transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-center text-[10px] text-brand-muted mt-2">
              Powered by BioStack AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
