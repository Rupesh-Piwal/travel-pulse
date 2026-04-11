"use client";

import { motion } from "framer-motion";
import { Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-5xl space-y-10">
      <header className="space-y-1">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl font-semibold tracking-tight text-foreground"
        >
          Welcome back
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Your travel command center.
        </motion.p>
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="relative overflow-hidden border-border/50 bg-accent/20 backdrop-blur-sm p-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center border border-border/50">
              <CreditCard className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Available Credits</p>
              <h2 className="text-3xl font-bold font-sans">7</h2>
            </div>
          </div>

          <Link href="/dashboard/itinerary/new">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-6 h-12 gap-2 shadow-lg shadow-orange-950/20">
              <Plus className="w-4 h-4" />
              Plan New Trip
            </Button>
          </Link>
          
          {/* Subtle background glow */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </Card>
      </motion.div>
    </div>
  );
}