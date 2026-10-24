'use client'

import { useState } from 'react'

interface Episode {
  id: string
  podcast: string
  title: string
  duration: string
  insights: number
  listened: boolean
  processing: boolean
  summary?: string
  keyPoints?: string[]
}

const DEMO_EPISODES: Episode[] = [
  {
    id: '1',
    podcast: "Lenny's Podcast",
    title: 'The pricing mistakes every early-stage founder makes',
    duration: '58 min',
    insights: 5,
    listened: false,
    processing: false,
    summary: 'A deep dive into pricing psychology for founders, covering why anchoring to cost is the biggest mistake and how to price to value instead.',
    keyPoints: [
      'Anchor to outcome, not to cost — your price should reflect what the client gains',
      'Pricing tiers should map to value segments, not effort levels',
      'The gap between price and perceived value is your margin of trust',
      'Raise prices before you feel ready — you always are',
      'A confused buyer never buys — simplify your pricing page',
    ],
  },
  {
    id: '2',
    podcast: 'My First Million',
    title: 'How to build an audience when you have nothing to say',
    duration: '45 min',
    insights: 4,
    listened: false,
    processing: false,
    summary: 'Sam and Shaan break down the counterintuitive truth about audience building — you don\'t need to be an expert, you need to be a curious learner in public.',
    keyPoints: [
      'Document the journey, not just the destination',
      'Specificity beats generality every time in content',
      'The best posts come from genuine questions, not performed expertise',
      'Consistency is the only moat available to everyone',
    ],
  },
  {
    id: '3',
    podcast: 'The Tim Ferriss Show',
    title: 'Peter Attia on what actually extends healthy lifespan',
    duration: '1h 52m',
    insights: 7,
    listened: true,
    processing: false,
    summary: 'Peter Attia shares his framework for longevity, covering the four horsemen of chronic disease and what the research actually says about extending healthspan.',
    keyPoints: [
      'Zone 2 cardio is the most underrated longevity intervention',
      'Muscle mass in your 50s predicts quality of life in your 80s',
      'Sleep is the master regulator of every other health metric',
      'Emotional health is as important as physical health for longevity',
    ],
  },
  {
    id: '4',
    podcast: 'How I Built This',
    title: 'Notion: Ivan Zhao',
    duration: '52 min',
    insights: 0,
    listened: false,
    processing: true,
  },
]

export default function AudioPage() {
  const [selected, setSelected]   = useState<string | null>('1')
  const [feedUrl, setFeedUrl]     = useState('')
  const [showAdd, setShowAdd]     = useState(false)
  const [activeTab, setActiveTab] = useState<'brief' | 'library'>('brief')

  const selectedEp = DEMO_EPISODES.find(e => e.id === selected)

  return (
    <div className="flex flex-col h-full">

      {/* Page header */}
      <div className="flex items-center justify-between px-[32px] py-[20px] border-b border-[var(--b1)]">
        <div>
          <h1 className="font-serif text-[1.6rem] text-t1 tracking-[-0.035em] leading-[1.1]">
            Audio
          </h1>
          <p className="text-[12px] text-t3 mt-[2px]">
            Your daily brief and podcast library
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
          Subscribe to podcast
        </button>
      </div>

      <div className="flex-1 overflow-hidden grid grid-cols-[1fr_320px]">

        {/* Left: episode list */}
        <div className="flex flex-col border-r border-[var(--b1)] overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-[var(--b0)]">
            {(['brief', 'library'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="
                  flex-1 py-[12px] text-[12.5px] font-medium
                  border-none cursor-pointer capitalize
                  transition-all duration-[120ms]
                  border-b-[2px]
                "
                style={{
                  background:   'transparent',
                  color:        activeTab === tab ? '#EAE6FF' : '#4A4760',
                  borderColor:  activeTab === tab ? '#7C6AF7' : 'transparent',
                }}
              >
                {tab === 'brief' ? "Today's brief" : 'Library'}
              </button>
            ))}
          </div>

          {/* Daily brief banner */}
          {activeTab === 'brief' && (
            <div className="px-[20px] py-[14px] border-b border-[var(--b0)] bg-s1">
              <div className="flex items-start gap-[10px]">
                <div className="
                  w-[32px] h-[32px] rounded-[8px]
                  bg-[rgba(244,132,95,0.12)]
                  flex items-center justify-center flex-shrink-0
                ">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F4845F" strokeWidth="1.5">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[12.5px] font-medium text-t1 mb-[2px]">
                    Your brief for today
                  </p>
                  <p className="text-[12px] text-t3 leading-[1.55]">
                    3 episodes · 2h 35m total · 16 insights waiting
                  </p>
                </div>
                <button className="
                  h-[28px] px-[10px] text-[11.5px]
                  bg-[rgba(244,132,95,0.12)] text-[#F4845F]
                  border border-[rgba(244,132,95,0.2)] rounded-[6px]
                  cursor-pointer hover:bg-[rgba(244,132,95,0.18)]
                  transition-all duration-[120ms]
                ">
                  Listen all
                </button>
              </div>
            </div>
          )}

          {/* Episode list */}
          <div className="flex-1 overflow-y-auto">
            {DEMO_EPISODES.map(ep => (
              <div
                key={ep.id}
                onClick={() => !ep.processing && setSelected(ep.id)}
                className={`
                  flex items-start gap-[12px] px-[20px] py-[14px]
                  border-b border-[var(--b0)]
                  transition-colors duration-[100ms]
                  ${ep.processing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${selected === ep.id ? 'bg-s2' : 'hover:bg-s1'}
                `}
              >
                {/* Unlistened dot */}
                <div className="flex-shrink-0 mt-[5px]">
                  <div
                    className="w-[7px] h-[7px] rounded-full"
                    style={{
                      background: ep.processing ? '#2E2C42' :
                                  ep.listened   ? '#2E2C42' : '#F4845F'
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="
                    text-[10px] font-medium tracking-[0.05em]
                    uppercase mb-[3px]
                  "
                    style={{ color: '#F4845F' }}
                  >
                    {ep.podcast}
                  </p>
                  <p className="text-[13px] text-t1 leading-[1.45] mb-[5px]">
                    {ep.title}
                  </p>
                  <div className="flex items-center gap-[10px]">
                    <span className="text-[11px] text-t3">{ep.duration}</span>
                    {ep.processing ? (
                      <span className="text-[11px] text-[var(--v)]">Processing...</span>
                    ) : ep.insights > 0 ? (
                      <span className="text-[11px] text-t3">{ep.insights} insights</span>
                    ) : null}
                    {ep.listened && (
                      <span className="text-[11px] text-t3 flex items-center gap-[3px]">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        Listened
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: episode detail */}
        <div className="flex flex-col bg-s1 overflow-hidden">
          {selectedEp ? (
            <>
              {/* Episode header */}
              <div className="p-[20px] border-b border-[var(--b0)]">
                <p className="text-[10px] font-medium tracking-[0.06em] uppercase mb-[6px]"
                  style={{ color: '#F4845F' }}>
                  {selectedEp.podcast}
                </p>
                <p className="text-[14px] font-medium text-t1 leading-[1.4] mb-[10px]">
                  {selectedEp.title}
                </p>
                <p className="text-[12px] text-t3 mb-[14px]">
                  {selectedEp.duration} · {selectedEp.insights} insights
                </p>
                <div className="flex gap-[7px]">
                  <button className="
                    flex items-center gap-[6px] h-[30px] px-[12px]
                    bg-s2 border border-[var(--b1)] rounded-[6px]
                    text-[12px] text-t2 cursor-pointer
                    hover:text-t1 hover:border-[var(--b2)]
                    transition-all duration-[120ms]
                  ">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    Listen
                  </button>
                  <button className="
                    flex items-center gap-[6px] h-[30px] px-[12px]
                    bg-[var(--v)] text-white rounded-[6px]
                    border-none text-[12px] cursor-pointer
                    hover:bg-[var(--vh)] transition-all duration-[120ms]
                  ">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Create post
                  </button>
                </div>
              </div>

              {/* Summary */}
              {selectedEp.summary && (
                <div className="px-[18px] py-[14px] border-b border-[var(--b0)]">
                  <p className="text-[10.5px] font-medium tracking-[0.06em] uppercase text-t3 mb-[8px]">
                    Summary
                  </p>
                  <p className="text-[12.5px] text-t2 leading-[1.65]">
                    {selectedEp.summary}
                  </p>
                </div>
              )}

              {/* Key points */}
              {selectedEp.keyPoints && (
                <div className="flex-1 overflow-y-auto px-[18px] py-[14px]">
                  <p className="text-[10.5px] font-medium tracking-[0.06em] uppercase text-t3 mb-[12px]">
                    Key insights
                  </p>
                  <div className="flex flex-col gap-[8px]">
                    {selectedEp.keyPoints.map((point, i) => (
                      <div
                        key={i}
                        className="
                          flex gap-[10px] p-[10px_12px]
                          bg-s2 border border-[var(--b1)] rounded-[8px]
                          border-l-[2px]
                        "
                        style={{ borderLeftColor: '#F4845F' }}
                      >
                        <span className="
                          text-[10px] font-medium text-t3
                          flex-shrink-0 mt-[1px] w-[14px]
                        ">
                          {i + 1}.
                        </span>
                        <p className="text-[12.5px] text-t2 leading-[1.6]">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-[24px]">
              <p className="text-[13px] font-medium text-t1 mb-[6px]">Select an episode</p>
              <p className="text-[12px] text-t3 leading-[1.6]">
                Click any episode to see its summary and key insights.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add podcast modal */}
      {showAdd && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={e => e.target === e.currentTarget && setShowAdd(false)}
        >
          <div className="bg-s1 border border-[var(--b2)] rounded-[14px] p-[28px] w-[420px]">
            <h2 className="font-serif text-[1.3rem] text-t1 tracking-[-0.03em] mb-[6px]">
              Subscribe to a podcast
            </h2>
            <p className="text-[12.5px] text-t3 mb-[20px] leading-[1.6]">
              Paste an RSS feed URL or search by podcast name.
            </p>
            <div className="mb-[20px]">
              <label className="block text-[12px] font-medium text-t2 mb-[6px]">
                RSS feed URL
              </label>
              <input
                type="text"
                value={feedUrl}
                onChange={e => setFeedUrl(e.target.value)}
                placeholder="https://feeds.simplecast.com/..."
                className="
                  w-full h-[36px] px-[12px]
                  bg-s2 border border-[var(--b1)] rounded-[7px]
                  text-[13px] text-t1 font-sans
                  placeholder:text-t3 outline-none
                  focus:border-[var(--b2)] transition-colors
                "
              />
            </div>
            <div className="mb-[20px]">
              <p className="text-[11px] font-medium text-t3 mb-[10px] tracking-[0.04em] uppercase">
                Popular podcasts
              </p>
              <div className="flex flex-col gap-[6px]">
                {[
                  { name: "Lenny's Podcast",  feed: 'https://feeds.simplecast.com/OyeGSGSq' },
                  { name: 'My First Million',  feed: 'https://feeds.megaphone.fm/MFM2426690007' },
                  { name: 'How I Built This',  feed: 'https://feeds.npr.org/510313/podcast.xml' },
                ].map(p => (
                  <button
                    key={p.name}
                    onClick={() => setFeedUrl(p.feed)}
                    className="
                      flex items-center justify-between
                      px-[12px] py-[8px] rounded-[7px]
                      bg-s2 border border-[var(--b1)]
                      cursor-pointer hover:border-[var(--b2)]
                      transition-all duration-[120ms]
                      text-left
                    "
                  >
                    <span className="text-[12.5px] text-t1">{p.name}</span>
                    <span className="text-[11px] text-t3">Select</span>
                  </button>
                ))}
              </div>
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
                disabled={!feedUrl.trim()}
                className="
                  h-[36px] px-[16px] text-[13px]
                  bg-[var(--v)] text-white rounded-[7px]
                  border-none cursor-pointer
                  hover:bg-[var(--vh)] transition-all duration-[120ms]
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}