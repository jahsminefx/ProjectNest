/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17202a',
        panel: '#f7f8fa',
        line: '#d8dee7',
        accent: '#0f766e'
      },
      boxShadow: {
        soft: '0 8px 24px rgba(23, 32, 42, 0.08)'
      }
    }
  },
  plugins: []
};
