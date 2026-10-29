import { z } from 'zod'
import { router, authedProc } from '@/server/trpc/trpc'
import { TRPCError } from '@trpc/server'

export const postsRouter = router({

  // Get all posts for current user
  list: authedProc
    .input(z.object({
      status: z.enum(['draft','scheduled','published','failed']).optional(),
      limit:  z.number().min(1).max(50).default(20),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.contentPost.findMany({
        where: {
          userId: ctx.userId,
          ...(input.status && { status: input.status }),
        },
        orderBy: { scheduledAt: 'asc' },
        take: input.limit + 1,
        ...(input.cursor && { cursor: { id: input.cursor }, skip: 1 }),
      })

      let nextCursor: string | undefined
      if (posts.length > input.limit) {
        nextCursor = posts.pop()!.id
      }

      return { posts, nextCursor }
    }),

  // Get posts for a specific month (for calendar view)
  byMonth: authedProc
    .input(z.object({
      year:  z.number().int().min(2020).max(2100),
      month: z.number().int().min(1).max(12),
    }))
    .query(async ({ ctx, input }) => {
      const start = new Date(input.year, input.month - 1, 1)
      const end   = new Date(input.year, input.month, 1)

      const [scheduled, drafts] = await Promise.all([
        ctx.prisma.contentPost.findMany({
          where: {
            userId: ctx.userId,
            scheduledAt: { gte: start, lt: end },
          },
          orderBy: { scheduledAt: 'asc' },
        }),
        ctx.prisma.contentPost.findMany({
          where: {
            userId: ctx.userId,
            status: 'draft',
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ])

      return { scheduled, drafts }
    }),

  // Platform breakdown for analytics
  platformStats: authedProc
    .query(async ({ ctx }) => {
      const posts = await ctx.prisma.contentPost.findMany({
        where: { userId: ctx.userId, status: 'published' },
        select: { platforms: true },
      })

      const counts: Record<string, number> = {}
      for (const post of posts) {
        for (const p of post.platforms) {
          counts[p] = (counts[p] ?? 0) + 1
        }
      }

      return counts
    }),

  // Get single post
  byId: authedProc
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.contentPost.findFirst({
        where: { id: input.id, userId: ctx.userId },
      })
      if (!post) throw new TRPCError({ code: 'NOT_FOUND' })
      return post
    }),

  // Create post
  create: authedProc
    .input(z.object({
      body:        z.string().min(1).max(3000),
      platforms:   z.array(z.enum(['instagram','linkedin','twitter','tiktok','facebook','pinterest'])),
      scheduledAt: z.date().optional(),
      aiGenerated: z.boolean().default(false),
      aiPrompt:    z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      })
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

      const post = await ctx.prisma.contentPost.create({
        data: {
          userId:      ctx.userId,
          body:        input.body,
          platforms:   input.platforms,
          scheduledAt: input.scheduledAt,
          status:      input.scheduledAt ? 'scheduled' : 'draft',
          aiGenerated: input.aiGenerated,
          aiPrompt:    input.aiPrompt,
        },
      })
      return post
    }),

  // Update post
  update: authedProc
    .input(z.object({
      id:          z.string(),
      body:        z.string().min(1).max(3000).optional(),
      platforms:   z.array(z.enum(['instagram','linkedin','twitter','tiktok','facebook','pinterest'])).optional(),
      scheduledAt: z.date().optional().nullable(),
      status:      z.enum(['draft','scheduled','canceled']).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.contentPost.findFirst({
        where: { id: input.id, userId: ctx.userId },
      })
      if (!existing) throw new TRPCError({ code: 'NOT_FOUND' })

      const { id, ...data } = input
      return ctx.prisma.contentPost.update({
        where: { id },
        data: {
          ...data,
          status: data.scheduledAt ? 'scheduled' : data.status ?? existing.status,
        },
      })
    }),

  // Delete post
  delete: authedProc
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.contentPost.findFirst({
        where: { id: input.id, userId: ctx.userId },
      })
      if (!existing) throw new TRPCError({ code: 'NOT_FOUND' })

      await ctx.prisma.contentPost.delete({ where: { id: input.id } })
      return { success: true }
    }),

  // Get dashboard stats
  stats: authedProc
    .query(async ({ ctx }) => {
      const [totalPosts, scheduledPosts, publishedPosts, draftPosts] = await Promise.all([
        ctx.prisma.contentPost.count({ where: { userId: ctx.userId } }),
        ctx.prisma.contentPost.count({ where: { userId: ctx.userId, status: 'scheduled' } }),
        ctx.prisma.contentPost.count({ where: { userId: ctx.userId, status: 'published' } }),
        ctx.prisma.contentPost.count({ where: { userId: ctx.userId, status: 'draft' } }),
      ])
      return { totalPosts, scheduledPosts, publishedPosts, draftPosts }
    }),
  // Weekly published counts for the last 8 weeks (for analytics chart)
  weeklyStats: authedProc.query(async ({ ctx }) => {
    const now = new Date()
    // Monday of current week
    const dow = now.getDay() === 0 ? 7 : now.getDay()
    const thisMonday = new Date(now)
    thisMonday.setDate(now.getDate() - dow + 1)
    thisMonday.setHours(0, 0, 0, 0)

    const weeks: { label: string; start: Date; end: Date }[] = []
    for (let i = 7; i >= 0; i--) {
      const start = new Date(thisMonday)
      start.setDate(thisMonday.getDate() - i * 7)
      const end = new Date(start)
      end.setDate(start.getDate() + 7)
      const label = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      weeks.push({ label, start, end })
    }

    const counts = await Promise.all(
      weeks.map(w =>
        ctx.prisma.contentPost.count({
          where: { userId: ctx.userId, status: 'published', publishedAt: { gte: w.start, lt: w.end } },
        })
      )
    )

    const byPlatform = await ctx.prisma.contentPost.findMany({
      where: { userId: ctx.userId, status: 'published' },
      select: { platforms: true, publishedAt: true },
    })

    // Per-week platform breakdown (linkedin / twitter / other)
    const breakdown = weeks.map((w, i) => {
      const postsInWeek = byPlatform.filter(p => p.publishedAt && p.publishedAt >= w.start && p.publishedAt < w.end)
      const li = postsInWeek.filter(p => p.platforms.includes('linkedin')).length
      const x  = postsInWeek.filter(p => p.platforms.includes('twitter') || p.platforms.includes('twitter')).length
      const other = counts[i] - Math.min(li + x, counts[i])
      return { label: w.label, total: counts[i], li, x, other }
    })

    return breakdown
  }),

  // Per-day post count for this week (for dashboard week bars)
  thisWeek: authedProc.query(async ({ ctx }) => {
    const now = new Date()
    const dow = now.getDay() === 0 ? 7 : now.getDay()
    const monday = new Date(now)
    monday.setDate(now.getDate() - dow + 1)
    monday.setHours(0, 0, 0, 0)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 7)

    const posts = await ctx.prisma.contentPost.findMany({
      where: { userId: ctx.userId, scheduledAt: { gte: monday, lt: sunday } },
      select: { scheduledAt: true, status: true },
    })

    const days = ['MON','TUE','WED','THU','FRI','SAT','SUN']
    const todayDow = now.getDay() === 0 ? 6 : now.getDay() - 1 // 0=Mon

    return days.map((day, i) => {
      const dayPosts = posts.filter(p => {
        if (!p.scheduledAt) return false
        const d = new Date(p.scheduledAt)
        const postDow = d.getDay() === 0 ? 6 : d.getDay() - 1
        return postDow === i
      })
      return { day, count: dayPosts.length, isToday: i === todayDow }
    })
  }),

})
