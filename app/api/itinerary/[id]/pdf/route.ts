import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deductCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// Tell Next.js that this API route is dynamic and may take some time
export const maxDuration = 120; 
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
    const targetUrl = `${baseUrl}/dashboard/itinerary/${itineraryId}/print`;

    let browser;
    try {
      if (process.env.NODE_ENV === "development") {
        // Local environment: use standard puppeteer
        const puppeteer = require("puppeteer");
        browser = await puppeteer.launch({ 
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
      } else if (process.env.RAILWAY_ENVIRONMENT || process.env.PUPPETEER_EXECUTABLE_PATH) {
        // Railway / Docker environment: use system-installed Chromium
        console.log("Launching Puppeteer on Railway using:", process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium");
        browser = await puppeteerCore.launch({
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
          defaultViewport: { width: 1280, height: 720 },
          headless: true,
        });
      } else {
        // Vercel / Serverless environment: use sparticuz + puppeteer-core
        browser = await puppeteerCore.launch({
          args: chromium.args,
          defaultViewport: { width: 1280, height: 720 },
          executablePath: await chromium.executablePath(),
          headless: true,
        });
      }

      const page = await browser.newPage();

      // Set a consistent viewport for A4 rendering
      await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

      // Pass the current user's session cookies
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
      console.log(`Puppeteer navigating to: ${targetUrl}`);
      // Increased timeout to 90s and using networkidle2 which is more resilient to lingering analytics/assets
      await page.goto(targetUrl, { waitUntil: ["networkidle2", "load"], timeout: 90000 });

      // Check if we were redirected to login
      const currentUrl = page.url();
      const pageTitle = await page.title();
      console.log(`Puppeteer currently at: ${currentUrl} (Title: ${pageTitle})`);

      if (currentUrl.includes("/login")) {
        console.error("PDF Generation failed: Redirected to login page. Session cookies might be invalid or missing.");
        throw new Error("Authentication failed during PDF generation");
      }

      // Wait for the main heading to ensure content has loaded
      try {
        await page.waitForSelector('h1', { timeout: 20000 });
      } catch (e) {
        console.warn("Heading <h1> not found within timeout. Page content might be different than expected.");
      }

      // Small additional delay to ensure all images and fonts are rendered
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate the PDF
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
        preferCSSPageSize: true
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
