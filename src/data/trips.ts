export interface Photo {
  url: string;
  caption: string;
}

export interface Trip {
  id: string;
  index: string;
  place: string;
  region: string;
  dates: string;
  summary: string;
  cover: string;
  photos: Photo[];
  accent: string;
  instagram?: string;
}

const p = (seed: string, w = 1600, h = 900) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const trips: Trip[] = [
  {
    id: "santorini",
    index: "01",
    place: "Santorini",
    region: "Cyclades · Greece",
    dates: "June 14 – 21, 2024",
    summary:
      "Azure domes, labyrinthine whitewashed alleys, and sunsets that redefine golden hour. Suspended between the Aegean and the sky, where every vista feels painted by light.",
    cover:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1920&q=85",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=85",
        caption: "Oia village at golden hour",
      },
      {
        url: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1600&q=85",
        caption: "The iconic blue domes of Oia",
      },
      {
        url: "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1600&q=85",
        caption: "Caldera views from Fira",
      },
      {
        url: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1600&q=85",
        caption: "Steps leading down to the sea",
      },
      {
        url: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1600&q=85",
        caption: "Perissa volcanic black beach",
      },
    ],
    accent: "#89B4C8",
    instagram: "https://www.instagram.com",
  },
  {
    id: "kyoto",
    index: "02",
    place: "Kyoto",
    region: "Kansai · Japan",
    dates: "March 28 – April 5, 2024",
    summary:
      "A city that breathes history through bamboo groves and torii gates. Cherry blossoms carpeted the stone paths, and every shrine felt like a threshold between eras.",
    cover:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1920&q=85",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1600&q=85",
        caption: "Fushimi Inari torii gates",
      },
      {
        url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1600&q=85",
        caption: "Arashiyama bamboo grove",
      },
      {
        url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1600&q=85",
        caption: "Cherry blossoms at Maruyama",
      },
      {
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
        caption: "Gion district at dusk",
      },
      {
        url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85",
        caption: "Kinkaku-ji Golden Pavilion",
      },
      {
        url: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=1600&q=85",
        caption: "Nishiki market morning",
      },
    ],
    accent: "#D4A0B0",
    instagram: "https://www.instagram.com",
  },
  {
    id: "amalfi",
    index: "03",
    place: "Amalfi Coast",
    region: "Campania · Italy",
    dates: "August 9 – 17, 2023",
    summary:
      "Pastel villages clinging to cliffs above an impossible turquoise sea. The scent of lemons, the hum of Vespas, and Italian warmth woven along a legendary stretch of coastline.",
    cover:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1920&q=85",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1534445538923-ab38e8de7d20?auto=format&fit=crop&w=1600&q=85",
        caption: "Positano at sunrise",
      },
      {
        url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=85",
        caption: "Aerial view of Amalfi town",
      },
      {
        url: "https://images.unsplash.com/photo-1555992457-b8fefdd09069?auto=format&fit=crop&w=1600&q=85",
        caption: "Ravello garden terraces",
      },
      {
        url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=85",
        caption: "Capri marina at midday",
      },
      {
        url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1600&q=85",
        caption: "Cliffside lemon grove",
      },
    ],
    accent: "#E8B87A",
    instagram: "https://www.instagram.com",
  },
  {
    id: "marrakech",
    index: "04",
    place: "Marrakech",
    region: "Tensift · Morocco",
    dates: "November 3 – 9, 2023",
    summary:
      "A labyrinth of souks, riads, and rooftop terraces painted in terracotta and saffron. The medina buzzes with centuries of trade and colour — an intoxicating sensory overload, in the best way.",
    cover:
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1920&q=85",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=85",
        caption: "Djemaa el-Fna at sunset",
      },
      {
        url: "https://images.unsplash.com/photo-1597212618440-806262de4f2b?auto=format&fit=crop&w=1600&q=85",
        caption: "Spice souk colours",
      },
      {
        url: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1600&q=85",
        caption: "Bahia Palace courtyard",
      },
      {
        url: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1600&q=85",
        caption: "Riad rooftop terrace",
      },
    ],
    accent: "#C87D5A",
    instagram: "https://www.instagram.com",
  },
  {
    id: "patagonia",
    index: "05",
    place: "Patagonia",
    region: "Santa Cruz · Argentina",
    dates: "January 20 – 31, 2024",
    summary:
      "The end of the world, where jagged granite towers pierce the clouds and glaciers inch toward the sea. A place so raw and vast it makes you feel both infinitely small and completely alive.",
    cover:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1920&q=85",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1600&q=85",
        caption: "Torres del Paine at dawn",
      },
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
        caption: "Perito Moreno glacier",
      },
      {
        url: "https://images.unsplash.com/photo-1520052205864-92d242b3a76b?auto=format&fit=crop&w=1600&q=85",
        caption: "Laguna de los Tres",
      },
      {
        url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1600&q=85",
        caption: "Condor soaring above the pampas",
      },
      {
        url: "https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=1600&q=85",
        caption: "Storm rolling over the steppe",
      },
    ],
    accent: "#7ABAB0",
    instagram: "https://www.instagram.com",
  },
  {
    id: "dubrovnik",
    index: "06",
    place: "Dubrovnik",
    region: "Dalmatia · Croatia",
    dates: "May 18 – 24, 2023",
    summary:
      "The Pearl of the Adriatic, wrapped in medieval limestone walls. Terracotta rooftops, cobalt sea, and the echo of centuries — a city that earns every superlative.",
    cover: p("dubrovnik-cover", 1920, 1080),
    photos: [
      { url: p("dubrovnik-1"), caption: "Old town aerial from the walls" },
      { url: p("dubrovnik-2"), caption: "City walls at golden hour" },
      { url: p("dubrovnik-3"), caption: "Stradun promenade at dusk" },
      { url: p("dubrovnik-4"), caption: "Cable car view over the harbour" },
      { url: p("dubrovnik-5"), caption: "Old port at sunrise" },
    ],
    accent: "#5E9E8F",
    instagram: "https://www.instagram.com",
  },
  {
    id: "bali",
    index: "07",
    place: "Bali",
    region: "Lesser Sunda · Indonesia",
    dates: "September 4 – 15, 2023",
    summary:
      "Terraced rice paddies, incense-wrapped temples, and a spiritual calm that permeates even the busiest market. Bali moves to its own ancient rhythm — slow, intentional, sacred.",
    cover:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=85",
    photos: [
      { url: p("bali-1"), caption: "Tegallalang rice terraces at dawn" },
      { url: p("bali-2"), caption: "Tanah Lot temple at sunrise" },
      { url: p("bali-3"), caption: "Ubud monkey forest path" },
      { url: p("bali-4"), caption: "Seminyak beach at dusk" },
      { url: p("bali-5"), caption: "Balinese offering ceremony" },
    ],
    accent: "#C4A882",
    instagram: "https://www.instagram.com",
  },
  {
    id: "iceland",
    index: "08",
    place: "Iceland",
    region: "Suðurland · Iceland",
    dates: "February 7 – 15, 2024",
    summary:
      "A country that feels freshly sculpted — waterfalls tumbling from black cliffs, geysers splitting the silence, and the aurora borealis painting the sky in impossible green.",
    cover:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1920&q=85",
    photos: [
      { url: p("iceland-1"), caption: "Jökulsárlón glacier lagoon" },
      { url: p("iceland-2"), caption: "Aurora borealis over the fjords" },
      { url: p("iceland-3"), caption: "Seljalandsfoss waterfall" },
      { url: p("iceland-4"), caption: "Geysir erupting at dawn" },
      { url: p("iceland-5"), caption: "Black sand beach at Reynisfjara" },
    ],
    accent: "#89A8C8",
    instagram: "https://www.instagram.com",
  },
  {
    id: "lisbon",
    index: "09",
    place: "Lisbon",
    region: "Estremadura · Portugal",
    dates: "October 12 – 18, 2023",
    summary:
      "Seven hills, yellow trams, and fado drifting from open windows. Lisbon wears its melancholy with grace — a sun-bleached city of azulejo tiles, seafaring ghosts, and the best pastéis in the world.",
    cover: p("lisbon-cover", 1920, 1080),
    photos: [
      { url: p("lisbon-1"), caption: "Tram 28 climbing Alfama hill" },
      { url: p("lisbon-2"), caption: "Alfama rooftops at dusk" },
      { url: p("lisbon-3"), caption: "Belém tower at sunset" },
      { url: p("lisbon-4"), caption: "Azulejo tile facade" },
      { url: p("lisbon-5"), caption: "Miradouro da Graça viewpoint" },
    ],
    accent: "#E8A05C",
    instagram: "https://www.instagram.com",
  },
  {
    id: "istanbul",
    index: "10",
    place: "Istanbul",
    region: "Marmara · Turkey",
    dates: "April 22 – 29, 2024",
    summary:
      "Two continents, one city. The call to prayer echoes across the Bosphorus as ferries cut through morning mist. Istanbul is ancient and electric simultaneously — a city that refuses to be categorised.",
    cover:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1920&q=85",
    photos: [
      { url: p("istanbul-1"), caption: "Hagia Sophia at blue hour" },
      { url: p("istanbul-2"), caption: "Grand Bazaar spice stalls" },
      { url: p("istanbul-3"), caption: "Bosphorus Strait from Galata" },
      { url: p("istanbul-4"), caption: "Blue Mosque interior" },
      { url: p("istanbul-5"), caption: "Galata Bridge at sunset" },
    ],
    accent: "#B87C5A",
    instagram: "https://www.instagram.com",
  },
  {
    id: "hanoi",
    index: "11",
    place: "Hanoi",
    region: "Red River Delta · Vietnam",
    dates: "December 2 – 9, 2023",
    summary:
      "Scooters, steam, and centuries. Hanoi's Old Quarter is a living museum of French colonial architecture and Vietnamese street life. Every morning begins with pho and the sound of the city waking.",
    cover: p("hanoi-cover", 1920, 1080),
    photos: [
      { url: p("hanoi-1"), caption: "Old Quarter street scene" },
      { url: p("hanoi-2"), caption: "Hoan Kiem Lake at dawn" },
      { url: p("hanoi-3"), caption: "Long Bien Bridge at dusk" },
      { url: p("hanoi-4"), caption: "Street food vendor at dawn" },
      { url: p("hanoi-5"), caption: "Temple of Literature courtyard" },
    ],
    accent: "#7DAF6E",
    instagram: "https://www.instagram.com",
  },
  {
    id: "cape-town",
    index: "12",
    place: "Cape Town",
    region: "Western Cape · South Africa",
    dates: "February 18 – 27, 2023",
    summary:
      "Table Mountain as your backdrop, the Atlantic on one side and the Indian Ocean reaching to the other. Cape Town is audaciously beautiful — raw coastal geology meeting a city of staggering energy.",
    cover:
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1920&q=85",
    photos: [
      { url: p("capetown-1"), caption: "Table Mountain at sunrise" },
      { url: p("capetown-2"), caption: "V&A Waterfront at dusk" },
      { url: p("capetown-3"), caption: "Boulders Beach penguin colony" },
      { url: p("capetown-4"), caption: "Chapman's Peak coastal drive" },
      { url: p("capetown-5"), caption: "Bo-Kaap neighbourhood colour" },
    ],
    accent: "#D0765A",
    instagram: "https://www.instagram.com",
  },
  {
    id: "barcelona",
    index: "13",
    place: "Barcelona",
    region: "Catalonia · Spain",
    dates: "July 5 – 12, 2023",
    summary:
      "Gaudí's fever dreams made real in stone and tile. Barcelona is architecture as emotion — from Sagrada Família's soaring nave to the mosaic chaos of Park Güell, beauty here is unapologetically strange.",
    cover:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1920&q=85",
    photos: [
      { url: p("barcelona-1"), caption: "Sagrada Família facades" },
      { url: p("barcelona-2"), caption: "Park Güell mosaic terrace" },
      { url: p("barcelona-3"), caption: "Gothic Quarter alleyways" },
      { url: p("barcelona-4"), caption: "Barceloneta beach at noon" },
      { url: p("barcelona-5"), caption: "La Boqueria market stalls" },
    ],
    accent: "#C4956A",
    instagram: "https://www.instagram.com",
  },
  {
    id: "prague",
    index: "14",
    place: "Prague",
    region: "Bohemia · Czech Republic",
    dates: "March 3 – 9, 2023",
    summary:
      "A Gothic fairy tale that survived the twentieth century intact. Cobblestone alleyways, Baroque spires, and the Charles Bridge in morning fog — Prague is the city that time forgot to ruin.",
    cover: p("prague-cover", 1920, 1080),
    photos: [
      { url: p("prague-1"), caption: "Old Town Square at dawn" },
      { url: p("prague-2"), caption: "Charles Bridge in morning mist" },
      { url: p("prague-3"), caption: "Prague Castle from Malá Strana" },
      { url: p("prague-4"), caption: "Astronomical Clock detail" },
      { url: p("prague-5"), caption: "Josefov Jewish Quarter at night" },
    ],
    accent: "#8BA8B4",
    instagram: "https://www.instagram.com",
  },
  {
    id: "havana",
    index: "15",
    place: "Havana",
    region: "La Habana · Cuba",
    dates: "October 28 – November 5, 2022",
    summary:
      "Frozen somewhere between 1959 and forever. Classic American cars in candy colours, crumbling colonial grandeur, and the constant percussion of salsa from open doorways. Havana is improbably, heartbreakingly beautiful.",
    cover:
      "https://images.unsplash.com/photo-1501862700950-18382cd41497?auto=format&fit=crop&w=1920&q=85",
    photos: [
      { url: p("havana-1"), caption: "Classic cars on the Malecón" },
      { url: p("havana-2"), caption: "Old Havana colonial facades" },
      { url: p("havana-3"), caption: "Havana rooftops at dusk" },
      { url: p("havana-4"), caption: "Musicians in Plaza Vieja" },
      { url: p("havana-5"), caption: "Malecón sunset walk" },
    ],
    accent: "#D4895A",
    instagram: "https://www.instagram.com",
  },
  {
    id: "maldives",
    index: "16",
    place: "Maldives",
    region: "North Malé Atoll · Maldives",
    dates: "May 30 – June 7, 2023",
    summary:
      "Overwater bungalows set on a lagoon that cycles through a dozen shades of turquoise. The Maldives exists at the edge of excess and dream — a place where silence is textured and the water does all the talking.",
    cover: p("maldives-cover", 1920, 1080),
    photos: [
      { url: p("maldives-1"), caption: "Overwater villas at dawn" },
      { url: p("maldives-2"), caption: "Turquoise lagoon aerial" },
      { url: p("maldives-3"), caption: "Snorkelling with manta rays" },
      { url: p("maldives-4"), caption: "Sunset over the Indian Ocean" },
    ],
    accent: "#58B4C8",
    instagram: "https://www.instagram.com",
  },
  {
    id: "highlands",
    index: "17",
    place: "Scottish Highlands",
    region: "Inverness-shire · Scotland",
    dates: "August 28 – September 4, 2023",
    summary:
      "Glens draped in heather, lochs holding the sky upside-down, and a silence so complete you can hear the wind composing. The Highlands are a landscape that demands nothing of you except presence.",
    cover: p("highlands-cover", 1920, 1080),
    photos: [
      { url: p("highlands-1"), caption: "Glencoe valley in morning mist" },
      { url: p("highlands-2"), caption: "Eilean Donan Castle" },
      { url: p("highlands-3"), caption: "Loch Lomond at dusk" },
      { url: p("highlands-4"), caption: "Highland red deer stag" },
      { url: p("highlands-5"), caption: "Isle of Skye sea stacks" },
    ],
    accent: "#7A9E72",
    instagram: "https://www.instagram.com",
  },
  {
    id: "cusco",
    index: "18",
    place: "Cusco",
    region: "Andes · Peru",
    dates: "March 14 – 23, 2023",
    summary:
      "The ancient capital of the Inca empire, where Quechua is still spoken in the markets and Incan stone walls underpin Spanish colonial churches. Machu Picchu waits at the end of a four-day trail through cloud forest.",
    cover:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1920&q=85",
    photos: [
      { url: p("cusco-1"), caption: "Machu Picchu in morning mist" },
      { url: p("cusco-2"), caption: "Sacred Valley terraces" },
      { url: p("cusco-3"), caption: "Cusco Plaza de Armas" },
      { url: p("cusco-4"), caption: "Sacsayhuamán ruins at sunrise" },
      { url: p("cusco-5"), caption: "Rainbow Mountain at altitude" },
    ],
    accent: "#C4885A",
    instagram: "https://www.instagram.com",
  },
  {
    id: "new-york",
    index: "19",
    place: "New York",
    region: "New York · United States",
    dates: "December 16 – 23, 2022",
    summary:
      "The city that needs no superlatives. Steel and light stacked into the sky, Central Park in the snow, steam rising from the subway grates. New York in December is a film set that happens to be real life.",
    cover:
      "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=1920&q=85",
    photos: [
      { url: p("newyork-1"), caption: "Manhattan skyline at dusk" },
      { url: p("newyork-2"), caption: "Brooklyn Bridge walkway" },
      { url: p("newyork-3"), caption: "Central Park in winter" },
      { url: p("newyork-4"), caption: "Times Square at night" },
      { url: p("newyork-5"), caption: "Lower Manhattan street grid" },
    ],
    accent: "#9898B4",
    instagram: "https://www.instagram.com",
  },
  {
    id: "rajasthan",
    index: "20",
    place: "Rajasthan",
    region: "Thar Desert · India",
    dates: "November 18 – 28, 2022",
    summary:
      "A state that moves in gold and ochre. Maharaja palaces looming over labyrinthine bazaars, camel caravans crossing the Thar Desert, and the blue city of Jodhpur shimmering under a relentless sun.",
    cover:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=85",
    photos: [
      { url: p("rajasthan-1"), caption: "Amber Fort at sunrise" },
      { url: p("rajasthan-2"), caption: "Jodhpur blue city from above" },
      { url: p("rajasthan-3"), caption: "Mehrangarh Fort ramparts" },
      { url: p("rajasthan-4"), caption: "Thar Desert camel safari" },
      { url: p("rajasthan-5"), caption: "Jaipur spice market colours" },
    ],
    accent: "#D4885A",
    instagram: "https://www.instagram.com",
  },
];
