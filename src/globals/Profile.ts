import type { GlobalConfig } from 'payload'

export const Profile: GlobalConfig = {
  slug: 'profile',
  label: 'Profile & site settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'About you',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              defaultValue: 'Your Name',
            },
            {
              name: 'headline',
              type: 'text',
              defaultValue: 'Designer, developer and maker of things.',
              admin: { description: 'The big line at the top of the home page.' },
            },
            {
              name: 'intro',
              type: 'textarea',
              defaultValue:
                'A short introduction: what you do, what you care about, and what you are working on right now. Edit this in the admin panel under Profile & site settings.',
            },
            {
              name: 'about',
              label: 'Longer bio',
              type: 'richText',
            },
            {
              type: 'row',
              fields: [
                { name: 'location', type: 'text' },
                { name: 'currently', type: 'text', admin: { description: 'e.g. "Open to new roles"' } },
              ],
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'resume',
              label: 'Résumé (PDF)',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Contact & links',
          fields: [
            {
              name: 'email',
              type: 'email',
            },
            {
              name: 'links',
              type: 'array',
              labels: { singular: 'Link', plural: 'Links' },
              admin: { description: 'GitHub, LinkedIn, Mastodon, Dribbble, etc.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    { name: 'url', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'siteTitle',
              type: 'text',
              admin: { description: 'Defaults to your name.' },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
            },
          ],
        },
      ],
    },
  ],
}
