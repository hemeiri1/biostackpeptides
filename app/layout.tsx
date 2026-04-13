import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";

export const metadata: Metadata = {
  title: "BioStackPeptides — Premium Research Peptides",
  description:
    "Premium quality research peptides. BPC-157, TB-500, Semaglutide, Tirzepatide, Epithalon and more. For research purposes only.",
  keywords: "research peptides, BPC-157, TB-500, semaglutide, tirzepatide, peptide research",
  metadataBase: new URL("https://biostackpeptide.com"),
  openGraph: {
    title: "BioStackPeptides — Premium Research Peptides",
    description: "Premium quality research peptides for scientific research. 99%+ purity, COA on every order.",
    url: "https://biostackpeptide.com",
    siteName: "BioStackPeptides",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
