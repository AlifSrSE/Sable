'use client'

import { useMemo } from 'react'

interface Props {
  firstName: string
  needsAttention: number
}

export function GreetingHeader({ firstName, needsAttention }: Props) {
  const { greeting, today } = useMemo(() => {
    const h = new Date().getHours()
    return {
      greeting: h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening',
      today: new Date().toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long',
      }),
    }
  }, [])

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '4px' }}>
        {greeting}, {firstName}
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--t3)' }}>
        {today} · {needsAttention} contact{needsAttention !== 1 ? 's' : ''} need attention
      </p>
    </div>
  )
}
