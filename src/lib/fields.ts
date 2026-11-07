import type { Field, FieldHook } from 'payload'

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const fallback = data?.[fallbackField] ?? originalDoc?.[fallbackField]
    return typeof fallback === 'string' ? slugify(fallback) : value
  }

/** A URL slug that fills itself in from another field (default: title). */
export const slugField = (fallbackField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: `Leave blank to generate from the ${fallbackField}.`,
  },
  hooks: {
    beforeValidate: [formatSlug(fallbackField)],
  },
})
