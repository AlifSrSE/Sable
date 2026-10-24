import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
      colors: {
        bg:     '#0C0B14',
        s1:     '#131221',
        s2:     '#1A1927',
        s3:     '#211F30',
        s4:     '#2A2840',
        t1:     '#EAE6FF',
        t2:     '#8B88A8',
        t3:     '#4A4760',
        t4:     '#2E2C42',
        violet: '#7C6AF7',
        teal:   '#2DD4BF',
        coral:  '#F4845F',
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.07)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config