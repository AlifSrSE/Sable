import type { Metadata } from 'next'
import Script from 'next/script'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Sable', template: '%s · Sable' },
  description: 'Your presence, amplified.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Blocking inline script — runs before first paint to apply saved theme and prevent flash */}
          <Script id="theme-init" strategy="beforeInteractive">{`
            try {
              var t = localStorage.getItem('sable-theme');
              if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
            } catch(e) {}
          `}</Script>
        </head>
        <body className="bg-bg text-t1 font-sans">
          <Providers>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}