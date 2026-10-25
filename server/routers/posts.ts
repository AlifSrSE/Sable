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
      // Check user exists
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
})