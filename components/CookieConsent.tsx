"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("biostack-cookie-consent");
    if (!consent) {
      setTimeout(() => setShow(true), 2000);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("biostack-cookie-consent", "accepted");
    setShow(false);
  }

  function handleDecline() {
    localStorage.setItem("biostack-cookie-consent", "declined");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-brand-border p-5 flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-brand-muted flex-1">
          We use cookies to improve your experience and analyze site traffic. By continuing, you agree to our{" "}
          <Link href="/privacy" className="text-brand-cyan hover:underline">Privacy Policy</Link>.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 rounded-lg border border-brand-border text-brand-muted text-sm font-medium hover:text-gray-900 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 rounded-lg bg-brand-cyan text-white text-sm font-medium hover:bg-brand-cyan/90 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
