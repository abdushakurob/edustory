module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgba(255, 255, 255, 0.35)",
        input: "rgba(255, 255, 255, 0.5)",
        ring: "rgba(37, 99, 235, 0.4)",
        background: "#f3f4f6", // neutral-100
        foreground: "#1f2937", // neutral-800
        primary: {
          DEFAULT: "#2563eb", // blue-600
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f1f5f9", // slate-100
          foreground: "#1e293b", // slate-800
        },
        destructive: {
          DEFAULT: "#ef4444", // red-500
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#94a3b8", // slate-400
          foreground: "#cbd5e1", // slate-300
        },
        accent: {
          DEFAULT: "#10b981", // emerald-500
          foreground: "#ffffff",
        },
        glass: {
          border: "rgba(255, 255, 255, 0.35)",
          surface: "rgba(255, 255, 255, 0.45)",
          highlight: "rgba(255, 255, 255, 0.2)",
        },
      },
      borderRadius: {
        lg: "1.25rem", // 20px
        md: "0.875rem", // 14px
        sm: "0.5rem",   // 8px
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        "glass-sm": "0 4px 16px 0 rgba(31, 38, 135, 0.05)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
