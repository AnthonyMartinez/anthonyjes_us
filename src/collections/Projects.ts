import type { CollectionConfig } from 'payload'

import { publishedOrLoggedIn } from '../lib/access'
import { slugField } from '../lib/fields'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'featured', '_status', 'updatedAt'],
    group: 'Content',
    preview: (doc) => (doc?.slug ? `/projects/${doc.slug}` : null),
  },
  access: {
    read: publishedOrLoggedIn,
  },
  defaultSort: '-year',
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
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'One or two sentences shown on project cards.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'body',
      label: 'Write-up',
      type: 'richText',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'liveUrl',
          label: 'Live URL',
          type: 'text',
        },
        {
          name: 'sourceUrl',
          label: 'Source code URL',
          type: 'text',
        },
      ],
    },
    slugField(),
    {
      name: 'year',
      type: 'number',
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on the home page.',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ],
}
