import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()
  const firstName = user?.firstName ?? 'there'

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 18 ? 'Good afternoon' :
    'Good evening'

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div style={{ padding: '28px 32px 40px', maxWidth: '1080px', animation: 'fadeIn 200ms ease-out' }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '4px' }}>
            {greeting}, {firstName}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--t3)' }}>{today}</p>
        </div>
        <a href="/social" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          height: '36px', padding: '0 16px',
          background: 'var(--v)', color: '#fff',
          fontSize: '13.5px', fontWeight: 500,
          border: 'none', borderRadius: '8px',
          cursor: 'pointer', textDecoration: 'none',
          transition: 'background 120ms',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New post
        </a>
      </div>

      {/* Voice confidence banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        background: 'var(--s1)', border: '1px solid var(--b1)',
        borderRadius: '10px', padding: '14px 18px', marginBottom: '24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'var(--v)', borderRadius: '0 2px 2px 0' }} />
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--vd)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--v)" strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--v)', marginBottom: '5px' }}>
            Voice profile building — post content to get started
          </p>
          <div style={{ height: '3px', background: 'var(--s3)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '5%', background: 'var(--v)', borderRadius: '2px' }} />
          </div>
        </div>
        <a href="/connections" style={{
          flexShrink: 0, fontSize: '12.5px', color: 'var(--t2)',
          background: 'var(--btn-secondary-bg)', border: '1px solid var(--btn-secondary-border)',
          padding: '0 14px', height: '30px', borderRadius: '7px',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          textDecoration: 'none', transition: 'all 120ms',
        }}>
          Connect accounts
        </a>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 288px', gap: '16px' }}>

        {/* Left — upcoming posts */}
        <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--b0)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--v)' }} />
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--t1)' }}>Upcoming posts</span>
            </div>
            <a href="/calendar" style={{ fontSize: '12.5px', color: 'var(--t3)', textDecoration: 'none' }}>View calendar →</a>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid var(--b0)' }}>
            {[
              { val: '0',  label: 'Posts this week',   delta: null },
              { val: '0',  label: 'Total impressions', delta: null },
              { val: '0%', label: 'Engagement rate',   delta: null },
            ].map((stat, i) => (
              <div key={i} style={{ padding: '14px 20px', borderRight: i < 2 ? '1px solid var(--b0)' : 'none' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {stat.val}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--s2)', border: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
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
            <a href="/social" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              height: '34px', padding: '0 16px',
              background: 'var(--v)', color: '#fff',
              fontSize: '13px', fontWeight: 500, borderRadius: '8px',
              textDecoration: 'none', transition: 'background 120ms',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create first post
            </a>
          </div>
        </div>

        {/* Right rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Trends */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid var(--b0)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', fontWeight: 500, color: 'var(--t2)' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--v)' }} />
                Trending in your niche
              </div>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <p style={{ fontSize: '12.5px', color: 'var(--t3)', lineHeight: 1.65 }}>
                Set your niche in settings and connect social accounts to see relevant trending topics here.
              </p>
              <a href="/settings" style={{ display: 'inline-block', marginTop: '10px', fontSize: '12.5px', color: 'var(--v)', textDecoration: 'none' }}>
                Set up niche →
              </a>
            </div>
          </div>

          {/* CRM re-engage */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid var(--b0)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', fontWeight: 500, color: 'var(--t2)' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--teal)' }} />
                Contacts needing attention
              </div>
              <a href="/crm" style={{ fontSize: '11.5px', color: 'var(--t3)', textDecoration: 'none' }}>View CRM →</a>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <p style={{ fontSize: '12.5px', color: 'var(--t3)', lineHeight: 1.65 }}>
                Add contacts to your CRM and Sable will tell you who needs a follow-up today.
              </p>
              <a href="/crm" style={{ display: 'inline-block', marginTop: '10px', fontSize: '12.5px', color: 'var(--v)', textDecoration: 'none' }}>
                Add first contact →
              </a>
            </div>
          </div>

          {/* Audio brief */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid var(--b0)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', fontWeight: 500, color: 'var(--t2)' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--coral)' }} />
                Today's brief
              </div>
              <a href="/audio" style={{ fontSize: '11.5px', color: 'var(--t3)', textDecoration: 'none' }}>Open audio →</a>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <p style={{ fontSize: '12.5px', color: 'var(--t3)', lineHeight: 1.65 }}>
                Subscribe to podcasts in the Audio section to get your personalised daily brief here.
              </p>
              <a href="/audio" style={{ display: 'inline-block', marginTop: '10px', fontSize: '12.5px', color: 'var(--v)', textDecoration: 'none' }}>
                Subscribe to a podcast →
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}