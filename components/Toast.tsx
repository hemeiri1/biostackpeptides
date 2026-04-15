"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Check, Info, X } from "lucide-react";

interface ToastData {
  id: number;
  message: string;
  type: "success" | "info";
}

interface ToastContextValue {
  showToast: (message: string, type?: "success" | "info") => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: "success" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-xl border border-brand-border animate-slide-up min-w-[280px]"
          >
            {toast.type === "success" ? (
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
            )}
            <p className="text-sm text-gray-900 font-medium">{toast.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-auto text-brand-muted hover:text-gray-900 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
