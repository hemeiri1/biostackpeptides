"use client";

import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});
    setSubscribed(true);
    setEmail("");
  }

  return (
    <section className="bg-gradient-to-r from-[#1B3A5C] to-[#0B2341] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-brand-cyan" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Stay Updated</h2>
          <p className="text-blue-200 text-sm mb-6">
            Get exclusive deals, new product alerts, and research tips delivered to your inbox.
          </p>

          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-medium">
              <Check className="w-5 h-5" />
              You&apos;re in! Watch your inbox for exclusive offers.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 text-sm focus:outline-none focus:border-brand-cyan"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-brand-cyan text-white font-semibold text-sm hover:bg-brand-cyan/90 transition-colors flex items-center gap-2"
              >
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-blue-300/60 text-xs mt-4">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
