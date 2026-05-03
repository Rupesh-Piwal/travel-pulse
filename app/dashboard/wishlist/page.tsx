"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash,
  MapPin,
  CircleNotch,
  Airplane,
  Globe,
  X,
  Sparkle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";
import LocationInput from "@/app/components/itinerary/location-input";

interface WishlistItem {
  id: string;
  destination: string;
  photoUrl: string;
  sortOrder: number;
  createdAt: string;
}


const WishlistSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Card key={i} className="group relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/40 backdrop-blur-sm p-0 flex flex-col gap-0">
        <div className="relative h-64 overflow-hidden">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
        <div className="p-6 flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-11 w-32 rounded-2xl" />
            <Skeleton className="h-11 w-11 rounded-2xl" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addingDest, setAddingDest] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAdd = async (location: { name: string; country: string; image?: string }) => {
    const destination = `${location.name}, ${location.country}`;
    const photoUrl = location.image || `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop`; // Beautiful generic travel fallback

    // Check if already in wishlist
    if (items.some((i) => i.destination.toLowerCase() === destination.toLowerCase())) {
      toast.info(`${destination} is already on your wishlist!`);
      return;
    }

    setAddingDest(destination);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, photoUrl }),
      });
      if (!res.ok) throw new Error("Failed to add");
      toast.success(`${destination} added to your wishlist!`);
      fetchItems();
      setShowAddModal(false);
    } catch {
      toast.error("Failed to add destination");
    } finally {
      setAddingDest(null);
    }
  };

  const handleDelete = async (id: string, destination: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success(`${destination} removed from wishlist`);
    } catch {
      toast.error("Failed to remove destination");
    } finally {
      setDeletingId(null);
    }
  };



  return (
    <div className="max-w-5xl space-y-10">
      {/* Page Header */}
      <header className="space-y-1">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-sans text-4xl font-semibold tracking-tight text-foreground">
              Wishlist
            </h1>
            <p className="text-muted-foreground mt-1">
              Pin your dream destinations. Plan them when you&apos;re ready.
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-6 h-12 gap-2 shadow-lg shadow-orange-950/20 font-bold transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Destination
          </Button>
        </motion.div>
      </header>

      {/* Wishlist Grid */}
      {loading ? (
        <WishlistSkeleton />
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-dashed border-2 border-border/50 bg-accent/5 p-16 flex flex-col items-center justify-center text-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-orange-600/10 flex items-center justify-center">
              <Globe className="w-10 h-10 text-orange-500" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-2xl font-bold tracking-tight">Your bucket list awaits</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Start curating your dream destinations. When inspiration strikes, you&apos;ll have a beautiful collection ready to plan from.
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-8 h-12 gap-2 shadow-lg shadow-orange-950/20 font-bold"
            >
              <Plus className="w-4 h-4" />
              Add Your First Destination
            </Button>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 200, damping: 20 }}
              >
                <Card className="group relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/20 backdrop-blur-md hover:border-orange-500/30 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(234,88,12,0.2)] cursor-default p-0 flex flex-col gap-0">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.photoUrl}
                      alt={item.destination}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Destination Info Overlaid on Image */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex flex-col gap-1">

                        <h3 className="text-2xl font-bold text-white tracking-tight leading-tight drop-shadow-2xl">
                          {item.destination}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Clean Footer */}
                  <div className="p-6 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/10">
                        <MapPin className="w-5 h-5 text-orange-500" weight="fill" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</span>
                        <span className="text-xs font-bold text-foreground">Ready to Plan</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href="/dashboard/itinerary/new">
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-6 h-11 text-xs font-bold gap-2 shadow-lg shadow-orange-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <Airplane className="w-4 h-4" weight="bold" />
                          Plan Trip
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id, item.destination)}
                        disabled={deletingId === item.id}
                        className="rounded-2xl h-11 w-11 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                      >
                        {deletingId === item.id ? (
                          <CircleNotch className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash className="w-4 h-4" weight="bold" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add Destination Modal / Overlay */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-card border border-border/80 rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-8 pb-0">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center">
                      <Sparkle className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">Add to Wishlist</h2>
                      <p className="text-xs text-muted-foreground">Discover your next adventure</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="px-8 pb-8 overflow-y-auto max-h-[55vh]">
                <div className="space-y-6">
                  <div className="bg-accent/20 p-1.5 rounded-[2rem] border border-border/50">
                    <LocationInput
                      onSelect={(location) => {
                        handleAdd({
                          name: location.name,
                          country: location.country,
                          image: location.image || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop`
                        });
                      }}
                      dropdownClassName="!static !shadow-none !mt-2 !bg-transparent !border-none !p-0"
                    />
                  </div>

                  {addingDest && (
                    <div className="flex items-center justify-center gap-3 py-10">
                      <CircleNotch className="w-5 h-5 animate-spin text-orange-500" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Adding <span className="text-foreground font-bold">{addingDest}</span> to your collection...
                      </p>
                    </div>
                  )}

                  {!addingDest && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Globe className="w-12 h-12 text-orange-500/20 mb-4" />
                      <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                        Search for any city, country or landmark to pin it to your dream board.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
