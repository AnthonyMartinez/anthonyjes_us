import type { CollectionConfig } from 'payload'

import { publishedOrLoggedIn } from '../lib/access'
import { slugField } from '../lib/fields'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Blog posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status', 'updatedAt'],
    group: 'Content',
    preview: (doc) => (doc?.slug ? `/blog/${doc.slug}` : null),
  },
  access: {
    read: publishedOrLoggedIn,
  },
  defaultSort: '-publishedAt',
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary for the blog index and link previews.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) =>
            !value && siblingData?._status === 'published' ? new Date().toISOString() : value,
        ],
      },
    },
  ],
}
