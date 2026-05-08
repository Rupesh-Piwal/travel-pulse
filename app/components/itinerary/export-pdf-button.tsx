"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { DownloadSimple, CircleNotch } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCredits } from "@/hooks/useCredits";
import DownloadOverlay from "./download-overlay";

interface ExportPdfButtonProps {
  itineraryId: string;
  destination?: string;
}

export default function ExportPdfButton({ itineraryId, destination }: ExportPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { fetchCredits } = useCredits();
  const { data: session } = useSession();

  const handleExport = async () => {
    if (!session) {
      toast.error("Please sign in to download the editorial PDF");
      return;
    }

    try {
      setIsGenerating(true);
      // Removed the toast.info since we now have a beautiful overlay
      
      const response = await fetch(`/api/itinerary/${itineraryId}/pdf`, {
        method: "POST",
      });

      if (!response.ok) {
        if (response.status === 402) {
          throw new Error("Insufficient credits to generate PDF.");
        }
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in.");
        }
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      const fileName = destination ? `${destination.split(',')[0]}-Editorial.pdf` : `NomadGo-Itinerary-${itineraryId.slice(0, 8)}.pdf`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully!");
      fetchCredits();

    } catch (error: any) {
      toast.error(error.message || "An error occurred during PDF generation.");
    } finally {
      // Delay closing the overlay slightly for a smoother transition
      setTimeout(() => {
        setIsGenerating(false);
      }, 800);
    }
  };

  return (
    <>
      <DownloadOverlay isVisible={isGenerating} destination={destination} />
      
      <Button
        variant="ghost"
        onClick={handleExport}
        disabled={isGenerating}
        className="
          relative overflow-hidden
          h-12 px-8 
          bg-gradient-to-b from-[#d97742] to-[#C4632C]
          text-white 
          rounded-full 
          font-semibold uppercase text-[11px] tracking-[0.18em]

          flex items-center justify-center gap-2.5

          shadow-[0_8px_20px_rgba(196,99,44,0.35)]
          hover:shadow-[0_12px_28px_rgba(196,99,44,0.45)]

          hover:-translate-y-[1px]
          active:translate-y-[1px] active:shadow-[0_4px_12px_rgba(196,99,44,0.3)]

          transition-all duration-300 ease-out

          border border-[#e08a55]/30
          backdrop-blur-sm

          disabled:opacity-70 disabled:cursor-not-allowed
        "
      >
        {/* subtle shine overlay */}
        <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />

        {/* content */}
        <span className="relative z-10 flex items-center gap-2.5">
          {isGenerating ? (
            <CircleNotch className="w-4 h-4 animate-spin" />
          ) : (
            <DownloadSimple className="w-4 h-4" />
          )}
          {isGenerating ? "Assembling..." : "Download PDF"}
        </span>
      </Button>
    </>
  );
}