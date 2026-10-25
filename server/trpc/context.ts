import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const { userId } = await auth()
  return { prisma, userId }
}

export type Context = Awaited<ReturnType<typeof createContext>>