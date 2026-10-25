import { auth, currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()
  const firstName = user?.firstName ?? 'there'

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dayLabel = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })

  const [totalPosts, scheduledPosts, publishedPosts, totalContacts, needsAttention, upcomingPosts, staleContacts] = await Promise.all([
    prisma.contentPost.count({ where: { userId } }),
    prisma.contentPost.count({ where: { userId, status: 'scheduled' } }),
    prisma.contentPost.count({ where: { userId, status: 'published' } }),
    prisma.contact.count({ where: { userId, deletedAt: null } }),
    prisma.contact.count({
      where: {
        userId, deletedAt: null,
        OR: [
          { lastContactedAt: { lt: new Date(Date.now() - 14 * 86400000) } },
          { lastContactedAt: null },
        ],
      },
    }),
    prisma.contentPost.findMany({
      where: { userId, status: 'scheduled', scheduledAt: { gte: now } },
      orderBy: { scheduledAt: 'asc' },
      take: 3,
    }),
    prisma.contact.findMany({
      where: {
        userId, deletedAt: null,
        OR: [
          { lastContactedAt: { lt: new Date(Date.now() - 14 * 86400000) } },
          { lastContactedAt: null },
        ],
      },
      orderBy: { lastContactedAt: 'asc' },
      take: 3,
    }),
  ])

  const voiceProfilePct = Math.min(100, Math.round((Math.min(totalPosts, 50) / 50) * 100))
  const draftsCount = Math.max(0, totalPosts - scheduledPosts - publishedPosts)

  const daysSince = (d: Date | null) => {
    if (!d) return '—'
    const diff = Math.floor((Date.now() - d.getTime()) / 86400000)
    return `${diff}d inactive`
  }

  const platformColors: Record<string, string> = {
    linkedin: 'var(--teal)', x: 'var(--v)', twitter: 'var(--v)',
    substack: 'var(--coral)', instagram: 'var(--amber)',
  }
  const platformLabel: Record<string, string> = {
    linkedin: 'LINKEDIN', x: 'X / THREAD', twitter: 'X / THREAD',
    substack: 'SUBSTACK', instagram: 'INSTAGRAM',
  }

  const metrics = [
    { label: 'Total Reach', val: '—', badge: '+18.4%', bclr: 'var(--teal)', bars: [35,50,40,75,65,100] },
    { label: 'Scheduled', val: String(scheduledPosts).padStart(2,'0'), badge: `${scheduledPosts} pending`, bclr: 'var(--v)', bars: [30,20,80,60,90,85] },
    { label: 'Published', val: String(publishedPosts).padStart(2,'0'), badge: '+3 vs avg', bclr: 'var(--teal)', bars: [45,60,55,70,90,95] },
    { label: 'CRM Network', val: String(totalContacts), badge: needsAttention > 0 ? `${needsAttention} stale` : 'All fresh', bclr: 'var(--coral)', bars: [50,40,60,45,75,85] },
  ]

  const weekDays = [
    { day: 'MON', pct: 65, posts: '2 posts', isToday: false },
    { day: 'TUE', pct: 85, posts: '3 posts', isToday: false },
    { day: 'WED', pct: 100, posts: '4 posts', isToday: false, hi: true },
    { day: 'THU', pct: 40, posts: '1 post', isToday: false },
    { day: 'FRI', pct: 75, posts: '2 posts', isToday: false },
    { day: 'SAT', pct: 15, posts: 'Rest', isToday: false, dim: true },
    { day: 'SUN', pct: 60, posts: 'Today', isToday: true },
  ]

  const trends = [
    { velocity: '+340% velocity', cat: 'B2B Systems', title: 'Autonomous Agent Orchestration & Multi-modal UX Failures', body: 'Engineers are debating synchronous vs asynchronous human-in-the-loop validation patterns.' },
    { velocity: '+195% velocity', cat: 'Founder Distribution', title: 'Micro-Dispatches Outperforming Longform Whitepapers in Seed Round Closures', body: 'Founders report 3x inbound term sheets when publishing raw engineering logs weekly.' },
  ]

  const waveHeights = [12,24,32,20,28,16,36,24,12,28,40,20,8,32,24,12]

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: '1160px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--teal)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Editorial Console</span>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--t4)', display: 'inline-block' }} />
          <span style={{ fontSize: '12px', color: 'var(--t3)', letterSpacing: '-0.01em' }}>v2 Autonomous Engine</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', lineHeight: 1.1, color: 'var(--t1)', letterSpacing: '-0.025em', margin: 0 }}>
              {greeting}, {firstName}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--t2)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const, margin: '8px 0 0' }}>
              <span>{dayLabel}</span>
              {needsAttention > 0 && <>
                <span style={{ color: 'var(--b3)' }}>•</span>
                <span style={{ color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
                  {needsAttention} contact{needsAttention !== 1 ? 's' : ''} need attention
                </span>
              </>}
              {draftsCount > 0 && <>
                <span style={{ color: 'var(--b3)' }}>•</span>
                <span style={{ color: 'var(--coral)', fontWeight: 500 }}>{draftsCount} draft{draftsCount !== 1 ? 's' : ''} ready to review</span>
              </>}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <Link href="/connections" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', height: '40px', borderRadius: '8px', background: 'var(--s2)', border: '1px solid var(--b1)', color: 'var(--t1)', fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--v)" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Quick Action
            </Link>
            <Link href="/social" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 18px', height: '40px', borderRadius: '8px', background: 'var(--v)', color: 'var(--btn-primary-text)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New post
            </Link>
          </div>
        </div>
      </div>

      {/* Voice Calibration Banner */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '14px', background: 'var(--s1)', border: '1px solid var(--b1)', padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ position: 'absolute', right: '-64px', top: '-64px', width: '256px', height: '256px', background: 'var(--vd)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--vd)', border: '1px solid var(--vm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--v)" strokeWidth="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)' }}>Voice Model Calibrated: {voiceProfilePct}%</span>
                <span style={{ padding: '2px 10px', borderRadius: '99px', background: 'var(--vd)', color: 'var(--v)', fontSize: '11px', fontWeight: 600 }}>
                  {voiceProfilePct < 50 ? 'Building' : voiceProfilePct < 80 ? '+14% this week' : 'High Fidelity'}
                </span>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--t2)', lineHeight: 1.6, maxWidth: '520px', margin: 0 }}>
                {voiceProfilePct < 20
                  ? 'Start posting to build your voice model. Connect Substack & X archives to accelerate calibration.'
                  : voiceProfilePct < 80
                  ? `Your synthetic persona is capturing nuance accurately. Feed ${Math.ceil((80 - voiceProfilePct) / 2)} more verified dispatches or connect Substack & X archives to hit the 95% high-fidelity threshold.`
                  : 'Voice model is at high fidelity. Continue publishing to maintain precision and expand tonal range.'}
              </p>
              <div style={{ width: '100%', maxWidth: '400px', height: '6px', background: 'var(--s3)', borderRadius: '3px', overflow: 'hidden', marginTop: '12px' }}>
                <div style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, var(--v) 0%, var(--vh) 60%, var(--teal) 100%)', width: `${voiceProfilePct}%`, transition: 'width 600ms ease' }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <Link href="/connections" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 14px', height: '36px', borderRadius: '8px', background: 'var(--s2)', border: '1px solid var(--b1)', color: 'var(--t1)', fontSize: '12.5px', fontWeight: 500, textDecoration: 'none' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              Connect accounts
            </Link>
            <Link href="/settings" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', height: '36px', borderRadius: '8px', background: 'var(--vm)', color: 'var(--v)', fontSize: '12.5px', fontWeight: 600, textDecoration: 'none' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Calibrate now
            </Link>
          </div>
        </div>
      </div>

      {/* 8+4 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
            {metrics.map((m) => (
              <div key={m.label} style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{m.label}</span>
                  <span style={{ padding: '2px 7px', borderRadius: '99px', fontSize: '10px', fontWeight: 600, color: m.bclr, background: `color-mix(in srgb, ${m.bclr} 12%, transparent)` }}>{m.badge}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1 }}>{m.val}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', marginTop: '10px', height: '28px' }}>
                    {m.bars.map((h, i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '2px', background: m.bclr, opacity: 0.3 + (i / m.bars.length) * 0.7 }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Pipeline */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '14px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', color: 'var(--t1)', margin: 0 }}>Upcoming Editorial Pipeline</h2>
                <span style={{ padding: '2px 10px', borderRadius: '99px', background: 'var(--s3)', color: 'var(--v)', fontSize: '11px', fontWeight: 600 }}>{scheduledPosts} dispatch{scheduledPosts !== 1 ? 'es' : ''}</span>
              </div>
              <Link href="/calendar" style={{ fontSize: '12.5px', color: 'var(--v)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Open Calendar <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            {upcomingPosts.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--s2)', border: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--t1)', margin: '0 0 6px' }}>No posts scheduled yet</p>
                <p style={{ fontSize: '13px', color: 'var(--t3)', margin: '0 0 20px', maxWidth: '240px', lineHeight: 1.6 }}>Create and schedule your first post to start your editorial pipeline.</p>
                <Link href="/social" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', height: '36px', borderRadius: '8px', background: 'var(--v)', color: 'var(--btn-primary-text)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Create first post
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {upcomingPosts.map((post) => {
                  const platforms = post.platforms as string[]
                  const platform = (platforms?.[0] ?? 'post').toLowerCase()
                  const color = platformColors[platform] ?? 'var(--v)'
                  const label = platformLabel[platform] ?? platform.toUpperCase()
                  const scheduledStr = post.scheduledAt
                    ? new Date(post.scheduledAt).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
                    : ''
                  return (
                    <div key={post.id} style={{ padding: '14px 16px', borderRadius: '10px', background: 'var(--s2)', border: '1px solid var(--b0)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', minWidth: 0, flex: 1 }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: `color-mix(in srgb, ${color} 12%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' as const }}>
                            <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: 700, color, background: `color-mix(in srgb, ${color} 12%, transparent)`, letterSpacing: '0.06em' }}>{label}</span>
                            <span style={{ fontSize: '12px', color: 'var(--t3)' }}>{scheduledStr}</span>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
                            <span style={{ fontSize: '11px', color: 'var(--teal)', fontWeight: 500 }}>Ready to deploy</span>
                          </div>
                          <p style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--t1)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const, margin: 0 }}>{post.body}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <Link href="/social" style={{ padding: '0 12px', height: '30px', borderRadius: '6px', background: 'var(--s3)', border: '1px solid var(--b1)', color: 'var(--t1)', fontSize: '12px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Preview</Link>
                        <Link href="/social" style={{ padding: '0 12px', height: '30px', borderRadius: '6px', background: 'var(--v)', color: 'var(--btn-primary-text)', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Edit
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Weekly Cadence Velocity */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '14px', padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', margin: 0 }}>Weekly Cadence Velocity</h3>
                <p style={{ fontSize: '12px', color: 'var(--t3)', margin: '2px 0 0' }}>Optimal publishing frequency calibrated against founder-tier engagement</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--t1)' }}>Health Score: 92/100</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '8px' }}>
              {weekDays.map((d) => (
                <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '10px 8px', borderRadius: '10px', background: d.isToday ? 'var(--s3)' : 'var(--s2)', border: d.isToday ? '1px solid var(--vm)' : '1px solid var(--b0)', opacity: d.dim ? 0.5 : 1 }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: d.isToday ? 'var(--v)' : 'var(--t3)', letterSpacing: '0.04em' }}>{d.day}</span>
                  <div style={{ width: '100%', background: 'var(--bg)', height: '80px', borderRadius: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '3px' }}>
                    <div style={{ width: '100%', height: `${d.pct}%`, borderRadius: '4px', background: d.isToday || d.hi ? 'var(--v)' : d.dim ? 'var(--t4)' : 'color-mix(in srgb, var(--teal) 55%, transparent)', transition: 'height 300ms ease' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: d.isToday || d.hi ? 600 : 400, color: d.isToday || d.hi ? 'var(--v)' : 'var(--t2)', textAlign: 'center' as const, lineHeight: 1.2 }}>{d.posts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Contacts Needing Attention */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)' }}>Contacts Needing Attention</span>
              </div>
              <Link href="/crm" style={{ fontSize: '11.5px', color: 'var(--t3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                View All ({totalContacts}) <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            </div>
            {staleContacts.length === 0 ? (
              <div style={{ padding: '16px', background: 'var(--s2)', borderRadius: '10px', textAlign: 'center' as const }}>
                <p style={{ fontSize: '12.5px', color: 'var(--t3)', lineHeight: 1.6, margin: '0 0 10px' }}>
                  {totalContacts === 0 ? 'Add contacts to your CRM and Sable will tell you who needs a follow-up today.' : 'All contacts are up to date — no follow-ups needed right now.'}
                </p>
                <Link href="/crm" style={{ fontSize: '12px', color: 'var(--v)', textDecoration: 'none', fontWeight: 500 }}>
                  {totalContacts === 0 ? 'Add first contact →' : 'View CRM →'}
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {staleContacts.map((contact) => {
                  const initials = `${contact.firstName?.[0] ?? ''}${contact.lastName?.[0] ?? ''}`.toUpperCase() || '??'
                  return (
                    <div key={contact.id} style={{ padding: '12px', borderRadius: '10px', background: 'var(--s2)', border: '1px solid var(--b0)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--vd)', border: '1px solid var(--vm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--v)', flexShrink: 0 }}>{initials}</div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--t1)' }}>{contact.firstName} {contact.lastName}</div>
                            <div style={{ fontSize: '11.5px', color: 'var(--t3)' }}>{contact.company || 'Unknown company'}</div>
                          </div>
                        </div>
                        <span style={{ padding: '2px 8px', borderRadius: '99px', background: 'var(--s4)', color: 'var(--coral)', fontSize: '10.5px', fontWeight: 600, flexShrink: 0 }}>{daysSince(contact.lastContactedAt)}</span>
                      </div>
                      <p style={{ fontSize: '11.5px', color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                        {contact.notes ? contact.notes.slice(0, 80) + (contact.notes.length > 80 ? '…' : '') : 'No recent interaction notes.'}
                      </p>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link href="/crm" style={{ flex: 1, textAlign: 'center' as const, padding: '5px 8px', borderRadius: '6px', background: 'var(--s3)', border: '1px solid var(--b1)', color: 'var(--t1)', fontSize: '11.5px', fontWeight: 500, textDecoration: 'none' }}>Log touchpoint</Link>
                        <Link href="/social" style={{ padding: '5px 10px', borderRadius: '6px', background: 'var(--vd)', color: 'var(--v)', fontSize: '11.5px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                          Draft note
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Trending in Your Niche */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--v)', display: 'inline-block' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)' }}>Trending in Your Niche</span>
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--teal)', fontWeight: 500 }}>Real-time</span>
            </div>
            {trends.map((trend) => (
              <div key={trend.title} style={{ padding: '12px', borderRadius: '10px', background: 'var(--s2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'var(--s4)', color: 'var(--t3)', fontSize: '10.5px', fontWeight: 500, fontFamily: 'monospace' }}>{trend.velocity}</span>
                  <span style={{ fontSize: '11px', color: 'var(--t3)' }}>{trend.cat}</span>
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--t1)', lineHeight: 1.4, margin: 0 }}>{trend.title}</h4>
                <p style={{ fontSize: '11.5px', color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>{trend.body}</p>
                <Link href="/social" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', height: '28px', borderRadius: '6px', marginTop: '2px', background: 'var(--s3)', border: '1px solid var(--b1)', color: 'var(--t1)', fontSize: '11.5px', fontWeight: 500, textDecoration: 'none' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Draft opinion post
                </Link>
              </div>
            ))}
          </div>

          {/* Today's Audio Brief */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-32px', bottom: '-32px', width: '140px', height: '140px', background: 'var(--teal-dim)', borderRadius: '50%', filter: 'blur(32px)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)' }}>Today&#39;s Audio Brief</span>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: '99px', background: 'var(--teal-dim)', color: 'var(--teal)', fontSize: '10.5px', fontWeight: 600 }}>AI Distilled</span>
            </div>
            <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--s2)', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>Lenny&#39;s Podcast #142</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>How Linear Builds Product Without Roadmaps</div>
                </div>
              </div>
              <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3px', height: '44px' }}>
                {waveHeights.map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}px`, borderRadius: '2px', background: 'var(--teal)', opacity: 0.5 + (i % 3) * 0.2 }} />
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--t3)' }}>
                <span>16 key takeaways synthesized</span>
                <span>18 min summary</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/audio" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '7px', borderRadius: '6px', background: 'var(--s3)', border: '1px solid var(--b1)', color: 'var(--t1)', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Listen
                </Link>
                <Link href="/social" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '7px', borderRadius: '6px', background: 'var(--teal)', color: '#003731', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  Convert to Post
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
