import { Worker, Job } from "bullmq";
import { connection } from "../core/connection";
import { PDF_QUEUE_NAME, PdfJobData } from "../queues/pdf";
import { prisma } from "../../prisma";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import { uploadPdfToR2 } from "../../../services/media/r2.service";

// Singleton Pattern for Next.js HMR to prevent worker leaks
declare global {
  var pdfWorker: Worker | undefined;
}

export const pdfWorker = global.pdfWorker || new Worker(
  PDF_QUEUE_NAME,
  async (job: Job<PdfJobData>) => {
    const { itineraryId, pdfExportId, baseUrl } = job.data;
    let browser;

    try {
      console.log(`🎬 PDF Worker started for Itinerary: ${itineraryId}`);

      // 1. Update status to PROCESSING
      await prisma.pdfExport.update({
        where: { id: pdfExportId },
        data: { status: "ACTIVE" },
      });

      const targetUrl = `${baseUrl}/print/itinerary/${itineraryId}`;

      // 2. Launch Browser (Handles Local vs Prod)
      if (process.env.NODE_ENV === "development") {
        const { default: puppeteer } = await import("puppeteer");
        browser = await (puppeteer as any).launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"],
        });
      } else {
        browser = await puppeteerCore.launch({
          args: [...chromium.args, "--disable-web-security"],
          defaultViewport: { width: 1200, height: 1600 },
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || await chromium.executablePath(),
          headless: (chromium as any).headless,
        });
      }

      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

      console.log(`🚀 Navigating to ${targetUrl}`);
      await page.goto(targetUrl, { 
        waitUntil: ["networkidle0", "load"], 
        timeout: 120000 
      });

      // Additional wait for any dynamic content/animations
      await new Promise((r) => setTimeout(r, 2000));

      console.log("📄 Printing PDF...");
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
        preferCSSPageSize: true,
      });

      await browser.close();

      // 3. Upload to R2
      console.log("📤 Uploading PDF to R2...");
      const fileName = `exports/${itineraryId}-${Date.now()}.pdf`;
      const publicUrl = await uploadPdfToR2(Buffer.from(pdfBuffer), fileName);

      if (!publicUrl) throw new Error("Failed to upload PDF to R2");

      // 4. Final Update
      await prisma.pdfExport.update({
        where: { id: pdfExportId },
        data: { 
          status: "COMPLETED",
          url: publicUrl,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days expiry
        },
      });

      console.log(`✅ PDF Export Completed: ${publicUrl}`);

    } catch (error: any) {
      if (browser) await browser.close();
      console.error(`❌ PDF Worker failed for ${itineraryId}:`, error);

      await prisma.pdfExport.update({
        where: { id: pdfExportId },
        data: { status: "FAILED" },
      });

      throw error;
    }
  },
  { 
    connection, 
    concurrency: 1 // Process one at a time to save memory
  } 
);

if (process.env.NODE_ENV !== "production") {
  global.pdfWorker = pdfWorker;
}

pdfWorker.on("completed", (job) => {
  console.log(`✅ PDF Job ${job.id} completed`);
});

pdfWorker.on("failed", (job, err) => {
  console.log(`❌ PDF Job ${job?.id} failed with ${err.message}`);
});

export default pdfWorker;
