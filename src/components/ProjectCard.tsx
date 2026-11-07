import Link from 'next/link'

import { asMedia, type ProjectDoc } from '@/lib/types'

import { MediaImage } from './MediaImage'

export function ProjectCard({ project }: { project: ProjectDoc }) {
  const cover = asMedia(project.coverImage)
  return (
    <article className="card">
      <Link href={`/projects/${project.slug}`} className="card-link">
        <div className="card-media">
          {cover ? (
            <MediaImage media={cover} size="card" sizes="(min-width: 768px) 50vw, 100vw" />
          ) : (
            <div className="card-placeholder" aria-hidden>
              {project.title.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="card-body">
          <div className="card-meta">
            {project.year && <span>{project.year}</span>}
            {project.tags?.slice(0, 3).map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
        </div>
      </Link>
    </article>
  )
}
