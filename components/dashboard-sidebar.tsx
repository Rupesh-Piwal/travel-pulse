"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Heart,
  CreditCard,
  Plus,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/history", label: "Trip History", icon: History },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/credits", label: "Credits", icon: CreditCard },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border/50 bg-background/50 backdrop-blur-xl">
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-sans text-xl font-semibold text-foreground tracking-tight cursor-pointer">
            Nomad<span className="text-[#C4632C]">Go</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarMenu className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  render={<Link href={link.href} />}
                  isActive={isActive}
                  className={cn(
                    "flex items-center gap-3 px-4 py-6 rounded-[16px] text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <link.icon className={cn("w-4 h-4", isActive ? "text-primary" : "")} />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <Link href="/dashboard/itinerary/new">
          <Button
            className="w-full bg-gradient-to-r from-[#C4632C] to-[#D47037] hover:opacity-95 text-white rounded-[14px] py-6 flex items-center justify-start gap-3 shadow-sm transition-all border-none"
          >
            <Plus className="w-5 h-5 text-orange-100" />
            <span className="font-medium text-[15px]">Plan New Trip</span>
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
