import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="p-[32px]">
      <h1 className="font-serif text-[2rem] text-t1 tracking-[-0.04em] leading-[1.1] mb-[6px]">
        Good morning
      </h1>
      <p className="text-[13px] text-t3">
        Dashboard is loading — more coming next.
      </p>
    </div>
  )
}