import { z } from 'zod'
import { router, authedProc } from '../trpc/trpc'

export const notificationsRouter = router({

  list: authedProc
    .input(z.object({
      limit:      z.number().min(1).max(50).default(20),
      unreadOnly: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const notifications = await ctx.prisma.notification.findMany({
        where: {
          userId: ctx.userId,
          ...(input.unreadOnly && { readAt: null }),
        },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
      })
      const unreadCount = await ctx.prisma.notification.count({
        where: { userId: ctx.userId, readAt: null },
      })
      return { notifications, unreadCount }
    }),

  markRead: authedProc
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.notification.updateMany({
        where: { id: input.id, userId: ctx.userId },
        data:  { readAt: new Date() },
      })
      return { ok: true }
    }),

  markAllRead: authedProc
    .mutation(async ({ ctx }) => {
      await ctx.prisma.notification.updateMany({
        where: { userId: ctx.userId, readAt: null },
        data:  { readAt: new Date() },
      })
      return { ok: true }
    }),
})
