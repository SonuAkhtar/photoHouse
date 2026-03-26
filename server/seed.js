require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Trip = require("./models/Trip");
const Profile = require("./models/Profile");

const p = (seed, w = 1600, h = 900) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const TRIPS = [
  {
    place: "Santorini",
    region: "Cyclades · Greece",
    dates: "June 14 – 21, 2024",
    summary:
      "Whitewashed walls tumbling down volcanic cliffs, the Aegean stretching out in every shade of blue. We chased sunsets from Oia each evening, watching the caldera light up like a slow ember. The donkey paths, the narrow alleys piled high with bougainvillea — nothing prepares you for how genuinely beautiful it is.",
    accent: "#89B4C8",
    tags: ["landscape", "architecture", "sunset"],
    photos: [
      { seed: "santorini1", caption: "Oia at golden hour" },
      { seed: "santorini2", caption: "Caldera view from our terrace" },
      { seed: "santorini3", caption: "Blue-domed churches of Fira" },
      { seed: "santorini4", caption: "Cliff-side path at dusk" },
      { seed: "santorini5", caption: "Sunrise over the volcanic rim" },
    ],
  },
  {
    place: "Kyoto",
    region: "Kansai · Japan",
    dates: "March 28 – April 6, 2024",
    summary:
      "Cherry blossoms carpeted the banks of the Kamo River and the temple gardens looked like paintings. We rose at 5am every morning to beat the crowds to Fushimi Inari, hiking the thousand torii gates in near silence. The tea ceremony, the moss garden at Saiho-ji, the wooden machiya townhouses — Kyoto gave us a week that felt like a month.",
    accent: "#D4A0B0",
    tags: ["culture", "street", "sakura"],
    photos: [
      { seed: "kyoto1", caption: "Fushimi Inari at dawn" },
      { seed: "kyoto2", caption: "Cherry blossoms along Philosopher's Path" },
      { seed: "kyoto3", caption: "Arashiyama bamboo grove" },
      { seed: "kyoto4", caption: "Kinkaku-ji reflected in the mirror pond" },
      { seed: "kyoto5", caption: "Gion district at twilight" },
      { seed: "kyoto6", caption: "Tea ceremony at Urasenke" },
    ],
  },
  {
    place: "Marrakech",
    region: "Haouz · Morocco",
    dates: "October 3 – 10, 2023",
    summary:
      "The medina hits you like a wall of sensation — spice merchants, leather tanneries, the smell of cedar and cumin drifting through narrow souks. We got deliberately lost each afternoon, finding riads that opened onto hidden courtyards, stumbling on squares full of musicians and storytellers. The Atlas Mountains rose purple at every sunset beyond the rooftops.",
    accent: "#E8B87A",
    tags: ["street", "culture", "architecture"],
    photos: [
      { seed: "marrakech1", caption: "Chouara tanneries from above" },
      { seed: "marrakech2", caption: "Djemaa el-Fna at night" },
      { seed: "marrakech3", caption: "Majorelle Garden" },
      { seed: "marrakech4", caption: "Souk spice stalls" },
      { seed: "marrakech5", caption: "Riad courtyard tiles" },
    ],
  },
  {
    place: "Patagonia",
    region: "Los Lagos · Chile",
    dates: "January 12 – 25, 2023",
    summary:
      "Three weeks at the end of the world. Torres del Paine threw everything at us — blizzard one morning, blinding sunlight the next, the W Trek stretching through landscapes that felt borrowed from another planet. The granite towers turned shades of rose and amber at sunrise that I still can't quite believe I saw.",
    accent: "#7ABAB0",
    tags: ["landscape", "trekking", "wilderness"],
    photos: [
      { seed: "patagonia1", caption: "Torres del Paine at sunrise" },
      { seed: "patagonia2", caption: "Grey Glacier from the moraine" },
      { seed: "patagonia3", caption: "Condor above Valle del Francés" },
      { seed: "patagonia4", caption: "Lago Nordenskjöld" },
      { seed: "patagonia5", caption: "Camp at Mirador Las Torres" },
      { seed: "patagonia6", caption: "Pehoe Lake at golden hour" },
      { seed: "patagonia7", caption: "End-of-trail celebration" },
    ],
  },
  {
    place: "Varanasi",
    region: "Uttar Pradesh · India",
    dates: "February 4 – 10, 2023",
    summary:
      "No city prepares you for Varanasi. We arrived at the ghats before dawn, watching the Ganga reflect a thousand flames from the morning aarti. The old city is a labyrinth of temples and chai stalls and silk weavers working by lamplight. It is overwhelming in every sense — and completely impossible to forget.",
    accent: "#C87D5A",
    tags: ["street", "culture", "portrait"],
    photos: [
      { seed: "varanasi1", caption: "Ganga Aarti at Dashashwamedh Ghat" },
      { seed: "varanasi2", caption: "Morning bathers at sunrise" },
      { seed: "varanasi3", caption: "Silk weaver in the old city" },
      { seed: "varanasi4", caption: "Burning ghats at dusk" },
      { seed: "varanasi5", caption: "Children playing near the river" },
    ],
  },
  {
    place: "Iceland",
    region: "Suðurland · Iceland",
    dates: "August 15 – 24, 2022",
    summary:
      "We drove the Ring Road in eight days, stopping wherever the light demanded it. Skógafoss at 11pm in continuous daylight, Jökulsárlón with icebergs grinding slowly toward the sea, the black sand beaches of Reynisfjara with their basalt organ pipes. The whole island felt like a geology lesson with extraordinary photography thrown in.",
    accent: "#8BA8B4",
    tags: ["landscape", "wilderness", "long-exposure"],
    photos: [
      { seed: "iceland1", caption: "Skógafoss in midnight sun" },
      { seed: "iceland2", caption: "Jökulsárlón glacier lagoon" },
      { seed: "iceland3", caption: "Reynisfjara black sand beach" },
      { seed: "iceland4", caption: "Seljalandsfoss behind the falls" },
      { seed: "iceland5", caption: "Lupine fields near Kirkjubæjarklaustur" },
      { seed: "iceland6", caption: "Fjaðrárgljúfur canyon at dawn" },
    ],
  },
  {
    place: "Havana",
    region: "La Habana · Cuba",
    dates: "November 5 – 13, 2022",
    summary:
      "Havana is a city that time has preserved in the most photogenic way imaginable. Peeling baroque facades, 1950s American cars in Technicolor, salsa spilling out of every doorway. We spent our mornings in Habana Vieja photographing the street life, afternoons in El Malecón watching the waves crash, evenings in jazz bars that stretched into the small hours.",
    accent: "#E8A05C",
    tags: ["street", "portrait", "architecture"],
    photos: [
      { seed: "havana1", caption: "Vintage cars on Paseo del Prado" },
      { seed: "havana2", caption: "Habana Vieja doorway portraits" },
      { seed: "havana3", caption: "El Malecón at sunset" },
      { seed: "havana4", caption: "Tobacco farmer, Viñales" },
      { seed: "havana5", caption: "Jazz musician in Habana Vieja" },
    ],
  },
  {
    place: "Amalfi Coast",
    region: "Campania · Italy",
    dates: "July 8 – 16, 2022",
    summary:
      "The road clings to the cliffs like an afterthought. We hired a small motorboat one afternoon and saw the whole coast from the sea — Positano stacked like a wedding cake, Ravello perched impossibly high, lemons the size of grapefruits at every roadside stall. We ate too much pasta. We regret nothing.",
    accent: "#7DAF6E",
    tags: ["landscape", "architecture", "food"],
    photos: [
      { seed: "amalfi1", caption: "Positano from the sea" },
      { seed: "amalfi2", caption: "Ravello gardens above the coast" },
      { seed: "amalfi3", caption: "Cliffside lemon groves" },
      { seed: "amalfi4", caption: "Fishing boats at Atrani" },
      { seed: "amalfi5", caption: "Sunset from Villa Rufolo" },
      { seed: "amalfi6", caption: "Pathway to Furore fjord" },
    ],
  },
  {
    place: "Bali",
    region: "Bali · Indonesia",
    dates: "September 1 – 14, 2021",
    summary:
      "The terraced rice paddies of Tegallalang at dawn, the surf breaks of Uluwatu at dusk, temples draped in incense smoke on every corner. We spent a week in Ubud learning to slow down and a week on the Bukit Peninsula learning to surf badly. The offerings left on doorsteps each morning became a quiet ritual we looked forward to.",
    accent: "#5E9E8F",
    tags: ["landscape", "culture", "wildlife"],
    photos: [
      { seed: "bali1", caption: "Tegallalang rice terraces at sunrise" },
      { seed: "bali2", caption: "Tanah Lot temple at low tide" },
      { seed: "bali3", caption: "Ubud monkey forest" },
      { seed: "bali4", caption: "Uluwatu cliff temple at sunset" },
      { seed: "bali5", caption: "Traditional Kecak dance" },
      { seed: "bali6", caption: "Jatiluwih rice paddies" },
    ],
  },
  {
    place: "Scottish Highlands",
    region: "Highland · Scotland",
    dates: "April 18 – 26, 2021",
    summary:
      "Mist over the lochs, deer on the hillside, castles half-swallowed by heather. We drove the North Coast 500 in a campervan over nine days, sleeping in lay-bys with views that would have made Turner weep. Glen Coe at sunrise was one of those photographs that could have made a career.",
    accent: "#9898B4",
    tags: ["landscape", "long-exposure", "wilderness"],
    photos: [
      { seed: "scotland1", caption: "Glen Coe at sunrise" },
      { seed: "scotland2", caption: "Eilean Donan Castle in morning mist" },
      { seed: "scotland3", caption: "Old Man of Storr, Isle of Skye" },
      { seed: "scotland4", caption: "Glencoe waterfall long exposure" },
      { seed: "scotland5", caption: "Red deer on the Rannoch Moor" },
      { seed: "scotland6", caption: "Neist Point lighthouse at dusk" },
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const existingUser = await User.findOne({ email: "admin@gmail.com" });
  if (existingUser) {
    await Trip.deleteMany({ userId: existingUser._id });
    await Profile.deleteMany({ userId: existingUser._id });
    await User.deleteOne({ _id: existingUser._id });
    console.log("Removed existing admin user and data");
  }

  const hash = await bcrypt.hash("admin@@12", 12);
  const user = new User({
    name: "Admin",
    email: "admin@gmail.com",
    password: hash,
    username: "admin",
  });
  await user.save();
  console.log("Created user admin@gmail.com");

  for (const tripData of TRIPS) {
    const photos = tripData.photos.map((ph) => ({
      url: p(ph.seed),
      caption: ph.caption,
    }));

    await Trip.create({
      userId: user._id,
      place: tripData.place,
      region: tripData.region,
      dates: tripData.dates,
      summary: tripData.summary,
      accent: tripData.accent,
      tags: tripData.tags,
      cover: photos[0].url,
      photos,
    });
    console.log(`  → ${tripData.place}`);
  }

  await Profile.create({
    userId: user._id,
    bio: "Travel photographer based out of a suitcase. I spend most of my time chasing light in places I've never been before — and trying to find the shot that justifies the early alarm.\n\nFormer software engineer turned full-time wanderer. I shoot mostly on Fujifilm and edit with the same restraint I rarely apply to ordering dessert.",
    quote:
      "The camera is an excuse to be someplace you otherwise don't belong.",
    gear: [
      "Fujifilm X-T5",
      "XF 16-80mm f/4",
      "XF 50mm f/2",
      "DJI Mini 4 Pro",
      "Peak Design Everyday Backpack",
    ],
    interests: [
      {
        title: "Long Exposure",
        body: "There is something meditative about setting up a shot that takes two minutes to expose. Waterfalls become silk, crowds disappear, and the photograph becomes something that never existed in real life.",
      },
      {
        title: "Street Photography",
        body: "A borrowed moment from a stranger's day. I love the ethics and the chaos of it — the discipline of seeing in a fraction of a second and committing to the frame.",
      },
      {
        title: "Golden Hour Light",
        body: "The twenty minutes either side of sunrise and sunset when everything turns to fire. Planning a shoot around them is half the creative process; the other half is just showing up.",
      },
      {
        title: "Architecture",
        body: "Old buildings tell stories through their erosion. A tiled courtyard, a peeling doorway, a stairwell catching a single shaft of light — these are the things I photograph when I'm not sure what else to shoot.",
      },
      {
        title: "Wildlife",
        body: "Patience and stillness. The reward is not guaranteed and that's exactly the point. I am still learning to see animals the way the great wildlife photographers do — as subjects rather than prizes.",
      },
    ],
  });

  console.log("Profile created");
  console.log("\nSeed complete. Login: admin@gmail.com / admin@@12");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
