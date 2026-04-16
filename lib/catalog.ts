export interface CatalogItem {
  sku: string;
  name: string;
  unitPrice: number;
  unit: string;
  aliases: string[];
}

export const catalog: CatalogItem[] = [
  {
    sku: "SKU-1001",
    name: "Classic Crew Neck T-Shirt - Black / M",
    unitPrice: 24.99,
    unit: "EA",
    aliases: ["crew neck tee", "black tshirt", "classic tee black medium", "crew neck t-shirt"],
  },
  {
    sku: "SKU-1002",
    name: "Classic Crew Neck T-Shirt - White / M",
    unitPrice: 24.99,
    unit: "EA",
    aliases: ["white tshirt", "classic tee white", "crew neck white medium", "white t-shirt"],
  },
  {
    sku: "SKU-1003",
    name: "Classic Crew Neck T-Shirt - Navy / L",
    unitPrice: 24.99,
    unit: "EA",
    aliases: ["navy tshirt", "navy tee large", "crew neck navy"],
  },
  {
    sku: "SKU-2001",
    name: "Slim Fit Denim Jeans - Dark Wash / 32",
    unitPrice: 89.99,
    unit: "EA",
    aliases: ["slim jeans", "dark wash jeans", "denim jeans dark", "slim fit denim 32"],
  },
  {
    sku: "SKU-2002",
    name: "Slim Fit Denim Jeans - Light Wash / 34",
    unitPrice: 89.99,
    unit: "EA",
    aliases: ["light wash jeans", "light denim", "slim jeans light 34"],
  },
  {
    sku: "SKU-3001",
    name: "Wireless Bluetooth Earbuds - Matte Black",
    unitPrice: 79.99,
    unit: "EA",
    aliases: ["bluetooth earbuds", "wireless earbuds", "earbuds black", "bt earbuds"],
  },
  {
    sku: "SKU-3002",
    name: "USB-C Fast Charging Cable - 6ft",
    unitPrice: 14.99,
    unit: "EA",
    aliases: ["usb c cable", "charging cable", "usb-c charger", "fast charge cable", "type c cable"],
  },
  {
    sku: "SKU-3003",
    name: "Laptop Sleeve - 14\" Neoprene Grey",
    unitPrice: 34.99,
    unit: "EA",
    aliases: ["laptop sleeve", "laptop case", "14 inch sleeve", "neoprene sleeve", "laptop bag"],
  },
  {
    sku: "SKU-4001",
    name: "Organic Face Moisturizer - 2oz",
    unitPrice: 28.99,
    unit: "EA",
    aliases: ["face moisturizer", "organic moisturizer", "face cream", "moisturizer 2oz"],
  },
  {
    sku: "SKU-4002",
    name: "Vitamin C Brightening Serum - 1oz",
    unitPrice: 42.99,
    unit: "EA",
    aliases: ["vitamin c serum", "brightening serum", "face serum", "vit c serum"],
  },
  {
    sku: "SKU-5001",
    name: "Stainless Steel Water Bottle - 24oz",
    unitPrice: 32.99,
    unit: "EA",
    aliases: ["water bottle", "steel bottle", "stainless bottle", "24oz bottle", "metal water bottle"],
  },
  {
    sku: "SKU-5002",
    name: "Insulated Travel Mug - 16oz Black",
    unitPrice: 27.99,
    unit: "EA",
    aliases: ["travel mug", "insulated mug", "coffee mug", "thermos mug", "travel coffee mug"],
  },
  {
    sku: "SKU-6001",
    name: "Canvas Tote Bag - Natural",
    unitPrice: 18.99,
    unit: "EA",
    aliases: ["tote bag", "canvas tote", "shopping bag", "canvas bag natural"],
  },
  {
    sku: "SKU-6002",
    name: "Recycled Polyester Backpack - Charcoal",
    unitPrice: 64.99,
    unit: "EA",
    aliases: ["backpack", "polyester backpack", "charcoal backpack", "recycled backpack"],
  },
  {
    sku: "SKU-7001",
    name: "Soy Wax Candle - Lavender / 8oz",
    unitPrice: 22.99,
    unit: "EA",
    aliases: ["soy candle", "lavender candle", "candle 8oz", "wax candle lavender"],
  },
  {
    sku: "SKU-7002",
    name: "Essential Oil Diffuser - Ceramic White",
    unitPrice: 44.99,
    unit: "EA",
    aliases: ["oil diffuser", "essential oil diffuser", "ceramic diffuser", "aroma diffuser"],
  },
];

export function findBestMatch(query: string): CatalogItem | null {
  const q = query.toLowerCase().trim();

  // Direct SKU match
  const skuMatch = catalog.find(
    (item) => q.includes(item.sku.toLowerCase())
  );
  if (skuMatch) return skuMatch;

  // Score each item by alias and name similarity
  let bestScore = 0;
  let bestItem: CatalogItem | null = null;

  for (const item of catalog) {
    let itemBestScore = 0;

    // Check aliases
    for (const alias of item.aliases) {
      const score = computeMatchScore(q, alias.toLowerCase());
      if (score > itemBestScore) itemBestScore = score;
    }

    // Check product name
    const nameScore = computeMatchScore(q, item.name.toLowerCase());
    if (nameScore > itemBestScore) itemBestScore = nameScore;

    if (itemBestScore > bestScore) {
      bestScore = itemBestScore;
      bestItem = item;
    }
  }

  return bestScore >= 2 ? bestItem : null;
}

function computeMatchScore(query: string, target: string): number {
  const queryWords = query.split(/[\s,/]+/).filter((w) => w.length > 1);
  const targetWords = target.split(/[\s,/]+/).filter((w) => w.length > 1);

  let score = 0;
  for (const tw of targetWords) {
    // Exact word match
    if (queryWords.some((qw) => qw === tw)) {
      score += 3;
    }
    // Fuzzy match (one word contains the other)
    else if (queryWords.some((qw) => qw.includes(tw) || tw.includes(qw))) {
      score += 1;
    }
  }

  // Bonus for matching a high proportion of target words
  const matchedCount = targetWords.filter((tw) =>
    queryWords.some((qw) => qw === tw || qw.includes(tw) || tw.includes(qw))
  ).length;
  if (targetWords.length > 0 && matchedCount / targetWords.length >= 0.8) {
    score += 2;
  }

  return score;
}
