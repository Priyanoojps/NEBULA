/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nebula: {
          bg: '#050a1a',
          sidebar: '#070d20',
          card: '#0a1628',
          border: '#1a2a4a',
          pink: '#ff2d78',
          cyan: '#00e5ff',
          purple: '#7b2fff',
          navy: '#0d1b3e',
          glow: '#ff2d7840',
          text: '#e2e8f8',
          muted: '#6b7fa8',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        pink: '0 0 20px #ff2d7866',
        cyan: '0 0 20px #00e5ff66',
        purple: '0 0 20px #7b2fff66',
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'orbit': 'orbit 8s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shooting-star': 'shootingStar 1s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'supernova': 'supernova 0.6s ease-out forwards',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.3, transform: 'scale(0.8)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(30px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(30px) rotate(-360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px #ff2d7866' },
          '50%': { boxShadow: '0 0 30px #ff2d78cc' },
        },
        shootingStar: {
          '0%': { transform: 'translateX(0) translateY(0)', opacity: 1 },
          '100%': { transform: 'translateX(200px) translateY(-200px)', opacity: 0 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        supernova: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(3)', opacity: 0.8 },
          '100%': { transform: 'scale(0)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
