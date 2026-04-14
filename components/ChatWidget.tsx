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
  if (msg.match(/^(hi|hello|hey|salam|marhaba|good morning|good evening)/)) {
    return "Hello! Welcome to BioStack Peptides. I'm your personal peptide advisor.\n\nTell me what you're looking to achieve and I'll recommend the best peptides for your research:\n\n• Weight loss / fat burning\n• Muscle growth & recovery\n• Healing injuries (tendons, joints, gut)\n• Anti-aging & longevity\n• Skin rejuvenation\n• Better sleep & focus\n• Hair growth\n\nOr ask me about any specific product!";
  }

  // === GOAL-BASED RECOMMENDATIONS ===

  // Weight loss / fat burning
  if (msg.includes("weight") || msg.includes("fat") || msg.includes("lose") || msg.includes("slim") || msg.includes("diet") || msg.includes("obesity") || msg.includes("lean") || msg.includes("cutting") || msg.includes("burn")) {
    return "**For Weight Loss & Fat Burning Research, I recommend:**\n\n🥇 **Retatrutide** (AED 700) — The most advanced option. Triple agonist (GLP-1/GIP/Glucagon) targeting appetite, metabolism, and energy expenditure simultaneously. The newest and most potent in its class.\n\n🥈 **Tesamorelin** (AED 999) — Specifically studied for visceral fat reduction. Stimulates natural GH release which boosts fat metabolism.\n\n🥉 **5-Amino-1MQ** (AED 500) — NNMT inhibitor that enhances fat cell metabolism and energy expenditure at the cellular level.\n\n💡 **Pro tip:** For best results, researchers often combine Retatrutide with NAD+ (AED 300) to boost cellular energy metabolism.\n\nWant me to go deeper on any of these?";
  }

  // Muscle growth / bodybuilding
  if (msg.includes("muscle") || msg.includes("grow") || msg.includes("bulk") || msg.includes("mass") || msg.includes("gains") || msg.includes("bodybuilding") || msg.includes("strength") || msg.includes("hypertrophy")) {
    return "**For Muscle Growth & Performance Research, I recommend:**\n\n🥇 **CJC + Ipamorelin Stack** (AED 550) — The gold standard for GH research. Clean, sustained GH pulses without cortisol spikes. Our best-selling stack for a reason.\n\n🥈 **IGF-1 LR3** (AED 599) — Direct muscle hypertrophy and cell proliferation. Long-acting, potent IGF-1 analogue.\n\n🥉 **GHRP-6** (AED 249) — Budget-friendly GH booster with strong appetite stimulation — great for researchers on a bulk protocol.\n\n💡 **Stack suggestion:** CJC+Ipa Stack + Wolverine Stack (BPC+TB for recovery) = complete growth + recovery protocol.\n\nWant details on dosing or any of these products?";
  }

  // Healing / injury / recovery
  if (msg.includes("heal") || msg.includes("injur") || msg.includes("recover") || msg.includes("tendon") || msg.includes("ligament") || msg.includes("joint") || msg.includes("pain") || msg.includes("inflammation") || msg.includes("gut") || msg.includes("ibs") || msg.includes("ibd") || msg.includes("repair")) {
    return "**For Healing & Recovery Research, I recommend:**\n\n🥇 **Wolverine Stack** (AED 599) — BPC-157 + TB-500 combined. Named after Wolverine for a reason — the ultimate healing synergy for tendons, ligaments, muscles, and joints.\n\n🥈 **BPC-157** (AED 299) — Our #1 best seller. Incredible for gut healing (IBS/IBD research), tendon repair, and reducing inflammation.\n\n🥉 **TB-500** (AED 320) — Best for flexibility, muscle repair, and blood vessel formation.\n\n**For gut-specific issues:**\n• **KPV** (AED 420) — Potent anti-inflammatory tripeptide specifically studied for gut health and IBD.\n\n💡 **Pro tip:** BPC-157 + KPV together is the strongest gut research protocol available.\n\nWhich area are you focused on — joints, gut, or general recovery?";
  }

  // Anti-aging / longevity
  if (msg.includes("aging") || msg.includes("anti-aging") || msg.includes("longevity") || msg.includes("age") || msg.includes("young") || msg.includes("life") || msg.includes("telomere") || msg.includes("cellular")) {
    return "**For Anti-Aging & Longevity Research, I recommend:**\n\n🥇 **NAD+** (AED 300) — The cornerstone of longevity research. Activates sirtuins (longevity proteins), supports DNA repair, and restores mitochondrial function. NAD+ levels decline with age — supplementation is the #1 studied intervention.\n\n🥈 **GHK-Cu** (AED 335) — Reverses age-related gene expression, stimulates collagen, and promotes tissue regeneration at the molecular level.\n\n🥉 **MOTS-C** (AED 325) — Mitochondrial peptide that acts as an exercise mimetic. Activates AMPK pathway — the master metabolic regulator.\n\n💡 **Ultimate longevity stack:** NAD+ + GHK-Cu + MOTS-C = cellular energy + tissue repair + metabolic optimization.\n\nWant me to break down a protocol?";
  }

  // Skin / beauty / collagen / hair
  if (msg.includes("skin") || msg.includes("collagen") || msg.includes("wrinkle") || msg.includes("glow") || msg.includes("beauty") || msg.includes("complexion") || msg.includes("hair") || msg.includes("elastin") || msg.includes("scar")) {
    return "**For Skin Rejuvenation & Beauty Research, I recommend:**\n\n🥇 **BioStack GLOW Mix** (AED 899) — Our curated skin stack. Targets collagen synthesis, elastin production, and skin barrier function. Everything in one vial.\n\n🥈 **GHK-Cu** (AED 335) — The most studied skin peptide. Stimulates collagen & elastin, promotes wound healing, and reverses age-related gene changes. Also studied for hair growth.\n\n🥉 **BioStack KLOW Mix** (AED 1,200) — Premium stack with BPC-157 + KPV + GHK-Cu + TB-500. Combines healing + skin regeneration + anti-inflammatory.\n\n**For hair specifically:** GHK-Cu is your best bet — it's the most researched peptide for hair follicle stimulation.\n\nWant more details on any of these?";
  }

  // Sleep
  if (msg.includes("sleep") || msg.includes("insomnia") || msg.includes("rest") || msg.includes("tired") || msg.includes("fatigue")) {
    return "**For Sleep & Recovery Research, I recommend:**\n\n🥇 **DSIP** (AED 350) — Delta Sleep Inducing Peptide. Specifically promotes deep delta wave sleep, modulates cortisol, and supports natural sleep cycles without sedation.\n\n🥈 **Selank** (AED 250) — Anxiolytic peptide that reduces stress and anxiety without sedation. Great for researchers studying stress-related sleep disruption.\n\n🥉 **NAD+** (AED 300) — Supports cellular energy restoration and circadian rhythm regulation.\n\n💡 **Pro tip:** DSIP + Selank is the most effective sleep research protocol — addresses both sleep quality and the anxiety/stress that prevents good sleep.\n\nWant me to tell you more about any of these?";
  }

  // Focus / brain / cognitive / anxiety / stress
  if (msg.includes("focus") || msg.includes("brain") || msg.includes("cognitive") || msg.includes("memory") || msg.includes("smart") || msg.includes("nootropic") || msg.includes("anxiety") || msg.includes("stress") || msg.includes("mental") || msg.includes("concentration") || msg.includes("mood")) {
    return "**For Cognitive Enhancement & Mental Clarity Research, I recommend:**\n\n🥇 **Semax** (AED 329) — The most potent nootropic peptide. Enhances BDNF (brain-derived neurotrophic factor), improves memory, focus, and learning. Anti-anxiety without drowsiness.\n\n🥈 **Selank** (AED 250) — Powerful anxiolytic + cognitive enhancer. Reduces anxiety and stress while improving mental clarity. No sedation, no dependency.\n\n🥉 **NAD+** (AED 300) — Supports brain cell energy and neuroprotection. Essential cofactor for cognitive function.\n\n💡 **Best brain stack:** Semax (focus & memory) + Selank (calm clarity) + NAD+ (brain energy) = complete cognitive optimization protocol.\n\n**For anxiety specifically:** Selank is the #1 choice — it's been extensively studied for anti-anxiety effects without the downsides of traditional anxiolytics.\n\nWhat's your main goal — focus, anxiety reduction, or both?";
  }

  // GH / growth hormone
  if (msg.includes("growth hormone") || msg.includes(" gh ") || msg.includes("hgh") || msg.includes("igf") || msg.includes("ghrh") || msg.includes("secretagogue")) {
    return "**For Growth Hormone Research, here's our full GH lineup:**\n\n🥇 **CJC + Ipamorelin Stack** (AED 550) — Gold standard. Clean GH pulses + sustained release. No cortisol/prolactin spikes.\n\n🥈 **CJC-1295 DAC** (AED 299–750) — Extended half-life GHRH. Sustained GH elevation with less frequent dosing.\n\n🥉 **Tesamorelin** (AED 999) — Pharmaceutical-grade GHRH analogue. Studied for visceral fat + natural GH release.\n\n**Also available:**\n• **IGF-1 LR3** (AED 599) — Direct growth factor, bypasses GH pathway\n• **GHRP-6** (AED 249) — Budget GH secretagogue with appetite boost\n\n💡 **For max GH research:** CJC+Ipa Stack is the most popular and cost-effective starting point.\n\nWhat's your research goal — lean mass, fat loss, or recovery?";
  }

  // What should I buy / help me choose / new to peptides
  if (msg.includes("what should") || msg.includes("help me") || msg.includes("which one") || msg.includes("suggest") || msg.includes("new to") || msg.includes("beginner") || msg.includes("start") || msg.includes("first time") || msg.includes("don't know") || msg.includes("not sure")) {
    return "No problem! Let me help you find the right peptide. Just tell me your main research goal:\n\n🔥 **Weight loss** → Retatrutide, Tesamorelin\n💪 **Muscle growth** → CJC+Ipamorelin, IGF-1 LR3\n🩹 **Healing & recovery** → Wolverine Stack, BPC-157\n🧬 **Anti-aging** → NAD+, GHK-Cu, MOTS-C\n✨ **Skin & beauty** → GLOW Mix, GHK-Cu\n😴 **Better sleep** → DSIP, Selank\n🧠 **Focus & brain** → Semax, Selank\n📈 **Growth hormone** → CJC+Ipa, Tesamorelin\n\nOr tell me in your own words what you're looking for and I'll give you a personalized recommendation!";
  }

  // Pricing questions
  if (msg.includes("price") || msg.includes("cost") || msg.includes("how much") || msg.includes("expensive") || msg.includes("cheap") || msg.includes("afford") || msg.includes("budget")) {
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
    if (msg.includes("cheap") || msg.includes("budget") || msg.includes("afford")) {
      return "**Best Value Options:**\n\n• **Selank** — AED 250 (5mg) — Great cognitive/anxiety peptide\n• **GHRP-6** — AED 249 (5mg) — Most affordable GH booster\n• **BPC-157** — AED 299 (5mg) — Best value healing peptide\n• **CJC-1295** — AED 299 (2mg) — Affordable GH support\n• **NAD+** — AED 300 (100mg) — Longevity essential\n• **BAC Water** — AED 50 (3ml) — Research essential\n\nAll products are ≥99% purity with COA. Quality doesn't change with price — only quantity!";
    }
    return "Which product would you like pricing for? Just name it or tell me what goal you're researching and I'll give you pricing for the best options!";
  }

  // Product-specific lookups
  const matchedProduct = products.find(
    (p) =>
      msg.includes(p.name.toLowerCase()) ||
      msg.includes(p.shortName.toLowerCase()) ||
      msg.includes(p.slug)
  );
  if (matchedProduct) {
    return `**${matchedProduct.name}** — ${matchedProduct.description}\n\n**Sizes & Pricing:**\n${matchedProduct.sizes.map((s) => `• ${s.label} — AED ${s.price}`).join("\n")}\n\n**Key Benefits:**\n${matchedProduct.benefits.map((b) => `• ${b}`).join("\n")}\n\n**Storage:** ${matchedProduct.storage}\n\nWould you like a recommendation on what to pair this with?`;
  }

  // Reconstitution
  if (msg.includes("reconstitut") || msg.includes("bac water") || msg.includes("bacteriostatic") || msg.includes("how to use") || msg.includes("prepare") || msg.includes("inject")) {
    return "**Reconstitution Guide:**\n\n1. Use bacteriostatic water (we sell 3ml for AED 50 and 10ml for AED 100)\n2. Add water slowly along the vial wall — never inject directly onto the powder\n3. Swirl gently — never shake\n4. Typical concentration: 1–2mg/mL\n5. Store reconstituted peptide at 4°C, use within 30 days\n\n📐 Try our **Peptide Calculator** at biostackpeptide.com/calculator for exact dosing volumes!\n\nNeed help with a specific peptide's reconstitution?";
  }

  // Shipping
  if (msg.includes("ship") || msg.includes("delivery") || msg.includes("tracking") || msg.includes("order")) {
    return "**Shipping Info:**\n\n• Orders processed within 24 hours\n• Standard delivery: 3–5 business days\n• Discreet, temperature-stable packaging\n• Track your order: biostackpeptide.com/tracking\n\nFor order support, email Contact@biostackpeptide.com or call +1 (872) 366-1398 with your order number.";
  }

  // Storage
  if (msg.includes("stor") || msg.includes("keep") || msg.includes("refrigerat") || msg.includes("freez")) {
    return "**Storage Guidelines:**\n\n• **Lyophilized (powder):** -20°C for long-term\n• **Reconstituted:** 4°C (fridge), use within 30 days\n• Keep away from light and moisture\n• BAC water: Room temperature, use within 28 days\n\nAll products ship temperature-stable.";
  }

  // Stacks
  if (msg.includes("stack") || msg.includes("combo") || msg.includes("bundle")) {
    return "**Our Research Stacks:**\n\n💎 **BioStack KLOW Mix** (AED 1,200) — BPC-157 + KPV + GHK-Cu + TB-500. The ultimate recovery + skin stack.\n\n✨ **BioStack GLOW Mix** (AED 899) — Skin rejuvenation & collagen\n\n🐺 **Wolverine Stack** (AED 599) — BPC-157 + TB-500 healing synergy\n\n📈 **CJC + Ipamorelin** (AED 550) — Gold standard GH stack\n\nStacks save you money vs buying individually and are pre-dosed for convenience. Which goal are you targeting?";
  }

  // Best sellers / recommendations
  if (msg.includes("best") || msg.includes("popular") || msg.includes("recommend") || msg.includes("top")) {
    return "**Our Top 5 Best Sellers:**\n\n1. 🏆 **BPC-157** (AED 299) — #1 healing peptide worldwide\n2. 📈 **CJC + Ipamorelin Stack** (AED 550) — Top GH research stack\n3. 🧬 **NAD+** (AED 300) — Leading longevity compound\n4. 🩹 **TB-500** (AED 320) — Top recovery peptide\n5. 🐺 **Wolverine Stack** (AED 599) — BPC + TB combo\n\nAll ≥99% purity with COA included. Tell me your goal and I'll narrow it down for you!";
  }

  // Purity / Quality
  if (msg.includes("purity") || msg.includes("quality") || msg.includes("coa") || msg.includes("test") || msg.includes("legit") || msg.includes("real") || msg.includes("fake")) {
    return "**Quality Assurance:**\n\n✅ All products ≥99% purity verified\n✅ Third-party HPLC & mass spec testing\n✅ COA (Certificate of Analysis) with every order\n✅ Batch-specific documentation\n✅ Pharmaceutical-grade lyophilization\n\nWe never compromise — if a batch doesn't meet our standards, it doesn't ship. Quality is our reputation.";
  }

  // Contact
  if (msg.includes("contact") || msg.includes("email") || msg.includes("phone") || msg.includes("reach") || msg.includes("talk") || msg.includes("human") || msg.includes("support")) {
    return "**Contact Our Team:**\n\n📧 Email: Contact@biostackpeptide.com\n📱 Phone/WhatsApp: +1 (872) 366-1398\n🕐 Available Mon–Sat, 9AM–6PM\n\nOr use our contact form at biostackpeptide.com/contact. We typically respond within 24 hours!";
  }

  // Thanks
  if (msg.includes("thank") || msg.includes("thanks") || msg.includes("shukran") || msg.includes("appreciate")) {
    return "You're welcome! Happy to help. If you have any more questions about peptides, just ask. You can also reach us anytime at Contact@biostackpeptide.com or +1 (872) 366-1398. Good luck with your research! 🔬";
  }

  // Default — guide them toward a goal
  return "I'd love to help you find the right peptide! Tell me what you're looking to achieve:\n\n• Lose weight / burn fat\n• Build muscle / grow\n• Heal an injury / recover faster\n• Anti-aging / longevity\n• Improve skin / hair\n• Sleep better\n• Improve focus / reduce anxiety\n• Boost growth hormone\n\nOr ask me about any specific product and I'll give you all the details!";
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your BioStack Peptides advisor. Tell me what you're looking to achieve — weight loss, muscle growth, healing, anti-aging, better skin, sleep, or focus — and I'll recommend the best peptides for you!",
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
