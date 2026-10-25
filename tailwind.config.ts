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
        // All colors reference CSS variables — respond to data-theme="light" automatically
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
        'violet-h': 'var(--vh)',
        teal:   'var(--teal)',
        coral:  'var(--coral)',
        amber:  'var(--amber)',
        ok:     'var(--ok)',
        err:    'var(--err)',
        // Border shorthand aliases
        b0:     'var(--b0)',
        b1:     'var(--b1)',
        b2:     'var(--b2)',
        b3:     'var(--b3)',
      },
      borderColor: {
        DEFAULT: 'var(--b1)',
      },
      // Match Kinetic Editorial radius scale
      borderRadius: {
        'sm':  '0.125rem',  // 2px
        DEFAULT: '0.25rem', // 4px  — base interactive elements
        'md':  '0.375rem',  // 6px
        'lg':  '0.5rem',    // 8px  — cards, panels
        'xl':  '0.75rem',   // 12px — modals, overlays
        '2xl': '1rem',      // 16px — large sheets
        'full': '9999px',   // pills, badges
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 180ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
