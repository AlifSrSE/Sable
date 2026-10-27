import { z } from 'zod'
import { router, authedProc } from '../trpc/trpc'

// ── RSS helpers ───────────────────────────────────────────────────────────────

async function fetchRss(feedUrl: string): Promise<{
  title: string
  description: string
  author: string
  coverUrl: string
  items: {
    guid: string
    title: string
    description: string
    audioUrl: string
    durationSeconds: number
    publishedAt: Date
  }[]
}> {
  const res = await fetch(feedUrl, {
    headers: { 'User-Agent': 'Sable/1.0 Podcast Reader' },
  })
  if (!res.ok) throw new Error(`Failed to fetch RSS: ${res.status}`)
  const xml = await res.text()

  const get = (tag: string, src: string) =>
    src.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1]?.trim() ?? ''

  const getAttr = (tag: string, attr: string, src: string) =>
    src.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`))?.[1] ?? ''

  // Parse items
  const itemBlocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1])

  const items = itemBlocks.map(block => {
    const audioUrl = getAttr('enclosure', 'url', block)
    const durationRaw = get('itunes:duration', block)
    const durationSeconds = durationRaw.includes(':')
      ? durationRaw.split(':').reduce((acc, v, i, a) =>
          acc + parseInt(v) * Math.pow(60, a.length - 1 - i), 0)
      : parseInt(durationRaw) || 0

    return {
      guid:            get('guid', block) || audioUrl,
      title:           get('title', block).replace(/<!\[CDATA\[|\]\]>/g, ''),
      description:     get('description', block).replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').slice(0, 1000),
      audioUrl,
      durationSeconds,
      publishedAt:     new Date(get('pubDate', block) || Date.now()),
    }
  }).filter(i => i.audioUrl)

  return {
    title:       get('title', xml).replace(/<!\[CDATA\[|\]\]>/g, ''),
    description: get('description', xml).replace(/<!\[CDATA\[|\]\]>/g, '').slice(0, 500),
    author:      get('itunes:author', xml),
    coverUrl:    getAttr('itunes:image', 'href', xml),
    items,
  }
}

// ── router ────────────────────────────────────────────────────────────────────

export const podcastsRouter = router({

  list: authedProc.query(async ({ ctx }) => {
    const subscriptions = await ctx.prisma.podcastSubscription.findMany({
      where:   { userId: ctx.userId, isActive: true },
      include: { items: { orderBy: { publishedAt: 'desc' }, take: 5 } },
      orderBy: { createdAt: 'desc' },
    })
    return { subscriptions }
  }),

  episodes: authedProc
    .input(z.object({
      subscriptionId: z.string().optional(),
      limit:  z.number().min(1).max(50).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.prisma.audioItem.findMany({
        where: {
          subscription: { userId: ctx.userId },
          ...(input.subscriptionId && { subscriptionId: input.subscriptionId }),
        },
        orderBy: { publishedAt: 'desc' },
        take: input.limit,
      })
      return { items }
    }),

  subscribe: authedProc
    .input(z.object({ feedUrl: z.string().url(), title: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.podcastSubscription.findFirst({
        where: { userId: ctx.userId, feedUrl: input.feedUrl },
      })
      if (existing) return { subscription: existing, isNew: false }

      // Fetch feed metadata + initial episodes
      let feedData: Awaited<ReturnType<typeof fetchRss>> | null = null
      try {
        feedData = await fetchRss(input.feedUrl)
      } catch {
        // Proceed without feed data; background job can retry later
      }

      const subscription = await ctx.prisma.podcastSubscription.create({
        data: {
          userId:      ctx.userId,
          feedUrl:     input.feedUrl,
          title:       feedData?.title || input.title || input.feedUrl,
          description: feedData?.description,
          coverUrl:    feedData?.coverUrl,
          author:      feedData?.author,
          lastCheckedAt: new Date(),
        },
      })

      // Save the latest 10 episodes
      if (feedData?.items?.length) {
        await ctx.prisma.audioItem.createMany({
          data: feedData.items.slice(0, 10).map(ep => ({
            subscriptionId:  subscription.id,
            type:            'podcast_episode' as const,
            title:           ep.title,
            description:     ep.description,
            audioUrl:        ep.audioUrl,
            durationSeconds: ep.durationSeconds,
            publishedAt:     ep.publishedAt,
            processingStatus: 'pending' as const,
          })),
          skipDuplicates: true,
        })
      }

      return { subscription, isNew: true }
    }),

  unsubscribe: authedProc
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.podcastSubscription.updateMany({
        where: { id: input.id, userId: ctx.userId },
        data:  { isActive: false },
      })
      return { ok: true }
    }),
})
