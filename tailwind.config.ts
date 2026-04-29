import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        surface: "#141414",
        "surface-raised": "#1C1C1C",
        cream: "#F5F0E8",
        "cream-muted": "#C4C0B8",
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E8C76C",
          dark: "#A88A2B",
        },
        rose: "#E8A5B8",
        emerald: "#0F7A5F",
        ink: "#0A0A0A",
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 7vw, 6.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.5rem, 5vw, 4.25rem)", { lineHeight: "1", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.625rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-sm": ["1.625rem", { lineHeight: "1.15" }],
        label: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.16em" }],
      },
      boxShadow: {
        gold: "0 0 32px rgba(212, 175, 55, 0.18)",
        "gold-soft": "0 0 16px rgba(212, 175, 55, 0.10)",
        elevated: "0 24px 48px -12px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        "gold-shimmer": "linear-gradient(135deg, #A88A2B 0%, #E8C76C 35%, #D4AF37 65%, #A88A2B 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
