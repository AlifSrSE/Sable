import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const LINKEDIN_CLIENT_ID  = process.env.LINKEDIN_CLIENT_ID!
const LINKEDIN_REDIRECT   = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/linkedin/callback'

const SCOPES = ['openid', 'profile', 'w_member_social', 'r_basicprofile'].join(' ')

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const state = Buffer.from(JSON.stringify({ userId, ts: Date.now() })).toString('base64url')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id:     LINKEDIN_CLIENT_ID,
    redirect_uri:  LINKEDIN_REDIRECT,
    state,
    scope:         SCOPES,
  })

  return NextResponse.redirect(
    `https://www.linkedin.com/oauth/v2/authorization?${params}`
  )
}
