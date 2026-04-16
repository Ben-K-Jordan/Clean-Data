"use client";

import { useState } from "react";
import { CleanResult } from "@/lib/types";

interface CleanedOutputProps {
  result: CleanResult | null;
  onClear: () => void;
}

export default function CleanedOutput({ result, onClear }: CleanedOutputProps) {
  const [copied, setCopied] = useState(false);
  const [approved, setApproved] = useState(false);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-p-text-secondary p-5">
        <div className="w-16 h-16 rounded-full bg-p-surface-secondary border border-p-border flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-p-text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-[13px] font-medium text-p-text">Order Review</p>
        <p className="text-[11px] mt-1 text-center max-w-[260px]">
          Processed orders will appear here for review before sending to your ERP system
        </p>
      </div>
    );
  }

  if (result.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-p-text-secondary p-5">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[13px] font-semibold text-p-text">No line items found</p>
        <p className="text-[11px] mt-1 text-center max-w-[240px]">
          Try pasting a client email, purchase order, or CSV with product names and quantities.
        </p>
        <button
          onClick={onClear}
          className="mt-4 px-4 py-1.5 text-xs font-medium rounded-polaris-sm bg-p-surface border border-p-border text-p-text-secondary hover:bg-p-surface-secondary transition-colors shadow-polaris-sm"
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
    const header = "Product,SKU,Quantity,Unit,Unit Cost,Confidence";
    const rows = result!.items.map(
      (item) =>
        `"${item.product}",${item.sku},${item.quantity},${item.unit},${item.unitPrice.toFixed(2)},${Math.round(item.confidence * 100)}%`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "order-line-items.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard() {
    const lines = result!.items.map(
      (item) =>
        `${item.product}\t${item.sku}\t${item.quantity}\t${item.unit}\t$${item.unitPrice.toFixed(2)}`
    );
    const text = ["Product\tSKU\tQty\tUnit\tCost", ...lines].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleApprove() {
    setApproved(true);
    setTimeout(() => setApproved(false), 3000);
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header — padded to align with panel edges */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div>
          <h2 className="text-[13px] font-semibold text-p-text">Order Review</h2>
          <p className="text-[11px] text-p-text-secondary mt-0.5">
            {result.summary.totalItems} line items matched to catalog — review before sending to ERP
          </p>
        </div>
        <button
          onClick={onClear}
          className="text-[11px] text-p-text-secondary hover:text-p-text transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2.5 px-5 mb-4">
        <div className="bg-p-surface border border-p-border rounded-polaris p-3 shadow-polaris-sm animate-count-up">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-polaris-sm bg-blue-50 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="text-xl font-bold text-p-text tabular-nums">
            {result.summary.totalItems}
          </div>
          <div className="text-[11px] text-p-text-secondary">Line Items</div>
        </div>
        <div className="bg-p-surface border border-p-border rounded-polaris p-3 shadow-polaris-sm animate-count-up stagger-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-polaris-sm bg-green-50 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#047b5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-xl font-bold text-[#047b5d] tabular-nums">
            {Math.round(result.summary.matchRate * 100)}%
          </div>
          <div className="text-[11px] text-p-text-secondary">Catalog Match</div>
        </div>
        <div className="bg-p-surface border border-p-border rounded-polaris p-3 shadow-polaris-sm animate-count-up stagger-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-polaris-sm bg-purple-50 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="text-xl font-bold text-p-text tabular-nums">
            {result.summary.processingTimeMs < 1000
              ? `${result.summary.processingTimeMs}ms`
              : `${(result.summary.processingTimeMs / 1000).toFixed(1)}s`}
          </div>
          <div className="text-[11px] text-p-text-secondary">Processing</div>
        </div>
      </div>

      {/* Results table — flush to panel edges, cell padding creates alignment */}
      <div className="flex-1 overflow-auto border-t border-p-border">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-p-border bg-p-surface-secondary sticky top-0 z-10">
              <th className="text-left py-2.5 pl-5 pr-3 text-[11px] font-semibold text-p-text-secondary uppercase tracking-wider">
                Product
              </th>
              <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-p-text-secondary uppercase tracking-wider">
                SKU
              </th>
              <th className="text-right py-2.5 px-3 text-[11px] font-semibold text-p-text-secondary uppercase tracking-wider">
                Qty
              </th>
              <th className="text-right py-2.5 px-3 text-[11px] font-semibold text-p-text-secondary uppercase tracking-wider">
                Unit Cost
              </th>
              <th className="text-right py-2.5 pl-3 pr-5 text-[11px] font-semibold text-p-text-secondary uppercase tracking-wider">
                Match
              </th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((item, i) => (
              <tr
                key={i}
                className={`border-b border-p-border-secondary hover:bg-blue-50/40 transition-colors animate-fade-in-up opacity-0 stagger-${Math.min(i + 1, 10)}`}
              >
                <td className="py-2.5 pl-5 pr-3 text-p-text font-medium">{item.product}</td>
                <td className="py-2.5 px-3">
                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap inline-block ${
                      item.sku !== "UNKNOWN"
                        ? "bg-[#cdfee1] text-[#047b5d]"
                        : "bg-red-50 text-p-fill-critical border border-red-200"
                    }`}
                  >
                    {item.sku}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right text-p-text tabular-nums font-medium">
                  {item.quantity.toLocaleString()}
                  <span className="text-p-text-secondary text-[11px] ml-1">{item.unit}</span>
                </td>
                <td className="py-2.5 px-3 text-right text-p-text tabular-nums">
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td className="py-2.5 pl-3 pr-5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.confidence >= 0.9
                            ? "bg-[#047b5d]"
                            : item.confidence >= 0.7
                            ? "bg-amber-400"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${item.confidence * 100}%` }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-semibold tabular-nums ${
                        item.confidence >= 0.9
                          ? "text-[#047b5d]"
                          : item.confidence >= 0.7
                          ? "text-amber-600"
                          : "text-p-fill-critical"
                      }`}
                    >
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer — padded to match header */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-p-border">
        <div className="text-[13px] text-p-text-secondary">
          Order Total:{" "}
          <span className="text-p-text font-bold text-base">
            ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-polaris-sm bg-p-surface border border-p-border text-p-text-secondary hover:bg-p-surface-secondary transition-all shadow-polaris-sm"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-[#047b5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-polaris-sm bg-p-surface border border-p-border text-p-text-secondary hover:bg-p-surface-secondary transition-all shadow-polaris-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={handleApprove}
            disabled={approved}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-polaris-sm transition-all shadow-polaris-sm ${
              approved
                ? "bg-[#cdfee1] text-[#047b5d] border border-green-200"
                : "bg-[#008060] text-white hover:bg-[#006e52]"
            }`}
          >
            {approved ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sent to ERP
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve &amp; Send to ERP
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
