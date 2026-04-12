import { PrismaClient, Vibe } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


const destinations = [
  {
    name: "Tokyo",
    description: "A vibrant mix of ultramodern neon and traditional temples.",
    lat: 35.6762,
    lng: 139.6503,
    tags: ["city", "food", "culture", "tech"],
    activities: [
      { title: "TeamLab Borderless", description: "Digital art museum with immersive displays.", vibe: Vibe.CULTURAL, lat: 35.6264, lng: 139.7758, duration: 180 },
      { title: "Tsukiji Outer Market", description: "Fresh seafood and street food stalls.", vibe: Vibe.FOODIE, lat: 35.6655, lng: 139.7707, duration: 120 },
      { title: "Shibuya Crossing", description: "The world's busiest pedestrian intersection.", vibe: Vibe.ADVENTURE, lat: 35.6595, lng: 139.7005, duration: 60 },
      { title: "Meiji Jingu Shrine", description: "Serene Shinto shrine surrounded by a forest.", vibe: Vibe.RELAXED, lat: 35.6764, lng: 139.6993, duration: 120 },
      { title: "Akihabara Electric Town", description: "Hub for electronics, anime, and gaming.", vibe: Vibe.CULTURAL, lat: 35.6984, lng: 139.7731, duration: 180 },
      { title: "Robot Restaurant", description: "Eclectic dinner show with giant robots.", vibe: Vibe.ADVENTURE, lat: 35.6943, lng: 139.7028, duration: 90 },
      { title: "Shinjuku Gyoen National Garden", description: "Beautiful park with Japanese and French gardens.", vibe: Vibe.RELAXED, lat: 35.6852, lng: 139.7101, duration: 150 },
      { title: "Ramen Street", description: "Multiple famous ramen shops in Tokyo Station.", vibe: Vibe.FOODIE, lat: 35.6812, lng: 139.7671, duration: 60 },
    ],
  },
  {
    name: "Paris",
    description: "The city of light, famous for art, fashion, and gastronomy.",
    lat: 48.8566,
    lng: 2.3522,
    tags: ["romantic", "art", "food", "history"],
    activities: [
      { title: "Eiffel Tower", description: "Iconic iron tower with panoramic views.", vibe: Vibe.CULTURAL, lat: 48.8584, lng: 2.2945, duration: 120 },
      { title: "Louvre Museum", description: "World's largest art museum and home to the Mona Lisa.", vibe: Vibe.CULTURAL, lat: 48.8606, lng: 2.3376, duration: 240 },
      { title: "Montmartre & Sacré-Cœur", description: "Artistic hilltop district with a stunning basilica.", vibe: Vibe.RELAXED, lat: 48.8867, lng: 2.3431, duration: 180 },
      { title: "Seine River Cruise", description: "Relaxing boat tour past major monuments.", vibe: Vibe.RELAXED, lat: 48.8585, lng: 2.3394, duration: 60 },
      { title: "Le Marais Food Tour", description: "Exploring the best pastries and crepes in the city.", vibe: Vibe.FOODIE, lat: 48.8575, lng: 2.3592, duration: 180 },
      { title: "Catacombs of Paris", description: "Underground ossuary with millions of bones.", vibe: Vibe.ADVENTURE, lat: 48.8338, lng: 2.3324, duration: 90 },
      { title: "Jardin du Luxembourg", description: "Scenic 17th-century gardens.", vibe: Vibe.RELAXED, lat: 48.8462, lng: 2.3371, duration: 120 },
      { title: "Boulangerie Pastry Workshop", description: "Learn to bake authentic French croissants.", vibe: Vibe.FOODIE, lat: 48.8648, lng: 2.3345, duration: 150 },
    ],
  },
  {
    name: "New York City",
    description: "The city that never sleeps, known for skyscrapers and culture.",
    lat: 40.7128,
    lng: -74.006,
    tags: ["city", "shopping", "entertainment"],
    activities: [
      { title: "Central Park", description: "Expansive urban park in Manhattan.", vibe: Vibe.RELAXED, lat: 40.7851, lng: -73.9683, duration: 180 },
      { title: "Empire State Building", description: "Historic skyscraper with an observation deck.", vibe: Vibe.CULTURAL, lat: 40.7484, lng: -73.9857, duration: 90 },
      { title: "Times Square", description: "Bright lights, theaters, and massive digital billboards.", vibe: Vibe.ADVENTURE, lat: 40.758, lng: -73.9855, duration: 60 },
      { title: "The Metropolitan Museum of Art", description: "One of the world's greatest art institutions.", vibe: Vibe.CULTURAL, lat: 40.7794, lng: -73.9632, duration: 240 },
      { title: "Chelsea Market", description: "Food hall with diverse culinary options.", vibe: Vibe.FOODIE, lat: 40.7423, lng: -74.0062, duration: 120 },
      { title: "Brooklyn Bridge Walk", description: "Iconic walk with views of the Manhattan skyline.", vibe: Vibe.RELAXED, lat: 40.7061, lng: -73.9969, duration: 90 },
      { title: "High Line Park", description: "Elevated park built on a former rail line.", vibe: Vibe.RELAXED, lat: 40.748, lng: -74.0048, duration: 120 },
      { title: "Joe's Pizza", description: "Legendary NYC slice shop.", vibe: Vibe.FOODIE, lat: 40.7305, lng: -74.0021, duration: 30 },
    ],
  },
  {
    name: "London",
    description: "A global city where history meets contemporary lifestyle.",
    lat: 51.5074,
    lng: -0.1278,
    tags: ["history", "royal", "museums"],
    activities: [
      { title: "British Museum", description: "Dedicated to human history, art, and culture.", vibe: Vibe.CULTURAL, lat: 51.5194, lng: -0.127, duration: 180 },
      { title: "London Eye", description: "Giant ferris wheel on the South Bank of the River Thames.", vibe: Vibe.RELAXED, lat: 51.5033, lng: -0.1195, duration: 60 },
      { title: "Tower of London", description: "Historic castle and home to the Crown Jewels.", vibe: Vibe.CULTURAL, lat: 51.5081, lng: -0.0759, duration: 150 },
      { title: "Borough Market", description: "London's most renowned food and drink market.", vibe: Vibe.FOODIE, lat: 51.5055, lng: -0.0905, duration: 120 },
      { title: "Hyde Park", description: "One of London's eight Royal Parks.", vibe: Vibe.RELAXED, lat: 51.5073, lng: -0.1657, duration: 180 },
      { title: "West End Show", description: "World-class theater and musicals.", vibe: Vibe.CULTURAL, lat: 51.5113, lng: -0.13, duration: 180 },
      { title: "Soho Pub Crawl", description: "Discover the vibrant nightlife and history of Soho.", vibe: Vibe.FOODIE, lat: 51.5136, lng: -0.132, duration: 180 },
      { title: "Thames Speedboat Tour", description: "Adrenaline-fueled tour along the river.", vibe: Vibe.ADVENTURE, lat: 51.505, lng: -0.11, duration: 60 },
    ],
  },
  {
    name: "Rome",
    description: "The Eternal City, treasure trove of ancient history.",
    lat: 41.9028,
    lng: 12.4964,
    tags: ["history", "ancient", "food"],
    activities: [
      { title: "Colosseum", description: "The largest ancient amphitheater ever built.", vibe: Vibe.CULTURAL, lat: 41.8902, lng: 12.4922, duration: 120 },
      { title: "Vatican Museums", description: "House immense art collections and the Sistine Chapel.", vibe: Vibe.CULTURAL, lat: 41.9067, lng: 12.4539, duration: 240 },
      { title: "Trevi Fountain", description: "Masterpiece of Baroque design.", vibe: Vibe.RELAXED, lat: 41.9009, lng: 12.4833, duration: 30 },
      { title: "Trastevere Food Tour", description: "Sample authentic Roman pasta and gelato.", vibe: Vibe.FOODIE, lat: 41.8893, lng: 12.4704, duration: 180 },
      { title: "Pantheon", description: "Best-preserved monument from ancient Rome.", vibe: Vibe.CULTURAL, lat: 41.8986, lng: 12.4769, duration: 60 },
      { title: "Villa Borghese Gardens", description: "A large landscape garden in Rome.", vibe: Vibe.RELAXED, lat: 41.9131, lng: 12.4862, duration: 120 },
      { title: "Piazza Navona", description: "Experience the lively atmosphere and street performers.", vibe: Vibe.RELAXED, lat: 41.8992, lng: 12.4731, duration: 60 },
      { title: "Roman Forum", description: "Heart of the ancient Roman Empire.", vibe: Vibe.ADVENTURE, lat: 41.892, lng: 12.4853, duration: 120 },
    ],
  },
  {
    name: "Barcelona",
    description: "Famous for Gaudí architecture and beautiful beaches.",
    lat: 41.3851,
    lng: 2.1734,
    tags: ["beach", "art", "architecture"],
    activities: [
      { title: "Sagrada Família", description: "Architectural masterpiece by Antoni Gaudí.", vibe: Vibe.CULTURAL, lat: 41.4036, lng: 2.1744, duration: 120 },
      { title: "Park Güell", description: "Whimsical park with colorful mosaics and city views.", vibe: Vibe.RELAXED, lat: 41.4145, lng: 2.1527, duration: 120 },
      { title: "La Rambla", description: "Lively pedestrian boulevard in the city center.", vibe: Vibe.ADVENTURE, lat: 41.3817, lng: 2.1717, duration: 90 },
      { title: "Barceloneta Beach", description: "Popular spot for sunbathing and seafood.", vibe: Vibe.RELAXED, lat: 41.3789, lng: 2.1925, duration: 180 },
      { title: "La Boqueria Market", description: "Vibrant food market with fresh local produce.", vibe: Vibe.FOODIE, lat: 41.3813, lng: 2.1715, duration: 90 },
      { title: "Gothic Quarter Walk", description: "Explore the narrow medieval streets.", vibe: Vibe.CULTURAL, lat: 41.3833, lng: 2.1764, duration: 120 },
      { title: "Tapas Discovery Tour", description: "Taste the best tapas and wine in El Born.", vibe: Vibe.FOODIE, lat: 41.385, lng: 2.18, duration: 180 },
      { title: "Montjuïc Magic Fountain", description: "Spectacular light and water show.", vibe: Vibe.RELAXED, lat: 41.371, lng: 2.15, duration: 60 },
    ],
  },
  {
    name: "Bali",
    description: "Indonesian island known for forested volcanic mountains and beaches.",
    lat: -8.3405,
    lng: 115.092,
    tags: ["beach", "spiritual", "nature"],
    activities: [
      { title: "Ubud Monkey Forest", description: "Sacred sanctuary for long-tailed macaques.", vibe: Vibe.ADVENTURE, lat: -8.519, lng: 115.2606, duration: 120 },
      { title: "Tegalalang Rice Terrace", description: "Stunning tiered landscape with lush greenery.", vibe: Vibe.RELAXED, lat: -8.4328, lng: 115.279, duration: 90 },
      { title: "Tanah Lot Temple", description: "Ancient Hindu shrine perched on a rock.", vibe: Vibe.CULTURAL, lat: -8.6111, lng: 115.0869, duration: 120 },
      { title: "Seminyak Beach Sunset", description: "Relax with a drink on the sandy shore.", vibe: Vibe.RELAXED, lat: -8.6948, lng: 115.1557, duration: 120 },
      { title: "Balinese Cooking Class", description: "Learn the secrets of traditional Balinese spices.", vibe: Vibe.FOODIE, lat: -8.5069, lng: 115.2625, duration: 240 },
      { title: "Mount Batur Sunrise Hike", description: "Challenging hike with rewarding volcanic views.", vibe: Vibe.ADVENTURE, lat: -8.242, lng: 115.375, duration: 300 },
      { title: "Tirta Empul Holy Water Temple", description: "Experience a spiritual purification ritual.", vibe: Vibe.CULTURAL, lat: -8.411, lng: 115.289, duration: 90 },
      { title: "Surf Lesson in Kuta", description: "Catch your first waves on Bali's famous break.", vibe: Vibe.ADVENTURE, lat: -8.718, lng: 115.168, duration: 120 },
    ],
  },
  {
    name: "Kyoto",
    description: "Former imperial capital of Japan, famous for temples and gardens.",
    lat: 35.0116,
    lng: 135.7556,
    tags: ["zen", "culture", "tradition"],
    activities: [
      { title: "Fushimi Inari-taisha", description: "Iconic shrine with thousands of vermilion torii gates.", vibe: Vibe.CULTURAL, lat: 34.9671, lng: 135.7727, duration: 180 },
      { title: "Kinkaku-ji (Golden Pavilion)", description: "Zen temple covered in gold leaf.", vibe: Vibe.CULTURAL, lat: 35.0394, lng: 135.7292, duration: 90 },
      { title: "Arashiyama Bamboo Grove", description: "Wander through a tranquil path of towering bamboo.", vibe: Vibe.RELAXED, lat: 35.0175, lng: 135.6713, duration: 60 },
      { title: "Nishiki Market", description: "Kyoto's 'Kitchen', selling exotic food and ingredients.", vibe: Vibe.FOODIE, lat: 35.005, lng: 135.7649, duration: 120 },
      { title: "Gion District Evening Walk", description: "Spot geisha in the traditional tea house district.", vibe: Vibe.RELAXED, lat: 35.003, lng: 135.775, duration: 120 },
      { title: "Tea Ceremony Experience", description: "Ritualized preparation and drinking of green tea.", vibe: Vibe.CULTURAL, lat: 35.0, lng: 135.76, duration: 90 },
      { title: "Philosopher's Path", description: "Pedestrian path that follows a cherry-tree-lined canal.", vibe: Vibe.RELAXED, lat: 35.02, lng: 135.79, duration: 60 },
      { title: "Kaiseki Dinner", description: "Multi-course traditional Japanese haute cuisine.", vibe: Vibe.FOODIE, lat: 35.01, lng: 135.77, duration: 180 },
    ],
  },
  {
    name: "Santorini",
    description: "Greek island known for its whitewashed villages and blue domes.",
    lat: 36.3932,
    lng: 25.4615,
    tags: ["island", "romantic", "view"],
    activities: [
      { title: "Oia Sunset View", description: "Watch the sun dip below the horizon from Oia.", vibe: Vibe.RELAXED, lat: 36.4618, lng: 25.3753, duration: 120 },
      { title: "Akrotiri Archaeological Site", description: "Prehistoric city preserved in volcanic ash.", vibe: Vibe.CULTURAL, lat: 36.3512, lng: 25.4039, duration: 120 },
      { title: "Red Beach Hike", description: "Unique beach with red volcanic sands.", vibe: Vibe.ADVENTURE, lat: 36.3473, lng: 25.395, duration: 90 },
      { title: "Santo Wines Tasting", description: "Sip local wine with caldera views.", vibe: Vibe.FOODIE, lat: 36.386, lng: 25.432, duration: 120 },
      { title: "Catamaran Sailing Cruise", description: "Sail around the volcano and soak in hot springs.", vibe: Vibe.ADVENTURE, lat: 36.4, lng: 25.4, duration: 300 },
      { title: "Pyrgos Village Exploration", description: "Charming traditional village without the crowds.", vibe: Vibe.RELAXED, lat: 36.3838, lng: 25.4484, duration: 120 },
      { title: "Cooking Class in a Cave House", description: "Learn to make tomato fritters and moussaka.", vibe: Vibe.FOODIE, lat: 36.39, lng: 25.45, duration: 180 },
      { title: "Fira to Oia Hike", description: "Iconic hiking trail along the caldera ridge.", vibe: Vibe.ADVENTURE, lat: 36.417, lng: 25.43, duration: 180 },
    ],
  },
  {
    name: "Dubai",
    description: "Luxury shopping, ultramodern architecture, and lively nightlife.",
    lat: 25.2048,
    lng: 55.2708,
    tags: ["luxury", "desert", "modern"],
    activities: [
      { title: "Burj Khalifa At the Top", description: "World's tallest building with observation deck.", vibe: Vibe.CULTURAL, lat: 25.1972, lng: 55.2744, duration: 90 },
      { title: "Desert Safari & Dune Bashing", description: "Thrill-ride in the sand followed by BBQ dinner.", vibe: Vibe.ADVENTURE, lat: 24.8, lng: 55.4, duration: 360 },
      { title: "Dubai Mall Aquarium", description: "One of the largest suspended aquariums in the world.", vibe: Vibe.RELAXED, lat: 25.1985, lng: 55.2796, duration: 120 },
      { title: "Palm Jumeirah Helicopter Tour", description: "Aerial view of the man-made islands.", vibe: Vibe.ADVENTURE, lat: 25.12, lng: 55.13, duration: 30 },
      { title: "Gold & Spice Souk", description: "Traditional markets with spices and jewelry.", vibe: Vibe.CULTURAL, lat: 25.2672, lng: 55.2973, duration: 120 },
      { title: "Fine Dining at Burj Al Arab", description: "Experience luxury at the world's only 7-star hotel.", vibe: Vibe.FOODIE, lat: 25.1412, lng: 55.1852, duration: 180 },
      { title: "Global Village", description: "Cultural, entertainment and shopping destination.", vibe: Vibe.CULTURAL, lat: 25.068, lng: 55.303, duration: 240 },
      { title: "Kite Beach", description: "Trendy beach with food trucks and water sports.", vibe: Vibe.RELAXED, lat: 25.16, lng: 55.2, duration: 180 },
    ],
  },
  {
    name: "Singapore",
    description: "A city-state known for its cleanliness, food, and modern technology.",
    lat: 1.3521,
    lng: 103.8198,
    tags: ["city", "food", "tech"],
    activities: [
      { title: "Gardens by the Bay", description: "Futuristic park featuring Supertree Grove.", vibe: Vibe.CULTURAL, lat: 1.2816, lng: 103.8636, duration: 180 },
      { title: "Marina Bay Sands Skypark", description: "Iconic hotel with a massive rooftop infinity pool.", vibe: Vibe.RELAXED, lat: 1.2839, lng: 103.8609, duration: 60 },
      { title: "Hawker Center Food Tour", description: "Sample Michelin-star street food like chili crab.", vibe: Vibe.FOODIE, lat: 1.2806, lng: 103.8448, duration: 150 },
      { title: "Sentosa Island Adventure", description: "Universal Studios and adventure parks.", vibe: Vibe.ADVENTURE, lat: 1.2494, lng: 103.8303, duration: 360 },
      { title: "Cloud Forest & Flower Dome", description: "Spectacular glass greenhouses.", vibe: Vibe.RELAXED, lat: 1.284, lng: 103.865, duration: 120 },
      { title: "Night Safari", description: "World's first nocturnal wildlife park.", vibe: Vibe.ADVENTURE, lat: 1.402, lng: 103.788, duration: 180 },
      { title: "Chinatown Heritage Walk", description: "Discover the history of the early immigrants.", vibe: Vibe.CULTURAL, lat: 1.282, lng: 103.844, duration: 120 },
      { title: "Little India Spice Exploration", description: "Immerse in the colors and scents of Little India.", vibe: Vibe.FOODIE, lat: 1.306, lng: 103.85, duration: 120 },
    ],
  },
  {
    name: "Sydney",
    description: "Vibrant city with a spectacular harbor and surf beaches.",
    lat: -33.8688,
    lng: 151.2093,
    tags: ["harbor", "beach", "city"],
    activities: [
      { title: "Sydney Opera House Tour", description: "Go behind the scenes of the world-famous venue.", vibe: Vibe.CULTURAL, lat: -33.8568, lng: 151.2153, duration: 60 },
      { title: "Bondi to Coogee Coastal Walk", description: "Stunning cliff-top walk past several beaches.", vibe: Vibe.RELAXED, lat: -33.891, lng: 151.276, duration: 120 },
      { title: "Sydney Harbour Bridge Climb", description: "Breathtaking views from the top of the bridge.", vibe: Vibe.ADVENTURE, lat: -33.8523, lng: 151.2108, duration: 180 },
      { title: "Fish Market Feast", description: "Indulge in the freshest seafood at Pyrmont.", vibe: Vibe.FOODIE, lat: -33.8732, lng: 151.1915, duration: 90 },
      { title: "Manly Beach Ferry Trip", description: "Scenic ferry ride from Circular Quay.", vibe: Vibe.RELAXED, lat: -33.854, lng: 151.214, duration: 30 },
      { title: "Royal Botanic Garden", description: "Harborside garden with diverse plant life.", vibe: Vibe.RELAXED, lat: -33.864, lng: 151.216, duration: 120 },
      { title: "Surry Hills Food Safari", description: "Explore the trendiest cafes and restaurants.", vibe: Vibe.FOODIE, lat: -33.886, lng: 151.212, duration: 180 },
      { title: "Taronga Zoo", description: "Zoo with incredible views across Sydney Harbour.", vibe: Vibe.ADVENTURE, lat: -33.843, lng: 151.241, duration: 240 },
    ],
  },
  {
    name: "Cape Town",
    description: "Breathtaking city where the mountains meet the ocean.",
    lat: -33.9249,
    lng: 18.4241,
    tags: ["nature", "ocean", "adventure"],
    activities: [
      { title: "Table Mountain Cableway", description: "Aerial ride to the flat-topped mountain peak.", vibe: Vibe.ADVENTURE, lat: -33.9533, lng: 18.4032, duration: 120 },
      { title: "Cape Point & Cape of Good Hope", description: "Dramatic peninsula at the tip of Africa.", vibe: Vibe.CULTURAL, lat: -34.3582, lng: 18.4975, duration: 300 },
      { title: "Boulders Beach Penguins", description: "Get close to a colony of African penguins.", vibe: Vibe.RELAXED, lat: -34.1973, lng: 18.4513, duration: 90 },
      { title: "Stellenbosch Wine Tour", description: "Visit historic wine estates for tastings.", vibe: Vibe.FOODIE, lat: -33.9321, lng: 18.8602, duration: 360 },
      { title: "V&A Waterfront", description: "Lively hub for shopping, dining, and museums.", vibe: Vibe.RELAXED, lat: -33.906, lng: 18.42, duration: 180 },
      { title: "Robben Island Museum", description: "Nelson Mandela's former prison.", vibe: Vibe.CULTURAL, lat: -33.807, lng: 18.371, duration: 210 },
      { title: "Bo-Kaap Cultural Walk", description: "Exploration of the colorful Malay Quarter.", vibe: Vibe.CULTURAL, lat: -33.921, lng: 18.411, duration: 90 },
      { title: "Kirstenbosch Botanical Gardens", description: "World-renowned gardens at the foot of the mountain.", vibe: Vibe.RELAXED, lat: -33.99, lng: 18.43, duration: 120 },
    ],
  },
  {
    name: "Rio de Janeiro",
    description: "Enchanting city famous for Carnival, samba, and iconic landmarks.",
    lat: -22.9068,
    lng: -43.1729,
    tags: ["beach", "party", "landscape"],
    activities: [
      { title: "Christ the Redeemer", description: "Giant statue atop Mount Corcovado.", vibe: Vibe.CULTURAL, lat: -22.9519, lng: -43.2105, duration: 120 },
      { title: "Sugarloaf Mountain Cable Car", description: "Panoramic views from the granite peaks.", vibe: Vibe.RELAXED, lat: -22.9486, lng: -43.1559, duration: 120 },
      { title: "Copacabana Beach Break", description: "Sip caipirinhas on the world-famous sand.", vibe: Vibe.RELAXED, lat: -22.9698, lng: -43.184, duration: 180 },
      { title: "Churrascaria Dinner", description: "All-you-can-eat Brazilian steakhouse feast.", vibe: Vibe.FOODIE, lat: -22.983, lng: -43.192, duration: 120 },
      { title: "Favela Santa Marta Tour", description: "Educational community-led walking tour.", vibe: Vibe.CULTURAL, lat: -22.946, lng: -43.194, duration: 150 },
      { title: "Samba Class in Lapa", description: "Learn local dance moves in a historic neighborhood.", vibe: Vibe.ADVENTURE, lat: -22.913, lng: -43.18, duration: 90 },
      { title: "Tijuca National Forest Hike", description: "Explore the world's largest urban forest.", vibe: Vibe.ADVENTURE, lat: -22.95, lng: -43.28, duration: 240 },
      { title: "Escadaria Selarón", description: "Famous steps covered in vibrant tiles.", vibe: Vibe.CULTURAL, lat: -22.915, lng: -43.179, duration: 60 },
    ],
  },
  {
    name: "Amsterdam",
    description: "Artistic heritage, elaborate canal system, and narrow houses.",
    lat: 52.3676,
    lng: 4.9041,
    tags: ["canal", "art", "cycling"],
    activities: [
      { title: "Rijksmuseum", description: "Dutch national museum dedicated to arts and history.", vibe: Vibe.CULTURAL, lat: 52.3599, lng: 4.8852, duration: 180 },
      { title: "Anne Frank House", description: "Biographical museum dedicated to Anne Frank.", vibe: Vibe.CULTURAL, lat: 52.3752, lng: 4.884, duration: 90 },
      { title: "Canal Boat Cruise", description: "Discover the city from its famous waterways.", vibe: Vibe.RELAXED, lat: 52.373, lng: 4.893, duration: 75 },
      { title: "Jordaan District Food Tour", description: "Taste herring, cheese, and apple pie.", vibe: Vibe.FOODIE, lat: 52.376, lng: 4.882, duration: 150 },
      { title: "Vondelpark Cycling", description: "Rent a bike and ride through the city's green lung.", vibe: Vibe.RELAXED, lat: 52.358, lng: 4.868, duration: 120 },
      { title: "Van Gogh Museum", description: "Largest collection of works by Vincent van Gogh.", vibe: Vibe.CULTURAL, lat: 52.358, lng: 4.881, duration: 120 },
      { title: "Heineken Experience", description: "Interactive tour in the historic brewery.", vibe: Vibe.ADVENTURE, lat: 52.357, lng: 4.891, duration: 90 },
      { title: "Cheese Tasting at Henri Willig", description: "Sample famous Dutch Gouda and Edam.", vibe: Vibe.FOODIE, lat: 52.37, lng: 4.9, duration: 60 },
    ],
  },
  {
    name: "Venice",
    description: "City built on more than 100 small islands in a lagoon.",
    lat: 45.4408,
    lng: 12.3155,
    tags: ["canal", "romantic", "history"],
    activities: [
      { title: "St. Mark's Basilica", description: "The most famous of the city's churches.", vibe: Vibe.CULTURAL, lat: 45.4345, lng: 12.3397, duration: 90 },
      { title: "Gondola Ride", description: "Traditional Venetian rowboat through the narrow canals.", vibe: Vibe.RELAXED, lat: 45.435, lng: 12.337, duration: 45 },
      { title: "Doge's Palace", description: "Masterpiece of Gothic architecture and former seat of power.", vibe: Vibe.CULTURAL, lat: 45.4337, lng: 12.3404, duration: 120 },
      { title: "Cicchetti Food Crawl", description: "Eat like a local at traditional wine bars called bàcari.", vibe: Vibe.FOODIE, lat: 45.441, lng: 12.33, duration: 180 },
      { title: "Murano & Burano Island Trip", description: "Famous for glassblowing and colorful houses.", vibe: Vibe.RELAXED, lat: 45.45, lng: 12.35, duration: 300 },
      { title: "Rialto Market Exploration", description: "Lively central market for food and fish.", vibe: Vibe.FOODIE, lat: 45.441, lng: 12.336, duration: 90 },
      { title: "Peggy Guggenheim Collection", description: "Modern art museum on the Grand Canal.", vibe: Vibe.CULTURAL, lat: 45.43, lng: 12.33, duration: 120 },
      { title: "Bell Tower Climb (Campanile)", description: "Tallest structure in Venice with great views.", vibe: Vibe.RELAXED, lat: 45.434, lng: 12.339, duration: 45 },
    ],
  },
  {
    name: "Prague",
    description: "The city of a hundred spires, known for its Old Town Square.",
    lat: 50.0755,
    lng: 14.4378,
    tags: ["history", "architecture", "beer"],
    activities: [
      { title: "Prague Castle", description: "Largest ancient castle complex in the world.", vibe: Vibe.CULTURAL, lat: 50.0911, lng: 14.4016, duration: 180 },
      { title: "Charles Bridge Walk", description: "Historic bridge lined with 30 baroque statues.", vibe: Vibe.RELAXED, lat: 50.0865, lng: 14.4114, duration: 60 },
      { title: "Czech Beer Tasting Tour", description: "Sample the world's best pilsner at historic pubs.", vibe: Vibe.FOODIE, lat: 50.083, lng: 14.42, duration: 180 },
      { title: "Astronomy Clock Show", description: "Mediaeval clock in Old Town Square.", vibe: Vibe.CULTURAL, lat: 50.087, lng: 14.421, duration: 30 },
      { title: "Vltava River Cruise", description: "Relaxing sightseeing tour past the Castle and Bridge.", vibe: Vibe.RELAXED, lat: 50.09, lng: 14.415, duration: 60 },
      { title: "Jewish Quarter Exploration", description: "History of the Jewish community in Prague.", vibe: Vibe.CULTURAL, lat: 50.089, lng: 14.417, duration: 120 },
      { title: "Letná Park Sunset Beer", description: "Best views of Prague's bridges with a drink.", vibe: Vibe.RELAXED, lat: 50.094, lng: 14.416, duration: 120 },
      { title: "Lennon Wall Visit", description: "Symbol of peace and love with graffiti.", vibe: Vibe.RELAXED, lat: 50.086, lng: 14.407, duration: 30 },
    ],
  },
  {
    name: "Lisbon",
    description: "Hilly, coastal capital city known for its fado music.",
    lat: 38.7223,
    lng: -9.1393,
    tags: ["hilly", "tiles", "food"],
    activities: [
      { title: "Belem Tower", description: "Fortified tower and icon of Portuguese discovery.", vibe: Vibe.CULTURAL, lat: 38.6916, lng: -9.216, duration: 90 },
      { title: "Pastéis de Belém", description: "Taste the original custard tart.", vibe: Vibe.FOODIE, lat: 38.6975, lng: -9.2032, duration: 45 },
      { title: "Tram 28 Ride", description: "Historic tram route through Alfama's narrow streets.", vibe: Vibe.ADVENTURE, lat: 38.711, lng: -9.135, duration: 60 },
      { title: "Fado Dinner Experience", description: "Traditional Portuguese meal with folk music.", vibe: Vibe.FOODIE, lat: 38.712, lng: -9.128, duration: 180 },
      { title: "LX Factory", description: "Creative industrial hub with eclectic shops.", vibe: Vibe.RELAXED, lat: 38.703, lng: -9.179, duration: 120 },
      { title: "Sintra Day Trip", description: "Fairytale palaces and misty mountains.", vibe: Vibe.ADVENTURE, lat: 38.799, lng: -9.387, duration: 480 },
      { title: "Castelo de S. Jorge", description: "Moorish castle overlooking the city.", vibe: Vibe.CULTURAL, lat: 38.713, lng: -9.133, duration: 120 },
      { title: "MAAT Museum", description: "Art, Architecture and Technology on the Tejo river.", vibe: Vibe.CULTURAL, lat: 38.696, lng: -9.193, duration: 120 },
    ],
  },
  {
    name: "Bangkok",
    description: "Thailand's capital, known for ornate shrines and vibrant street life.",
    lat: 13.7563,
    lng: 100.5018,
    tags: ["streetfood", "temple", "energy"],
    activities: [
      { title: "The Grand Palace", description: "Official residence of the Kings of Siam.", vibe: Vibe.CULTURAL, lat: 13.75, lng: 100.4913, duration: 180 },
      { title: "Wat Arun (Temple of Dawn)", description: "Stunning ceramic-encrusted temple by the river.", vibe: Vibe.CULTURAL, lat: 13.7437, lng: 100.4889, duration: 90 },
      { title: "Chatuchak Weekend Market", description: "One of the world's largest outdoor markets.", vibe: Vibe.ADVENTURE, lat: 13.7999, lng: 100.5505, duration: 240 },
      { title: "Street Food Tour in Sukhumvit", description: "Explore hidden gems of Thai cuisine.", vibe: Vibe.FOODIE, lat: 13.736, lng: 100.56, duration: 180 },
      { title: "Lumpini Park Relaxation", description: "A green oasis in the middle of concrete jungle.", vibe: Vibe.RELAXED, lat: 13.73, lng: 100.54, duration: 120 },
      { title: "Chao Phraya River Boat", description: "Public ferry or private charter.", vibe: Vibe.RELAXED, lat: 13.75, lng: 100.49, duration: 60 },
      { title: "Muay Thai Match", description: "Experience the national sport live.", vibe: Vibe.ADVENTURE, lat: 13.7, lng: 100.5, duration: 180 },
      { title: "Sky Bar Rooftop experience", description: "Drinks with panoramic city views.", vibe: Vibe.RELAXED, lat: 13.72, lng: 100.52, duration: 120 },
    ],
  },
  {
    name: "Istanbul",
    description: "Transcontinental city straddling Europe and Asia across the Bosphorus Strait.",
    lat: 41.0082,
    lng: 28.9784,
    tags: ["history", "culture", "spices"],
    activities: [
      { title: "Hagia Sophia", description: "Masterpiece of Byzantine architecture.", vibe: Vibe.CULTURAL, lat: 41.0085, lng: 28.9799, duration: 120 },
      { title: "Blue Mosque", description: "Iconic mosque known for its blue tiles and minarets.", vibe: Vibe.CULTURAL, lat: 41.0054, lng: 28.9768, duration: 60 },
      { title: "Grand Bazaar Shopping", description: "One of the oldest and largest covered markets.", vibe: Vibe.ADVENTURE, lat: 41.0101, lng: 28.968, duration: 180 },
      { title: "Bosphorus Sunset Cruise", description: "Sail between two continents as the sky changes color.", vibe: Vibe.RELAXED, lat: 41.01, lng: 28.98, duration: 120 },
      { title: "Karakoy Street Food Walk", description: "Sample Simit, Balik Ekmek, and Baklava.", vibe: Vibe.FOODIE, lat: 41.02, lng: 28.975, duration: 180 },
      { title: "Topkapi Palace Museum", description: "Former residence of the Ottoman Sultans.", vibe: Vibe.CULTURAL, lat: 41.011, lng: 28.983, duration: 180 },
      { title: "Galata Tower Views", description: "Genoese tower with a 360-degree panorama.", vibe: Vibe.RELAXED, lat: 41.025, lng: 28.974, duration: 60 },
      { title: "Turkish Hammam Session", description: "Traditional bath and scrub experience.", vibe: Vibe.RELAXED, lat: 41.009, lng: 28.97, duration: 90 },
    ],
  },
];

async function main() {
  console.log("Seeding destinations and activities...");

  for (const dest of destinations) {
    const { activities, ...destData } = dest;
    const destination = await prisma.destination.upsert({
      where: { name: destData.name },
      update: {},
      create: {
        ...destData,
      },
    });

    // Clear existing activities to avoid duplicates on re-run
    await prisma.activity.deleteMany({
      where: { destinationId: destination.id },
    });

    for (const activity of activities) {
      await prisma.activity.create({
        data: {
          ...activity,
          destinationId: destination.id,
        },
      });
    }

  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
