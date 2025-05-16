import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Press_Start_2P } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })
const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SUITES - Digital Real Estate on Solana",
  description: "Buy, rent, and trade virtual properties on Solana",
  icons: {
    icon: "/logo2.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${pressStart2P.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
