import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
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
        <body className="bg-bg text-t1 font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}