# Personal site: Next.js + Payload CMS

A personal website with a built-in admin panel. Payload 3 runs inside the
Next.js app, so you have one project, one server and one deploy.

- **Public site:** home (hero, about, featured work, recent writing, contact),
  `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`
- **Admin panel:** `/admin`, where you edit everything on the site
- **Database:** SQLite by default (a single file, no setup). Turso/libSQL also works.

## Getting started

Requires Node 20.9+.

```bash
npm install
cp .env.example .env          # then set PAYLOAD_SECRET to a long random string
npm run dev
```

1. Open http://localhost:3000/admin and create your first (admin) user.
2. Go to **Settings → Profile & site settings** and fill in your name, headline,
   intro, photo, links and email. Save.
3. Add entries under **Content → Projects** and **Content → Blog posts**.
   Click **Publish** when they are ready. Drafts never appear on the public site.
4. Visit http://localhost:3000.

In development, Payload updates the SQLite schema automatically whenever you change a
collection.

## Project layout

```
src/
  payload.config.ts        Payload config: database, collections, globals
  collections/
    Projects.ts            title, summary, cover, write-up, links, year, tags, featured
    Posts.ts               title, excerpt, body, publish date
    Media.ts               image/PDF uploads with resized variants
    Users.ts               admin accounts
  globals/
    Profile.ts             your name, bio, avatar, résumé, contact links, SEO
  app/
    (frontend)/            the public site (layout, pages, styles.css)
    (payload)/             admin panel + REST/GraphQL API (template boilerplate)
  components/              ProjectCard, RichText, MediaImage, header/footer
  lib/payload.ts           data fetching via Payload's Local API
```

## Customizing

- **Look and feel:** edit the CSS variables at the top of
  `src/app/(frontend)/styles.css` (colors, radius, widths). It switches to a dark
  theme automatically. Fonts are set in `src/app/(frontend)/layout.tsx`.
- **New fields:** add them to a collection, then use them in a page. Run
  `npm run generate:types` to write full TypeScript types to `src/payload-types.ts`.
- **New page types:** add a collection in `src/collections`, register it in
  `payload.config.ts`, and create a route in `src/app/(frontend)`.

## Deploying

The site needs a Node server, since the admin panel and API run in the same app.

**A VPS or any Node host (Railway, Render, Fly.io) with SQLite**

Mount a persistent disk for the `.db` file and the `media/` folder. In production,
Payload doesn't change the schema automatically, so use migrations:

```bash
npm run payload migrate:create   # run locally after changing collections; commit the files
npm run payload migrate          # run on the server before `npm start`
npm run build && npm start
```

**Vercel or other serverless hosts**

These have no persistent disk:
- Point `DATABASE_URI` at a Turso database (`libsql://...`) and set
  `DATABASE_AUTH_TOKEN`, or switch to `@payloadcms/db-postgres`.
- Store uploads with a storage plugin such as `@payloadcms/storage-vercel-blob`
  or `@payloadcms/storage-s3`.

Set `PAYLOAD_SECRET` and `NEXT_PUBLIC_SITE_URL` in your host's environment
variables.

## Version notes

This project pins Next.js to 15.4.x, the line Payload's own templates use. Before
you upgrade Next.js, check Payload's release notes for compatibility.
