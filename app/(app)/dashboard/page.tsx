import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()
  const firstName = user?.firstName ?? 'there'

  // Real stats from database
  const [totalPosts, scheduledPosts, totalContacts, needsAttention] = await Promise.all([
    prisma.contentPost.count({
      where: { userId },
    }),
    prisma.contentPost.count({
      where: { userId, status: 'scheduled' },
    }),
    prisma.contact.count({
      where: { userId, deletedAt: null },
    }),
    prisma.contact.count({
      where: {
        userId,
        deletedAt: null,
        OR: [
          { lastContactedAt: { lt: new Date(Date.now() - 14 * 86400000) } },
          { lastContactedAt: null },
        ],
      },
    }),
  ])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  const C: Record<string, React.CSSProperties> = {
    page:       { padding: '28px 32px 40px', maxWidth: '1080px' },
    header:     { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' },
    h1:         { fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '4px' },
    sub:        { fontSize: '13px', color: 'var(--t3)' },
    banner:     { display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', position: 'relative', overflow: 'hidden' },
    bannerBar:  { position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'var(--v)' },
    bannerIcon: { width: '32px', height: '32px', borderRadius: '8px', background: 'var(--vd)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    bannerProg: { height: '3px', background: 'var(--s3)', borderRadius: '2px', overflow: 'hidden', marginTop: '6px' },
    bannerFill: { height: '100%', width: '5%', background: 'var(--v)', borderRadius: '2px' },
    grid:       { display: 'grid', gridTemplateColumns: '1fr 288px', gap: '16px' },
    leftPanel:  { background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
    panelHead:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--b0)' },
    statsRow:   { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '1px solid var(--b0)' },
    statCell:   { padding: '14px 20px' },
    statVal:    { fontFamily: 'var(--serif)', fontSize: '1.9rem', color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1 },
    statLabel:  { fontSize: '11px', color: 'var(--t3)', marginTop: '4px' },
    empty:      { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', textAlign: 'center' },
    emptyIcon:  { width: '44px', height: '44px', borderRadius: '12px', background: 'var(--s2)', border: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
    rightRail:  { display: 'flex', flexDirection: 'column', gap: '12px' },
    intelCard:  { background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '12px', overflow: 'hidden' },
    intelHead:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid var(--b0)' },
    intelBody:  { padding: '14px 16px' },
    intelText:  { fontSize: '12.5px', color: 'var(--t3)', lineHeight: 1.65 },
  }

  return (
    <div style={C.page}>
      <div style={C.header}>
        <div>
          <h1 style={C.h1}>{greeting}, {firstName}</h1>
          <p style={C.sub}>{today} · {needsAttention} contact{needsAttention !== 1 ? 's' : ''} need attention</p>
        </div>
        <a href="/social" className="btn-primary" style={{ textDecoration: 'none' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New post
        </a>
      </div>

      {/* Voice banner */}
      <div style={C.banner}>
        <div style={C.bannerBar} />
        <div style={C.bannerIcon}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--v)" strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--v)', marginBottom: '5px' }}>
            Voice profile building — post content to get started
          </p>
          <div style={C.bannerProg}><div style={C.bannerFill} /></div>
        </div>
        <a href="/connections" className="btn-secondary btn-sm" style={{ textDecoration: 'none', flexShrink: 0 }}>
          Connect accounts
        </a>
      </div>

      <div style={C.grid}>
        {/* Left — post timeline */}
        <div style={C.leftPanel}>
          <div style={C.panelHead}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--v)', display: 'inline-block' }} />
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--t1)' }}>Upcoming posts</span>
            </div>
            <a href="/calendar" style={{ fontSize: '12.5px', color: 'var(--t3)', textDecoration: 'none' }}>View calendar →</a>
          </div>
          <div style={C.statsRow}>
            {[
              { val: String(totalPosts),     label: 'Posts created' },
              { val: String(scheduledPosts), label: 'Scheduled' },
              { val: String(totalContacts),  label: 'CRM contacts' },
            ].map((s, i) => (
              <div key={i} style={{ ...C.statCell, borderRight: i < 2 ? '1px solid var(--b0)' : 'none' }}>
                <div style={C.statVal}>{s.val}</div>
                <div style={C.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={C.empty}>
            <div style={C.emptyIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--t1)', marginBottom: '6px' }}>No posts scheduled yet</p>
            <p style={{ fontSize: '13px', color: 'var(--t3)', marginBottom: '20px', maxWidth: '240px', lineHeight: 1.6 }}>
              Connect a social account and create your first post to get started.
            </p>
            <a href="/social" className="btn-primary" style={{ textDecoration: 'none' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create first post
            </a>
          </div>
        </div>

        {/* Right rail */}
        <div style={C.rightRail}>
          {[
            { dot: 'var(--v)',     title: 'Trending in your niche',       link: '/settings', cta: 'Set up niche →',              body: 'Set your niche in settings and connect social accounts to see relevant trending topics here.' },
            { dot: 'var(--teal)', title: 'Contacts needing attention',    link: '/crm',      cta: 'Add first contact →',         body: 'Add contacts to your CRM and Sable will tell you who needs a follow-up today.' },
            { dot: 'var(--coral)',title: "Today's brief",                  link: '/audio',    cta: 'Subscribe to a podcast →',    body: 'Subscribe to podcasts in the Audio section to get your personalised daily brief here.' },
          ].map((card) => (
            <div key={card.title} style={C.intelCard}>
              <div style={C.intelHead}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', fontWeight: 500, color: 'var(--t2)' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: card.dot, display: 'inline-block' }} />
                  {card.title}
                </div>
                <a href={card.link} style={{ fontSize: '11.5px', color: 'var(--t3)', textDecoration: 'none' }}>View →</a>
              </div>
              <div style={C.intelBody}>
                <p style={C.intelText}>{card.body}</p>
                <a href={card.link} style={{ display: 'inline-block', marginTop: '10px', fontSize: '12.5px', color: 'var(--v)', textDecoration: 'none' }}>
                  {card.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}