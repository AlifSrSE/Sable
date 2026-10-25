import { router } from '@/server/trpc/trpc'
import { postsRouter }    from './posts'
import { contactsRouter } from './contacts'

export const appRouter = router({
  posts:    postsRouter,
  contacts: contactsRouter,
})

export type AppRouter = typeof appRouter
