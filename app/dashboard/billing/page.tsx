"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  CreditCard,
  Crown,
  Check,
  Lightning,
  Shield,
  Infinity,
  FileText,
  Sparkle,
  ArrowRight,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCredits } from "@/hooks/useCredits";
import { toast } from "sonner";

const CREDIT_PACKS = [
  {
    name: "Starter",
    credits: 5,
    price: "$4.99",
    pricePerCredit: "$1.00",
    popular: false,
    icon: Lightning,
  },
  {
    name: "Explorer",
    credits: 15,
    price: "$9.99",
    pricePerCredit: "$0.67",
    popular: true,
    icon: Sparkle,
  },
  {
    name: "Globetrotter",
    credits: 50,
    price: "$24.99",
    pricePerCredit: "$0.50",
    popular: false,
    icon: Crown,
  },
];

const SUBSCRIPTION_PLANS = [
  {
    name: "Explorer",
    price: "$0",
    period: "forever",
    description: "For casual travelers getting started",
    features: [
      "5 credits on signup",
      "Standard AI itineraries",
      "PDF export (1 credit each)",
      "Community support",
    ],
    cta: "Current Plan",
    disabled: true,
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For serious travelers who plan frequently",
    features: [
      "20 credits per month",
      "Priority AI generation",
      "Unlimited PDF exports",
      "Priority support",
      "Early access features",
      "Custom trip themes",
    ],
    cta: "Upgrade to Pro",
    disabled: false,
    highlight: true,
  },
];

export default function BillingPage() {
  const { credits } = useCredits();

  const handlePurchase = (packName: string) => {
    toast.info(`Stripe integration coming soon! "${packName}" pack selected.`);
  };

  const handleSubscribe = (planName: string) => {
    toast.info(`Stripe subscription for "${planName}" plan coming soon!`);
  };

  return (
    <div className="max-w-5xl space-y-14">
      {/* Page Header */}
      <header className="space-y-1">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl font-semibold tracking-tight text-foreground"
        >
          Billing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Manage your subscription and purchase credit packs.
        </motion.p>
      </header>

      {/* Current Plan Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        <Card className="relative overflow-hidden border-border/50 bg-accent/20 backdrop-blur-sm p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-[2rem]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold tracking-tight">Explorer Plan</h3>
                <Badge className="bg-accent text-muted-foreground border-none font-bold text-[10px] uppercase tracking-widest">
                  Free
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                You have <span className="text-orange-500 font-bold">{credits ?? "..."}</span> credits remaining.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-2xl border-orange-500/30 text-orange-600 hover:bg-orange-600/10 font-bold px-6 h-12 gap-2 transition-transform active:scale-95"
            onClick={() => handleSubscribe("Pro")}
          >
            <Crown className="w-4 h-4" />
            Upgrade to Pro
          </Button>
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        </Card>
      </motion.div>

      {/* Credit Packs */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div>
          <h3 className="text-xl font-bold tracking-tight mb-1">Buy Credit Packs</h3>
          <p className="text-sm text-muted-foreground font-medium">
            One-time purchases. Credits never expire.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CREDIT_PACKS.map((pack, idx) => {
            const Icon = pack.icon;
            return (
              <motion.div
                key={pack.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.08 }}
              >
                <Card
                  className={`relative overflow-hidden rounded-[2rem] p-8 flex flex-col transition-all duration-300 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] ${
                    pack.popular
                      ? "border-orange-500/50 bg-orange-600/[0.03] ring-1 ring-orange-500/20"
                      : "border-border/50 bg-card/40"
                  }`}
                >
                  {pack.popular && (
                    <Badge className="absolute top-5 right-5 bg-orange-600 text-white border-none font-bold text-[10px] uppercase tracking-wider px-3 py-1 shadow-lg">
                      Most Popular
                    </Badge>
                  )}

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                    pack.popular ? "bg-orange-600/10" : "bg-accent/40"
                  }`}>
                    <Icon className={`w-6 h-6 ${pack.popular ? "text-orange-500" : "text-muted-foreground"}`} />
                  </div>

                  <h4 className="text-lg font-bold tracking-tight mb-1">{pack.name}</h4>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-black">{pack.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mb-6">
                    {pack.credits} credits • {pack.pricePerCredit} per credit
                  </p>

                  <Button
                    onClick={() => handlePurchase(pack.name)}
                    className={`w-full rounded-2xl h-12 font-bold gap-2 transition-transform active:scale-[0.97] mt-auto ${
                      pack.popular
                        ? "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-950/20"
                        : "bg-accent hover:bg-accent/80 text-foreground"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Purchase
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Subscription Plans */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div>
          <h3 className="text-xl font-bold tracking-tight mb-1">Subscription Plans</h3>
          <p className="text-sm text-muted-foreground font-medium">
            Unlock premium features with a monthly plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SUBSCRIPTION_PLANS.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + idx * 0.1 }}
            >
              <Card
                className={`relative overflow-hidden rounded-[2rem] p-8 flex flex-col h-full transition-all duration-300 ${
                  plan.highlight
                    ? "border-orange-500/50 bg-gradient-to-b from-orange-600/[0.03] to-transparent ring-1 ring-orange-500/20 hover:shadow-[0_25px_60px_-15px_rgba(234,88,12,0.15)]"
                    : "border-border/50 bg-card/40"
                }`}
              >
                {plan.highlight && (
                  <Badge className="absolute top-5 right-5 bg-orange-600 text-white border-none font-bold text-[10px] uppercase tracking-wider px-3 py-1 shadow-lg">
                    Recommended
                  </Badge>
                )}

                <div className="mb-6">
                  <h4 className="text-xl font-bold tracking-tight mb-1">{plan.name}</h4>
                  <p className="text-sm text-muted-foreground font-medium">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-muted-foreground font-bold text-sm">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.highlight ? "bg-orange-600/10" : "bg-accent/50"
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlight ? "text-orange-500" : "text-muted-foreground"}`} />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  disabled={plan.disabled}
                  onClick={() => handleSubscribe(plan.name)}
                  className={`w-full rounded-2xl h-12 font-bold gap-2 transition-transform active:scale-[0.97] ${
                    plan.highlight
                      ? "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-950/20"
                      : "bg-accent hover:bg-accent/80 text-foreground"
                  }`}
                >
                  {plan.cta}
                  {!plan.disabled && <ArrowRight className="w-4 h-4" />}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center py-8"
      >
        <p className="text-xs text-muted-foreground/70 font-medium">
          Payments are securely processed by Stripe. Credits never expire. Cancel your subscription at any time.
        </p>
      </motion.div>
    </div>
  );
}
