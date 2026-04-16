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
        p: {
          bg: "#f1f1f1",
          surface: "#ffffff",
          "surface-secondary": "#f7f7f7",
          text: "#303030",
          "text-secondary": "#616161",
          border: "#e3e3e3",
          "border-secondary": "#ebebeb",
          "fill-brand": "#303030",
          "fill-brand-hover": "#1a1a1a",
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
        polaris: "8px",
        "polaris-sm": "6px",
        "polaris-lg": "12px",
        "polaris-xl": "16px",
      },
      boxShadow: {
        "polaris-sm": "0 1px 0 0 rgba(26, 26, 26, 0.07)",
        polaris: "0 3px 1px -1px rgba(26, 26, 26, 0.07)",
        "polaris-md":
          "0 4px 6px -2px rgba(26, 26, 26, 0.20)",
        "polaris-lg":
          "0 8px 16px -4px rgba(26, 26, 26, 0.22)",
      },
    },
  },
  plugins: [],
};
export default config;
