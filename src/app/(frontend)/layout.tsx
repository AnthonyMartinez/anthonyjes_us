import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import React from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getProfile } from '@/lib/payload'

import './styles.css'

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile()
  const title = profile.siteTitle || profile.name
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: { default: title, template: `%s · ${title}` },
    description: profile.siteDescription || profile.intro || undefined,
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile()
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader name={profile.name} />
        <main id="main">{children}</main>
        <SiteFooter profile={profile} />
      </body>
    </html>
  )
}
