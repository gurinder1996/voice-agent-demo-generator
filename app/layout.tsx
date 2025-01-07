import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Voice AI Agent",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background antialiased flex flex-col`}
      >
        <Providers>
          <div className="flex-1 flex flex-col bg-gray-50">
            <main className="container mx-auto px-4 py-4 max-w-7xl">
              <SiteHeader />

              {children}
            </main>
            <SiteFooter />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
