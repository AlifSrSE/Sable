'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'

const PLATFORM_META: Record<string, {
  name: string; subtitle: string; icon: string; accentColor: string; scopes: string
}> = {
  linkedin:  { name: 'LinkedIn',           subtitle: 'Professional Network',   icon: '𝗶𝗻', accentColor: 'var(--teal)',  scopes: 'Publish posts, Read analytics, Inbound notifications' },
  twitter:   { name: 'X (Twitter)',         subtitle: 'Micro-dispatch',          icon: '𝕏',  accentColor: 'var(--v)',     scopes: 'Post tweets, Read timeline, Manage threads' },
  instagram: { name: 'Instagram',           subtitle: 'Meta Graph Protocol',     icon: '◻',  accentColor: 'var(--coral)', scopes: 'Publish media, Read insights, Business account' },
  facebook:  { name: 'Facebook',            subtitle: 'Meta Pages API',          icon: 'f',  accentColor: 'var(--v)',     scopes: 'Publish to Page, Read engagement, Manage ads' },
  pinterest: { name: 'Pinterest',           subtitle: 'Visual Discovery API v5', icon: '⊕',  accentColor: 'var(--coral)', scopes: 'Create Pins, Read boards, Analytics access' },
}

const UPCOMING = [
  { id: 'youtube', name: 'YouTube & Video',  subtitle: 'Studio Data API v3',       icon: '▷', status: 'coming-soon' as const, statusLabel: 'Coming Soon',        desc: 'Auto-clip long podcast interviews into YouTube Shorts with synchronized subtitles, chapter indexing, and automated cards.', action: 'Join Waitlist',     accentColor: 'var(--t3)' },
  { id: 'email',   name: 'Email Newsletter', subtitle: 'Resend / Mailchimp Engine', icon: '⊠', status: 'ready'        as const, statusLabel: 'Ready to Configure', desc: 'Deploy private weekly executive digests to high-value client inbox lists with ultra-clean editorial typography.',          action: 'Connect Provider', accentColor: 'var(--teal)' },
]

const statusBadge = (status: string, label: string) => {
  const styles: Record<string, { bg: string; color: string }> = {
    connected:     { bg: 'color-mix(in srgb, var(--teal) 12%, transparent)', color: 'var(--teal)' },
    disconnected:  { bg: 'var(--s3)', color: 'var(--t3)' },
    'coming-soon': { bg: 'var(--s3)', color: 'var(--t3)' },
    ready:         { bg: 'color-mix(in srgb, var(--teal) 12%, transparent)', color: 'var(--teal)' },
  }
  const s = styles[status] ?? styles['coming-soon']
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', borderRadius: '9999px', background: s.bg, color: s.color, fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em' }}>
      {status === 'connected' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
      {label}
    </span>
  )
}

export default function ConnectionsPage() {
  const { data, refetch } = trpc.socialAccounts.list.useQuery()
  const disconnectMut     = trpc.socialAccounts.disconnect.useMutation({ onSuccess: () => refetch() })
  const searchParams      = useSearchParams()

  useEffect(() => {
    const connected = searchParams.get('connected')
    const error     = searchParams.get('error')
    if (connected || error) {
      if (connected) refetch()
      window.history.replaceState({}, '', '/connections')
    }
  }, [searchParams, refetch])

  const accountsByPlatform = Object.fromEntries(
    (data?.accounts ?? []).map(a => [a.platform as string, a])
  )

  const connectedCount = Object.keys(accountsByPlatform).length

  function handleConnect(platform: string) { window.location.href = `/api/auth/${platform}` }
  function handleDisconnect(platform: string) {
    const account = accountsByPlatform[platform]
    if (account) disconnectMut.mutate({ id: account.id })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: -48, left: -64, width: 384, height: 384, background: 'color-mix(in srgb, var(--v) 5%, transparent)', borderRadius: '50%', filter: 'blur(48px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 192, right: 0, width: 320, height: 320, background: 'color-mix(in srgb, var(--teal) 5%, transparent)', borderRadius: '50%', filter: 'blur(48px)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.125rem 0.625rem', borderRadius: '9999px', background: 'color-mix(in srgb, var(--v) 12%, transparent)', color: 'var(--v)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)' }} />
              Pipelines &amp; Orchestration
            </span>
            <span style={{ fontSize: '13px', color: 'var(--t3)', fontFamily: 'var(--sans)' }}>v2.4 Sovereign Sync</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--t1)', margin: 0, letterSpacing: '-0.01em' }}>Connections &amp; Channels</h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--t2)', lineHeight: '1.6' }}>Link your social identities, distribution networks, note repositories, and audio feeds into unified editorial memory.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <button onClick={() => refetch()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--t2)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>↻ Refresh</button>
          <button onClick={() => refetch()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: 'var(--v)', color: 'var(--btn-primary-text)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>⚡ Sync All</button>
        </div>
      </div>

      {/* Status banner */}
      <div style={{ borderRadius: '0.75rem', background: 'var(--s2)', padding: '1rem 1.25rem', border: '1px solid var(--b1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, color-mix(in srgb, var(--v) 8%, transparent), transparent, color-mix(in srgb, var(--teal) 8%, transparent))', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: connectedCount > 0 ? 'var(--teal)' : 'var(--t3)', fontSize: 20, flexShrink: 0 }}>{connectedCount > 0 ? '✓' : '○'}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)' }}>
                  {connectedCount > 0 ? `${connectedCount} channel${connectedCount === 1 ? '' : 's'} connected.` : 'No channels connected yet.'}
                </span>
                {connectedCount > 0 && <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--teal)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Active Pipeline</span>}
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>
                {connectedCount > 0 ? 'OAuth tokens valid. Scoped PKCE encryption active.' : 'Connect a platform below to start publishing.'}
              </p>
            </div>
          </div>
          <span style={{ color: 'var(--t3)', fontSize: '13px', fontFamily: 'var(--sans)' }}>{connectedCount}/{Object.keys(PLATFORM_META).length} platforms</span>
        </div>
      </div>

      {/* Primary Distribution */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--t1)' }}>Primary Distribution</h2>
            <span style={{ padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'var(--s3)', fontSize: '11px', color: 'var(--t3)' }}>{connectedCount} Connected</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t3)' }}>OAuth 2.0 PKCE</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {Object.entries(PLATFORM_META).map(([platformKey, meta]) => {
            const account     = accountsByPlatform[platformKey]
            const isConnected = !!account
            return (
              <div key={platformKey} style={{ borderRadius: '0.75rem', background: 'var(--s2)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', border: '1px solid var(--b1)', borderTop: isConnected ? `2px solid ${meta.accentColor}` : '1px solid var(--b2)', opacity: isConnected ? 1 : 0.8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '0.5rem', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: isConnected ? meta.accentColor : 'var(--t3)', fontWeight: 700 }}>{meta.icon}</div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)' }}>{meta.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--t3)' }}>{meta.subtitle}</div>
                      </div>
                    </div>
                    {statusBadge(isConnected ? 'connected' : 'disconnected', isConnected ? 'Connected' : 'Not Connected')}
                  </div>
                  {isConnected && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: 'var(--s1)' }}>
                      {account.avatarUrl
                        ? <img src={account.avatarUrl} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        : <div style={{ width: 28, height: 28, borderRadius: '50%', background: `color-mix(in srgb, ${meta.accentColor} 16%, var(--s3))`, color: meta.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                            {(account.displayName ?? account.handle ?? platformKey).slice(0, 2).toUpperCase()}
                          </div>
                      }
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.displayName ?? account.handle ?? meta.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {account.handle ? `@${account.handle}` : ''}{account.followerCount ? ` · ${account.followerCount.toLocaleString()} followers` : ''}
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--t3)' }}>{isConnected ? 'Granted Scopes' : 'Required Scopes'}</span>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--t2)' }}>{meta.scopes}</p>
                  </div>
                  {isConnected && account.lastSyncedAt && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '11px', color: 'var(--t3)' }}>Last sync</span>
                        <span style={{ fontSize: '13px', fontFamily: 'var(--sans)', fontWeight: 500, color: 'var(--t1)' }}>{new Date(account.lastSyncedAt).toLocaleString()}</span>
                      </div>
                      {account.tokenExpiresAt && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: '11px', color: 'var(--t3)' }}>Token expires</span>
                          <span style={{ fontSize: '13px', fontFamily: 'var(--sans)', fontWeight: 500, color: new Date(account.tokenExpiresAt) < new Date() ? 'var(--err)' : 'var(--teal)' }}>
                            {new Date(account.tokenExpiresAt) < new Date() ? 'Expired' : new Date(account.tokenExpiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--b1)', paddingTop: '0.875rem' }}>
                  {isConnected ? (
                    <>
                      <button onClick={() => handleConnect(platformKey)} style={{ flex: 1, padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--t2)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Re-authenticate</button>
                      <button onClick={() => handleDisconnect(platformKey)} disabled={disconnectMut.isPending} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--err)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Disconnect</button>
                    </>
                  ) : (
                    <button onClick={() => handleConnect(platformKey)} style={{ flex: 1, padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: 'none', background: 'var(--v)', color: 'var(--btn-primary-text)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Connect {meta.name}</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Upcoming */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--t1)' }}>Upcoming &amp; Staged Integrations</h2>
          <span style={{ padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'var(--s3)', fontSize: '11px', color: 'var(--t3)' }}>Expansion Deck</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {UPCOMING.map(c => (
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
              <button style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--b2)', background: 'transparent', color: c.status === 'coming-soon' ? 'var(--t3)' : 'var(--v)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>{c.action}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Knowledge Base */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--t1)' }}>Knowledge Base &amp; External Memory</h2>
          <span style={{ padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'color-mix(in srgb, var(--v) 12%, transparent)', fontSize: '11px', color: 'var(--v)' }}>Sable Intelligence Loop</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          <div style={{ borderRadius: '0.75rem', background: 'var(--s2)', padding: '1.25rem', display: 'flex', gap: '1.25rem', border: '1px solid var(--b1)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.875rem', flex: 1, minWidth: 0 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '0.5rem', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'var(--v)', flexShrink: 0 }}>⊞</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)' }}>Notion &amp; Obsidian Vault</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)' }} /><span style={{ fontSize: '12px', color: 'var(--teal)', fontWeight: 500 }}>184 notes indexed</span></div>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--t2)', lineHeight: '1.6' }}>Sable synthesises your research scratchpad to match your tone when drafting dispatches.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <button style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--t2)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Manage Synced Folders</button>
                <span style={{ fontSize: '12px', color: 'var(--t3)' }}>32m ago</span>
              </div>
            </div>
            <div style={{ width: 160, background: 'var(--s1)', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.625rem', flexShrink: 0 }}>
              <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--t3)' }}>Semantic Clusters</span>
              {[{ label: 'Founder Philosophy', pct: 48, color: 'var(--v)' }, { label: 'Product Blueprints', pct: 32, color: 'var(--teal)' }, { label: 'Market Commentary', pct: 20, color: 'var(--coral)' }].map(c => (
                <div key={c.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--t2)' }}><span>{c.label}</span><span>{c.pct}%</span></div>
                  <div style={{ height: 4, background: 'var(--s3)', borderRadius: 2, overflow: 'hidden' }}><div style={{ width: `${c.pct}%`, height: '100%', background: c.color, borderRadius: 2 }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderRadius: '0.75rem', background: 'var(--s2)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.875rem', border: '1px solid var(--b1)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '0.5rem', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'var(--coral)', flexShrink: 0 }}>♪</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)' }}>Podcast &amp; Audio Feed</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)' }} /><span style={{ fontSize: '12px', color: 'var(--teal)', fontWeight: 500 }}>11 episodes ingested</span></div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--t2)', lineHeight: '1.6' }}>Podcast transcriptions enrich your voice persona model. Episodes above 20 minutes are auto-chaptered.</p>
            </div>
            <button style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--t2)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', alignSelf: 'flex-start' }}>Manage RSS Sources</button>
          </div>
        </div>
      </section>

      {/* Enterprise callout */}
      <div style={{ borderRadius: '0.75rem', background: 'linear-gradient(135deg, color-mix(in srgb, var(--v) 8%, var(--s2)), var(--s2))', border: '1px solid color-mix(in srgb, var(--v) 20%, transparent)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)', marginBottom: '0.25rem' }}>Enterprise OAuth &amp; Custom Integrations</div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--t2)' }}>Connect proprietary CRMs, analytics warehouses, or internal knowledge bases via OAuth 2.0 PKCE flow.</p>
        </div>
        <button style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: '1px solid color-mix(in srgb, var(--v) 40%, transparent)', background: 'color-mix(in srgb, var(--v) 12%, transparent)', color: 'var(--v)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', whiteSpace: 'nowrap' as const }}>Configure Enterprise OAuth</button>
      </div>
    </div>
  )
}
