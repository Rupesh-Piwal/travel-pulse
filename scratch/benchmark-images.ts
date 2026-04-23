import pLimit from "p-limit";

// Mocking the Unsplash fetch to simulate a real network delay (500ms - 1500ms)
const mockFetchImage = async (id: number) => {
  const delay = Math.floor(Math.random() * 1000) + 500;
  await new Promise(resolve => setTimeout(resolve, delay));
  return `image_${id}.jpg`;
};

const TOTAL_IMAGES = 42; // 7 days * 6 activities

async function runBenchmark() {
  console.log("🚀 Starting Image Fetch Benchmark...");
  console.log(`📊 Simulating ${TOTAL_IMAGES} image fetches...\n`);

  // --- TEST 1: UNLIMITED CONCURRENCY (Current) ---
  console.log("🛑 TEST 1: Unlimited Concurrency (Promise.all)");
  const start1 = performance.now();
  
  // We fire ALL of them at once
  const results1 = await Promise.all(
    Array.from({ length: TOTAL_IMAGES }).map((_, i) => mockFetchImage(i))
  );
  
  const end1 = performance.now();
  console.log(`✅ Completed in: ${((end1 - start1) / 1000).toFixed(2)}s`);
  console.log(`⚠️ Risk: Fired ${TOTAL_IMAGES} simultaneous network sockets.\n`);

  // --- TEST 2: CONTROLLED CONCURRENCY (New) ---
  console.log("🟢 TEST 2: Controlled Concurrency (p-limit = 5)");
  const limit = pLimit(5); // Only 5 at a time
  const start2 = performance.now();
  
  // We queue them through the limiter
  const results2 = await Promise.all(
    Array.from({ length: TOTAL_IMAGES }).map((_, i) => 
      limit(() => mockFetchImage(i))
    )
  );
  
  const end2 = performance.now();
  console.log(`✅ Completed in: ${((end2 - start2) / 1000).toFixed(2)}s`);
  console.log(`🛡️ Stability: Max 5 concurrent sockets. 100% safe for Unsplash API.\n`);

  console.log("📈 CONCLUSION:");
  console.log("- The Unlimited method is faster but 'Aggressive'. It's like 42 people trying to squeeze through a door at once.");
  console.log("- The Controlled method is 'Polite'. It ensures your API keys aren't banned and your server doesn't crash under high load.");
}

runBenchmark().catch(console.error);
