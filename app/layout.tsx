import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import AuthProvider from "./providers/AuthProvider";
import { ErrorBoundary } from "./components";

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
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sakuraFont.variable} antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <LanguageProvider>
              <LoadingProvider>
                {children}
              </LoadingProvider>
            </LanguageProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
