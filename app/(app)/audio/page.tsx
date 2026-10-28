'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'

// ── helpers ───────────────────────────────────────────────────────────────────

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
}

function formatSummary(raw: unknown): string {
  if (!raw) return ''
  if (typeof raw === 'string') return raw
  if (typeof raw === 'object' && raw !== null && 'text' in raw) return String((raw as { text: unknown }).text)
  return ''
}

function getKeyPoints(raw: unknown): string[] {
  if (!raw || typeof raw !== 'object') return []
  const obj = raw as Record<string, unknown>
  if (Array.isArray(obj.keyPoints)) return obj.keyPoints.map(String)
  if (Array.isArray(obj.points))    return obj.points.map(String)
  return []
}

// ── component ─────────────────────────────────────────────────────────────────

export default function AudioPage() {
  const [selected,     setSelected]     = useState<string | null>(null)
  const [feedUrl,      setFeedUrl]      = useState('')
  const [showAdd,      setShowAdd]      = useState(false)
  const [activeTab,    setActiveTab]    = useState<'brief' | 'library'>('brief')
  const [subscribeErr, setSubscribeErr] = useState('')
  const [subscribed,   setSubscribed]   = useState(false)

  const { data: podData, refetch } = trpc.podcasts.list.useQuery()
  const { data: epData }           = trpc.podcasts.episodes.useQuery({ limit: 30 })

  const subscriptions = podData?.subscriptions ?? []
  const episodes      = epData?.items ?? []

  // Auto-select first episode
  useEffect(() => {
    if (!selected && episodes.length > 0) setSelected(episodes[0].id)
  }, [episodes, selected])

  const subscribeMut = trpc.podcasts.subscribe.useMutation({
    onSuccess: () => {
      setSubscribed(true)
      refetch()
      setTimeout(() => {
        setShowAdd(false)
        setFeedUrl('')
        setSubscribed(false)
      }, 1200)
    },
    onError: (err) => setSubscribeErr(err.message),
  })

  const ep = episodes.find(e => e.id === selected)

  // ESC closes modal
  useEffect(() => {
    if (!showAdd) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowAdd(false); setSubscribeErr(''); setFeedUrl('') }
    }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [showAdd])

  const isProcessing = (status: string) => status === 'pending' || status === 'processing'
  const isListened   = (status: string) => status === 'done'

  // Group episodes by subscription for the library tab
  const subMap = new Map(subscriptions.map(s => [s.id, s.title]))

  const totalInsights = episodes.reduce((acc, e) => {
    const kp = getKeyPoints(e.summary)
    return acc + kp.length
  }, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      <div className="page-header">
        <div>
          <h1 className="page-title">Audio</h1>
          <p className="page-subtitle">Daily brief and podcast library</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Subscribe to podcast
        </button>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', overflow: 'hidden' }}>

        {/* ── Left panel ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--b1)', overflow: 'hidden' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--b1)', background: 'var(--s1)', flexShrink: 0 }}>
            {(['brief', 'library'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: '13px', fontSize: '13px', fontWeight: 500,
                border: 'none', cursor: 'pointer', background: 'transparent',
                color: activeTab === tab ? 'var(--t1)' : 'var(--t3)',
                borderBottom: `2px solid ${activeTab === tab ? 'var(--v)' : 'transparent'}`,
                transition: 'all 120ms', fontFamily: 'var(--sans)',
              }}>
                {tab === 'brief' ? "Today's brief" : 'Library'}
              </button>
            ))}
          </div>

          {/* Brief banner */}
          {activeTab === 'brief' && episodes.length > 0 && (
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--b0)', background: 'var(--s2)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--coral-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="1.5">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--t1)', marginBottom: '2px' }}>Your brief for today</p>
                  <p style={{ fontSize: '12px', color: 'var(--t3)' }}>
                    {episodes.length} episode{episodes.length !== 1 ? 's' : ''} · {totalInsights} insights waiting
                  </p>
                </div>
                <button className="btn-secondary btn-sm">Listen all</button>
              </div>
            </div>
          )}

          {/* Library header */}
          {activeTab === 'library' && subscriptions.length > 0 && (
            <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--b0)', background: 'var(--s2)', flexShrink: 0 }}>
              <p style={{ fontSize: '11px', color: 'var(--t3)' }}>
                {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''} · {episodes.length} episodes
              </p>
            </div>
          )}

          {/* Episode list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {episodes.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', padding: '32px', textAlign: 'center' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--t4)" strokeWidth="1.2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
                <div>
                  <p style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--t2)', marginBottom: '4px' }}>No episodes yet</p>
                  <p style={{ fontSize: '12px', color: 'var(--t3)', lineHeight: 1.6 }}>Subscribe to a podcast to start building your library.</p>
                </div>
                <button className="btn-primary btn-sm" onClick={() => setShowAdd(true)}>Subscribe to podcast</button>
              </div>
            ) : (
              episodes.map(e => {
                const processing = isProcessing(e.processingStatus)
                const listened   = isListened(e.processingStatus)
                const podName    = subMap.get(e.subscriptionId ?? '') ?? 'Podcast'
                return (
                  <div key={e.id}
                    onClick={() => !processing && setSelected(e.id)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 20px',
                      borderBottom: '1px solid var(--b0)',
                      cursor: processing ? 'not-allowed' : 'pointer',
                      background: selected === e.id ? 'var(--s2)' : 'transparent',
                      opacity: processing ? 0.55 : 1, transition: 'background 100ms',
                    }}>
                    <div style={{ flexShrink: 0, marginTop: '5px' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: processing ? 'var(--t4)' : listened ? 'var(--t4)' : 'var(--coral)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: '3px' }}>{podName}</p>
                      <p style={{ fontSize: '13px', color: 'var(--t1)', lineHeight: 1.45, marginBottom: '5px' }}>{e.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--t3)' }}>{formatDuration(e.durationSeconds)}</span>
                        {processing && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: 500, color: 'var(--v)', background: 'var(--vd)', borderRadius: '4px', padding: '1px 7px' }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1.2s linear infinite', flexShrink: 0 }}>
                              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
                            </svg>
                            Transcribing
                          </span>
                        )}
                        {!processing && getKeyPoints(e.summary).length > 0 && (
                          <span style={{ fontSize: '11px', color: 'var(--t3)' }}>{getKeyPoints(e.summary).length} insights</span>
                        )}
                        {listened && (
                          <span style={{ fontSize: '11px', color: 'var(--ok)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                            Listened
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ── Right panel ────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--s1)', overflow: 'hidden' }}>
          {ep ? (
            <>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--b0)', flexShrink: 0 }}>
                <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: '6px' }}>
                  {subMap.get(ep.subscriptionId ?? '') ?? 'Podcast'}
                </p>
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--t1)', lineHeight: 1.4, marginBottom: '8px' }}>{ep.title}</p>
                <p style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '14px' }}>
                  {formatDuration(ep.durationSeconds)}
                  {getKeyPoints(ep.summary).length > 0 && ` · ${getKeyPoints(ep.summary).length} insights`}
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={ep.audioUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Listen
                  </a>
                  <button className="btn-primary btn-sm">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    Create post
                  </button>
                </div>
              </div>

              {formatSummary(ep.summary) && (
                <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--b0)', flexShrink: 0 }}>
                  <p style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '8px' }}>Summary</p>
                  <p style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.7 }}>{formatSummary(ep.summary)}</p>
                </div>
              )}

              {getKeyPoints(ep.summary).length > 0 ? (
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
                  <p style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '12px' }}>Key insights</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {getKeyPoints(ep.summary).map((point, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 12px', background: 'var(--s2)', border: '1px solid var(--b1)', borderLeft: '2px solid var(--coral)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--t3)', flexShrink: 0, marginTop: '2px', width: '14px' }}>{i + 1}.</span>
                        <p style={{ fontSize: '12.5px', color: 'var(--t1)', lineHeight: 1.65 }}>{point}</p>
                      </div>
                    ))}
                  </div>
                  <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '14px' }}>
                    Tag an insight to a contact
                  </button>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', gap: '8px' }}>
                  <p style={{ fontSize: '12.5px', color: 'var(--t3)', lineHeight: 1.6 }}>
                    {isProcessing(ep.processingStatus)
                      ? 'Episode is being transcribed. Key insights will appear here once done.'
                      : 'No insights extracted yet for this episode.'}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
              <p style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--t1)', marginBottom: '6px' }}>Select an episode</p>
              <p style={{ fontSize: '12.5px', color: 'var(--t3)', lineHeight: 1.6, maxWidth: '200px' }}>Click any episode to read its summary and key insights.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Subscribe modal ─────────────────────────────────────────────── */}
      {showAdd && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal-box" style={{ width: '420px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '6px' }}>Subscribe to a podcast</h2>
            <p style={{ fontSize: '12.5px', color: 'var(--t3)', marginBottom: '20px', lineHeight: 1.6 }}>Paste an RSS feed URL or pick from the list below.</p>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--t2)', marginBottom: '6px' }}>RSS feed URL</label>
              <input type="text" value={feedUrl} onChange={e => setFeedUrl(e.target.value)}
                placeholder="e.g. https://feeds.buzzsprout.com/123.rss" className="sable-input" />
            </div>

            {/* Already subscribed */}
            {subscriptions.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '8px' }}>Already subscribed</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {subscriptions.map(s => (
                    <div key={s.id} style={{ fontSize: '12.5px', color: 'var(--t2)', padding: '6px 10px', background: 'var(--s2)', borderRadius: '6px' }}>{s.title}</div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '10px' }}>Popular podcasts</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { name: "Lenny's Podcast",  feed: 'https://feeds.simplecast.com/OyeGSGSq' },
                  { name: 'My First Million', feed: 'https://feeds.megaphone.fm/MFM2426690007' },
                  { name: 'How I Built This', feed: 'https://feeds.npr.org/510313/podcast.xml' },
                ].map(p => (
                  <button key={p.name} onClick={() => setFeedUrl(p.feed)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 12px', borderRadius: '8px',
                    background: feedUrl === p.feed ? 'var(--vd)' : 'var(--s2)',
                    border: `1px solid ${feedUrl === p.feed ? 'var(--vm)' : 'var(--b1)'}`,
                    cursor: 'pointer', transition: 'all 120ms', textAlign: 'left',
                  }}>
                    <span style={{ fontSize: '13px', color: 'var(--t1)' }}>{p.name}</span>
                    <span style={{ fontSize: '11px', color: feedUrl === p.feed ? 'var(--v)' : 'var(--t3)' }}>
                      {feedUrl === p.feed ? '✓ Selected' : 'Select'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {subscribeErr && <p style={{ fontSize: '12px', color: 'var(--err)', marginBottom: '10px' }}>{subscribeErr}</p>}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => { setShowAdd(false); setSubscribeErr(''); setFeedUrl('') }}>Cancel</button>
              <button
                className="btn-primary"
                disabled={!feedUrl.trim() || subscribeMut.isPending || subscribed}
                onClick={() => {
                  setSubscribeErr('')
                  const NAMES: Record<string, string> = {
                    'https://feeds.simplecast.com/OyeGSGSq':       "Lenny's Podcast",
                    'https://feeds.megaphone.fm/MFM2426690007':    'My First Million',
                    'https://feeds.npr.org/510313/podcast.xml':    'How I Built This',
                  }
                  subscribeMut.mutate({ feedUrl, title: NAMES[feedUrl] })
                }}
                style={subscribed ? { background: 'var(--ok)', color: '#fff' } : {}}
              >
                {subscribeMut.isPending ? 'Subscribing…' : subscribed ? '✓ Subscribed' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
