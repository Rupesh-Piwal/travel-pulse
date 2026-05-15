import "../core/env"; // Load environment variables first
import http from "http";
import "./itinerary";
import "./pdf";

/**
 * Worker Entry Point
 * This file initializes all workers and starts a simple health check server.
 */

console.log("🚀 Background Workers are running...");

// Railway Health Check Server
const PORT = process.env.PORT || 3001;

http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Workers are alive and kicking!");
}).listen(PORT, () => {
  console.log(`📡 Health check server running on port ${PORT}`);
});
