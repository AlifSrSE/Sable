import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CLIENT_ID     = process.env.TWITTER_CLIENT_ID!
const CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!
const REDIRECT_URI  = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/twitter/callback'
const APP_URL       = process.env.NEXT_PUBLIC_APP_URL!

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code  = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !state) {
    return NextResponse.redirect(`${APP_URL}/connections?error=twitter_denied`)
  }

  let userId: string, verifier: string
  try {
    const parsed = JSON.parse(Buffer.from(state, 'base64url').toString())
    userId   = parsed.userId
    verifier = parsed.verifier
  } catch {
    return NextResponse.redirect(`${APP_URL}/connections?error=invalid_state`)
  }

  // Exchange code for tokens
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:  `Basic ${basic}`,
    },
    body: new URLSearchParams({
      code,
      grant_type:    'authorization_code',
      redirect_uri:  REDIRECT_URI,
      code_verifier: verifier,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${APP_URL}/connections?error=twitter_token`)
  }

  const tokens = await tokenRes.json() as {
    access_token: string; refresh_token?: string; expires_in?: number
  }

  // Fetch user profile
  const meRes = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,public_metrics', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  const me = await meRes.json() as {
    data: { id: string; name: string; username: string; profile_image_url?: string; public_metrics?: { followers_count: number } }
  }

  const expiresAt = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000)
    : null

  await prisma.socialAccount.upsert({
    where: { userId_platform: { userId, platform: 'twitter' } },
    update: {
      accessToken:    tokens.access_token,
      refreshToken:   tokens.refresh_token ?? null,
      tokenExpiresAt: expiresAt,
      displayName:    me.data.name,
      handle:         `@${me.data.username}`,
      avatarUrl:      me.data.profile_image_url ?? null,
      followerCount:  me.data.public_metrics?.followers_count ?? 0,
      isActive:       true,
      lastSyncedAt:   new Date(),
    },
    create: {
      userId,
      platform:       'twitter',
      platformUserId: me.data.id,
      handle:         `@${me.data.username}`,
      displayName:    me.data.name,
      avatarUrl:      me.data.profile_image_url ?? null,
      accessToken:    tokens.access_token,
      refreshToken:   tokens.refresh_token ?? null,
      tokenExpiresAt: expiresAt,
      followerCount:  me.data.public_metrics?.followers_count ?? 0,
      scopes:         ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
      isActive:       true,
    },
  })

  const res = NextResponse.redirect(`${APP_URL}/connections?connected=twitter`)
  res.cookies.delete('tw_pkce')
  return res
}
