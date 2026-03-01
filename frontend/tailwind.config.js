module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff88',
        'neon-cyan': '#00ffcc',
        'dark-bg': '#0a0a0a',
      },
      keyframes: {
        floatOrb: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-30px)' },
        },
        floatParticle: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-40px) translateX(-10px)' },
          '75%': { transform: 'translateY(-20px) translateX(15px)' },
        },
      },
      animation: {
        'float-slow': 'floatOrb 6s ease-in-out infinite',
        'float-slow-delay': 'floatOrb 6s ease-in-out infinite 3s',
        'float-particle': 'floatParticle 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
