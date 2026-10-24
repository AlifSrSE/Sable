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
}

const DEMO_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@vercel.com',
    company: 'Vercel',
    role: 'Head of Growth',
    tags: ['prospect', 'saas'],
    lastContactedAt: '18 days ago',
    daysSince: 18,
    urgency: 'urgent',
    initials: 'SC',
  },
  {
    id: '2',
    name: 'James Kim',
    email: 'james@acme.com',
    company: 'Acme Corp',
    role: 'Founder',
    tags: ['client', 'active'],
    lastContactedAt: '5 days ago',
    daysSince: 5,
    urgency: 'ok',
    initials: 'JK',
  },
  {
    id: '3',
    name: 'Maya Rodriguez',
    email: 'maya@design.co',
    company: 'Design Co',
    role: 'Creative Director',
    tags: ['prospect'],
    lastContactedAt: '42 days ago',
    daysSince: 42,
    urgency: 'urgent',
    initials: 'MR',
  },
  {
    id: '4',
    name: 'Alex Patel',
    email: 'alex@startup.io',
    company: 'Startup IO',
    role: 'CTO',
    tags: ['lead', 'tech'],
    lastContactedAt: '7 days ago',
    daysSince: 7,
    urgency: 'soon',
    initials: 'AP',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa@agency.com',
    company: 'Thompson Agency',
    role: 'Director',
    tags: ['client', 'agency'],
    lastContactedAt: '2 days ago',
    daysSince: 2,
    urgency: 'ok',
    initials: 'LT',
  },
]

const urgencyConfig = {
  urgent: { label: 'Urgent',     bg: 'rgba(248,113,113,0.12)', color: '#F87171' },
  soon:   { label: 'Follow up',  bg: 'rgba(252,211,77,0.10)',  color: '#FCD34D' },
  ok:     { label: 'On track',   bg: 'rgba(45,212,191,0.10)',  color: '#2DD4BF' },
}

export default function CRMPage() {
  const [search, setSearch]             = useState('')
  const [selected, setSelected]         = useState<string | null>(null)
  const [showAdd, setShowAdd]           = useState(false)
  const [newName, setNewName]           = useState('')
  const [newEmail, setNewEmail]         = useState('')
  const [newCompany, setNewCompany]     = useState('')

  const filtered = DEMO_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const selectedContact = DEMO_CONTACTS.find(c => c.id === selected)

  return (
    <div className="flex flex-col h-full">

      {/* Page header */}
      <div className="flex items-center justify-between px-[32px] py-[20px] border-b border-[var(--b1)]">
        <div>
          <h1 className="font-serif text-[1.6rem] text-t1 tracking-[-0.035em] leading-[1.1]">
            CRM
          </h1>
          <p className="text-[12px] text-t3 mt-[2px]">
            {DEMO_CONTACTS.length} contacts · 2 need attention
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="
            flex items-center gap-[6px] h-[32px] px-[14px]
            bg-[var(--v)] text-white text-[12.5px]
            rounded-[7px] border-none cursor-pointer
            hover:bg-[var(--vh)] transition-all duration-[120ms]
          "
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add contact
        </button>
      </div>

      <div className="flex-1 overflow-hidden grid grid-cols-[1fr_320px]">

        {/* Left: contact list */}
        <div className="flex flex-col border-r border-[var(--b1)] overflow-hidden">

          {/* Search */}
          <div className="px-[20px] py-[12px] border-b border-[var(--b0)]">
            <div className="relative">
              <svg
                className="absolute left-[10px] top-1/2 -translate-y-1/2 text-t3"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="
                  w-full h-[34px] pl-[32px] pr-[12px]
                  bg-s2 border border-[var(--b1)] rounded-[7px]
                  text-[13px] text-t1 font-sans
                  placeholder:text-t3 outline-none
                  focus:border-[var(--b2)] transition-colors
                "
              />
            </div>
          </div>

          {/* Re-engage strip */}
          <div className="px-[20px] py-[10px] border-b border-[var(--b0)] bg-s1">
            <p className="text-[11px] font-medium tracking-[0.05em] uppercase text-t3 mb-[8px]">
              Needs attention
            </p>
            <div className="flex gap-[8px]">
              {DEMO_CONTACTS.filter(c => c.urgency === 'urgent').map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className="
                    flex items-center gap-[7px] px-[10px] h-[30px]
                    bg-s2 border border-[var(--b1)] rounded-[7px]
                    cursor-pointer hover:border-[var(--b2)]
                    transition-all duration-[120ms]
                  "
                >
                  <div className="
                    w-[18px] h-[18px] rounded-full bg-s3
                    flex items-center justify-center
                    text-[8px] font-medium text-t2
                  ">
                    {c.initials}
                  </div>
                  <span className="text-[12px] text-t2">{c.name.split(' ')[0]}</span>
                  <span className="text-[10px]" style={{ color: '#F87171' }}>
                    {c.daysSince}d
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact rows */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-[48px] text-center">
                <p className="text-[13px] text-t2 mb-[4px]">No contacts found</p>
                <p className="text-[12px] text-t3">Try a different search term</p>
              </div>
            ) : (
              filtered.map(contact => {
                const urg = urgencyConfig[contact.urgency]
                const isSelected = selected === contact.id
                return (
                  <div
                    key={contact.id}
                    onClick={() => setSelected(contact.id)}
                    className={`
                      flex items-center gap-[12px] px-[20px] py-[12px]
                      border-b border-[var(--b0)] cursor-pointer
                      transition-colors duration-[100ms]
                      ${isSelected ? 'bg-s2' : 'hover:bg-s1'}
                    `}
                  >
                    {isSelected && (
                      <div className="absolute left-0 w-[2px] h-[40px] bg-[var(--v)] rounded-r" />
                    )}
                    <div className="
                      w-[32px] h-[32px] rounded-full bg-s3
                      border border-[var(--b2)]
                      flex items-center justify-center
                      text-[11px] font-medium text-t2 flex-shrink-0
                    ">
                      {contact.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-t1 truncate">
                        {contact.name}
                      </p>
                      <p className="text-[11.5px] text-t3 truncate">
                        {contact.role} · {contact.company}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-[4px]">
                      <span
                        className="text-[10px] font-medium px-[6px] py-[2px] rounded-[4px]"
                        style={{ background: urg.bg, color: urg.color }}
                      >
                        {urg.label}
                      </span>
                      <span className="text-[10.5px] text-t3">
                        {contact.lastContactedAt}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right: contact detail */}
        <div className="flex flex-col bg-s1 overflow-hidden">
          {selectedContact ? (
            <>
              <div className="p-[20px] border-b border-[var(--b0)]">
                <div className="flex items-center gap-[12px] mb-[16px]">
                  <div className="
                    w-[44px] h-[44px] rounded-full bg-s3
                    border border-[var(--b2)]
                    flex items-center justify-center
                    text-[14px] font-medium text-t2
                  ">
                    {selectedContact.initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-t1">
                      {selectedContact.name}
                    </p>
                    <p className="text-[12px] text-t3">
                      {selectedContact.role} · {selectedContact.company}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[8px]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4A4760" strokeWidth="1.5">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m2 7 10 7 10-7"/>
                    </svg>
                    <span className="text-[12.5px] text-t2">{selectedContact.email}</span>
                  </div>
                  <div className="flex gap-[4px] flex-wrap mt-[4px]">
                    {selectedContact.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-[7px] py-[2px] rounded-[4px] bg-s3 text-t3 border border-[var(--b1)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI follow-up suggestion */}
              <div className="p-[16px] border-b border-[var(--b0)]">
                <div className="bg-s2 border border-[var(--b1)] rounded-[8px] p-[12px]">
                  <div className="flex items-center gap-[6px] mb-[8px]">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7C6AF7" strokeWidth="1.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-[10.5px] font-medium text-[var(--v)] tracking-[0.04em] uppercase">
                      AI suggestion
                    </span>
                  </div>
                  <p className="text-[12px] text-t2 leading-[1.6] mb-[10px]">
                    {selectedContact.daysSince > 14
                      ? `You haven't contacted ${selectedContact.name.split(' ')[0]} in ${selectedContact.daysSince} days. Based on their interest in your recent posts, now is a good time to follow up.`
                      : `${selectedContact.name.split(' ')[0]} is engaged and active. A quick check-in would keep the momentum going.`
                    }
                  </p>
                  <button className="
                    h-[28px] px-[12px] text-[11.5px]
                    bg-[var(--v)] text-white rounded-[6px]
                    border-none cursor-pointer
                    hover:bg-[var(--vh)] transition-all duration-[120ms]
                  ">
                    Draft follow-up email
                  </button>
                </div>
              </div>

              {/* Interaction timeline */}
              <div className="flex-1 overflow-y-auto p-[16px]">
                <p className="text-[10.5px] font-medium tracking-[0.06em] uppercase text-t3 mb-[12px]">
                  Interaction history
                </p>
                <div className="flex flex-col gap-[0]">
                  {[
                    { type: 'Email', note: 'Sent proposal follow-up', date: selectedContact.lastContactedAt, icon: '✉' },
                    { type: 'Note',  note: 'Interested in the Growth plan', date: '3 weeks ago', icon: '📝' },
                    { type: 'Call',  note: 'Discovery call — 30 min', date: '1 month ago', icon: '📞' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-[12px] pb-[14px] relative">
                      {i < 2 && (
                        <div className="absolute left-[15px] top-[24px] bottom-0 w-[1px] bg-[var(--b1)]" />
                      )}
                      <div className="
                        w-[30px] h-[30px] rounded-full bg-s3
                        border border-[var(--b1)]
                        flex items-center justify-center
                        text-[12px] flex-shrink-0 z-10
                      ">
                        {item.icon}
                      </div>
                      <div className="flex-1 pt-[4px]">
                        <p className="text-[12.5px] font-medium text-t1 mb-[2px]">{item.type}</p>
                        <p className="text-[12px] text-t3 mb-[2px]">{item.note}</p>
                        <p className="text-[11px] text-t4">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-[24px]">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-s2 flex items-center justify-center mb-[14px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A4760" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <p className="text-[13px] font-medium text-t1 mb-[6px]">Select a contact</p>
              <p className="text-[12px] text-t3 leading-[1.6]">
                Click any contact to see their details, interaction history, and AI suggestions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add contact modal */}
      {showAdd && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={e => e.target === e.currentTarget && setShowAdd(false)}
        >
          <div className="bg-s1 border border-[var(--b2)] rounded-[14px] p-[28px] w-[400px]">
            <h2 className="font-serif text-[1.3rem] text-t1 tracking-[-0.03em] mb-[20px]">
              Add contact
            </h2>
            <div className="flex flex-col gap-[14px] mb-[24px]">
              {[
                { label: 'Name',    value: newName,    setter: setNewName,    placeholder: 'Sarah Chen' },
                { label: 'Email',   value: newEmail,   setter: setNewEmail,   placeholder: 'sarah@company.com' },
                { label: 'Company', value: newCompany, setter: setNewCompany, placeholder: 'Acme Corp' },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-[12px] font-medium text-t2 mb-[6px]">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    className="
                      w-full h-[36px] px-[12px]
                      bg-s2 border border-[var(--b1)] rounded-[7px]
                      text-[13px] text-t1 font-sans
                      placeholder:text-t3 outline-none
                      focus:border-[var(--b2)] transition-colors
                    "
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-[8px] justify-end">
              <button
                onClick={() => setShowAdd(false)}
                className="
                  h-[36px] px-[16px] text-[13px] text-t2
                  bg-transparent border border-[var(--b2)] rounded-[7px]
                  cursor-pointer hover:text-t1 transition-all duration-[120ms]
                "
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="
                  h-[36px] px-[16px] text-[13px]
                  bg-[var(--v)] text-white rounded-[7px]
                  border-none cursor-pointer
                  hover:bg-[var(--vh)] transition-all duration-[120ms]
                "
              >
                Add contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}