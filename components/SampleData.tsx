"use client";

import { sampleEmail, samplePO, sampleCSV } from "@/lib/samples";

interface SampleDataProps {
  onSelect: (data: string) => void;
}

const samples = [
  { label: "Email Request", data: sampleEmail },
  { label: "Purchase Order", data: samplePO },
  { label: "Messy CSV", data: sampleCSV },
];

export default function SampleData({ onSelect }: SampleDataProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {samples.map((sample) => (
        <button
          key={sample.label}
          onClick={() => onSelect(sample.data)}
          className="px-3 py-1.5 text-xs font-medium rounded-polaris-sm bg-p-surface-secondary border border-p-border text-p-text-secondary hover:bg-p-border-secondary hover:text-p-text transition-all"
        >
          {sample.label}
        </button>
      ))}
    </div>
  );
}
