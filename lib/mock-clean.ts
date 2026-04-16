import { CleanResult, LineItem } from "./types";
import { findBestMatch } from "./catalog";

export function mockClean(rawData: string): CleanResult {
  const start = performance.now();
  const lines = rawData
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const items: LineItem[] = [];

  for (const line of lines) {
    if (isNonDataLine(line)) continue;

    // Handle multi-item lines ("75 canvas tote bags and 30 soy candles")
    const segments = splitMultiItem(line);
    for (const seg of segments) {
      const extracted = extractLineItem(seg);
      if (extracted) {
        items.push(extracted);
      }
    }
  }

  const matched = items.filter((i) => i.confidence > 0);
  const elapsed = performance.now() - start;

  return {
    items,
    summary: {
      totalItems: items.length,
      matchRate: items.length > 0 ? matched.length / items.length : 0,
      processingTimeMs: Math.round(elapsed),
    },
  };
}

function isNonDataLine(line: string): boolean {
  const lower = line.toLowerCase().replace(/^[-•*]\s*/, "").trim();
  const skipPatterns = [
    /^(hi|hey|hello|dear|to whom)/,
    /^(thanks|thank you|regards|best|cheers|sincerely)/,
    /^(from|to|subject|date|sent):/,
    /^(please|could you|can you|i would|we need|i'd like to|we're running)/,
    /^(let me know|looking forward|attached|see below)/,
    /^[-=]+$/,
    // Table headers
    /^(item|product|description|qty|quantity|price|unit|sku|total)[,|\t\s]/i,
    /\|\s*(qty|quantity|uom|unit price)\s*\|?/i,
    // PO metadata
    /^(purchase order$|po number|^date:|vendor:|bill to|ship to|authorized)/,
    /^(subtotal|tax\s*\(|^total:|payment terms|net \d)/,
    // Conversational lines
    /^(can you|customer wants|here'?s what|we have a)/,
    // Standalone names/signatures
    /^[a-z]+$/,
    // Standalone prices
    /^\$[\d,.]+$/,
    // Separator lines
    /^[|\-=\s]+$/,
  ];
  return skipPatterns.some((p) => p.test(lower));
}

function splitMultiItem(line: string): string[] {
  const cleaned = line
    .replace(/^[-•*]\s*/, "")
    .replace(/^also\s+need\s+/i, "")
    .replace(/^need\s+/i, "");

  const parts = cleaned.split(/\s+and\s+/i);
  if (parts.length > 1 && parts.every((p) => /\d/.test(p))) {
    return parts;
  }
  return [cleaned];
}

function parseQty(raw: string): number | null {
  const n = parseInt(raw, 10);
  if (isNaN(n) || n <= 0) return null;
  return n;
}

function extractLineItem(line: string): LineItem | null {
  const cleaned = line.replace(/^[-•*]\s*/, "").trim();
  if (!cleaned || cleaned.length < 3) return null;

  // 1. SKU pattern first — "SKU-XXXX | qty" or "qty units of SKU-XXXX"
  const skuWithQtyAfter = cleaned.match(
    /(SKU-\d+)\s*[|,\t:]\s*(\d+)/i
  );
  if (skuWithQtyAfter) {
    const qty = parseQty(skuWithQtyAfter[2]);
    if (qty) return matchToCatalog(skuWithQtyAfter[1], qty, "EA", undefined);
  }

  const skuWithQtyBefore = cleaned.match(
    /(\d+)\s*(?:units?\s+(?:of\s+)?)?(?:.*?)?(SKU-\d+)/i
  );
  if (skuWithQtyBefore) {
    const qty = parseQty(skuWithQtyBefore[1]);
    if (qty) return matchToCatalog(skuWithQtyBefore[2], qty, "EA", undefined);
  }

  // 2. Tabular: "Product Name | SKU-XXXX | qty | unit | $price"
  const tableMatch = cleaned.match(
    /^(.+?)\s*\|\s*(SKU-\d+)\s*\|\s*(\d+)\s*\|\s*(\w+)\s*\|\s*\$?([\d.]+)/i
  );
  if (tableMatch) {
    const qty = parseQty(tableMatch[3]);
    if (qty) return matchToCatalog(tableMatch[1].trim(), qty, tableMatch[4], parseFloat(tableMatch[5]));
  }

  // 3. "product ... need about QTY of those"
  const needAboutMatch = cleaned.match(
    /^(.+?)\s*[-–]\s*need\s+(?:about\s+)?(\d+)/i
  );
  if (needAboutMatch) {
    const qty = parseQty(needAboutMatch[2]);
    if (qty) return matchToCatalog(needAboutMatch[1].trim(), qty, "EA", undefined);
  }

  // 4. Strict CSV: product,qty,$price
  const strictCsvMatch = cleaned.match(
    /^["']?(.+?)["']?,\s*(\d+)\s*,\s*\$?([\d.]+)/i
  );
  if (strictCsvMatch) {
    const qty = parseQty(strictCsvMatch[2]);
    if (qty) return matchToCatalog(strictCsvMatch[1].trim(), qty, "EA", parseFloat(strictCsvMatch[3]));
  }

  // 5. Pipe/tab separated: "product | qty | unit | $price"
  const pipeSepMatch = cleaned.match(
    /^["']?(.+?)["']?\s*[|\t]\s*(\d+)\s*[|\t]?\s*(ea|each|pcs|units?)?/i
  );
  if (pipeSepMatch) {
    const qty = parseQty(pipeSepMatch[2]);
    if (qty) {
      // Check if there's a price further on
      const priceMatch = cleaned.match(/\$?([\d]+\.[\d]{2})\s*$/);
      return matchToCatalog(
        pipeSepMatch[1].trim(), qty, pipeSepMatch[3] || "EA",
        priceMatch ? parseFloat(priceMatch[1]) : undefined
      );
    }
  }

  // 6. "QTY units/rolls/etc of PRODUCT"
  const unitsOfMatch = cleaned.match(
    /^(\d+)\s*(?:units?|pcs|packs?|boxes?)\s+(?:of\s+)?(.+?)(?:\s*\(.*\))?$/i
  );
  if (unitsOfMatch && unitsOfMatch[2].trim().length > 2) {
    const qty = parseQty(unitsOfMatch[1]);
    if (qty) return matchToCatalog(unitsOfMatch[2].trim(), qty, "EA", undefined);
  }

  // 7. "QTYx PRODUCT"
  const qtyXMatch = cleaned.match(
    /^(\d+)\s*[x×]\s*(.+?)(?:\s*[@$]\s*([\d.]+))?$/i
  );
  if (qtyXMatch && qtyXMatch[2].trim().length > 2) {
    const qty = parseQty(qtyXMatch[1]);
    if (qty) return matchToCatalog(qtyXMatch[2].trim(), qty, "EA", qtyXMatch[3] ? parseFloat(qtyXMatch[3]) : undefined);
  }

  // 8. "QTY PRODUCT" (generic — must be last)
  const qtyProductMatch = cleaned.match(
    /^(\d+)\s+(.+?)(?:\s*[@$]\s*([\d.]+))?$/i
  );
  if (qtyProductMatch && qtyProductMatch[2].trim().length > 2) {
    const desc = qtyProductMatch[2]
      .replace(/^(?:packs?|boxes?)\s+(?:of\s+)?/i, "")
      .trim();
    if (!/^\$?[\d.,]+$/.test(desc) && !/^(ea|each|pcs|units?)$/i.test(desc)) {
      const qty = parseQty(qtyProductMatch[1]);
      if (qty) return matchToCatalog(desc, qty, "EA", qtyProductMatch[3] ? parseFloat(qtyProductMatch[3]) : undefined);
    }
  }

  return null;
}

function matchToCatalog(
  query: string,
  qty: number,
  unit: string,
  price?: number
): LineItem {
  const match = findBestMatch(query);

  if (match) {
    // Vary confidence based on how closely the query matches
    // SKU matches get highest confidence, fuzzy name matches get lower
    const hasSku = /[A-Z]{2,}-[A-Z]{2,}/i.test(query);
    const queryWords = query.toLowerCase().split(/[\s,/]+/).filter(w => w.length > 1);
    const nameWords = match.name.toLowerCase().split(/[\s,/\-]+/).filter(w => w.length > 1);
    const overlap = nameWords.filter(nw => queryWords.some(qw => qw === nw || nw.includes(qw) || qw.includes(nw))).length;
    const ratio = nameWords.length > 0 ? overlap / nameWords.length : 0;

    let confidence: number;
    if (hasSku) {
      confidence = 0.97 + Math.random() * 0.02; // 97-99%
    } else if (ratio > 0.6) {
      confidence = 0.88 + Math.random() * 0.09; // 88-97%
    } else {
      confidence = 0.72 + Math.random() * 0.15; // 72-87%
    }
    confidence = Math.round(confidence * 100) / 100;

    return {
      product: match.name,
      sku: match.sku,
      quantity: qty,
      unit: match.unit,
      unitPrice: price ?? match.unitPrice,
      confidence,
    };
  }

  return {
    product: query,
    sku: "UNKNOWN",
    quantity: qty,
    unit: unit.toUpperCase(),
    unitPrice: price ?? 0,
    confidence: 0,
  };
}
