import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        segoe: ['Segoe UI', 'Segoe UI Variable', 'system-ui', 'sans-serif'],
      },
    },
  },
};

export default config;
