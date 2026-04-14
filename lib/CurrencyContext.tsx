"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // rate relative to AED
}

export const currencies: Currency[] = [
  { code: "AED", symbol: "د.إ", rate: 1 },
  { code: "USD", symbol: "$", rate: 0.2723 },
  { code: "EUR", symbol: "€", rate: 0.2510 },
  { code: "GBP", symbol: "£", rate: 0.2150 },
  { code: "SAR", symbol: "﷼", rate: 1.0208 },
  { code: "KWD", symbol: "د.ك", rate: 0.0834 },
  { code: "QAR", symbol: "ر.ق", rate: 0.9913 },
  { code: "BHD", symbol: "د.ب", rate: 0.1026 },
  { code: "OMR", symbol: "ر.ع", rate: 0.1048 },
  { code: "INR", symbol: "₹", rate: 22.73 },
  { code: "CAD", symbol: "C$", rate: 0.3732 },
  { code: "AUD", symbol: "A$", rate: 0.4188 },
];

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (aedPrice: number) => number;
  format: (aedPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(currencies[0]); // AED default

  const convert = useCallback(
    (aedPrice: number) => aedPrice * currency.rate,
    [currency]
  );

  const format = useCallback(
    (aedPrice: number) => {
      const converted = aedPrice * currency.rate;
      return `${currency.symbol} ${converted.toFixed(2)}`;
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
