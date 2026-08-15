import type { Metadata, Viewport } from "next";
import { Anuphan, Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const anuphan = Anuphan({ subsets: ["thai", "latin"], variable: "--font-anuphan" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Cerfinits — Edge + Discipline = Success",
  description:
    "Cerfinits — คอนเทนต์เทรดและ digital products สำหรับเทรดเดอร์ที่มีวินัย: คู่มือเทรดทอง XAUUSD ฟรี, e-book COT/จิตวิทยา/ICT และ EA อัตโนมัติ Cerfinits Algo SDV.1",
};

export const viewport: Viewport = {
  themeColor: "#d7d6d0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${geist.variable} ${geistMono.variable} ${anuphan.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('cf-theme');
                if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
