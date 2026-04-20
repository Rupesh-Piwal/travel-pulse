"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Plus,
  Trash,
  MapPin,
  CircleNotch,
  Airplane,
  Globe,
  MagnifyingGlass,
  X,
  Sparkle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

interface WishlistItem {
  id: string;
  destination: string;
  photoUrl: string;
  sortOrder: number;
  createdAt: string;
}

// Curated destination suggestions with beautiful Unsplash images
const SUGGESTED_DESTINATIONS = [
  { destination: "Santorini, Greece", photoUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&auto=format&fit=crop" },
  { destination: "Kyoto, Japan", photoUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop" },
  { destination: "Amalfi Coast, Italy", photoUrl: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800&auto=format&fit=crop" },
  { destination: "Bali, Indonesia", photoUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop" },
  { destination: "Marrakech, Morocco", photoUrl: "https://images.unsplash.com/photo-1509099836639-18ba4637e067?w=800&auto=format&fit=crop" },
  { destination: "Reykjavik, Iceland", photoUrl: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&auto=format&fit=crop" },
  { destination: "Cape Town, South Africa", photoUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&auto=format&fit=crop" },
  { destination: "Machu Picchu, Peru", photoUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&auto=format&fit=crop" },
  { destination: "Dubai, UAE", photoUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop" },
  { destination: "Maldives", photoUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop" },
  { destination: "Swiss Alps", photoUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop" },
  { destination: "New York City, USA", photoUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop" },
];

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addingDest, setAddingDest] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleAdd = async (destination: string, photoUrl: string) => {
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

  const filteredSuggestions = SUGGESTED_DESTINATIONS.filter(
    (s) =>
      s.destination.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !items.some((i) => i.destination.toLowerCase() === s.destination.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <CircleNotch className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-muted-foreground text-sm font-medium">Loading your dream list...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground">
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
      {items.length === 0 ? (
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
                <Card className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(234,88,12,0.15)] cursor-default">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.photoUrl}
                      alt={item.destination}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                    {/* Floating Heart */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
                      <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                    </div>

                    {/* Destination label on image */}
                    <div className="absolute bottom-4 left-5 right-5">
                      <h3 className="text-xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
                        {item.destination}
                      </h3>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      Saved Destination
                    </div>

                    <div className="flex gap-2">
                      <Link href="/dashboard/itinerary/new">
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-4 h-9 text-xs font-bold gap-1.5 shadow-sm transition-transform active:scale-95"
                        >
                          <Airplane className="w-3 h-3" />
                          Plan Trip
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id, item.destination)}
                        disabled={deletingId === item.id}
                        className="rounded-xl h-9 w-9 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        {deletingId === item.id ? (
                          <CircleNotch className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash className="w-3.5 h-3.5" />
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

                {/* Search Bar */}
                <div className="relative mb-6">
                  <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-2xl bg-accent/30 border border-border/50 text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Scrollable Suggestions Grid */}
              <div className="px-8 pb-8 overflow-y-auto max-h-[55vh]">
                <div className="grid grid-cols-2 gap-4">
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.destination}
                      onClick={() => handleAdd(suggestion.destination, suggestion.photoUrl)}
                      disabled={addingDest === suggestion.destination}
                      className="group relative overflow-hidden rounded-2xl h-36 text-left transition-all duration-300 hover:ring-2 hover:ring-orange-500/50 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-60"
                    >
                      <img
                        src={suggestion.photoUrl}
                        alt={suggestion.destination}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-bold text-sm tracking-tight drop-shadow-lg">
                          {addingDest === suggestion.destination ? (
                            <span className="flex items-center gap-2">
                              <CircleNotch className="w-3.5 h-3.5 animate-spin" />
                              Adding...
                            </span>
                          ) : (
                            suggestion.destination
                          )}
                        </p>
                      </div>
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  ))}
                </div>

                {filteredSuggestions.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Globe className="w-10 h-10 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground text-sm font-medium">
                      {searchQuery ? "No matching destinations found" : "All destinations have been added!"}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
