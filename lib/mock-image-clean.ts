import { CleanResult } from "./types";

/**
 * Mock response for image uploads — returns a hardcoded set of line items
 * that simulates AI vision reading a handwritten order.
 * Designed for demo purposes without needing an API key.
 */
export function mockImageClean(): CleanResult {
  // Simulate some processing delay variation
  const items = [
    {
      product: 'Hex Cap Screw 1/2"-13 x 2" - Grade 5, Zinc',
      sku: "FAS-HXB-050",
      quantity: 500,
      unit: "EA",
      unitPrice: 0.32,
      confidence: 0.96,
      originalText: "Hex bolts 1/2-13 x 2 - 500",
    },
    {
      product: 'Hex Nut 1/2"-13 - Grade 5, Zinc',
      sku: "FAS-HXN-050",
      quantity: 500,
      unit: "EA",
      unitPrice: 0.11,
      confidence: 0.94,
      originalText: "hex nuts 1/2-13 - 500",
    },
    {
      product: 'Pipe Nipple 3/4" x 6" - Sch 40, Galvanized',
      sku: "PIP-NPL-034G",
      quantity: 300,
      unit: "EA",
      unitPrice: 2.65,
      confidence: 0.92,
      originalText: "Galv nipples 3/4 x 6 - 300",
    },
    {
      product: 'Elbow 90° 3/4" NPT - Malleable, Galvanized',
      sku: "FIT-ELB-034",
      quantity: 250,
      unit: "EA",
      unitPrice: 1.15,
      confidence: 0.95,
      originalText: "90 elbows 3/4 galv - 250",
    },
    {
      product: 'Coupling 3/4" NPT - Malleable, Galvanized',
      sku: "FIT-CPL-034",
      quantity: 200,
      unit: "EA",
      unitPrice: 1.48,
      confidence: 0.91,
      originalText: "couplings 3/4 galv - 200",
    },
    {
      product: 'Ball Valve 3/4" NPT - Brass, Full Port',
      sku: "VLV-BAL-034",
      quantity: 100,
      unit: "EA",
      unitPrice: 12.85,
      confidence: 0.93,
      originalText: "Brass ball valve 3/4 FP - 100",
    },
    {
      product: 'Spiral Wound Gasket 1-1/2" - 150#, 304 SS',
      sku: "GSK-SPW-150",
      quantity: 120,
      unit: "EA",
      unitPrice: 4.6,
      confidence: 0.89,
      originalText: "Spiral gaskets 1-1/2 - 120",
    },
    {
      product: "Safety Glasses - Clear, Anti-Fog",
      sku: "SAF-GLS-CLR",
      quantity: 200,
      unit: "EA",
      unitPrice: 1.95,
      confidence: 0.94,
      originalText: "Safety glasses clear - 200",
    },
    {
      product: "Nitrile-Coated Work Gloves - Large",
      sku: "SAF-GLV-L",
      quantity: 300,
      unit: "PR",
      unitPrice: 2.35,
      confidence: 0.97,
      originalText: "Nitrile gloves lg - 300 pr",
    },
    {
      product: "Ball Bearing 6205-2RS - Double Sealed",
      sku: "BRG-BAL-6205",
      quantity: 40,
      unit: "EA",
      unitPrice: 8.4,
      confidence: 0.93,
      originalText: "6205 bearings 2RS - 40",
    },
  ];

  const matched = items.filter((i) => i.confidence > 0);

  return {
    items,
    summary: {
      totalItems: items.length,
      matchRate: items.length > 0 ? matched.length / items.length : 0,
      processingTimeMs: 0, // will be overwritten by the caller
    },
    insights: {
      typosFixed: 4,
      abbreviationsResolved: 12,
      skusDirect: 0,
      fuzzyMatches: 10,
    },
  };
}
