import type { Config } from 'tailwindcss';

const {
  iconsPlugin,
  getIconCollections,
} = require("@egoist/tailwindcss-icons");

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'fade-in-up': {
            '0%': {
                opacity: '0',
                transform: 'translateY(10px)'
            },
            '100%': {
                opacity: '1',
                transform: 'translateY(0)'
            },
        },
        'fade-out-down': {
            'from': {
                opacity: '1',
                transform: 'translateY(0)'
            },
            'to': {
                opacity: '0',
                transform: 'translateY(10px)'
            },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-out-down': 'fade-out-down 0.5s ease-out',
      }
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["material-symbols"]),
    }),
  ],
}
export default config
