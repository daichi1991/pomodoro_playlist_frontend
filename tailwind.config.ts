import type { Config } from "tailwindcss"

const { iconsPlugin, getIconCollections } = require("@egoist/tailwindcss-icons")

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-out-down": {
          from: {
            opacity: "1",
            transform: "translateY(0)",
          },
          to: {
            opacity: "0",
            transform: "translateY(10px)",
          },
        },
        "focus-bg-color": {
          "0%": {
            backgroundColor: "#0099CC",
          },
          "25%": {
            backgroundColor: "#009999",
          },
          "50%": {
            backgroundColor: "#339999",
          },
          "75%": {
            backgroundColor: "#3399CC",
          },
          "100%": {
            backgroundColor: "#0099CC",
          },
        },
        "break-bg-color": {
          "0%": {
            backgroundColor: "#FFFFCC",
          },
          "25%": {
            backgroundColor: "#CCFFCC",
          },
          "50%": {
            backgroundColor: "#CCFF99",
          },
          "75%": {
            backgroundColor: "#FFFF99",
          },
          "100%": {
            backgroundColor: "#FFFFCC",
          },
        },
        "fade-in-out": {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0.5",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "fade-out-down": "fade-out-down 0.5s ease-out",
        "focus-bg-color": "focus-bg-color 10s infinite",
        "break-bg-color": "break-bg-color 10s infinite",
        "fade-in-out": "fade-in-out 2s infinite alternate",
      },
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["material-symbols"]),
    }),
    function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        ".light-button": {
          backgroundColor: "#e5e7eb",
          color: "black",
          "&:hover": {
            backgroundColor: "#d1d5db",
          },
        },
        ".dark-button": {
          backgroundColor: "#1f2937",
          color: "white",
          "&:hover": {
            backgroundColor: "#6b7280",
          },
        },
        ".light-text-shadow": {
          textShadow: "0px 0px 50px black",
        },
        ".dark-text-shadow": {
          textShadow: "0px 0px 50px white",
        },
      }

      addUtilities(newUtilities)
    },
  ],
}
export default config
