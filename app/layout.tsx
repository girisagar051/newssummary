import type { Metadata } from "next";
import { Noto_Serif_Devanagari, Mukta } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

// Serif for headlines — newspaper-quality Devanagari
const notoSerifDev = Noto_Serif_Devanagari({
  variable: "--font-serif-dev",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Sans-serif for body — clean, highly legible Nepali
const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "खबरपाटी — Nepal's Smart News Hub",
  description: "नेपालका प्रमुख समाचार पत्रिकाहरूबाट ताजा खबर। AI-powered personalized news aggregator for Nepal.",
  keywords: "Nepal news, Nepali news, खबर, समाचार, KhabarPati",
  openGraph: {
    title: "खबरपाटी — Nepal's Smart News Hub",
    description: "Aggregated, personalized news from Nepal's top sources",
    locale: "ne_NP",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ne" className={`${notoSerifDev.variable} ${mukta.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f6f5f0] overflow-x-hidden">
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
