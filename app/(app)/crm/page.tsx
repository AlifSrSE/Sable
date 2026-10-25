'use client'

import { useState, useEffect, useRef } from 'react'
import { trpc } from '@/lib/trpc'

function getUrgency(lastContactedAt: Date | null): 'urgent' | 'soon' | 'ok' {
  if (!lastContactedAt) return 'urgent'
  const days = Math.floor((Date.now() - new Date(lastContactedAt).getTime()) / 86400000)
  if (days > 14) return 'urgent'
  if (days > 7)  return 'soon'
  return 'ok'
}

function getDaysSince(lastContactedAt: Date | null): string {
  if (!lastContactedAt) return 'Never contacted'
  const days = Math.floor((Date.now() - new Date(lastContactedAt).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const COLORS = ['#7C6AF7','#2DD4BF','#F4845F','#FCD34D','#4ADE80','#60A5FA','#F472B6']
function getColor(id: string) {
  return COLORS[id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length]
}

const URG = {
  urgent: { label:'Urgent',    bg:'var(--err-dim)',   color:'var(--err)'   },
  soon:   { label:'Follow up', bg:'var(--amber-dim)', color:'var(--amber)' },
  ok:     { label:'On track',  bg:'var(--ok-dim)',    color:'var(--ok)'    },
}

function AddModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [err, setErr] = useState('')

  const create = trpc.contacts.create.useMutation({
    onSuccess: () => { onSuccess(); onClose() },
    onError: (e) => setErr(e.message),
  })

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width:'420px' }}>
        <h2 style={{ fontFamily:'var(--serif)', fontSize:'1.4rem', color:'var(--t1)', letterSpacing:'-0.03em', marginBottom:'20px' }}>Add contact</h2>
        {err && <div style={{ padding:'10px 12px', background:'var(--err-dim)', border:'1px solid var(--err)', borderRadius:'7px', marginBottom:'14px', fontSize:'13px', color:'var(--err)' }}>{err}</div>}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'24px' }}>
          {[
            { label:'Full name *', value:name,    set:setName,    ph:'Sarah Chen' },
            { label:'Email',       value:email,   set:setEmail,   ph:'sarah@company.com' },
            { label:'Company',     value:company, set:setCompany, ph:'Acme Corp' },
            { label:'Role',        value:role,    set:setRole,    ph:'Head of Growth' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display:'block', fontSize:'12px', fontWeight:500, color:'var(--t2)', marginBottom:'6px' }}>{f.label}</label>
              <input type="text" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                className="sable-input" onKeyDown={e => e.key === 'Enter' && !create.isPending && name.trim() && create.mutate({ name, email: email||undefined, company: company||undefined, role: role||undefined })} />
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!name.trim() || create.isPending}
            onClick={() => create.mutate({ name, email: email||undefined, company: company||undefined, role: role||undefined })}>
            {create.isPending ? 'Adding...' : 'Add contact'}
          </button>
        </div>
      </div>
    </div>
  )
}

function EditModal({ contact, onClose, onSuccess }: { contact: { id:string; name:string; email:string|null; company:string|null; role:string|null }; onClose:()=>void; onSuccess:()=>void }) {
  const [name,    setName]    = useState(contact.name)
  const [email,   setEmail]   = useState(contact.email ?? '')
  const [company, setCompany] = useState(contact.company ?? '')
  const [role,    setRole]    = useState(contact.role ?? '')
  const [err,     setErr]     = useState('')

  const update = trpc.contacts.update.useMutation({
    onSuccess: () => { onSuccess(); onClose() },
    onError: (e) => setErr(e.message),
  })

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width:'420px' }}>
        <h2 style={{ fontFamily:'var(--serif)', fontSize:'1.4rem', color:'var(--t1)', letterSpacing:'-0.03em', marginBottom:'20px' }}>Edit contact</h2>
        {err && <div style={{ padding:'10px 12px', background:'var(--err-dim)', border:'1px solid var(--err)', borderRadius:'7px', marginBottom:'14px', fontSize:'13px', color:'var(--err)' }}>{err}</div>}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'24px' }}>
          {[
            { label:'Full name *', value:name,    set:setName,    ph:'Sarah Chen' },
            { label:'Email',       value:email,   set:setEmail,   ph:'sarah@company.com' },
            { label:'Company',     value:company, set:setCompany, ph:'Acme Corp' },
            { label:'Role',        value:role,    set:setRole,    ph:'Head of Growth' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display:'block', fontSize:'12px', fontWeight:500, color:'var(--t2)', marginBottom:'6px' }}>{f.label}</label>
              <input type="text" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph} className="sable-input" />
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!name.trim() || update.isPending}
            onClick={() => update.mutate({ id: contact.id, name, email: email||undefined, company: company||undefined, role: role||undefined })}>
            {update.isPending ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}


function LogModal({ contactId, contactName, onClose, onSuccess }: { contactId:string; contactName:string; onClose:()=>void; onSuccess:()=>void }) {
  const [type, setType] = useState<'email'|'call'|'meeting'|'note'>('note')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const log = trpc.contacts.logInteraction.useMutation({
    onSuccess: () => { onSuccess(); onClose() },
  })

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width:'420px' }}>
        <h2 style={{ fontFamily:'var(--serif)', fontSize:'1.4rem', color:'var(--t1)', letterSpacing:'-0.03em', marginBottom:'4px' }}>Log interaction</h2>
        <p style={{ fontSize:'12.5px', color:'var(--t3)', marginBottom:'20px' }}>with {contactName}</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'24px' }}>
          <div>
            <label style={{ display:'block', fontSize:'12px', fontWeight:500, color:'var(--t2)', marginBottom:'6px' }}>Type</label>
            <div style={{ display:'flex', gap:'6px' }}>
              {(['note','email','call','meeting'] as const).map(t => (
                <button key={t} onClick={() => setType(t)} style={{
                  flex:1, padding:'7px', borderRadius:'7px', fontSize:'12.5px',
                  border:'1px solid', cursor:'pointer', transition:'all 120ms',
                  background: type === t ? 'var(--vd)' : 'transparent',
                  color:      type === t ? 'var(--v)' : 'var(--t2)',
                  borderColor: type === t ? 'var(--vm)' : 'var(--b1)',
                  textTransform:'capitalize',
                }}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display:'block', fontSize:'12px', fontWeight:500, color:'var(--t2)', marginBottom:'6px' }}>Subject</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Quick summary..." className="sable-input" />
          </div>
          <div>
            <label style={{ display:'block', fontSize:'12px', fontWeight:500, color:'var(--t2)', marginBottom:'6px' }}>Notes</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="What was discussed?" className="sable-textarea" style={{ minHeight:'80px' }} />
          </div>
        </div>
        <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={log.isPending}
            onClick={() => log.mutate({ contactId, type, subject: subject||undefined, body: body||undefined })}>
            {log.isPending ? 'Saving...' : 'Log interaction'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CRMPage() {
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<string|null>(null)
  const [showAdd,       setShowAdd]       = useState(false)
  const [showLog,       setShowLog]       = useState(false)
  const [showEdit,      setShowEdit]      = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{id:string; name:string}|null>(null)

  const { data: listData, isLoading, refetch } = trpc.contacts.list.useQuery({ search, limit: 50 })
  const { data: stats }     = trpc.contacts.stats.useQuery()
  const { data: attention } = trpc.contacts.needsAttention.useQuery()
  const { data: contact, refetch: refetchContact, isFetching: contactFetching } = trpc.contacts.byId.useQuery(
    { id: selected! }, { enabled: !!selected }
  )

  const deleteContact = trpc.contacts.delete.useMutation({
    onSuccess: () => { setSelected(null); refetch() },
  })

  const contacts = listData?.contacts ?? []

  const INTERACTION_ICONS: Record<string, string> = {
    email:'✉', call:'📞', meeting:'🤝', social_dm:'💬',
    note:'📝', post_engagement:'❤️', linkedin_connection:'🔗',
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>

      <div className="page-header">
        <div>
          <h1 className="page-title">CRM</h1>
          <p className="page-subtitle">
            {stats ? `${stats.total} contacts · ${stats.needsAttention} need attention` : 'Loading...'}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add contact
        </button>
      </div>

      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 320px', overflow:'hidden' }}>

        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', borderRight:'1px solid var(--b1)', overflow:'hidden', background:'var(--s2)' }}>

          <div style={{ padding:'12px 20px', borderBottom:'1px solid var(--b0)', background:'var(--s1)' }}>
            <div style={{ position:'relative' }}>
              <svg style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--t3)' }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Search contacts..." value={search}
                onChange={e => setSearch(e.target.value)} className="sable-input" style={{ paddingLeft:'34px' }} />
            </div>
          </div>

          {attention && attention.length > 0 && (
            <div style={{ padding:'10px 20px', borderBottom:'1px solid var(--b0)', background:'var(--s2)' }}>
              <p style={{ fontSize:'10px', fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', color:'var(--t3)', marginBottom:'8px' }}>Needs attention</p>
              <div style={{ display:'flex', gap:'7px', flexWrap:'wrap' }}>
                {attention.slice(0,4).map(c => {
                  const color = getColor(c.id)
                  const days = c.lastContactedAt ? Math.floor((Date.now() - new Date(c.lastContactedAt).getTime()) / 86400000) : '?'
                  return (
                    <button key={c.id} onClick={() => setSelected(c.id)} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'0 10px', height:'30px', background:'var(--s1)', border:'1px solid var(--b2)', borderRadius:'7px', cursor:'pointer', transition:'all 120ms' }}>
                      <div style={{ width:'18px', height:'18px', borderRadius:'50%', background:color+'22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'8px', fontWeight:600, color }}>{getInitials(c.name)}</div>
                      <span style={{ fontSize:'12.5px', color:'var(--t1)' }}>{c.name.split(' ')[0]}</span>
                      <span style={{ fontSize:'10.5px', color:'var(--err)', fontWeight:500 }}>{days}d</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ flex:1, overflowY:'auto' }}>
            {isLoading ? (
              Array.from({length:5}).map((_,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 20px', borderBottom:'1px solid var(--b0)' }}>
                  <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'var(--s3)', flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ height:'13px', background:'var(--s3)', borderRadius:'4px', width:'40%', marginBottom:'6px' }} />
                    <div style={{ height:'11px', background:'var(--s3)', borderRadius:'4px', width:'60%' }} />
                  </div>
                </div>
              ))
            ) : contacts.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 24px', textAlign:'center' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'var(--s2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'14px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
                <p style={{ fontSize:'13.5px', fontWeight:500, color:'var(--t1)', marginBottom:'6px' }}>No contacts yet</p>
                <p style={{ fontSize:'12.5px', color:'var(--t3)', marginBottom:'16px', lineHeight:1.6 }}>
                  {search ? 'No contacts match your search.' : 'Add your first contact to get started.'}
                </p>
                {!search && <button className="btn-primary btn-sm" onClick={() => setShowAdd(true)}>Add first contact</button>}
              </div>
            ) : contacts.map(c => {
              const urgency  = getUrgency(c.lastContactedAt)
              const urg      = URG[urgency]
              const color    = getColor(c.id)
              const isActive = selected === c.id
              return (
                <div key={c.id} onClick={() => setSelected(c.id)} style={{
                  display:'flex', alignItems:'center', gap:'12px', padding:'12px 20px',
                  borderBottom:'1px solid var(--b0)', cursor:'pointer',
                  background: isActive ? 'var(--s2)' : 'transparent',
                  transition:'background 100ms', position:'relative',
                }}>
                  {isActive && <div style={{ position:'absolute', left:0, top:'10px', bottom:'10px', width:'2px', background:'var(--v)', borderRadius:'0 2px 2px 0' }} />}
                  <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:color+'20', border:`1px solid ${color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:600, color, flexShrink:0 }}>
                    {getInitials(c.name)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:'13px', fontWeight:500, color:'var(--t1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</p>
                    <p style={{ fontSize:'11.5px', color:'var(--t3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {[c.role, c.company].filter(Boolean).join(' · ') || c.email || 'No details'}
                    </p>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px', flexShrink:0 }}>
                    <span style={{ fontSize:'10px', fontWeight:600, padding:'2px 7px', borderRadius:'4px', background:urg.bg, color:urg.color }}>{urg.label}</span>
                    <span style={{ fontSize:'10.5px', color:'var(--t3)' }}>{getDaysSince(c.lastContactedAt)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', background:'var(--s1)', overflow:'hidden', position:'relative' }}>
          {contactFetching && selected && (
            <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', opacity: 0.6, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
          )}
          {contact ? (
            <>
              <div style={{ padding:'20px', borderBottom:'1px solid var(--b0)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                  <div style={{ width:'46px', height:'46px', borderRadius:'50%', background:getColor(contact.id)+'20', border:`1px solid ${getColor(contact.id)}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px', fontWeight:600, color:getColor(contact.id), flexShrink:0 }}>
                    {getInitials(contact.name)}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:'14.5px', fontWeight:500, color:'var(--t1)' }}>{contact.name}</p>
                    <p style={{ fontSize:'12px', color:'var(--t3)' }}>{[contact.role, contact.company].filter(Boolean).join(' · ') || 'No details'}</p>
                  </div>
                  <button onClick={() => setShowEdit(true)}
                    style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--t3)', padding:'4px', borderRadius:'6px' }} title="Edit contact" aria-label="Edit contact">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button onClick={() => setConfirmDelete({ id: contact.id, name: contact.name })}
                    disabled={deleteContact.isPending}
                    style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--t3)', padding:'4px', borderRadius:'6px', opacity: deleteContact.isPending ? 0.5 : 1 }} title="Delete contact" aria-label="Delete contact">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
                {contact.email && (
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
                    <span style={{ fontSize:'12.5px', color:'var(--t2)' }}>{contact.email}</span>
                  </div>
                )}
                {contact.tags.length > 0 && (
                  <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', marginTop:'8px' }}>
                    {contact.tags.map(tag => (
                      <span key={tag} style={{ fontSize:'10px', fontWeight:500, padding:'2px 8px', borderRadius:'4px', background:'var(--s3)', color:'var(--t2)', border:'1px solid var(--b1)' }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--b0)' }}>
                <div style={{ background:'var(--s2)', border:'1px solid var(--b1)', borderRadius:'10px', padding:'14px', borderLeft:'2px solid var(--v)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--v)" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span style={{ fontSize:'10.5px', fontWeight:600, color:'var(--v)', letterSpacing:'0.04em', textTransform:'uppercase' }}>AI suggestion</span>
                  </div>
                  <p style={{ fontSize:'12.5px', color:'var(--t2)', lineHeight:1.65, marginBottom:'12px' }}>
                    {(() => {
                      const days = contact.lastContactedAt ? Math.floor((Date.now() - new Date(contact.lastContactedAt).getTime()) / 86400000) : null
                      if (!days || days > 14) return `You haven't contacted ${contact.name.split(' ')[0]} ${days ? `in ${days} days` : 'yet'}. A follow-up now would be well timed.`
                      return `${contact.name.split(' ')[0]} is recently active. A quick check-in keeps the relationship warm.`
                    })()}
                  </p>
                  <button className="btn-primary btn-sm" onClick={() => setShowLog(true)}>Log follow-up</button>
                </div>
              </div>

              <div style={{ flex:1, overflowY:'auto', padding:'16px 18px' }}>
                <p style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--t3)', marginBottom:'14px' }}>Interaction history</p>
                {contact.interactions.length === 0 ? (
                  <p style={{ fontSize:'12.5px', color:'var(--t3)', lineHeight:1.6, marginBottom:'14px' }}>No interactions logged yet.</p>
                ) : contact.interactions.map((item, i) => (
                  <div key={item.id} style={{ display:'flex', gap:'12px', paddingBottom:'16px', position:'relative' }}>
                    {i < contact.interactions.length - 1 && <div style={{ position:'absolute', left:'15px', top:'30px', bottom:0, width:'1px', background:'var(--b1)' }} />}
                    <div style={{ width:'30px', height:'30px', borderRadius:'50%', background:'var(--s3)', border:'1px solid var(--b1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', flexShrink:0, zIndex:1 }}>
                      {INTERACTION_ICONS[item.type] ?? '📌'}
                    </div>
                    <div style={{ flex:1, paddingTop:'4px' }}>
                      <p style={{ fontSize:'12.5px', fontWeight:500, color:'var(--t1)', marginBottom:'2px', textTransform:'capitalize' }}>{item.type.replace('_',' ')}</p>
                      {item.subject && <p style={{ fontSize:'12px', color:'var(--t2)', marginBottom:'2px' }}>{item.subject}</p>}
                      {item.body    && <p style={{ fontSize:'12px', color:'var(--t3)', marginBottom:'2px', lineHeight:1.5 }}>{item.body}</p>}
                      <p style={{ fontSize:'11px', color:'var(--t3)' }}>{new Date(item.occurredAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</p>
                    </div>
                  </div>
                ))}
                <button className="btn-secondary" style={{ width:'100%', justifyContent:'center', marginTop:'4px' }} onClick={() => setShowLog(true)}>
                  + Log interaction
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 24px' }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'var(--vd)', border:'1px solid var(--vm)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--v)" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <p style={{ fontFamily:'var(--serif)', fontSize:'1.15rem', color:'var(--t1)', letterSpacing:'-0.025em', marginBottom:'8px' }}>No contact selected</p>
              <p style={{ fontSize:'12.5px', color:'var(--t3)', lineHeight:1.7, maxWidth:'220px', marginBottom:'24px' }}>Pick someone from the list to see their timeline, log an interaction, or get AI relationship suggestions.</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px', width:'100%', maxWidth:'200px' }}>
                {[
                  { icon: '📋', text: 'View interaction history' },
                  { icon: '✏️', text: 'Log a call or meeting' },
                  { icon: '✨', text: 'Get AI follow-up suggestions' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', background:'var(--s2)', borderRadius:'8px', fontSize:'12px', color:'var(--t2)', border:'1px solid var(--b1)' }}>
                    <span style={{ fontSize:'14px' }}>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSuccess={() => refetch()} />}
      {showEdit && contact && <EditModal contact={contact} onClose={() => setShowEdit(false)} onSuccess={() => { refetch(); refetchContact() }} />}
      {showLog && contact && <LogModal contactId={contact.id} contactName={contact.name} onClose={() => setShowLog(false)} onSuccess={() => refetchContact()} />}
      {confirmDelete && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div className="modal-box" style={{ width: '380px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--t1)', marginBottom: '8px' }}>Delete contact</h2>
              <p style={{ fontSize: '13.5px', color: 'var(--t2)', lineHeight: 1.6 }}>
                Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This will remove all their interactions and cannot be undone.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary btn-sm" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="btn-sm"
                disabled={deleteContact.isPending}
                style={{ background: 'var(--err)', color: '#fff', border: 'none', borderRadius: '7px', padding: '0 14px', height: '32px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', opacity: deleteContact.isPending ? 0.7 : 1 }}
                onClick={() => {
                  deleteContact.mutate({ id: confirmDelete.id })
                  setConfirmDelete(null)
                }}
              >
                {deleteContact.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}