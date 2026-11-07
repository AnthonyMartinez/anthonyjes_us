import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { getProject } from '@/lib/payload'
import { asMedia } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug)
  return project ? { title: project.title, description: project.summary } : {}
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject((await params).slug)
  if (!project) notFound()
  const cover = asMedia(project.coverImage)

  return (
    <article className="section container narrow">
      <Link href="/projects" className="back">
        ← All projects
      </Link>
      <header className="article-header">
        <h1 className="page-title">{project.title}</h1>
        <p className="lede">{project.summary}</p>
        <div className="card-meta">
          {project.year && <span>{project.year}</span>}
          {project.tags?.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        {(project.liveUrl || project.sourceUrl) && (
          <div className="hero-actions">
            {project.liveUrl && (
              <a href={project.liveUrl} className="button" target="_blank" rel="noopener noreferrer">
                Visit site
              </a>
            )}
            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                className="button button-ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source code
              </a>
            )}
          </div>
        )}
      </header>
      {cover && (
        <figure className="cover">
          <MediaImage media={cover} size="hero" priority sizes="(min-width: 768px) 720px, 100vw" />
        </figure>
      )}
      {project.body && <RichText data={project.body} />}
    </article>
  )
}
