import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const CLIENT_ID    = process.env.TWITTER_CLIENT_ID!
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/twitter/callback'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // PKCE
  const verifier  = crypto.randomBytes(32).toString('base64url')
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')
  const state     = Buffer.from(JSON.stringify({ userId, verifier, ts: Date.now() })).toString('base64url')

  const params = new URLSearchParams({
    response_type:         'code',
    client_id:             CLIENT_ID,
    redirect_uri:          REDIRECT_URI,
    scope:                 'tweet.read tweet.write users.read offline.access',
    state,
    code_challenge:        challenge,
    code_challenge_method: 'S256',
  })

  const res = NextResponse.redirect(`https://twitter.com/i/oauth2/authorize?${params}`)
  // Store verifier in cookie for callback
  res.cookies.set('tw_pkce', state, { httpOnly: true, maxAge: 600, path: '/' })
  return res
}
