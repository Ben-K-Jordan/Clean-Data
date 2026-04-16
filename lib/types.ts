export interface LineItem {
  product: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  confidence: number;
}

export interface CleanResult {
  items: LineItem[];
  summary: {
    totalItems: number;
    matchRate: number;
    processingTimeMs: number;
  };
}

export interface CleanRequest {
  rawData: string;
}
