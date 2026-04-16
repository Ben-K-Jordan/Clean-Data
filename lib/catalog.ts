export interface CatalogItem {
  sku: string;
  name: string;
  unitPrice: number;
  unit: string;
  aliases: string[];
}

export const catalog: CatalogItem[] = [
  {
    sku: "SKU-4421",
    name: '1/2" Copper Pipe Type L - 10ft',
    unitPrice: 12.4,
    unit: "EA",
    aliases: ["copper pipe", "1/2 copper", "type l pipe", "copper tubing half inch"],
  },
  {
    sku: "SKU-4422",
    name: '3/4" Copper Pipe Type L - 10ft',
    unitPrice: 18.75,
    unit: "EA",
    aliases: ["3/4 copper", "three quarter copper pipe"],
  },
  {
    sku: "SKU-1190",
    name: '1/2" PVC Elbow 90 Degree',
    unitPrice: 0.89,
    unit: "EA",
    aliases: ["pvc elbow", "90 degree elbow", "half inch elbow", "pvc 90"],
  },
  {
    sku: "SKU-1195",
    name: '3/4" PVC Tee Fitting',
    unitPrice: 1.25,
    unit: "EA",
    aliases: ["pvc tee", "tee fitting", "3/4 tee"],
  },
  {
    sku: "SKU-2200",
    name: "PVC Cement - 8oz",
    unitPrice: 6.5,
    unit: "EA",
    aliases: ["pvc glue", "pvc cement", "pipe cement", "solvent cement"],
  },
  {
    sku: "SKU-3010",
    name: "Teflon Tape 1/2\" x 520\"",
    unitPrice: 1.99,
    unit: "EA",
    aliases: ["teflon tape", "thread tape", "ptfe tape", "pipe tape"],
  },
  {
    sku: "SKU-5500",
    name: '1/2" Ball Valve - Brass',
    unitPrice: 14.25,
    unit: "EA",
    aliases: ["ball valve", "brass valve", "shut off valve", "shutoff"],
  },
  {
    sku: "SKU-5510",
    name: '3/4" Gate Valve - Brass',
    unitPrice: 22.5,
    unit: "EA",
    aliases: ["gate valve", "3/4 valve", "brass gate valve"],
  },
  {
    sku: "SKU-6600",
    name: "Pipe Insulation Foam 1/2\" x 6ft",
    unitPrice: 3.75,
    unit: "EA",
    aliases: ["pipe insulation", "foam insulation", "pipe wrap"],
  },
  {
    sku: "SKU-7700",
    name: "Stainless Steel Hose Clamp - 1\"",
    unitPrice: 2.1,
    unit: "EA",
    aliases: ["hose clamp", "ss clamp", "stainless clamp", "pipe clamp"],
  },
  {
    sku: "SKU-8800",
    name: '1/2" Copper Coupling',
    unitPrice: 2.85,
    unit: "EA",
    aliases: ["copper coupling", "coupling", "pipe coupling", "1/2 coupling"],
  },
  {
    sku: "SKU-9900",
    name: "Flux Paste - 4oz",
    unitPrice: 5.25,
    unit: "EA",
    aliases: ["flux", "soldering flux", "flux paste", "pipe flux"],
  },
];

export function findBestMatch(query: string): CatalogItem | null {
  const q = query.toLowerCase();

  // Direct SKU match
  const skuMatch = catalog.find(
    (item) => item.sku.toLowerCase() === q || q.includes(item.sku.toLowerCase())
  );
  if (skuMatch) return skuMatch;

  // Alias match — score by number of matching words
  let bestScore = 0;
  let bestItem: CatalogItem | null = null;

  for (const item of catalog) {
    for (const alias of item.aliases) {
      const aliasWords = alias.toLowerCase().split(/\s+/);
      const score = aliasWords.filter((w) => q.includes(w)).length;
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }
    // Also check product name
    const nameWords = item.name.toLowerCase().split(/\s+/);
    const nameScore = nameWords.filter((w) => q.includes(w)).length;
    if (nameScore > bestScore) {
      bestScore = nameScore;
      bestItem = item;
    }
  }

  return bestScore >= 1 ? bestItem : null;
}
