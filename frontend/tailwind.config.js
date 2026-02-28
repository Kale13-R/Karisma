/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'k-bg': 'var(--bg)',
        'k-fg': 'var(--fg)',
        'k-muted': 'var(--fg-muted)',
        'k-accent': 'var(--accent)',
      },
      fontFamily: {
        mono: ['Helvetica Neue', 'monospace'],
      },
    },
  },
  plugins: [],
}
