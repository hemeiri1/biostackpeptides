"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Globe } from "lucide-react";
import { products } from "@/data/products";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Lang = "en" | "ar";

// Detailed peptide knowledge base
const PEPTIDE_INFO: Record<string, { en: string; ar: string }> = {
  "bac-water": {
    en: "**Bacteriostatic Water (BAC Water)**\n\nBAC Water is sterile water with 0.9% benzyl alcohol added as a preservative. It's essential for reconstituting (mixing) lyophilized (freeze-dried) peptides.\n\n**What it does:**\n• Dissolves peptide powder into an injectable solution\n• The benzyl alcohol prevents bacterial growth\n• Keeps reconstituted peptides stable for up to 30 days\n\n**How to use:**\n1. Draw BAC water into a syringe\n2. Inject slowly along the vial wall (never directly onto powder)\n3. Swirl gently — never shake\n4. Store reconstituted peptide at 2-8°C\n\n**Sizes:** 3ml (AED 50) · 10ml (AED 100)\n\nEvery peptide order needs BAC water. We offer free BAC water on orders over AED 500!",
    ar: "**ماء البكتيريوستاتيك (BAC Water)**\n\nهو ماء معقم يحتوي على 0.9% كحول بنزيل كمادة حافظة. ضروري لإعادة تكوين (خلط) الببتيدات المجففة بالتجميد.\n\n**ما يفعله:**\n• يذيب مسحوق الببتيد في محلول قابل للحقن\n• كحول البنزيل يمنع نمو البكتيريا\n• يحافظ على استقرار الببتيدات لمدة تصل إلى 30 يومًا\n\n**كيفية الاستخدام:**\n1. اسحب ماء BAC في حقنة\n2. حقن ببطء على طول جدار القارورة\n3. حرك بلطف — لا تهز أبداً\n4. خزن في 2-8 درجة مئوية\n\n**الأحجام:** 3 مل (50 درهم) · 10 مل (100 درهم)"
  },
  "bpc-157": {
    en: "**BPC-157 (Body Protection Compound)**\n\nA 15-amino acid peptide derived from human gastric juice. One of the most researched peptides for healing and tissue repair.\n\n**Research Functions:**\n• Accelerates tendon, ligament, and muscle healing\n• Promotes gut healing — studied extensively for IBS, IBD, leaky gut\n• Reduces inflammation systemically\n• Supports angiogenesis (new blood vessel formation)\n• Neuroprotective properties — studied for brain injury recovery\n• Counteracts NSAID-induced gut damage\n\n**Why researchers love it:** Works on virtually every tissue type. Oral and injectable forms both show activity. Extremely well-tolerated in studies.\n\n**Sizes:** 5mg (AED 299) · 10mg (AED 449)\n\n**Best paired with:** TB-500 (Wolverine Stack) for synergistic healing.",
    ar: "**BPC-157 (مركب حماية الجسم)**\n\nببتيد من 15 حمض أميني مشتق من عصارة المعدة البشرية. أحد أكثر الببتيدات بحثاً للشفاء وإصلاح الأنسجة.\n\n**وظائف البحث:**\n• يسرع شفاء الأوتار والأربطة والعضلات\n• يعزز شفاء الأمعاء — دراسات واسعة للقولون العصبي\n• يقلل الالتهابات\n• يدعم تكوين أوعية دموية جديدة\n• خصائص حماية عصبية\n• يعالج أضرار مضادات الالتهاب على المعدة\n\n**الأحجام:** 5 مجم (299 درهم) · 10 مجم (449 درهم)\n\n**أفضل مع:** TB-500 (ستاك وولفرين) للشفاء التآزري."
  },
  "tb-500": {
    en: "**TB-500 (Thymosin Beta-4)**\n\nA naturally occurring peptide present in all human cells. Key regulator of cell migration, healing, and tissue repair.\n\n**Research Functions:**\n• Promotes muscle repair and flexibility\n• Reduces inflammation and fibrosis (scar tissue)\n• Supports new blood vessel formation\n• Enhances hair growth in studies\n• Improves joint flexibility and mobility\n• Speeds wound healing\n\n**Why researchers love it:** Systemic healing — works throughout the body, not just locally. Excellent synergy with BPC-157.\n\n**Sizes:** 5mg (AED 320) · 10mg (AED 499)\n\n**Best paired with:** BPC-157 for the ultimate healing protocol (available as Wolverine Stack, AED 599).",
    ar: "**TB-500 (ثيموسين بيتا-4)**\n\nببتيد طبيعي موجود في جميع خلايا الإنسان. منظم رئيسي لهجرة الخلايا والشفاء.\n\n**وظائف البحث:**\n• يعزز إصلاح العضلات والمرونة\n• يقلل الالتهاب وتليف الأنسجة\n• يدعم تكوين أوعية دموية جديدة\n• يعزز نمو الشعر\n• يحسن مرونة المفاصل\n\n**الأحجام:** 5 مجم (320 درهم) · 10 مجم (499 درهم)\n\n**أفضل مع:** BPC-157 للشفاء الكامل (متوفر كستاك وولفرين، 599 درهم)."
  },
  "retatrutide": {
    en: "**Retatrutide**\n\nThe most advanced weight management peptide. A triple agonist targeting GLP-1, GIP, and Glucagon receptors simultaneously.\n\n**Research Functions:**\n• Powerful appetite suppression via GLP-1\n• Enhanced fat metabolism via Glucagon receptor\n• Improved insulin sensitivity via GIP\n• Studies show up to 24% body weight reduction\n• Targets visceral and subcutaneous fat\n• Preserves lean muscle mass during fat loss\n\n**Why researchers love it:** Triple mechanism of action makes it more potent than single or dual agonists. The most promising weight management compound in current research.\n\n**Sizes:** 5mg (AED 700) · 10mg (AED 1,100)\n\n**Best paired with:** NAD+ for enhanced cellular energy metabolism.",
    ar: "**ريتاتروتايد**\n\nأحدث ببتيد لإدارة الوزن. ناهض ثلاثي يستهدف مستقبلات GLP-1 و GIP والجلوكاجون.\n\n**وظائف البحث:**\n• قمع قوي للشهية\n• تعزيز حرق الدهون\n• تحسين حساسية الأنسولين\n• دراسات تظهر خسارة تصل إلى 24% من وزن الجسم\n• يستهدف الدهون الحشوية وتحت الجلد\n• يحافظ على الكتلة العضلية\n\n**الأحجام:** 5 مجم (700 درهم) · 10 مجم (1,100 درهم)"
  },
  "ghk-cu": {
    en: "**GHK-Cu (Copper Peptide)**\n\nA naturally occurring tripeptide-copper complex that declines with age. One of the most studied peptides for skin and tissue regeneration.\n\n**Research Functions:**\n• Stimulates collagen and elastin synthesis\n• Promotes wound healing and tissue remodeling\n• Reverses age-related gene expression (turns on 31 genes, turns off 32)\n• Potent anti-inflammatory\n• Stimulates hair follicle growth\n• Antioxidant — reduces free radical damage\n• Promotes blood vessel formation\n\n**Why researchers love it:** One of the few peptides that literally reverses aging at the genetic level.\n\n**Sizes:** 50mg (AED 335) · 100mg (AED 520)\n\n**Best paired with:** NAD+ and MOTS-C for the ultimate anti-aging protocol.",
    ar: "**GHK-Cu (ببتيد النحاس)**\n\nمركب ببتيد ثلاثي طبيعي يتناقص مع التقدم في العمر. من أكثر الببتيدات دراسة لتجديد البشرة.\n\n**وظائف البحث:**\n• يحفز إنتاج الكولاجين والإيلاستين\n• يعزز التئام الجروح\n• يعكس التعبير الجيني المرتبط بالشيخوخة\n• مضاد قوي للالتهابات\n• يحفز نمو بصيلات الشعر\n• مضاد للأكسدة\n\n**الأحجام:** 50 مجم (335 درهم) · 100 مجم (520 درهم)"
  },
  "nad-plus": {
    en: "**NAD+ (Nicotinamide Adenine Dinucleotide)**\n\nA critical coenzyme found in every cell. NAD+ levels decline by 50% between ages 40-60. Central to over 500 metabolic reactions.\n\n**Research Functions:**\n• Activates sirtuins (longevity proteins)\n• Essential for DNA repair mechanisms\n• Restores mitochondrial function (cellular energy)\n• Supports circadian rhythm regulation\n• Neuroprotective — studied for cognitive decline\n• Enhances cellular metabolism and energy\n• Supports healthy aging at the molecular level\n\n**Why researchers love it:** The single most important molecule for cellular energy and longevity. Everything in your body depends on NAD+.\n\n**Sizes:** 100mg (AED 300) · 250mg (AED 599)\n\n**Best paired with:** GHK-Cu and MOTS-C for comprehensive anti-aging.",
    ar: "**NAD+ (نيكوتيناميد أدينين ثنائي النوكليوتيد)**\n\nإنزيم مساعد حيوي موجود في كل خلية. تنخفض مستوياته بنسبة 50% بين سن 40-60.\n\n**وظائف البحث:**\n• ينشط بروتينات السيرتوين (بروتينات طول العمر)\n• ضروري لآليات إصلاح الحمض النووي\n• يستعيد وظيفة الميتوكوندريا\n• يدعم تنظيم إيقاع الساعة البيولوجية\n• حماية عصبية\n• يعزز الأيض الخلوي والطاقة\n\n**الأحجام:** 100 مجم (300 درهم) · 250 مجم (599 درهم)"
  },
  "semax": {
    en: "**Semax**\n\nA synthetic analogue of ACTH (4-10) developed in Russia. One of the most potent nootropic peptides available.\n\n**Research Functions:**\n• Increases BDNF (Brain-Derived Neurotrophic Factor) by 3-4x\n• Enhances memory formation and recall\n• Improves focus, attention, and learning capacity\n• Anxiolytic (anti-anxiety) without sedation\n• Neuroprotective — studied for stroke recovery\n• Modulates serotonin and dopamine systems\n• No tolerance, dependency, or withdrawal\n\n**Why researchers love it:** Clean cognitive enhancement without the jitters or crashes of stimulants.\n\n**Sizes:** 10mg (AED 329)\n\n**Best paired with:** Selank for the ultimate brain stack (focus + calm).",
    ar: "**سيماكس**\n\nنظير اصطناعي لـ ACTH تم تطويره في روسيا. أحد أقوى ببتيدات تعزيز الإدراك.\n\n**وظائف البحث:**\n• يزيد BDNF بمقدار 3-4 أضعاف\n• يعزز تكوين الذاكرة والتذكر\n• يحسن التركيز والانتباه والتعلم\n• مضاد للقلق بدون تخدير\n• حماية عصبية\n• لا يسبب تعوّد أو اعتماد\n\n**الأحجام:** 10 مجم (329 درهم)"
  },
  "selank": {
    en: "**Selank**\n\nA synthetic analogue of the naturally occurring immunomodulatory peptide tuftsin. Developed in Russia for anxiety and cognitive enhancement.\n\n**Research Functions:**\n• Potent anxiolytic — reduces anxiety and stress\n• Enhances mental clarity without sedation\n• Modulates GABA system (like benzodiazepines but without side effects)\n• Boosts immune function\n• Anti-inflammatory properties\n• Stabilizes mood\n• No dependency or tolerance buildup\n\n**Sizes:** 5mg (AED 250)\n\n**Best paired with:** Semax for focus + calm, or DSIP for anxiety + sleep.",
    ar: "**سيلانك**\n\nنظير اصطناعي لببتيد تعديل المناعة الطبيعي. مطور للقلق وتعزيز الإدراك.\n\n**وظائف البحث:**\n• مضاد قوي للقلق والتوتر\n• يعزز الوضوح الذهني بدون تخدير\n• يعدل نظام GABA\n• يعزز وظيفة المناعة\n• مضاد للالتهابات\n• لا يسبب اعتماد\n\n**الأحجام:** 5 مجم (250 درهم)"
  },
  "dsip": {
    en: "**DSIP (Delta Sleep-Inducing Peptide)**\n\nA neuropeptide that promotes deep, restorative delta-wave sleep.\n\n**Research Functions:**\n• Induces natural deep delta-wave sleep\n• Modulates cortisol (stress hormone) levels\n• Does not cause sedation — promotes natural sleep onset\n• Normalizes disrupted sleep patterns\n• Studied for chronic insomnia\n• Supports stress reduction\n• Does not cause morning grogginess\n\n**Sizes:** 5mg (AED 350)\n\n**Best paired with:** Selank for stress-related sleep issues.",
    ar: "**DSIP (ببتيد تحفيز النوم العميق)**\n\nببتيد عصبي يعزز النوم العميق التصالحي.\n\n**وظائف البحث:**\n• يحفز نوم موجات دلتا العميقة الطبيعية\n• يعدل مستويات الكورتيزول\n• لا يسبب تخدير\n• يعيد أنماط النوم المضطربة\n• لا يسبب النعاس الصباحي\n\n**الأحجام:** 5 مجم (350 درهم)"
  },
  "mots-c": {
    en: "**MOTS-C**\n\nA mitochondrial-derived peptide that acts as an exercise mimetic.\n\n**Research Functions:**\n• Activates AMPK pathway (master metabolic switch)\n• Mimics the metabolic benefits of exercise\n• Improves insulin sensitivity\n• Enhances fat metabolism\n• Promotes mitochondrial biogenesis\n• Studied for metabolic syndrome and type 2 diabetes\n• Anti-aging at the cellular level\n\n**Sizes:** 5mg (AED 325) · 10mg (AED 499)\n\n**Best paired with:** NAD+ and GHK-Cu for longevity.",
    ar: "**MOTS-C**\n\nببتيد مشتق من الميتوكوندريا يعمل كمحاكي للتمرين.\n\n**وظائف البحث:**\n• ينشط مسار AMPK\n• يحاكي فوائد التمرين الأيضية\n• يحسن حساسية الأنسولين\n• يعزز حرق الدهون\n• يعزز تكوين ميتوكوندريا جديدة\n\n**الأحجام:** 5 مجم (325 درهم) · 10 مجم (499 درهم)"
  },
};

const UI_TEXT = {
  en: {
    greeting: "Hi! I'm your BioStack Peptides advisor. Tell me what you're looking to achieve — weight loss, muscle growth, healing, anti-aging, better skin, sleep, or focus — and I'll recommend the best peptides for you!",
    placeholder: "Ask about our peptides...",
    powered: "Powered by BioStack AI",
    online: "Online",
    title: "BioStack Assistant",
    langSwitch: "العربية",
  },
  ar: {
    greeting: "مرحباً! أنا مستشار بيوستاك للببتيدات. أخبرني بما تبحث عنه — إنقاص الوزن، بناء العضلات، الشفاء، مكافحة الشيخوخة، تحسين البشرة، النوم، أو التركيز — وسأنصحك بأفضل الببتيدات!",
    placeholder: "اسأل عن الببتيدات...",
    powered: "مدعوم من BioStack AI",
    online: "متصل",
    title: "مساعد بيوستاك",
    langSwitch: "English",
  },
};

function generateResponse(userMessage: string, lang: Lang): string {
  const msg = userMessage.toLowerCase();

  // Check for specific peptide questions
  for (const [slug, info] of Object.entries(PEPTIDE_INFO)) {
    const name = slug.replace(/-/g, " ").replace("plus", "+");
    if (msg.includes(slug) || msg.includes(name) || msg.includes(name.replace(" ", "")) || msg.includes(name.replace("-", ""))) {
      return info[lang];
    }
  }

  // Also check by product name from products array
  const matchedProduct = products.find(
    (p) =>
      msg.includes(p.name.toLowerCase()) ||
      msg.includes(p.shortName.toLowerCase()) ||
      msg.includes(p.slug.replace(/-/g, " "))
  );
  if (matchedProduct) {
    const info = PEPTIDE_INFO[matchedProduct.slug];
    if (info) return info[lang];
    // Fallback to generic product info
    return lang === "ar"
      ? `**${matchedProduct.name}** — ${matchedProduct.description}\n\n**الأحجام والأسعار:**\n${matchedProduct.sizes.map((s) => `• ${s.label} — ${s.price} درهم`).join("\n")}\n\n**الفوائد:**\n${matchedProduct.benefits.map((b) => `• ${b}`).join("\n")}\n\n**التخزين:** ${matchedProduct.storage}`
      : `**${matchedProduct.name}** — ${matchedProduct.description}\n\n**Sizes & Pricing:**\n${matchedProduct.sizes.map((s) => `• ${s.label} — AED ${s.price}`).join("\n")}\n\n**Key Benefits:**\n${matchedProduct.benefits.map((b) => `• ${b}`).join("\n")}\n\n**Storage:** ${matchedProduct.storage}\n\nWould you like a recommendation on what to pair this with?`;
  }

  // Arabic greetings
  if (msg.match(/^(مرحبا|سلام|هلا|اهلا|مساء الخير|صباح الخير|السلام عليكم)/)) {
    return lang === "ar"
      ? "مرحباً! أهلاً بك في بيوستاك ببتيدز. أنا مستشارك الشخصي.\n\nأخبرني ما هو هدفك وسأنصحك بأفضل الببتيدات:\n\n• إنقاص الوزن / حرق الدهون\n• بناء العضلات والتعافي\n• شفاء الإصابات\n• مكافحة الشيخوخة\n• تجديد البشرة\n• تحسين النوم\n• التركيز والذاكرة\n\nأو اسأل عن أي منتج محدد!"
      : "Hello! Welcome to BioStack Peptides. I'm your personal peptide advisor.\n\nTell me what you're looking to achieve:\n\n• Weight loss / fat burning\n• Muscle growth & recovery\n• Healing injuries\n• Anti-aging & longevity\n• Skin rejuvenation\n• Better sleep & focus\n\nOr ask me about any specific product!";
  }

  // English greetings
  if (msg.match(/^(hi|hello|hey|good morning|good evening)/)) {
    return lang === "ar"
      ? "مرحباً! أهلاً بك في بيوستاك ببتيدز. أخبرني ما هو هدفك البحثي وسأنصحك بأفضل الببتيدات!"
      : "Hello! Welcome to BioStack Peptides. I'm your personal peptide advisor.\n\nTell me what you're looking to achieve:\n\n• Weight loss / fat burning\n• Muscle growth & recovery\n• Healing injuries\n• Anti-aging & longevity\n• Skin rejuvenation\n• Better sleep & focus\n• Hair growth\n\nOr ask me about any specific product!";
  }

  // Weight loss
  if (msg.includes("weight") || msg.includes("fat") || msg.includes("lose") || msg.includes("slim") || msg.includes("diet") || msg.includes("burn") || msg.includes("وزن") || msg.includes("دهون") || msg.includes("تخسيس") || msg.includes("رجيم")) {
    return lang === "ar"
      ? "**لأبحاث إنقاص الوزن وحرق الدهون، أنصح بـ:**\n\n🥇 **ريتاتروتايد** (700 درهم) — ناهض ثلاثي، الأقوى لحرق الدهون\n🥈 **تيساموريلين** (999 درهم) — يستهدف الدهون الحشوية\n🥉 **5-أمينو-1MQ** (500 درهم) — يعزز حرق الدهون على المستوى الخلوي\n\n💡 **نصيحة:** ريتاتروتايد + NAD+ = أفضل بروتوكول لحرق الدهون\n\nهل تريد تفاصيل أكثر عن أي منها؟"
      : "**For Weight Loss & Fat Burning Research, I recommend:**\n\n🥇 **Retatrutide** (AED 700) — Triple agonist, the most potent fat burning peptide\n🥈 **Tesamorelin** (AED 999) — Specifically targets visceral fat\n🥉 **5-Amino-1MQ** (AED 500) — Enhances fat cell metabolism\n\n💡 **Pro tip:** Retatrutide + NAD+ = best fat loss protocol\n\nWant details on any of these?";
  }

  // Muscle
  if (msg.includes("muscle") || msg.includes("grow") || msg.includes("bulk") || msg.includes("mass") || msg.includes("strength") || msg.includes("عضل") || msg.includes("ضخامة") || msg.includes("قوة")) {
    return lang === "ar"
      ? "**لأبحاث بناء العضلات:**\n\n🥇 **CJC + إيباموريلين** (550 درهم) — أفضل ستاك لهرمون النمو\n🥈 **IGF-1 LR3** (599 درهم) — عامل نمو مباشر للعضلات\n🥉 **GHRP-6** (249 درهم) — معزز هرمون النمو بسعر مناسب\n\nهل تريد تفاصيل أكثر؟"
      : "**For Muscle Growth Research, I recommend:**\n\n🥇 **CJC + Ipamorelin Stack** (AED 550) — Gold standard GH stack\n🥈 **IGF-1 LR3** (AED 599) — Direct muscle growth factor\n🥉 **GHRP-6** (AED 249) — Budget-friendly GH booster\n\n💡 **Stack:** CJC+Ipa + Wolverine Stack = growth + recovery\n\nWant details?";
  }

  // Healing
  if (msg.includes("heal") || msg.includes("injur") || msg.includes("recover") || msg.includes("tendon") || msg.includes("joint") || msg.includes("pain") || msg.includes("gut") || msg.includes("شفاء") || msg.includes("إصابة") || msg.includes("تعافي") || msg.includes("ألم") || msg.includes("مفصل")) {
    return lang === "ar"
      ? "**لأبحاث الشفاء والتعافي:**\n\n🥇 **ستاك وولفرين** (599 درهم) — BPC-157 + TB-500 معاً\n🥈 **BPC-157** (299 درهم) — الأكثر مبيعاً للشفاء\n🥉 **TB-500** (320 درهم) — للمرونة وإصلاح العضلات\n\n**لمشاكل الأمعاء:** KPV (420 درهم) مضاد التهابات قوي للأمعاء\n\nأي منطقة تركز عليها؟"
      : "**For Healing & Recovery Research:**\n\n🥇 **Wolverine Stack** (AED 599) — BPC-157 + TB-500 synergy\n🥈 **BPC-157** (AED 299) — #1 healing peptide\n🥉 **TB-500** (AED 320) — Muscle repair & flexibility\n\n**For gut issues:** KPV (AED 420) — potent gut anti-inflammatory\n\nWhich area — joints, gut, or general recovery?";
  }

  // Anti-aging
  if (msg.includes("aging") || msg.includes("longevity") || msg.includes("young") || msg.includes("شيخوخة") || msg.includes("شباب") || msg.includes("عمر")) {
    return lang === "ar"
      ? "**لأبحاث مكافحة الشيخوخة:**\n\n🥇 **NAD+** (300 درهم) — حجر الزاوية في أبحاث طول العمر\n🥈 **GHK-Cu** (335 درهم) — يعكس تعبير الجينات المرتبط بالشيخوخة\n🥉 **MOTS-C** (325 درهم) — محاكي التمرين الخلوي\n\n💡 **أفضل بروتوكول:** NAD+ + GHK-Cu + MOTS-C"
      : "**For Anti-Aging Research:**\n\n🥇 **NAD+** (AED 300) — Cornerstone of longevity research\n🥈 **GHK-Cu** (AED 335) — Reverses age-related gene expression\n🥉 **MOTS-C** (AED 325) — Exercise mimetic peptide\n\n💡 **Ultimate stack:** NAD+ + GHK-Cu + MOTS-C";
  }

  // Skin
  if (msg.includes("skin") || msg.includes("collagen") || msg.includes("beauty") || msg.includes("hair") || msg.includes("glow") || msg.includes("بشرة") || msg.includes("كولاجين") || msg.includes("شعر") || msg.includes("جمال")) {
    return lang === "ar"
      ? "**لأبحاث تجديد البشرة:**\n\n🥇 **ستاك جلو** (899 درهم) — ستاك البشرة المتكامل\n🥈 **GHK-Cu** (335 درهم) — أفضل ببتيد للبشرة والشعر\n🥉 **ستاك كلو** (1,200 درهم) — بريميوم\n\n**للشعر:** GHK-Cu هو الأفضل لتحفيز بصيلات الشعر"
      : "**For Skin & Beauty Research:**\n\n🥇 **GLOW Stack** (AED 899) — Complete skin rejuvenation\n🥈 **GHK-Cu** (AED 335) — Best for collagen + hair growth\n🥉 **KLOW Stack** (AED 1,200) — Premium healing + skin\n\n**For hair:** GHK-Cu is the most researched for hair follicle stimulation";
  }

  // Sleep
  if (msg.includes("sleep") || msg.includes("insomnia") || msg.includes("نوم") || msg.includes("أرق")) {
    return lang === "ar"
      ? "**لأبحاث النوم:**\n\n🥇 **DSIP** (350 درهم) — ببتيد تحفيز النوم العميق\n🥈 **سيلانك** (250 درهم) — مضاد للقلق والتوتر\n\n💡 **أفضل بروتوكول:** DSIP + سيلانك معاً"
      : "**For Sleep Research:**\n\n🥇 **DSIP** (AED 350) — Deep delta wave sleep\n🥈 **Selank** (AED 250) — Anti-anxiety without sedation\n\n💡 **Best combo:** DSIP + Selank";
  }

  // Focus / brain
  if (msg.includes("focus") || msg.includes("brain") || msg.includes("cognitive") || msg.includes("memory") || msg.includes("anxiety") || msg.includes("stress") || msg.includes("تركيز") || msg.includes("ذاكرة") || msg.includes("قلق") || msg.includes("دماغ")) {
    return lang === "ar"
      ? "**لأبحاث تعزيز الإدراك:**\n\n🥇 **سيماكس** (329 درهم) — أقوى ببتيد منشط للذهن\n🥈 **سيلانك** (250 درهم) — مضاد للقلق + تعزيز الإدراك\n🥉 **NAD+** (300 درهم) — طاقة الخلايا العصبية\n\n💡 **أفضل ستاك:** سيماكس + سيلانك + NAD+"
      : "**For Cognitive Research:**\n\n🥇 **Semax** (AED 329) — Most potent nootropic peptide\n🥈 **Selank** (AED 250) — Anti-anxiety + clarity\n🥉 **NAD+** (AED 300) — Brain cell energy\n\n💡 **Brain stack:** Semax + Selank + NAD+";
  }

  // BAC water specific
  if (msg.includes("water") || msg.includes("bac") || msg.includes("reconstitut") || msg.includes("how to use") || msg.includes("ماء") || msg.includes("كيف استخدم") || msg.includes("تحضير")) {
    return PEPTIDE_INFO["bac-water"][lang];
  }

  // Pricing
  if (msg.includes("price") || msg.includes("cost") || msg.includes("how much") || msg.includes("سعر") || msg.includes("كم") || msg.includes("ثمن")) {
    return lang === "ar"
      ? "**أسعارنا (درهم إماراتي):**\n\n• سيلانك — 250 درهم\n• GHRP-6 — 249 درهم\n• BPC-157 — 299 درهم\n• CJC-1295 — 299 درهم\n• NAD+ — 300 درهم\n• TB-500 — 320 درهم\n• MOTS-C — 325 درهم\n• سيماكس — 329 درهم\n• GHK-Cu — 335 درهم\n• DSIP — 350 درهم\n• KPV — 420 درهم\n• 5-أمينو — 500 درهم\n• CJC+إيبا — 550 درهم\n• IGF-1 — 599 درهم\n• وولفرين — 599 درهم\n• ريتاتروتايد — 700 درهم\n\nأي منتج تريد تفاصيل أكثر عنه؟"
      : "**Our Prices (AED):**\n\n• Selank — 250\n• GHRP-6 — 249\n• BPC-157 — 299\n• CJC-1295 — 299\n• NAD+ — 300\n• TB-500 — 320\n• MOTS-C — 325\n• Semax — 329\n• GHK-Cu — 335\n• DSIP — 350\n• KPV — 420\n• 5-Amino-1MQ — 500\n• CJC+Ipa Stack — 550\n• IGF-1 LR3 — 599\n• Wolverine Stack — 599\n• Retatrutide — 700\n\nWhich product do you want details on?";
  }

  // Shipping
  if (msg.includes("ship") || msg.includes("delivery") || msg.includes("order") || msg.includes("توصيل") || msg.includes("شحن") || msg.includes("طلب")) {
    return lang === "ar"
      ? "**معلومات الشحن:**\n\n• التجهيز خلال 24 ساعة\n• التوصيل: 2-3 أيام عمل (الإمارات)\n• تغليف سري ومستقر الحرارة\n• شحن مجاني للطلبات فوق 300 درهم\n• تتبع الطلب: biostackpeptide.com/tracking\n\nللدعم: Contact@biostackpeptide.com"
      : "**Shipping Info:**\n\n• Processed within 24 hours\n• Delivery: 2-3 business days (UAE)\n• Discreet, temperature-stable packaging\n• Free shipping over AED 300\n• Track: biostackpeptide.com/tracking";
  }

  // Contact
  if (msg.includes("contact") || msg.includes("email") || msg.includes("phone") || msg.includes("support") || msg.includes("تواصل") || msg.includes("اتصال") || msg.includes("دعم")) {
    return lang === "ar"
      ? "**تواصل معنا:**\n\n📧 البريد: Contact@biostackpeptide.com\n📱 واتساب: +1 (872) 366-1398\n🕐 متاح السبت-الخميس، 9 صباحاً - 6 مساءً"
      : "**Contact Us:**\n\n📧 Email: Contact@biostackpeptide.com\n📱 WhatsApp: +1 (872) 366-1398\n🕐 Mon–Sat, 9AM–6PM";
  }

  // Thanks
  if (msg.includes("thank") || msg.includes("thanks") || msg.includes("شكر") || msg.includes("مشكور")) {
    return lang === "ar"
      ? "عفواً! سعيد بمساعدتك. إذا كان لديك أي أسئلة أخرى، لا تتردد في السؤال. بالتوفيق في أبحاثك! 🔬"
      : "You're welcome! Happy to help. If you have any more questions, just ask. Good luck with your research! 🔬";
  }

  // Default
  return lang === "ar"
    ? "أود مساعدتك في إيجاد الببتيد المناسب! أخبرني بهدفك:\n\n• إنقاص الوزن / حرق الدهون\n• بناء العضلات\n• الشفاء والتعافي\n• مكافحة الشيخوخة\n• تحسين البشرة / الشعر\n• تحسين النوم\n• التركيز والذاكرة\n\nأو اسأل عن أي منتج محدد!"
    : "I'd love to help! Tell me your research goal:\n\n• Weight loss / fat burning\n• Muscle growth\n• Healing & recovery\n• Anti-aging / longevity\n• Skin / hair\n• Better sleep\n• Focus / brain\n\nOr ask about any specific product — I'll give you everything you need to know!";
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set initial greeting when language changes or first open
  useEffect(() => {
    setMessages([{ role: "assistant", content: UI_TEXT[lang].greeting }]);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setTimeout(() => {
      const response = generateResponse(userMsg, lang);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 500);
  }

  const t = UI_TEXT[lang];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-cyan text-white shadow-lg hover:bg-brand-cyan/90 transition-all flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </button>
      )}

      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-brand-border flex flex-col overflow-hidden ${lang === "ar" ? "text-right" : ""}`} dir={lang === "ar" ? "rtl" : "ltr"}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-brand-cyan text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t.title}</p>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  {t.online}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 text-xs hover:bg-white/30 transition-colors"
              >
                <Globe className="w-3 h-3" />
                {t.langSwitch}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === "user" ? "bg-brand-cyan/10 text-brand-cyan" : "bg-blue-50 text-brand-cyan"}`}>
                  {msg.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                </div>
                <div className={`max-w-[75%] px-3 py-2.5 rounded-xl text-sm leading-relaxed whitespace-pre-line ${msg.role === "user" ? "bg-brand-cyan text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-brand-border">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 px-3 py-2.5 bg-gray-50 border border-brand-border rounded-lg text-sm text-gray-900 placeholder-brand-muted focus:outline-none focus:border-brand-cyan/50"
                dir={lang === "ar" ? "rtl" : "ltr"}
              />
              <button type="submit" disabled={!input.trim()} className="p-2.5 rounded-lg bg-brand-cyan text-white hover:bg-brand-cyan/90 transition-colors disabled:opacity-40">
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-center text-[10px] text-brand-muted mt-2">{t.powered}</p>
          </div>
        </div>
      )}
    </>
  );
}
