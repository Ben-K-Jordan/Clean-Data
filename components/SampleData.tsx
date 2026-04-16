"use client";

import { sampleEmail, samplePO, sampleCSV } from "@/lib/samples";

interface SampleDataProps {
  onSelect: (data: string) => void;
  active?: string;
}

const samples = [
  {
    label: "Email Request",
    data: sampleEmail,
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    desc: "Informal restock request with mixed formats",
  },
  {
    label: "Purchase Order",
    data: samplePO,
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    desc: "Structured PO with SKUs and pricing",
  },
  {
    label: "Messy CSV",
    data: sampleCSV,
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    desc: "Typos, inconsistent formats, missing fields",
  },
];

export default function SampleData({ onSelect, active }: SampleDataProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {samples.map((sample) => {
        const isActive = active === sample.data;
        return (
          <button
            key={sample.label}
            onClick={() => onSelect(sample.data)}
            className={`group flex flex-col items-start gap-1 px-3 py-2.5 text-left rounded-polaris border transition-all ${
              isActive
                ? "border-p-fill-brand bg-gray-50 shadow-polaris"
                : "border-p-border bg-p-surface hover:border-gray-300 hover:shadow-polaris-sm"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className={`${isActive ? "text-p-fill-brand" : "text-p-text-secondary group-hover:text-p-text"} transition-colors`}>
                {sample.icon}
              </span>
              <span className={`text-xs font-semibold ${isActive ? "text-p-fill-brand" : "text-p-text"}`}>
                {sample.label}
              </span>
            </div>
            <span className="text-[10px] text-p-text-secondary leading-tight">
              {sample.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
