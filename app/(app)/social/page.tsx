'use client'

import { useState } from 'react'

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C', dimColor: 'rgba(225,48,108,0.12)' },
  { id: 'linkedin',  label: 'LinkedIn',  color: '#0A66C2', dimColor: 'rgba(10,102,194,0.12)' },
  { id: 'twitter',   label: 'Twitter/X', color: '#EAE6FF', dimColor: 'rgba(234,230,255,0.08)' },
]

const CHAR_LIMITS: Record<string, number> = {
  instagram: 2200,
  linkedin:  3000,
  twitter:   280,
}

const OPTIMAL_TIMES = [
  'Today 9:00 AM',
  'Today 12:00 PM',
  'Tomorrow 9:00 AM',
  'Tomorrow 6:00 PM',
]

export default function SocialPage() {
  const [body, setBody]                     = useState('')
  const [selected, setSelected]             = useState<Set<string>>(new Set(['linkedin']))
  const [aiPrompt, setAiPrompt]             = useState('')
  const [generating, setGenerating]         = useState(false)
  const [scheduledTime, setScheduledTime]   = useState('')
  const [previewPlatform, setPreviewPlatform] = useState('linkedin')
  const [saved, setSaved]                   = useState(false)

  const togglePlatform = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      if (next.size === 0) next.add(id)
      return next
    })
  }

  const mostRestrictiveLimit = Math.min(
    ...[...selected].map(p => CHAR_LIMITS[p] ?? 3000)
  )

  const charPct = Math.min((body.length / mostRestrictiveLimit) * 100, 100)
  const charOver = body.length > mostRestrictiveLimit

  const generateCaption = async () => {
    if (!aiPrompt.trim()) return
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1500))
    setBody(`Here's what nobody tells you about ${aiPrompt}:\n\nThe thing that actually matters isn't what you think. After spending years in this space, I've learned that the fundamentals always win — even when everything else is changing.\n\nThree things I keep coming back to:\n\n1. Consistency beats perfection every time\n2. The best insight is the one you actually share\n3. Your audience wants to hear from you, not a polished version of you\n\nWhat's your take? Drop it in the comments.\n\n#growth #${aiPrompt.toLowerCase().replace(/\s+/g, '')} #insights`)
    setGenerating(false)
  }

  const handleSchedule = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex flex-col h-full">

      {/* Page header */}
      <div className="flex items-center justify-between px-[32px] py-[20px] border-b border-[var(--b1)]">
        <div>
          <h1 className="font-serif text-[1.6rem] text-t1 tracking-[-0.035em] leading-[1.1]">
            Social
          </h1>
          <p className="text-[12px] text-t3 mt-[2px]">Create and schedule posts</p>
        </div>
        <div className="flex items-center gap-[8px]">
          <button className="
            h-[32px] px-[14px] text-[12.5px] text-t2
            bg-transparent border border-[var(--b2)] rounded-[7px]
            cursor-pointer hover:text-t1 hover:border-[var(--b3)]
            transition-all duration-[120ms]
          ">
            View calendar
          </button>
        </div>
      </div>

      {/* Composer */}
      <div className="flex-1 overflow-hidden grid grid-cols-[1fr_280px]">

        {/* Left: write pane */}
        <div className="flex flex-col border-r border-[var(--b1)] overflow-hidden">

          {/* Platform selector */}
          <div className="flex items-center gap-[8px] px-[20px] py-[14px] border-b border-[var(--b0)] flex-wrap">
            <span className="text-[10.5px] font-medium tracking-[0.06em] uppercase text-t3 mr-[4px]">
              Post to
            </span>
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className="
                  flex items-center gap-[4px] px-[10px] h-[26px]
                  rounded-[6px] text-[11.5px] font-medium
                  border transition-all duration-[120ms] cursor-pointer
                "
                style={{
                  background:  selected.has(p.id) ? p.dimColor : 'transparent',
                  color:       selected.has(p.id) ? p.color    : '#4A4760',
                  borderColor: selected.has(p.id) ? p.color    : 'rgba(255,255,255,0.07)',
                }}
              >
                {p.label}
              </button>
            ))}
            <button className="
              px-[10px] h-[26px] rounded-[6px]
              text-[11px] text-t3 border border-[var(--b1)]
              bg-transparent cursor-pointer
              hover:text-t2 hover:border-[var(--b2)]
              transition-all duration-[120ms]
            ">
              + Connect more
            </button>
          </div>

          {/* AI prompt strip */}
          <div className="flex items-center gap-[10px] px-[20px] py-[10px] border-b border-[var(--b0)] bg-s1">
            <div className="
              w-[20px] h-[20px] rounded-[5px] bg-[var(--vd)]
              flex items-center justify-center flex-shrink-0
            ">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7C6AF7" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="What do you want to post about? Press Enter to generate..."
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateCaption()}
              className="
                flex-1 bg-transparent border-none outline-none
                text-[12.5px] text-t1 placeholder:text-t3
                font-sans
              "
            />
            <button
              onClick={generateCaption}
              disabled={!aiPrompt.trim() || generating}
              className="
                flex-shrink-0 text-[11.5px] font-medium
                px-[10px] h-[26px] rounded-[5px]
                bg-[var(--v)] text-white border-none cursor-pointer
                hover:bg-[var(--vh)] transition-all duration-[120ms]
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {generating ? 'Writing...' : 'Generate'}
            </button>
          </div>

          {/* Textarea */}
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="What do you want to say today?"
            className="
              flex-1 bg-bg border-none outline-none resize-none
              text-[14px] text-t1 font-sans font-light
              leading-[1.75] tracking-[-0.01em]
              p-[24px] placeholder:text-t4
            "
          />

          {/* Toolbar */}
          <div className="
            flex items-center justify-between
            px-[20px] py-[12px] border-t border-[var(--b0)] bg-s1
          ">
            <div className="flex items-center gap-[14px]">
              <button className="
                flex items-center gap-[6px] text-[12px] text-t3
                bg-none border-none cursor-pointer
                hover:text-t1 transition-colors
              ">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                Media
              </button>

              {/* Char counter */}
              {body.length > 0 && (
                <div className="flex items-center gap-[7px]">
                  <svg width="28" height="28" viewBox="0 0 28 28">
                    <circle cx="14" cy="14" r="10" fill="none" stroke="#211F30" strokeWidth="2"/>
                    <circle
                      cx="14" cy="14" r="10"
                      fill="none"
                      stroke={charOver ? '#F87171' : charPct > 85 ? '#FCD34D' : '#7C6AF7'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="62.8"
                      strokeDashoffset={62.8 * (1 - charPct / 100)}
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                  </svg>
                  <span className={`text-[11px] tabular-nums ${charOver ? 'text-[#F87171]' : 'text-t3'}`}>
                    {charOver ? `-${body.length - mostRestrictiveLimit}` : `${mostRestrictiveLimit - body.length}`}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-[8px]">
              <select
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="
                  appearance-none bg-s2 border border-[var(--b1)]
                  rounded-[6px] text-[12px] text-t2 font-sans
                  px-[10px] h-[30px] cursor-pointer outline-none
                  hover:border-[var(--b2)] transition-colors
                "
              >
                <option value="">Schedule time...</option>
                {OPTIMAL_TIMES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <button className="
                h-[30px] px-[12px] text-[12.5px] text-t2
                bg-transparent border border-[var(--b2)] rounded-[7px]
                cursor-pointer hover:text-t1 hover:border-[var(--b3)]
                transition-all duration-[120ms]
              ">
                Save draft
              </button>
              <button
                onClick={handleSchedule}
                disabled={!body.trim() || selected.size === 0}
                className="
                  h-[30px] px-[14px] text-[12.5px]
                  bg-[var(--v)] text-white rounded-[7px]
                  border-none cursor-pointer
                  hover:bg-[var(--vh)] transition-all duration-[120ms]
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                {saved ? '✓ Scheduled' : scheduledTime ? 'Schedule' : 'Post now'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: preview pane */}
        <div className="flex flex-col bg-s1 overflow-hidden">
          <div className="flex items-center justify-between px-[16px] py-[14px] border-b border-[var(--b0)]">
            <span className="text-[10.5px] font-medium tracking-[0.07em] uppercase text-t3">
              Preview
            </span>
            <div className="flex gap-[3px]">
              {[...selected].map(id => (
                <button
                  key={id}
                  onClick={() => setPreviewPlatform(id)}
                  className="
                    text-[11px] px-[8px] h-[22px] rounded-[4px]
                    border-none cursor-pointer transition-all duration-[120ms]
                  "
                  style={{
                    background: previewPlatform === id ? '#211F30' : 'transparent',
                    color:      previewPlatform === id ? '#EAE6FF' : '#4A4760',
                  }}
                >
                  {PLATFORMS.find(p => p.id === id)?.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-[16px]">
            {/* Mock post */}
            <div className="bg-s2 border border-[var(--b1)] rounded-[10px] p-[14px]">
              <div className="flex items-center gap-[9px] mb-[11px]">
                <div className="
                  w-[30px] h-[30px] rounded-full bg-s3
                  border border-[var(--b2)]
                  flex items-center justify-center
                  text-[10px] font-medium text-t2
                ">
                  YB
                </div>
                <div>
                  <p className="text-[12.5px] font-medium text-t1">Your Brand</p>
                  <p className="text-[10.5px] text-t3 capitalize">{previewPlatform}</p>
                </div>
              </div>
              <p className="text-[12.5px] text-t2 leading-[1.65] whitespace-pre-wrap break-words">
                {body || <span className="text-t4 italic">Your caption will appear here...</span>}
              </p>
            </div>

            {/* Platform tips */}
            <div className="mt-[14px]">
              <p className="text-[10.5px] font-medium tracking-[0.06em] uppercase text-t3 mb-[8px] capitalize">
                {previewPlatform} tips
              </p>
              {previewPlatform === 'instagram' && (
                <>
                  <p className="text-[11.5px] text-t3 mb-[3px] flex gap-[6px]"><span className="text-t4">—</span>Move hashtags to first comment</p>
                  <p className="text-[11.5px] text-t3 mb-[3px] flex gap-[6px]"><span className="text-t4">—</span>Aspect ratio: 4:5 to 1.91:1</p>
                </>
              )}
              {previewPlatform === 'linkedin' && (
                <>
                  <p className="text-[11.5px] text-t3 mb-[3px] flex gap-[6px]"><span className="text-t4">—</span>No hashtags in first line</p>
                  <p className="text-[11.5px] text-t3 mb-[3px] flex gap-[6px]"><span className="text-t4">—</span>3–5 hashtags at the end performs best</p>
                  <p className="text-[11.5px] text-t3 mb-[3px] flex gap-[6px]"><span className="text-t4">—</span>Question CTAs drive 2× more comments</p>
                </>
              )}
              {previewPlatform === 'twitter' && (
                <>
                  <p className="text-[11.5px] text-t3 mb-[3px] flex gap-[6px]"><span className="text-t4">—</span>Over 280 chars becomes a thread</p>
                  <p className="text-[11.5px] text-t3 mb-[3px] flex gap-[6px]"><span className="text-t4">—</span>Max 2 hashtags recommended</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}