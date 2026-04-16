export interface LineItem {
  product: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  confidence: number;
  originalText: string;
}

export interface CleanResult {
  items: LineItem[];
  summary: {
    totalItems: number;
    matchRate: number;
    processingTimeMs: number;
  };
  insights: {
    typosFixed: number;
    abbreviationsResolved: number;
    skusDirect: number;
    fuzzyMatches: number;
  };
}

export interface CleanRequest {
  rawData: string;
}
