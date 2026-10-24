'use client'

import { useState } from 'react'

interface Contact {
  id: string
  name: string
  email: string
  company: string
  role: string
  tags: string[]
  lastContactedAt: string
  daysSince: number
  urgency: 'urgent' | 'soon' | 'ok'
  initials: string
  avatarColor: string
}

const CONTACTS: Contact[] = [
  { id: '1', name: 'Sarah Chen',      email: 'sarah@vercel.com',   company: 'Vercel',          role: 'Head of Growth',     tags: ['prospect', 'saas'],    lastContactedAt: '18 days ago', daysSince: 18, urgency: 'urgent', initials: 'SC', avatarColor: '#7C6AF7' },
  { id: '2', name: 'James Kim',       email: 'james@acme.com',     company: 'Acme Corp',       role: 'Founder',            tags: ['client', 'active'],    lastContactedAt: '5 days ago',  daysSince: 5,  urgency: 'ok',     initials: 'JK', avatarColor: '#2DD4BF' },
  { id: '3', name: 'Maya Rodriguez',  email: 'maya@design.co',     company: 'Design Co',       role: 'Creative Director',  tags: ['prospect'],            lastContactedAt: '42 days ago', daysSince: 42, urgency: 'urgent', initials: 'MR', avatarColor: '#F4845F' },
  { id: '4', name: 'Alex Patel',      email: 'alex@startup.io',    company: 'Startup IO',      role: 'CTO',                tags: ['lead', 'tech'],        lastContactedAt: '7 days ago',  daysSince: 7,  urgency: 'soon',   initials: 'AP', avatarColor: '#FCD34D' },
  { id: '5', name: 'Lisa Thompson',   email: 'lisa@agency.com',    company: 'Thompson Agency', role: 'Director',           tags: ['client', 'agency'],    lastContactedAt: '2 days ago',  daysSince: 2,  urgency: 'ok',     initials: 'LT', avatarColor: '#4ADE80' },
]

const URGENCY = {
  urgent: { label: 'Urgent',    bg: 'var(--err-dim)',   color: 'var(--err)'  },
  soon:   { label: 'Follow up', bg: 'var(--amber-dim)', color: 'var(--amber)' },
  ok:     { label: 'On track',  bg: 'var(--ok-dim)',    color: 'var(--ok)'   },
}

const HISTORY = [
  { icon: '✉', type: 'Email sent',     note: 'Sent proposal follow-up',      time: '18 days ago' },
  { icon: '📝', type: 'Note added',    note: 'Interested in the Growth plan', time: '3 weeks ago' },
  { icon: '📞', type: 'Call logged',   note: 'Discovery call — 30 min',       time: '1 month ago' },
]

export default function CRMPage() {
  const [search,     setSearch]     = useState('')
  const [selected,   setSelected]   = useState<string | null>('1')
  const [showAdd,    setShowAdd]     = useState(false)
  const [newName,    setNewName]     = useState('')
  const [newEmail,   setNewEmail]   = useState('')
  const [newCompany, setNewCompany] = useState('')

  const filtered = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const contact = CONTACTS.find(c => c.id === selected)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">CRM</h1>
          <p className="page-subtitle">{CONTACTS.length} contacts · 2 need attention today</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add contact
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', overflow: 'hidden' }}>

        {/* Left — contact list */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--b1)', overflow: 'hidden' }}>

          {/* Search */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--b0)', background: 'var(--s1)' }}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', pointerEvents: 'none' }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="sable-input"
                style={{ paddingLeft: '34px' }}
              />
            </div>
          </div>

          {/* Re-engage strip */}
          <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--b0)', background: 'var(--s2)' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '8px' }}>
              Needs attention
            </p>
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
              {CONTACTS.filter(c => c.urgency === 'urgent').map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '0 10px', height: '30px',
                    background: 'var(--s1)', border: '1px solid var(--b2)',
                    borderRadius: '7px', cursor: 'pointer',
                    transition: 'all 120ms',
                  }}
                >
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: c.avatarColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 600, color: c.avatarColor }}>
                    {c.initials}
                  </div>
                  <span style={{ fontSize: '12.5px', color: 'var(--t1)' }}>{c.name.split(' ')[0]}</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--err)', fontWeight: 500 }}>{c.daysSince}d</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: 'var(--t2)', marginBottom: '4px' }}>No contacts found</p>
                <p style={{ fontSize: '12px', color: 'var(--t3)' }}>Try a different search term</p>
              </div>
            ) : filtered.map(c => {
              const urg = URGENCY[c.urgency]
              const isSelected = selected === c.id
              return (
                <div
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 20px', borderBottom: '1px solid var(--b0)',
                    cursor: 'pointer', transition: 'background 100ms',
                    background: isSelected ? 'var(--s2)' : 'transparent',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--s1)' }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  {isSelected && (
                    <div style={{ position: 'absolute', left: 0, top: '10px', bottom: '10px', width: '2px', background: 'var(--v)', borderRadius: '0 2px 2px 0' }} />
                  )}
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: c.avatarColor + '20', border: `1px solid ${c.avatarColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: c.avatarColor, flexShrink: 0 }}>
                    {c.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                    <p style={{ fontSize: '11.5px', color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.role} · {c.company}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', background: urg.bg, color: urg.color }}>{urg.label}</span>
                    <span style={{ fontSize: '10.5px', color: 'var(--t3)' }}>{c.lastContactedAt}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right — contact detail */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--s1)', overflow: 'hidden' }}>
          {contact ? (
            <>
              {/* Contact header */}
              <div style={{ padding: '20px', borderBottom: '1px solid var(--b0)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: contact.avatarColor + '20', border: `1px solid ${contact.avatarColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 600, color: contact.avatarColor, flexShrink: 0 }}>
                    {contact.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--t1)' }}>{contact.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--t3)' }}>{contact.role} · {contact.company}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.5">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
                    </svg>
                    <span style={{ fontSize: '12.5px', color: 'var(--t2)' }}>{contact.email}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {contact.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '4px', background: 'var(--s3)', color: 'var(--t2)', border: '1px solid var(--b1)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI suggestion */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--b0)' }}>
                <div style={{ background: 'var(--s2)', border: '1px solid var(--b1)', borderRadius: '10px', padding: '14px', borderLeft: '2px solid var(--v)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--v)" strokeWidth="1.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--v)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI suggestion</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--t2)', lineHeight: 1.65, marginBottom: '12px' }}>
                    {contact.daysSince > 14
                      ? `You haven't contacted ${contact.name.split(' ')[0]} in ${contact.daysSince} days. A personalised follow-up now would be well timed.`
                      : `${contact.name.split(' ')[0]} is recently active. A quick check-in keeps the relationship warm.`
                    }
                  </p>
                  <button className="btn-primary btn-sm">Draft follow-up</button>
                </div>
              </div>

              {/* Interaction timeline */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
                <p style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '14px' }}>
                  Interaction history
                </p>
                {HISTORY.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', paddingBottom: '16px', position: 'relative' }}>
                    {i < HISTORY.length - 1 && (
                      <div style={{ position: 'absolute', left: '15px', top: '30px', bottom: 0, width: '1px', background: 'var(--b1)' }} />
                    )}
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--s3)', border: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0, zIndex: 1 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, paddingTop: '4px' }}>
                      <p style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--t1)', marginBottom: '2px' }}>{item.type}</p>
                      <p style={{ fontSize: '12px', color: 'var(--t2)', marginBottom: '2px' }}>{item.note}</p>
                      <p style={{ fontSize: '11px', color: 'var(--t3)' }}>{item.time}</p>
                    </div>
                  </div>
                ))}
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
                  + Log interaction
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <p style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--t1)', marginBottom: '6px' }}>Select a contact</p>
              <p style={{ fontSize: '12.5px', color: 'var(--t3)', lineHeight: 1.6, maxWidth: '200px' }}>Click any contact to see their details and AI suggestions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add contact modal */}
      {showAdd && (
        <div
          onClick={e => e.target === e.currentTarget && setShowAdd(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
        >
          <div style={{ background: 'var(--s1)', border: '1px solid var(--b2)', borderRadius: '16px', padding: '28px', width: '400px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '20px' }}>
              Add contact
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {[
                { label: 'Full name', value: newName,    set: setNewName,    ph: 'Sarah Chen' },
                { label: 'Email',    value: newEmail,   set: setNewEmail,   ph: 'sarah@company.com' },
                { label: 'Company',  value: newCompany, set: setNewCompany, ph: 'Acme Corp' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--t2)', marginBottom: '6px' }}>{f.label}</label>
                  <input type="text" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph} className="sable-input" />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => setShowAdd(false)} disabled={!newName.trim()}>Add contact</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}