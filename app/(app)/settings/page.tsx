'use client'

import { useState } from 'react'

type Tab = 'profile' | 'ai' | 'appearance' | 'notifications' | 'security' | 'danger'

const tabs: { id: Tab; label: string; badge?: string }[] = [
  { id: 'profile', label: 'Profile & Identity' },
  { id: 'ai', label: 'AI Voice Calibration', badge: '68%' },
  { id: 'appearance', label: 'Appearance & Theme' },
  { id: 'notifications', label: 'Notification Matrix' },
  { id: 'security', label: 'Security & Sessions' },
  { id: 'danger', label: 'Danger Zone' },
]

function Slider({ label, desc, value, min = 0, max = 100, leftLabel, midLabel, rightLabel, color = 'var(--v)', badgeLabel, badgeColor = 'var(--v)' }: { label: string; desc: string; value: number; min?: number; max?: number; leftLabel: string; midLabel: string; rightLabel: string; color?: string; badgeLabel: string; badgeColor?: string }) {
  const [val, setVal] = useState(value)
  return (
    <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--s2)', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)' }}>{label}</div>
          <div style={{ fontSize: '12px', color: 'var(--t3)' }}>{desc}</div>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: '0.375rem', background: `color-mix(in srgb, ${badgeColor} 12%, transparent)`, color: badgeColor }}>{badgeLabel}</span>
      </div>
      <input type="range" min={min} max={max} value={val} onChange={e => setVal(Number(e.target.value))}
        style={{ width: '100%', height: 6, borderRadius: 3, appearance: 'none', background: `linear-gradient(to right, ${color} ${val}%, var(--s3) ${val}%)`, cursor: 'pointer', outline: 'none' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--t3)' }}>
        <span>{leftLabel}</span><span>{midLabel}</span><span style={{ color, fontWeight: 600 }}>{rightLabel}</span>
      </div>
    </div>
  )
}

function Toggle({ label, desc, checked: defaultChecked = true }: { label: string; desc: string; checked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--t1)' }}>{label}</div>
        <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: 2 }}>{desc}</div>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: checked ? 'var(--v)' : 'var(--s3)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
        aria-checked={checked}
      >
        <span style={{ position: 'absolute', top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--b1)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--v)' }}>System Preferences</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--t3)' }} />
            <span style={{ fontSize: '12px', color: 'var(--t3)', fontFamily: 'var(--sans)' }}>v2.4.0-rev7</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--t1)', margin: 0, letterSpacing: '-0.01em' }}>Settings</h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '14px', color: 'var(--t2)' }}>Manage your profile, AI voice calibration, notification thresholds, and account security.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button style={{ height: 36, padding: '0 1rem', borderRadius: '0.5rem', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--t2)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Discard Changes</button>
          <button style={{ height: 36, padding: '0 1.25rem', borderRadius: '0.5rem', border: 'none', background: 'var(--v)', color: 'var(--btn-primary-text)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            ✓ Save Changes
          </button>
        </div>
      </div>

      {/* Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left nav rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'sticky', top: '5.5rem' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', background: 'var(--s2)', borderRadius: '0.75rem', padding: '0.5rem', border: '1px solid var(--b1)' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                  background: activeTab === tab.id ? 'var(--s3)' : 'transparent',
                  color: tab.id === 'danger' ? 'var(--err)' : activeTab === tab.id ? 'var(--v)' : 'var(--t2)',
                  fontSize: '13px', fontWeight: activeTab === tab.id ? 600 : 400,
                  fontFamily: 'var(--sans)', textAlign: 'left' as const,
                  transition: 'all 0.15s',
                }}
              >
                <span>{tab.label}</span>
                {tab.badge && <span style={{ fontSize: '11px', fontWeight: 600, padding: '0.125rem 0.375rem', borderRadius: '9999px', background: 'color-mix(in srgb, var(--teal) 12%, transparent)', color: 'var(--teal)' }}>{tab.badge}</span>}
                {activeTab === tab.id && tab.id !== 'danger' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--v)', flexShrink: 0 }} />}
              </button>
            ))}
          </nav>
          <div style={{ background: 'var(--s2)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid var(--b1)' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '0.5rem' }}>Autonomous Hub</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)', lineHeight: '1.6' }}>Personal identity matrices calibrate all autonomous ghostwriting models, tone filters, and CRM dispatch signatures.</p>
          </div>
        </div>

        {/* Content panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Profile & Identity */}
          {activeTab === 'profile' && (
            <section style={{ background: 'var(--s2)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid var(--b1)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--b1)' }}>
                <div>
                  <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--t1)' }}>Profile & Editorial Persona</h2>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '12px', color: 'var(--t2)' }}>Canonical author details synchronized across dispatches and syndicated networks.</p>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: '9999px', background: 'color-mix(in srgb, var(--teal) 12%, transparent)', color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)' }} />
                  Sync Active
                </span>
              </div>
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', borderRadius: '0.75rem', background: 'var(--s1)' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'color-mix(in srgb, var(--v) 20%, var(--s3))', color: 'var(--v)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, flexShrink: 0, border: '3px solid var(--s3)', position: 'relative' }}>
                  AR
                  <span style={{ position: 'absolute', bottom: 3, right: 3, width: 14, height: 14, borderRadius: '50%', background: 'var(--teal)', border: '2px solid var(--s2)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--t2)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Change Photo</button>
                    <button style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: 'none', background: 'transparent', color: 'var(--t3)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--sans)' }}>Remove</button>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--t3)' }}>🔒 Managed via Clerk OAuth · 400×400px recommended</span>
                </div>
              </div>
              {/* Form grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'First Name', value: 'Alif', type: 'text' },
                  { label: 'Last Name', value: 'Rahman', type: 'text' },
                  { label: 'Public Handle', value: 'alifsrse', type: 'text', prefix: '@' },
                  { label: 'Primary Email', value: 'alif.rahman.c@gmail.com', type: 'email', readonly: true, badge: 'Verified' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--t3)' }}>{f.label}</label>
                      {f.badge && <span style={{ fontSize: '11px', fontWeight: 600, padding: '0.125rem 0.375rem', borderRadius: '9999px', background: 'color-mix(in srgb, var(--teal) 12%, transparent)', color: 'var(--teal)' }}>✓ {f.badge}</span>}
                    </div>
                    <div style={{ position: 'relative' }}>
                      {f.prefix && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', fontSize: '13px' }}>{f.prefix}</span>}
                      <input
                        type={f.type} defaultValue={f.value} readOnly={f.readonly}
                        style={{ width: '100%', height: 40, padding: f.prefix ? '0 0.875rem 0 1.75rem' : '0 0.875rem', borderRadius: '0.5rem', border: '1px solid var(--b2)', background: f.readonly ? 'var(--s1)' : 'var(--s1)', color: f.readonly ? 'var(--t3)' : 'var(--t1)', fontSize: '14px', fontFamily: 'var(--sans)', outline: 'none', boxSizing: 'border-box' as const, cursor: f.readonly ? 'not-allowed' : 'text' }}
                      />
                    </div>
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--t3)' }}>Editorial Bio & Stance</label>
                    <span style={{ fontSize: '11px', color: 'var(--t3)' }}>98 / 180 chars</span>
                  </div>
                  <textarea defaultValue="Founder @ Sable. Designing autonomous creative engines and editorial intelligence suites for solitary operators." rows={3}
                    style={{ width: '100%', padding: '0.75rem 0.875rem', borderRadius: '0.5rem', border: '1px solid var(--b2)', background: 'var(--s1)', color: 'var(--t1)', fontSize: '14px', fontFamily: 'var(--sans)', resize: 'none', outline: 'none', lineHeight: '1.6', boxSizing: 'border-box' as const }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--t3)' }}>Editorial Scheduling Time Zone</label>
                  <select defaultValue="pacific" style={{ width: '100%', height: 40, padding: '0 0.875rem', borderRadius: '0.5rem', border: '1px solid var(--b2)', background: 'var(--s1)', color: 'var(--t1)', fontSize: '14px', fontFamily: 'var(--sans)', outline: 'none', cursor: 'pointer' }}>
                    <option value="pacific">Pacific Time (US & Canada) — GMT-7</option>
                    <option value="eastern">Eastern Time (US & Canada) — GMT-4</option>
                    <option value="gmt">Greenwich Mean Time (London) — GMT+0</option>
                    <option value="cet">Central European Time (Berlin) — GMT+1</option>
                    <option value="sgt">Singapore Standard Time — GMT+8</option>
                    <option value="jst">Japan Standard Time (Tokyo) — GMT+9</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* AI Voice Calibration */}
          {activeTab === 'ai' && (
            <section style={{ background: 'var(--s2)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid var(--b1)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--b1)', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--t1)' }}>AI Voice Persona Engine</h2>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '0.125rem 0.5rem', borderRadius: '0.25rem', background: 'color-mix(in srgb, var(--v) 12%, transparent)', color: 'var(--v)' }}>Core Engine</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Continuous reinforcement tuning for ghostwritten essays, micro-dispatches, and voice replies.</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--t2)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  ⊕ Reset Weights
                </button>
              </div>
              {/* Calibration status */}
              <div style={{ padding: '1.25rem', borderRadius: '0.75rem', background: 'var(--s1)', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{ fontSize: 20 }}>📻</span>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', fontFamily: 'var(--sans)' }}>Voice Model Calibration: 68% High Fidelity</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--v)' }}>Tier 2 Active</span>
                </div>
                {/* Gradient progress bar */}
                <div style={{ height: 10, borderRadius: 5, background: 'var(--s3)', overflow: 'hidden' }}>
                  <div style={{ width: '68%', height: '100%', background: 'linear-gradient(to right, var(--v), color-mix(in srgb, var(--v) 60%, var(--teal)), var(--teal))', borderRadius: 5 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.25rem' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Feed 8 more dispatches to unlock 95% automated ghostwriting.</p>
                  <span style={{ fontSize: '11px', color: 'var(--t3)' }}>Target: 22 Ingested Items</span>
                </div>
              </div>
              {/* Sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Slider label="Tone Density" desc="Vocabulary compression and syntactic layering" value={78} leftLabel="Conversational · 0%" midLabel="Balanced · 50%" rightLabel="Academic Rigor · 100%" badgeLabel="High Density (Academic)" color="var(--v)" badgeColor="var(--v)" />
                <Slider label="Voice Stance" desc="Assertiveness, hedging, and contrarian framing" value={84} leftLabel="Diplomatic / Nuanced" midLabel="Pragmatic Observer" rightLabel="Radically Direct" badgeLabel="Opinionated & Direct" color="var(--teal)" badgeColor="var(--teal)" />
                <Slider label="Metaphor Level" desc="Use of literary analogies vs operational literalism" value={38} leftLabel="Literal · 0%" midLabel="Subtle · 50%" rightLabel="High Metaphor · 100%" badgeLabel="Subtle & Tactical" color="var(--coral)" badgeColor="var(--coral)" />
              </div>
              {/* Training data signal */}
              <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--s1)', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)' }}>Training Signal Sources</span>
                  <button style={{ fontSize: '12px', color: 'var(--v)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontWeight: 600 }}>Manage Sources →</button>
                </div>
                {[
                  { label: 'LinkedIn Posts', count: 47, pct: 58, color: 'var(--teal)' },
                  { label: 'Substack Essays', count: 12, pct: 30, color: 'var(--v)' },
                  { label: 'X Threads', count: 89, pct: 12, color: 'var(--coral)' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '12px', color: 'var(--t2)', width: 120, flexShrink: 0 }}>{s.label}</span>
                    <div style={{ flex: 1, height: 4, background: 'var(--s3)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--t3)', width: 48, textAlign: 'right' as const }}>{s.count} items</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <section style={{ background: 'var(--s2)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid var(--b1)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--b1)' }}>
                <h2 style={{ margin: '0 0 0.25rem', fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--t1)' }}>Appearance & Theme</h2>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Personalize your editorial environment.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--t3)' }}>Color Mode</div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {[
                    { id: 'dark', label: 'Dark', sub: 'Kinetic Editorial', active: true },
                    { id: 'light', label: 'Light', sub: 'Sable Editorial', active: false },
                    { id: 'system', label: 'System', sub: 'Auto-detects', active: false },
                  ].map(m => (
                    <div key={m.id} style={{ flex: 1, padding: '0.875rem', borderRadius: '0.5rem', border: `1px solid ${m.active ? 'var(--v)' : 'var(--b2)'}`, background: m.active ? 'color-mix(in srgb, var(--v) 8%, var(--s1))' : 'var(--s1)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: m.active ? 'var(--v)' : 'var(--t1)' }}>{m.label}</span>
                      <span style={{ fontSize: '11px', color: 'var(--t3)' }}>{m.sub}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <Toggle label="Reduce Motion" desc="Minimize animations and transitions" checked={false} />
                  <Toggle label="Compact View" desc="Tighter spacing for information-dense layouts" checked={false} />
                  <Toggle label="High Contrast" desc="Increase contrast for improved readability" checked={false} />
                </div>
              </div>
            </section>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <section style={{ background: 'var(--s2)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid var(--b1)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--b1)' }}>
                <h2 style={{ margin: '0 0 0.25rem', fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--t1)' }}>Notification Matrix</h2>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Control where and when Sable surfaces intelligence signals.</p>
              </div>
              {[
                { group: 'Editorial Dispatch', items: [
                  { label: 'Post published successfully', desc: 'When a scheduled post goes live across any platform', checked: true },
                  { label: 'Post needs review', desc: 'When AI flags a draft for quality review', checked: true },
                  { label: 'Missed scheduling window', desc: 'When a post misses its optimal publishing window', checked: false },
                ]},
                { group: 'AI Intelligence', items: [
                  { label: 'Trending topic detected', desc: 'When a topic in your niche is gaining momentum', checked: true },
                  { label: 'Voice model updated', desc: 'When calibration reaches a new tier', checked: true },
                  { label: 'Resonance spike', desc: 'When a post significantly outperforms baseline', checked: true },
                ]},
                { group: 'CRM & Network', items: [
                  { label: 'Contact needs attention', desc: 'When a key contact hasn\'t been touched in 30+ days', checked: true },
                  { label: 'New inbound connection', desc: 'When someone from your target network follows you', checked: false },
                ]},
              ].map(group => (
                <div key={group.group} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--t3)' }}>{group.group}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--s1)', border: '1px solid var(--b1)' }}>
                    {group.items.map((item, i) => (
                      <div key={item.label}>
                        {i > 0 && <div style={{ borderTop: '1px solid var(--b1)', marginBottom: '0.75rem' }} />}
                        <Toggle label={item.label} desc={item.desc} checked={item.checked} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <section style={{ background: 'var(--s2)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid var(--b1)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--b1)' }}>
                <h2 style={{ margin: '0 0 0.25rem', fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--t1)' }}>Security & Sessions</h2>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Manage authentication, active sessions, and security posture.</p>
              </div>
              {/* Auth via Clerk */}
              <div style={{ padding: '1rem', borderRadius: '0.5rem', background: 'var(--s1)', border: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--t1)' }}>Authentication Provider</div>
                  <div style={{ fontSize: '12px', color: 'var(--t2)', marginTop: 2 }}>Managed by Clerk OAuth 2.0 — PKCE + TOTP available</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: '9999px', background: 'color-mix(in srgb, var(--teal) 12%, transparent)', color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  ✓ Secured
                </span>
              </div>
              {/* Active sessions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--t3)' }}>Active Sessions</div>
                {[
                  { device: 'MacBook Pro 16"', location: 'San Francisco, CA', time: 'Current session', isThis: true },
                  { device: 'iPhone 16 Pro', location: 'San Francisco, CA', time: '2 hours ago', isThis: false },
                  { device: 'Chrome / Windows', location: 'New York, NY', time: '3 days ago', isThis: false },
                ].map(s => (
                  <div key={s.device} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--s1)', border: `1px solid ${s.isThis ? 'color-mix(in srgb, var(--teal) 30%, transparent)' : 'var(--b1)'}` }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--t1)' }}>{s.device}</span>
                        {s.isThis && <span style={{ fontSize: '10px', fontWeight: 600, padding: '0.125rem 0.375rem', borderRadius: '9999px', background: 'color-mix(in srgb, var(--teal) 12%, transparent)', color: 'var(--teal)' }}>This device</span>}
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--t3)' }}>{s.location} · {s.time}</span>
                    </div>
                    {!s.isThis && <button style={{ fontSize: '12px', color: 'var(--err)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontWeight: 600 }}>Revoke</button>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Danger Zone */}
          {activeTab === 'danger' && (
            <section style={{ background: 'var(--s2)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid color-mix(in srgb, var(--err) 30%, transparent)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid color-mix(in srgb, var(--err) 20%, transparent)' }}>
                <h2 style={{ margin: '0 0 0.25rem', fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--err)' }}>Danger Zone</h2>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Irreversible actions that affect your account and data.</p>
              </div>
              {[
                { title: 'Export All Data', desc: 'Download a full archive of your posts, contacts, analytics, and AI training data.', action: 'Export Archive', variant: 'secondary' },
                { title: 'Reset AI Voice Model', desc: 'Clears all calibration weights and training data. Your voice persona will revert to baseline.', action: 'Reset Voice Model', variant: 'warning' },
                { title: 'Pause Account', desc: 'Suspend all scheduled posts, automations, and OAuth token refreshes. Reactivate any time.', action: 'Pause Account', variant: 'warning' },
                { title: 'Delete Account', desc: 'Permanently delete your Sable account and all associated data. This action cannot be undone.', action: 'Delete Account', variant: 'danger' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '0.5rem', background: item.variant === 'danger' ? 'color-mix(in srgb, var(--err) 5%, var(--s1))' : 'var(--s1)', border: `1px solid ${item.variant === 'danger' ? 'color-mix(in srgb, var(--err) 20%, transparent)' : 'var(--b1)'}`, flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ maxWidth: 480 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: item.variant === 'danger' ? 'var(--err)' : 'var(--t1)' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--t2)', marginTop: 2, lineHeight: '1.5' }}>{item.desc}</div>
                  </div>
                  <button style={{
                    padding: '0.375rem 0.875rem', borderRadius: '0.375rem', border: `1px solid ${item.variant === 'danger' ? 'color-mix(in srgb, var(--err) 50%, transparent)' : item.variant === 'warning' ? 'color-mix(in srgb, var(--coral) 30%, transparent)' : 'var(--b2)'}`,
                    background: 'transparent',
                    color: item.variant === 'danger' ? 'var(--err)' : item.variant === 'warning' ? 'var(--coral)' : 'var(--t2)',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', whiteSpace: 'nowrap' as const,
                  }}>{item.action}</button>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
