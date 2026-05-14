import type { Metadata } from "next";
import { Schibsted_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next"

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});


const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "NomadGo",
  description: "AI-free luxury travel itineraries",
};

import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/app/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        schibsted.variable,
        instrument.variable,
        "scrollbar-hide"
      )}
    >
      <body className="min-h-full flex flex-col scrollbar-hide font-sans">
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
