import { router } from '@/server/trpc/trpc'
import { postsRouter }          from './posts'
import { contactsRouter }       from './contacts'
import { podcastsRouter }       from './podcasts'
import { socialAccountsRouter } from './socialAccounts'

export const appRouter = router({
  posts:          postsRouter,
  contacts:       contactsRouter,
  podcasts:       podcastsRouter,
  socialAccounts: socialAccountsRouter,
})

export type AppRouter = typeof appRouter
