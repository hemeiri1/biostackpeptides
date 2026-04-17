import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import { ToastProvider } from "@/components/Toast";
import ChatWidget from "@/components/ChatWidget";
import TrackingPixel from "@/components/TrackingPixel";
import AnnouncementBar from "@/components/AnnouncementBar";
import AgeGate from "@/components/AgeGate";
import BackToTop from "@/components/BackToTop";
import CookieConsent from "@/components/CookieConsent";
import NewsletterSection from "@/components/NewsletterSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import ExitIntent from "@/components/ExitIntent";
import Analytics from "@/components/Analytics";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "BioStackPeptides — Premium Research Peptides",
  description:
    "Premium quality research peptides. BPC-157, TB-500, Semaglutide, Tirzepatide, Epithalon and more. For research purposes only.",
  keywords: "research peptides, BPC-157, TB-500, semaglutide, tirzepatide, peptide research",
  metadataBase: new URL("https://biostackpeptide.com"),
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "BioStackPeptides — Premium Research Peptides",
    description: "Premium quality research peptides for scientific research. 99%+ purity, COA on every order.",
    url: "https://biostackpeptide.com",
    siteName: "BioStackPeptides",
    images: [{ url: "/logo.jpg", width: 512, height: 512 }],
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
        <CurrencyProvider>
          <CartProvider>
            <AuthProvider>
            <ToastProvider>
              <AnnouncementBar />
              <Navbar />
              <main className="pt-16">{children}</main>
              <NewsletterSection />
              <Footer />
              <ChatWidget />
              <AgeGate />
              <WhatsAppButton />
              <BackToTop />
              <CookieConsent />
              <ExitIntent />
              <TrackingPixel />
              <Analytics />
            </ToastProvider>
            </AuthProvider>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
