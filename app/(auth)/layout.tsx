import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#0A0A0A]">
      {/* Background Image Layer */}
      <div className="absolute inset-0 lg:w-1/2">
        <Image
          src="/mount-fuji.jpg"
          alt="Mount Fuji"
          fill
          className="object-cover"
          priority
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/50 lg:bg-black/20" />
        {/* Desktop side-fade to match the dark right panel */}
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-transparent via-transparent to-[#0A0A0A]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex w-full flex-col lg:flex-row">
        {/* Left Panel (Branding & Quote - Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16">
          <Link
            href="/"
            className="font-serif italic text-4xl tracking-tight text-white hover:opacity-80 transition-opacity"
          >
            Nomad<span className="text-[#C5632D]">Go</span>
          </Link>

          <div className="max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <p className="font-serif text-2xl italic leading-relaxed text-white/90">
              &ldquo;NomadGo planned our entire 10-day trip to Japan in
              minutes. Every restaurant, every hidden temple — it was like
              travelling with a local.&rdquo;
            </p>
          </div>
        </div>

        {/* Right Panel (Auth Forms) */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:bg-[#0A0A0A]">
          {/* Mobile Logo */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 lg:hidden">
            <Link
              href="/"
              className="font-serif italic text-4xl tracking-tight text-white"
            >
              Nomad<span className="text-[#C5632D]">Go</span>
            </Link>
          </div>

          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

