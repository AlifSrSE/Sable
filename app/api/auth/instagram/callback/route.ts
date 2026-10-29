import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CLIENT_ID     = process.env.INSTAGRAM_APP_ID ?? process.env.FACEBOOK_APP_ID!
const CLIENT_SECRET = process.env.INSTAGRAM_APP_SECRET ?? process.env.FACEBOOK_APP_SECRET!
const REDIRECT      = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/instagram/callback'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.redirect(new URL('/sign-in', req.url))

  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/connections?error=instagram_denied', req.url))
  }

  // Verify state
  try {
    const parsed = JSON.parse(Buffer.from(state!, 'base64url').toString())
    if (parsed.userId !== userId) throw new Error('state mismatch')
  } catch {
    return NextResponse.redirect(new URL('/connections?error=invalid_state', req.url))
  }

  // Exchange code for user access token
  const tokenRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?` +
    new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, redirect_uri: REDIRECT, code }).toString()
  )
  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/connections?error=token_exchange_failed', req.url))
  }
  const { access_token, expires_in } = await tokenRes.json() as { access_token: string; expires_in?: number }

  // Get Instagram accounts linked to this Facebook token
  const igRes = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?fields=instagram_business_account,name&access_token=${access_token}`
  )
  const igData = igRes.ok ? await igRes.json() as { data?: { instagram_business_account?: { id: string }; name: string }[] } : { data: [] }
  const igAccount = igData.data?.find(p => p.instagram_business_account)
  const igId = igAccount?.instagram_business_account?.id ?? 'unknown'

  await prisma.socialAccount.upsert({
    where: { userId_platform: { userId, platform: 'instagram' } },
    create: {
      userId, platform: 'instagram',
      accessToken: access_token, platformUserId: igId,
      handle: igId,
      displayName: igAccount?.name ?? 'Instagram',
      tokenExpiresAt: expires_in ? new Date(Date.now() + expires_in * 1000) : null,
      isActive: true,
    },
    update: {
      accessToken: access_token, platformUserId: igId,
      tokenExpiresAt: expires_in ? new Date(Date.now() + expires_in * 1000) : null,
      isActive: true,
    },
  })

  return NextResponse.redirect(new URL('/connections?connected=instagram', req.url))
}
