"use client";

import { useEffect, useState } from "react";

const steps = [
  {
    label: "Reading input",
    detail: "Parsing raw data format...",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    label: "Extracting items",
    detail: "Identifying product references...",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Matching catalog",
    detail: "Finding best SKU matches...",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    label: "Structuring output",
    detail: "Building clean line items...",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

interface ProcessingViewProps {
  startTime: number;
}

export default function ProcessingView({ startTime }: ProcessingViewProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 50);
    return () => clearInterval(interval);
  }, [startTime]);

  const activeStep = Math.min(Math.floor(elapsed / 350), steps.length - 1);

  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      {/* Shopify-style spinner */}
      <div className="relative w-12 h-12 mb-8">
        <div className="absolute inset-0 border-[3px] border-p-border rounded-full" />
        <div className="absolute inset-0 border-[3px] border-transparent border-t-[#008060] rounded-full animate-spin" />
      </div>

      <div className="space-y-2 w-full max-w-sm">
        {steps.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 p-2.5 rounded-polaris transition-all duration-300 ${
                active
                  ? "bg-p-surface-secondary border border-p-border"
                  : done
                  ? "opacity-60"
                  : "opacity-20"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                  done
                    ? "bg-[#cdfee1] text-[#047b5d]"
                    : active
                    ? "bg-[#008060] text-white"
                    : "bg-p-surface-secondary text-p-text-secondary"
                }`}
              >
                {done ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>
              <div>
                <div className={`text-[13px] font-medium ${active ? "text-p-text" : "text-p-text-secondary"}`}>
                  {step.label}
                </div>
                <div className="text-[11px] text-p-text-secondary">
                  {step.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-[11px] text-p-text-secondary tabular-nums">
        {(elapsed / 1000).toFixed(1)}s elapsed
      </div>
    </div>
  );
}
