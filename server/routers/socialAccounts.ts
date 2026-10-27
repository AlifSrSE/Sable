import { z } from 'zod'
import { router, authedProc } from '@/server/trpc/trpc'

export const socialAccountsRouter = router({

  list: authedProc.query(async ({ ctx }) => {
    const accounts = await ctx.prisma.socialAccount.findMany({
      where: { userId: ctx.userId, isActive: true },
      select: {
        id: true,
        platform: true,
        handle: true,
        displayName: true,
        avatarUrl: true,
        followerCount: true,
        scopes: true,
        lastSyncedAt: true,
        tokenExpiresAt: true,
      },
      orderBy: { platform: 'asc' },
    })
    return { accounts }
  }),

  disconnect: authedProc
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.socialAccount.updateMany({
        where: { id: input.id, userId: ctx.userId },
        data: { isActive: false },
      })
      return { ok: true }
    }),
})
