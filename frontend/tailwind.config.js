/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        vermilion: {
          50: '#FDF4F2',
          100: '#FCE7E4',
          200: '#F8CFC9',
          300: '#F1ABA0',
          400: '#E77867',
          500: '#F35944',
          600: '#C83625',
          700: '#B32E1F',
          800: '#942619',
          900: '#7B241A',
          950: '#430F0A',
        },
        stone: {
          50: '#FAF9F7',
          100: '#F4F3F0',
          150: '#EFECE7',
          200: '#E5E2DC',
          300: '#D4D0C7',
          400: '#A39E93',
          500: '#736E65',
          600: '#524E47',
          700: '#3D3A35',
          800: '#262422',
          900: '#181716',
          950: '#0F0E0D',
        },
      },
    },
  },
  plugins: [],
}
