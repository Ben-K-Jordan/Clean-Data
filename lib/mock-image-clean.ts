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
      product: "Essential Crew Tee - Black / M",
      sku: "TEE-BLK-M",
      quantity: 500,
      unit: "EA",
      unitPrice: 8.5,
      confidence: 0.96,
      originalText: "Blk crew tees (M) - 500",
    },
    {
      product: "Essential Crew Tee - White / M",
      sku: "TEE-WHT-M",
      quantity: 275,
      unit: "EA",
      unitPrice: 8.5,
      confidence: 0.94,
      originalText: "White tees med - 275",
    },
    {
      product: "Essential Crew Tee - Navy / M",
      sku: "TEE-NVY-M",
      quantity: 200,
      unit: "EA",
      unitPrice: 8.5,
      confidence: 0.92,
      originalText: "Navy tee M - 200",
    },
    {
      product: "Heavyweight Pullover Hoodie - Black / M",
      sku: "HOOD-BLK-M",
      quantity: 300,
      unit: "EA",
      unitPrice: 22.0,
      confidence: 0.95,
      originalText: "Hoodies blk heavyweight - 300",
    },
    {
      product: "Heavyweight Pullover Hoodie - Heather Grey / M",
      sku: "HOOD-GRY-M",
      quantity: 175,
      unit: "EA",
      unitPrice: 22.0,
      confidence: 0.91,
      originalText: "Grey hoodie M - 175",
    },
    {
      product: "Slim Fit Jogger - Black / M",
      sku: "JGR-BLK-M",
      quantity: 400,
      unit: "EA",
      unitPrice: 16.25,
      confidence: 0.93,
      originalText: "Joggers blk M - 400",
    },
    {
      product: "Straight Leg Denim - Indigo / 32\"",
      sku: "DNM-IND-32",
      quantity: 150,
      unit: "EA",
      unitPrice: 24.0,
      confidence: 0.89,
      originalText: "Denim indigo 32 - 150",
    },
    {
      product: "Lightweight Bomber Jacket - Black / M",
      sku: "JKT-BLK-M",
      quantity: 125,
      unit: "EA",
      unitPrice: 34.0,
      confidence: 0.94,
      originalText: "Bomber jacket blk - 125",
    },
    {
      product: "Structured 6-Panel Cap - Black",
      sku: "CAP-BLK",
      quantity: 600,
      unit: "EA",
      unitPrice: 6.75,
      confidence: 0.97,
      originalText: "Caps black - 600",
    },
    {
      product: "Midweight Crewneck Sweatshirt - Black / M",
      sku: "CREW-BLK-M",
      quantity: 150,
      unit: "EA",
      unitPrice: 18.75,
      confidence: 0.93,
      originalText: "Crewneck sweatshirt blk - 150",
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
