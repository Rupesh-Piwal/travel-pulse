"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

import {
  CreditCard,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  FileText,
  Gift,
  ShoppingCart,
  RotateCcw,
  Zap,
  LoaderCircle,
  Plus,
  Loader2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCredits } from "@/hooks/useCredits";

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
    bgColor: "bg-emerald-500/10",
  },
  PURCHASE: {
    label: "Credit Purchase",
    icon: ShoppingCart,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  GENERATION: {
    label: "Itinerary Generated",
    icon: Zap,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  EXPORT: {
    label: "PDF Export",
    icon: FileText,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  REFUND: {
    label: "Refund",
    icon: RotateCcw,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
};

const QUICK_BUY_TIERS = [
  { key: "voyager", label: "30 credits", price: "$5" },
  { key: "pathfinder", label: "100 credits", price: "$20" },
  { key: "globalist", label: "300 credits", price: "$49" },
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
      // Refresh credits after purchase
      fetchCredits();
      // Clean URL
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
    <div className="max-w-5xl space-y-10">
      {/* Page Header */}
      <header className="space-y-1">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl font-semibold tracking-tight text-foreground"
        >
          Credits
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Track your balance and transaction history.
        </motion.p>
      </header>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {/* Balance Card */}
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 p-8 text-white col-span-1 sm:col-span-1 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(234,88,12,0.4)]">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-orange-100 uppercase tracking-wider">
                Balance
              </p>
            </div>
            <h2 className="text-5xl font-black tracking-tight">
              {credits ?? "..."}
            </h2>
            <p className="text-xs text-orange-200 mt-2 font-medium">
              Credits available
            </p>
          </div>
        </Card>

        {/* Earned Card */}
        <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm p-8 rounded-[2rem]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Earned
            </p>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">
            +{totalEarned}
          </h2>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            Total credits received
          </p>
        </Card>

        {/* Spent Card */}
        <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm p-8 rounded-[2rem]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Used
            </p>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">
            -{totalSpent}
          </h2>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            Total credits spent
          </p>
        </Card>
      </motion.div>

      {/* Buy More Credits */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <Plus className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-xl font-bold tracking-tight">Buy More Credits</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_BUY_TIERS.map((tier) => {
            const isLoading = buyingTier === tier.key;
            return (
              <button
                key={tier.key}
                onClick={() => handleQuickBuy(tier.key)}
                disabled={buyingTier !== null}
                className="group relative overflow-hidden border border-border/50 bg-card/40 backdrop-blur-sm p-6 rounded-2xl text-left transition-all duration-300 hover:border-orange-500/30 hover:shadow-[0_10px_40px_-10px_rgba(234,88,12,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-500" />
                <div className="relative z-10">
                  <p className="text-lg font-black text-foreground">
                    {tier.label}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium mt-1">
                    {tier.price} one-time
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-orange-500 text-sm font-bold">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting…
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-xl font-bold tracking-tight">
              Transaction History
            </h3>
          </div>
          <Badge
            variant="secondary"
            className="bg-accent/40 text-muted-foreground border-none font-bold text-xs"
          >
            {transactions.length} transactions
          </Badge>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoaderCircle className="w-7 h-7 animate-spin text-orange-500" />
          </div>
        ) : transactions.length === 0 ? (
          <Card className="border-dashed border-2 border-border/50 bg-accent/5 p-16 flex flex-col items-center justify-center text-center gap-4 rounded-[2rem]">
            <div className="w-16 h-16 rounded-2xl bg-orange-600/10 flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-muted-foreground text-sm font-medium max-w-xs">
              No transactions yet. Generate an itinerary to see your credit
              activity here.
            </p>
          </Card>
        ) : (
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm rounded-[2rem] overflow-hidden divide-y divide-border/30">
            {transactions.map((tx, idx) => {
              const config =
                REASON_CONFIG[tx.reason] || REASON_CONFIG.GENERATION;
              const Icon = config.icon;
              const isPositive = tx.amount > 0;

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex items-center justify-between px-6 py-5 hover:bg-accent/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {config.label}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
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
                    className={`text-lg font-black tabular-nums ${
                      isPositive ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {tx.amount}
                  </span>
                </motion.div>
              );
            })}
          </Card>
        )}
      </motion.div>
    </div>
  );
}
