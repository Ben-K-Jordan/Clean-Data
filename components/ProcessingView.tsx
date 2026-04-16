"use client";

import { useEffect, useState } from "react";

const steps = [
  { label: "Reading input", detail: "Parsing raw data format..." },
  { label: "Extracting items", detail: "Identifying product references..." },
  { label: "Matching catalog", detail: "Finding best SKU matches..." },
  { label: "Structuring output", detail: "Building clean line items..." },
];

export default function ProcessingView() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <div className="w-10 h-10 border-2 border-ventura-accent border-t-transparent rounded-full animate-spin mb-6" />
      <div className="space-y-3 w-full max-w-xs">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className={`flex items-center gap-3 transition-opacity duration-300 ${
              i <= activeStep ? "opacity-100" : "opacity-20"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                i < activeStep
                  ? "bg-ventura-success text-white"
                  : i === activeStep
                  ? "bg-ventura-accent text-white"
                  : "bg-ventura-border text-ventura-muted"
              }`}
            >
              {i < activeStep ? "\u2713" : i + 1}
            </div>
            <div>
              <div className="text-sm text-ventura-text">{step.label}</div>
              <div className="text-xs text-ventura-muted">{step.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
