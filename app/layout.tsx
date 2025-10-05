import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import AuthProvider from "./providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sakuraFont = localFont({
  src: [
    {
      path: "../public/fonts/SpringSakura-3z1m8.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sakura",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sakura Saloon",
  description: "A cozy place for relaxation and rejuvenation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sakuraFont.variable} antialiased`}
      >
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
