"use client";

import { useRef, useState, useEffect } from "react";
import SampleData from "./SampleData";

interface DataInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onImageUpload?: (base64: string, mimeType: string, fileName: string) => void;
  isLoading: boolean;
  uploadedImagePreview?: string | null;
  isScanning?: boolean;
  hasResult?: boolean;
}

export default function DataInput({
  value,
  onChange,
  onSubmit,
  onImageUpload,
  isLoading,
  uploadedImagePreview,
  isScanning,
  hasResult,
}: DataInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Keep local uploadedFile in sync with parent's imagePreview state.
  // If the parent clears the image (e.g. via runDemo or SampleData click),
  // also clear the local filename so the notification bar disappears.
  useEffect(() => {
    if (!uploadedImagePreview && uploadedFile && !value) {
      setUploadedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [uploadedImagePreview, value, uploadedFile]);

  function handleFile(file: File) {
    const isTextFile = file.type.startsWith("text/") || file.name.endsWith(".csv") || file.name.endsWith(".tsv");

    if (isTextFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onChange(text);
        setUploadedFile(file.name);
      };
      reader.readAsText(file);
    } else if (file.type.startsWith("image/") && onImageUpload) {
      // Read image as base64 for AI vision processing
      setUploadedFile(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        // Extract base64 data (remove "data:image/png;base64," prefix)
        const base64 = dataUrl.split(",")[1];
        const mimeType = file.type || "image/png";
        onImageUpload(base64, mimeType, file.name);
      };
      reader.readAsDataURL(file);
    } else {
      // Unsupported file type fallback
      setUploadedFile(file.name);
      onChange(`[Unsupported file: ${file.name}]\nPlease paste order data as text, or upload an image of the order.`);
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
    <div className="flex flex-col h-full p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[13px] font-semibold text-p-text">Incoming Order</h2>
          <p className="text-[11px] text-p-text-secondary mt-0.5">Paste order data or upload a document to scan</p>
        </div>
      </div>

      {/* Tab row: Samples | Upload */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <SampleData onSelect={(data) => { setUploadedFile(null); onChange(data); }} active={value} />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="group flex flex-col items-start gap-1 px-3 py-2.5 text-left rounded-polaris border border-dashed border-p-border bg-p-surface hover:border-p-fill-brand hover:bg-green-50/30 transition-all"
        >
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-p-text-secondary group-hover:text-p-fill-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-xs font-semibold text-p-text group-hover:text-p-fill-brand transition-colors">Upload</span>
          </div>
          <span className="text-[10px] text-p-text-secondary leading-tight">PDF, CSV, image, or text</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.csv,.tsv,.txt,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            // Reset so selecting the same file again still fires onChange
            e.target.value = "";
          }}
        />
      </div>

      {/* Upload indicator */}
      {uploadedFile && (
        <div className={`flex items-center gap-2 mb-2 px-3 py-2 rounded-polaris animate-fade-in transition-colors duration-300 ${
          isScanning
            ? "bg-blue-50 border border-blue-200"
            : hasResult
            ? "bg-green-50 border border-green-200"
            : "bg-p-surface-secondary border border-p-border"
        }`}>
          <svg className={`w-4 h-4 shrink-0 transition-colors duration-300 ${
            isScanning ? "text-blue-600" : hasResult ? "text-[#047b5d]" : "text-p-text-secondary"
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className={`text-[12px] font-medium flex-1 truncate transition-colors duration-300 ${
            isScanning ? "text-blue-600" : hasResult ? "text-[#047b5d]" : "text-p-text-secondary"
          }`}>{uploadedFile}</span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors duration-300 ${
            isScanning
              ? "text-blue-700 bg-blue-100"
              : hasResult
              ? "text-[#047b5d] bg-green-100"
              : "text-p-text-secondary bg-p-surface"
          }`}>{isScanning ? "Scanning..." : hasResult ? "Scanned" : "Uploaded"}</span>
          <button onClick={clearFile} className={`transition-colors ${
            isScanning ? "text-blue-400 hover:text-blue-600" : hasResult ? "text-[#047b5d]/60 hover:text-[#047b5d]" : "text-p-text-secondary hover:text-p-text"
          }`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Textarea with drag-and-drop */}
      <div
        className={`relative flex-1 ${dragActive ? "ring-2 ring-p-fill-brand/30 rounded-polaris" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {uploadedImagePreview ? (
          <div
            className="w-full bg-p-surface border border-p-border rounded-polaris shadow-polaris-sm relative overflow-y-auto overflow-x-hidden"
            style={{ height: "min(50vh, 500px)" }}
          >
            <div className="relative p-4 flex justify-center">
              <img
                src={uploadedImagePreview}
                alt="Uploaded order"
                className="max-w-full rounded-polaris border border-p-border-secondary shadow-polaris-sm"
              />
              {/* Scanning overlay — blue transparent bar sweeping down then up */}
              {isScanning && (
                <div className="absolute inset-0 rounded-polaris overflow-hidden pointer-events-none">
                  <div className="absolute left-0 right-0 h-[60px] animate-scan-sweep bg-gradient-to-b from-blue-500/0 via-blue-500/25 to-blue-500/0" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => { setUploadedFile(null); onChange(e.target.value); }}
            placeholder="Paste order data here...&#10;&#10;Emails, purchase orders, CSVs, or drag and drop a document to scan it."
            className="w-full h-full bg-p-surface border border-p-border rounded-polaris p-4 text-[13px] text-p-text placeholder:text-p-text-secondary/40 resize-none focus:outline-none focus:ring-2 focus:ring-[#005bd3]/20 focus:border-[#005bd3]/40 font-mono leading-relaxed shadow-polaris-sm transition-shadow"
          />
        )}
        {dragActive && (
          <div className="absolute inset-0 bg-green-50/80 border-2 border-dashed border-p-fill-brand rounded-polaris flex items-center justify-center pointer-events-none z-10">
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-p-fill-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm font-semibold text-p-fill-brand">Drop to scan document</span>
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
        disabled={(!value.trim() && !uploadedImagePreview) || isLoading}
        className="mt-3 w-full py-2.5 rounded-polaris bg-p-fill-brand text-white text-sm font-semibold hover:bg-p-fill-brand-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-polaris-sm hover:shadow-polaris"
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
            Process Order
          </span>
        )}
      </button>
    </div>
  );
}
