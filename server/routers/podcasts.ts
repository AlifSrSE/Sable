import { z } from 'zod'
import { router, authedProc } from '../trpc/trpc'

export const podcastsRouter = router({
  list: authedProc.query(async ({ ctx }) => {
    const subscriptions = await ctx.prisma.podcastSubscription.findMany({
      where: { userId: ctx.userId },
      orderBy: { createdAt: 'desc' },
    })
    return { subscriptions }
  }),

  subscribe: authedProc
    .input(z.object({ feedUrl: z.string().url(), title: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.podcastSubscription.findFirst({
        where: { userId: ctx.userId, feedUrl: input.feedUrl },
      })
      if (existing) return { subscription: existing }

      const subscription = await ctx.prisma.podcastSubscription.create({
        data: {
          userId:  ctx.userId,
          feedUrl: input.feedUrl,
          title: input.title ?? input.feedUrl,
        },
      })
      return { subscription }
    }),

  unsubscribe: authedProc
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.podcastSubscription.deleteMany({
        where: { id: input.id, userId: ctx.userId },
      })
      return { ok: true }
    }),
})
