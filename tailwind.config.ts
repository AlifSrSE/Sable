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
        // All colors use CSS variables so they respond to data-theme="light"
        bg:     'var(--bg)',
        s1:     'var(--s1)',
        s2:     'var(--s2)',
        s3:     'var(--s3)',
        s4:     'var(--s4)',
        s5:     'var(--s5)',
        t1:     'var(--t1)',
        t2:     'var(--t2)',
        t3:     'var(--t3)',
        t4:     'var(--t4)',
        violet: 'var(--v)',
        teal:   'var(--teal)',
        coral:  'var(--coral)',
        amber:  'var(--amber)',
        ok:     'var(--ok)',
        err:    'var(--err)',
      },
      borderColor: {
        DEFAULT: 'var(--b1)',
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
