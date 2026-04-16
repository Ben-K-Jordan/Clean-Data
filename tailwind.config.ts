import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ventura: {
          bg: "#0a0a0a",
          surface: "#141414",
          border: "#262626",
          accent: "#008060",
          success: "#95bf47",
          text: "#fafafa",
          muted: "#a1a1aa",
        },
      },
    },
  },
  plugins: [],
};
export default config;
