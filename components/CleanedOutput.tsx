"use client";

import { CleanResult } from "@/lib/types";

interface CleanedOutputProps {
  result: CleanResult | null;
  onClear: () => void;
}

export default function CleanedOutput({ result, onClear }: CleanedOutputProps) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-p-text-secondary">
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-p-border flex items-center justify-center mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-sm font-medium text-p-text">Cleaned output will appear here</p>
        <p className="text-xs mt-1">Paste data and click &quot;Clean Data&quot; to start</p>
      </div>
    );
  }

  if (result.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-p-text-secondary">
        <div className="w-14 h-14 rounded-full bg-p-fill-warning/10 flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-p-fill-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-p-text">No items found</p>
        <p className="text-xs mt-1 text-center max-w-xs">
          We couldn&apos;t extract any product data. Try pasting an email, purchase order, or CSV with product names and quantities.
        </p>
        <button
          onClick={onClear}
          className="mt-4 px-4 py-1.5 text-xs font-medium rounded-polaris-sm bg-p-surface border border-p-border text-p-text-secondary hover:bg-p-surface-secondary transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  const total = Math.round(
    result.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) * 100
  ) / 100;

  function downloadCSV() {
    const header = "Product,SKU,Quantity,Unit,Unit Price,Confidence";
    const rows = result!.items.map(
      (item) =>
        `"${item.product}",${item.sku},${item.quantity},${item.unit},${item.unitPrice.toFixed(2)},${Math.round(item.confidence * 100)}%`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cleaned-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard() {
    const lines = result!.items.map(
      (item) =>
        `${item.product}\t${item.sku}\t${item.quantity}\t${item.unit}\t$${item.unitPrice.toFixed(2)}`
    );
    const text = ["Product\tSKU\tQty\tUnit\tPrice", ...lines].join("\n");
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-p-text">
          Structured Output
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="text-xs text-p-text-secondary hover:text-p-text transition-colors"
          >
            Clear
          </button>
          <span className="text-xs text-p-text-secondary px-2 py-0.5 rounded-polaris-sm bg-p-surface-secondary border border-p-border">
            {result.mode === "ai" ? "AI" : "Mock"} mode
          </span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-p-surface border border-p-border rounded-polaris p-3 shadow-polaris-sm">
          <div className="text-lg font-semibold text-p-text">
            {result.summary.totalItems}
          </div>
          <div className="text-xs text-p-text-secondary">Items Found</div>
        </div>
        <div className="bg-p-surface border border-p-border rounded-polaris p-3 shadow-polaris-sm">
          <div className="text-lg font-semibold text-p-fill-success">
            {Math.round(result.summary.matchRate * 100)}%
          </div>
          <div className="text-xs text-p-text-secondary">Match Rate</div>
        </div>
        <div className="bg-p-surface border border-p-border rounded-polaris p-3 shadow-polaris-sm">
          <div className="text-lg font-semibold text-p-text">
            {result.summary.processingTimeMs < 1000
              ? `${result.summary.processingTimeMs}ms`
              : `${(result.summary.processingTimeMs / 1000).toFixed(1)}s`}
          </div>
          <div className="text-xs text-p-text-secondary">Processing</div>
        </div>
      </div>

      {/* Results table */}
      <div className="flex-1 overflow-auto border border-p-border rounded-polaris shadow-polaris-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-p-border bg-p-surface-secondary">
              <th className="text-left p-3 text-xs font-semibold text-p-text-secondary">
                Product
              </th>
              <th className="text-left p-3 text-xs font-semibold text-p-text-secondary">
                SKU
              </th>
              <th className="text-right p-3 text-xs font-semibold text-p-text-secondary">
                Qty
              </th>
              <th className="text-right p-3 text-xs font-semibold text-p-text-secondary">
                Price
              </th>
              <th className="text-right p-3 text-xs font-semibold text-p-text-secondary">
                Match
              </th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((item, i) => (
              <tr
                key={i}
                className="border-b border-p-border-secondary hover:bg-p-surface-secondary transition-colors"
              >
                <td className="p-3 text-p-text font-medium">{item.product}</td>
                <td className="p-3">
                  <span
                    className={`font-mono text-xs px-1.5 py-0.5 rounded-polaris-sm ${
                      item.sku !== "UNKNOWN"
                        ? "bg-green-50 text-p-fill-success border border-green-200"
                        : "bg-red-50 text-p-fill-critical border border-red-200"
                    }`}
                  >
                    {item.sku}
                  </span>
                </td>
                <td className="p-3 text-right text-p-text tabular-nums">
                  {item.quantity} {item.unit}
                </td>
                <td className="p-3 text-right text-p-text tabular-nums">
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  <span
                    className={`text-xs font-semibold ${
                      item.confidence >= 0.9
                        ? "text-p-fill-success"
                        : item.confidence >= 0.7
                        ? "text-amber-600"
                        : "text-p-fill-critical"
                    }`}
                  >
                    {Math.round(item.confidence * 100)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total and actions */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-p-border">
        <div className="text-sm text-p-text-secondary">
          Total:{" "}
          <span className="text-p-text font-semibold">
            ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="px-3 py-1.5 text-xs font-medium rounded-polaris-sm bg-p-surface border border-p-border text-p-text-secondary hover:bg-p-surface-secondary transition-colors shadow-polaris-sm"
          >
            Copy
          </button>
          <button
            onClick={downloadCSV}
            className="px-4 py-1.5 text-xs font-medium rounded-polaris-sm bg-p-fill-success text-white hover:bg-[#036b51] transition-colors shadow-polaris-sm"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
