"use client";

import { useEffect, useState } from "react";

const steps = [
  { label: "Reading input", detail: "Parsing raw data format..." },
  { label: "Extracting items", detail: "Identifying product references..." },
  { label: "Matching catalog", detail: "Finding best SKU matches..." },
  { label: "Structuring output", detail: "Building clean line items..." },
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

  const activeStep = Math.min(Math.floor(elapsed / 400), steps.length - 1);

  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <div className="w-8 h-8 border-2 border-p-fill-brand border-t-transparent rounded-full animate-spin mb-6" />
      <div className="space-y-3 w-full max-w-xs">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className={`flex items-center gap-3 transition-opacity duration-300 ${
              i <= activeStep ? "opacity-100" : "opacity-30"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                i < activeStep
                  ? "bg-p-fill-success text-white"
                  : i === activeStep
                  ? "bg-p-fill-brand text-white"
                  : "bg-p-border text-p-text-secondary"
              }`}
            >
              {i < activeStep ? "\u2713" : i + 1}
            </div>
            <div>
              <div className="text-sm text-p-text font-medium">{step.label}</div>
              <div className="text-xs text-p-text-secondary">{step.detail}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-xs text-p-text-secondary">
        {(elapsed / 1000).toFixed(1)}s
      </div>
    </div>
  );
}
