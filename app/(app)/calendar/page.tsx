'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'

// ── types ────────────────────────────────────────────────────────────────────

type Post = {
  id: string
  body: string
  platforms: string[]
  scheduledAt: Date | string | null
  status: string
}

// ── helpers ──────────────────────────────────────────────────────────────────

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'IG',
  linkedin:  'LI',
  twitter:   'TW',
  tiktok:    'TK',
  facebook:  'FB',
  pinterest: 'PI',
}

const STATUS_COLOR: Record<string, string> = {
  scheduled:  'var(--v)',
  published:  'var(--ok)',
  draft:      'var(--t3)',
  failed:     'var(--err)',
  canceled:   'var(--t4)',
  publishing: 'var(--teal)',
  partial:    'var(--coral)',
}

function platformLabel(platforms: string[]) {
  return platforms.map(p => PLATFORM_LABELS[p] ?? p.slice(0, 2).toUpperCase()).join(' · ')
}

function truncate(s: string, n = 38) {
  return s.length > n ? s.slice(0, n) + '…' : s
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function formatTime(d: Date | string) {
  const dt = new Date(d)
  return `${pad2(dt.getHours())}:${pad2(dt.getMinutes())}`
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

// ── component ─────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const now = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1) // 1-based

  const { data, isLoading, refetch } = trpc.posts.byMonth.useQuery({ year, month })
  const reschedule = trpc.posts.update.useMutation({ onSuccess: () => refetch() })
  const [dragging, setDragging] = useState<Post | null>(null)

  // Build a map: day-of-month → posts
  const postsByDay = new Map<number, Post[]>()
  for (const post of data?.scheduled ?? []) {
    if (!post.scheduledAt) continue
    const day = new Date(post.scheduledAt).getDate()
    if (!postsByDay.has(day)) postsByDay.set(day, [])
    postsByDay.get(day)!.push(post)
  }

  // Calendar math
  const firstDow  = new Date(year, month - 1, 1).getDay()  // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate()

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const drafts = data?.drafts ?? []
  const todayDay = now.getFullYear() === year && now.getMonth() + 1 === month
    ? now.getDate() : -1

  // Grid cells: leading empties + days
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'var(--sans)', color: 'var(--t1)' }}>

      {/* ── calendar main ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '20px 24px', borderBottom: '1px solid var(--b1)',
          flexShrink: 0,
        }}>
          <button onClick={prevMonth} style={{
            background: 'none', border: '1px solid var(--b2)', borderRadius: '6px',
            color: 'var(--t2)', padding: '4px 10px', cursor: 'pointer', fontSize: '14px',
          }}>‹</button>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, minWidth: '160px', textAlign: 'center' }}>
            {MONTH_NAMES[month - 1]} {year}
          </h2>
          <button onClick={nextMonth} style={{
            background: 'none', border: '1px solid var(--b2)', borderRadius: '6px',
            color: 'var(--t2)', padding: '4px 10px', cursor: 'pointer', fontSize: '14px',
          }}>›</button>
          {isLoading && (
            <span style={{ marginLeft: 8, fontSize: '12px', color: 'var(--t3)' }}>Loading…</span>
          )}
        </div>

        {/* day-of-week headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid var(--b1)', flexShrink: 0,
        }}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} style={{
              padding: '8px 0', textAlign: 'center',
              fontSize: '11px', fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.06em',
            }}>{d}</div>
          ))}
        </div>

        {/* grid */}
        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridAutoRows: 'minmax(90px, 1fr)',
          overflow: 'auto',
        }}>
          {cells.map((day, i) => {
            const isToday = day === todayDay
            const posts   = day ? (postsByDay.get(day) ?? []) : []
            return (
              <div key={i}
                onDragOver={e => { if (day && dragging) e.preventDefault() }}
                onDrop={e => {
                  e.preventDefault()
                  if (!day || !dragging) return
                  const orig = dragging.scheduledAt ? new Date(dragging.scheduledAt) : new Date()
                  const next = new Date(year, month - 1, day, orig.getHours(), orig.getMinutes())
                  reschedule.mutate({ id: dragging.id, scheduledAt: next })
                  setDragging(null)
                }}
                style={{
                borderRight: '1px solid var(--b1)',
                borderBottom: '1px solid var(--b1)',
                padding: '6px',
                background: dragging && day ? 'color-mix(in srgb, var(--v) 4%, var(--bg))' : day ? 'var(--bg)' : 'var(--s1)',
                opacity: day ? 1 : 0.4,
                transition: 'background 120ms',
              }}>
                {day && (
                  <>
                    <div style={{
                      fontSize: '12px', fontWeight: isToday ? 700 : 400,
                      color: isToday ? 'var(--v)' : 'var(--t2)',
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: isToday ? 'color-mix(in srgb, var(--v) 15%, transparent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '4px',
                    }}>{day}</div>
                    {posts.slice(0, 3).map(post => (
                      <div key={post.id}
                        draggable
                        onDragStart={e => { e.stopPropagation(); setDragging(post) }}
                        onDragEnd={() => setDragging(null)}
                        style={{
                          fontSize: '10px', lineHeight: '1.3',
                          background: 'var(--s2)', borderRadius: '4px',
                          padding: '2px 5px', marginBottom: '2px',
                          borderLeft: `3px solid ${STATUS_COLOR[post.status] ?? 'var(--b2)'}`,
                          color: 'var(--t2)',
                          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                          cursor: 'grab', opacity: dragging?.id === post.id ? 0.4 : 1,
                          transition: 'opacity 120ms',
                        }}>
                        {post.scheduledAt && (
                          <span style={{ color: 'var(--t3)', marginRight: '4px' }}>
                            {formatTime(post.scheduledAt)}
                          </span>
                        )}
                        {truncate(post.body, 22)}
                      </div>
                    ))}
                    {posts.length > 3 && (
                      <div style={{ fontSize: '10px', color: 'var(--t3)', paddingLeft: '3px' }}>
                        +{posts.length - 3} more
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── sidebar: drafts ───────────────────────────────────────────────── */}
      <div style={{
        width: '240px', borderLeft: '1px solid var(--b1)',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        background: 'var(--s1)',
      }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--b1)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.08em' }}>
            DRAFTS
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {drafts.length === 0 && !isLoading && (
            <div style={{ fontSize: '12px', color: 'var(--t4)', padding: '8px', textAlign: 'center' }}>
              No drafts
            </div>
          )}
          {drafts.map(post => (
            <div key={post.id} style={{
              background: 'var(--bg)', borderRadius: '8px', padding: '10px 12px',
              marginBottom: '8px', border: '1px solid var(--b1)',
              cursor: 'default',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--t2)', lineHeight: '1.4', marginBottom: '6px' }}>
                {truncate(post.body, 60)}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--v)' }}>
                {platformLabel(post.platforms)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
