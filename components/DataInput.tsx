"use client";

import SampleData from "./SampleData";

interface DataInputProps {
  value: string;
  onChange: (value: string) => void;
  mode: "mock" | "ai";
  onModeChange: (mode: "mock" | "ai") => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function DataInput({
  value,
  onChange,
  mode,
  onModeChange,
  onSubmit,
  isLoading,
}: DataInputProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-ventura-text">Raw Input</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ventura-muted">Mode:</span>
          <div className="flex rounded-md border border-ventura-border overflow-hidden">
            <button
              onClick={() => onModeChange("mock")}
              className={`px-3 py-1 text-xs transition-colors ${
                mode === "mock"
                  ? "bg-ventura-accent text-white"
                  : "bg-ventura-surface text-ventura-muted hover:text-ventura-text"
              }`}
            >
              Mock
            </button>
            <button
              onClick={() => onModeChange("ai")}
              className={`px-3 py-1 text-xs transition-colors ${
                mode === "ai"
                  ? "bg-ventura-accent text-white"
                  : "bg-ventura-surface text-ventura-muted hover:text-ventura-text"
              }`}
            >
              AI
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <span className="text-xs text-ventura-muted mr-2">Try a sample:</span>
        <SampleData onSelect={onChange} />
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your messy data here... emails, purchase orders, CSVs, or any unstructured product data."
        className="flex-1 w-full bg-ventura-surface border border-ventura-border rounded-lg p-4 text-sm text-ventura-text placeholder:text-ventura-muted/50 resize-none focus:outline-none focus:border-ventura-accent/50 font-mono min-h-[300px]"
      />

      <button
        onClick={onSubmit}
        disabled={!value.trim() || isLoading}
        className="mt-3 w-full py-2.5 rounded-lg bg-ventura-accent text-white text-sm font-medium hover:bg-[#006e52] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Processing..." : "Clean Data"}
      </button>
    </div>
  );
}
