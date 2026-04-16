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

// Simple edit distance (Levenshtein) to measure typo severity
function editDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// Measure how "clean" the query was compared to the matched product
function computeConfidence(query: string, match: { name: string; sku: string; aliases: string[] }): number {
  const q = query.toLowerCase().trim();

  // Direct SKU match — very high confidence
  if (q.includes(match.sku.toLowerCase())) {
    return 0.96 + Math.random() * 0.03; // 96-99%
  }

  // Compare query against all aliases and product name, find best similarity
  const candidates = [match.name.toLowerCase(), ...match.aliases.map(a => a.toLowerCase())];
  let bestSimilarity = 0;

  for (const candidate of candidates) {
    // Word-level overlap
    const qWords = q.split(/[\s,/\-]+/).filter(w => w.length > 1);
    const cWords = candidate.split(/[\s,/\-]+/).filter(w => w.length > 1);

    let exactMatches = 0;
    let fuzzyMatches = 0;
    let totalTypoDistance = 0;

    for (const cw of cWords) {
      const exactMatch = qWords.find(qw => qw === cw);
      if (exactMatch) {
        exactMatches++;
      } else {
        // Find closest query word
        let bestDist = Infinity;
        for (const qw of qWords) {
          const dist = editDistance(qw, cw);
          if (dist < bestDist) bestDist = dist;
        }
        // Count as fuzzy match if edit distance is small relative to word length
        if (bestDist <= Math.max(1, Math.floor(cw.length * 0.4))) {
          fuzzyMatches++;
          totalTypoDistance += bestDist;
        }
      }
    }

    const totalMatched = exactMatches + fuzzyMatches;
    if (cWords.length === 0) continue;

    // Base similarity from word coverage
    const coverage = totalMatched / cWords.length;
    // Penalize for typos — more edit distance = lower confidence
    const typoPenalty = totalTypoDistance * 0.03;
    // Bonus for exact matches over fuzzy
    const exactBonus = cWords.length > 0 ? (exactMatches / cWords.length) * 0.1 : 0;

    const similarity = coverage - typoPenalty + exactBonus;
    if (similarity > bestSimilarity) bestSimilarity = similarity;
  }

  // Map similarity to confidence range
  if (bestSimilarity >= 0.9) {
    return 0.93 + Math.random() * 0.05; // 93-98% — clean, mostly exact words
  } else if (bestSimilarity >= 0.7) {
    return 0.82 + Math.random() * 0.10; // 82-92% — decent match, some abbreviations
  } else if (bestSimilarity >= 0.4) {
    return 0.68 + Math.random() * 0.12; // 68-80% — messy, typos, abbreviations
  } else {
    return 0.55 + Math.random() * 0.12; // 55-67% — very fuzzy match
  }
}

function matchToCatalog(
  query: string,
  qty: number,
  unit: string,
  price?: number
): LineItem {
  const match = findBestMatch(query);

  if (match) {
    const confidence = Math.round(computeConfidence(query, match) * 100) / 100;

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
