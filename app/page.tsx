"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import DataInput from "@/components/DataInput";
import ProcessingView from "@/components/ProcessingView";
import CleanedOutput from "@/components/CleanedOutput";
import { CleanResult } from "@/lib/types";

export default function Home() {
  const [rawData, setRawData] = useState("");
  const [mode, setMode] = useState<"mock" | "ai">("mock");
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
        body: JSON.stringify({ rawData, mode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to clean data");
      }

      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed < 1500 && mode === "mock") {
        await new Promise((r) => setTimeout(r, 1500 - elapsed));
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
        <div className="max-w-7xl mx-auto px-6 py-5 h-full">
          <div className="mb-5">
            <h1 className="text-xl font-bold text-p-text">
              Clean Data
            </h1>
            <p className="text-sm text-p-text-secondary mt-0.5">
              Paste messy emails, purchase orders, or CSVs and watch them
              transform into structured, catalog-matched line items.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100%-88px)]">
            {/* Left panel: Input */}
            <div className="bg-p-surface border border-p-border rounded-polaris-lg p-5 shadow-polaris">
              <DataInput
                value={rawData}
                onChange={setRawData}
                mode={mode}
                onModeChange={setMode}
                onSubmit={handleClean}
                isLoading={isLoading}
              />
            </div>

            {/* Right panel: Output */}
            <div className="bg-p-surface border border-p-border rounded-polaris-lg p-5 shadow-polaris">
              {isLoading ? (
                <ProcessingView startTime={startTimeRef.current} />
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-p-fill-critical text-sm text-center max-w-sm">
                    <div className="w-10 h-10 rounded-full bg-p-bg-critical flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-p-fill-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="font-semibold text-p-text mb-1">Something went wrong</p>
                    <p className="text-p-text-secondary text-xs">{error}</p>
                    <button
                      onClick={handleClear}
                      className="mt-4 px-4 py-1.5 text-xs font-medium rounded-polaris-sm bg-p-surface border border-p-border text-p-text-secondary hover:bg-p-surface-secondary transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
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
