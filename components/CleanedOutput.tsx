"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CleanResult } from "@/lib/types";

interface CleanedOutputProps {
  result: CleanResult | null;
  onClear: () => void;
}

export default function CleanedOutput({ result, onClear }: CleanedOutputProps) {
  const [copied, setCopied] = useState(false);
  const [approved, setApproved] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number; below: boolean } | null>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  // Track accept/reject decisions for UNKNOWN rows by index
  const [unknownDecisions, setUnknownDecisions] = useState<Record<number, "accepted" | "rejected">>({});
  // Track rows that have finished their delete animation (fully collapsed from view)
  const [collapsedRows, setCollapsedRows] = useState<Record<number, true>>({});

  // Total excludes items the user rejected (so rejected UNKNOWN rows drop out of the sum)
  const total = result
    ? Math.round(
        result.items.reduce((sum, item, idx) => {
          if (item.sku === "UNKNOWN" && unknownDecisions[idx] === "rejected") return sum;
          return sum + item.quantity * item.unitPrice;
        }, 0) * 100
      ) / 100
    : 0;

  // Animate total counting up
  useEffect(() => {
    if (!result || total === 0) {
      setAnimatedTotal(0);
      return;
    }
    const duration = 1200;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedTotal(total * eased);
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [result, total]);

  // Reset approved state and decisions when result changes
  useEffect(() => {
    setApproved(false);
    setUnknownDecisions({});
    setCollapsedRows({});
  }, [result]);

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
          Processed orders will appear here for review before sending to your ERP
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

  // Build summary sentence
  const insights = result.insights;
  // Count UNKNOWN items that haven't had a decision yet (button is gated on this)
  const pendingUnknownCount = result.items.reduce((acc, item, idx) => {
    return acc + (item.sku === "UNKNOWN" && !unknownDecisions[idx] ? 1 : 0);
  }, 0);
  // Effective match stats — factor in user decisions on UNKNOWN rows.
  // Accepted UNKNOWN → counts as matched. Rejected UNKNOWN → removed from total.
  // While pending (no decision yet), UNKNOWN items count as unmatched.
  const effectiveStats = result.items.reduce(
    (acc, item, idx) => {
      if (item.sku === "UNKNOWN") {
        const decision = unknownDecisions[idx];
        if (decision === "rejected") return acc; // removed entirely
        if (decision === "accepted") return { matched: acc.matched + 1, total: acc.total + 1 };
        return { matched: acc.matched, total: acc.total + 1 }; // pending → still unresolved
      }
      return { matched: acc.matched + 1, total: acc.total + 1 };
    },
    { matched: 0, total: 0 }
  );
  const effectiveMatchRate = effectiveStats.total > 0 ? effectiveStats.matched / effectiveStats.total : 1;
  // For the amber "flagged" state, only show amber when there are STILL unresolved UNKNOWNs
  const unmatchedCount = pendingUnknownCount;
  const summaryParts: string[] = [];
  summaryParts.push(`Parsed ${result.summary.totalItems} line items`);
  if (insights.typosFixed > 0) summaryParts.push(`corrected ${insights.typosFixed} typo${insights.typosFixed > 1 ? "s" : ""}`);
  if (insights.abbreviationsResolved > 0) summaryParts.push(`resolved ${insights.abbreviationsResolved} abbreviation${insights.abbreviationsResolved > 1 ? "s" : ""}`);
  if (insights.skusDirect > 0) summaryParts.push(`matched ${insights.skusDirect} direct SKU${insights.skusDirect > 1 ? "s" : ""}`);
  const summaryText = summaryParts.join(", ") + (
    unmatchedCount > 0
      ? `. ${unmatchedCount} item${unmatchedCount > 1 ? "s" : ""} flagged for human review.`
      : ". All items matched to catalog."
  );

  // Estimate manual processing time (rough: ~45s per line item for a human)
  const manualTimeSec = result.summary.totalItems * 45;
  const manualTimeMin = Math.round(manualTimeSec / 60);

  function downloadCSV() {
    const esc = (s: string) => `"${s.replace(/"/g, '""').replace(/[\r\n]+/g, " ")}"`;
    const header = "Product,SKU,Quantity,Unit,Unit Cost,Confidence,Original Text";
    const rows = result!.items.map(
      (item) =>
        `${esc(item.product)},${esc(item.sku)},${item.quantity},${esc(item.unit)},${item.unitPrice.toFixed(2)},${Math.round(item.confidence * 100)}%,${esc(item.originalText)}`
    );
    const csv = "\uFEFF" + [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "order-line-items.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h2 className="text-[13px] font-semibold text-p-text">Order Review</h2>
          <p className="text-[11px] text-p-text-secondary mt-0.5">
            {effectiveStats.matched < effectiveStats.total
              ? `${effectiveStats.matched} of ${effectiveStats.total} line items matched — review before sending to ERP`
              : `${effectiveStats.total} line items matched to catalog — review before sending to ERP`}
          </p>
        </div>
        <button
          onClick={onClear}
          className="text-[11px] text-p-text-secondary hover:text-p-text transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Insights banner */}
      <div className={`mx-5 mb-3 px-3 py-2 rounded-polaris animate-fade-in ${
        unmatchedCount > 0
          ? "bg-amber-50 border border-amber-200"
          : "bg-blue-50 border border-blue-100"
      }`}>
        <div className="flex items-start gap-2">
          <svg className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
            unmatchedCount > 0 ? "text-amber-600" : "text-blue-600"
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className={`text-[11px] leading-relaxed ${
            unmatchedCount > 0 ? "text-amber-800" : "text-blue-800"
          }`}>{summaryText}</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2.5 px-5 mb-4 items-stretch">
        <div className="bg-p-surface border border-p-border rounded-polaris p-3 shadow-polaris-sm animate-count-up flex flex-col justify-between">
          <div className="text-xl font-bold text-p-text tabular-nums">
            {effectiveStats.total}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <svg className="w-3 h-3 text-p-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-[11px] text-p-text-secondary">Line Items</span>
          </div>
        </div>
        <div className="bg-p-surface border border-p-border rounded-polaris p-3 shadow-polaris-sm animate-count-up stagger-1 flex flex-col justify-between">
          {(() => {
            const matched = effectiveStats.matched;
            const total = effectiveStats.total;
            const pct = Math.round(effectiveMatchRate * 100);
            const isPerfect = pct === 100;
            return (
              <>
                <div className="flex items-baseline gap-1.5">
                  <div className={`text-xl font-bold tabular-nums ${isPerfect ? "text-[#047b5d]" : "text-amber-600"}`}>
                    {pct}%
                  </div>
                  <span className="text-[10px] text-p-text-secondary tabular-nums">
                    {matched} of {total} matched
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className="mt-1.5 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isPerfect ? "bg-[#047b5d]" : "bg-amber-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <svg className="w-3 h-3 text-p-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[11px] text-p-text-secondary">Items Resolved</span>
                </div>
              </>
            );
          })()}
        </div>
        <div className="bg-p-surface border border-p-border rounded-polaris p-3 shadow-polaris-sm animate-count-up stagger-2 flex flex-col justify-between">
          <div className="flex items-baseline gap-1.5">
            <div className="text-xl font-bold text-p-text tabular-nums">
              {result.summary.processingTimeMs < 1000
                ? `${result.summary.processingTimeMs}ms`
                : `${(result.summary.processingTimeMs / 1000).toFixed(1)}s`}
            </div>
            <span className="text-[10px] text-p-text-secondary">
              vs ~{manualTimeMin} min manual
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <svg className="w-3 h-3 text-p-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[11px] text-p-text-secondary">Processing</span>
          </div>
        </div>
      </div>

      {/* Results table */}
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
            {result.items.map((item, i) => {
              const isUnknown = item.sku === "UNKNOWN";
              const decision = unknownDecisions[i];
              const isRejected = isUnknown && decision === "rejected";
              const isAccepted = isUnknown && decision === "accepted";
              const isCollapsed = collapsedRows[i];
              if (isCollapsed) return null;
              return (
              <tr
                key={i}
                ref={(el) => { rowRefs.current[i] = el; }}
                onAnimationEnd={(e) => {
                  if (e.animationName === "rowDelete") {
                    setCollapsedRows((c) => ({ ...c, [i]: true }));
                  }
                }}
                className={`border-b border-p-border-secondary transition-colors relative ${
                  isRejected
                    ? "animate-row-delete"
                    : `animate-fade-in-up opacity-0 stagger-${Math.min(i + 1, 10)} ${isAccepted ? "bg-green-50/40" : "hover:bg-blue-50/40"}`
                }`}
                onMouseEnter={() => {
                  setHoveredRow(i);
                  const el = rowRefs.current[i];
                  if (el) {
                    const rect = el.getBoundingClientRect();
                    const spaceAbove = rect.top;
                    const showBelow = spaceAbove < 120;
                    setTooltipPos({
                      x: rect.left + 16,
                      y: showBelow ? rect.bottom + 8 : rect.top - 8,
                      below: showBelow,
                    });
                  }
                }}
                onMouseLeave={() => { setHoveredRow(null); setTooltipPos(null); }}
              >
                <td className="py-2.5 pl-5 pr-3 text-p-text font-medium">
                  <span>{item.product}</span>
                </td>
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
                  {isUnknown ? (
                    <div className="flex items-center justify-end gap-1.5">
                      {decision ? (
                        <span className={`text-[11px] font-semibold ${
                          isAccepted ? "text-[#047b5d]" : "text-p-text-secondary"
                        }`}>
                          {isAccepted ? "Included" : "Skipped"}
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => setUnknownDecisions((d) => ({ ...d, [i]: "rejected" }))}
                            title="Skip this item"
                            className="w-6 h-6 flex items-center justify-center rounded-polaris-sm border border-p-border bg-p-surface hover:bg-red-50 hover:border-red-300 text-p-text-secondary hover:text-p-fill-critical transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setUnknownDecisions((d) => ({ ...d, [i]: "accepted" }))}
                            title="Include this item for manual review"
                            className="w-6 h-6 flex items-center justify-center rounded-polaris-sm border border-p-border bg-p-surface hover:bg-green-50 hover:border-green-300 text-p-text-secondary hover:text-[#047b5d] transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.confidence >= 0.95
                              ? "bg-[#047b5d]"
                              : item.confidence >= 0.75
                              ? "bg-[#34d399]"
                              : "bg-amber-400"
                          }`}
                          style={{ width: `${item.confidence * 100}%` }}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-semibold tabular-nums ${
                          item.confidence >= 0.95
                            ? "text-[#047b5d]"
                            : item.confidence >= 0.75
                            ? "text-[#16a34a]"
                            : "text-amber-600"
                        }`}
                      >
                        {Math.round(item.confidence * 100)}%
                      </span>
                    </div>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-p-border">
        <div className="text-[13px] text-p-text-secondary">
          Order Total:{" "}
          <span className="text-p-text font-bold text-base tabular-nums">
            ${animatedTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            disabled={approved || pendingUnknownCount > 0}
            title={pendingUnknownCount > 0 ? `Resolve ${pendingUnknownCount} flagged item${pendingUnknownCount > 1 ? "s" : ""} first` : undefined}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-polaris-sm transition-all shadow-polaris-sm ${
              approved
                ? "bg-[#cdfee1] text-[#047b5d] border border-green-200"
                : pendingUnknownCount > 0
                ? "bg-p-surface-secondary text-p-text-secondary border border-p-border cursor-not-allowed"
                : "bg-p-fill-brand text-white hover:bg-p-fill-brand-hover"
            }`}
          >
            {approved ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sent to ERP
              </>
            ) : pendingUnknownCount > 0 ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resolve {pendingUnknownCount} flagged item{pendingUnknownCount > 1 ? "s" : ""}
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Review &amp; Send to ERP
              </>
            )}
          </button>
        </div>
      </div>

      {/* Portal tooltip – renders outside overflow containers */}
      {hoveredRow !== null && tooltipPos && result.items[hoveredRow] && result.items[hoveredRow].originalText !== result.items[hoveredRow].product && typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed z-[9999] px-3.5 py-2.5 bg-[#303030] rounded-polaris shadow-polaris-lg max-w-sm animate-fade-in whitespace-normal pointer-events-none"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.below ? tooltipPos.y : undefined,
              bottom: tooltipPos.below ? undefined : `${window.innerHeight - tooltipPos.y}px`,
            }}
          >
            <div className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mb-1">Original input</div>
            <div className="font-mono text-[12px] text-white leading-relaxed">{result.items[hoveredRow].originalText}</div>
            <div
              className={`absolute left-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent ${
                tooltipPos.below
                  ? "bottom-full border-b-[6px] border-b-[#303030]"
                  : "top-full border-t-[6px] border-t-[#303030]"
              }`}
            />
          </div>,
          document.body
        )
      }
    </div>
  );
}
