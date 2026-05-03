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
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* 1. Cinematic Header */}
      <header className="space-y-4">
        <div className="flex flex-col gap-1">

          <h1 className="text-4xl md:text-5xl font-sans font-light tracking-tight text-foreground leading-[1.1]">
            Welcome{" "}
            <span className="text-terracotta">{userName}</span>
          </h1>
        </div>
      </header>

      {/* 2. Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credits Card */}
        <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm p-8 group transition-all hover:shadow-2xl hover:shadow-orange-500/10">
          <div className="flex flex-col gap-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/10">
              <CreditCard className="w-6 h-6 text-orange-500" weight="fill" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Available Credits</p>
              <p className="text-4xl font-black font-sans">{balance}</p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <CreditCard size={120} weight="fill" />
          </div>
        </Card>

        {/* Wishlist Stats */}
        <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm p-8 group transition-all hover:shadow-2xl hover:shadow-red-500/10">
          <div className="flex flex-col gap-6">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/10">
              <Heart className="w-6 h-6 text-red-500" weight="fill" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Pinned Places</p>
              <p className="text-4xl font-black font-sans">{wishlistCount}</p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Heart size={120} weight="fill" />
          </div>
        </Card>

        {/* Trips Stats */}
        <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm p-8 group transition-all hover:shadow-2xl hover:shadow-blue-500/10">
          <div className="flex flex-col gap-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/10">
              <Airplane className="w-6 h-6 text-blue-500" weight="fill" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Explorations</p>
              <p className="text-4xl font-black font-sans">{itineraryCount}</p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Airplane size={120} weight="fill" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 3. Wishlist Spotlight (Left Column) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Recent Pins</h2>
            <Link href="/dashboard/wishlist" className="text-xs font-bold text-orange-500 uppercase tracking-widest hover:underline">View All</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recentWishlist.length > 0 ? (
              recentWishlist.map((item, i) => (
                <Link
                  href="/dashboard/wishlist"
                  key={item.id}
                  className={cn(
                    "group relative h-72 rounded-[2rem] overflow-hidden border border-border/50 transition-all hover:shadow-2xl",
                    i === 0 && "sm:col-span-2 h-80"
                  )}
                >
                  <img src={item.photoUrl} alt={item.destination} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-white font-bold text-xl tracking-tight leading-tight">{item.destination}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" weight="fill" />
                      <span className="text-[10px] uppercase font-black tracking-widest text-white/60">Pinned Place</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full h-72 rounded-[2rem] border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-4 bg-accent/5">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-orange-500" weight="light" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Your dream board is empty.</p>
                <Link href="/explore">
                  <Button variant="outline" className="rounded-full px-6 text-xs font-bold uppercase tracking-widest">Explore Places</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 4. Recent Activity (Right Column) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Recent Adventures</h2>
            <Link href="/dashboard/history" className="text-xs font-bold text-orange-500 uppercase tracking-widest hover:underline">Trip History</Link>
          </div>

          <div className="space-y-4">
            {recentItineraries.length > 0 ? (
              recentItineraries.map((trip) => (
                <Link
                  href={`/dashboard/itinerary/${trip.id}`}
                  key={trip.id}
                  className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-card/30 border border-border/50 hover:bg-card/50 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shrink-0 border border-border/50 overflow-hidden">
                    <Compass className="w-7 h-7 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{trip.destination}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-black mt-0.5">{trip.days} Days • {trip.vibe}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all mr-2" />
                </Link>
              ))
            ) : (
              <div className="p-10 rounded-[2rem] border border-border/50 bg-card/20 text-center space-y-4">
                <Airplane className="w-10 h-10 text-muted-foreground mx-auto" weight="light" />
                <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">No trips planned yet. Ready for your next escape?</p>
              </div>
            )}

            {/* Immersive CTA Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-orange-600 p-8 text-white shadow-2xl shadow-orange-600/20 mt-8">
              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight leading-tight">Your next story <br />starts here.</h3>
                  <p className="text-white/70 text-sm leading-relaxed">Design a tailor-made journey powered by AI.</p>
                </div>
                <Link href="/dashboard/itinerary/new">
                  <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 rounded-2xl h-12 font-bold gap-2">
                    <Plus className="w-4 h-4" weight="bold" />
                    Plan New Trip
                  </Button>
                </Link>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-20 rotate-12">
                <Airplane size={240} weight="fill" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
