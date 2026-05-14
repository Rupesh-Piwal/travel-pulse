import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// ─── Data Interfaces ────────────────────────────────────────────

interface Activity {
  title: string;
  description: string;
  image: string | null;
  lat: number;
  lng: number;
  timeOfDay: "Morning" | "Lunchtime" | "Afternoon" | "Evening";
  category?: string;
  tags?: string[];
  bestTime?: string;
  curatorNote?: string;
  duration?: string;
  rating?: number;
  address?: string;
  proTip?: string;
  travelFromPrevious?: {
    mode: string;
    duration: string;
    distance: string;
  } | null;
}

interface Day {
  day: number;
  title: string;
  summary?: string;
  activities: Activity[];
  quote?: string;
}

interface ItineraryData {
  destination: string;
  heroImage?: any;
  days: Day[];
  bestTimeToVisit?: string;
  travelTips?: string[];
  language?: string;
  localCurrency?: string;
}

// ─── Design Tokens ──────────────────────────────────────────────

const T = {
  bg: "#FAFAF7",
  cream: "#F5F3EE",
  text: "#1A1A1A",
  muted: "#6B6B6B",
  light: "#9A9A9A",
  accent: "#B54A2A",
  rule: "#E0DDD6",
  dark: "#0C0C0C",
  white: "#FFFFFF",
};

// ─── Reusable Style Objects (Puppeteer-safe inline styles) ──────

const pageStyle: React.CSSProperties = {
  width: "210mm",
  minHeight: "297mm",
  backgroundColor: T.bg,
  position: "relative",
  overflow: "hidden",
  pageBreakAfter: "always",
  boxSizing: "border-box",
};

const sansFont = `'Schibsted Grotesk', 'Inter', -apple-system, sans-serif`;
const serifFont = `'Instrument Serif', 'Georgia', serif`;

// ─── Components ─────────────────────────────────────────────────

function PageHeader({ destination, pageNum }: { destination: string; pageNum: number }) {
  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px 48px",
      borderBottom: `1px solid ${T.rule}`,
    }}>
      <span style={{
        fontFamily: serifFont,
        fontSize: "11px",
        fontWeight: 400,
        letterSpacing: "0.08em",
        color: T.text,
        textTransform: "uppercase" as const,
      }}>
        NomadGo
      </span>
      <span style={{
        fontFamily: sansFont,
        fontSize: "9px",
        fontWeight: 600,
        letterSpacing: "0.15em",
        color: T.light,
        textTransform: "uppercase" as const,
      }}>
        {destination}
      </span>
      <span style={{
        fontFamily: sansFont,
        fontSize: "9px",
        fontWeight: 500,
        color: T.light,
      }}>
        {String(pageNum).padStart(2, "0")}
      </span>
    </header>
  );
}

function PageFooter({ destination }: { destination: string }) {
  return (
    <footer style={{
      padding: "20px 48px",
      borderTop: `1px solid ${T.rule}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "auto",
    }}>
      <span style={{
        fontFamily: sansFont,
        fontSize: "8px",
        fontWeight: 500,
        color: T.light,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
      }}>
        Curated by NomadGo
      </span>
      <span style={{
        fontFamily: sansFont,
        fontSize: "8px",
        color: T.light,
      }}>
        © {new Date().getFullYear()}
      </span>
    </footer>
  );
}

function CoverPage({ destination, days, data, heroImage }: { destination: string; days: Day[]; data: ItineraryData; heroImage: string | null }) {
  const cityName = destination.split(",")[0].trim();

  return (
    <div style={{
      ...pageStyle,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Top Brand Bar */}
      <div style={{
        padding: "32px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{
          fontFamily: serifFont,
          fontSize: "13px",
          letterSpacing: "0.12em",
          color: T.text,
          textTransform: "uppercase" as const,
        }}>
          NomadGo
        </span>
        <span style={{
          fontFamily: sansFont,
          fontSize: "9px",
          fontWeight: 600,
          letterSpacing: "0.2em",
          color: T.accent,
          textTransform: "uppercase" as const,
        }}>
          Travel Editorial
        </span>
      </div>

      {/* Hero Image */}
      {heroImage && (
        <div style={{
          margin: "0 48px",
          height: "340px",
          overflow: "hidden",
        }}>
          <img
            src={heroImage}
            alt={destination}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Title Block */}
      <div style={{
        padding: "56px 48px 0",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{
          borderTop: `3px solid ${T.text}`,
          paddingTop: "32px",
        }}>
          <h1 style={{
            fontFamily: serifFont,
            fontSize: "72px",
            fontWeight: 400,
            lineHeight: 0.92,
            color: T.text,
            margin: 0,
            letterSpacing: "-0.02em",
          }}>
            {cityName}
          </h1>

          {destination.includes(",") && (
            <p style={{
              fontFamily: serifFont,
              fontSize: "28px",
              fontStyle: "italic",
              color: T.muted,
              margin: "12px 0 0",
              fontWeight: 400,
            }}>
              {destination.split(",").slice(1).join(",").trim()}
            </p>
          )}
        </div>

        {/* Trip Metadata */}
        <div style={{
          display: "flex",
          gap: "40px",
          marginTop: "48px",
          paddingTop: "24px",
          borderTop: `1px solid ${T.rule}`,
        }}>
          <MetaItem label="Duration" value={`${days.length} Days`} />
          <MetaItem label="Activities" value={`${days.reduce((sum, d) => sum + d.activities.length, 0)} Experiences`} />
          {data.bestTimeToVisit && <MetaItem label="Best Season" value={data.bestTimeToVisit} />}
          {data.language && <MetaItem label="Language" value={data.language} />}
        </div>

        {/* Editorial Quote */}
        <div style={{
          marginTop: "auto",
          paddingBottom: "24px",
        }}>
          <div style={{
            borderLeft: `2px solid ${T.accent}`,
            paddingLeft: "24px",
            maxWidth: "480px",
          }}>
            <p style={{
              fontFamily: serifFont,
              fontSize: "18px",
              fontStyle: "italic",
              lineHeight: 1.5,
              color: T.muted,
              margin: 0,
            }}>
              A curated journey through the soul of {cityName} — every moment carefully selected.
            </p>
          </div>
        </div>
      </div>

      {/* Cover Footer */}
      <div style={{
        padding: "20px 48px",
        borderTop: `1px solid ${T.rule}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontFamily: sansFont, fontSize: "8px", color: T.light, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
          Generated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <span style={{ fontFamily: sansFont, fontSize: "8px", color: T.light }}>
          nomadgo.in
        </span>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{
        fontFamily: sansFont,
        fontSize: "8px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        color: T.light,
        margin: "0 0 4px",
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: sansFont,
        fontSize: "13px",
        fontWeight: 600,
        color: T.text,
        margin: 0,
      }}>
        {value}
      </p>
    </div>
  );
}

function DayIntroSection({ day, destination }: { day: Day; destination: string }) {
  return (
    <div style={{
      marginBottom: "48px",
    }}>
      {/* Chapter Label */}
      <p style={{
        fontFamily: sansFont,
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase" as const,
        color: T.accent,
        margin: "0 0 16px",
      }}>
        Chapter {day.day}
      </p>

      {/* Day Number + Title */}
      <div style={{
        display: "flex",
        alignItems: "baseline",
        gap: "24px",
        paddingBottom: "20px",
        borderBottom: `2px solid ${T.text}`,
      }}>
        <span style={{
          fontFamily: serifFont,
          fontSize: "64px",
          fontWeight: 400,
          lineHeight: 0.85,
          color: T.text,
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
        }}>
          Day {String(day.day).padStart(2, "0")}
        </span>
        <h2 style={{
          fontFamily: serifFont,
          fontSize: "24px",
          fontStyle: "italic",
          fontWeight: 400,
          lineHeight: 1.2,
          color: T.muted,
          margin: 0,
        }}>
          {day.title}
        </h2>
      </div>

      {/* Day Summary */}
      {day.summary && (
        <p style={{
          fontFamily: sansFont,
          fontSize: "13px",
          lineHeight: 1.65,
          color: T.muted,
          margin: "20px 0 0",
          maxWidth: "520px",
        }}>
          {day.summary}
        </p>
      )}

      {/* Quote */}
      {day.quote && (
        <div style={{
          display: "flex",
          gap: "20px",
          marginTop: "32px",
          paddingTop: "24px",
          borderTop: `1px solid ${T.rule}`,
        }}>
          <div style={{ width: "2px", backgroundColor: T.accent, flexShrink: 0, minHeight: "60px" }} />
          <p style={{
            fontFamily: serifFont,
            fontSize: "17px",
            fontStyle: "italic",
            lineHeight: 1.5,
            color: T.text,
            margin: 0,
            maxWidth: "460px",
          }}>
            &ldquo;{day.quote}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

function ActivityBlock({ activity, index }: { activity: Activity; index: number }) {
  const timeLabel = activity.timeOfDay === "Morning" ? "Morning"
    : activity.timeOfDay === "Lunchtime" ? "Midday"
      : activity.timeOfDay === "Afternoon" ? "Afternoon"
        : "Evening";

  return (
    <div style={{
      display: "flex",
      gap: "32px",
      marginBottom: "40px",
      pageBreakInside: "avoid",
    }}>
      {/* Image Column */}
      <div style={{ width: "200px", flexShrink: 0 }}>
        {activity.image ? (
          <img
            src={typeof activity.image === 'string' ? activity.image : (activity.image as any)?.url}
            alt={activity.title}
            style={{
              width: "200px",
              height: "150px",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div style={{
            width: "200px",
            height: "150px",
            backgroundColor: T.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontFamily: serifFont, fontSize: "11px", fontStyle: "italic", color: T.light }}>
              No image
            </span>
          </div>
        )}
      </div>

      {/* Content Column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Meta Row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
        }}>
          <span style={{
            fontFamily: sansFont,
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: T.accent,
          }}>
            {timeLabel}
          </span>
          {activity.category && (
            <>
              <span style={{ color: T.rule }}>·</span>
              <span style={{
                fontFamily: sansFont,
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: T.light,
              }}>
                {activity.category}
              </span>
            </>
          )}
          {activity.duration && (
            <>
              <span style={{ color: T.rule }}>·</span>
              <span style={{
                fontFamily: sansFont,
                fontSize: "9px",
                fontWeight: 500,
                color: T.light,
              }}>
                {activity.duration}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: serifFont,
          fontSize: "22px",
          fontWeight: 400,
          lineHeight: 1.2,
          color: T.text,
          margin: "0 0 8px",
        }}>
          {activity.title}
        </h3>

        {/* Address */}
        {activity.address && (
          <p style={{
            fontFamily: sansFont,
            fontSize: "10px",
            color: T.light,
            margin: "0 0 10px",
          }}>
            {activity.address}
          </p>
        )}

        {/* Description */}
        <p style={{
          fontFamily: sansFont,
          fontSize: "12px",
          lineHeight: 1.65,
          color: T.muted,
          margin: "0 0 12px",
        }}>
          {activity.description}
        </p>

        {/* Pro Tip / Curator Note */}
        {(activity.curatorNote || activity.proTip) && (
          <div style={{
            borderLeft: `2px solid ${T.accent}`,
            paddingLeft: "12px",
            marginTop: "8px",
          }}>
            <p style={{
              fontFamily: sansFont,
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: T.accent,
              margin: "0 0 4px",
            }}>
              Insider Tip
            </p>
            <p style={{
              fontFamily: serifFont,
              fontSize: "11px",
              fontStyle: "italic",
              lineHeight: 1.5,
              color: T.muted,
              margin: 0,
            }}>
              {activity.curatorNote || activity.proTip}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TransportConnector({ activity }: { activity: Activity }) {
  if (!activity.travelFromPrevious) return null;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 0",
      marginBottom: "8px",
    }}>
      <div style={{ flex: 1, height: "1px", backgroundColor: T.rule }} />
      <span style={{
        fontFamily: sansFont,
        fontSize: "8px",
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: T.light,
        whiteSpace: "nowrap",
      }}>
        {activity.travelFromPrevious.mode} · {activity.travelFromPrevious.duration}
        {activity.travelFromPrevious.distance ? ` · ${activity.travelFromPrevious.distance}` : ""}
      </span>
      <div style={{ flex: 1, height: "1px", backgroundColor: T.rule }} />
    </div>
  );
}

function ClosingPage({ destination, data }: { destination: string; data: ItineraryData }) {
  const cityName = destination.split(",")[0].trim();
  const totalActivities = data.days.reduce((sum, d) => sum + d.activities.length, 0);

  return (
    <div style={{
      ...pageStyle,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "80px 48px",
      pageBreakAfter: "auto",
    }}>
      {/* Closing Rule */}
      <div style={{ width: "40px", height: "2px", backgroundColor: T.accent, marginBottom: "48px" }} />

      <p style={{
        fontFamily: sansFont,
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
        color: T.light,
        margin: "0 0 24px",
      }}>
        End of Itinerary
      </p>

      <h2 style={{
        fontFamily: serifFont,
        fontSize: "42px",
        fontWeight: 400,
        lineHeight: 1.1,
        color: T.text,
        margin: "0 0 16px",
        letterSpacing: "-0.01em",
      }}>
        Your {cityName} story<br />begins here.
      </h2>

      <p style={{
        fontFamily: sansFont,
        fontSize: "13px",
        lineHeight: 1.6,
        color: T.muted,
        margin: "0 0 48px",
        maxWidth: "360px",
      }}>
        {data.days.length} days, {totalActivities} curated experiences — every moment designed to be memorable.
      </p>

      {/* Trip Stats */}
      <div style={{
        display: "flex",
        gap: "48px",
        paddingTop: "32px",
        borderTop: `1px solid ${T.rule}`,
        marginBottom: "64px",
      }}>
        <MetaItem label="Days" value={String(data.days.length)} />
        <MetaItem label="Experiences" value={String(totalActivities)} />
        {data.language && <MetaItem label="Language" value={data.language} />}
        {data.localCurrency && <MetaItem label="Currency" value={data.localCurrency} />}
      </div>

      {/* Travel Tips */}
      {data.travelTips && data.travelTips.length > 0 && (
        <div style={{
          textAlign: "left",
          maxWidth: "420px",
          width: "100%",
          marginBottom: "48px",
        }}>
          <p style={{
            fontFamily: sansFont,
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color: T.text,
            margin: "0 0 16px",
            borderBottom: `1px solid ${T.rule}`,
            paddingBottom: "8px",
          }}>
            Essential Tips
          </p>
          {data.travelTips.slice(0, 5).map((tip, i) => (
            <div key={i} style={{
              display: "flex",
              gap: "12px",
              marginBottom: "10px",
              alignItems: "flex-start",
            }}>
              <span style={{
                fontFamily: serifFont,
                fontSize: "14px",
                color: T.light,
                lineHeight: 1.4,
                minWidth: "20px",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p style={{
                fontFamily: sansFont,
                fontSize: "11px",
                lineHeight: 1.55,
                color: T.muted,
                margin: 0,
              }}>
                {tip}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Brand Footer */}
      <div style={{ marginTop: "auto" }}>
        <div style={{ width: "24px", height: "1px", backgroundColor: T.rule, margin: "0 auto 20px" }} />
        <p style={{
          fontFamily: sansFont,
          fontSize: "8px",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color: T.light,
          margin: 0,
        }}>
          Crafted with NomadGo · nomadgo.in
        </p>
      </div>
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────

export default async function PrintItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const itinerary = await prisma.itinerary.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!itinerary || !itinerary.data) {
    notFound();
  }

  const data = itinerary.data as unknown as ItineraryData;
  const destination = itinerary.destination;

  const destinationRecord = await prisma.destination.findUnique({
    where: { name: destination }
  });

  const resolvedHeroImage = (typeof data.heroImage === 'string' ? data.heroImage : data.heroImage?.url) || destinationRecord?.image || "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2000&auto=format&fit=crop";

  return (
    <div style={{
      fontFamily: sansFont,
      WebkitFontSmoothing: "antialiased",
      color: T.text,
      backgroundColor: T.bg,
    }}>
      {/* Global Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Schibsted+Grotesk:wght@400;500;600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          width: 210mm;
          margin: 0 auto;
        }

        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }

        img {
          image-rendering: -webkit-optimize-contrast;
        }
      `}} />

      {/* ═══ COVER PAGE ═══ */}
      <CoverPage destination={destination} days={data.days} data={data} heroImage={resolvedHeroImage} />

      {/* ═══ DAY PAGES ═══ */}
      {data.days.map((day, dayIndex) => (
        <div key={day.day} style={{
          ...pageStyle,
          display: "flex",
          flexDirection: "column",
        }}>
          <PageHeader destination={destination} pageNum={dayIndex + 2} />

          <main style={{
            flex: 1,
            padding: "40px 48px",
          }}>
            <DayIntroSection day={day} destination={destination} />

            {/* Activities */}
            <div>
              {day.activities.map((activity, actIndex) => (
                <div key={actIndex}>
                  {actIndex > 0 && <TransportConnector activity={activity} />}
                  <ActivityBlock activity={activity} index={actIndex} />
                </div>
              ))}
            </div>
          </main>

          <PageFooter destination={destination} />
        </div>
      ))}

      {/* ═══ CLOSING PAGE ═══ */}
      <ClosingPage destination={destination} data={data} />
    </div>
  );
}
