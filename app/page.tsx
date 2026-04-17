import Link from "next/link";
import { Compass, ArrowRight, Mouse } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans selection:bg-[#E2763B]/30">
      {/* ──── Background Image ──── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/hero-image.png"
          alt="Tropical Resort"
          className="w-full h-full object-cover scale-105 animate-slow-pan"
        />
        {/* Overlay - Dark gradient to make text pop like the screenshot */}
        <div className="absolute inset-0 bg-[#0A192F]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-[#0A192F]/60" />
      </div>

      {/* ──── Navbar ──── */}
      <header className="relative z-10 w-full px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="w-8 h-8 rounded-full bg-[#E2763B] flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-serif font-bold text-xl tracking-wide">TravelPulse</span>
        </div>

        <nav className="flex items-center gap-8">
          <Link href="#" className="hidden md:block text-white/80 hover:text-white text-sm transition-colors">
            Explore
          </Link>
          <Link href="#" className="hidden md:block text-white/80 hover:text-white text-sm transition-colors">
            Wishlist
          </Link>
          <Link href="/dashboard" className="text-white/80 hover:text-white text-sm transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard/itinerary/new" className="px-6 py-2.5 bg-[#E2763B] hover:bg-[#C9622D] text-white text-sm font-semibold rounded-full transition-all">
            Plan a Trip
          </Link>
        </nav>
      </header>

      {/* ──── Hero Content ──── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 mt-[-60px]">

        {/* Top Eyebrow */}
        <div className="flex items-center gap-4 mb-8 w-full max-w-lg mx-auto opacity-80">
          <div className="h-[1px] flex-1 bg-white/40" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white">
            AI-Powered Travel Planning
          </span>
          <div className="h-[1px] flex-1 bg-white/40" />
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] leading-[0.9] font-serif text-white tracking-tight drop-shadow-2xl">
          Plan your dream
        </h1>

        {/* Accent Subtitle */}
        <h2 className="text-6xl md:text-8xl lg:text-[7.5rem] leading-[0.9] font-serif italic text-[#E2763B] tracking-tight drop-shadow-2xl mt-2 mb-8">
          trip in minutes
        </h2>

        {/* Description */}
        <p className="text-[15px] md:text-lg text-white/90 max-w-xl mx-auto leading-relaxed mb-12 drop-shadow-md">
          Beautiful, photo-rich itineraries crafted by AI. Just tell us where you want to go.
        </p>

        {/* Search Bar container */}
        <div className="w-full max-w-[550px] mx-auto p-1.5 bg-[#00171F]/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center shadow-2xl">
          <input
            type="text"
            placeholder="Where do you want to go?"
            className="flex-1 bg-transparent text-white placeholder-white/50 px-6 py-3 outline-none text-[15px] min-w-0"
          />
          <Link
            href="/dashboard/itinerary/new"
            className="px-6 py-3.5 bg-[#E2763B] hover:bg-[#C9622D] text-white text-[13px] font-bold rounded-full transition-all flex items-center gap-2 group shrink-0"
          >
            Plan Trip
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </main>

      {/* ──── Bottom Scroll Icon ──── */}
      <div className="relative z-10 w-full pb-8 flex justify-center opacity-60">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce mt-1" />
        </div>
      </div>

    </div>
  );
}
