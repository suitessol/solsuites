"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, BookOpen, Twitter } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="pixel-border sticky top-0 z-50 border-b-4 border-[#2C0E61] bg-[#132B50] backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo3.png" alt="SUITES" width={180} height={40} className="pixelated h-10 w-auto" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                href="/#what-is-suites"
                className="font-press-start px-3 py-2 text-[#F0F0F0] hover:text-[#6A30C2] transition-colors"
              >
                About
              </Link>
              <Link
                href="/#suites-token"
                className="font-press-start px-3 py-2 text-[#F0F0F0] hover:text-[#6A30C2] transition-colors"
              >
                $SUITES
              </Link>
              <Link
                href="/suites"
                className="font-press-start px-3 py-2 text-[#F0F0F0] hover:text-[#6A30C2] transition-colors"
              >
                Building
              </Link>
              <Link
                href="https://suites.gitbook.io/suites"
                target="_blank"
                rel="noopener noreferrer"
                className="font-press-start px-3 py-2 text-[#F0F0F0] hover:text-[#6A30C2] transition-colors flex items-center"
              >
                Gitbook <BookOpen className="ml-1 h-4 w-4" />
              </Link>
              <Link
                href="https://x.com/suitessol"
                target="_blank"
                rel="noopener noreferrer"
                className="font-press-start px-3 py-2 text-[#F0F0F0] hover:text-[#6A30C2] transition-colors flex items-center"
              >
                Follow <Twitter className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-[#F0F0F0] hover:text-[#6A30C2] focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/#what-is-suites"
              className="font-press-start block px-3 py-2 text-[#F0F0F0] hover:text-[#6A30C2]"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/#suites-token"
              className="font-press-start block px-3 py-2 text-[#F0F0F0] hover:text-[#6A30C2]"
              onClick={() => setIsMenuOpen(false)}
            >
              $SUITES
            </Link>
            <Link
              href="/suites"
              className="font-press-start block px-3 py-2 text-[#F0F0F0] hover:text-[#6A30C2]"
              onClick={() => setIsMenuOpen(false)}
            >
              Building
            </Link>
            <Link
              href="https://suites.gitbook.io/suites"
              target="_blank"
              rel="noopener noreferrer"
              className="font-press-start block px-3 py-2 text-[#F0F0F0] hover:text-[#6A30C2] flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Gitbook <BookOpen className="ml-1 h-4 w-4" />
            </Link>
            <Link
              href="https://x.com/suitessol"
              target="_blank"
              rel="noopener noreferrer"
              className="font-press-start block px-3 py-2 text-[#F0F0F0] hover:text-[#6A30C2] flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Follow <Twitter className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
