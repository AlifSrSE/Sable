import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const CLIENT_ID = process.env.PINTEREST_APP_ID!
const REDIRECT  = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/pinterest/callback'
const SCOPES    = ['boards:read','pins:read','pins:write'].join(',')

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // PKCE
  const verifier  = crypto.randomBytes(32).toString('base64url')
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')
  const state     = Buffer.from(JSON.stringify({ userId, verifier, ts: Date.now() })).toString('base64url')

  const params = new URLSearchParams({
    client_id: CLIENT_ID, redirect_uri: REDIRECT,
    response_type: 'code', scope: SCOPES, state,
    code_challenge: challenge, code_challenge_method: 'S256',
  })

  const res = NextResponse.redirect(`https://www.pinterest.com/oauth/?${params}`)
  res.cookies.set('pt_pkce', state, { httpOnly: true, maxAge: 600, path: '/' })
  return res
}
