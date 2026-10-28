import { z } from 'zod'
import { router, authedProc } from '@/server/trpc/trpc'
import { TRPCError } from '@trpc/server'

export const contactsRouter = router({

  // List contacts
  list: authedProc
    .input(z.object({
      search: z.string().optional(),
      limit:  z.number().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const contacts = await ctx.prisma.contact.findMany({
        where: {
          userId:    ctx.userId,
          deletedAt: null,
          ...(input.search && {
            OR: [
              { name:    { contains: input.search, mode: 'insensitive' } },
              { email:   { contains: input.search, mode: 'insensitive' } },
              { company: { contains: input.search, mode: 'insensitive' } },
            ],
          }),
        },
        orderBy: { lastContactedAt: 'asc' },
        take: input.limit + 1,
        ...(input.cursor && { cursor: { id: input.cursor }, skip: 1 }),
      })

      let nextCursor: string | undefined
      if (contacts.length > input.limit) {
        nextCursor = contacts.pop()!.id
      }

      return { contacts, nextCursor }
    }),

  // Get single contact
  byId: authedProc
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const contact = await ctx.prisma.contact.findFirst({
        where: { id: input.id, userId: ctx.userId, deletedAt: null },
        include: {
          interactions: {
            orderBy: { occurredAt: 'desc' },
            take: 20,
          },
          deals: {
            where: { status: 'open' },
          },
        },
      })
      if (!contact) throw new TRPCError({ code: 'NOT_FOUND' })
      return contact
    }),

  // Create contact
  create: authedProc
    .input(z.object({
      name:    z.string().min(1).max(200),
      email:   z.string().email().optional(),
      company: z.string().optional(),
      role:    z.string().optional(),
      phone:   z.string().optional(),
      notes:   z.string().optional(),
      tags:    z.array(z.string()).default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      const contact = await ctx.prisma.contact.create({
        data: {
          userId:          ctx.userId,
          name:            input.name,
          email:           input.email,
          company:         input.company,
          role:            input.role,
          phone:           input.phone,
          notes:           input.notes,
          tags:            input.tags,
          lastContactedAt: new Date(),
        },
      })
      return contact
    }),

  // Update contact
  update: authedProc
    .input(z.object({
      id:      z.string(),
      name:    z.string().min(1).max(200).optional(),
      email:   z.string().email().optional(),
      company: z.string().optional(),
      role:    z.string().optional(),
      phone:   z.string().optional(),
      notes:   z.string().optional(),
      tags:    z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.contact.findFirst({
        where: { id: input.id, userId: ctx.userId, deletedAt: null },
      })
      if (!existing) throw new TRPCError({ code: 'NOT_FOUND' })

      const { id, ...data } = input
      return ctx.prisma.contact.update({ where: { id }, data })
    }),

  // Soft delete
  delete: authedProc
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.contact.findFirst({
        where: { id: input.id, userId: ctx.userId, deletedAt: null },
      })
      if (!existing) throw new TRPCError({ code: 'NOT_FOUND' })

      await ctx.prisma.contact.update({
        where: { id: input.id },
        data:  { deletedAt: new Date() },
      })
      return { success: true }
    }),

  // Log interaction
  logInteraction: authedProc
    .input(z.object({
      contactId: z.string(),
      type:      z.enum(['email','call','meeting','social_dm','note','post_engagement','linkedin_connection']),
      direction: z.enum(['inbound','outbound']).default('outbound'),
      subject:   z.string().optional(),
      body:      z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const contact = await ctx.prisma.contact.findFirst({
        where: { id: input.contactId, userId: ctx.userId, deletedAt: null },
      })
      if (!contact) throw new TRPCError({ code: 'NOT_FOUND' })

      const [interaction] = await ctx.prisma.$transaction([
        ctx.prisma.interaction.create({
          data: {
            contactId:  input.contactId,
            userId:     ctx.userId,
            type:       input.type,
            direction:  input.direction,
            subject:    input.subject,
            body:       input.body,
            occurredAt: new Date(),
          },
        }),
        ctx.prisma.contact.update({
          where: { id: input.contactId },
          data:  { lastContactedAt: new Date() },
        }),
      ])
      return interaction
    }),

  // Get contacts needing attention
  needsAttention: authedProc
    .query(async ({ ctx }) => {
      const threshold = new Date()
      threshold.setDate(threshold.getDate() - 14)

      return ctx.prisma.contact.findMany({
        where: {
          userId:    ctx.userId,
          deletedAt: null,
          OR: [
            { lastContactedAt: { lt: threshold } },
            { lastContactedAt: null },
          ],
        },
        orderBy: { lastContactedAt: 'asc' },
        take: 10,
      })
    }),

  // Import contacts from CSV
  importCsv: authedProc
    .input(z.object({
      // Raw CSV text — columns: name, email, company, role, linkedin, notes
      csv: z.string().min(1).max(500_000),
    }))
    .mutation(async ({ ctx, input }) => {
      const lines = input.csv.split(/\r?\n/).filter(Boolean)
      if (lines.length < 2) throw new TRPCError({ code: 'BAD_REQUEST', message: 'CSV must have a header row and at least one data row' })

      // Parse header — normalise column names
      const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, '_'))

      const col = (row: string[], key: string): string => {
        const idx = header.indexOf(key)
        return idx >= 0 ? (row[idx] ?? '').trim() : ''
      }

      const rows = lines.slice(1).map(line => {
        // Handle quoted fields
        const cells: string[] = []
        let cur = '', inQuote = false
        for (const ch of line + ',') {
          if (ch === '"') { inQuote = !inQuote }
          else if (ch === ',' && !inQuote) { cells.push(cur.trim()); cur = '' }
          else { cur += ch }
        }
        return cells
      })

      let created = 0, updated = 0, skipped = 0

      for (const row of rows) {
        const name = col(row, 'name') || col(row, 'full_name') || col(row, 'first_name')
        if (!name) { skipped++; continue }

        const data = {
          name,
          email:     col(row, 'email') || null,
          company:   col(row, 'company') || col(row, 'organization') || null,
          role:      col(row, 'role') || col(row, 'title') || col(row, 'job_title') || null,
          linkedin:  col(row, 'linkedin') || col(row, 'linkedin_url') || null,
          notes:     col(row, 'notes') || null,
        }

        // Upsert by email if present, otherwise by name+userId
        const existing = data.email
          ? await ctx.prisma.contact.findFirst({ where: { userId: ctx.userId, email: data.email, deletedAt: null } })
          : await ctx.prisma.contact.findFirst({ where: { userId: ctx.userId, name: data.name, deletedAt: null } })

        if (existing) {
          await ctx.prisma.contact.update({ where: { id: existing.id }, data })
          updated++
        } else {
          await ctx.prisma.contact.create({ data: { userId: ctx.userId, ...data } })
          created++
        }
      }

      return { created, updated, skipped, total: rows.length }
    }),

  // Stats
  stats: authedProc
    .query(async ({ ctx }) => {
      const threshold = new Date()
      threshold.setDate(threshold.getDate() - 14)

      const [total, needsAttention] = await Promise.all([
        ctx.prisma.contact.count({
          where: { userId: ctx.userId, deletedAt: null },
        }),
        ctx.prisma.contact.count({
          where: {
            userId:    ctx.userId,
            deletedAt: null,
            OR: [
              { lastContactedAt: { lt: threshold } },
              { lastContactedAt: null },
            ],
          },
        }),
      ])
      return { total, needsAttention }
    }),
})