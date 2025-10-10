import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { ErrorBoundary } from "./components";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
        className={`${inter.variable} ${sakuraFont.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <LanguageProvider>
            <Suspense fallback={null}>
              <LoadingProvider>
                {children}
              </LoadingProvider>
            </Suspense>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
