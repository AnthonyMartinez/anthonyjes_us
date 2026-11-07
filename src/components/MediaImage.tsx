import Image from 'next/image'

import type { MediaDoc } from '@/lib/types'

type Props = {
  media: MediaDoc
  size?: 'thumbnail' | 'card' | 'hero'
  className?: string
  priority?: boolean
  sizes?: string
}

export function MediaImage({ media, size, className, priority, sizes }: Props) {
  const variant = size ? media.sizes?.[size] : undefined
  const src = variant?.url || media.url
  const width = variant?.width || media.width
  const height = variant?.height || media.height
  if (!src || !width || !height) return null

  return (
    <Image
      src={src}
      alt={media.alt || ''}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  )
}
