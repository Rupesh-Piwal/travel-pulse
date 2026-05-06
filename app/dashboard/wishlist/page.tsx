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
      <Card key={i} className="group relative overflow-hidden rounded-[20px] border border-zinc-200/60 bg-white/60 backdrop-blur-xl p-0 flex flex-col gap-0 shadow-sm">
        <div className="relative h-56 overflow-hidden">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
        <div className="p-5 flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28 rounded-[12px]" />
            <Skeleton className="h-10 w-10 rounded-[12px]" />
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
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-[1000px] mx-auto px-4 lg:px-0 overflow-hidden">
      {/* Static Top Section */}
      <div className="flex-none pt-2 mb-6 lg:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <header className="text-left">
            <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 tracking-tight leading-tight">
              Wishlist
            </h1>
            <p className="text-zinc-500 text-sm mt-1.5 font-medium">
              Pin your dream destinations. Plan them when you're ready.
            </p>
          </header>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[#C4632C] to-[#D47037] hover:opacity-95 text-white rounded-[14px] px-6 h-11 font-bold text-xs uppercase tracking-widest shadow-sm transition-transform active:scale-95"
          >
            <Plus weight="bold" className="w-3.5 h-3.5 mr-2 text-orange-100" />
            Add Destination
          </Button>
        </motion.div>
      </div>

      {/* Scrollable Wishlist Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {loading ? (
          <WishlistSkeleton />
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-2xl border-2 border-dashed border-zinc-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center h-[50vh] min-h-[400px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-zinc-300" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-xl font-serif text-zinc-900">Your bucket list awaits</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Start curating your dream destinations. When inspiration strikes, you'll have a beautiful collection ready to plan from.
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="mt-6 bg-gradient-to-r from-[#C4632C] to-[#D47037] text-white rounded-[14px] px-6 h-11 font-bold text-xs uppercase tracking-widest shadow-sm"
            >
              <Plus weight="bold" className="w-3.5 h-3.5 mr-2" />
              Pin First Destination
            </Button>
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
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ delay: idx * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                >
                  <Card className="group relative overflow-hidden rounded-[20px] border border-zinc-200/60 bg-white/80 backdrop-blur-2xl hover:border-[#C4632C]/30 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-default p-0 flex flex-col gap-0 shadow-sm">
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden bg-zinc-100">
                      <img
                        src={item.photoUrl}
                        alt={item.destination}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      {/* Destination Info Overlaid on Image */}
                      <div className="absolute bottom-5 left-5 right-5">
                        <h3 className="text-xl font-bold text-white tracking-tight leading-tight drop-shadow-md">
                          {item.destination}
                        </h3>
                      </div>
                    </div>

                    {/* Clean Footer */}
                    <div className="p-5 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[12px] bg-zinc-50 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-zinc-400" weight="fill" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Status</span>
                          <span className="text-xs font-bold text-zinc-900 tracking-tight">Ready to Plan</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/itinerary/new?dest=${encodeURIComponent(item.destination)}`}>
                          <Button
                            size="sm"
                            className="bg-zinc-900 hover:bg-black text-white rounded-[12px] px-4 h-10 text-[11px] font-bold uppercase tracking-widest gap-1.5 shadow-sm transition-all"
                          >
                            <Airplane className="w-3.5 h-3.5" weight="fill" />
                            Plan
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id, item.destination)}
                          disabled={deletingId === item.id}
                          className="rounded-[12px] h-10 w-10 p-0 text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          {deletingId === item.id ? (
                            <CircleNotch className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash className="w-4 h-4" weight="fill" />
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
      </div>

      {/* Add Destination Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white/95 backdrop-blur-2xl border border-zinc-200 rounded-[24px] w-full max-w-xl max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-[#C4632C]/10 flex items-center justify-center">
                      <Sparkle className="w-5 h-5 text-[#C4632C]" weight="fill" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Add to Wishlist</h2>
                      <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mt-0.5">Discover your next adventure</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-full h-8 w-8 p-0 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                  >
                    <X className="w-4 h-4" weight="bold" />
                  </Button>
                </div>
              </div>

              <div className="px-6 pb-6 overflow-y-auto max-h-[55vh] no-scrollbar">
                <div className="space-y-6">
                  <div className="bg-zinc-50/50 p-1.5 rounded-[16px] border border-zinc-200/80">
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
                    <div className="flex items-center justify-center gap-3 py-8">
                      <CircleNotch className="w-5 h-5 animate-spin text-[#C4632C]" weight="bold" />
                      <p className="text-sm font-medium text-zinc-500">
                        Adding <span className="text-zinc-900 font-bold">{addingDest}</span> to your collection...
                      </p>
                    </div>
                  )}

                  {!addingDest && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Globe className="w-12 h-12 text-zinc-200 mb-3" weight="fill" />
                      <p className="text-zinc-500 text-sm max-w-xs font-medium">
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
