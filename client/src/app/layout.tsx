import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const cormorantGaramond = localFont({
  variable: "--font-serif",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/cormorant-normal-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/cormorant-normal-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/cormorant-normal-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/cormorant-normal-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/cormorant-italic-400.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/cormorant-italic-600.woff2",
      weight: "600",
      style: "italic",
    },
  ],
});

const montserrat = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/montserrat-normal-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/montserrat-normal-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/montserrat-normal-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/montserrat-normal-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
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
      <body className="min-h-full flex flex-col font-sans bg-[var(--bg-taupe)] text-[var(--bg-charcoal)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
