"use client"

import { ArrowLeftIcon, CoinsIcon, PercentIcon, ShieldIcon, BarChart3Icon } from "lucide-react"
import Link from "next/link"

export default function TokenPage() {
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

          <h1 className="font-press-start mb-6 text-3xl font-bold text-[#F0F0F0]">$TOWER TOKEN</h1>

          <div className="space-y-6">
            <p className="font-press-start text-[#a4c2e0]">
              $TOWER is the native utility token of the TRENCH TOWER ecosystem, used for property purchases, rental
              payments, governance, and staking rewards.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="pixel-border border-4 border-[#2C0E61] rounded-lg bg-[#132B50] p-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#6A30C2] border border-[#2C0E61]">
                  <CoinsIcon className="h-8 w-8 text-[#F0F0F0]" />
                </div>
                <h3 className="font-press-start mb-2 text-xl text-[#F0F0F0]">TOTAL SUPPLY</h3>
                <p className="font-press-start text-[#F0F0F0]">100,000,000 $TOWER</p>
              </div>

              <div className="pixel-border border-4 border-[#4e8eca] rounded-lg bg-gradient-to-r from-[#0f3443]/70 to-[#1a4a6a]/70 p-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0a0a2a] border border-[#00f0ff]/50">
                  <PercentIcon className="h-8 w-8 text-[#00f0ff]" />
                </div>
                <h3 className="font-press-start mb-2 text-xl text-[#00f0ff]">STAKING APY</h3>
                <p className="font-press-start text-[#a4c2e0]">Up to 15% annually</p>
              </div>
            </div>

            <h2 className="font-press-start mt-8 mb-4 text-2xl font-bold text-[#00f0ff]">TOKEN UTILITY</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-gradient-to-r from-[#1a1a4a]/80 to-[#2a3a52]/80 p-4 rounded-lg flex items-start">
                <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0a0a2a] border border-[#00f0ff]/50">
                  <CoinsIcon className="h-5 w-5 text-[#00f0ff]" />
                </div>
                <div>
                  <h4 className="font-press-start mb-1 text-md text-[#00f0ff]">PROPERTY PURCHASES</h4>
                  <p className="font-press-start text-xs text-[#a4c2e0]">
                    Buy virtual properties in the TRENCH TOWER building using $TOWER tokens
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#1a1a4a]/80 to-[#2a3a52]/80 p-4 rounded-lg flex items-start">
                <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0a0a2a] border border-[#00f0ff]/50">
                  <PercentIcon className="h-5 w-5 text-[#00f0ff]" />
                </div>
                <div>
                  <h4 className="font-press-start mb-1 text-md text-[#00f0ff]">RENTAL INCOME</h4>
                  <p className="font-press-start text-xs text-[#a4c2e0]">
                    Earn passive income in $TOWER from your owned properties
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#1a1a4a]/80 to-[#2a3a52]/80 p-4 rounded-lg flex items-start">
                <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0a0a2a] border border-[#00f0ff]/50">
                  <ShieldIcon className="h-5 w-5 text-[#00f0ff]" />
                </div>
                <div>
                  <h4 className="font-press-start mb-1 text-md text-[#00f0ff]">GOVERNANCE</h4>
                  <p className="font-press-start text-xs text-[#a4c2e0]">
                    Vote on protocol upgrades and community proposals
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#1a1a4a]/80 to-[#2a3a52]/80 p-4 rounded-lg flex items-start">
                <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0a0a2a] border border-[#00f0ff]/50">
                  <BarChart3Icon className="h-5 w-5 text-[#00f0ff]" />
                </div>
                <div>
                  <h4 className="font-press-start mb-1 text-md text-[#00f0ff]">STAKING REWARDS</h4>
                  <p className="font-press-start text-xs text-[#a4c2e0]">
                    Stake $TOWER to earn additional yield and exclusive benefits
                  </p>
                </div>
              </div>
            </div>

            <h2 className="font-press-start mt-8 mb-4 text-2xl font-bold text-[#00f0ff]">TOKENOMICS</h2>

            <div className="pixel-border border-4 border-[#4e8eca] bg-[#1a1a2e]/50 p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-press-start text-[#a4c2e0]">Community Allocation:</span>
                  <span className="font-press-start text-[#00f0ff]">40%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-press-start text-[#a4c2e0]">Team & Development:</span>
                  <span className="font-press-start text-[#00f0ff]">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-press-start text-[#a4c2e0]">Staking Rewards:</span>
                  <span className="font-press-start text-[#00f0ff]">15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-press-start text-[#a4c2e0]">Liquidity Pool:</span>
                  <span className="font-press-start text-[#00f0ff]">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-press-start text-[#a4c2e0]">Marketing:</span>
                  <span className="font-press-start text-[#00f0ff]">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-press-start text-[#a4c2e0]">Treasury:</span>
                  <span className="font-press-start text-[#00f0ff]">5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
