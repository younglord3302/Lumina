
import { Product, Order } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Lumina Alpha Headphones",
    price: 349,
    category: "Audio",
    image: "https://picsum.photos/id/1/800/800",
    description: "High-fidelity noise cancelling headphones with 30-hour battery life.",
    features: ["Active Noise Cancellation", "Transparency Mode", "Plush Ear Cups"],
    colors: ["Matte Black", "Silver", "Navy Blue"],
    reviews: [
      { id: '1', user: 'Sarah J.', rating: 5, comment: 'The noise cancellation is magical. Best purchase of the year.', date: '2024-03-15' },
      { id: '2', user: 'Mike T.', rating: 4, comment: 'Great sound, but the case is a bit bulky.', date: '2024-02-20' },
      { id: '3', user: 'Emily R.', rating: 5, comment: 'Comfortable for long flights. Battery lasts forever.', date: '2024-01-10' }
    ]
  },
  {
    id: 2,
    name: "Chronos Minimalist Watch",
    price: 199,
    category: "Accessories",
    image: "https://picsum.photos/id/175/800/800",
    description: "A sleek analog watch featuring a sapphire crystal face and genuine leather strap.",
    features: ["Sapphire Crystal", "5ATM Water Resistance", "Swiss Movement"],
    colors: ["Brown Leather", "Black Leather"],
    reviews: [
      { id: '1', user: 'David B.', rating: 5, comment: 'Stunning design. Looks much more expensive than it is.', date: '2024-03-01' },
      { id: '2', user: 'Jessica L.', rating: 4, comment: 'Leather strap is a bit stiff at first, but breaks in nicely.', date: '2024-02-14' }
    ]
  },
  {
    id: 3,
    name: "ErgoChair Pro",
    price: 599,
    category: "Furniture",
    image: "https://picsum.photos/id/2/800/800",
    description: "The ultimate ergonomic chair designed for 12+ hours of comfortable seating.",
    features: ["Lumbar Support", "Adjustable Headrest", "Breathable Mesh"],
    colors: ["Graphite", "Gray", "Cool Blue"],
    reviews: [
      { id: '1', user: 'Alex C.', rating: 5, comment: 'Saved my back! I work from home and this is essential.', date: '2024-03-10' },
      { id: '2', user: 'Chris P.', rating: 3, comment: 'Assembly was a bit tricky, but the chair is comfortable.', date: '2024-01-05' }
    ]
  },
  {
    id: 4,
    name: "Titan Mechanical Key",
    price: 149,
    category: "Electronics",
    image: "https://picsum.photos/id/3/800/800",
    description: "Tactile mechanical keyboard with RGB backlighting and aircraft-grade aluminum frame.",
    features: ["Hot-swappable Switches", "PBT Keycaps", "Wireless Connectivity"],
    colors: ["Black", "White"],
    reviews: [
      { id: '1', user: 'Gamer123', rating: 5, comment: 'The tactile feedback is satisfying. RGB software is easy to use.', date: '2024-03-20' },
      { id: '2', user: 'CodeMaster', rating: 5, comment: 'Solid build quality. Heavy and doesn\'t slide around.', date: '2024-02-28' },
      { id: '3', user: 'Anon', rating: 4, comment: 'Good keyboard, but battery life could be better with full RGB on.', date: '2024-01-15' }
    ]
  },
  {
    id: 5,
    name: "Zenith Smart Lamp",
    price: 89,
    category: "Home",
    image: "https://picsum.photos/id/20/800/800",
    description: "App-controlled ambient lighting that adjusts to your circadian rhythm.",
    features: ["16M Colors", "Voice Control", "Sleep Mode"],
    reviews: [
      { id: '1', user: 'InteriorDes', rating: 4, comment: 'Adds a great vibe to the living room.', date: '2024-03-05' },
      { id: '2', user: 'TechSavvy', rating: 2, comment: 'App connectivity is spotty sometimes.', date: '2024-02-01' }
    ]
  },
  {
    id: 6,
    name: "Nomad Backpack",
    price: 129,
    category: "Accessories",
    image: "https://picsum.photos/id/26/800/800",
    description: "Water-resistant commuter backpack with dedicated laptop compartment.",
    features: ["Waterproof", "Anti-theft Pockets", "USB Charging Port"],
    colors: ["Charcoal", "Olive Green", "Navy"],
    sizes: ["20L", "30L"],
    reviews: [
      { id: '1', user: 'Traveler_Mike', rating: 5, comment: 'Perfect for my daily commute. Keeps everything dry.', date: '2024-03-12' },
      { id: '2', user: 'Student_Anna', rating: 5, comment: 'Fits my 16-inch laptop perfectly. Lots of pockets.', date: '2024-02-18' },
      { id: '3', user: 'Hiker_Joe', rating: 4, comment: 'Great bag, but the shoulder straps could be more padded.', date: '2024-01-25' },
      { id: '4', user: 'CitySlicker', rating: 5, comment: 'Stylish and functional. Love the hidden pockets.', date: '2024-03-22' }
    ]
  },
  {
    id: 7,
    name: "Aura Smart Sleep Mask",
    price: 129,
    category: "Wellness",
    image: "https://picsum.photos/id/40/800/800",
    description: "Intelligent sleep mask that tracks REM cycles and uses gentle light to wake you up naturally.",
    features: ["REM Tracking", "Sunrise Simulation", "Bluetooth Audio"],
    reviews: [
      { id: '1', user: 'SleepyHead', rating: 5, comment: 'Waking up feels so much easier now. Highly recommend.', date: '2024-03-25' },
      { id: '2', user: 'Insomniac_No_More', rating: 4, comment: 'Comfortable to wear, though the app needs some updates.', date: '2024-03-10' }
    ]
  },
  {
    id: 8,
    name: "Orbit Floating Speaker",
    price: 249,
    category: "Audio",
    image: "https://picsum.photos/id/45/800/800",
    description: "Levitating 360-degree Bluetooth speaker with futuristic design and crystal clear sound.",
    features: ["Magnetic Levitation", "360° Sound", "Wireless Charging Base"],
    colors: ["White", "Black"],
    reviews: [
      { id: '1', user: 'FutureTech', rating: 5, comment: 'Looks absolutely insane on my desk. Sound is surprisingly good too.', date: '2024-02-15' },
      { id: '2', user: 'Audiophile_Dave', rating: 3, comment: 'It\'s a cool gimmick, but for the price, I expected deeper bass.', date: '2024-01-20' }
    ]
  },
  {
    id: 9,
    name: "Nebula Projector",
    price: 499,
    category: "Electronics",
    image: "https://picsum.photos/id/50/800/800",
    description: "Portable 4K home cinema projector with built-in Android TV and premium speakers.",
    features: ["4K Resolution", "Android TV 11", "Autofocus"],
    reviews: [
      { id: '1', user: 'MovieBuff', rating: 5, comment: 'Picture quality is stunning even on a plain wall.', date: '2024-03-28' }
    ]
  },
  {
    id: 10,
    name: "Terra Cotta Planter Set",
    price: 59,
    category: "Home",
    image: "https://picsum.photos/id/60/800/800",
    description: "Handcrafted artisan clay planters with a modern geometric design.",
    features: ["Handmade", "Drainage Holes", "Set of 3"],
    reviews: [
      { id: '1', user: 'PlantMom', rating: 5, comment: 'Beautiful texture and they look great in my sunroom.', date: '2024-03-05' },
      { id: '2', user: 'GreenThumb', rating: 4, comment: 'A bit smaller than expected, but very high quality.', date: '2024-02-12' }
    ]
  },
  {
    id: 11,
    name: "Vantage Drone",
    price: 799,
    category: "Photography",
    image: "https://picsum.photos/id/70/800/800",
    description: "Professional-grade camera drone with obstacle avoidance and 45-minute flight time.",
    features: ["4K/60fps Video", "Omnidirectional Sensing", "10km Range"],
    reviews: [
      { id: '1', user: 'SkyHigh', rating: 5, comment: 'Incredible stability in wind. The footage is cinematic right out of the box.', date: '2024-03-18' }
    ]
  },
  {
    id: 12,
    name: "Solar Power Bank",
    price: 89,
    category: "Accessories",
    image: "https://picsum.photos/id/80/800/800",
    description: "Rugged 20,000mAh portable charger with solar panels for off-grid adventures.",
    features: ["Solar Charging", "Waterproof", "Built-in Flashlight"],
    reviews: [
      { id: '1', user: 'CamperVan', rating: 4, comment: 'Solar charging is slow, but it\'s a lifesaver in emergencies.', date: '2024-01-30' },
      { id: '2', user: 'Hiker_Pro', rating: 5, comment: 'Dropped it in a creek and it still works perfectly.', date: '2024-02-22' }
    ]
  },
  {
    id: 13,
    name: "Classic Aviator Sunglasses",
    price: 159,
    category: "Accessories",
    image: "https://picsum.photos/id/90/800/800",
    description: "Timeless polarized sunglasses with gold frames and scratch-resistant lenses.",
    features: ["Polarized Lenses", "UV400 Protection", "Italian Acetate"],
    colors: ["Gold", "Silver", "Gunmetal"],
    reviews: [
      { id: '1', user: 'Fashionista', rating: 5, comment: 'They fit perfectly and look very high-end.', date: '2024-03-10' }
    ]
  },
  {
    id: 14,
    name: "Barista Pro Espresso Machine",
    price: 699,
    category: "Home",
    image: "https://picsum.photos/id/100/800/800",
    description: "Semi-automatic espresso machine with built-in grinder for cafe-quality coffee at home.",
    features: ["Integrated Conical Burr Grinder", "Digital PID Temperature Control", "Steam Wand"],
    reviews: [
      { id: '1', user: 'CoffeeLover99', rating: 5, comment: 'Makes better coffee than my local shop. Worth every penny.', date: '2024-03-01' },
      { id: '2', user: 'MorningPerson', rating: 4, comment: 'Learning curve is steep, but results are rewarding.', date: '2024-02-15' },
      { id: '3', user: 'LatteArt', rating: 5, comment: 'Steam pressure is powerful. Great for milk texture.', date: '2024-03-20' }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-738-291",
    date: "2024-03-28",
    status: "Processing",
    total: 349,
    items: [
      {
        ...MOCK_PRODUCTS[0],
        quantity: 1,
        selectedColor: "Matte Black"
      }
    ]
  },
  {
    id: "ORD-992-110",
    date: "2024-03-10",
    status: "Delivered",
    total: 129,
    items: [
      {
        ...MOCK_PRODUCTS[5],
        quantity: 1,
        selectedColor: "Navy",
        selectedSize: "20L"
      }
    ]
  },
  {
    id: "ORD-102-334",
    date: "2024-02-15",
    status: "Delivered",
    total: 89,
    items: [
      {
        ...MOCK_PRODUCTS[4],
        quantity: 1
      }
    ]
  },
  {
    id: "ORD-554-009",
    date: "2023-12-05",
    status: "Cancelled",
    total: 599,
    items: [
      {
        ...MOCK_PRODUCTS[2],
        quantity: 1,
        selectedColor: "Graphite"
      }
    ]
  }
];
