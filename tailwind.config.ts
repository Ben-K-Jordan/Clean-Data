import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "San Francisco",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      colors: {
        v: {
          bg: "#f4f5f8",
          surface: "#ffffff",
          "surface-secondary": "#f7f7f7",
          text: "#303030",
          "text-secondary": "#616161",
          border: "#e3e3e3",
          "border-secondary": "#ebebeb",
          "fill-brand": "#0e1e50",
          "fill-brand-hover": "#0a1638",
          "fill-success": "#047b5d",
          "fill-critical": "#c70a24",
          "fill-warning": "#ffb800",
          "text-success": "#047b5d",
          "text-critical": "#c70a24",
          "bg-success": "#cdfee1",
          "bg-critical": "#fee2e2",
          icon: "#4a4a4a",
        },
      },
      borderRadius: {
        ventura: "8px",
        "ventura-sm": "6px",
        "ventura-lg": "12px",
        "ventura-xl": "16px",
      },
      boxShadow: {
        "ventura-sm": "0 1px 0 0 rgba(26, 26, 26, 0.07)",
        ventura: "0 3px 1px -1px rgba(26, 26, 26, 0.07)",
        "ventura-md":
          "0 4px 6px -2px rgba(26, 26, 26, 0.20)",
        "ventura-lg":
          "0 8px 16px -4px rgba(26, 26, 26, 0.22)",
      },
    },
  },
  plugins: [],
};
export default config;
