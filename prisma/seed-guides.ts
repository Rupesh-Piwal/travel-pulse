import 'dotenv/config';
import { Budget, Vibe, ItineraryStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

const guides = [
  {
    slug: 'maldives',
    destination: 'Maldives',
    heroImage: 'https://images.pexels.com/photos/29289155/pexels-photo-29289155.jpeg',
    lat: 3.2028,
    lng: 73.2207,
  },
  {
    slug: 'switzerland',
    destination: 'Switzerland',
    heroImage: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=2000&auto=format&fit=crop',
    lat: 46.8182,
    lng: 8.2275,
  },
  {
    slug: 'singapore',
    destination: 'Singapore',
    heroImage: 'https://images.pexels.com/photos/20768105/pexels-photo-20768105.jpeg',
    lat: 1.3521,
    lng: 103.8198,
  },
  {
    slug: 'scotland',
    destination: 'Scotland',
    heroImage: 'https://images.unsplash.com/photo-1641038321852-bc96d970e2e5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    lat: 56.4907,
    lng: -4.2026,
  },
  {
    slug: 'rome',
    destination: 'Rome',
    heroImage: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg',
    lat: 41.9028,
    lng: 12.4964,
  },
  {
    slug: 'japan',
    destination: 'Japan',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop',
    lat: 36.2048,
    lng: 138.2529,
  },
  {
    slug: 'great-wall-of-china',
    destination: 'Great Wall of China',
    heroImage: 'https://images.pexels.com/photos/17615499/pexels-photo-17615499.jpeg',
    lat: 40.4319,
    lng: 116.5704,
  },
  {
    slug: 'cambodia',
    destination: 'Cambodia',
    heroImage: 'https://images.pexels.com/photos/5278961/pexels-photo-5278961.jpeg',
    lat: 12.5657,
    lng: 104.9910,
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
  
  // Clean up old guides if they exist
  await prisma.itinerary.deleteMany({
    where: {
      id: { in: ['turkey', 'united-states', 'panama', 'indonesia', 'vietnam', 'thailand', 'rio-de-janeiro'] }
    }
  });

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
