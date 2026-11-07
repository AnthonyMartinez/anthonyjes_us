import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/RichText'
import { formatDate, getPost } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  return post ? { title: post.title, description: post.excerpt ?? undefined } : {}
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug)
  if (!post) notFound()

  return (
    <article className="section container narrow">
      <Link href="/blog" className="back">
        ← All writing
      </Link>
      <header className="article-header">
        <h1 className="page-title">{post.title}</h1>
        {post.publishedAt && (
          <time className="muted" dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        )}
      </header>
      <RichText data={post.body} />
    </article>
  )
}
