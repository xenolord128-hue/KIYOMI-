import { Product } from '../types';

const RAW_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "KIYOMI Chrono X1 Smartwatch",
    category: "Smartwatches",
    price: 4500,
    rating: 4.9,
    assets: [
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
      "https://images.unsplash.com/photo-1517502884422-41eaaced0168?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800"
    ],
    variants: ["Space Gray", "Obsidian Black", "Pure Silver"],
    outOfStock: ["Pure Silver"],
    description: "Super AMOLED 1.43-inch display, dual-core chipset, with up to 14 days standby power. Premium aerospace-grade titanium frame with continuous blood oxygen monitoring.",
    reviews: [
      { id: 1, userName: "Abrar Rahman", rating: 5, comment: "Incredible battery life and premium build!" }
    ],
    stock: 25
  },
  {
    id: 2,
    title: "KIYOMI SonicBuds Pro ANC",
    category: "Earbuds & Audio",
    price: 3200,
    rating: 5.0,
    assets: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800"
    ],
    variants: ["Matte Black", "Arctic White"],
    outOfStock: [],
    description: "Active Noise Cancellation up to 48dB, high-fidelity dynamic drivers, with zero-latency gaming transmission interface.",
    reviews: [
      { id: 1, userName: "Sadnan Kabir", rating: 5, comment: "Pure audio acoustics crafted for urban audiophiles." }
    ],
    stock: 18
  },
  {
    id: 3,
    title: "KIYOMI Neo-Type Mechanical Keypad",
    category: "Mice & Keyboards",
    price: 5800,
    rating: 4.8,
    assets: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
      "https://images.unsplash.com/photo-1626908013351-800ddd734b8a?w=800",
      "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800"
    ],
    variants: ["Carbon Fade", "Neon Mint"],
    outOfStock: [],
    description: "Gasket mount mechanical keyboard, customized brown tactile switches, sound absorbing layers with premium dye-subbed keycaps. Includes dynamic RGB routing.",
    reviews: [
      { id: 1, userName: "Imtiaz Hassan", rating: 5, comment: "Perfect typing experience." }
    ],
    stock: 12
  },
  {
    id: 4,
    title: "KIYOMI VoltStream 100W GaN Adapter",
    category: "Power & Chargers",
    price: 2400,
    rating: 4.7,
    assets: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800",
      "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=800",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800",
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800"
    ],
    variants: ["Sleek Gray", "Off White"],
    outOfStock: [],
    description: "Ultra-compact Gallium Nitride power center with 3x USB-C fast charging slots. Intelligently routes electric flow to safe-protect notebook batteries.",
    reviews: [],
    stock: 30
  },
  {
    id: 5,
    title: "KIYOMI Aurora Ambient Lamp Grid",
    category: "Smart Gadgets",
    price: 1800,
    rating: 4.6,
    assets: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800",
      "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=800",
      "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=800",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
    ],
    variants: ["Default Color"],
    outOfStock: [],
    description: "Smart ambient layout light with sound responsive frequency sync, controlled wirelessly via smartphone. Creates deep therapeutic atmosphere.",
    reviews: [],
    stock: 15
  },
  {
    id: 6,
    title: "KIYOMI Classic Brass Desk Clock",
    category: "Smartwatches",
    price: 2900,
    rating: 4.9,
    assets: [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdcd1d?w=800",
      "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",
      "https://images.unsplash.com/photo-1518131394553-c3e387c162da?w=800",
      "https://images.unsplash.com/photo-1585128792020-803d29415281?w=800"
    ],
    variants: ["Vintage Gold", "Matte Jet"],
    outOfStock: [],
    description: "Pure retro brass analog desktop clock with a quiet high-precision quartz movement. Represents classic mechanical chronography.",
    reviews: [],
    stock: 10
  },
  {
    id: 7,
    title: "KIYOMI Solo One Wireless Soundbar",
    category: "Earbuds & Audio",
    price: 8900,
    rating: 4.9,
    assets: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
      "https://images.unsplash.com/photo-1589256469067-ea99122bbec4?w=800",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800"
    ],
    variants: ["Carbon Fiber", "Premium Oak"],
    outOfStock: [],
    description: "Multi-driver high-resolution wireless soundbar. Precision acoustics, integrated subwoofer, spatial sound technology.",
    reviews: [],
    stock: 15
  },
  {
    id: 8,
    title: "KIYOMI Carbon Precision Trackpad",
    category: "Mice & Keyboards",
    price: 4200,
    rating: 4.8,
    assets: [
      "https://images.unsplash.com/photo-1541140134449-29161a66a953?w=800",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800",
      "https://images.unsplash.com/photo-1572945281861-68b293d045a7?w=800",
      "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800"
    ],
    variants: ["Matte Black", "Silver Satin"],
    outOfStock: [],
    description: "Extra large carbon glass wireless trackpad with haptic feedback, gestures, and ultra long battery life.",
    reviews: [],
    stock: 22
  },
  {
    id: 9,
    title: "KIYOMI Helios 25K Solar Charge Bank",
    category: "Power & Chargers",
    price: 3100,
    rating: 4.7,
    assets: [
      "https://images.unsplash.com/photo-1620283085439-39620a1e21c4?w=800",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
      "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=800",
      "https://images.unsplash.com/photo-1562408590-e32931084e23?w=800",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800"
    ],
    variants: ["Solar Yellow", "Tactical Gray"],
    outOfStock: [],
    description: "High-density 25000mAh durable battery bank with integrated fast-charging solar panels and IP67 dustproof/waterproof metrics.",
    reviews: [],
    stock: 19
  },
  {
    id: 10,
    title: "KIYOMI Orbit Smart AirTags (4-Pack)",
    category: "Smart Gadgets",
    price: 1500,
    rating: 4.6,
    assets: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1588449668338-d15168863c83?w=800",
      "https://images.unsplash.com/photo-1600541519463-ee67aa1ec7e9?w=800",
      "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800",
      "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=800"
    ],
    variants: ["Default White"],
    outOfStock: [],
    description: "Compact smart key markers and trackers synced to global locator mapping grids. Durable structure with water-resistant sealing.",
    reviews: [],
    stock: 40
  }
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map(prod => ({
  ...prod,
  reviews: (prod.reviews || []).map(rev => ({
    ...rev,
    userName: rev.userName || "MAHAFUZUR RAHAMAN"
  }))
}));
