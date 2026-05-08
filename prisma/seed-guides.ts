import 'dotenv/config';
import { Budget, Vibe, ItineraryStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  maldivesData,
  switzerlandData,
  singaporeData,
  scotlandData,
  romeData,
  japanData,
  greatWallData,
  cambodiaData,
} from './guide-data';

const allGuides = [
  maldivesData,
  switzerlandData,
  singaporeData,
  scotlandData,
  romeData,
  japanData,
  greatWallData,
  cambodiaData,
];

async function main() {
  console.log('Seeding guides with real itinerary data...');

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

  for (const guide of allGuides) {
    await prisma.itinerary.upsert({
      where: { id: guide.slug },
      update: {
        data: guide.itinerary,
      },
      create: {
        id: guide.slug,
        userId: systemUser.id,
        destination: guide.destination,
        days: 1,
        budget: Budget.MID,
        vibe: Vibe.CULTURAL,
        status: ItineraryStatus.DONE,
        data: guide.itinerary,
      }
    });
    console.log(`✓ Seeded guide: ${guide.destination} (${guide.itinerary.days[0].activities.length} activities)`);
  }

  console.log(`\nSeeding complete! ${allGuides.length} guides with real itinerary data.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
