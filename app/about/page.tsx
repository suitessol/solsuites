"use client"

import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Blue Sky Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-sky-400 to-sky-300">
        {/* Pixel texture overlay */}
        <div className="absolute inset-0 pixel-grid opacity-10"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col p-4 pt-8 md:p-8 md:pt-10">
        <div className="pixel-border border-4 border-[#2C0E61] bg-[#132B50] p-6 backdrop-blur-sm shadow-[0_0_10px_rgba(76,28,136,0.5)]">
          <div className="mb-6">
            <Link href="/" className="font-press-start inline-flex items-center text-[#F0F0F0] hover:text-[#6A30C2]">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <h1 className="font-press-start mb-6 text-3xl font-bold text-[#F0F0F0]">ABOUT TRENCH TOWER</h1>

          <div className="space-y-4">
            <p className="font-press-start text-[#a4c2e0]">
              TRENCH TOWER is a digital real estate platform built on Solana, allowing users to buy, rent, and trade
              virtual properties.
            </p>

            <p className="font-press-start text-[#a4c2e0]">
              Our mission is to create a vibrant digital economy where property ownership provides passive income and
              investment opportunities in the metaverse.
            </p>

            <h2 className="font-press-start mt-8 mb-4 text-2xl font-bold text-[#00f0ff]">OUR VISION</h2>

            <p className="font-press-start text-[#a4c2e0]">
              We envision a future where digital real estate is as valuable and functional as physical property,
              providing utility across various metaverse platforms and web3 applications.
            </p>

            <h2 className="font-press-start mt-8 mb-4 text-2xl font-bold text-[#00f0ff]">THE TEAM</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="pixel-border border-2 border-[#2C0E61] bg-[#132B50]/50 p-4">
                <h3 className="font-press-start mb-2 text-xl text-[#F0F0F0]">FOUNDER</h3>
                <p className="font-press-start text-[#F0F0F0]">
                  Pixel Architect with 5+ years in blockchain development and virtual worlds
                </p>
              </div>

              <div className="pixel-border border-2 border-[#4e8eca] bg-[#1a1a2e]/50 p-4">
                <h3 className="font-press-start mb-2 text-xl text-[#00f0ff]">LEAD DEVELOPER</h3>
                <p className="font-press-start text-[#a4c2e0]">
                  Solana expert specializing in smart contracts and tokenomics
                </p>
              </div>

              <div className="pixel-border border-2 border-[#4e8eca] bg-[#1a1a2e]/50 p-4">
                <h3 className="font-press-start mb-2 text-xl text-[#00f0ff]">CREATIVE DIRECTOR</h3>
                <p className="font-press-start text-[#a4c2e0]">Pixel artist with background in game design and UI/UX</p>
              </div>

              <div className="pixel-border border-2 border-[#4e8eca] bg-[#1a1a2e]/50 p-4">
                <h3 className="font-press-start mb-2 text-xl text-[#00f0ff]">COMMUNITY MANAGER</h3>
                <p className="font-press-start text-[#a4c2e0]">
                  Web3 native with experience growing communities in the NFT space
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
