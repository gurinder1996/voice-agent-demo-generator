import type { Metadata } from "next"
import localFont from "next/font/local"
import "../globals.css"
import { Providers } from "../providers"

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
})

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "AI Sales Demo",
  description: "Talk to your AI sales representative",
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center -mt-20">
      {children}
    </div>
  )
}
