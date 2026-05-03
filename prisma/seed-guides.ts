import 'dotenv/config';
import { Budget, Vibe, ItineraryStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

const guides = [
  {
    slug: 'turkey',
    destination: 'Turkey',
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2000&auto=format&fit=crop',
    lat: 38.9637,
    lng: 35.2433,
  },
  {
    slug: 'switzerland',
    destination: 'Switzerland',
    heroImage: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=2000&auto=format&fit=crop',
    lat: 46.8182,
    lng: 8.2275,
  },
  {
    slug: 'indonesia',
    destination: 'Indonesia',
    heroImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=2000&auto=format&fit=crop',
    lat: -0.7893,
    lng: 113.9213,
  },
  {
    slug: 'thailand',
    destination: 'Thailand',
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2000&auto=format&fit=crop',
    lat: 15.8700,
    lng: 100.9925,
  },
  {
    slug: 'vietnam',
    destination: 'Vietnam',
    heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2000&auto=format&fit=crop',
    lat: 14.0583,
    lng: 108.2772,
  },
  {
    slug: 'japan',
    destination: 'Japan',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop',
    lat: 36.2048,
    lng: 138.2529,
  },
  {
    slug: 'united-states',
    destination: 'United States',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop',
    lat: 37.0902,
    lng: -95.7129,
  },
  {
    slug: 'panama',
    destination: 'Panama',
    heroImage: 'https://images.unsplash.com/photo-1596422846543-74c6e2ca0121?q=80&w=2000&auto=format&fit=crop',
    lat: 8.5380,
    lng: -80.7821,
  }
];

async function main() {
  console.log('Seeding guides...');

  // Ensure a system user exists
  let systemUser = await prisma.user.findUnique({ where: { email: 'system@nomadgo.app' } });
  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        email: 'system@nomadgo.app',
        name: 'NomadGo Guides',
      }
    });
  }

  for (const guide of guides) {
    const itineraryData = {
      destination: guide.destination,
      heroImage: guide.heroImage,
      bestTimeToVisit: "Spring or Autumn",
      localCurrency: "Local Currency",
      language: "Local Language",
      travelTips: ["Stay hydrated", "Use public transport"],
      days: [
        {
          day: 1,
          title: "Arrival & Exploration",
          summary: `Discover the vibrant heart of ${guide.destination}.`,
          activities: [
            {
              title: "Morning Highlights",
              description: "Start your day by visiting the most iconic spots.",
              image: guide.heroImage,
              lat: guide.lat + 0.01,
              lng: guide.lng + 0.01,
              timeOfDay: "Morning",
              rating: 4.8,
            },
            {
              title: "Afternoon Delight",
              description: "Taste the local cuisine and walk through historical neighborhoods.",
              image: null,
              lat: guide.lat,
              lng: guide.lng,
              timeOfDay: "Afternoon",
              rating: 4.5,
            }
          ]
        },
        {
          day: 2,
          title: "Adventure Awaits",
          summary: "Venture outside the city center for a breathtaking experience.",
          activities: [
            {
              title: "Scenic Excursion",
              description: "Enjoy stunning views and connect with nature.",
              image: guide.heroImage,
              lat: guide.lat - 0.01,
              lng: guide.lng - 0.01,
              timeOfDay: "Morning",
              rating: 4.9,
            }
          ]
        }
      ]
    };

    await prisma.itinerary.upsert({
      where: { id: guide.slug },
      update: {
        data: itineraryData,
      },
      create: {
        id: guide.slug,
        userId: systemUser.id,
        destination: guide.destination,
        days: 2,
        budget: Budget.MID,
        vibe: Vibe.CULTURAL,
        status: ItineraryStatus.DONE,
        data: itineraryData,
      }
    });
    console.log(`Created guide: ${guide.destination}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
