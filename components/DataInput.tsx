"use client";

import { useRef, useState } from "react";
import SampleData from "./SampleData";

interface DataInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function DataInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: DataInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  function handleFile(file: File) {
    // For demo: read text-based files directly, or fake-scan images/PDFs
    const isTextFile = file.type.startsWith("text/") || file.name.endsWith(".csv") || file.name.endsWith(".tsv");

    if (isTextFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onChange(text);
        setUploadedFile(file.name);
      };
      reader.readAsText(file);
    } else {
      // For PDFs, images, etc. — show filename and use a sample to simulate scanning
      setUploadedFile(file.name);
      // Simulate OCR extraction with a delay
      setTimeout(() => {
        onChange(
          `Scanned from: ${file.name}\n\n` +
          `Purchase Order #PO-2024-8891\nDate: April 12, 2026\nVendor: TrendSet Boutique\n\n` +
          `Classic Denim Jacket | SKU-1001 | 45 | EA | $89.99\n` +
          `Organic Cotton T-Shirt | SKU-1002 | 120 | EA | $34.99\n` +
          `Wireless Bluetooth Earbuds | SKU-3001 | 60 | EA | $79.99\n` +
          `Leather Crossbody Bag | SKU-5001 | 35 | EA | $124.99\n` +
          `Soy Wax Candle Set | SKU-6001 | 80 | EA | $28.99\n` +
          `USB-C Fast Charger | SKU-3002 | 200 | EA | $24.99\n` +
          `Premium Running Shoes | SKU-2001 | 50 | EA | $129.99`
        );
      }, 300);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
  }

  function clearFile() {
    setUploadedFile(null);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[13px] font-semibold text-p-text">Raw Input</h2>
          <p className="text-[11px] text-p-text-secondary mt-0.5">Paste data or upload a document to scan</p>
        </div>
      </div>

      {/* Tab row: Samples | Upload */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <SampleData onSelect={(data) => { setUploadedFile(null); onChange(data); }} active={value} />
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-1 px-3 py-2.5 text-left rounded-polaris border border-dashed border-p-border bg-p-surface hover:border-[#008060] hover:bg-green-50/30 transition-all group shrink-0"
        >
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-p-text-secondary group-hover:text-[#008060] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-xs font-semibold text-p-text group-hover:text-[#008060] transition-colors">Upload</span>
          </div>
          <span className="text-[10px] text-p-text-secondary leading-tight">PDF, CSV, image, or text</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.csv,.tsv,.txt,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFile(e.target.files[0]);
          }}
        />
      </div>

      {/* Upload indicator */}
      {uploadedFile && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-polaris bg-green-50 border border-green-200 animate-fade-in">
          <svg className="w-4 h-4 text-[#047b5d] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[12px] text-[#047b5d] font-medium flex-1 truncate">{uploadedFile}</span>
          <span className="text-[10px] text-[#047b5d]/70 font-medium px-1.5 py-0.5 rounded bg-green-100">Scanned</span>
          <button onClick={clearFile} className="text-[#047b5d]/60 hover:text-[#047b5d] transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Textarea with drag-and-drop */}
      <div
        className={`relative flex-1 ${dragActive ? "ring-2 ring-[#008060]/30 rounded-polaris" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <textarea
          value={value}
          onChange={(e) => { setUploadedFile(null); onChange(e.target.value); }}
          placeholder="Paste your messy data here...&#10;&#10;Or drag and drop a document (PDF, CSV, image) to scan it."
          className="w-full h-full bg-p-surface border border-p-border rounded-polaris p-4 text-[13px] text-p-text placeholder:text-p-text-secondary/40 resize-none focus:outline-none focus:ring-2 focus:ring-[#005bd3]/20 focus:border-[#005bd3]/40 font-mono leading-relaxed shadow-polaris-sm transition-shadow"
        />
        {dragActive && (
          <div className="absolute inset-0 bg-green-50/80 border-2 border-dashed border-[#008060] rounded-polaris flex items-center justify-center pointer-events-none z-10">
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-[#008060]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm font-semibold text-[#008060]">Drop to scan document</span>
            </div>
          </div>
        )}
        {value && !dragActive && (
          <button
            onClick={clearFile}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-p-surface-secondary text-p-text-secondary hover:bg-p-border hover:text-p-text transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <button
        onClick={onSubmit}
        disabled={!value.trim() || isLoading}
        className="mt-3 w-full py-2.5 rounded-polaris bg-[#008060] text-white text-sm font-semibold hover:bg-[#006e52] active:bg-[#005c45] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-polaris-sm hover:shadow-polaris"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Clean Data
          </span>
        )}
      </button>
    </div>
  );
}
