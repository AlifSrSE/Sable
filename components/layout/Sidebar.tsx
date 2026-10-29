'use client'

import React from 'react'
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
  const { data: notifData, refetch: refetchNotifs } = trpc.notifications.list.useQuery(
    { limit: 20 },
    { staleTime: 30000, refetchInterval: 60000 }
  )
  const markAllRead = trpc.notifications.markAllRead.useMutation({ onSuccess: () => refetchNotifs() })
  const markRead    = trpc.notifications.markRead.useMutation({ onSuccess: () => refetchNotifs() })

  const [notifOpen, setNotifOpen] = React.useState(false)
  const unreadCount = notifData?.unreadCount ?? 0

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setNotifOpen(p => !p)}
              style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--t2)', position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: 3, right: 3, width: 8, height: 8, borderRadius: '50%', background: 'var(--coral)', border: '1.5px solid var(--s1)' }} />
              )}
            </button>

            {notifOpen && (
              <div style={{ position: 'fixed', top: 56, left: 220, zIndex: 100, width: 320, background: 'var(--s2)', border: '1px solid var(--b2)', borderRadius: '0.75rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid var(--b1)' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)' }}>
                    Notifications
                    {unreadCount > 0 && <span style={{ fontSize: '11px', fontWeight: 600, padding: '1px 5px', borderRadius: '4px', background: 'color-mix(in srgb, var(--coral) 14%, transparent)', color: 'var(--coral)', marginLeft: 4 }}>{unreadCount}</span>}
                  </span>
                  {unreadCount > 0 && (
                    <button onClick={() => markAllRead.mutate()} style={{ fontSize: '11px', color: 'var(--v)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontWeight: 500 }}>
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                  {!notifData?.notifications?.length ? (
                    <div style={{ padding: '2rem', textAlign: 'center' as const, color: 'var(--t3)', fontSize: '13px' }}>No notifications yet</div>
                  ) : notifData.notifications.map(n => (
                    <div key={n.id}
                      onClick={() => { if (!n.readAt) markRead.mutate({ id: n.id }) }}
                      style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column' as const, gap: '0.25rem', borderBottom: '1px solid var(--b1)', cursor: n.readAt ? 'default' : 'pointer', background: n.readAt ? 'transparent' : 'color-mix(in srgb, var(--v) 4%, transparent)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <span style={{ fontSize: '13px', fontWeight: n.readAt ? 400 : 600, color: 'var(--t1)', lineHeight: '1.4' }}>{n.title}</span>
                        {!n.readAt && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--v)', flexShrink: 0, marginTop: 4 }} />}
                      </div>
                      {n.body && <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)', lineHeight: '1.5' }}>{n.body}</p>}
                      <span style={{ fontSize: '11px', color: 'var(--t3)' }}>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <ThemeToggle />
        </div>
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
        <UserButton />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</p>
          <p style={{ fontSize: '11px', color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.primaryEmailAddress?.emailAddress ?? ''}</p>
        </div>
      </div>
    </aside>
  )
}