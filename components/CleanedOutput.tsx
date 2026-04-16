"use client";

import { CleanResult } from "@/lib/types";

interface CleanedOutputProps {
  result: CleanResult | null;
}

export default function CleanedOutput({ result }: CleanedOutputProps) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-ventura-muted">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-ventura-border flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-sm">Cleaned output will appear here</p>
        <p className="text-xs mt-1">Paste data and click &quot;Clean Data&quot; to start</p>
      </div>
    );
  }

  const total = result.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-ventura-text">
          Structured Output
        </h2>
        <span className="text-xs text-ventura-muted px-2 py-0.5 rounded bg-ventura-surface border border-ventura-border">
          {result.mode === "ai" ? "AI" : "Mock"} mode
        </span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-ventura-surface border border-ventura-border rounded-lg p-3">
          <div className="text-lg font-semibold text-ventura-text">
            {result.summary.totalItems}
          </div>
          <div className="text-xs text-ventura-muted">Items Found</div>
        </div>
        <div className="bg-ventura-surface border border-ventura-border rounded-lg p-3">
          <div className="text-lg font-semibold text-ventura-success">
            {Math.round(result.summary.matchRate * 100)}%
          </div>
          <div className="text-xs text-ventura-muted">Match Rate</div>
        </div>
        <div className="bg-ventura-surface border border-ventura-border rounded-lg p-3">
          <div className="text-lg font-semibold text-ventura-text">
            {result.summary.processingTimeMs < 1000
              ? `${result.summary.processingTimeMs}ms`
              : `${(result.summary.processingTimeMs / 1000).toFixed(1)}s`}
          </div>
          <div className="text-xs text-ventura-muted">Processing</div>
        </div>
      </div>

      {/* Results table */}
      <div className="flex-1 overflow-auto border border-ventura-border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ventura-border bg-ventura-surface">
              <th className="text-left p-3 text-xs font-medium text-ventura-muted">
                Product
              </th>
              <th className="text-left p-3 text-xs font-medium text-ventura-muted">
                SKU
              </th>
              <th className="text-right p-3 text-xs font-medium text-ventura-muted">
                Qty
              </th>
              <th className="text-right p-3 text-xs font-medium text-ventura-muted">
                Price
              </th>
              <th className="text-right p-3 text-xs font-medium text-ventura-muted">
                Match
              </th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((item, i) => (
              <tr
                key={i}
                className="border-b border-ventura-border/50 hover:bg-ventura-surface/50 transition-colors"
              >
                <td className="p-3 text-ventura-text">{item.product}</td>
                <td className="p-3">
                  <span
                    className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                      item.sku !== "UNKNOWN"
                        ? "bg-ventura-success/10 text-ventura-success"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {item.sku}
                  </span>
                </td>
                <td className="p-3 text-right text-ventura-text">
                  {item.quantity} {item.unit}
                </td>
                <td className="p-3 text-right text-ventura-text">
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  <span
                    className={`text-xs font-medium ${
                      item.confidence >= 0.9
                        ? "text-ventura-success"
                        : item.confidence >= 0.7
                        ? "text-yellow-400"
                        : "text-red-400"
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

      {/* Total and export */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-ventura-border">
        <div className="text-sm text-ventura-muted">
          Total:{" "}
          <span className="text-ventura-text font-semibold">
            ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <button className="px-4 py-2 text-xs rounded-md bg-ventura-success/10 text-ventura-success border border-ventura-success/20 hover:bg-ventura-success/20 transition-colors">
          Export to ERP
        </button>
      </div>
    </div>
  );
}
