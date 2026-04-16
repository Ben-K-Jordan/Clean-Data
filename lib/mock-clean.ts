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

    // Handle multi-item lines ("30 copper couplings and 12 tubes of flux paste")
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
    mode: "mock",
  };
}

function isNonDataLine(line: string): boolean {
  const lower = line.toLowerCase().replace(/^[-•*]\s*/, "");
  const skipPatterns = [
    /^(hi|hey|hello|dear|to whom)/,
    /^(thanks|thank you|regards|best|cheers|sincerely)/,
    /^(from|to|subject|date|sent):/,
    /^(please|could you|can you|i would|we need|i'd like to)/,
    /^(let me know|looking forward|attached|see below)/,
    /^[-=]+$/,
    /^(item|product|description|qty|quantity|price|unit|sku|total)[,|\t]/i,
    /^(purchase order$|po number|^date:|vendor:|bill to|ship to|authorized)/,
    /^(subtotal|tax \(|^total:|payment terms|net \d)/,
    /^(can you get|customer wants|here'?s what)/,
    /^(mike|sarah|john|manager)$/,
    /^\$[\d,.]+$/,
    /^need to place/,
  ];
  return skipPatterns.some((p) => p.test(lower));
}

function splitMultiItem(line: string): string[] {
  // "Also need 30 copper couplings and 12 tubes of flux paste"
  // Split on " and " only if both sides contain a number
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

function extractLineItem(line: string): LineItem | null {
  const cleaned = line.replace(/^[-•*]\s*/, "").trim();
  if (!cleaned || cleaned.length < 3) return null;

  // Try "product ... need about QTY of those" — check first to avoid CSV parser grabbing wrong numbers
  const needAboutMatch = cleaned.match(
    /^(.+?)\s*[-–]\s*need\s+(?:about\s+)?(\d+)/i
  );
  if (needAboutMatch) {
    return matchToCatalog(
      needAboutMatch[1].trim(),
      parseInt(needAboutMatch[2]),
      "EA",
      undefined
    );
  }

  // Try CSV/TSV format: product, qty, unit, price (only when separated by tab or pipe, or comma followed by a number)
  const csvMatch = cleaned.match(
    /^["']?(.+?)["']?\s*[|\t]\s*(\d+)\s*[|\t]?\s*(ea|each|pcs|units?|ft|lf|box|case|roll)?\s*[|\t]?\s*\$?([\d.]+)?/i
  );
  if (csvMatch) {
    return matchToCatalog(
      csvMatch[1].trim(),
      parseInt(csvMatch[2]),
      csvMatch[3] || "EA",
      csvMatch[4] ? parseFloat(csvMatch[4]) : undefined
    );
  }

  // Try strict CSV (comma-separated): product,qty,price
  const strictCsvMatch = cleaned.match(
    /^["']?(.+?)["']?,\s*(\d+)\s*,\s*\$?([\d.]+)/i
  );
  if (strictCsvMatch) {
    return matchToCatalog(
      strictCsvMatch[1].trim(),
      parseInt(strictCsvMatch[2]),
      "EA",
      parseFloat(strictCsvMatch[3])
    );
  }

  // Try "QTY units/rolls/cans of PRODUCT"
  const unitsOfMatch = cleaned.match(
    /^(\d+)\s*(?:units?|pcs|rolls?|cans?|tubes?|boxes?)\s+(?:of\s+)?(.+?)(?:\s*\(.*\))?$/i
  );
  if (unitsOfMatch && unitsOfMatch[2].trim().length > 2) {
    return matchToCatalog(
      unitsOfMatch[2].trim(),
      parseInt(unitsOfMatch[1]),
      "EA",
      undefined
    );
  }

  // Try "QTYx PRODUCT" (e.g., "50x 3/4" copper pipes")
  const qtyXMatch = cleaned.match(
    /^(\d+)\s*[x×]\s*(.+?)(?:\s*[@$]\s*([\d.]+))?$/i
  );
  if (qtyXMatch) {
    return matchToCatalog(
      qtyXMatch[2].trim(),
      parseInt(qtyXMatch[1]),
      "EA",
      qtyXMatch[3] ? parseFloat(qtyXMatch[3]) : undefined
    );
  }

  // Try "QTY PRODUCT" (e.g., "300 PVC elbows" or "24 cans of PVC cement")
  const qtyProductMatch = cleaned.match(
    /^(\d+)\s+(.+?)(?:\s*[@$]\s*([\d.]+))?$/i
  );
  if (qtyProductMatch && qtyProductMatch[2].trim().length > 2) {
    const desc = qtyProductMatch[2]
      .replace(/^(?:cans?|rolls?|tubes?|boxes?)\s+(?:of\s+)?/i, "")
      .trim();
    if (!/^\$?[\d.,]+$/.test(desc) && !/^(ea|each|pcs|units?)$/i.test(desc)) {
      return matchToCatalog(
        desc,
        parseInt(qtyProductMatch[1]),
        "EA",
        qtyProductMatch[3] ? parseFloat(qtyProductMatch[3]) : undefined
      );
    }
  }

  // Try SKU in line with quantity: "SKU-4421 | 500 | EA"
  const skuMatch = cleaned.match(
    /(SKU-\d+)\s*[|,\t:]\s*(\d+)\s*[|,\t]?\s*(ea|each|pcs|units?)?/i
  );
  if (skuMatch) {
    return matchToCatalog(
      skuMatch[1],
      parseInt(skuMatch[2]),
      skuMatch[3] || "EA",
      undefined
    );
  }

  // Try tabular: "Product Name | SKU-XXXX | qty | unit | $price"
  const tableMatch = cleaned.match(
    /^(.+?)\s*\|\s*(SKU-\d+)\s*\|\s*(\d+)\s*\|\s*(\w+)\s*\|\s*\$?([\d.]+)/i
  );
  if (tableMatch) {
    return matchToCatalog(
      tableMatch[1].trim(),
      parseInt(tableMatch[3]),
      tableMatch[4],
      parseFloat(tableMatch[5])
    );
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
    return {
      product: match.name,
      sku: match.sku,
      quantity: qty,
      unit: match.unit,
      unitPrice: price ?? match.unitPrice,
      confidence: 0.95,
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
