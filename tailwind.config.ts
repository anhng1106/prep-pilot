import {heroui} from '@heroui/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(button|card|table|user|ripple|spinner|checkbox|form|avatar).js"
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
};

export default config;
