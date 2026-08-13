import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MarketingIRA — AI-Powered Social Media Suite",
  description:
    "Connect your social accounts, generate on-brand posts with AI, and publish immediately or schedule them for later — all from one dashboard.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/images/logos/logo.svg", type: "image/svg+xml", sizes: "1024x1024" },
    ],
    shortcut: "/icon.svg",
    apple: "/images/logos/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
