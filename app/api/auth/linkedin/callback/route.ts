import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const LINKEDIN_CLIENT_ID     = process.env.LINKEDIN_CLIENT_ID!
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET!
const LINKEDIN_REDIRECT      = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/linkedin/callback'
const APP_URL                = process.env.NEXT_PUBLIC_APP_URL!

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code  = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !state) {
    return NextResponse.redirect(`${APP_URL}/connections?error=linkedin_denied`)
  }

  let userId: string
  try {
    userId = JSON.parse(Buffer.from(state, 'base64url').toString()).userId
  } catch {
    return NextResponse.redirect(`${APP_URL}/connections?error=invalid_state`)
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'authorization_code',
      code,
      redirect_uri:  LINKEDIN_REDIRECT,
      client_id:     LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${APP_URL}/connections?error=linkedin_token`)
  }

  const tokens = await tokenRes.json() as {
    access_token: string; expires_in: number; refresh_token?: string
  }

  // Fetch profile
  const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  const profile = await profileRes.json() as {
    sub: string; name: string; email?: string; picture?: string
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)

  await prisma.socialAccount.upsert({
    where: {
      userId_platform: { userId, platform: 'linkedin' },
    },
    update: {
      accessToken:    tokens.access_token,
      refreshToken:   tokens.refresh_token ?? null,
      tokenExpiresAt: expiresAt,
      displayName:    profile.name,
      handle:         profile.email ?? profile.sub,
      avatarUrl:      profile.picture ?? null,
      isActive:       true,
      lastSyncedAt:   new Date(),
    },
    create: {
      userId,
      platform:       'linkedin',
      platformUserId: profile.sub,
      handle:         profile.email ?? profile.sub,
      displayName:    profile.name,
      avatarUrl:      profile.picture ?? null,
      accessToken:    tokens.access_token,
      refreshToken:   tokens.refresh_token ?? null,
      tokenExpiresAt: expiresAt,
      scopes:         ['openid', 'profile', 'w_member_social', 'r_basicprofile'],
      isActive:       true,
    },
  })

  return NextResponse.redirect(`${APP_URL}/connections?connected=linkedin`)
}
