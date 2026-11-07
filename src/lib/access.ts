import type { Access } from 'payload'

/** Logged-in editors see everything; the public only sees published docs. */
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
