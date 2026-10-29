import { router } from '@/server/trpc/trpc'
import { postsRouter }          from './posts'
import { contactsRouter }       from './contacts'
import { podcastsRouter }       from './podcasts'
import { socialAccountsRouter } from './socialAccounts'
import { usersRouter }          from './users'

export const appRouter = router({
  posts:          postsRouter,
  contacts:       contactsRouter,
  podcasts:       podcastsRouter,
  socialAccounts: socialAccountsRouter,
  users:          usersRouter,
})

export type AppRouter = typeof appRouter
