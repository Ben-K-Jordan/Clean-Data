export interface CatalogItem {
  sku: string;
  name: string;
  unitPrice: number;
  unit: string;
  aliases: string[];
}

// Product catalog for a clothing manufacturer
// Prices are wholesale/manufacturing cost per unit
export const catalog: CatalogItem[] = [
  {
    sku: "TEE-BLK-M",
    name: "Essential Crew Tee - Black / M",
    unitPrice: 8.50,
    unit: "EA",
    aliases: ["crew neck tee black", "black tshirt medium", "essential tee black", "crew tee blk m", "black crew neck", "blk tees med", "blk tee med", "blk essential tee", "blk crewnck tee med"],
  },
  {
    sku: "TEE-BLK-L",
    name: "Essential Crew Tee - Black / L",
    unitPrice: 8.50,
    unit: "EA",
    aliases: ["crew neck tee black large", "black tshirt large", "essential tee black l", "crew tee blk l", "blk tees lrg", "blk tee lrg", "blk essential tee large"],
  },
  {
    sku: "TEE-WHT-M",
    name: "Essential Crew Tee - White / M",
    unitPrice: 8.50,
    unit: "EA",
    aliases: ["white tshirt", "essential tee white", "crew tee white medium", "white crew neck", "white t-shirt", "wht tshirts", "wht tees", "wht essential tee"],
  },
  {
    sku: "TEE-WHT-L",
    name: "Essential Crew Tee - White / L",
    unitPrice: 8.50,
    unit: "EA",
    aliases: ["white tshirt large", "essential tee white l", "crew tee white large"],
  },
  {
    sku: "TEE-NVY-M",
    name: "Essential Crew Tee - Navy / M",
    unitPrice: 8.50,
    unit: "EA",
    aliases: ["navy tshirt", "navy tee medium", "crew neck navy", "essential tee navy", "nvy tees medium", "nvy tee med", "nvy tshirt"],
  },
  {
    sku: "HOOD-BLK-M",
    name: "Heavyweight Pullover Hoodie - Black / M",
    unitPrice: 22.00,
    unit: "EA",
    aliases: ["hoodie black medium", "pullover hoodie blk", "heavyweight hoodie black", "black hoodie m", "blk heavywt hodie", "blk hvy hoodie", "blk heavyweight hodie"],
  },
  {
    sku: "HOOD-BLK-L",
    name: "Heavyweight Pullover Hoodie - Black / L",
    unitPrice: 22.00,
    unit: "EA",
    aliases: ["hoodie black large", "pullover hoodie blk l", "heavyweight hoodie black l", "black hoodie l"],
  },
  {
    sku: "HOOD-GRY-M",
    name: "Heavyweight Pullover Hoodie - Heather Grey / M",
    unitPrice: 22.00,
    unit: "EA",
    aliases: ["grey hoodie", "heather grey hoodie", "gray hoodie medium", "pullover grey m", "gry hoodey med", "grey hoodey", "gry hoodie med"],
  },
  {
    sku: "CREW-BLK-M",
    name: "Midweight Crewneck Sweatshirt - Black / M",
    unitPrice: 18.75,
    unit: "EA",
    aliases: ["crewneck sweatshirt black", "black crewneck", "midweight crew black", "sweatshirt blk m", "blk crwneck sweatshrt", "crewnck sweatshrt blk", "blk crewneck sweatshirt"],
  },
  {
    sku: "CREW-NVY-L",
    name: "Midweight Crewneck Sweatshirt - Navy / L",
    unitPrice: 18.75,
    unit: "EA",
    aliases: ["crewneck sweatshirt navy", "navy crewneck", "midweight crew navy", "sweatshirt nvy l"],
  },
  {
    sku: "JGR-BLK-M",
    name: "Slim Fit Jogger - Black / M",
    unitPrice: 16.25,
    unit: "EA",
    aliases: ["jogger black", "black joggers", "slim jogger blk", "jogger pants black medium", "blk jogger pants med", "blk joggr med"],
  },
  {
    sku: "JGR-BLK-L",
    name: "Slim Fit Jogger - Black / L",
    unitPrice: 16.25,
    unit: "EA",
    aliases: ["jogger black large", "black joggers l", "slim jogger blk l"],
  },
  {
    sku: "JGR-GRY-M",
    name: "Slim Fit Jogger - Heather Grey / M",
    unitPrice: 16.25,
    unit: "EA",
    aliases: ["grey jogger", "heather grey jogger", "gray joggers medium", "jogger pants grey", "gry joggrs med", "grey joger med"],
  },
  {
    sku: "DNM-IND-32",
    name: 'Straight Leg Denim - Indigo / 32"',
    unitPrice: 24.00,
    unit: "EA",
    aliases: ["denim indigo", "indigo jeans 32", "straight leg jeans", "denim pants indigo", "jeans indigo 32", "indgo denim jns 32", "indgo jeans"],
  },
  {
    sku: "DNM-BLK-32",
    name: 'Straight Leg Denim - Black / 32"',
    unitPrice: 24.00,
    unit: "EA",
    aliases: ["black denim", "black jeans 32", "straight leg black", "denim pants black 32"],
  },
  {
    sku: "SHT-KHK-M",
    name: "Chino Short - Khaki / M",
    unitPrice: 14.50,
    unit: "EA",
    aliases: ["chino shorts khaki", "khaki shorts", "chino short medium", "shorts khaki m", "khki chino shrts", "khaki chno shrts med"],
  },
  {
    sku: "SHT-NVY-M",
    name: "Chino Short - Navy / M",
    unitPrice: 14.50,
    unit: "EA",
    aliases: ["chino shorts navy", "navy shorts", "chino short navy medium", "nvy chno shrts med", "nvy chino shrts"],
  },
  {
    sku: "JKT-BLK-M",
    name: "Lightweight Bomber Jacket - Black / M",
    unitPrice: 34.00,
    unit: "EA",
    aliases: ["bomber jacket black", "black bomber", "lightweight jacket blk", "bomber blk m", "bombr jackt blk", "blk bombr jacket"],
  },
  {
    sku: "JKT-OLV-L",
    name: "Lightweight Bomber Jacket - Olive / L",
    unitPrice: 34.00,
    unit: "EA",
    aliases: ["bomber jacket olive", "olive bomber", "green bomber jacket", "bomber olv l", "olve bombr jacket lrg", "olv bomber lrg"],
  },
  {
    sku: "CAP-BLK",
    name: "Structured 6-Panel Cap - Black",
    unitPrice: 6.75,
    unit: "EA",
    aliases: ["cap black", "black cap", "6 panel cap", "structured cap blk", "hat black", "blk 6panl cap", "blk 6 panl cap"],
  },
  {
    sku: "CAP-NVY",
    name: "Structured 6-Panel Cap - Navy",
    unitPrice: 6.75,
    unit: "EA",
    aliases: ["cap navy", "navy cap", "6 panel cap navy", "structured cap navy", "hat navy", "nvy cap structurd"],
  },
  {
    sku: "SCK-BLK-OS",
    name: "Athletic Crew Sock - Black / One Size",
    unitPrice: 3.25,
    unit: "PR",
    aliases: ["crew sock black", "black socks", "athletic socks blk", "socks black", "blk crew soks", "blk soks"],
  },
  {
    sku: "SCK-WHT-OS",
    name: "Athletic Crew Sock - White / One Size",
    unitPrice: 3.25,
    unit: "PR",
    aliases: ["crew sock white", "white socks", "athletic socks wht", "socks white", "wht crew soks", "wht soks"],
  },
  {
    sku: "BNE-BLK-OS",
    name: "Knit Beanie - Black / One Size",
    unitPrice: 5.50,
    unit: "EA",
    aliases: ["beanie black", "black beanie", "knit beanie blk", "winter beanie black", "knit beane blk", "blk beane"],
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
    if (queryWords.some((qw) => qw === tw)) {
      score += 3;
    } else if (queryWords.some((qw) => qw.includes(tw) || tw.includes(qw))) {
      score += 1;
    }
  }

  const matchedCount = targetWords.filter((tw) =>
    queryWords.some((qw) => qw === tw || qw.includes(tw) || tw.includes(qw))
  ).length;
  if (targetWords.length > 0 && matchedCount / targetWords.length >= 0.8) {
    score += 2;
  }

  return score;
}
