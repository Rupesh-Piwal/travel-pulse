"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Compass, Heart, Zap, LogOut, User as UserIcon, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleLogout } from "@/app/actions/auth";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

interface UserProp {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const Navbar = ({ user }: { user?: UserProp }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = pathname === "/";

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
    { to: "/dashboard", label: "Dashboard", icon: Zap },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "glass border-b border-border/50 shadow-lg shadow-black/10"
          : isLanding
            ? "bg-transparent"
            : "glass"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Compass className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground tracking-tight">
              TravelPulse
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className={`text-sm font-medium transition-colors duration-300 ${pathname.startsWith(link.to)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard/itinerary/new"
              className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              Plan a Trip
            </Link>

            {mounted && user ? (
              <div className="flex items-center gap-4">
                <AnimatedThemeToggler />
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none cursor-pointer">
                    <Avatar className="w-9 h-9 border-2 border-primary/20 pointer-events-none">
                      <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.name?.charAt(0) ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl glass border-border/50 shadow-2xl mt-2">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="p-3">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem className="p-0 overflow-hidden">
                      <Link href="/dashboard" className="flex items-center gap-3 w-full p-3 hover:bg-primary/10 transition-colors">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-sm">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0 overflow-hidden">
                      <Link href="/dashboard/wishlist" className="flex items-center gap-3 w-full p-3 hover:bg-primary/10 transition-colors">
                        <Heart className="w-4 h-4 text-primary" />
                        <span className="text-sm">Wishlist</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/10 transition-colors">
                      <Settings className="w-4 h-4 text-primary" />
                      <span className="text-sm">Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                      onClick={() => handleLogout()}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-destructive hover:bg-destructive/10 transition-colors focus:bg-destructive/10 focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : mounted && !user ? (
              <div className="flex items-center gap-4">
                <AnimatedThemeToggler />
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="w-20" /> // Spacer to prevent layout shift during mount
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-8 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-lg font-medium text-foreground"
                >
                  <link.icon className="w-5 h-5 text-primary" />
                  {link.label}
                </Link>
              ))}
              <Link
                href="/dashboard/itinerary/new"
                onClick={() => setMobileOpen(false)}
                className="mt-4 px-6 py-3 bg-primary text-primary-foreground text-center rounded-full font-medium"
              >
                Plan a Trip
              </Link>

              {mounted && user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 px-6 py-4 text-lg font-medium text-destructive active:bg-destructive/10 transition-colors rounded-2xl"
                >
                  <LogOut className="w-5 h-5" />
                  Log out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 px-6 py-3 border border-border text-center rounded-full font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
