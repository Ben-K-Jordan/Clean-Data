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
        <div>
          <h2 className="text-[13px] font-semibold text-p-text">Raw Input</h2>
          <p className="text-[11px] text-p-text-secondary mt-0.5">Paste unstructured product data</p>
        </div>
        <div className="flex items-center gap-1.5 p-0.5 rounded-polaris bg-p-surface-secondary border border-p-border">
          <button
            onClick={() => onModeChange("mock")}
            className={`px-3 py-1 text-xs font-medium rounded-polaris-sm transition-all ${
              mode === "mock"
                ? "bg-p-surface text-p-text shadow-polaris-sm"
                : "text-p-text-secondary hover:text-p-text"
            }`}
          >
            Mock
          </button>
          <button
            onClick={() => onModeChange("ai")}
            className={`px-3 py-1 text-xs font-medium rounded-polaris-sm transition-all ${
              mode === "ai"
                ? "bg-p-surface text-p-text shadow-polaris-sm"
                : "text-p-text-secondary hover:text-p-text"
            }`}
          >
            AI
          </button>
        </div>
      </div>

      <div className="mb-3">
        <SampleData onSelect={onChange} active={value} />
      </div>

      <div className="relative flex-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your messy data here...&#10;&#10;Emails, purchase orders, CSVs, or any unstructured product data."
          className="w-full h-full bg-p-surface border border-p-border rounded-polaris p-4 text-[13px] text-p-text placeholder:text-p-text-secondary/40 resize-none focus:outline-none focus:ring-2 focus:ring-[#005bd3]/20 focus:border-[#005bd3]/40 font-mono leading-relaxed shadow-polaris-sm transition-shadow"
        />
        {value && (
          <button
            onClick={() => onChange("")}
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
