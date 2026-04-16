"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { useCurrency } from "@/lib/CurrencyContext";
import { Scale, Plus, X, Star, ChevronDown } from "lucide-react";
import VialImage from "@/components/VialImage";
import Link from "next/link";

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { format } = useCurrency();

  const compareProducts = selected.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;

  function addProduct(id: string) {
    if (selected.length >= 3) return;
    if (!selected.includes(id)) setSelected([...selected, id]);
    setDropdownOpen(false);
  }

  function removeProduct(id: string) {
    setSelected(selected.filter((s) => s !== id));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <Scale className="w-8 h-8 text-brand-cyan mx-auto mb-3" />
        <h1 className="text-3xl font-extrabold text-[#1B3A5C] mb-2">Compare Peptides</h1>
        <p className="text-[#5a6f80] text-sm">Select up to 3 peptides to compare side by side.</p>
      </div>

      {/* Product selector */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {compareProducts.map((p) => (
          <div key={p.id} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20">
            <span className="text-sm font-semibold text-[#1B3A5C]">{p.shortName}</span>
            <button onClick={() => removeProduct(p.id)} className="text-brand-muted hover:text-red-500"><X className="w-4 h-4" /></button>
          </div>
        ))}
        {selected.length < 3 && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-[#e8edf2] text-[#8a9bab] hover:border-brand-cyan/50 hover:text-brand-cyan transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Peptide <ChevronDown className="w-3 h-3" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-[#e8edf2] rounded-xl shadow-xl max-h-60 overflow-y-auto z-20">
                {products.filter((p) => !selected.includes(p.id) && p.category !== "Accessories").map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addProduct(p.id)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors text-[#1B3A5C]"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison table */}
      {compareProducts.length >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 text-xs text-[#8a9bab] font-medium uppercase tracking-wider w-32">Feature</th>
                {compareProducts.map((p) => (
                  <th key={p.id} className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <VialImage name={p.shortName} size="" slug={p.slug} className="h-24 mb-2" />
                      <Link href={`/products/${p.slug}`} className="text-[#1B3A5C] font-bold text-sm hover:text-brand-cyan">{p.name}</Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Category", render: (p: any) => p.category },
                { label: "Starting Price", render: (p: any) => format(p.sizes[0].price) },
                { label: "Sizes", render: (p: any) => p.sizes.map((s: any) => s.label).join(", ") },
                { label: "Description", render: (p: any) => p.description },
                { label: "Benefits", render: (p: any) => p.benefits.slice(0, 3).join(" · ") },
                { label: "Storage", render: (p: any) => p.storage },
                { label: "Usage", render: (p: any) => p.usage },
              ].map((row) => (
                <tr key={row.label} className="border-t border-[#e8edf2]">
                  <td className="p-4 text-xs font-semibold text-[#8a9bab] uppercase">{row.label}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 text-sm text-[#5a6f80] text-center">{row.render(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {compareProducts.length < 2 && (
        <div className="text-center py-16">
          <Scale className="w-12 h-12 text-[#e8edf2] mx-auto mb-4" />
          <p className="text-[#8a9bab] text-sm">Select at least 2 peptides to compare.</p>
        </div>
      )}
    </div>
  );
}
