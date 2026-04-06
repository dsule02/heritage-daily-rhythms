import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bedtime: {
          dark: "#121212", // Charcoal background
          surface: "#1e1e1e", // Slightly lighter for cards
          gold: "#d4af37", // Warm gold accent
          amber: "#ffbf00", // Brighter amber for highlights
          text: "#f5f5f0", // Soft off-white text
          muted: "#a3a3a3", // Muted text for secondary info
        },
      },
      minHeight: {
        'tap': '44px',
      },
      minWidth: {
        'tap': '44px',
      }
    },
  },
  plugins: [],
};
export default config;
