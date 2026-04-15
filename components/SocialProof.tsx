"use client";

import { useState, useEffect } from "react";
import { X, ShoppingBag } from "lucide-react";

const names = [
  "Ahmed", "Mohammed", "Fatima", "Sara", "Khalid", "Noura", "Omar", "Layla",
  "Hassan", "Mariam", "Ali", "Aisha", "Rashid", "Dana", "Youssef", "Huda",
];

const cities = [
  "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Al Ain", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain",
];

const productNames = [
  "BPC-157", "TB-500", "Retatrutide", "Semaglutide", "GHK-Cu", "MOTS-C",
  "Wolverine Stack", "Klow Stack", "Glow Stack", "CJC+Ipa Stack",
  "Semax", "Selank", "NAD+", "5-Amino-1MQ", "Epithalon",
];

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SocialProof() {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ name: "", city: "", product: "", time: 0 });

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    function showNotification() {
      setNotification({
        name: random(names),
        city: random(cities),
        product: random(productNames),
        time: Math.floor(Math.random() * 15) + 1,
      });
      setShow(true);
      setTimeout(() => setShow(false), 5000);
      timeout = setTimeout(showNotification, (Math.random() * 20 + 15) * 1000);
    }

    // First notification after 8 seconds
    timeout = setTimeout(showNotification, 8000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`fixed bottom-24 left-6 z-40 max-w-xs transition-all duration-500 ${
        show ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white rounded-xl shadow-xl border border-brand-border p-4 border-l-4 border-l-brand-cyan">
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 text-brand-muted hover:text-gray-900 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-brand-cyan" />
          </div>
          <div>
            <p className="text-sm text-gray-900 font-medium">
              {notification.name} from {notification.city}
            </p>
            <p className="text-xs text-brand-muted">
              purchased <strong className="text-gray-900">{notification.product}</strong>
            </p>
            <p className="text-[10px] text-brand-muted mt-1">{notification.time} min ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
