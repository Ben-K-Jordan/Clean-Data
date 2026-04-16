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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-p-text">Raw Input</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-p-text-secondary">Mode:</span>
          <div className="flex rounded-polaris-sm border border-p-border overflow-hidden">
            <button
              onClick={() => onModeChange("mock")}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                mode === "mock"
                  ? "bg-p-fill-brand text-white"
                  : "bg-p-surface text-p-text-secondary hover:bg-p-surface-secondary"
              }`}
            >
              Mock
            </button>
            <button
              onClick={() => onModeChange("ai")}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                mode === "ai"
                  ? "bg-p-fill-brand text-white"
                  : "bg-p-surface text-p-text-secondary hover:bg-p-surface-secondary"
              }`}
            >
              AI
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs text-p-text-secondary">Try a sample:</span>
        <SampleData onSelect={onChange} />
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your messy data here... emails, purchase orders, CSVs, or any unstructured product data."
        className="flex-1 w-full bg-p-surface border border-p-border rounded-polaris p-4 text-sm text-p-text placeholder:text-p-text-secondary/50 resize-none focus:outline-none focus:ring-2 focus:ring-p-fill-brand/20 focus:border-p-fill-brand/40 font-mono min-h-[300px] shadow-polaris-sm"
      />

      <button
        onClick={onSubmit}
        disabled={!value.trim() || isLoading}
        className="mt-3 w-full py-2.5 rounded-polaris bg-p-fill-brand text-white text-sm font-semibold hover:bg-p-fill-brand-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-polaris-sm"
      >
        {isLoading ? "Processing..." : "Clean Data"}
      </button>
    </div>
  );
}
