import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CLIENT_ID     = process.env.FACEBOOK_APP_ID!
const CLIENT_SECRET = process.env.FACEBOOK_APP_SECRET!
const REDIRECT      = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/facebook/callback'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.redirect(new URL('/sign-in', req.url))

  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')
  if (error || !code) {
    return NextResponse.redirect(new URL('/connections?error=facebook_denied', req.url))
  }

  const tokenRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?` +
    new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, redirect_uri: REDIRECT, code }).toString()
  )
  if (!tokenRes.ok) return NextResponse.redirect(new URL('/connections?error=token_exchange_failed', req.url))
  const { access_token, expires_in } = await tokenRes.json() as { access_token: string; expires_in?: number }

  // Get the first Page managed by this user
  const meRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${access_token}`)
  const meData = meRes.ok ? await meRes.json() as { data?: { id: string; name: string; access_token: string }[] } : { data: [] }
  const page = meData.data?.[0]

  await prisma.socialAccount.upsert({
    where: { userId_platform: { userId, platform: 'facebook' } },
    create: {
      userId, platform: 'facebook',
      accessToken: page?.access_token ?? access_token,
      platformUserId: page?.id ?? 'me',
      handle: page?.id ?? 'facebook',
      displayName: page?.name ?? 'Facebook Page',
      tokenExpiresAt: expires_in ? new Date(Date.now() + expires_in * 1000) : null,
      isActive: true,
    },
    update: {
      accessToken: page?.access_token ?? access_token,
      platformUserId: page?.id ?? 'me',
      handle: page?.id ?? 'facebook',
      tokenExpiresAt: expires_in ? new Date(Date.now() + expires_in * 1000) : null,
      isActive: true,
    },
  })

  return NextResponse.redirect(new URL('/connections?connected=facebook', req.url))
}
