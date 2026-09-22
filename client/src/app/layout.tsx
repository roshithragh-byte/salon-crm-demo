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
  title: "Luxury Skincare & Wellness Studio | Kottakkal",
  description:
    "Kottakkal's premier independent luxury salon & wellness studio. Book your personalised skincare, beauty, and grooming appointment online.",
  keywords: [
    "skincare",
    "salon",
    "beauty",
    "wellness",
    "Kottakkal",
    "appointment",
    "Kerala",
  ],
  openGraph: {
    title: "Luxury Skincare & Wellness Studio | Kottakkal",
    description:
      "Book a luxury skincare or wellness appointment in Kottakkal, Kerala.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
