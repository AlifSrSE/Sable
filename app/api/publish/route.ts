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
        } else {
          // instagram, tiktok, facebook, pinterest — not yet implemented
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
