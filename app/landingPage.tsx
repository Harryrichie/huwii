"use client"

import Link from "next/link"
import { Menu, X, Instagram } from "lucide-react"
import { useState, useEffect } from "react"
import { Logo } from "./ui/logo"
import { useAuth } from "@clerk/nextjs"
import DisplaySection from "./ui/display"
import HeroSection from "./ui/hero-section"
import Features from "./ui/features"
import Testimonial from "./ui/testimonial"


export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isSignedIn } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  return (
    <div className="flex min-h-screen flex-col">
      <header className={`sticky top-0 z-50 mx-auto w-[95%] max-w-6xl rounded-full border px-4 lg:px-6 h-14 flex items-center transition-all duration-300 ${isScrolled ? "top-4 border-gray-200 bg-white/80 backdrop-blur-md shadow-sm" : "border-transparent bg-transparent"}`}>
        <Link className="flex items-center justify-center" href="#">
          <Logo className="h-8 w-auto text-gray-900" />
        </Link>
        <nav className="mx-auto flex gap-4 sm:gap-6 hidden md:flex">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
            Testimonials
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
        </nav>
        <Link className="text-sm font-medium bg-black hover:bg-gray-800 p-2 rounded-md text-white hidden md:block" href="/dashboard/user">
          {isSignedIn ? "Dashboard" : "Sign in"}
        </Link>
        <button className="md:hidden ml-auto" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-4 flex flex-col gap-4 md:hidden">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features" onClick={() => setIsMobileMenuOpen(false)}>
              Features
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials" onClick={() => setIsMobileMenuOpen(false)}>
              Testimonials
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>
              Pricing
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard/user" onClick={() => setIsMobileMenuOpen(false)}>
              {isSignedIn ? "Dashboard" : "Sign in"}
            </Link>
          </div>
        )}
      </header>
      <main className="flex-1 overflow-hidden">

        <HeroSection/>
        <DisplaySection />
        <Features />
        <Testimonial/>
        
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} HUWII - AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="#" className="text-gray-500 hover:text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
            </svg>
          </Link>
          <Link href="#" className="text-gray-500 hover:text-gray-900">
            <Instagram className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-gray-500 hover:text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </Link>
        </nav>
      </footer>
    </div>
  )
}