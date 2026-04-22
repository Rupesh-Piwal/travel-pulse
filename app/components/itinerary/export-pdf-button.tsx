"use client";

import { useState } from "react";
import { DownloadSimple, CircleNotch } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCredits } from "@/hooks/useCredits";

interface ExportPdfButtonProps {
  itineraryId: string;
}

export default function ExportPdfButton({ itineraryId }: ExportPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { fetchCredits } = useCredits(); // Refresh credits after deduction

  const handleExport = async () => {
    try {
      setIsGenerating(true);
      toast.info("Generating PDF... This may take a moment.");

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
      a.download = `NomadGo-Itinerary-${itineraryId.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF Downloaded successfully!");
      
      // Update credits asynchronously
      fetchCredits();

    } catch (error: any) {
      toast.error(error.message || "An error occurred during PDF generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      className="h-14 px-10 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold uppercase text-[11px] tracking-[0.2em] transition-all duration-500 active:scale-95 gap-3"
      onClick={handleExport}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <CircleNotch className="w-4 h-4 animate-spin text-orange-400" />
      ) : (
        <DownloadSimple className="w-4 h-4 text-orange-400" />
      )}
      {isGenerating ? "Processing..." : "Save PDF"}
    </Button>
  );
}
