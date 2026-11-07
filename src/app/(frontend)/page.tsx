import Link from 'next/link'

import { MediaImage } from '@/components/MediaImage'
import { ProjectCard } from '@/components/ProjectCard'
import { RichText } from '@/components/RichText'
import { formatDate, getPosts, getProfile, getProjects } from '@/lib/payload'
import { asMedia } from '@/lib/types'

// Render on each request so edits in the admin show up immediately.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [profile, featured, allProjects, posts] = await Promise.all([
    getProfile(),
    getProjects({ featuredOnly: true, limit: 4 }),
    getProjects({ limit: 4 }),
    getPosts(3),
  ])
  const projects = featured.length ? featured : allProjects
  const avatar = asMedia(profile.avatar)
  const resume = asMedia(profile.resume)

  return (
    <>
      <section className="hero container">
        <div className="hero-text">
          {profile.currently && <p className="eyebrow">{profile.currently}</p>}
          <h1>{profile.headline || profile.name}</h1>
          {profile.intro && <p className="lede">{profile.intro}</p>}
          <div className="hero-actions">
            <Link href="/projects" className="button">
              See my work
            </Link>
            {resume?.url && (
              <a href={resume.url} className="button button-ghost" target="_blank" rel="noopener">
                Résumé
              </a>
            )}
          </div>
        </div>
        {avatar && (
          <div className="hero-avatar">
            <MediaImage media={avatar} size="card" priority sizes="320px" />
          </div>
        )}
      </section>

      {profile.about && (
        <section className="section container narrow" id="about">
          <h2 className="section-title">About</h2>
          <RichText data={profile.about} />
        </section>
      )}

      <section className="section container" id="work">
        <div className="section-head">
          <h2 className="section-title">Selected work</h2>
          <Link href="/projects" className="more">
            All projects →
          </Link>
        </div>
        {projects.length ? (
          <div className="grid">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <p className="empty">
            No projects yet. Add one in the <a href="/admin/collections/projects">admin panel</a>.
          </p>
        )}
      </section>

      <section className="section container narrow" id="writing">
        <div className="section-head">
          <h2 className="section-title">Writing</h2>
          <Link href="/blog" className="more">
            All posts →
          </Link>
        </div>
        {posts.length ? (
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`}>
                  <span className="post-title">{post.title}</span>
                  <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">
            No posts yet. Write one in the <a href="/admin/collections/posts">admin panel</a>.
          </p>
        )}
      </section>

      <section className="section container narrow contact" id="contact">
        <h2 className="section-title">Get in touch</h2>
        <p className="lede">
          {profile.email ? (
            <>
              The best way to reach me is by email:{' '}
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </>
          ) : (
            'Add your email under Profile & site settings → Contact & links.'
          )}
        </p>
        {profile.location && <p className="muted">Based in {profile.location}</p>}
      </section>
    </>
  )
}
