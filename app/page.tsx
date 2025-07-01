"use client"
import Image from "next/image"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  ArrowRightIcon,
  TrendingUpIcon,
  BuildingIcon,
  CoinsIcon,
  PercentIcon,
  ShieldIcon,
  BarChart3Icon,
  UsersIcon,
  GlobeIcon,
  ZapIcon,
  StarIcon,
  Copy,
  Check,
} from "lucide-react"

export default function HomePage() {
  // Animation for price charts
  const [priceIndex, setPriceIndex] = useState(0)
  const [rentalIndex, setRentalIndex] = useState(0)
  const [activeFeature, setActiveFeature] = useState("buy")
  const [copied, setCopied] = useState(false)

  // Contract address
  const contractAddress = "COMING SOON! FOLLOW ON X."

  // Copy contract address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simulated price data (increasing trend)
  const priceData = [80, 85, 90, 88, 95, 100, 105, 110, 115, 120, 125, 130]
  // More volatile rental data with dramatic ups and downs
  // Simple rental data with just two points - either going up or down
  const [rentalTrend, setRentalTrend] = useState(Math.random() > 0.5)
  const rentalData = rentalTrend ? [8.5, 10.2] : [10.2, 8.5]

  // Cloud animation
  const [clouds, setClouds] = useState([
    {
      id: 1,
      x: 10, // left side
      y: 15, // top area
      size: 1.8, // large cloud
      speed: 0.003, // very slow movement
      image: "cloud1.png",
      zIndex: 1,
      direction: "right", // moving right
    },
    {
      id: 2,
      x: 75, // right side
      y: 40, // middle area
      size: 1.2, // medium cloud
      speed: 0.002, // extremely slow movement
      image: "cloud2.png",
      zIndex: 2,
      direction: "left", // moving left
    },
    {
      id: 3,
      x: 30, // middle-left
      y: 65, // lower area
      size: 1.5, // large cloud
      speed: 0.0015, // very slow movement
      image: "cloud1.png",
      zIndex: 1,
      direction: "right", // moving right
    },
    {
      id: 4,
      x: 60, // middle-right
      y: 25, // upper-middle area
      size: 0.9, // small cloud
      speed: 0.0025, // slow movement
      image: "cloud2.png",
      zIndex: 2,
      direction: "left", // moving left
    },
  ])

  // Animate clouds
  useEffect(() => {
    const interval = setInterval(() => {
      setClouds((prevClouds) =>
        prevClouds.map((cloud) => {
          let newX = cloud.x

          if (cloud.direction === "right") {
            newX = (cloud.x + cloud.speed) % 110
            if (newX > 105) newX = -10 // reset to left side when off-screen
          } else {
            newX = cloud.x - cloud.speed
            if (newX < -10) newX = 110 // reset to right side when off-screen
          }

          return {
            ...cloud,
            x: newX,
          }
        }),
      )
    }, 200)

    return () => clearInterval(interval)
  }, [])

  // Animate charts
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceIndex((prev) => (prev + 1) % priceData.length)
      // Randomly change trend direction every 5 seconds
      if (Math.random() > 0.8) {
        setRentalTrend((prev) => !prev)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen w-full">
      {/* Blue Sky Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-sky-400 to-sky-300">
        {/* Pixel texture overlay */}
        <div className="absolute inset-0 pixel-grid opacity-10"></div>

        {/* Futuristic elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Glowing nodes and lines */}
          <div className="absolute left-1/4 top-1/3 h-4 w-4 rounded-full bg-[#4e8eca] shadow-[0_0_20px_#4e8eca] opacity-70"></div>
          <div className="absolute right-1/3 top-1/2 h-3 w-3 rounded-full bg-[#00f0ff] shadow-[0_0_15px_#00f0ff] opacity-60"></div>
          <div className="absolute left-2/3 bottom-1/4 h-5 w-5 rounded-full bg-[#4e8eca] shadow-[0_0_25px_#4e8eca] opacity-50"></div>

          {/* Pulsing effect */}
          <div className="absolute left-1/2 top-1/2 h-8 w-8 rounded-full bg-transparent border-2 border-[#00f0ff] opacity-30 animate-ping"></div>
          <div
            className="absolute right-1/4 top-1/4 h-6 w-6 rounded-full bg-transparent border-2 border-[#4e8eca] opacity-20 animate-ping"
            style={{ animationDuration: "3s" }}
          ></div>
        </div>

        {/* Clouds */}
        {clouds.map((cloud) => (
          <div
            key={cloud.id}
            className="absolute transition-transform duration-1000 ease-linear"
            style={{
              left: `${cloud.x}%`,
              top: `${cloud.y}%`,
              transform: `scale(${cloud.size})`,
              zIndex: cloud.zIndex,
              transition: "left 2s linear",
            }}
          >
            <Image
              src={`/images/clouds/${cloud.image}`}
              alt="Cloud"
              width={200}
              height={120}
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center p-4 pt-4 md:p-8 md:pt-6">
        {/* Hero Section - Left aligned with image on right */}
        <div className="mb-16 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-start">
            <div className="mb-6 w-full max-w-xs">
              <Image
                src="/trench-tower-logo.png"
                alt="TRENCH TOWER"
                width={200}
                height={200}
                priority
                className="pixelated drop-shadow-[0_0_15px_rgba(78,142,202,0.7)]"
              />
            </div>
            <h1 className="font-press-start mb-4 text-4xl md:text-6xl font-bold text-[#1a1a2e] text-left">
              OWN DIGITAL
              <br />
              REAL ESTATE
            </h1>
            <p className="font-press-start mb-8 text-xl text-[#1a1a2e] text-left">
              Buy, rent, and trade virtual properties on Solana
            </p>
            <Link
              href="/tower"
              className="pixel-button inline-flex items-center border-4 border-[#2C0E61] px-8 py-4 font-press-start text-xl text-[#F0F0F0] transition-all hover:bg-[#7A40D2] shadow-[0_4px_0_#4C1C88]"
            >
              EXPLORE BUILDING <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              <Image
                src="/images/hero.webp"
                alt="SUITES Building"
                width={500}
                height={500}
                priority
                className="pixelated drop-shadow-[0_0_20px_rgba(78,142,202,0.5)]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent via-[#00f0ff]/10 animate-pulse scanlines"
                style={{ animationDuration: "3s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Contract Address Section */}
        <div className="mb-16 w-full max-w-6xl relative">
          {/* Multi-layered border effect */}
          <div className="absolute inset-0 bg-[#4e8eca] translate-x-4 translate-y-4 rounded-lg"></div>
          <div className="absolute inset-0 bg-[#2C4270] translate-x-2 translate-y-2 rounded-lg"></div>

          <div className="relative pixel-border border-4 border-[#2C4270] bg-[#1a1a4a] p-4 flex flex-col md:flex-row items-center justify-between gap-4 rounded-lg">
            <div className="font-press-start text-lg text-[#F0F0F0]">CONTRACT ADDRESS:</div>
            <div className="flex-1 flex items-center">
              <div className="pixel-border border-2 border-[#4e8eca] bg-[#132B50]/50 p-3 flex-1 overflow-x-auto">
                <p className="font-press-start text-sm md:text-base text-[#F0F0F0] whitespace-nowrap">
                  {contractAddress}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className="pixel-button ml-2 border-2 p-3 text-[#F0F0F0] hover:bg-[#7A40D2]"
                aria-label="Copy to clipboard"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* What is SUITES Section */}
        <div id="what-is-suites" className="mb-16 w-full max-w-6xl relative">
          {/* Multi-layered border effect */}
          <div className="absolute inset-0 bg-[#4e8eca] translate-x-4 translate-y-4 rounded-lg"></div>
          <div className="absolute inset-0 bg-[#2C4270] translate-x-2 translate-y-2 rounded-lg"></div>

          <div className="relative pixel-border border-4 border-[#2C4270] bg-[#1a1a4a] p-8 rounded-lg shadow-[0_0_10px_rgba(76,28,136,0.5)]">
            {/* Question mark icon */}
            <div className="absolute top-6 right-6 w-16 h-16 pixel-border border-4 border-[#4e8eca] bg-[#1a1a4a] flex items-center justify-center">
              <span className="font-press-start text-4xl text-[#F0F0F0]">?</span>
            </div>

            <h2 className="font-press-start mb-8 text-center text-4xl font-bold text-[#F0F0F0] tracking-wider">
              WHAT IS TRENCH TOWER?
            </h2>

            <div className="space-y-6">
              <p className="font-press-start text-lg text-[#F0F0F0] leading-relaxed">
                TRENCH TOWER IS A DIGITAL REAL ESTATE PLATFORM BUILT ON THE SOLANA BLOCKCHAIN THAT ALLOWS USERS TO BUY,
                RENT, AND TRADE VIRTUAL PROPERTIES IN A PIXELATED METAVERSE.
              </p>

              <p className="font-press-start text-lg text-[#F0F0F0] leading-relaxed">
                $TOWER TOKEN POWERS THE ENTIRE ECOSYSTEM, ENABLING PROPERTY TRANSACTIONS, PASSIVE INCOME, AND GOVERNANCE
                RIGHTS FOR TOKEN HOLDERS.
              </p>

              <p className="font-press-start text-lg text-[#F0F0F0] leading-relaxed">
                WITH ITS UNIQUE PIXEL ART STYLE AND GAMIFIED EXPERIENCE, TRENCH TOWER CREATES A FUN AND PROFITABLE WAY
                TO INVEST IN DIGITAL REAL ESTATE WHILE BUILDING A COMMUNITY OF OWNERS AND INVESTORS.
              </p>

              <div className="mt-10 flex justify-center">
                <Link
                  href="/token"
                  className="pixel-button inline-flex items-center border-4 border-[#4e8eca] bg-[#6A30C2] px-8 py-4 font-press-start text-xl text-[#F0F0F0] transition-all hover:bg-[#7A40D2] shadow-[0_4px_0_#4C1C88]"
                >
                  LEARN MORE ABOUT $TOWER
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section with Tabs */}
        <div className="mb-16 w-full max-w-6xl">
          <h2 className="font-press-start mb-8 text-center text-3xl font-bold text-[#1a1a2e]">FEATURES</h2>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveFeature("buy")}
                className={`pixel-border border-3 px-4 py-3 font-press-start text-lg transition-all ${
                  activeFeature === "buy"
                    ? "border-[#2C0E61] bg-[#6A30C2] text-[#F0F0F0]"
                    : "border-[#2C0E61] bg-[#132B50] text-[#F0F0F0] hover:bg-[#6A30C2]"
                }`}
              >
                BUY PROPERTIES
              </button>
              <button
                onClick={() => setActiveFeature("flip")}
                className={`pixel-border border-3 px-4 py-3 font-press-start text-lg transition-all ${
                  activeFeature === "flip"
                    ? "border-[#2C0E61] bg-[#6A30C2] text-[#F0F0F0]"
                    : "border-[#2C0E61] bg-[#132B50] text-[#F0F0F0] hover:bg-[#6A30C2]"
                }`}
              >
                FLIP PROPERTIES
              </button>
              <button
                onClick={() => setActiveFeature("earn")}
                className={`pixel-border border-3 px-4 py-3 font-press-start text-lg transition-all ${
                  activeFeature === "earn"
                    ? "border-[#2C0E61] bg-[#6A30C2] text-[#F0F0F0]"
                    : "border-[#2C0E61] bg-[#132B50] text-[#F0F0F0] hover:bg-[#6A30C2]"
                }`}
              >
                EARN RENT
              </button>
            </div>
          </div>

          {/* Feature Content */}
          <div className="relative">
            {/* Multi-layered border effect */}
            <div className="absolute inset-0 bg-[#4e8eca] translate-x-4 translate-y-4 rounded-lg"></div>
            <div className="absolute inset-0 bg-[#2C4270] translate-x-2 translate-y-2 rounded-lg"></div>

            <div className="relative pixel-border border-4 border-[#2C4270] bg-[#1a1a4a] p-8 rounded-lg shadow-[0_0_10px_rgba(76,28,136,0.5)]">
              {activeFeature === "buy" && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#6A30C2] border border-[#2C0E61]">
                      <BuildingIcon className="h-10 w-10 text-[#F0F0F0]" />
                    </div>
                    <h3 className="font-press-start mb-4 text-2xl text-[#F0F0F0]">BUY PROPERTIES</h3>
                    <p className="font-press-start text-lg text-[#F0F0F0] mb-4">
                      Purchase digital apartments from floor 1 to the penthouse, each with unique features and value.
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-press-start text-[#F0F0F0]">FLOOR 1:</span>
                        <span className="font-press-start text-[#F0F0F0]">500 $TOWER</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-press-start text-[#F0F0F0]">FLOORS 8-15:</span>
                        <span className="font-press-start text-[#F0F0F0]">1500-3000 $TOWER</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-press-start text-[#F0F0F0]">PENTHOUSE:</span>
                        <span className="font-press-start text-[#F0F0F0]">8000 $TOWER</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="p-2 w-full max-w-sm">
                      <Image
                        src="/images/buy.png"
                        alt="Buy Properties"
                        width={400}
                        height={300}
                        className="pixelated w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeFeature === "earn" && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#6A30C2] border border-[#2C0E61]">
                      <CoinsIcon className="h-10 w-10 text-[#F0F0F0]" />
                    </div>
                    <h3 className="font-press-start mb-4 text-2xl text-[#F0F0F0]">EARN RENT</h3>
                    <p className="font-press-start text-lg text-[#F0F0F0] mb-4">
                      Collect 4% of property value every 2-3 minutes as passive income from your owned properties.
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-press-start text-[#F0F0F0]">STUDIO:</span>
                        <span className="font-press-start text-[#F0F0F0]">12 $TOWER/min</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-press-start text-[#F0F0F0]">STANDARD:</span>
                        <span className="font-press-start text-[#F0F0F0]">25 $TOWER/min</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-press-start text-[#F0F0F0]">DELUXE:</span>
                        <span className="font-press-start text-[#F0F0F0]">40 $TOWER/min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="p-2 w-full max-w-sm">
                      <Image
                        src="/images/rent.png"
                        alt="Earn Rent"
                        width={400}
                        height={300}
                        className="pixelated w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeFeature === "flip" && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#6A30C2] border border-[#2C0E61]">
                      <TrendingUpIcon className="h-10 w-10 text-[#F0F0F0]" />
                    </div>
                    <h3 className="font-press-start mb-4 text-2xl text-[#F0F0F0]">FLIP PROPERTIES</h3>
                    <p className="font-press-start text-lg text-[#F0F0F0] mb-4">
                      Hold properties to increase value and sell for profit in the open market.
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-press-start text-[#F0F0F0]">SHORT TERM:</span>
                        <span className="font-press-start text-[#F0F0F0]">Quick Liquidity</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-press-start text-[#F0F0F0]">MEDIUM TERM:</span>
                        <span className="font-press-start text-[#F0F0F0]">Break Even</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-press-start text-[#F0F0F0]">LONG TERM:</span>
                        <span className="font-press-start text-[#F0F0F0]">Maximum Profit</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="p-2 w-full max-w-sm">
                      <Image
                        src="/images/sell.png"
                        alt="Flip Properties"
                        width={400}
                        height={300}
                        className="pixelated w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Token Utility and Roadmap Side by Side */}
        <div id="trench-tower-token" className="mb-16 w-full max-w-6xl">
          <h2 className="font-press-start mb-8 text-center text-3xl font-bold text-[#1a1a2e]">$TOWER TOKEN</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Utility */}
            <div className="relative">
              {/* Multi-layered border effect */}
              <div className="absolute inset-0 bg-[#4e8eca] translate-x-4 translate-y-4 rounded-lg"></div>
              <div className="absolute inset-0 bg-[#2C4270] translate-x-2 translate-y-2 rounded-lg"></div>

              <div className="relative pixel-border border-4 border-[#2C4270] bg-[#1a1a4a] p-6 rounded-lg shadow-[0_0_10px_rgba(76,28,136,0.5)]">
                <h3 className="font-press-start mb-4 text-xl text-center text-[#F0F0F0]">CURRENT UTILITY</h3>

                <div className="space-y-4">
                  <div className="bg-[#132B50] p-4 rounded-lg flex items-start pixel-border border-2 border-[#4e8eca]">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#6A30C2] border border-[#2C0E61]">
                      <ShieldIcon className="h-5 w-5 text-[#F0F0F0]" />
                    </div>
                    <div>
                      <h4 className="font-press-start mb-1 text-md text-[#F0F0F0]">GOVERNANCE</h4>
                      <p className="font-press-start text-xs text-[#F0F0F0]">
                        Vote on building upgrades and community proposals
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#132B50] p-4 rounded-lg flex items-start pixel-border border-2 border-[#4e8eca]">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#6A30C2] border border-[#2C0E61]">
                      <PercentIcon className="h-5 w-5 text-[#F0F0F0]" />
                    </div>
                    <div>
                      <h4 className="font-press-start mb-1 text-md text-[#F0F0F0]">STAKING</h4>
                      <p className="font-press-start text-xs text-[#F0F0F0]">
                        Earn additional yield by staking your $TOWER tokens
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#132B50] p-4 rounded-lg flex items-start pixel-border border-2 border-[#4e8eca]">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#6A30C2] border border-[#2C0E61]">
                      <CoinsIcon className="h-5 w-5 text-[#F0F0F0]" />
                    </div>
                    <div>
                      <h4 className="font-press-start mb-1 text-md text-[#F0F0F0]">RENTAL EARNINGS</h4>
                      <p className="font-press-start text-xs text-[#F0F0F0]">
                        Earn passive income from your owned properties
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#132B50] p-4 rounded-lg flex items-start pixel-border border-2 border-[#4e8eca]">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#6A30C2] border border-[#2C0E61]">
                      <BarChart3Icon className="h-5 w-5 text-[#F0F0F0]" />
                    </div>
                    <div>
                      <h4 className="font-press-start mb-1 text-md text-[#F0F0F0]">TRADING</h4>
                      <p className="font-press-start text-xs text-[#F0F0F0]">
                        Trade $TOWER on decentralized exchanges for other tokens
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#132B50] p-4 rounded-lg flex items-start pixel-border border-2 border-[#4e8eca]">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#6A30C2] border border-[#2C0E61]">
                      <UsersIcon className="h-5 w-5 text-[#F0F0F0]" />
                    </div>
                    <div>
                      <h4 className="font-press-start mb-1 text-md text-[#F0F0F0]">COMMUNITY</h4>
                      <p className="font-press-start text-xs text-[#F0F0F0]">
                        Access exclusive community events and networking
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Future Utility */}
            <div className="relative">
              {/* Multi-layered border effect */}
              <div className="absolute inset-0 bg-[#4e8eca] translate-x-4 translate-y-4 rounded-lg"></div>
              <div className="absolute inset-0 bg-[#2C4270] translate-x-2 translate-y-2 rounded-lg"></div>

              <div className="relative pixel-border border-4 border-[#2C4270] bg-[#1a1a4a] p-6 rounded-lg shadow-[0_0_10px_rgba(76,28,136,0.5)]">
                <h3 className="font-press-start mb-4 text-xl text-center text-[#F0F0F0]">FUTURE UTILITY ROADMAP</h3>

                <div className="space-y-4">
                  <div className="bg-[#132B50] p-4 rounded-lg flex items-start pixel-border border-2 border-[#4e8eca]">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#6A30C2] border border-[#2C0E61]">
                      <GlobeIcon className="h-5 w-5 text-[#F0F0F0]" />
                    </div>
                    <div>
                      <h4 className="font-press-start mb-1 text-md text-[#F0F0F0]">METAVERSE INTEGRATION</h4>
                      <p className="font-press-start text-xs text-[#F0F0F0]">
                        Connect your properties to popular metaverse platforms for virtual access
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#132B50] p-4 rounded-lg flex items-start pixel-border border-2 border-[#4e8eca]">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#6A30C2] border border-[#2C0E61]">
                      <ZapIcon className="h-5 w-5 text-[#F0F0F0]" />
                    </div>
                    <div>
                      <h4 className="font-press-start mb-1 text-md text-[#F0F0F0]">NFT UPGRADES</h4>
                      <p className="font-press-start text-xs text-[#F0F0F0]">
                        Upgrade your properties with NFT furniture, decorations, and amenities
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#132B50] p-4 rounded-lg flex items-start pixel-border border-2 border-[#4e8eca]">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#6A30C2] border border-[#2C0E61]">
                      <StarIcon className="h-5 w-5 text-[#F0F0F0]" />
                    </div>
                    <div>
                      <h4 className="font-press-start mb-1 text-md text-[#F0F0F0]">REWARDS PROGRAM</h4>
                      <p className="font-press-start text-xs text-[#F0F0F0]">
                        Earn special rewards for long-term holding and community participation
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#132B50] p-4 rounded-lg flex items-start pixel-border border-2 border-[#4e8eca]">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#6A30C2] border border-[#2C0E61]">
                      <BuildingIcon className="h-5 w-5 text-[#F0F0F0]" />
                    </div>
                    <div>
                      <h4 className="font-press-start mb-1 text-md text-[#F0F0F0]">MULTI-BUILDING EXPANSION</h4>
                      <p className="font-press-start text-xs text-[#F0F0F0]">
                        Expand to additional buildings with unique themes and property types
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Data Section */}
        <div className="mb-16 w-full max-w-6xl">
          <h2 className="font-press-start mb-8 text-center text-3xl font-bold text-[#1a1a2e]">MARKET TRENDS</h2>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Property Price Chart */}
            <div className="relative">
              {/* Multi-layered border effect */}
              <div className="absolute inset-0 bg-[#4e8eca] translate-x-4 translate-y-4 rounded-lg"></div>
              <div className="absolute inset-0 bg-[#2C4270] translate-x-2 translate-y-2 rounded-lg"></div>

              <div className="relative pixel-border border-4 border-[#2C4270] bg-[#1a1a4a] p-6 rounded-lg shadow-[0_0_10px_rgba(76,28,136,0.5)]">
                <h3 className="font-press-start mb-4 text-xl text-center text-[#F0F0F0]">PROPERTY PRICES</h3>

                {/* Simple animated chart */}
                <div className="h-40 w-full relative">
                  <div className="absolute bottom-0 left-0 w-full h-px bg-[#F0F0F0]/50"></div>
                  <div className="absolute left-0 bottom-0 h-full w-px bg-[#F0F0F0]/50"></div>

                  {/* Chart bars */}
                  <div className="h-full w-full flex items-end justify-between px-2">
                    {priceData.map((value, i) => (
                      <div
                        key={i}
                        className={`w-[7%] transition-all duration-500 ease-in-out ${i === priceIndex ? "bg-[#6A30C2]" : "bg-[#4e8eca]/70"}`}
                        style={{
                          height: `${(value / 130) * 100}%`,
                          opacity: i === priceIndex ? 1 : 0.7,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Current value - removed as requested */}

                  {/* Trend indicator */}
                  <div className="absolute top-2 left-2 font-press-start text-[#F0F0F0] flex items-center">
                    <TrendingUpIcon className="h-4 w-4 mr-1" />
                    +25% MONTHLY
                  </div>
                </div>

                <p className="font-press-start text-sm text-center mt-4 text-[#F0F0F0]">
                  PROPERTY VALUES INCREASING STEADILY IN THE OPEN MARKET
                </p>
              </div>
            </div>

            {/* Rental Price Chart */}
            <div className="relative">
              {/* Multi-layered border effect */}
              <div className="absolute inset-0 bg-[#4e8eca] translate-x-4 translate-y-4 rounded-lg"></div>
              <div className="absolute inset-0 bg-[#2C4270] translate-x-2 translate-y-2 rounded-lg"></div>

              <div className="relative pixel-border border-4 border-[#2C4270] bg-[#1a1a4a] p-6 rounded-lg shadow-[0_0_10px_rgba(76,28,136,0.5)]">
                <h3 className="font-press-start mb-4 text-xl text-center text-[#F0F0F0]">RENTAL MARKET</h3>

                {/* Enhanced animated chart */}
                <div className="h-40 w-full relative">
                  <div className="absolute bottom-0 left-0 w-full h-px bg-[#F0F0F0]/50"></div>
                  <div className="absolute left-0 bottom-0 h-full w-px bg-[#F0F0F0]/50"></div>

                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-cols-6 w-full h-full">
                    {[...Array(5)].map((_, i) => (
                      <div key={`vline-${i}`} className="border-r border-dashed border-[#F0F0F0]/10 h-full"></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 grid grid-rows-4 w-full h-full">
                    {[...Array(3)].map((_, i) => (
                      <div key={`hline-${i}`} className="border-t border-dashed border-[#F0F0F0]/10 w-full"></div>
                    ))}
                  </div>

                  {/* Single trading line with simple up/down color */}
                  <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
                    {/* Main trading line - one simple line */}
                    <line
                      x1="10%"
                      y1={rentalTrend ? "70%" : "30%"}
                      x2="90%"
                      y2={rentalTrend ? "30%" : "70%"}
                      stroke={rentalTrend ? "#22c55e" : "#ef4444"}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Two data points */}
                    <circle
                      cx="10%"
                      cy={rentalTrend ? "70%" : "30%"}
                      r="4"
                      fill={rentalTrend ? "#22c55e" : "#ef4444"}
                      stroke="#132B50"
                      strokeWidth="1"
                    />
                    <circle
                      cx="90%"
                      cy={rentalTrend ? "30%" : "70%"}
                      r="4"
                      fill={rentalTrend ? "#22c55e" : "#ef4444"}
                      stroke="#132B50"
                      strokeWidth="1"
                    />
                  </svg>

                  {/* Animated dot */}
                  <div
                    className="absolute w-4 h-4 rounded-full transition-all duration-1000 ease-in-out"
                    style={{
                      top: rentalTrend ? "30%" : "70%",
                      left: "90%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: rentalTrend ? "#22c55e" : "#ef4444",
                      boxShadow: rentalTrend ? "0 0 10px #22c55e" : "0 0 10px #ef4444",
                    }}
                  ></div>

                  {/* Simplified display */}
                  <div className="absolute top-2 right-2 font-press-start text-[#F0F0F0]">
                    AVG: {rentalTrend ? "10.2" : "8.5"} $TOWER/day
                  </div>

                  {/* Trend indicator */}
                  <div className="absolute top-2 left-2 font-press-start text-[#F0F0F0] flex items-center">
                    <TrendingUpIcon
                      className="h-4 w-4 mr-1"
                      style={{
                        color: rentalTrend ? "#22c55e" : "#ef4444",
                      }}
                    />
                    <span
                      style={{
                        color: rentalTrend ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {rentalTrend ? `+${(Math.random() * 5).toFixed(1)}%` : `-${(Math.random() * 5).toFixed(1)}%`}
                    </span>
                  </div>
                </div>

                <p className="font-press-start text-sm text-center mt-4 text-[#F0F0F0]">
                  RENTAL YIELDS GROWING AS DEMAND INCREASES
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Building Overview - Token Info Layout */}
        <div className="mb-16 w-full max-w-6xl">
          <h2 className="font-press-start mb-8 text-center text-3xl font-bold text-[#1a1a2e]">BUILDING OVERVIEW</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left side - Building visualization */}
            <div className="relative">
              {/* Multi-layered border effect */}
              <div className="absolute inset-0 bg-[#4e8eca] translate-x-4 translate-y-4 rounded-lg"></div>
              <div className="absolute inset-0 bg-[#2C4270] translate-x-2 translate-y-2 rounded-lg"></div>

              <div className="relative pixel-border border-4 border-[#2C4270] bg-[#1a1a4a] p-4 rounded-lg shadow-[0_0_10px_rgba(76,28,136,0.5)]">
                <div
                  className="relative h-full overflow-hidden crt-effect flex items-center justify-center"
                  style={{ minHeight: "400px" }}
                >
                  <Image
                    src="/images/hero.webp"
                    alt="Building Visualization"
                    width={412} /* 3% bigger */
                    height={412} /* 3% bigger */
                    className="object-contain pixelated max-h-[412px]" /* 3% bigger */
                  />

                  {/* Scanning effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6A30C2]/20 to-transparent"
                    style={{
                      height: "10px",
                      animation: "scan 3s linear infinite",
                      backgroundSize: "100% 10px",
                    }}
                  ></div>

                  <style jsx>{`
                    @keyframes scan {
                      0% { transform: translateY(0); }
                      100% { transform: translateY(100%); }
                    }
                  `}</style>
                </div>
              </div>
            </div>

            {/* Right side - Floor Information */}
            <div className="relative">
              {/* Multi-layered border effect */}
              <div className="absolute inset-0 bg-[#4e8eca] translate-x-4 translate-y-4 rounded-lg"></div>
              <div className="absolute inset-0 bg-[#2C4270] translate-x-2 translate-y-2 rounded-lg"></div>

              <div className="relative pixel-border border-4 border-[#2C4270] bg-[#1a1a4a] p-4 rounded-lg shadow-[0_0_10px_rgba(76,28,136,0.5)]">
                <div className="mb-4 p-2 bg-[#6A30C2] text-center pixel-border border-2 border-[#4e8eca]">
                  <p className="font-press-start text-lg text-[#F0F0F0]">BUILDING FLOOR GUIDE</p>
                  <p className="font-press-start text-lg text-[#F0F0F0]">ROOM TYPES AND PRICING</p>
                </div>

                <div className="space-y-2">
                  <div className="bg-[#6A30C2] p-3 flex justify-between items-center pixel-border border-2 border-[#4e8eca]">
                    <p className="font-press-start text-sm text-[#F0F0F0]">PENTHOUSE (FL 25)</p>
                    <p className="font-press-start text-sm text-[#F0F0F0]">5000-8000 $TOWER</p>
                  </div>

                  <div className="bg-[#6A30C2] p-3 flex justify-between items-center pixel-border border-2 border-[#4e8eca]">
                    <p className="font-press-start text-sm text-[#F0F0F0]">LUXURY (FL 20-24)</p>
                    <p className="font-press-start text-sm text-[#F0F0F0]">3000-5000 $TOWER</p>
                  </div>

                  <div className="bg-[#6A30C2] p-3 flex justify-between items-center pixel-border border-2 border-[#4e8eca]">
                    <p className="font-press-start text-sm text-[#F0F0F0]">PREMIUM (FL 16-19)</p>
                    <p className="font-press-start text-sm text-[#F0F0F0]">2000-3000 $TOWER</p>
                  </div>

                  <div className="bg-[#6A30C2] p-3 flex justify-between items-center pixel-border border-2 border-[#4e8eca]">
                    <p className="font-press-start text-sm text-[#F0F0F0]">STANDARD (FL 8-15)</p>
                    <p className="font-press-start text-sm text-[#F0F0F0]">1000-2000 $TOWER</p>
                  </div>

                  <div className="bg-[#6A30C2] p-3 flex justify-between items-center pixel-border border-2 border-[#4e8eca]">
                    <p className="font-press-start text-sm text-[#F0F0F0]">BASIC (FL 1-7)</p>
                    <p className="font-press-start text-sm text-[#F0F0F0]">500-1000 $TOWER</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-16 w-full max-w-4xl relative">
          {/* Multi-layered border effect */}
          <div className="absolute inset-0 bg-[#4e8eca] translate-x-4 translate-y-4 rounded-lg"></div>
          <div className="absolute inset-0 bg-[#2C4270] translate-x-2 translate-y-2 rounded-lg"></div>

          <div className="relative pixel-border border-4 border-[#2C4270] bg-[#1a1a4a] p-8 text-center rounded-lg shadow-[0_0_15px_rgba(76,28,136,0.5)]">
            <h2 className="font-press-start mb-4 text-2xl font-bold text-[#F0F0F0]">START YOUR REAL ESTATE EMPIRE</h2>
            <p className="font-press-start mb-6 text-lg text-[#F0F0F0]">1000 $TOWER TOKENS WAITING FOR NEW PLAYERS</p>
            <Link
              href="/tower"
              className="pixel-button inline-flex items-center border-4 border-[#4e8eca] bg-[#6A30C2] px-8 py-4 font-press-start text-xl text-[#F0F0F0] transition-all hover:bg-[#7A40D2] shadow-[0_4px_0_#4C1C88]"
            >
              EXPLORE BUILDING <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-6xl py-6 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/trench-tower-nav-logo.png"
              alt="TRENCH TOWER"
              width={120}
              height={30}
              className="pixelated opacity-70"
            />
          </div>
          <p className="font-press-start text-sm text-[#1a1a2e]/70">© 2025 SOLANA TRENCH TOWER. ALL RIGHTS RESERVED.</p>
        </footer>
      </div>
    </div>
  )
}
