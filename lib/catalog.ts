export interface CatalogItem {
  sku: string;
  name: string;
  unitPrice: number;
  unit: string;
  aliases: string[];
}

// Product catalog for an industrial distributor
// (pipe/valves/fittings, fasteners, electrical, safety, and MRO supplies).
// Prices are distributor cost per unit.
export const catalog: CatalogItem[] = [
  {
    sku: "FAS-HXB-050",
    name: 'Hex Cap Screw 1/2"-13 x 2" - Grade 5, Zinc',
    unitPrice: 0.32,
    unit: "EA",
    aliases: ["hex bolts 1/2-13 x 2 zinc", "hex bolts 1/2-13 x 2 znc", "hex blts 1/2-13 znc", "hex bolt 1/2-13 grade 5", "1/2-13 hex cap screws grade 5 zinc", "hex cap screws 1/2-13", "grade 5 hex bolts zinc", "hex bolts 1/2-13"],
  },
  {
    sku: "FAS-HXN-050",
    name: 'Hex Nut 1/2"-13 - Grade 5, Zinc',
    unitPrice: 0.11,
    unit: "EA",
    aliases: ["hex nuts 1/2-13 zinc", "hex nts 1/2-13 zinc", "hex nuts 1/2", "zinc hex nuts 1/2-13", "hex nuts half inch"],
  },
  {
    sku: "FAS-FWS-050",
    name: 'Flat Washer 1/2" - Zinc',
    unitPrice: 0.07,
    unit: "EA",
    aliases: ["flat washers 1/2 zinc", "flat washers 1/2", "flat washrs 1/2", "1/2 flat washers zinc", "flt washers 1/2"],
  },
  {
    sku: "FAS-LAG-038",
    name: 'Lag Screw 3/8" x 3" - Hot-Dip Galvanized',
    unitPrice: 0.29,
    unit: "EA",
    aliases: ["lag screws 3/8 x 3 galv", "lag scrws 3/8 x 3 galv", "lag screws 3/8", "galv lag screws 3/8 x 3", "hot dip lag screws"],
  },
  {
    sku: "PIP-NPL-034G",
    name: 'Pipe Nipple 3/4" x 6" - Sch 40, Galvanized',
    unitPrice: 2.65,
    unit: "EA",
    aliases: ["galv pipe nipples 3/4 x 6", "galv niples 3/4 x 6", "galv pipe niple 3/4 x 6", "galvanized pipe nipples 3/4", "galv nipples 3/4", "galv niples 3/4", "pipe nipples 3/4 x 6 galv"],
  },
  {
    sku: "PIP-NPL-034B",
    name: 'Pipe Nipple 3/4" x 6" - Sch 40, Black Iron',
    unitPrice: 2.2,
    unit: "EA",
    aliases: ["black iron nipples 3/4 x 6", "blk iron niple 3/4", "blk iron niples 3/4", "black iron pipe nipples 3/4", "blk iron nipples"],
  },
  {
    sku: "FIT-ELB-034",
    name: 'Elbow 90° 3/4" NPT - Malleable, Galvanized',
    unitPrice: 1.15,
    unit: "EA",
    aliases: ["galv elbows 3/4 90 degree", "malleable elbows 3/4", "malleable elbws 3/4 90 deg", "malleable elbws 3/4", "90 degree elbows 3/4", "galv elbws 3/4", "elbows 3/4 npt"],
  },
  {
    sku: "FIT-CPL-034",
    name: 'Coupling 3/4" NPT - Malleable, Galvanized',
    unitPrice: 1.48,
    unit: "EA",
    aliases: ["malleable couplings 3/4", "cuplings 3/4 galv", "galv couplings 3/4", "pipe couplings 3/4 npt", "couplings 3/4"],
  },
  {
    sku: "VLV-BAL-034",
    name: 'Ball Valve 3/4" NPT - Brass, Full Port',
    unitPrice: 12.85,
    unit: "EA",
    aliases: ["brass ball valves 3/4 full port", "brass ball vlv 3/4", "brass ball vlvs 3/4 full port", "ball valves 3/4 brass", "ball valve 3/4 npt full port"],
  },
  {
    sku: "VLV-GAT-100",
    name: 'Gate Valve 1" NPT - Bronze',
    unitPrice: 24.5,
    unit: "EA",
    aliases: ["bronze gate valves 1 inch", "bronz gate valv 1in", "gate valves 1in bronze", "gate valve 1 inch bronze", "bronze gate vlv 1in"],
  },
  {
    sku: "GSK-SPW-150",
    name: 'Spiral Wound Gasket 1-1/2" - 150#, 304 SS',
    unitPrice: 4.6,
    unit: "EA",
    aliases: ["spiral wound gasket 1-1/2", "spiral gasket 1-1/2 150lb", "spiral wound gaskets 1-1/2 150", "sprl wound gasket", "spiral gaskets 150lb"],
  },
  {
    sku: "BRG-BAL-6205",
    name: "Ball Bearing 6205-2RS - Double Sealed",
    unitPrice: 8.4,
    unit: "EA",
    aliases: ["6205 bearings sealed", "6205 brng sealed", "ball bearing 6205 2rs", "6205-2rs sealed bearing", "bearing 6205"],
  },
  {
    sku: "PTB-VBT-A38",
    name: 'V-Belt A38 - 1/2" x 40" Classical',
    unitPrice: 6.75,
    unit: "EA",
    aliases: ["v belt a38", "v blt a38", "v-belt a38", "a38 v belt", "vbelt a38"],
  },
  {
    sku: "SAF-GLV-L",
    name: "Nitrile-Coated Work Gloves - Large",
    unitPrice: 2.35,
    unit: "PR",
    aliases: ["nitrile work gloves large", "nitrile glovs lrg", "nitrile gloves large", "work gloves nitrile lrg", "coated work gloves large"],
  },
  {
    sku: "SAF-GLS-CLR",
    name: "Safety Glasses - Clear, Anti-Fog",
    unitPrice: 1.95,
    unit: "EA",
    aliases: ["clear safety glasses", "safty glasses clear", "safety glasses clear anti fog", "safety glasses clear", "clr safety glasses"],
  },
  {
    sku: "SAF-VST-XL",
    name: "Hi-Vis Safety Vest - Class 2, XL",
    unitPrice: 7.9,
    unit: "EA",
    aliases: ["hi vis vests xl", "hi vis vest xl", "hi-vis safety vests xl", "hivis vest xl", "safety vests class 2 xl"],
  },
  {
    sku: "SAF-HAT-WHT",
    name: "Hard Hat - White, 4-Point Ratchet",
    unitPrice: 9.25,
    unit: "EA",
    aliases: ["hard hats white", "hrd hats wht", "hard hat wht", "white hard hats", "hard hats"],
  },
  {
    sku: "ELC-THN-12B",
    name: "THHN Wire 12 AWG - Black, 500 ft Spool",
    unitPrice: 89.0,
    unit: "SP",
    aliases: ["thhn wire 12awg blk", "thhn wire 12 awg black 500ft", "12 awg thhn black", "thhn 12awg black wire", "wire thhn 12 awg blk"],
  },
  {
    sku: "ELC-EMT-034",
    name: 'EMT Conduit 3/4" x 10 ft',
    unitPrice: 11.3,
    unit: "EA",
    aliases: ["emt conduit 3/4 10ft", "emt condut 3/4 10ft", "emt 3/4 conduit", "conduit emt 3/4 x 10", "3/4 emt conduit 10 ft"],
  },
  {
    sku: "CHM-THL-242",
    name: "Threadlocker - Blue 242, 10 ml",
    unitPrice: 7.25,
    unit: "EA",
    aliases: ["threadlocker blue 242", "threadlockr blu 242", "blue threadlocker 242", "thread locker blue", "threadlocker 242"],
  },
  {
    sku: "CHM-GRS-EP2",
    name: "Lithium Grease EP2 - 14 oz Cartridge",
    unitPrice: 5.9,
    unit: "EA",
    aliases: ["lithium grease ep2", "lithium greas ep2", "ep2 lithium grease", "grease cartridge ep2", "lith grease ep2 14oz"],
  },
  {
    sku: "ABR-CUT-045",
    name: 'Cut-Off Wheel 4-1/2" - Metal, Type 1',
    unitPrice: 1.4,
    unit: "EA",
    aliases: ["cutoff wheels 4-1/2 metal", "cut off wheels 4-1/2", "cutoff wheel metal", "cutting wheels metal 4-1/2", "cut-off wheels 4.5"],
  },
  {
    sku: "PLM-TPE-012",
    name: 'PTFE Thread Seal Tape 1/2" x 520"',
    unitPrice: 0.85,
    unit: "EA",
    aliases: ["ptfe thread tape 1/2", "teflon tape 1/2", "ptfe thread seal tape", "thread seal tape 1/2", "teflon thread tape"],
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
