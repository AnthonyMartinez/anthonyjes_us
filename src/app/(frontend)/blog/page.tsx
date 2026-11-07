import type { Metadata } from 'next'
import Link from 'next/link'

import { formatDate, getPosts } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Writing' }

export default async function BlogPage() {
  const posts = await getPosts()
  return (
    <section className="section container narrow">
      <h1 className="page-title">Writing</h1>
      {posts.length ? (
        <ul className="post-list detailed">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`}>
                <span className="post-title">{post.title}</span>
                <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
              </Link>
              {post.excerpt && <p className="muted">{post.excerpt}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Nothing here yet.</p>
      )}
    </section>
  )
}
