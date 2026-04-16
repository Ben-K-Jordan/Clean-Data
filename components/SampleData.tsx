"use client";

import { sampleEmail, samplePO, sampleCSV } from "@/lib/samples";

interface SampleDataProps {
  onSelect: (data: string) => void;
}

const samples = [
  { label: "Email Request", data: sampleEmail, icon: "\u2709" },
  { label: "Purchase Order", data: samplePO, icon: "\uD83D\uDCC4" },
  { label: "Messy CSV", data: sampleCSV, icon: "\uD83D\uDCC3" },
];

export default function SampleData({ onSelect }: SampleDataProps) {
  return (
    <div className="flex gap-2">
      {samples.map((sample) => (
        <button
          key={sample.label}
          onClick={() => onSelect(sample.data)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-ventura-surface border border-ventura-border text-ventura-muted hover:text-ventura-text hover:border-ventura-accent/50 transition-all"
        >
          <span>{sample.icon}</span>
          {sample.label}
        </button>
      ))}
    </div>
  );
}
