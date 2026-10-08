import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Natural's Salon | India's No.1 Hair & Beauty Salon • Kottakkal",
  description:
    "Natural's Salon Kottakkal — premier hair, beauty, skincare, and bridal salon. Book your personalised salon appointment online.",
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
    title: "Natural's Salon | India's No.1 Hair & Beauty Salon • Kottakkal",
    description:
      "Book a premier hair, beauty, or skincare appointment at Natural's Salon Kottakkal, Kerala.",
    type: "website",
  },
};

import { Providers } from "@/components/Providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><Providers>{children}</Providers></body>
    </html>
  );
}
