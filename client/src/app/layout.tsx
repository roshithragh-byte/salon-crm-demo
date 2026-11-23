import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Naturals Unisex Salon — Editorial Web App • Kottakkal",
  description:
    "Unisex hair, skin, bridal, and spa care tailored to your natural texture and personal style at Naturals Salon Kottakkal.",
  keywords: [
    "Natural's Salon",
    "Naturals Kottakkal",
    "hair salon",
    "beauty parlour",
    "skincare",
    "bridal makeup",
    "Kottakkal",
    "Kerala",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Naturals Unisex Salon — Editorial Web App • Kottakkal",
    description:
      "Unisex hair, skin, bridal, and spa care tailored to your natural texture and personal style at Naturals Salon Kottakkal.",
    type: "website",
  },
};

import { Providers } from "@/components/Providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif bg-[#c4beae] text-[#252628]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
