// Lightweight shapes for the frontend. For full, generated types run
// `npm run generate:types`, which writes src/payload-types.ts.

export type MediaDoc = {
  id: number | string
  alt: string
  url?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  sizes?: Record<string, { url?: string | null; width?: number | null; height?: number | null }>
}

// Lexical editor state, passed straight to <RichText />.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RichTextValue = any

export type ProfileDoc = {
  name: string
  headline?: string | null
  intro?: string | null
  about?: RichTextValue | null
  location?: string | null
  currently?: string | null
  avatar?: MediaDoc | number | null
  resume?: MediaDoc | number | null
  email?: string | null
  links?: { id?: string; label: string; url: string }[] | null
  siteTitle?: string | null
  siteDescription?: string | null
}

export type ProjectDoc = {
  id: number | string
  title: string
  slug: string
  summary: string
  coverImage?: MediaDoc | number | null
  body?: RichTextValue | null
  liveUrl?: string | null
  sourceUrl?: string | null
  year?: number | null
  featured?: boolean | null
  tags?: string[] | null
}

export type PostDoc = {
  id: number | string
  title: string
  slug: string
  excerpt?: string | null
  body: RichTextValue
  publishedAt?: string | null
}

/** Upload fields come back as an ID at depth 0; only use populated docs. */
export const asMedia = (value: unknown): MediaDoc | null =>
  value && typeof value === 'object' && 'url' in value ? (value as MediaDoc) : null
