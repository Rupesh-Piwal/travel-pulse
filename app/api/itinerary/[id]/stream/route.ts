import { NextRequest } from "next/server";
import { connection } from "@/lib/bull/connection";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Check if itinerary exists
  const itinerary = await prisma.itinerary.findUnique({
    where: { id },
  });

  if (!itinerary) {
    return new Response("Not Found", { status: 404 });
  }

  // 2. Create a stream
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      // Helper to send events
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // If already done, send immediate completion
      if (itinerary.status === "DONE") {
        sendEvent({ status: "DONE" });
        controller.close();
        return;
      }

      // 3. Subscribe to Redis Channel
      const subClient = connection.duplicate(); // Sub clients must be exclusive
      const channel = `itinerary:status:${id}`;

      // Heartbeat to keep connection alive
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch (e) {
          clearInterval(interval);
        }
      }, 15000);

      await subClient.subscribe(channel);

      subClient.on("message", (chan, message) => {
        if (chan === channel) {
          const data = JSON.parse(message);
          sendEvent(data);

          if (data.status === "DONE" || data.status === "FAILED") {
            clearInterval(interval); // 🔥 Clear interval on completion
            subClient.unsubscribe(channel);
            subClient.quit();
            try { controller.close(); } catch (e) {}
          }
        }
      });

      // 4. Cleanup on close
      req.signal.addEventListener("abort", () => {
        clearInterval(interval); // 🔥 Clear interval on user exit
        subClient.unsubscribe(channel);
        subClient.quit();
        try { controller.close(); } catch (e) {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
