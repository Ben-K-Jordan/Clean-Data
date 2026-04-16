"use client";

import { useState, useRef, useCallback } from "react";
import Header from "@/components/Header";
import DataInput from "@/components/DataInput";
import ProcessingView from "@/components/ProcessingView";
import CleanedOutput from "@/components/CleanedOutput";
import { CleanResult } from "@/lib/types";
import { sampleEmail, samplePO, sampleCSV, sampleEdgeCase } from "@/lib/samples";

export default function Home() {
  const [rawData, setRawData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CleanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const startTimeRef = useRef(0);
  const demoAbortRef = useRef(false);

  const processOrder = useCallback(async (data: string, image?: { base64: string; mimeType: string } | null) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    startTimeRef.current = Date.now();

    try {
      const payload: Record<string, string> = { rawData: data };
      if (image) {
        payload.imageData = image.base64;
        payload.mimeType = image.mimeType;
      }

      const res = await fetch("/api/clean", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to clean data");
      }

      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed < 1800) {
        await new Promise((r) => setTimeout(r, 1800 - elapsed));
      }

      const totalElapsed = Date.now() - startTimeRef.current;
      json.summary.processingTimeMs = totalElapsed;

      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function handleClean() {
    if (imageData) {
      // Phase 1: Scan animation on the image (3 seconds)
      setScanComplete(false);
      setIsScanning(true);
      await new Promise((r) => setTimeout(r, 3000));
      setIsScanning(false);
      setScanComplete(true);
      // Phase 2: Processing animation on the right panel
    }
    await processOrder(rawData, imageData);
  }

  function handleClear() {
    setResult(null);
    setError(null);
  }

  function handleImageUpload(base64: string, mimeType: string, _fileName: string) {
    setImageData({ base64, mimeType });
    setImagePreview(`data:${mimeType};base64,${base64}`);
    setRawData(""); // clear text since we're using image
  }

  function clearImage() {
    setImageData(null);
    setImagePreview(null);
    setScanComplete(false);
  }

  async function runDemo(text: string) {
    setShowDemoMenu(false);
    // Reset everything
    setResult(null);
    setError(null);
    setRawData("");
    setIsDemo(true);
    demoAbortRef.current = false;

    // Type out character by character
    const chunkSize = 3;
    for (let i = 0; i <= text.length; i += chunkSize) {
      if (demoAbortRef.current) return;
      const slice = text.slice(0, Math.min(i + chunkSize, text.length));
      setRawData(slice);
      await new Promise((r) => setTimeout(r, 12));
    }
    setRawData(text);

    // Brief pause before processing
    await new Promise((r) => setTimeout(r, 600));
    if (demoAbortRef.current) return;

    // Process
    await processOrder(text);
    setIsDemo(false);
  }

  return (
    <div className="flex flex-col h-screen bg-p-bg">
      <Header />
      <main className="flex-1 overflow-auto lg:overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-5 py-5 min-h-full lg:h-full flex flex-col">
          {/* Page header */}
          <div className="mb-4 flex items-end justify-between">
            <h1 className="text-lg font-bold text-p-text tracking-tight">
              Structured Orders
            </h1>
            {!isLoading && !isDemo && (
              <div className="relative">
                <button
                  onClick={() => setShowDemoMenu(!showDemoMenu)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-polaris-sm bg-p-fill-brand text-white hover:bg-p-fill-brand-hover transition-all shadow-polaris-sm animate-fade-in"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Run Demo
                  <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showDemoMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDemoMenu(false)} />
                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-p-border rounded-polaris shadow-polaris-md z-50 py-1 animate-fade-in">
                      <button
                        onClick={() => runDemo(sampleEmail)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[13px] text-p-text hover:bg-p-surface-secondary transition-colors"
                      >
                        <svg className="w-4 h-4 text-p-text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Client Email
                      </button>
                      <button
                        onClick={() => runDemo(samplePO)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[13px] text-p-text hover:bg-p-surface-secondary transition-colors"
                      >
                        <svg className="w-4 h-4 text-p-text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Purchase Order
                      </button>
                      <button
                        onClick={() => runDemo(sampleCSV)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[13px] text-p-text hover:bg-p-surface-secondary transition-colors"
                      >
                        <svg className="w-4 h-4 text-p-text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Messy CSV
                      </button>
                      <div className="mx-2 my-1 border-t border-p-border-secondary" />
                      <button
                        onClick={() => runDemo(sampleEdgeCase)}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[13px] hover:bg-red-50 transition-colors group"
                      >
                        <div className="w-5 h-5 rounded-full bg-red-100 group-hover:bg-red-200 flex items-center justify-center shrink-0 transition-colors">
                          <span className="text-sm leading-none">💣</span>
                        </div>
                        <div>
                          <div className="font-semibold text-red-700 text-[12px]">Edge Case</div>
                          <div className="text-[10px] text-red-500/80 leading-tight">Forwarded texts, typos, slang</div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.1fr] gap-4 flex-1 min-h-0 lg:min-h-0 [&>div]:min-h-[500px] lg:[&>div]:min-h-0">
            {/* Left panel: Input */}
            <div className="bg-p-surface border border-p-border rounded-polaris-lg shadow-polaris overflow-hidden flex flex-col">
              <DataInput
                value={rawData}
                onChange={(v) => { demoAbortRef.current = true; setIsDemo(false); clearImage(); setRawData(v); }}
                onSubmit={handleClean}
                onImageUpload={handleImageUpload}
                isLoading={isLoading || isDemo || isScanning}
                uploadedImagePreview={imagePreview}
                isScanning={isScanning}
                hasResult={scanComplete || !!result}
              />
            </div>

            {/* Right panel: Output */}
            <div className="bg-p-surface border border-p-border rounded-polaris-lg shadow-polaris overflow-hidden flex flex-col">
              {isLoading ? (
                <ProcessingView startTime={startTimeRef.current} />
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full animate-fade-in p-5">
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
