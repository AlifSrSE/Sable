import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CLIENT_ID     = process.env.PINTEREST_APP_ID!
const CLIENT_SECRET = process.env.PINTEREST_APP_SECRET!
const REDIRECT      = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/pinterest/callback'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.redirect(new URL('/sign-in', req.url))

  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  if (error || !code) return NextResponse.redirect(new URL('/connections?error=pinterest_denied', req.url))

  let verifier: string
  try {
    const parsed = JSON.parse(Buffer.from(state!, 'base64url').toString())
    if (parsed.userId !== userId) throw new Error('state mismatch')
    verifier = parsed.verifier
  } catch {
    return NextResponse.redirect(new URL('/connections?error=invalid_state', req.url))
  }

  const tokenRes = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code', code,
      redirect_uri: REDIRECT, code_verifier: verifier,
    }).toString(),
  })

  if (!tokenRes.ok) return NextResponse.redirect(new URL('/connections?error=token_exchange_failed', req.url))
  const { access_token, expires_in } = await tokenRes.json() as { access_token: string; expires_in?: number }

  // Get user info
  const meRes = await fetch('https://api.pinterest.com/v5/user_account', {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  const me = meRes.ok ? await meRes.json() as { username?: string } : {}

  await prisma.socialAccount.upsert({
    where: { userId_platform: { userId, platform: 'pinterest' } },
    create: {
      userId, platform: 'pinterest',
      accessToken: access_token,
      platformUserId: me.username ?? userId,
      handle: me.username ?? 'pinterest',
      displayName: me.username ? `@${me.username}` : 'Pinterest',
      tokenExpiresAt: expires_in ? new Date(Date.now() + expires_in * 1000) : null,
      isActive: true,
    },
    update: {
      accessToken: access_token,
      platformUserId: me.username ?? userId,
      handle: me.username ?? 'pinterest',
      tokenExpiresAt: expires_in ? new Date(Date.now() + expires_in * 1000) : null,
      isActive: true,
    },
  })

  return NextResponse.redirect(new URL('/connections?connected=pinterest', req.url))
}
