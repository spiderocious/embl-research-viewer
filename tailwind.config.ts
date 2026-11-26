import type { Config } from 'tailwindcss';

// EMBL-EBI brand tokens, read from live ebi.ac.uk / embl.org CSS.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        petrol: { DEFAULT: '#007C82', dark: '#005B60', wash: '#EAF5F5' },
        'embl-blue': { DEFAULT: '#3B6FB6', dark: '#193F90' },
        'embl-green': { DEFAULT: '#18974C', wash: '#EAF5EE' },
        ink: { DEFAULT: '#1A1C1A', 2: '#54585A', 3: '#767A78' },
        line: { DEFAULT: '#D7DAD7', soft: '#E8EAE8' },
        mast: '#2F322E',
        alert: '#C0392B',
        'bg-alt': '#F5F6F5',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
