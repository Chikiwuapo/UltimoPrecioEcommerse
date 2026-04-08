export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#dc2626',
          black: '#0a0a0a',
        },
        ui: {
          blackDeep: '#0A0A0A',
          graphite: '#121212',
        },
        accent: {
          neonBlue: '#00D4FF',
          electricBlue: '#0099FF',
          goldBright: '#FFD700',
          goldDark: '#C9A227',
        },
        textc: {
          white: '#FFFFFF',
          grayLight: '#BFBFBF',
        },
      },
    },
  },
  plugins: [],
}
