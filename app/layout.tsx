import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { ErrorBoundary } from "./components";
import { cookies } from "next/headers";
import type { Language } from "./locales/config";
import { QueryProvider } from "./providers/query-client";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read preferred language from cookie on the server
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('sakura-lang')?.value as Language | undefined;
  const initialLanguage: Language = cookieLang === 'ja' ? 'ja' : 'en';
  return (
    <html lang={initialLanguage} data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${sakuraFont.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <LanguageProvider initialLanguage={initialLanguage}>
            <Suspense fallback={null}>
              <LoadingProvider>
                <QueryProvider>
                  {children}
                </QueryProvider>
              </LoadingProvider>
            </Suspense>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
