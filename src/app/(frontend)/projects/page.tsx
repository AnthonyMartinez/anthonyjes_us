import type { Metadata } from 'next'

import { ProjectCard } from '@/components/ProjectCard'
import { getProjects } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <section className="section container">
      <h1 className="page-title">Projects</h1>
      {projects.length ? (
        <div className="grid">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <p className="empty">Nothing here yet.</p>
      )}
    </section>
  )
}
