'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'
import { trpc } from '@/lib/trpc'
import { SableMark } from '@/components/ui/SableMark'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const NAV = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Calendar',  href: '/calendar' },
      { label: 'Analytics', href: '/analytics' },
    ],
  },
  {
    label: 'Pillars',
    items: [
      { label: 'Social', href: '/social' },
      { label: 'CRM',    href: '/crm' },
      { label: 'Audio',  href: '/audio' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Connections', href: '/connections' },
      { label: 'Settings',    href: '/settings' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { data: postStats }    = trpc.posts.stats.useQuery(undefined, { staleTime: 60000 })
  const { data: contactStats } = trpc.contacts.stats.useQuery(undefined, { staleTime: 60000 })

  const scheduledCount = postStats?.scheduledPosts ?? 0
  const attentionCount = contactStats?.needsAttention ?? 0

  const BADGES: Record<string, { value: string; style: React.CSSProperties } | null> = {
    '/social': scheduledCount > 0 ? { value: String(scheduledCount), style: { background: 'var(--vd)', color: 'var(--v)' } } : null,
    '/crm':    attentionCount > 0 ? { value: attentionCount > 9 ? '9+' : String(attentionCount), style: { background: 'var(--coral-dim)', color: 'var(--coral)' } } : null,
    '/audio':  null,
  }

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user?.primaryEmailAddress?.emailAddress ?? 'My Account'

  return (
    <aside style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', width: '220px', flexShrink: 0,
      background: 'var(--s1)',
      borderRight: '1px solid var(--b1)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '56px', padding: '0 16px',
        borderBottom: '1px solid var(--b1)', flexShrink: 0,
      }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <SableMark size={26} />
          <span style={{ fontFamily: 'var(--serif)', fontSize: '15px', color: 'var(--t1)', letterSpacing: '-0.03em' }}>
            sable
          </span>
        </Link>
        <ThemeToggle />
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {NAV.map((group) => (
          <div key={group.label}>
            <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--t3)', padding: '0 8px', marginBottom: '4px' }}>
              {group.label}
            </p>
            <ul style={{ listStyle: 'none' }}>
              {group.items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <li key={item.href}>
                    <Link href={item.href} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '7px 10px', borderRadius: '7px',
                      fontSize: '13.5px',
                      color: isActive ? 'var(--t1)' : 'var(--t2)',
                      background: isActive ? 'var(--s2)' : 'transparent',
                      textDecoration: 'none', position: 'relative',
                      transition: 'all 120ms', fontWeight: isActive ? 500 : 400,
                    }}>
                      {isActive && (
                        <span style={{ position: 'absolute', left: 0, top: '6px', bottom: '6px', width: '2px', background: 'var(--v)', borderRadius: '0 2px 2px 0' }} />
                      )}
                      {item.label}
                      {BADGES[item.href] && (
                        <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', ...BADGES[item.href]!.style }}>
                          {BADGES[item.href]!.value}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid var(--b1)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <UserButton afterSignOutUrl="/" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</p>
          <p style={{ fontSize: '11px', color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.primaryEmailAddress?.emailAddress ?? ''}</p>
        </div>
      </div>
    </aside>
  )
}