import Link from 'next/link'

export function SiteHeader({ name }: { name: string }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="wordmark">
          {name}
        </Link>
        <nav aria-label="Main">
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Writing</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
