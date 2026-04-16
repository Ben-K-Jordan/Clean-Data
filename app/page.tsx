"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import DataInput from "@/components/DataInput";
import ProcessingView from "@/components/ProcessingView";
import CleanedOutput from "@/components/CleanedOutput";
import { CleanResult } from "@/lib/types";

export default function Home() {
  const [rawData, setRawData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CleanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef(0);

  async function handleClean() {
    setIsLoading(true);
    setError(null);
    setResult(null);
    startTimeRef.current = Date.now();

    try {
      const res = await fetch("/api/clean", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawData }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to clean data");
      }

      // Ensure minimum processing time for believable UX
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed < 1800) {
        await new Promise((r) => setTimeout(r, 1800 - elapsed));
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setResult(null);
    setError(null);
  }

  return (
    <div className="flex flex-col h-screen bg-p-bg">
      <Header />
      <main className="flex-1 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 py-5 h-full flex flex-col">
          {/* Page header */}
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h1 className="text-lg font-bold text-p-text tracking-tight">
                Order Processing
              </h1>
              <p className="text-[13px] text-p-text-secondary mt-0.5">
                Automatically parse incoming orders and match to your product catalog
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-p-text-secondary">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Powered by AI
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.1fr] gap-4 flex-1 min-h-0">
            {/* Left panel: Input */}
            <div className="bg-p-surface border border-p-border rounded-polaris-lg p-5 shadow-polaris overflow-hidden">
              <DataInput
                value={rawData}
                onChange={setRawData}
                onSubmit={handleClean}
                isLoading={isLoading}
              />
            </div>

            {/* Right panel: Output */}
            <div className="bg-p-surface border border-p-border rounded-polaris-lg p-5 shadow-polaris overflow-hidden">
              {isLoading ? (
                <ProcessingView startTime={startTimeRef.current} />
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-p-fill-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[13px] font-semibold text-p-text mb-1">Something went wrong</p>
                  <p className="text-[11px] text-p-text-secondary text-center max-w-[280px]">{error}</p>
                  <button
                    onClick={handleClear}
                    className="mt-4 px-4 py-1.5 text-xs font-medium rounded-polaris-sm bg-p-surface border border-p-border text-p-text-secondary hover:bg-p-surface-secondary transition-colors shadow-polaris-sm"
                  >
                    Dismiss
                  </button>
                </div>
              ) : (
                <CleanedOutput result={result} onClear={handleClear} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
