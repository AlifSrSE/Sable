'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C', dim: 'rgba(225,48,108,0.12)', border: 'rgba(225,48,108,0.28)' },
  { id: 'linkedin',  label: 'LinkedIn',  color: '#4B99D8', dim: 'rgba(75,153,216,0.12)',  border: 'rgba(75,153,216,0.28)' },
  { id: 'twitter',   label: 'Twitter/X', color: 'var(--t2)', dim: 'var(--s3)', border: 'var(--b2)' },
]

const CHAR_LIMITS: Record<string, number> = {
  instagram: 2200, linkedin: 3000, twitter: 280,
}

const TIPS: Record<string, string[]> = {
  instagram: ['Move hashtags to first comment', 'Aspect ratio: 4:5 to 1.91:1', 'Max 30 hashtags total'],
  linkedin:  ['No hashtags in first line', '3–5 hashtags at end performs best', 'Question CTAs drive 2× comments'],
  twitter:   ['Over 280 chars becomes a thread', 'Max 2 hashtags recommended', 'Images get 2× engagement'],
}

const TIMES = ['Best time: Today 9 AM', 'Today 12 PM', 'Tomorrow 9 AM', 'Tomorrow 6 PM']

export default function SocialPage() {
  const [body,            setBody]           = useState('')
  const [selected,        setSelected]       = useState<Set<string>>(new Set(['linkedin']))
  const [aiPrompt,        setAiPrompt]       = useState('')
  const [generating,      setGenerating]     = useState(false)
  const [scheduledTime,   setScheduledTime]  = useState(TIMES[0])
  const [previewPlatform, setPreview]        = useState('linkedin')
  const [status,          setStatus]         = useState<'idle'|'saved'>('idle')

  const togglePlatform = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id) && next.size > 1) next.delete(id)
      else { next.add(id); setPreview(id) }
      return next
    })
  }

  const limit = Math.min(...[...selected].map(p => CHAR_LIMITS[p] ?? 3000))
  const pct   = Math.min((body.length / limit) * 100, 100)
  const over  = body.length > limit

  const generate = async () => {
    if (!aiPrompt.trim()) return
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1500))
    setBody(`Here's what nobody tells you about ${aiPrompt}:\n\nThe most important lesson isn't about tactics — it's about consistency and genuine value.\n\nThree things that keep proving themselves true:\n\n1. Show your thinking, not just your conclusions\n2. Your audience is attracted by specificity, not breadth\n3. Your unique perspective is the only thing that can't be replicated\n\nWhat's your experience been?\n\n#${aiPrompt.toLowerCase().replace(/\s+/g, '')} #growth #insights`)
    setGenerating(false)
  }

  const S = {
    wrap:     { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' } as React.CSSProperties,
    body:     { flex: 1, display: 'grid', gridTemplateColumns: '1fr 290px', overflow: 'hidden' } as React.CSSProperties,
    write:    { display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--b1)', overflow: 'hidden' } as React.CSSProperties,
    platRow:  { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderBottom: '1px solid var(--b0)', background: 'var(--s1)', flexWrap: 'wrap' } as React.CSSProperties,
    aiBar:    { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', borderBottom: '1px solid var(--b0)', background: 'var(--s2)' } as React.CSSProperties,
    textarea: { flex: 1, width: '100%', padding: '22px 24px', background: 'var(--bg)', border: 'none', outline: 'none', resize: 'none', fontSize: '14.5px', color: 'var(--t1)', fontFamily: 'var(--sans)', fontWeight: 300, lineHeight: 1.8, letterSpacing: '-0.01em' } as React.CSSProperties,
    toolbar:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderTop: '1px solid var(--b0)', background: 'var(--s1)', flexShrink: 0 } as React.CSSProperties,
    preview:  { display: 'flex', flexDirection: 'column', background: 'var(--s1)', overflow: 'hidden' } as React.CSSProperties,
    prevHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--b0)' } as React.CSSProperties,
    prevBody: { flex: 1, overflowY: 'auto', padding: '16px' } as React.CSSProperties,
    mockPost: { background: 'var(--s2)', border: '1px solid var(--b1)', borderRadius: '10px', padding: '14px' } as React.CSSProperties,
    aiGem:    { width: '22px', height: '22px', borderRadius: '6px', background: 'var(--vd)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as React.CSSProperties,
  }
  // Real data queries
  const { data: postsData, isLoading, refetch } = trpc.posts.list.useQuery({
    limit: 20,
  })
  const createPost = trpc.posts.create.useMutation({
    onSuccess: () => {
      setBody('')
      setStatus('saved')
      refetch()
      setTimeout(() => setStatus('idle'), 3000)
    },
  })
  return (
    <div style={S.wrap}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Social</h1>
          <p className="page-subtitle">Create and schedule posts across your platforms</p>
        </div>
        <button className="btn-secondary">View calendar</button>
      </div>

      <div style={S.body}>
        {/* Write pane */}
        <div style={S.write}>
          {/* Platform selector */}
          <div style={S.platRow}>
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t3)', marginRight: '4px' }}>
              Post to
            </span>
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => togglePlatform(p.id)} style={{
                display: 'inline-flex', alignItems: 'center', padding: '0 12px', height: '28px',
                borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                border: '1px solid', transition: 'all 120ms',
                color:           selected.has(p.id) ? p.color  : 'var(--t3)',
                backgroundColor: selected.has(p.id) ? p.dim    : 'transparent',
                borderColor:     selected.has(p.id) ? p.border : 'var(--b1)',
              }}>
                {p.label}
              </button>
            ))}
            <button style={{ padding: '0 10px', height: '28px', borderRadius: '6px', fontSize: '11.5px', color: 'var(--t3)', border: '1px solid var(--b1)', background: 'transparent', cursor: 'pointer' }}>
              + Connect more
            </button>
          </div>

          {/* AI bar */}
          <div style={S.aiBar}>
            <div style={S.aiGem}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--v)" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <input type="text" placeholder="What do you want to post about? Press Enter to generate..."
              value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', color: 'var(--t1)', fontFamily: 'var(--sans)' }}
            />
            <button onClick={generate} disabled={!aiPrompt.trim() || generating} className="btn-primary btn-sm">
              {generating ? 'Writing...' : 'Generate'}
            </button>
          </div>

          {/* Textarea */}
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="What do you want to say? Use the AI bar above or write your own..."
            style={S.textarea}
          />

          {/* Toolbar */}
          <div style={S.toolbar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="btn-ghost" style={{ height: '30px', fontSize: '12.5px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                Add media
              </button>
              {body.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="28" height="28" viewBox="0 0 28 28">
                    <circle cx="14" cy="14" r="10" fill="none" stroke="var(--s4)" strokeWidth="2.5"/>
                    <circle cx="14" cy="14" r="10" fill="none"
                      stroke={over ? 'var(--err)' : pct > 85 ? 'var(--amber)' : 'var(--v)'}
                      strokeWidth="2.5" strokeLinecap="round"
                      strokeDasharray="62.8"
                      strokeDashoffset={62.8 * (1 - pct / 100)}
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                  </svg>
                  <span style={{ fontSize: '11.5px', color: over ? 'var(--err)' : 'var(--t3)', fontVariantNumeric: 'tabular-nums' }}>
                    {over ? `-${body.length - limit}` : `${limit - body.length}`}
                  </span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} style={{
                appearance: 'none', height: '32px', padding: '0 28px 0 10px',
                background: 'var(--s2)', border: '1px solid var(--b2)',
                borderRadius: '7px', color: 'var(--t1)', fontSize: '12.5px',
                fontFamily: 'var(--sans)', cursor: 'pointer', outline: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='7' viewBox='0 0 10 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%235C5878' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
              }}>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <button className="btn-secondary btn-sm"
                disabled={!body.trim() || createPost.isPending}
                onClick={() => {
                  if (!body.trim()) return
                  createPost.mutate({
                    body,
                    platforms: [...selected] as any,
                    aiGenerated: !!aiPrompt,
                    aiPrompt: aiPrompt || undefined,
                  })
                }}
              >
                Save draft
              </button>
              <button className="btn-primary btn-sm"
                disabled={!body.trim() || selected.size === 0 || createPost.isPending}
                onClick={() => {
                  if (!body.trim()) return
                  createPost.mutate({
                    body,
                    platforms: [...selected] as any,
                    aiGenerated: !!aiPrompt,
                    aiPrompt: aiPrompt || undefined,
                  })
                }}
                style={status === 'saved' ? { background: 'var(--ok)', color: '#071a0e' } : {}}
              >
                {createPost.isPending ? 'Saving...' : status === 'saved' ? '✓ Scheduled' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>

        {/* Preview pane */}
        <div style={S.preview}>
          <div style={S.prevHead}>
            <span style={{ fontSize: '10.5px', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--t3)' }}>Preview</span>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[...selected].map(id => {
                const p = PLATFORMS.find(x => x.id === id)!
                return (
                  <button key={id} onClick={() => setPreview(id)} style={{
                    fontSize: '11px', padding: '3px 9px', borderRadius: '5px',
                    border: 'none', cursor: 'pointer', transition: 'all 120ms',
                    background: previewPlatform === id ? 'var(--s3)' : 'transparent',
                    color:      previewPlatform === id ? 'var(--t1)' : 'var(--t3)',
                  }}>{p.label}</button>
                )
              })}
            </div>
          </div>
          <div style={S.prevBody}>
            <div style={S.mockPost}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '11px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--s4)', border: '1px solid var(--b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 500, color: 'var(--t2)', flexShrink: 0 }}>YB</div>
                <div>
                  <p style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--t1)' }}>Your Brand</p>
                  <p style={{ fontSize: '10.5px', color: 'var(--t3)', textTransform: 'capitalize' }}>{previewPlatform}</p>
                </div>
              </div>
              <p style={{ fontSize: '12.5px', color: body ? 'var(--t1)' : 'var(--t4)', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontStyle: body ? 'normal' : 'italic', minHeight: '60px' }}>
                {body || 'Your caption will appear here...'}
              </p>
            </div>
            <div style={{ marginTop: '14px' }}>
              <p style={{ fontSize: '10.5px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '8px' }}>
                {PLATFORMS.find(p => p.id === previewPlatform)?.label} tips
              </p>
              {(TIPS[previewPlatform] ?? []).map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
                  <span style={{ color: 'var(--t4)', fontSize: '11.5px', flexShrink: 0 }}>—</span>
                  <span style={{ fontSize: '11.5px', color: 'var(--t3)', lineHeight: 1.5 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}