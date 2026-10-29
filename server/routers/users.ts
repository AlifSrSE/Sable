import { z } from 'zod'
import { router, authedProc } from '@/server/trpc/trpc'
import { TRPCError } from '@trpc/server'

export const usersRouter = router({

  // Get current user profile
  me: authedProc.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: {
        id: true, email: true, name: true, avatarUrl: true,
        timezone: true, niche: true, voiceProfile: true, voiceConfidence: true,
      },
    })
    if (!user) throw new TRPCError({ code: 'NOT_FOUND' })
    return user
  }),

  // Update profile fields
  updateProfile: authedProc
    .input(z.object({
      name:     z.string().min(1).max(120).optional(),
      handle:   z.string().max(60).optional(),   // stored in niche as handle for now
      bio:      z.string().max(300).optional(),   // stored in voiceProfile.bio
      timezone: z.string().max(80).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.user.findUnique({ where: { id: ctx.userId } })
      if (!existing) throw new TRPCError({ code: 'NOT_FOUND' })

      const currentVoice = (existing.voiceProfile as Record<string,unknown>) ?? {}

      return ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: {
          ...(input.name     !== undefined && { name: input.name }),
          ...(input.timezone !== undefined && { timezone: input.timezone }),
          ...(input.handle   !== undefined && { niche: input.handle }),
          ...(input.bio !== undefined && {
            voiceProfile: { ...currentVoice, bio: input.bio },
          }),
        },
        select: { id: true, name: true, timezone: true, niche: true, voiceProfile: true },
      })
    }),

  // Save AI voice calibration settings
  updateVoice: authedProc
    .input(z.object({
      tone:         z.number().min(0).max(100).optional(),
      density:      z.number().min(0).max(100).optional(),
      controversy:  z.number().min(0).max(100).optional(),
      storytelling: z.number().min(0).max(100).optional(),
      dataDepth:    z.number().min(0).max(100).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.user.findUnique({ where: { id: ctx.userId } })
      if (!existing) throw new TRPCError({ code: 'NOT_FOUND' })

      const currentVoice = (existing.voiceProfile as Record<string,unknown>) ?? {}
      const merged = { ...currentVoice, calibration: { ...((currentVoice.calibration as object) ?? {}), ...input } }

      return ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: { voiceProfile: merged },
        select: { id: true, voiceProfile: true, voiceConfidence: true },
      })
    }),

})
