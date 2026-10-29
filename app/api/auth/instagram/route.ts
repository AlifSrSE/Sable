import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Instagram uses Facebook's OAuth — same app, different scopes
const CLIENT_ID  = process.env.INSTAGRAM_APP_ID ?? process.env.FACEBOOK_APP_ID!
const REDIRECT   = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/instagram/callback'
const SCOPES     = ['instagram_basic','instagram_content_publish','pages_show_list','pages_read_engagement'].join(',')

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const state = Buffer.from(JSON.stringify({ userId, ts: Date.now() })).toString('base64url')

  const params = new URLSearchParams({
    client_id:     CLIENT_ID,
    redirect_uri:  REDIRECT,
    scope:         SCOPES,
    response_type: 'code',
    state,
  })

  return NextResponse.redirect(`https://www.facebook.com/v19.0/dialog/oauth?${params}`)
}
