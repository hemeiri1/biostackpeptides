"use client";

import { useEffect } from "react";

export default function TrackingPixel() {
  useEffect(() => {
    // Generate or retrieve visitor ID
    let visitorId = localStorage.getItem("biostack_visitor");
    if (!visitorId) {
      visitorId = "v_" + Math.random().toString(36).substring(2, 15) + Date.now();
      localStorage.setItem("biostack_visitor", visitorId);
    }

    // Track this page view
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    }).catch(() => {});
  }, []);

  return null;
}
