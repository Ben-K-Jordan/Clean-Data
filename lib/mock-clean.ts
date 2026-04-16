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

    const segments = splitMultiItem(line);
    for (const seg of segments) {
      const extracted = extractLineItem(seg, line);
      if (extracted) {
        items.push(extracted);
      }
    }
  }

  const matched = items.filter((i) => i.confidence > 0);
  const elapsed = performance.now() - start;

  // Compute insights
  let typosFixed = 0;
  let abbreviationsResolved = 0;
  let skusDirect = 0;
  let fuzzyMatches = 0;

  for (const item of items) {
    if (item.confidence <= 0) continue;
    const orig = item.originalText.toLowerCase();
    const hasSku = /[A-Z]{2,}-[A-Z]{2,}/i.test(orig);

    if (hasSku) {
      skusDirect++;
    } else {
      // Count each abbreviation found in the original text
      const abbrMatches = orig.match(/\b(blk|wht|nvy|gry|grn|olv|med|lrg|sml|tee|hvy|ltwt|crwneck|crewnck|shrts|chno|soks|beane|bombr|jackt|joggrs|joger|sweatshrt|hodie|hoodey|panl|structurd|6panl|indgo|jns)\b/gi);
      if (abbrMatches) {
        abbreviationsResolved += abbrMatches.length;
      }
      // Check for likely typos by comparing words to product name
      const origWords = orig.split(/[\s,/\-]+/).filter(w => w.length > 3);
      const prodWords = item.product.toLowerCase().split(/[\s,/\-]+/).filter(w => w.length > 3);
      for (const ow of origWords) {
        if (/\b(blk|wht|nvy|gry|grn|olv|med|lrg|sml|hvy|ltwt)\b/i.test(ow)) continue; // skip standard abbreviations
        // Skip if the word appears exactly in any product word (not a typo)
        if (prodWords.some((pw) => pw === ow)) continue;
        // Skip simple plural/singular variations (tee vs tees, sock vs socks)
        if (prodWords.some((pw) => pw + "s" === ow || ow + "s" === pw)) continue;
        // Skip if it's a prefix/contained word
        if (prodWords.some((pw) => pw.startsWith(ow) || ow.startsWith(pw))) continue;
        for (const pw of prodWords) {
          const dist = editDistance(ow, pw);
          // Stricter: dist 1-2 only, and must be meaningful relative to word length
          if (dist >= 1 && dist <= 2 && dist < Math.max(pw.length, ow.length) * 0.4) {
            typosFixed++;
            break;
          }
        }
      }
      if (!hasSku && item.confidence < 0.95) {
        fuzzyMatches++;
      }
    }
  }

  return {
    items,
    summary: {
      totalItems: items.length,
      matchRate: items.length > 0 ? matched.length / items.length : 0,
      processingTimeMs: Math.round(elapsed),
    },
    insights: {
      typosFixed: Math.min(typosFixed, items.length), // cap at reasonable number
      abbreviationsResolved,
      skusDirect,
      fuzzyMatches,
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
    // Forwarded message headers
    /^-*\s*forward/,
    /^-*\s*from\s+\w+'?s?\s+(email|text|imessage|message)/,
    // Section labels without quantities
    /^(hoodies?|joggers?|sweatshirts?|outerwear|accessories|denim|shorts?|misc)\b.*[:!]/i,
    /^\^+\s/,
    // Short conversational fragments (only if no numbers — they might contain qty)
    /^(yo\s|ok\s|k\s|lol|wait\s|um+\s)[^0-9]*$/,
  ];
  return skipPatterns.some((p) => p.test(lower));
}

function splitMultiItem(line: string): string[] {
  const cleaned = line
    .replace(/^[-•*►→▸]\s*/, "")
    .replace(/^(?:also|oh\s+and|and\s+also|plus)\s+(?:need\s+)?/i, "")
    .replace(/^(?:need|throw\s+in|add)\s+/i, "");

  // Split on " and ", " + ", " & " between items that both have numbers
  const parts = cleaned.split(/\s+(?:and|&|\+)\s+/i);
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

function extractLineItem(line: string, rawLine?: string): LineItem | null {
  const originalLine = rawLine || line;
  let cleaned = line.replace(/^[-•*►→▸]\s*/, "").trim();
  if (!cleaned || cleaned.length < 3) return null;

  // Pre-clean: strip leading conversational junk
  cleaned = cleaned
    .replace(/^(?:oh\s+and\s+)?(?:jake|sarah|marcus|devon|he|she|they)\s+(?:said|says|wants?|asked|mentioned)\s+(?:to\s+)?(?:add|throw\s+in|include|get)?\s*/i, "")
    .replace(/^(?:oh\s+and|and\s+also|also|plus)\s+(?:throw\s+in|add|get|need)?\s*/i, "")
    .replace(/^(?:throw\s+in|add|need|get)\s+/i, "")
    .trim();

  // Pre-clean: strip trailing junk words/punctuation
  cleaned = cleaned
    .replace(/\s*[!?]+\s*$/, "")
    .replace(/\s+(?:pls|plz|please|asap|urgent|lol|lmk|smh|tbh|ngl|ty|thx|tho|thnx|idk|fyi|btw|imo|rn)\s*$/i, "")
    .replace(/\s*\((?:the\s+)?(?:essential|heavyweight|lightweight|midweight|slim|structured)?\s*(?:ones?|style|type|kind|version)\)\s*$/i, "")
    .trim();

  // 1. SKU pattern first — "SKU-XXXX | qty" or "qty units of SKU-XXXX"
  const skuWithQtyAfter = cleaned.match(
    /(SKU-\d+)\s*[|,\t:]\s*(\d+)/i
  );
  if (skuWithQtyAfter) {
    const qty = parseQty(skuWithQtyAfter[2]);
    if (qty) return matchToCatalog(skuWithQtyAfter[1], qty, "EA", undefined, originalLine);
  }

  const skuWithQtyBefore = cleaned.match(
    /(\d+)\s*(?:units?\s+(?:of\s+)?)?(?:.*?)?(SKU-\d+)/i
  );
  if (skuWithQtyBefore) {
    const qty = parseQty(skuWithQtyBefore[1]);
    if (qty) return matchToCatalog(skuWithQtyBefore[2], qty, "EA", undefined, originalLine);
  }

  // 2. Tabular: "Product Name | SKU-XXXX | qty | unit | $price"
  const tableMatch = cleaned.match(
    /^(.+?)\s*\|\s*(SKU-\d+)\s*\|\s*(\d+)\s*\|\s*(\w+)\s*\|\s*\$?([\d.]+)/i
  );
  if (tableMatch) {
    const qty = parseQty(tableMatch[3]);
    if (qty) return matchToCatalog(tableMatch[1].trim(), qty, tableMatch[4], parseFloat(tableMatch[5]), originalLine);
  }

  // 3. "product ... need about QTY of those"
  const needAboutMatch = cleaned.match(
    /^(.+?)\s*[-–]\s*need\s+(?:about\s+)?(\d+)/i
  );
  if (needAboutMatch) {
    const qty = parseQty(needAboutMatch[2]);
    if (qty) return matchToCatalog(needAboutMatch[1].trim(), qty, "EA", undefined, originalLine);
  }

  // 4. Strict CSV: product,qty,$price
  const strictCsvMatch = cleaned.match(
    /^["']?(.+?)["']?,\s*(\d+)\s*,\s*\$?([\d.]+)/i
  );
  if (strictCsvMatch) {
    const qty = parseQty(strictCsvMatch[2]);
    if (qty) return matchToCatalog(strictCsvMatch[1].trim(), qty, "EA", parseFloat(strictCsvMatch[3]), originalLine);
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
        priceMatch ? parseFloat(priceMatch[1]) : undefined, originalLine
      );
    }
  }

  // 6. "QTY units/rolls/etc of PRODUCT"
  const unitsOfMatch = cleaned.match(
    /^(\d+)\s*(?:units?|pcs|packs?|boxes?)\s+(?:of\s+)?(.+?)(?:\s*\(.*\))?$/i
  );
  if (unitsOfMatch && unitsOfMatch[2].trim().length > 2) {
    const qty = parseQty(unitsOfMatch[1]);
    if (qty) return matchToCatalog(unitsOfMatch[2].trim(), qty, "EA", undefined, originalLine);
  }

  // 7. "QTYx PRODUCT"
  const qtyXMatch = cleaned.match(
    /^(\d+)\s*[x×]\s*(.+?)(?:\s*[@$]\s*([\d.]+))?$/i
  );
  if (qtyXMatch && qtyXMatch[2].trim().length > 2) {
    const qty = parseQty(qtyXMatch[1]);
    if (qty) return matchToCatalog(qtyXMatch[2].trim(), qty, "EA", qtyXMatch[3] ? parseFloat(qtyXMatch[3]) : undefined, originalLine);
  }

  // 8. "PRODUCT - QTY" or "PRODUCT: QTY" (product first, qty after separator)
  const productThenQty = cleaned.match(
    /^(.+?)\s*[-–:]\s*(\d+)\s*(?:units?|pcs|pairs?|ea)?$/i
  );
  if (productThenQty && productThenQty[1].trim().length > 2) {
    const desc = productThenQty[1].trim();
    if (!/^\d+$/.test(desc)) {
      const qty = parseQty(productThenQty[2]);
      if (qty) return matchToCatalog(desc, qty, "EA", undefined, originalLine);
    }
  }

  // 9. "QTY PRODUCT" (generic — must be last)
  const qtyProductMatch = cleaned.match(
    /^(\d+)\s+(.+?)(?:\s*[@$]\s*([\d.]+))?$/i
  );
  if (qtyProductMatch && qtyProductMatch[2].trim().length > 2) {
    const desc = qtyProductMatch[2]
      .replace(/^(?:packs?|boxes?|more|extra|additional)\s+(?:of\s+)?/i, "")
      .trim();
    if (!/^\$?[\d.,]+$/.test(desc) && !/^(ea|each|pcs|units?)$/i.test(desc)) {
      const qty = parseQty(qtyProductMatch[1]);
      if (qty) return matchToCatalog(desc, qty, "EA", qtyProductMatch[3] ? parseFloat(qtyProductMatch[3]) : undefined, originalLine);
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
    return 0.72 + Math.random() * 0.10; // 72-82% — messy, typos, abbreviations
  } else {
    return 0.63 + Math.random() * 0.08; // 63-71% — very fuzzy match
  }
}

function matchToCatalog(
  query: string,
  qty: number,
  unit: string,
  price?: number,
  originalText?: string
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
      originalText: originalText || query,
    };
  }

  return {
    product: query,
    sku: "UNKNOWN",
    quantity: qty,
    unit: unit.toUpperCase(),
    unitPrice: price ?? 0,
    confidence: 0,
    originalText: originalText || query,
  };
}
