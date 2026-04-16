import Anthropic from "@anthropic-ai/sdk";
import { CleanResult, LineItem } from "./types";
import { catalog } from "./catalog";

export async function aiClean(rawData: string): Promise<CleanResult> {
  const start = performance.now();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set. Switch to mock mode or add your API key to .env.local");
  }

  const client = new Anthropic({ apiKey });

  const catalogStr = catalog
    .map((c) => `${c.sku}: ${c.name} ($${c.unitPrice}/${c.unit})`)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are a data extraction system for a plumbing/pipe distributor. Parse the following raw input and extract line items, matching them to the product catalog below.

PRODUCT CATALOG:
${catalogStr}

RAW INPUT:
${rawData}

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "items": [
    {
      "product": "Full product name from catalog",
      "sku": "SKU-XXXX",
      "quantity": 100,
      "unit": "EA",
      "unitPrice": 12.40,
      "confidence": 0.95
    }
  ]
}

Rules:
- Match products to the catalog above. Use exact SKU and name from catalog.
- If a product doesn't match any catalog item, set sku to "UNKNOWN" and confidence to 0.
- Confidence should be 0.95+ for exact matches, 0.7-0.94 for fuzzy matches, 0 for no match.
- Extract quantity from context. Default to 1 if not specified.
- Use catalog unit price unless the input specifies a different price.
- Ignore greetings, signatures, headers, and non-product lines.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  let items: LineItem[];
  try {
    const parsed = JSON.parse(text);
    items = parsed.items || [];
  } catch {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      items = parsed.items || [];
    } else {
      throw new Error("Failed to parse AI response as JSON");
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
    mode: "ai",
  };
}
