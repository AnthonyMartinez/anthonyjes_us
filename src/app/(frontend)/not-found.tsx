import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="section container narrow">
      <h1 className="page-title">Page not found</h1>
      <p className="lede">That page doesn’t exist, or it hasn’t been published yet.</p>
      <Link href="/" className="button">
        Back home
      </Link>
    </section>
  )
}
