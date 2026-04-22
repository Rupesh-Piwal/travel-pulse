"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 md:px-14 py-4 md:py-6 transition-all duration-500",
        scrolled 
          ? "bg-black/30 backdrop-blur-xl border-b border-white/10 py-3 md:py-4 shadow-xl" 
          : "bg-transparent"
      )}
    >
      {/* Left nav */}
      <nav className="flex items-center gap-4 md:gap-8">
        {["Explore", "Pricing", "How it Works"].map((label) => (
          <Link
            key={label}
            href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
            className="group relative text-sm text-white/80 font-medium tracking-wide transition-colors duration-300 hover:text-white"
          >
            {label}
            <span className="absolute left-1/2 -bottom-1 h-[1.5px] w-0 -translate-x-1/2 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}
      </nav>

      {/* Center logo */}
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 font-serif italic text-[24px] md:text-[32px] text-white tracking-tight drop-shadow-lg"
      >
        Nomad<span className="text-[#C5632D]">Go</span>
      </Link>

      {/* Right buttons */}
      <div className="flex items-center gap-3 md:gap-5">
        <Link
          href="/signin"
          className="px-5 py-2.5 rounded-full border border-white/20 text-[13px] text-white/85 font-medium backdrop-blur-md hover:bg-white/10 hover:border-white/35 transition-all"
        >
          LogIn
        </Link>
        <Link
          href="/dashboard/itinerary/new"
          className="group hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-full
bg-[#C5632D] text-[13px] text-white font-bold tracking-wide
transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
hover:bg-[#b55524] active:scale-[0.98] shadow-lg shadow-orange-950/20"
        >
          <span>Plan Trip</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.header>
  );
}
