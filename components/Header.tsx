"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-6 pointer-events-none"
    >
      {/* Left Navigation */}
      <div className="flex items-center gap-8 text-sm font-medium tracking-wide text-sand pointer-events-auto">
        <Link href="#explore" className="hover:text-terracotta transition-colors">Explore</Link>
        <Link href="#pricing" className="hover:text-terracotta transition-colors">Pricing</Link>
        <Link href="#how-it-works" className="hover:text-terracotta transition-colors hidden md:block">How it Works</Link>
      </div>

      {/* Centered Logo Tab */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 bg-sand clip-header-tab flex items-center justify-center pointer-events-auto shadow-lg">
        <Link href="/" className="font-serif italic text-2xl text-navy tracking-tighter mt-[-4px]">
          NomadGo
        </Link>
      </div>

      {/* Right Navigation */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <Link href="/login" className="px-6 py-2 text-sm font-medium text-sand hover:text-white transition-colors">
          Login
        </Link>
        <Link href="#plan" className="px-6 py-2 bg-sand text-navy text-sm font-bold rounded-full hover:bg-white transition-all shadow-md">
          Plan Trip &rarr;
        </Link>
      </div>
    </motion.header>
  );
}
