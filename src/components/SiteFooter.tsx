import type { ProfileDoc } from '@/lib/types'

export function SiteFooter({ profile }: { profile: ProfileDoc }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <ul className="link-list">
          {profile.links?.map((link) => (
            <li key={link.id ?? link.url}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
