import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

import type { RichTextValue } from '@/lib/types'

export function RichText({ data, className }: { data: RichTextValue; className?: string }) {
  if (!data?.root) return null
  return (
    <div className={['prose', className].filter(Boolean).join(' ')}>
      <LexicalRichText data={data} />
    </div>
  )
}
