"use client";

import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

export default function AgeGate() {
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem("biostack-age-verified");
    if (!verified) setShow(true);
  }, []);

  function handleConfirm() {
    if (!checked) return;
    localStorage.setItem("biostack-age-verified", "true");
    setShow(false);
  }

  function handleDecline() {
    window.location.href = "https://www.google.com";
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#1B3A5C] p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Age Verification Required</h2>
          <p className="text-blue-200 text-sm mt-1">BioStack Peptides</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-900 text-sm font-medium mb-3">
            Before entering this website, please confirm the following:
          </p>

          <div className="space-y-3 mb-5 text-sm text-brand-muted">
            <div className="flex gap-2">
              <span className="text-brand-cyan font-bold shrink-0">1.</span>
              <p>I am <strong className="text-gray-900">18 years of age or older</strong>.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-brand-cyan font-bold shrink-0">2.</span>
              <p>I understand that all products sold on this website are intended <strong className="text-gray-900">strictly for in-vitro research and laboratory use only</strong>.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-brand-cyan font-bold shrink-0">3.</span>
              <p>These products are <strong className="text-gray-900">not intended for human consumption</strong>, veterinary use, or any therapeutic application.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-brand-cyan font-bold shrink-0">4.</span>
              <p>I am a qualified researcher and will use products solely for <strong className="text-gray-900">lawful research purposes</strong>.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-brand-cyan font-bold shrink-0">5.</span>
              <p>These products have <strong className="text-gray-900">not been evaluated</strong> by any regulatory authority.</p>
            </div>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-brand-border bg-gray-50 cursor-pointer hover:border-brand-cyan/50 transition-colors mb-5">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-cyan focus:ring-brand-cyan"
            />
            <span className="text-sm text-gray-900">
              I confirm that I am 18+ years old and agree to the above terms and conditions.
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="flex-1 py-3 rounded-xl border border-brand-border text-brand-muted font-medium text-sm hover:text-red-500 hover:border-red-200 transition-colors"
            >
              I Decline
            </button>
            <button
              onClick={handleConfirm}
              disabled={!checked}
              className="flex-1 py-3 rounded-xl bg-brand-cyan text-white font-semibold text-sm hover:bg-brand-cyan/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Enter Site
            </button>
          </div>

          <p className="text-[10px] text-brand-muted text-center mt-4">
            By entering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
