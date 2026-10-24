import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()
  const firstName = user?.firstName ?? 'there'

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 18 ? 'Good afternoon' :
    'Good evening'

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <div className="p-[32px_36px] max-w-[1080px] animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between mb-[28px]">
        <div>
          <h1 className="font-serif text-[2rem] text-t1 tracking-[-0.04em] leading-[1.1] mb-[4px]">
            {greeting}, {firstName}
          </h1>
          <p className="text-[13px] text-t3">{today}</p>
        </div>
        <button className="
          flex items-center gap-[6px] h-[32px] px-[14px]
          bg-[var(--v)] text-white text-[13px]
          rounded-[7px] border-none cursor-pointer
          hover:bg-[var(--vh)] transition-all duration-[120ms]
        ">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New post
        </button>
      </div>

      {/* Voice confidence banner */}
      <div className="
        flex items-center gap-[14px]
        bg-s1 border border-[var(--b1)] rounded-[10px]
        p-[14px_18px] mb-[28px] relative overflow-hidden
      ">
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--v)]" />
        <div className="
          w-[32px] h-[32px] rounded-[8px]
          bg-[var(--vd)] flex items-center justify-center flex-shrink-0
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C6AF7" strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-medium text-[var(--v)] mb-[4px]">
            Voice profile building — connect your social accounts to get started
          </p>
          <div className="h-[3px] bg-s3 rounded-[2px] overflow-hidden">
            <div className="h-full w-[5%] bg-[var(--v)] rounded-[2px]" />
          </div>
        </div>
        <button className="
          flex-shrink-0 text-[12px] text-t3
          bg-transparent border border-[var(--b2)]
          px-[12px] h-[28px] rounded-[6px] cursor-pointer
          hover:text-t1 hover:border-[var(--b3)]
          transition-all duration-[120ms]
        ">
          Connect accounts
        </button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[1fr_280px] gap-[16px]">

        {/* Left: upcoming posts */}
        <div className="bg-s1 border border-[var(--b1)] rounded-[12px] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[var(--b0)]">
            <div className="flex items-center gap-[8px] text-[12.5px] font-medium text-t1">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--v)]" />
              Upcoming posts
            </div>
            <button className="text-[12px] text-t3 bg-none border-none cursor-pointer hover:text-[var(--v)] transition-colors">
              View calendar
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 border-b border-[var(--b0)]">
            {[
              { val: '0',    label: 'Posts this week',  delta: null },
              { val: '0',    label: 'Total impressions', delta: null },
              { val: '0%',   label: 'Engagement rate',  delta: null },
            ].map((stat, i) => (
              <div key={i} className="px-[20px] py-[14px] border-r border-[var(--b0)] last:border-r-0">
                <div className="font-serif text-[1.8rem] text-t1 tracking-[-0.04em] leading-none">
                  {stat.val}
                </div>
                <div className="text-[11px] text-t3 mt-[3px]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          <div className="flex-1 flex flex-col items-center justify-center py-[48px] px-[32px] text-center">
            <div className="w-[40px] h-[40px] rounded-[10px] bg-s2 flex items-center justify-center mb-[16px]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A4760" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <p className="text-[13.5px] font-medium text-t1 mb-[6px]">No posts scheduled yet</p>
            <p className="text-[12.5px] text-t3 mb-[20px] max-w-[240px] leading-[1.6]">
              Connect a social account and create your first post to get started.
            </p>
            <button className="
              flex items-center gap-[6px] h-[32px] px-[14px]
              bg-[var(--v)] text-white text-[12.5px]
              rounded-[7px] border-none cursor-pointer
              hover:bg-[var(--vh)] transition-all duration-[120ms]
            ">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create first post
            </button>
          </div>
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-[12px]">

          {/* Trends */}
          <div className="bg-s1 border border-[var(--b1)] rounded-[12px] overflow-hidden">
            <div className="flex items-center justify-between px-[16px] py-[14px] border-b border-[var(--b0)]">
              <div className="flex items-center gap-[7px] text-[11.5px] font-medium text-t2">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--v)]" />
                Trending in your niche
              </div>
            </div>
            <div className="p-[14px_16px]">
              <p className="text-[12px] text-t3 leading-[1.6]">
                Connect your social accounts and set your niche to see trending topics here.
              </p>
            </div>
          </div>

          {/* Re-engage */}
          <div className="bg-s1 border border-[var(--b1)] rounded-[12px] overflow-hidden">
            <div className="flex items-center justify-between px-[16px] py-[14px] border-b border-[var(--b0)]">
              <div className="flex items-center gap-[7px] text-[11.5px] font-medium text-t2">
                <span className="w-[5px] h-[5px] rounded-full bg-[#2DD4BF]" />
                Contacts needing attention
              </div>
            </div>
            <div className="p-[14px_16px]">
              <p className="text-[12px] text-t3 leading-[1.6]">
                Add contacts to your CRM and Sable will tell you who needs a follow-up.
              </p>
            </div>
          </div>

          {/* Brief */}
          <div className="bg-s1 border border-[var(--b1)] rounded-[12px] overflow-hidden">
            <div className="flex items-center justify-between px-[16px] py-[14px] border-b border-[var(--b0)]">
              <div className="flex items-center gap-[7px] text-[11.5px] font-medium text-t2">
                <span className="w-[5px] h-[5px] rounded-full bg-[#F4845F]" />
                Today's brief
              </div>
            </div>
            <div className="p-[14px_16px]">
              <p className="text-[12px] text-t3 leading-[1.6]">
                Subscribe to podcasts in the Audio section to get your daily brief here.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}