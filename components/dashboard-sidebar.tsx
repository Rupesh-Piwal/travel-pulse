"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Heart,
  CreditCard,
  Wallet,
  Plus,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/credits", label: "Credits", icon: CreditCard },
  { href: "/dashboard/billing", label: "Billing", icon: Wallet },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border/50 bg-background/50 backdrop-blur-xl flex flex-col z-40">
      {/* <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Compass className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-semibold text-foreground tracking-tight">
            TravelPulse
          </span>
        </Link>
      </div> */}

      <nav className="flex-1 px-4 py-26 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <link.icon className={cn("w-4 h-4", isActive ? "text-primary" : "")} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <Link href="/dashboard/itinerary/new">
          <Button
            className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-6 flex items-center justify-start gap-3 shadow-lg shadow-orange-950/20"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Plan New Trip</span>
          </Button>
        </Link>
      </div>
    </aside>
  );
}
