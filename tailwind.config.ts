import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          start: "#F0F9FF",
          end: "#F5F3FF",
        },
        slate: {
          900: "#1E293B",
          500: "#64748B",
        },
        primary: {
          DEFAULT: "#3B82F6",
        },
        health: {
          DEFAULT: "#10B981",
        },
        stress: {
          DEFAULT: "#F97316",
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
      },
      backgroundImage: {
        "mesh-gradient": "linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))",
      },
    },
  },
  plugins: [],
};
export default config;
