import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deductCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// Tell Next.js that this API route is dynamic and may take some time
export const maxDuration = 60; // 60 seconds is Vercel hobby maximum, but valid only on Pro if larger. 60 is max for hobby
export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: itineraryId } = await params;

    // Verify itinerary exists and belongs to user
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
      select: { id: true, userId: true }
    });

    if (!itinerary) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Attempt to deduct 1 credit for generating a PDF
    try {
      await deductCredits(session.user.id, 1);
    } catch (e: any) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // Determine Base URL (handling local and production Vercel)
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    const targetUrl = `${baseUrl}/dashboard/itinerary/${itineraryId}`;

    let browser;
    try {
      if (process.env.NODE_ENV === "development") {
        // Local environment: use standard puppeteer
        const puppeteer = require("puppeteer");
        browser = await puppeteer.launch({ headless: true });
      } else {
        // Production: use sparticuz + puppeteer-core
        browser = await puppeteerCore.launch({
          args: chromium.args,
          defaultViewport: { width: 1280, height: 720 },
          executablePath: await chromium.executablePath(),
          headless: true,
        });
      }

      const page = await browser.newPage();
      
      // Pass the current user's session cookies to the headless browser
      // so it doesn't get redirected to the login page by the middleware
      const cookiesStr = req.headers.get("cookie") || "";
      if (cookiesStr) {
        const hostname = new URL(baseUrl).hostname;
        const cookieArray = cookiesStr.split(';').map(c => {
          const [name, ...rest] = c.trim().split('=');
          return {
            name,
            value: rest.join('='),
            domain: hostname,
            path: '/'
          };
        });
        await page.setCookie(...cookieArray);
      }

      // Navigate and wait for network to be idle
      await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 30000 });

      // Generate the PDF
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" }
      });

      await browser.close();

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="NomadGo-Itinerary-${itineraryId}.pdf"`,
        },
      });
      
    } catch (error) {
      if (browser) await browser.close();
      console.error("Puppeteer Error:", error);
      return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    }

  } catch (error) {
    console.error("PDF generation API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
