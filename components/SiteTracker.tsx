"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function trackEvent(event: string, productId?: string, productName?: string) {
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "event", event, productId, productName }),
  }).catch(() => {});
}

export default function SiteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "pageview", page: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
