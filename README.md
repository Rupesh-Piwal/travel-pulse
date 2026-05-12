# NomadGo — AI-Powered Editorial Travel Planning

> **[🔗 Live App](https://nomadgoo.vercel.app)** · **[📄 Sample PDF Itinerary (Bali 3-Day)](https://pub-7ff19c3009334269bb2dae0371a0478b.r2.dev/exports/cmp2xcaak000004jsxtscs634-1778608192223.pdf)** · **[👤 Portfolio](https://rpdev21.vercel.app)**

NomadGo transforms a destination idea into a high-fidelity, print-ready travel itinerary — complete with curated photography, mapped routes, and a downloadable editorial PDF.

---

## 📄 See It In Action

The best way to understand NomadGo is to look at what it produces:

**[📄 Sample PDF Itinerary (Bali 3-Day)](https://pub-7ff19c3009334269bb2dae0371a0478b.r2.dev/exports/cmp2xcaak000004jsxtscs634-1778608192223.pdf)**

---
## 📸 Screenshots

 ![](./public/heroimage.png) 
---

## 🏗️ Architecture

Built for reliability under LLM latency — heavy work runs in background workers, the UI never blocks.

### 1. AI Orchestration
- **Model**: Gemini 1.5 Flash via Vercel AI SDK
- **Output Reliability**: Strict Zod schemas enforce structured JSON — no parsing failures on complex itinerary objects
- **Grounding**: Destination metadata and coordinates baked in to prevent hallucinated geography

### 2. Media Pipeline
The hardest part of AI travel content is making it *not look AI-generated*. NomadGo solves this with a custom enrichment layer:
- **Smart Source Routing**: Queries Unsplash (activities), Pexels (food/dining), Wikimedia (landmarks) based on activity category
- **Asset Caching**: All resolved images persisted to Cloudflare R2 — no broken links, no re-fetching
- **Graceful Fallback**: If one source fails, the pipeline falls through to the next provider silently

### 3. Background Processing (BullMQ)
LLM calls + Puppeteer in a request/response cycle = timeouts. Both are offloaded:
- **Itinerary Worker**: Handles generation async, manages Gemini rate limits
- **PDF Worker**: Puppeteer-Core + `@sparticuz/chromium` optimized for Railway's low-memory environment
- **Resiliency**: Exponential backoff + automatic retries on transient failures
- **Progress Tracking**: API polling keeps the UI in sync with job state

### 4. Infrastructure
- **ORM**: Prisma + PostgreSQL (Supabase)
- **Auth**: NextAuth.js (multi-provider)
- **Queue**: BullMQ on Upstash (serverless Redis)
- **Storage**: Cloudflare R2
- **Deployment**: Railway (web + worker as separate services)

---

## 🛠️ Tech Stack

| Layer | Stack |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), Tailwind CSS 4, Framer Motion, Radix UI |
| **Backend** | Node.js, BullMQ, TSX worker process |
| **AI** | Google Gemini 1.5 Flash, Vercel AI SDK, Zod |
| **Storage** | Cloudflare R2, PostgreSQL (Supabase) |
| **Infra** | Railway, Upstash Redis |
| **PDF** | Puppeteer-Core, Headless Chromium (`@sparticuz/chromium`) |
| **Payments** | Stripe (credits system) |

---

## 🚀 Features

- **Vibe-Based Planning** — Luxury / Backpacker / Adventure / Cultural modes shape the entire itinerary tone
- **Editorial PDF Export** — Pixel-perfect, print-ready travel booklets generated in the background
- **Smart Photo Matching** — Category-aware image sourcing with R2 caching for consistent visual quality
- **Credits + Stripe** — Full monetization flow: purchase credits, generate itineraries
- **Interactive Maps** — Geolocation-accurate route visualization per day

---

## ⚙️ Running Locally

```env
DATABASE_URL="your_postgresql_url"
REDIS_URL="your_redis_url"
GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_key"
R2_ACCESS_KEY_ID="your_key"
R2_SECRET_ACCESS_KEY="your_secret"
R2_BUCKET_NAME="nomadgo-assets"
R2_PUBLIC_URL="https://your-bucket-url.com"
STRIPE_SECRET_KEY="your_stripe_key"
UNSPLASH_ACCESS_KEY="your_unsplash_key"
PEXELS_API_KEY="your_pexels_key"
```

```bash
npm install
npm run dev       # web app
npm run worker    # background worker (separate process)
```

---

## 📐 Engineering Decisions

- **Singleton Worker Pattern** — prevents duplicate BullMQ workers during Next.js HMR, avoids memory leaks
- **Chromium Binary Optimization** — `@sparticuz/chromium` chosen specifically for Railway/Lambda memory constraints vs standard Puppeteer
- **Zod-First AI Output** — structured schema validation before any UI render; prevents silent AI drift from breaking components
- **Separate Worker Process** — PDF generation and itinerary jobs run as an independent Railway service, not inside the Next.js server

---

Designed & built by [Rupesh Piwal](https://rpdev21.vercel.app)