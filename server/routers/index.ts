import { router } from '@/server/trpc/trpc'
import { postsRouter }    from './posts'
import { contactsRouter } from './contacts'
import { podcastsRouter } from './podcasts'

export const appRouter = router({
  posts:    postsRouter,
  contacts: contactsRouter,
  podcasts: podcastsRouter,
})

export type AppRouter = typeof appRouter
