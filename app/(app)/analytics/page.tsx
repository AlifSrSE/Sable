'use client'

import Link from 'next/link'

export default function AnalyticsPage() {
  const heatmapData = [
    { time: '07:00 AM', vals: [1.2, 2.1, 3.4, 2.0, 1.1, 0.4, 0.5] },
    { time: '09:30 AM', vals: [3.2, 4.8, 6.8, 4.9, 2.8, 1.2, 1.4] },
    { time: '12:30 PM', vals: [2.4, 2.9, 3.8, 2.9, 2.1, 1.6, 2.2] },
    { time: '04:00 PM', vals: [2.7, 3.6, 4.5, 6.2, 2.7, 1.0, 1.3] },
    { time: '08:30 PM', vals: [1.4, 2.2, 2.8, 2.7, 1.5, 0.8, 2.6] },
  ]

  const getHeatColor = (val: number): string => {
    if (val >= 6) return 'var(--teal)'
    if (val >= 4.5) return 'color-mix(in srgb, var(--v) 60%, transparent)'
    if (val >= 3.5) return 'color-mix(in srgb, var(--v) 40%, transparent)'
    if (val >= 2.5) return 'color-mix(in srgb, var(--v) 25%, transparent)'
    if (val >= 1.5) return 'color-mix(in srgb, var(--v) 12%, transparent)'
    return 'var(--s3)'
  }
  const getHeatText = (val: number): string => {
    if (val >= 6) return '#003731'
    if (val >= 4.5) return 'var(--t1)'
    if (val >= 3.5) return 'var(--t1)'
    if (val >= 2.5) return 'var(--t2)'
    return 'var(--t3)'
  }

  const chartWeeks = [
    { label: 'Sep 06', li: 55, x: 28, sub: 10 },
    { label: 'Sep 13', li: 70, x: 30, sub: 11 },
    { label: 'Sep 20', li: 80, x: 36, sub: 12 },
    { label: 'Sep 27', li: 90, x: 38, sub: 13 },
    { label: 'Oct 04', li: 75, x: 38, sub: 11 },
    { label: 'Oct 11', li: 95, x: 41, sub: 14 },
    { label: 'Oct 18', li: 145, x: 29, sub: 12, viral: true },
    { label: 'Oct 25', li: 105, x: 43, sub: 16 },
  ]
  const maxH = 240

  const dispatches = [
    { title: 'The Death of SaaS Seat Pricing', sub: 'Monetization architectural teardown · 1,420 words', platform: 'LinkedIn', platColor: 'var(--v)', date: 'Oct 18, 2026', reach: '42.1k', eng: '7.8%', leads: 6 },
    { title: 'The Architecture of Solitary Scale', sub: 'Operating $2M ARR with zero headcount', platform: 'Substack', platColor: 'var(--coral)', date: 'Oct 12, 2026', reach: '28.4k', eng: '5.9%', leads: 4 },
    { title: '10 brutal truths about building in public', sub: 'Solo founder insights · Thread', platform: 'X', platColor: 'var(--v)', date: 'Oct 09, 2026', reach: '18.7k', eng: '9.2%', leads: 3 },
    { title: 'Why Output-Based Billing Is Inevitable', sub: 'Enterprise GTM strategy · Long-form', platform: 'LinkedIn', platColor: 'var(--v)', date: 'Oct 03, 2026', reach: '14.3k', eng: '4.4%', leads: 1 },
  ]

  const insightCards = [
    { color: 'var(--v)', label: 'Audience Gravity', body: 'LinkedIn drives 61% of your impressions but only 38% of inbound CRM leads — X thread posts are your highest lead-gen surface per impression unit.' },
    { color: 'var(--teal)', label: 'Timing Intelligence', body: 'Optimal sweet spots: Wed 9:30 AM and Thu 4:00 PM show 2.1× CRM conversion lift over random publishing. Queue 2 posts this cycle.' },
    { color: 'var(--coral)', label: 'Format Bias', body: 'Long-form teardowns (>1,000 words) generate 3.4× more saves and DMs than list-format threads. Prioritise depth over breadth.' },
  ]

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: '1160px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Pillar Telemetry · Live Stream</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.4rem', color: 'var(--t1)', letterSpacing: '-0.025em', margin: '0 0 6px' }}>Editorial Intelligence & Analytics</h1>
          <p style={{ fontSize: '14px', color: 'var(--t2)', margin: 0 }}>Audience resonance, distribution velocity & conversion telemetry across all pillars.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', borderRadius: '8px', background: 'var(--s2)', border: '1px solid var(--b1)', fontSize: '12.5px', color: 'var(--t1)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--v)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Last 30 Days: Sep 25 – Oct 25, 2026
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', background: 'var(--s2)', border: '1px solid var(--b1)', color: 'var(--v)', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Telemetry (CSV)
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
        {/* Impressions */}
        <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Total Impressions</span>
            <span style={{ padding: '2px 8px', borderRadius: '99px', background: 'var(--teal-dim)', color: 'var(--teal)', fontSize: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              +24.2%
            </span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '2.1rem', color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1 }}>142.8k</div>
            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '4px' }}>vs 115.0k prior 30-day epoch</div>
          </div>
          <div>
            <div style={{ height: '6px', borderRadius: '3px', overflow: 'hidden', background: 'var(--s3)', display: 'flex', gap: '2px' }}>
              <div style={{ width: '61.6%', background: 'var(--v)', borderRadius: '3px' }} />
              <div style={{ width: '29.4%', background: 'var(--teal)', borderRadius: '3px' }} />
              <div style={{ width: '9%', background: 'var(--coral)', borderRadius: '3px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--t3)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--v)', display: 'inline-block' }} />LI 88k</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />X 42k</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--coral)', display: 'inline-block' }} />Sub 12.8k</span>
            </div>
          </div>
        </div>

        {/* Resonance */}
        <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Resonance Rate</span>
            <span style={{ padding: '2px 8px', borderRadius: '99px', background: 'var(--teal-dim)', color: 'var(--teal)', fontSize: '10px', fontWeight: 600 }}>+1.8%</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '2.1rem', color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1 }}>6.4%</div>
            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '4px' }}>Peer baseline index: 3.2%</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[{ label: 'Avg Dwell', val: '52 sec' }, { label: 'Consistency', val: '92%' }].map((m) => (
              <div key={m.label} style={{ background: 'var(--s2)', borderRadius: '8px', padding: '8px' }}>
                <div style={{ fontSize: '10.5px', color: 'var(--t3)' }}>{m.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--t1)', marginTop: '2px' }}>{m.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Inbound Pipeline */}
        <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Inbound Pipeline</span>
            <span style={{ padding: '2px 8px', borderRadius: '99px', background: 'var(--teal-dim)', color: 'var(--teal)', fontSize: '10px', fontWeight: 600 }}>+4 MoM</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '2.1rem', color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1 }}>14 Contacts</div>
            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '4px' }}>5 Active deals initiated via content</div>
          </div>
          <Link href="/crm" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--v)', textDecoration: 'none', fontWeight: 500 }}>
            Inspect in Pipeline CRM
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {/* Voice Calibration */}
        <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Model Calibration</span>
            <span style={{ padding: '2px 8px', borderRadius: '99px', background: 'var(--teal-dim)', color: 'var(--teal)', fontSize: '10px', fontWeight: 600 }}>+14% wk</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '2.1rem', color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1 }}>68%</div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--v)' }}>Hi-Fi</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '4px' }}>Next Tier Autonomous target: 95%</div>
          </div>
          <div>
            <div style={{ height: '6px', borderRadius: '3px', overflow: 'hidden', background: 'var(--s3)' }}>
              <div style={{ width: '68%', height: '100%', background: 'var(--v)', borderRadius: '3px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '10px', color: 'var(--t3)', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
              <span>Heuristic: Grounded</span>
              <span>Adaptive V3</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8+4 Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Distribution Velocity Chart */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '14px', padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--t1)', margin: 0 }}>Distribution Velocity & Platform Volume</h2>
                <p style={{ fontSize: '12px', color: 'var(--t3)', margin: '3px 0 0' }}>Aggregated multi-channel weekly reach over 8 operational cycles</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--s2)', borderRadius: '8px', padding: '4px' }}>
                {['Impressions', 'Engagement', 'Inbound DMs'].map((tab, i) => (
                  <button key={tab} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: i === 0 ? 600 : 400, background: i === 0 ? 'var(--s3)' : 'transparent', color: i === 0 ? 'var(--v)' : 'var(--t3)', cursor: 'pointer', border: 'none' }}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: 'var(--s2)', borderRadius: '8px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11.5px', color: 'var(--t1)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '9px', height: '9px', borderRadius: '2px', background: 'var(--v)', display: 'inline-block' }} />LinkedIn</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '9px', height: '9px', borderRadius: '2px', background: 'var(--teal)', display: 'inline-block' }} />X (Twitter)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '9px', height: '9px', borderRadius: '2px', background: 'var(--coral)', display: 'inline-block' }} />Substack</span>
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--teal)', fontWeight: 500 }}>★ Viral Oct 18 peak: 42k views, 18 inbound DMs</span>
            </div>

            {/* SVG Chart */}
            <div style={{ position: 'relative', height: '220px' }}>
              <svg width="100%" height="220" viewBox="0 0 760 220" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                {/* Grid lines */}
                {[40, 100, 160, 210].map((y) => (
                  <line key={y} x1="0" y1={y} x2="760" y2={y} stroke="var(--b1)" strokeWidth="1" strokeDasharray="4 4" />
                ))}
                {chartWeeks.map((w, i) => {
                  const x = i * (760 / 8) + 20
                  const scale = 200 / maxH
                  const liH = w.li * scale
                  const xH = w.x * scale * 0.5
                  const subH = w.sub * scale * 0.3
                  const total = liH + xH + subH
                  return (
                    <g key={w.label}>
                      <rect x={x} y={210 - liH} width="32" height={liH} rx="3" fill="var(--v)" opacity="0.85" />
                      <rect x={x} y={210 - liH - xH} width="32" height={xH} rx="3" fill="var(--teal)" opacity="0.85" />
                      <rect x={x} y={210 - liH - xH - subH} width="32" height={subH} rx="2" fill="var(--coral)" opacity="0.85" />
                      {w.viral && <circle cx={x + 16} cy={210 - total - 10} r="5" fill="var(--teal)" opacity="0.9" />}
                    </g>
                  )
                })}
              </svg>
              {/* X axis labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px 0', fontSize: '11px', color: 'var(--t3)' }}>
                {chartWeeks.map((w) => (
                  <span key={w.label} style={{ color: w.viral ? 'var(--teal)' : 'var(--t3)', fontWeight: w.viral ? 600 : 400 }}>{w.label}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '10px', fontSize: '12px', color: 'var(--t3)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--v)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              Highest surge generated via long-form text teardowns across executive LinkedIn networks.
            </div>
          </div>

          {/* Heatmap */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '14px', padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--t1)', margin: 0 }}>Optimal Cadence vs Resonance Heatmap</h2>
                <p style={{ fontSize: '12px', color: 'var(--t3)', margin: '3px 0 0' }}>Historical reply and save velocity categorized across 35 recurring publishing windows</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--t3)' }}>
                <span>Low</span>
                {['var(--s3)', 'color-mix(in srgb, var(--v) 12%, transparent)', 'color-mix(in srgb, var(--v) 30%, transparent)', 'color-mix(in srgb, var(--v) 55%, transparent)', 'var(--teal)'].map((c, i) => (
                  <div key={i} style={{ width: '12px', height: '12px', borderRadius: '3px', background: c }} />
                ))}
                <span>Peak</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: '580px' }}>
                {/* Header row */}
                <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(7, 1fr)', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--t3)', paddingLeft: '4px' }}>Time Slot</span>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <span key={d} style={{ textAlign: 'center' as const, fontSize: '10.5px', fontWeight: 600, color: ['Wed', 'Thu'].includes(d) ? 'var(--teal)' : 'var(--t3)' }}>{d}</span>
                  ))}
                </div>
                {heatmapData.map((row) => (
                  <div key={row.time} style={{ display: 'grid', gridTemplateColumns: '90px repeat(7, 1fr)', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--t3)', display: 'flex', alignItems: 'center', paddingLeft: '4px' }}>{row.time}</span>
                    {row.vals.map((v, i) => (
                      <div key={i} style={{ height: '36px', borderRadius: '6px', background: getHeatColor(v), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: v >= 5 ? 700 : 500, color: getHeatText(v), boxShadow: v >= 6 ? '0 0 12px color-mix(in srgb, var(--teal) 35%, transparent)' : 'none' }}>
                        {v}x{v >= 6 ? ' 🔥' : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '12px', padding: '10px 14px', background: 'var(--s2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--t1)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Sweet spot identified: <strong>Wednesdays at 9:30 AM</strong> and <strong>Thursdays at 4:00 PM</strong> show 2.1× inbound CRM conversion lift over random publishing.
            </div>
          </div>

          {/* High-Resonance Dispatches */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '14px', padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--t1)', margin: 0 }}>High-Resonance Dispatches</h2>
                <p style={{ fontSize: '12px', color: 'var(--t3)', margin: '3px 0 0' }}>Direct attribution metrics for editorial assets released during current telemetry cycle</p>
              </div>
              <Link href="/social" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '7px', background: 'var(--s2)', border: '1px solid var(--b1)', fontSize: '12px', color: 'var(--t1)', textDecoration: 'none', fontWeight: 500 }}>
                View All (28) <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </Link>
            </div>
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--s2)' }}>
                    {['Dispatch Title', 'Platform', 'Published', 'Reach', 'Engagement', 'CRM Leads', ''].map((h, i) => (
                      <th key={h + i} style={{ padding: '10px 14px', textAlign: (i === 6 ? 'right' : 'left') as 'left' | 'right', fontSize: '10.5px', fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const, borderRadius: i === 0 ? '6px 0 0 6px' : i === 6 ? '0 6px 6px 0' : 0 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dispatches.map((d, i) => (
                    <tr key={d.title} style={{ borderBottom: i < dispatches.length - 1 ? '1px solid var(--b0)' : 'none' }}>
                      <td style={{ padding: '13px 14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)' }}>{d.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '2px' }}>{d.sub}</div>
                      </td>
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{ padding: '2px 9px', borderRadius: '99px', fontSize: '10.5px', fontWeight: 600, color: d.platColor, background: `color-mix(in srgb, ${d.platColor} 12%, transparent)` }}>{d.platform}</span>
                      </td>
                      <td style={{ padding: '13px 14px', fontSize: '12px', color: 'var(--t3)', whiteSpace: 'nowrap' as const }}>{d.date}</td>
                      <td style={{ padding: '13px 14px', fontSize: '13.5px', fontWeight: 600, color: 'var(--t1)' }}>{d.reach}</td>
                      <td style={{ padding: '13px 14px', fontSize: '13px', fontWeight: 600, color: 'var(--teal)' }}>{d.eng}</td>
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '2px 8px', borderRadius: '6px', background: 'var(--s2)', fontSize: '11.5px', fontWeight: 500, color: 'var(--teal)' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
                          {d.leads} Leads
                        </span>
                      </td>
                      <td style={{ padding: '13px 14px', textAlign: 'right' as const }}>
                        <button style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--s2)', border: '1px solid var(--b1)', fontSize: '11.5px', color: 'var(--t1)', cursor: 'pointer', fontWeight: 500 }}>
                          Repurpose AI
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right — AI Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--v)', display: 'inline-block' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)' }}>AI Intelligence</span>
            <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: '99px', background: 'var(--vd)', color: 'var(--v)', fontSize: '10.5px', fontWeight: 600 }}>Live</span>
          </div>

          {insightCards.map((card) => (
            <div key={card.label} style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: card.color, display: 'inline-block' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t1)' }}>{card.label}</span>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--t2)', lineHeight: 1.65, margin: 0 }}>{card.body}</p>
            </div>
          ))}

          {/* Channel Share */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t1)', marginBottom: '12px' }}>Channel Share</div>
            {[
              { label: 'LinkedIn', pct: 61.6, color: 'var(--v)' },
              { label: 'X (Twitter)', pct: 29.4, color: 'var(--teal)' },
              { label: 'Substack', pct: 9.0, color: 'var(--coral)' },
            ].map((ch) => (
              <div key={ch.label} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--t2)' }}>{ch.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t1)' }}>{ch.pct}%</span>
                </div>
                <div style={{ height: '5px', borderRadius: '3px', background: 'var(--s3)' }}>
                  <div style={{ width: `${ch.pct}%`, height: '100%', borderRadius: '3px', background: ch.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Best Windows */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b1)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t1)', marginBottom: '12px' }}>Best Publishing Windows</div>
            {[
              { day: 'Wed 9:30 AM', mult: '6.8×', tip: 'Highest resonance window across LinkedIn' },
              { day: 'Thu 4:00 PM', mult: '6.2×', tip: 'Top X/Substack engagement slot' },
              { day: 'Tue 9:30 AM', mult: '4.8×', tip: 'Strong LinkedIn morning slot' },
            ].map((w) => (
              <div key={w.day} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'var(--teal-dim)', color: 'var(--teal)', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{w.mult}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t1)' }}>{w.day}</div>
                  <div style={{ fontSize: '11px', color: 'var(--t3)' }}>{w.tip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
