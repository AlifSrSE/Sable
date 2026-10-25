'use client'

import { useState } from 'react'

type ViewMode = 'month' | 'week' | 'list'

interface CalendarPost {
  id: string
  day: number
  time: string
  platform: 'LinkedIn' | 'X Thread' | 'X Dispatch' | 'Substack'
  title: string
  status: 'Published' | 'Scheduled' | 'Needs Review' | 'Draft'
}

interface DraftPost {
  id: string
  title: string
  platform: 'LinkedIn' | 'X Thread' | 'Substack'
  aiScore: number
  hook: string
}

const posts: CalendarPost[] = [
  { id: '1', day: 1, time: '09:00 AM', platform: 'LinkedIn', title: 'Why we killed our traditional dev roadmap...', status: 'Published' },
  { id: '2', day: 2, time: '03:30 PM', platform: 'X Thread', title: '7 prompt patterns for hyper-focused teams', status: 'Published' },
  { id: '3', day: 6, time: '10:15 AM', platform: 'LinkedIn', title: 'The solo operator tech stack for late 2026', status: 'Scheduled' },
  { id: '4', day: 8, time: '08:00 AM', platform: 'Substack', title: 'Issue #48: The death of generic design systems', status: 'Needs Review' },
  { id: '5', day: 9, time: '01:45 PM', platform: 'X Dispatch', title: 'A breakdown of our $42k MRR infrastructure', status: 'Scheduled' },
  { id: '6', day: 12, time: '09:30 AM', platform: 'LinkedIn', title: 'Stop optimizing for the algorithm. Start optimizing for humans.', status: 'Scheduled' },
  { id: '7', day: 14, time: '05:00 PM', platform: 'X Thread', title: 'Case study: Redesigning Sable in 48 hours', status: 'Scheduled' },
  { id: '8', day: 16, time: '11:00 AM', platform: 'LinkedIn', title: '5 things we learned building tactile UI for editors', status: 'Scheduled' },
  { id: '9', day: 20, time: '08:30 AM', platform: 'Substack', title: 'The quiet collapse of algorithmic social feeds', status: 'Needs Review' },
  { id: '10', day: 23, time: '10:00 AM', platform: 'LinkedIn', title: 'AI won\'t replace founders. Here\'s what will.', status: 'Scheduled' },
  { id: '11', day: 25, time: '02:15 PM', platform: 'X Thread', title: 'Inside our editorial ops: 6 months of learnings', status: 'Draft' },
  { id: '12', day: 28, time: '09:00 AM', platform: 'LinkedIn', title: 'The content moat is dead. Long live the voice moat.', status: 'Scheduled' },
]

const drafts: DraftPost[] = [
  { id: 'd1', title: 'Why most SaaS onboarding is broken (and how to fix it)', platform: 'LinkedIn', aiScore: 94, hook: 'Strong hook, optimal length' },
  { id: 'd2', title: 'Thread: The 10 tools I\'d rebuild if starting from scratch', platform: 'X Thread', aiScore: 87, hook: 'High engagement potential' },
  { id: 'd3', title: 'Issue #49: The architecture of a one-person media company', platform: 'Substack', aiScore: 91, hook: 'Deep-dive format' },
  { id: 'd4', title: 'Operators vs Optimizers: which one are you?', platform: 'LinkedIn', aiScore: 88, hook: 'Opinion-first framing' },
]

const platformColor = (platform: string) => {
  if (platform === 'LinkedIn') return { border: 'var(--teal)', bg: 'color-mix(in srgb, var(--teal) 12%, transparent)', text: 'var(--teal)' }
  if (platform.startsWith('X')) return { border: 'var(--v)', bg: 'color-mix(in srgb, var(--v) 12%, transparent)', text: 'var(--v)' }
  if (platform === 'Substack') return { border: 'var(--coral)', bg: 'color-mix(in srgb, var(--coral) 12%, transparent)', text: 'var(--coral)' }
  return { border: 'var(--b2)', bg: 'var(--s3)', text: 'var(--t2)' }
}

const statusColor = (status: string) => {
  if (status === 'Published') return 'var(--teal)'
  if (status === 'Scheduled') return 'var(--v)'
  if (status === 'Needs Review') return 'var(--coral)'
  return 'var(--amber)'
}

// October 2026 starts on Thursday (index 4)
const MONTH_START_DOW = 4
const MONTH_DAYS = 31

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>('month')
  const [selectedDay, setSelectedDay] = useState<number | null>(25)

  // Build 6-week grid (42 cells)
  const cells: Array<{ day: number | null; prevMonth?: boolean }> = []
  for (let i = 0; i < MONTH_START_DOW; i++) cells.push({ day: 27 + i, prevMonth: true })
  for (let d = 1; d <= MONTH_DAYS; d++) cells.push({ day: d })
  while (cells.length < 42) cells.push({ day: cells.length - MONTH_DAYS - MONTH_START_DOW + 1, prevMonth: false })

  const postsOnDay = (day: number) => posts.filter(p => p.day === day)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--t1)', margin: 0, letterSpacing: '-0.01em' }}>
              Calendar
            </h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.125rem 0.625rem', borderRadius: '9999px', background: 'color-mix(in srgb, var(--teal) 12%, transparent)', color: 'var(--teal)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 2s infinite' }} />
              Live Sync
            </span>
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--t3)' }}>
            8 scheduled dispatches · 4 drafts in queue for October 2026
          </p>
        </div>
        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          {/* View switcher */}
          <div style={{ display: 'flex', padding: '0.125rem', borderRadius: '0.5rem', background: 'var(--s2)' }}>
            {(['month', 'week', 'list'] as ViewMode[]).map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '0.25rem 0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--sans)', transition: 'all 0.15s', background: view === v ? 'var(--s3)' : 'transparent', color: view === v ? 'var(--v)' : 'var(--t3)' }}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--s2)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>
            <button style={{ width: 28, height: 28, borderRadius: '0.375rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--t3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
            <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--t1)', padding: '0 0.5rem', fontFamily: 'var(--sans)' }}>October 2026</span>
            <button style={{ width: 28, height: 28, borderRadius: '0.375rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--t3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>›</button>
          </div>
          <button style={{ padding: '0.375rem 0.75rem', borderRadius: '0.5rem', border: 'none', background: 'var(--s3)', color: 'var(--t1)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Today</button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', borderRadius: '0.5rem', border: 'none', background: 'var(--v)', color: 'var(--btn-primary-text)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
            + New post
          </button>
        </div>
      </div>

      {/* Metric tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem' }}>
        {[
          { label: 'Scheduled', value: '08', unit: 'dispatches locked', badge: '+3 vs Sep', badgeColor: 'var(--teal)', sub: '5 on LinkedIn · 3 on X', dot: 'var(--teal)' },
          { label: 'Drafts in Queue', value: '04', unit: 'unassigned slots', badge: 'Review needed', badgeColor: 'var(--coral)', sub: '2 high-impact hooks ready', dot: 'var(--coral)' },
          { label: 'Estimated Reach', value: '34.5k', unit: 'impressions', badge: '↑ 18.4%', badgeColor: 'var(--teal)', sub: 'Peak time: Wed & Fri 09:30 AM', dot: null },
          { label: 'Consistency Score', value: '92%', unit: 'target cadence', badge: '3 wks streak', badgeColor: 'var(--teal)', sub: null, progress: 92, dot: null },
        ].map((m, i) => (
          <div key={i} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--s2)', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--b1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--t3)' }}>{m.label}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '0.125rem 0.5rem', borderRadius: '9999px', background: `color-mix(in srgb, ${m.badgeColor} 12%, transparent)`, color: m.badgeColor }}>{m.badge}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--t1)' }}>{m.value}</span>
              <span style={{ fontSize: '12px', color: 'var(--t3)' }}>{m.unit}</span>
            </div>
            {m.progress !== undefined ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--s3)', overflow: 'hidden' }}>
                  <div style={{ width: `${m.progress}%`, height: '100%', background: 'var(--teal)', borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--t3)' }}>4/5 wks</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                {m.dot && <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />}
                <span style={{ fontSize: '12px', color: 'var(--t2)' }}>{m.sub}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ borderRadius: '0.75rem', background: 'var(--s2)', overflow: 'hidden', border: '1px solid var(--b1)' }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--s3)', borderBottom: '1px solid var(--b1)' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ textAlign: 'center', padding: '0.625rem 0', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t3)' }}>{d}</div>
          ))}
        </div>
        {/* Month cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'var(--b1)' }}>
          {cells.map((cell, idx) => {
            const dayPosts = cell.day && !cell.prevMonth ? postsOnDay(cell.day) : []
            const isToday = cell.day === 25 && !cell.prevMonth
            const isSelected = selectedDay === cell.day && !cell.prevMonth
            const isPrevMonth = cell.prevMonth
            const isNextMonth = !isPrevMonth && cell.day !== null && cell.day! > 31

            return (
              <div
                key={idx}
                onClick={() => !isPrevMonth && !isNextMonth && cell.day && setSelectedDay(cell.day)}
                style={{
                  minHeight: 120,
                  background: isPrevMonth || isNextMonth ? 'color-mix(in srgb, var(--bg) 60%, transparent)' : isSelected ? 'color-mix(in srgb, var(--v) 5%, var(--s1))' : 'var(--s1)',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  cursor: isPrevMonth || isNextMonth ? 'default' : 'pointer',
                  opacity: isPrevMonth || isNextMonth ? 0.35 : 1,
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 500, fontFamily: 'var(--sans)',
                    background: isToday ? 'var(--v)' : 'transparent',
                    color: isToday ? 'var(--btn-primary-text)' : isPrevMonth || isNextMonth ? 'var(--t3)' : 'var(--t1)',
                  }}>{cell.day}</span>
                </div>
                {dayPosts.map(post => {
                  const pc = platformColor(post.platform)
                  return (
                    <div key={post.id} style={{ borderLeft: `2px solid ${pc.border}`, background: 'var(--s2)', borderRadius: '0.25rem', padding: '0.375rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.125rem', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, padding: '0 0.375rem', borderRadius: '0.25rem', background: pc.bg, color: pc.text }}>{post.platform}</span>
                        <span style={{ fontSize: '10px', color: 'var(--t3)', fontFamily: 'var(--sans)' }}>{post.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--t1)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor(post.status), flexShrink: 0 }} />
                        <span style={{ fontSize: '10px', color: statusColor(post.status) }}>{post.status}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Unscheduled Drafts Queue */}
      <div style={{ borderRadius: '0.75rem', background: 'var(--s2)', border: '1px solid var(--b1)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)' }}>Unscheduled Drafts</h2>
            <p style={{ margin: '0.125rem 0 0', fontSize: '12px', color: 'var(--t3)' }}>AI-scored and ready to schedule</p>
          </div>
          <button style={{ padding: '0.375rem 0.875rem', borderRadius: '0.5rem', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--t2)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>View all drafts</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'var(--b1)' }}>
          {drafts.map(draft => {
            const pc = platformColor(draft.platform)
            return (
              <div key={draft.id} style={{ background: 'var(--s1)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--t1)', lineHeight: '1.4', flex: 1 }}>{draft.title}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--sans)', color: draft.aiScore >= 90 ? 'var(--teal)' : 'var(--v)' }}>{draft.aiScore}</span>
                    <span style={{ fontSize: '10px', color: 'var(--t3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI Score</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '0.125rem 0.5rem', borderRadius: '0.25rem', background: pc.bg, color: pc.text }}>{draft.platform}</span>
                  <span style={{ fontSize: '12px', color: 'var(--t3)' }}>{draft.hook}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{ flex: 1, padding: '0.375rem 0', borderRadius: '0.375rem', border: 'none', background: 'var(--v)', color: 'var(--btn-primary-text)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Schedule</button>
                  <button style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--t2)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Edit</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
