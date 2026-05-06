"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import {
  CreditCard,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  TrendUp,
  FileText,
  Gift,
  ShoppingCart,
  ClockCounterClockwise,
  Lightning,
  CircleNotch,
  Plus,
} from "@phosphor-icons/react";

import { Card } from "@/components/ui/card";
import { useCredits } from "@/hooks/useCredits";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  reason: string;
  referenceId: string | null;
  createdAt: string;
}

const REASON_CONFIG: Record<
  string,
  { label: string; icon: any; color: string; bgColor: string }
> = {
  SIGNUP: {
    label: "Welcome Bonus",
    icon: Gift,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  PURCHASE: {
    label: "Credit Purchase",
    icon: ShoppingCart,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  GENERATION: {
    label: "Itinerary Generated",
    icon: Lightning,
    color: "text-[#C4632C]",
    bgColor: "bg-[#C4632C]/10",
  },
  EXPORT: {
    label: "PDF Export",
    icon: FileText,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  REFUND: {
    label: "Refund",
    icon: ClockCounterClockwise,
    color: "text-zinc-500",
    bgColor: "bg-zinc-100",
  },
};

const QUICK_BUY_TIERS = [
  { key: "voyager", label: "30 Credits", price: "$5" },
  { key: "pathfinder", label: "100 Credits", price: "$20" },
  { key: "globalist", label: "300 Credits", price: "$49" },
];

export default function CreditsPage() {
  const { credits, fetchCredits } = useCredits();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingTier, setBuyingTier] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Handle success/cancelled redirects from Stripe
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Payment successful!", {
        description: "Your credits have been added to your account.",
      });
      fetchCredits();
      window.history.replaceState({}, "", "/dashboard/credits");
    }
    if (searchParams.get("cancelled") === "true") {
      toast.info("Payment cancelled", {
        description: "No credits were purchased.",
      });
      window.history.replaceState({}, "", "/dashboard/credits");
    }
  }, [searchParams, fetchCredits]);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch("/api/user/transactions");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTransactions(data);
    } catch {
      console.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleQuickBuy = async (tierKey: string) => {
    setBuyingTier(tierKey);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setBuyingTier(null);
    }
  };

  const totalEarned = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-[1000px] mx-auto px-4 lg:px-0 overflow-hidden">
      
      {/* Static Top Section */}
      <div className="flex-none pt-2 mb-8">
        <header className="text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 tracking-tight leading-tight">
            Credits
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5 font-medium">
            Manage your balance and view transaction history.
          </p>
        </header>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 space-y-8">
        
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {/* Balance Card */}
          <Card className="relative overflow-hidden border-zinc-200/60 bg-gradient-to-br from-[#C4632C] to-[#D47037] p-6 text-white col-span-1 sm:col-span-1 rounded-[20px] shadow-[0_8px_30px_rgb(196,99,44,0.2)]">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-[10px] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <Coins className="w-4 h-4 text-white" weight="fill" />
                </div>
                <p className="text-[10px] font-bold text-orange-100 uppercase tracking-widest">
                  Balance
                </p>
              </div>
              <div>
                <h2 className="text-5xl font-serif tracking-tight">
                  {credits ?? "..."}
                </h2>
                <p className="text-[11px] text-orange-100 mt-1 font-semibold uppercase tracking-widest">
                  Available Credits
                </p>
              </div>
            </div>
          </Card>

          {/* Earned Card */}
          <Card className="border border-zinc-200/60 bg-white/60 backdrop-blur-xl p-6 rounded-[20px] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-[10px] bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4 text-emerald-500" weight="bold" />
              </div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Earned
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-serif tracking-tight text-zinc-900">
                +{totalEarned}
              </h2>
              <p className="text-[11px] text-zinc-400 mt-1 font-semibold uppercase tracking-widest">
                All Time Acquired
              </p>
            </div>
          </Card>

          {/* Spent Card */}
          <Card className="border border-zinc-200/60 bg-white/60 backdrop-blur-xl p-6 rounded-[20px] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-[10px] bg-rose-50 border border-rose-100 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-rose-500" weight="bold" />
              </div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Used
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-serif tracking-tight text-zinc-900">
                -{totalSpent}
              </h2>
              <p className="text-[11px] text-zinc-400 mt-1 font-semibold uppercase tracking-widest">
                All Time Spent
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Buy More Credits */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 px-1">
            <Plus className="w-4 h-4 text-zinc-400" weight="bold" />
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Buy More Credits</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {QUICK_BUY_TIERS.map((tier) => {
              const isLoading = buyingTier === tier.key;
              return (
                <button
                  key={tier.key}
                  onClick={() => handleQuickBuy(tier.key)}
                  disabled={buyingTier !== null}
                  className="group relative overflow-hidden border border-zinc-200/80 bg-white p-5 rounded-[16px] text-left transition-all duration-300 hover:border-[#C4632C]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold text-zinc-900 tracking-tight">
                        {tier.label}
                      </p>
                      <p className="text-xs text-zinc-500 font-medium mt-1">
                        {tier.price} one-time
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[#C4632C] text-[11px] font-bold uppercase tracking-widest">
                      {isLoading ? (
                        <>
                          <CircleNotch className="w-3.5 h-3.5 animate-spin" weight="bold" />
                          Redirecting…
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" weight="fill" />
                          Purchase
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <TrendUp className="w-4 h-4 text-zinc-400" weight="bold" />
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                Transaction History
              </h3>
            </div>
            <span className="bg-zinc-100 text-zinc-500 px-2.5 py-0.5 rounded-[6px] font-bold text-[10px] uppercase tracking-widest">
              {transactions.length} transactions
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white/60 backdrop-blur-xl border border-zinc-200/60 rounded-[20px]">
              <CircleNotch className="w-6 h-6 animate-spin text-[#C4632C]" />
            </div>
          ) : transactions.length === 0 ? (
            <Card className="border-2 border-dashed border-zinc-200 bg-white/40 p-16 flex flex-col items-center justify-center text-center gap-4 rounded-[20px] shadow-none">
              <div className="w-16 h-16 rounded-[16px] bg-zinc-50 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-zinc-300" weight="fill" />
              </div>
              <p className="text-zinc-500 text-sm font-medium max-w-xs">
                No transactions yet. Generate an itinerary to see your credit activity here.
              </p>
            </Card>
          ) : (
            <div className="bg-white/80 backdrop-blur-2xl border border-zinc-200/60 rounded-[20px] overflow-hidden shadow-sm">
              <div className="divide-y divide-zinc-100">
                {transactions.map((tx, idx) => {
                  const config = REASON_CONFIG[tx.reason] || REASON_CONFIG.GENERATION;
                  const Icon = config.icon;
                  const isPositive = tx.amount > 0;

                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="flex items-center justify-between p-4 sm:px-6 sm:py-4 hover:bg-zinc-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 border border-black/5",
                            config.bgColor
                          )}
                        >
                          <Icon className={cn("w-5 h-5", config.color)} weight="fill" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900 tracking-tight">
                            {config.label}
                          </p>
                          <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "text-base font-bold tabular-nums",
                          isPositive ? "text-emerald-500" : "text-zinc-900"
                        )}
                      >
                        {isPositive ? "+" : ""}
                        {tx.amount}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
