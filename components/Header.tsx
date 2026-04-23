"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Explore", href: "#explore" },
    { label: "Pricing", href: "#pricing" },
    { label: "How it Works", href: "#how-it-works" },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-14 py-4 md:py-6 transition-all duration-500",
        (scrolled || isOpen)
          ? "bg-black/30 backdrop-blur-xl border-b border-white/10 py-3 md:py-4 shadow-xl"
          : "bg-transparent"
      )}
    >
      {/* 📱 Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[110] p-2 md:hidden text-white/90 hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* 💻 Desktop nav */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="group relative text-sm text-white/80 font-medium tracking-wide transition-colors duration-300 hover:text-white"
          >
            {link.label}
            <span className="absolute left-1/2 -bottom-1 h-[1.5px] w-0 -translate-x-1/2 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}
      </nav>

      {/* Logo (Center) */}
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
          className="hidden sm:block px-5 py-2.5 rounded-full border border-white/20 text-[13px] text-white/85 font-medium backdrop-blur-md hover:bg-white/10 hover:border-white/35 transition-all"
        >
          LogIn
        </Link>
        <Link
          href="/dashboard/itinerary/new"
          className="group hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-full
            bg-[#C5632D] text-[13px] text-white font-bold tracking-wide
            transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
            hover:bg-[#b55524] active:scale-[0.98] shadow-lg shadow-orange-950/20"
        >
          <span>Plan Trip</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 📱 Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-black/90 backdrop-blur-3xl z-[105] flex flex-col items-center justify-center px-8"
          >
            <div className="flex flex-col items-center gap-8 w-full max-w-xs">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="w-full text-center"
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl text-white/90 font-serif italic tracking-wide hover:text-[#C5632D] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full flex flex-col gap-4 mt-8"
              >
                <Link
                  href="/signin"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-center rounded-2xl border border-white/10 text-white/80 font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/dashboard/itinerary/new"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-center rounded-2xl bg-[#C5632D] text-white font-bold flex items-center justify-center gap-2"
                >
                  <span>Plan My Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
