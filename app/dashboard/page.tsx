import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-[#0C0B14] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-light mb-4" style={{ fontFamily: 'serif' }}>
          Welcome to Sable
        </h1>
        <p className="text-[#8B88A8]">You're signed in. Dashboard coming next.</p>
      </div>
    </div>
  )
}