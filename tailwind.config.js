/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1A18',        // base charcoal background
        'ink-2': '#232320',    // raised panels / cards
        'ink-3': '#2c2c28',    // hovered / lighter surface
        lime: '#AEEE2D',       // primary accent
        'lime-soft': '#c7f25e',
        olive: '#515E1B',      // big green panels
        'olive-deep': '#3C4714',
        paper: '#F4F4F0',      // warm white text
        muted: '#9C9C95',      // secondary text
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        script: ['"Caveat"', 'cursive'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}
