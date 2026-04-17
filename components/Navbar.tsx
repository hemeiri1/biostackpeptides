"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, ChevronDown, UserCircle } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useCurrency, currencies } from "@/lib/CurrencyContext";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { loggedIn } = useAuth();
  const { totalItems } = useCart();
  const { currency, setCurrency } = useCurrency();

  const links = [
    { href: "/products", label: "Products" },
    { href: "/bundle", label: "Build a Stack" },
    { href: "/peptides", label: "What Are Peptides?" },
    { href: "/blog", label: "Articles" },
    { href: "/compare", label: "Compare" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.jpg" alt="BioStack Peptides" className="h-12 w-auto" />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-brand-muted hover:text-gray-900 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Currency + Cart + Mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Currency selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-brand-border text-xs font-medium text-brand-muted hover:text-gray-900 hover:border-brand-cyan/50 transition-colors"
              >
                {currency.code}
                <ChevronDown className="w-3 h-3" />
              </button>
              {currencyOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-brand-border rounded-xl shadow-lg py-1 max-h-60 overflow-y-auto z-50">
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${
                        currency.code === c.code
                          ? "text-brand-cyan font-medium"
                          : "text-gray-900"
                      }`}
                    >
                      <span>{c.code}</span>
                      <span className="text-brand-muted text-xs">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Account */}
            <Link
              href={loggedIn ? "/account" : "/login"}
              className="p-2 text-brand-muted hover:text-gray-900 transition-colors"
            >
              <UserCircle className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-brand-muted hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-cyan text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-brand-muted hover:text-gray-900 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-brand-border">
          <div className="px-4 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-brand-muted hover:text-gray-900 transition-colors text-sm font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
