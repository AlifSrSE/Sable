import { router } from '@/server/trpc/trpc'
import { postsRouter }          from './posts'
import { contactsRouter }       from './contacts'
import { podcastsRouter }       from './podcasts'
import { socialAccountsRouter } from './socialAccounts'
import { usersRouter }          from './users'
import { notificationsRouter }  from './notifications'

export const appRouter = router({
  posts:          postsRouter,
  contacts:       contactsRouter,
  podcasts:       podcastsRouter,
  socialAccounts: socialAccountsRouter,
  users:          usersRouter,
  notifications:  notificationsRouter,
})

export type AppRouter = typeof appRouter
