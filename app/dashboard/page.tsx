import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  CreditCard,
  Heart,
  MapPin,
  Airplane,
  Plus,
  ArrowRight,
  Globe,
  Compass
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch everything we need for the overview
  const [credit, wishlistCount, itineraryCount, recentWishlist, recentItineraries] = await Promise.all([
    prisma.credit.findUnique({ where: { userId: session.user.id } }),
    prisma.wishlistItem.count({ where: { userId: session.user.id } }),
    prisma.itinerary.count({ where: { userId: session.user.id } }),
    prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.itinerary.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 2,
    }),
  ]);

  const balance = credit?.balance ?? 5;
  const userName = session.user.name?.split(" ")[0] || "Traveler";

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-[1000px] mx-auto px-4 lg:px-0 overflow-hidden">
      
      {/* Static Top Section */}
      <div className="flex-none pt-2 mb-8">
        <header className="text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 tracking-tight leading-tight">
            Welcome, <span className="text-[#C4632C]">{userName}</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5 font-medium">
            Your travel workstation. Plan, organize, and track your journeys.
          </p>
        </header>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 space-y-8">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Credits Card */}
          <Card className="border border-zinc-200/60 bg-white/60 backdrop-blur-xl p-5 rounded-[20px] shadow-sm flex flex-col justify-between group hover:border-[#C4632C]/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-[#C4632C]/10 border border-[#C4632C]/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#C4632C]" weight="fill" />
              </div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-[#C4632C] transition-colors">
                Credits
              </p>
            </div>
            <div>
              <p className="text-4xl font-serif text-zinc-900 tracking-tight">{balance}</p>
            </div>
          </Card>

          {/* Wishlist Stats */}
          <Card className="border border-zinc-200/60 bg-white/60 backdrop-blur-xl p-5 rounded-[20px] shadow-sm flex flex-col justify-between group hover:border-rose-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-rose-50 border border-rose-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-500" weight="fill" />
              </div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-rose-500 transition-colors">
                Pinned
              </p>
            </div>
            <div>
              <p className="text-4xl font-serif text-zinc-900 tracking-tight">{wishlistCount}</p>
            </div>
          </Card>

          {/* Trips Stats */}
          <Card className="border border-zinc-200/60 bg-white/60 backdrop-blur-xl p-5 rounded-[20px] shadow-sm flex flex-col justify-between group hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Airplane className="w-5 h-5 text-blue-500" weight="fill" />
              </div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                Trips
              </p>
            </div>
            <div>
              <p className="text-4xl font-serif text-zinc-900 tracking-tight">{itineraryCount}</p>
            </div>
          </Card>

          {/* Immersive CTA Card */}
          <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#C4632C] to-[#D47037] p-5 text-white shadow-[0_8px_30px_rgb(196,99,44,0.2)]">
            <div className="relative z-10 h-full flex flex-col justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-serif tracking-tight leading-tight">Your next story <br />starts here.</h3>
                <p className="text-orange-100 text-[11px] font-medium leading-relaxed">Tailor-made journeys by AI.</p>
              </div>
              <Link href="/dashboard/itinerary/new" className="cursor-pointer">
                <Button className="w-full bg-white text-[#C4632C] hover:bg-zinc-50 rounded-[12px] h-10 font-bold text-xs uppercase tracking-widest gap-2 shadow-sm transition-all active:scale-95">
                  <Plus className="w-3.5 h-3.5" weight="bold" />
                  Plan Trip
                </Button>
              </Link>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-[0.15] rotate-12 pointer-events-none">
              <Airplane size={140} weight="fill" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Wishlist Spotlight (Left Column) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">Recent Pins</h2>
              <Link href="/dashboard/wishlist" className="text-[10px] font-bold text-[#C4632C] uppercase tracking-widest hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {recentWishlist.length > 0 ? (
                recentWishlist.slice(0, 2).map((item) => (
                  <Link
                    href="/dashboard/wishlist"
                    key={item.id}
                    className="group relative rounded-[20px] aspect-video overflow-hidden border border-zinc-200/60 shadow-sm transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-[#C4632C]/30 bg-zinc-100"
                  >
                    <img 
                      src={item.photoUrl} 
                      alt={item.destination} 
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold text-lg tracking-tight leading-tight truncate drop-shadow-md">
                        {item.destination}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3 h-3 text-orange-200" weight="fill" />
                        <span className="text-[9px] uppercase font-bold tracking-widest text-orange-100">Pinned</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full h-40 rounded-[20px] border-2 border-dashed border-zinc-200 bg-white/40 flex flex-col items-center justify-center gap-3">
                  <Globe className="w-8 h-8 text-zinc-300" weight="fill" />
                  <p className="text-xs font-medium text-zinc-500">Your dream board is empty.</p>
                  <Link href="/dashboard/wishlist">
                    <Button variant="outline" className="rounded-[12px] px-4 h-8 text-[10px] font-bold uppercase tracking-widest text-zinc-600 border-zinc-200">
                      Explore
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity (Right Column) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">Recent Activity</h2>
              <Link href="/dashboard/history" className="text-[10px] font-bold text-[#C4632C] uppercase tracking-widest hover:underline">
                Trip History
              </Link>
            </div>

            <div className="bg-white/80 backdrop-blur-2xl border border-zinc-200/60 rounded-[20px] overflow-hidden shadow-sm">
              <div className="divide-y divide-zinc-100">
                {recentItineraries.length > 0 ? (
                  recentItineraries.map((trip) => (
                    <Link
                      href={`/dashboard/itinerary/${trip.id}`}
                      key={trip.id}
                      className="flex items-center gap-4 p-4 hover:bg-zinc-50/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-[12px] bg-zinc-50 flex items-center justify-center shrink-0 border border-black/5">
                        <Compass className="w-5 h-5 text-zinc-400 group-hover:text-[#C4632C] transition-colors" weight="fill" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-zinc-900 tracking-tight truncate">
                          {trip.destination}
                        </p>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mt-0.5 truncate">
                          {trip.days} Days • {trip.vibe}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 group-hover:text-[#C4632C] transition-all" weight="bold" />
                    </Link>
                  ))
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center gap-3 text-center p-6 bg-white/40">
                    <Airplane className="w-8 h-8 text-zinc-300" weight="fill" />
                    <p className="text-xs font-medium text-zinc-500">No trips planned yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
