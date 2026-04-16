"use client";

import { useState } from "react";
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

  async function handleClean() {
    setIsLoading(true);
    setError(null);
    setResult(null);

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

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-6 h-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-ventura-text">
              Clean Data Demo
            </h1>
            <p className="text-sm text-ventura-muted mt-1">
              Paste messy emails, purchase orders, or CSVs and watch them
              transform into structured, catalog-matched line items.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-100px)]">
            {/* Left panel: Input */}
            <div className="bg-ventura-bg border border-ventura-border rounded-xl p-5">
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
            <div className="bg-ventura-bg border border-ventura-border rounded-xl p-5">
              {isLoading ? (
                <ProcessingView />
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-red-400 text-sm text-center max-w-sm">
                    <p className="font-medium mb-1">Error</p>
                    <p className="text-ventura-muted">{error}</p>
                  </div>
                </div>
              ) : (
                <CleanedOutput result={result} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
