'use client'

interface Connection {
  id: string
  name: string
  subtitle: string
  icon: string
  status: 'active' | 'beta' | 'coming-soon' | 'ready'
  statusLabel: string
  identity?: { initials: string; name: string; handle: string }
  scopes?: string
  features?: string[]
  lastSync?: string
  tokenHealth?: number
  feedHealth?: string
  archiveDepth?: string
  apiTier?: string
  actions: { label: string; variant: 'primary' | 'secondary' | 'danger' }[]
  accentColor: string
}

const primaryConnections: Connection[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    subtitle: 'Professional Network',
    icon: '𝗶𝗻',
    status: 'active',
    statusLabel: 'Connected & Active',
    identity: { initials: 'AR', name: 'Alif Rahman', handle: '@alif-rahman · 5.8k followers' },
    scopes: 'Publish posts, Read analytics, Inbound notifications',
    lastSync: '12 minutes ago',
    tokenHealth: 100,
    actions: [{ label: 'Configure Webhooks', variant: 'secondary' }, { label: 'Re-authenticate', variant: 'primary' }],
    accentColor: 'var(--teal)',
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    subtitle: 'Micro-dispatch',
    icon: '𝕏',
    status: 'active',
    statusLabel: 'Connected & Active',
    identity: { initials: '𝕏', name: 'Alif | Editorial Studio', handle: '@alifsrse · 4.2k followers' },
    features: ['Auto-threads', 'Scheduled Quotes', 'Reply Monitor'],
    lastSync: '5 minutes ago',
    apiTier: 'v2 Dedicated Enterprise',
    actions: [{ label: 'Manage API v2 Keys', variant: 'secondary' }, { label: 'Disconnect', variant: 'danger' }],
    accentColor: 'var(--v)',
  },
  {
    id: 'substack',
    name: 'Substack',
    subtitle: 'Longform Essays',
    icon: '✉',
    status: 'active',
    statusLabel: 'Live RSS Sync',
    identity: { initials: 'AS', name: 'Autonomous Studio Dispatches', handle: '1,840 paid & free subscribers' },
    scopes: 'Draft staging, automated essay cross-publishing, subscriber tier mapping',
    feedHealth: 'Optimal (0ms jitter)',
    archiveDepth: '114 Editions',
    actions: [{ label: 'Publication Settings', variant: 'secondary' }, { label: 'Sync Archives', variant: 'primary' }],
    accentColor: 'var(--coral)',
  },
]

const upcomingConnections = [
  { id: 'instagram', name: 'Instagram / Threads', subtitle: 'Meta Graph Protocol', icon: '◻', status: 'beta' as const, statusLabel: 'Beta Access', desc: 'Direct publishing to Instagram Reels and Threads feeds for visual micro-essays with synchronized carousel cards.', action: 'Connect Instagram Business', accentColor: 'var(--coral)' },
  { id: 'youtube', name: 'YouTube & Video', subtitle: 'Studio Data API v3', icon: '▷', status: 'coming-soon' as const, statusLabel: 'Coming Soon', desc: 'Auto-clip long podcast interviews into YouTube Shorts with synchronized subtitles, chapter indexing, and automated cards.', action: 'Join Waitlist', accentColor: 'var(--t3)' },
  { id: 'email', name: 'Email Newsletter', subtitle: 'Resend / Mailchimp Engine', icon: '⊠', status: 'ready' as const, statusLabel: 'Ready to Configure', desc: 'Deploy private weekly executive digests straight to high-value client inbox lists with ultra-clean editorial typography.', action: 'Connect Provider', accentColor: 'var(--teal)' },
]

const statusBadge = (status: string, label: string) => {
  const styles: Record<string, { bg: string; color: string }> = {
    active: { bg: 'color-mix(in srgb, var(--teal) 12%, transparent)', color: 'var(--teal)' },
    beta: { bg: 'color-mix(in srgb, var(--coral) 12%, transparent)', color: 'var(--coral)' },
    'coming-soon': { bg: 'var(--s3)', color: 'var(--t3)' },
    ready: { bg: 'color-mix(in srgb, var(--teal) 12%, transparent)', color: 'var(--teal)' },
  }
  const s = styles[status] || styles['coming-soon']
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', borderRadius: '9999px', background: s.bg, color: s.color, fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em' }}>
      {status === 'active' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
      {label}
    </span>
  )
}

export default function ConnectionsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: -48, left: -64, width: 384, height: 384, background: 'color-mix(in srgb, var(--v) 5%, transparent)', borderRadius: '50%', filter: 'blur(48px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 192, right: 0, width: 320, height: 320, background: 'color-mix(in srgb, var(--teal) 5%, transparent)', borderRadius: '50%', filter: 'blur(48px)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.125rem 0.625rem', borderRadius: '9999px', background: 'color-mix(in srgb, var(--v) 12%, transparent)', color: 'var(--v)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 2s infinite' }} />
              Pipelines & Orchestration
            </span>
            <span style={{ fontSize: '13px', color: 'var(--t3)', fontFamily: 'var(--sans)' }}>v2.4 Sovereign Sync</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--t1)', margin: 0, letterSpacing: '-0.01em' }}>
            Connections & Channels
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--t2)', lineHeight: '1.6' }}>
            Link your social identities, distribution networks, note repositories, and audio feeds into unified editorial memory.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--t2)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
            ↻ Refresh Channel Health
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: 'var(--v)', color: 'var(--btn-primary-text)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
            ⚡ Sync All Channels
          </button>
        </div>
      </div>

      {/* Status banner */}
      <div style={{ borderRadius: '0.75rem', background: 'var(--s2)', padding: '1rem 1.25rem', border: '1px solid var(--b1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, color-mix(in srgb, var(--v) 8%, transparent), transparent, color-mix(in srgb, var(--teal) 8%, transparent))', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)', fontSize: 20, flexShrink: 0 }}>✓</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)' }}>All 4 primary distribution channels synchronized.</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--teal)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Active Pipeline</span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>OAuth tokens valid. Scoped PKCE encryption active. Next scheduled token refresh in 38 days.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px', fontFamily: 'var(--sans)' }}>
            <span style={{ color: 'var(--t3)' }}>Heartbeat: 44ms</span>
            <span style={{ color: 'var(--v)', fontWeight: 600 }}>Zero Degraded</span>
          </div>
        </div>
      </div>

      {/* Primary Distribution */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--t1)' }}>Primary Distribution</h2>
            <span style={{ padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'var(--s3)', fontSize: '11px', color: 'var(--t3)' }}>3 Live Feeds</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t3)' }}>Tier 1 Latency</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {primaryConnections.map(conn => (
            <div key={conn.id} style={{ borderRadius: '0.75rem', background: 'var(--s2)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', border: '1px solid var(--b1)', borderTop: `2px solid ${conn.accentColor}` }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '0.5rem', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: conn.accentColor, fontWeight: 700 }}>{conn.icon}</div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)' }}>{conn.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--t3)' }}>{conn.subtitle}</div>
                    </div>
                  </div>
                  {statusBadge(conn.status, conn.statusLabel)}
                </div>
                {/* Identity */}
                {conn.identity && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: 'var(--s1)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: `color-mix(in srgb, ${conn.accentColor} 16%, var(--s3))`, color: conn.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{conn.identity.initials}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conn.identity.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conn.identity.handle}</div>
                    </div>
                  </div>
                )}
                {/* Scopes or features */}
                {conn.scopes && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--t3)' }}>Granted Scopes</span>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--t2)' }}>{conn.scopes}</p>
                  </div>
                )}
                {conn.features && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--t3)' }}>Features Enabled</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                      {conn.features.map(f => (
                        <span key={f} style={{ padding: '0.125rem 0.5rem', borderRadius: '0.25rem', background: 'var(--s3)', fontSize: '12px', color: 'var(--t2)' }}>{f}</span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Telemetry */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
                  {conn.lastSync && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '11px', color: 'var(--t3)' }}>Last sync</span>
                      <span style={{ fontSize: '13px', fontFamily: 'var(--sans)', fontWeight: 500, color: 'var(--t1)' }}>{conn.lastSync}</span>
                    </div>
                  )}
                  {conn.feedHealth && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '11px', color: 'var(--t3)' }}>Feed Health</span>
                      <span style={{ fontSize: '13px', fontFamily: 'var(--sans)', fontWeight: 500, color: 'var(--teal)' }}>{conn.feedHealth}</span>
                    </div>
                  )}
                  {conn.tokenHealth !== undefined && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '11px', color: 'var(--t3)' }}>Token health</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <div style={{ width: 48, height: 6, background: 'var(--s3)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${conn.tokenHealth}%`, height: '100%', background: 'var(--teal)', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--teal)' }}>{conn.tokenHealth}%</span>
                      </div>
                    </div>
                  )}
                  {conn.apiTier && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '11px', color: 'var(--t3)' }}>API Tier</span>
                      <span style={{ fontSize: '13px', fontFamily: 'var(--sans)', fontWeight: 500, color: 'var(--v)' }}>{conn.apiTier}</span>
                    </div>
                  )}
                  {conn.archiveDepth && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '11px', color: 'var(--t3)' }}>Archive Depth</span>
                      <span style={{ fontSize: '13px', fontFamily: 'var(--sans)', fontWeight: 500, color: 'var(--t1)' }}>{conn.archiveDepth}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--b1)', paddingTop: '0.875rem' }}>
                {conn.actions.map(action => (
                  <button key={action.label} style={{
                    flex: action.variant === 'secondary' ? 1 : 'none',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--b2)',
                    background: 'transparent',
                    color: action.variant === 'danger' ? 'var(--err)' : action.variant === 'primary' ? 'var(--v)' : 'var(--t2)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--sans)',
                    textAlign: 'center' as const,
                  }}>{action.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Integrations */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--t1)' }}>Upcoming & Staged Integrations</h2>
            <span style={{ padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'var(--s3)', fontSize: '11px', color: 'var(--t3)' }}>Expansion Deck</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t3)' }}>Early Pipeline</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {upcomingConnections.map(c => (
            <div key={c.id} style={{ borderRadius: '0.75rem', background: 'var(--s2)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.875rem', border: '1px solid var(--b1)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '0.5rem', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: c.accentColor }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--t3)' }}>{c.subtitle}</div>
                    </div>
                  </div>
                  {statusBadge(c.status, c.statusLabel)}
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--t2)', lineHeight: '1.6' }}>{c.desc}</p>
              </div>
              <button style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--b2)', background: 'transparent', color: c.status === 'coming-soon' ? 'var(--t3)' : 'var(--v)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                {c.action}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Knowledge Base & External Memory */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--t1)' }}>Knowledge Base & External Memory</h2>
            <span style={{ padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'color-mix(in srgb, var(--v) 12%, transparent)', fontSize: '11px', color: 'var(--v)' }}>Sable Intelligence Loop</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t3)' }}>RAG Ingestion Active</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {/* Notion & Obsidian */}
          <div style={{ borderRadius: '0.75rem', background: 'var(--s2)', padding: '1.25rem', display: 'flex', gap: '1.25rem', border: '1px solid var(--b1)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.875rem', flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '0.5rem', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'var(--v)', flexShrink: 0 }}>⊞</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)' }}>Notion & Obsidian Notes Vault</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.125rem' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--teal)', fontWeight: 500 }}>Connected • 184 notes indexed for AI voice persona</span>
                    </div>
                  </div>
                </div>
                <p style={{ margin: '0.375rem 0 0', fontSize: '13px', color: 'var(--t2)', lineHeight: '1.6' }}>
                  Sable synthesises your raw research scratchpad to match your tone when drafting dispatches. Sync is bidirectional and respects un-published tags.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--t2)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  Manage Synced Folders
                </button>
                <span style={{ fontSize: '12px', color: 'var(--t3)', fontFamily: 'var(--sans)' }}>Last index: 32m ago</span>
              </div>
            </div>
            {/* Semantic clusters mini-chart */}
            <div style={{ width: 160, background: 'var(--s1)', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.625rem', flexShrink: 0 }}>
              <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--t3)' }}>Semantic Clusters</span>
              {[
                { label: 'Founder Philosophy', pct: 48, color: 'var(--v)' },
                { label: 'Product Blueprints', pct: 32, color: 'var(--teal)' },
                { label: 'Market Commentary', pct: 20, color: 'var(--coral)' },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--t2)' }}>
                    <span>{c.label}</span><span>{c.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--s3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${c.pct}%`, height: '100%', background: c.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Podcast & Audio */}
          <div style={{ borderRadius: '0.75rem', background: 'var(--s2)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.875rem', border: '1px solid var(--b1)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '0.5rem', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'var(--amber)', flexShrink: 0 }}>♪</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)' }}>Podcast & Audio Feed</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.125rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)' }} />
                    <span style={{ fontSize: '12px', color: 'var(--teal)', fontWeight: 500 }}>11 episodes ingested for voice training</span>
                  </div>
                </div>
              </div>
              <p style={{ margin: '0.375rem 0 0', fontSize: '13px', color: 'var(--t2)', lineHeight: '1.6' }}>
                Podcast transcriptions enrich your voice persona model. Episodes above 20 minutes are auto-chaptered and cross-linked to written dispatches.
              </p>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--t2)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
              Manage RSS Sources
            </button>
          </div>
        </div>
      </section>

      {/* Enterprise OAuth callout */}
      <div style={{ borderRadius: '0.75rem', background: 'linear-gradient(135deg, color-mix(in srgb, var(--v) 8%, var(--s2)), var(--s2))', border: '1px solid color-mix(in srgb, var(--v) 20%, transparent)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)', marginBottom: '0.25rem' }}>Enterprise OAuth & Custom Integrations</div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--t2)' }}>Connect proprietary CRMs, analytics warehouses, or internal knowledge bases via OAuth 2.0 PKCE flow with encrypted scope mapping.</p>
        </div>
        <button style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: '1px solid color-mix(in srgb, var(--v) 40%, transparent)', background: 'color-mix(in srgb, var(--v) 12%, transparent)', color: 'var(--v)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', whiteSpace: 'nowrap' as const }}>
          Configure Enterprise OAuth
        </button>
      </div>
    </div>
  )
}
