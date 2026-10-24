'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { SableMark } from '@/components/ui/SableMark'

const NAV = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Calendar',  href: '/calendar' },
      { label: 'Analytics', href: '/analytics' },
    ],
  },
  {
    label: 'Pillars',
    items: [
      { label: 'Social', href: '/social',  badge: '3',   badgeColor: 'text-[var(--v)] bg-[var(--vd)]' },
      { label: 'CRM',    href: '/crm',     badge: '!',   badgeColor: 'text-[#F4845F] bg-[rgba(244,132,95,0.12)]' },
      { label: 'Audio',  href: '/audio',   badge: '7',   badgeColor: 'text-[#2DD4BF] bg-[rgba(45,212,191,0.10)]' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Connections', href: '/connections' },
      { label: 'Settings',    href: '/settings' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="
      flex flex-col h-screen w-[216px] flex-shrink-0
      bg-s1 border-r border-[var(--b1)]
    ">
      {/* Brand */}
      <div className="flex items-center gap-[10px] h-[52px] px-[18px] border-b border-[var(--b1)] flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-[10px]">
          <SableMark size={26} />
          <span className="font-serif text-[15px] text-t1 tracking-[-0.03em]">
            sable
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-[20px] px-[10px] flex flex-col gap-[24px]">
        {NAV.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-medium tracking-[0.07em] uppercase text-t3 px-[8px] mb-[4px]">
              {group.label}
            </p>
            <ul>
              {group.items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center justify-between
                        px-[10px] py-[7px] rounded-[7px]
                        text-[13px] transition-all duration-[120ms]
                        relative
                        ${isActive
                          ? 'text-t1 bg-s2'
                          : 'text-t2 hover:text-t1 hover:bg-s2'
                        }
                      `}
                    >
                      {isActive && (
                        <span className="
                          absolute left-0 top-[6px] bottom-[6px]
                          w-[2px] bg-[var(--v)] rounded-r-[2px]
                        " />
                      )}
                      {item.label}
                      {'badge' in item && item.badge && (
                        <span className={`
                          text-[10px] font-medium px-[6px] py-[2px]
                          rounded-[4px] ${item.badgeColor}
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-[var(--b1)] p-[14px] flex items-center gap-[10px] flex-shrink-0">
        <UserButton afterSignOutUrl="/" />
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-medium text-t1 truncate">My Account</p>
          <p className="text-[11px] text-t3">Growth plan</p>
        </div>
      </div>
    </aside>
  )
}