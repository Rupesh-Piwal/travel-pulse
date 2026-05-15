import { Queue } from "bullmq";
import { connection } from "../core/connection";

export const PDF_QUEUE_NAME = "pdf-generation-queue";

// Singleton Pattern for Next.js HMR
declare global {
  var pdfQueue: Queue | undefined;
}

export const pdfQueue = global.pdfQueue || new Queue(PDF_QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

if (process.env.NODE_ENV !== "production") {
  global.pdfQueue = pdfQueue;
}

export interface PdfJobData {
  itineraryId: string;
  userId: string;
  pdfExportId: string;
  baseUrl: string;
}

/**
 * Adds a new PDF generation job to the queue
 */
export async function addPdfJob(data: PdfJobData) {
  return await pdfQueue.add(
    "generate-pdf",
    data,
    { jobId: data.pdfExportId }
  );
}
