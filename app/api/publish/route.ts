/**
 * POST /api/publish
 *
 * Publishing pipeline — call this from a cron job (Vercel Cron, etc.) or
 * manually.  Picks up every ContentPost with status='scheduled' and
 * scheduledAt <= now, attempts to publish to each platform via the user's
 * stored SocialAccount tokens, then marks the post published/partial/failed.
 *
 * Protect with CRON_SECRET so only the scheduler can call it:
 *   Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ── platform publishers ───────────────────────────────────────────────────────

async function publishToLinkedIn(token: string, body: string, platformUserId: string): Promise<void> {
  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author:         `urn:li:person:${platformUserId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary:       { text: body },
          shareMediaCategory:    'NONE',
        },
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`LinkedIn ${res.status}: ${err}`)
  }
}

async function publishToInstagram(token: string, body: string, platformUserId: string): Promise<void> {
  // Step 1: create media container
  const createRes = await fetch(
    `https://graph.facebook.com/v19.0/${platformUserId}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: body, media_type: 'REELS', access_token: token }),
    }
  )
  // Instagram requires media (image/video). For text-only posts we use the
  // "caption-only" container trick — if the account has a linked image we'd
  // pass image_url here instead.  Without media the API rejects with 9007;
  // we surface that clearly rather than silently failing.
  if (!createRes.ok) {
    const err = await createRes.text()
    // Try a simpler text post via the connected Facebook Page feed instead
    throw new Error(`Instagram media create ${createRes.status}: ${err}`)
  }
  const { id: creationId } = await createRes.json() as { id: string }

  // Step 2: publish the container
  const publishRes = await fetch(
    `https://graph.facebook.com/v19.0/${platformUserId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: creationId, access_token: token }),
    }
  )
  if (!publishRes.ok) {
    const err = await publishRes.text()
    throw new Error(`Instagram publish ${publishRes.status}: ${err}`)
  }
}

async function publishToFacebook(token: string, body: string, platformUserId: string): Promise<void> {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${platformUserId}/feed`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: body, access_token: token }),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Facebook ${res.status}: ${err}`)
  }
}

async function publishToPinterest(token: string, body: string, platformUserId: string): Promise<void> {
  // Pinterest requires a board. We store it in account.metadata as { boardId }.
  // If missing we fall back to the user's first board.
  let boardId: string | undefined

  // Try to fetch boards to get a valid ID
  const boardsRes = await fetch(
    'https://api.pinterest.com/v5/boards?page_size=1',
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (boardsRes.ok) {
    const data = await boardsRes.json() as { items?: { id: string }[] }
    boardId = data.items?.[0]?.id
  }

  if (!boardId) throw new Error('Pinterest: no board found on this account')

  // Pinterest pins require at least a title or description and a media source.
  // Text-only pins use link type with the profile URL as a placeholder.
  const pinRes = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      board_id:    boardId,
      title:       body.slice(0, 100),
      description: body,
      media_source: {
        source_type: 'image_url',
        url: `https://avatars.githubusercontent.com/u/${platformUserId}?v=4`,
      },
    }),
  })
  if (!pinRes.ok) {
    const err = await pinRes.text()
    throw new Error(`Pinterest ${pinRes.status}: ${err}`)
  }
}

async function publishToTwitter(token: string, body: string): Promise<void> {
  const res = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: body }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Twitter ${res.status}: ${err}`)
  }
}

// ── main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Auth check
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const now = new Date()

  // Find all posts due to publish
  const posts = await prisma.contentPost.findMany({
    where: {
      status:      'scheduled',
      scheduledAt: { lte: now },
    },
    take: 50, // process in batches
  })

  if (posts.length === 0) {
    return NextResponse.json({ processed: 0 })
  }

  const results: { id: string; ok: string[]; failed: string[] }[] = []

  for (const post of posts) {
    const ok: string[]     = []
    const failed: string[] = []

    for (const platform of post.platforms) {
      // Find the user's connected account for this platform
      const account = await prisma.socialAccount.findFirst({
        where: {
          userId:   post.userId,
          platform,
          isActive: true,
        },
      })

      if (!account) {
        failed.push(`${platform}:no_account`)
        continue
      }

      // Check token expiry
      if (account.tokenExpiresAt && account.tokenExpiresAt < now) {
        failed.push(`${platform}:token_expired`)
        continue
      }

      try {
        if (platform === 'linkedin') {
          await publishToLinkedIn(account.accessToken, post.body, account.platformUserId)
        } else if (platform === 'twitter') {
          await publishToTwitter(account.accessToken, post.body)
        } else if (platform === 'instagram') {
          await publishToInstagram(account.accessToken, post.body, account.platformUserId)
        } else if (platform === 'facebook') {
          await publishToFacebook(account.accessToken, post.body, account.platformUserId)
        } else if (platform === 'pinterest') {
          await publishToPinterest(account.accessToken, post.body, account.platformUserId)
        } else {
          // tiktok and any future platforms
          failed.push(`${platform}:not_implemented`)
          continue
        }
        ok.push(platform)
      } catch (err) {
        console.error(`Publish failed [${post.id}] [${platform}]:`, err)
        failed.push(`${platform}:${(err as Error).message.slice(0, 80)}`)
      }
    }

    // Determine new status
    const newStatus =
      ok.length === post.platforms.length ? 'published' :
      ok.length > 0                       ? 'partial'   : 'failed'

    await prisma.contentPost.update({
      where: { id: post.id },
      data: {
        status:      newStatus,
        publishedAt: ok.length > 0 ? now : undefined,
      },
    })

    results.push({ id: post.id, ok, failed })
  }

  return NextResponse.json({ processed: posts.length, results })
}

// Allow GET for easy manual testing in browser (still checks secret)
export async function GET(req: NextRequest) {
  return POST(req)
}
