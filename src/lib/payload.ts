import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { PostDoc, ProfileDoc, ProjectDoc } from './types'

// Content is read through the Local API (direct DB access, no HTTP).
// overrideAccess: false applies the collections' access rules, so the
// public site only ever sees published documents.

const client = cache(() => getPayload({ config }))

export const getProfile = cache(async (): Promise<ProfileDoc> => {
  const payload = await client()
  const profile = await payload.findGlobal({ slug: 'profile', depth: 1, overrideAccess: false })
  const doc = profile as unknown as ProfileDoc
  // Fallbacks for a fresh install where the global hasn't been saved yet.
  return { ...doc, name: doc.name || 'Your Name' }
})

export const getProjects = cache(async (opts: { featuredOnly?: boolean; limit?: number } = {}) => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: opts.limit ?? 100,
    sort: ['-featured', '-year'],
    overrideAccess: false,
    where: {
      _status: { equals: 'published' },
      ...(opts.featuredOnly ? { featured: { equals: true } } : {}),
    },
  })
  return docs as unknown as ProjectDoc[]
})

export const getProject = cache(async (slug: string) => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return (docs[0] as unknown as ProjectDoc) ?? null
})

export const getPosts = cache(async (limit = 100) => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'posts',
    depth: 0,
    limit,
    sort: '-publishedAt',
    overrideAccess: false,
    where: { _status: { equals: 'published' } },
    select: { title: true, slug: true, excerpt: true, publishedAt: true },
  })
  return docs as unknown as PostDoc[]
})

export const getPost = cache(async (slug: string) => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return (docs[0] as unknown as PostDoc) ?? null
})

export const formatDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''
