# CLAUDE.md

Personal website for Anthony Martinez, built with **Next.js + Payload CMS**,
self-hosted on an **Oracle Cloud VM** with Docker.

Read `docs/HANDOFF.md` for the history, the decisions made so far and the open
work. Read `DEPLOY.md` for the server setup.

## Current status (read first)

- **The code has never been installed, built or run.** It was written in a sandbox
  that couldn't install packages, so it has only been checked for syntax errors.
  **Before any other work:**
  1. `npm install`
  2. `npx tsc --noEmit`, then fix any type errors
  3. `npm run dev`, then load `/` and `/admin`, create a user, and add a project and a post
  4. `npm run build`, then fix any build errors
  5. `npm run migrate:create -- initial`, then commit `package-lock.json` and `src/migrations/`
  6. Optional: `docker compose build`. This needs a `.env` with `NEXT_PUBLIC_SITE_URL` and `DOMAIN`.
- Work is on branch **`nextjs-payload`**. `main` still has the old Astro site.
  Don't merge into `main` until the site has been verified and the owner agrees.
- The site holds placeholder content. The owner hasn't supplied a bio, photo or links yet.
  These are edited in the admin panel, not in code.

## Stack

| Piece | Choice |
|---|---|
| Framework | Next.js `~15.4.10` (App Router, React 19.2) |
| CMS | Payload `^3.90.0`, running inside the Next app |
| Database | SQLite via `@payloadcms/db-sqlite` (libSQL; a Turso URL also works) |
| Rich text | Lexical (`@payloadcms/richtext-lexical`) |
| Images | `sharp`; uploads stored on local disk (`MEDIA_DIR`) |
| Hosting | Oracle Cloud VM, Docker Compose, Caddy (automatic HTTPS) |
| Styling | Plain CSS (`src/app/(frontend)/styles.css`), no Tailwind |

**Don't upgrade Next.js past 15.4.x** without checking Payload compatibility.
Payload's own templates pin 15.4.x because 15.5 and 16 had issues. Use Node 20.9+.
The Docker image uses Node 22.

## Commands

```bash
npm run dev                # dev server on :3000; regenerates the admin import map first
npm run build              # production build (also regenerates the import map)
npm run start              # serve the production build
npm run generate:types     # write src/payload-types.ts from the config
npm run generate:importmap # rebuild src/app/(payload)/admin/importMap.js
npm run migrate:create -- <name>   # create a DB migration after changing collections
npm run payload -- <cmd>   # any Payload CLI command
docker compose up -d --build       # production (on the VM)
scripts/deploy.sh                  # on the VM: git pull, rebuild, restart
scripts/backup.sh                  # on the VM: back up /data to backups/*.tgz
```

## Layout

```
src/
  payload.config.ts            DB adapter, collections, globals, prodMigrations
  collections/                 Projects, Posts (both drafts-enabled), Media, Users
  globals/Profile.ts           name, headline, intro, bio, avatar, résumé, links, SEO
  migrations/index.ts          placeholder; overwritten by migrate:create
  lib/payload.ts               ALL frontend data fetching (Local API, cached)
  lib/types.ts                 hand-written frontend types + asMedia() helper
  lib/access.ts                publishedOrLoggedIn access rule
  lib/fields.ts                slugField() helper (auto-slug from title)
  components/                  SiteHeader, SiteFooter, ProjectCard, RichText, MediaImage
  app/(frontend)/              public site: /, /projects, /projects/[slug], /blog, /blog/[slug]
  app/(payload)/               admin + REST/GraphQL routes (Payload boilerplate; don't edit by hand)
Dockerfile, docker-compose.yml, Caddyfile, DEPLOY.md, scripts/
```

## Conventions and gotchas

- **Data fetching:** frontend pages read data through the helpers in `src/lib/payload.ts`
  only. They call the Local API with `overrideAccess: false` and filter on
  `_status: published`, so drafts never leak. Keep that pattern for new queries.
- **Rendering:** frontend pages use `export const dynamic = 'force-dynamic'`, so edits in
  the admin show up immediately and `next build` never needs a database. If you
  switch to static rendering or ISR, the build will need DB access, and you'll need
  `revalidatePath` hooks.
- **Types:** `src/lib/types.ts` is hand-written because no `payload-types.ts` had been
  generated yet. Once `npm run generate:types` works, consider moving the frontend to the
  generated types and deleting the hand-written ones.
- **Schema changes:** after changing any collection or global field, run
  `npm run migrate:create -- <name>` and commit the result. In production,
  `prodMigrations` runs pending migrations at startup. In dev, Payload changes the
  schema automatically.
- **Environment variables:** `PAYLOAD_SECRET`, `DATABASE_URI`, `NEXT_PUBLIC_SITE_URL`
  (inlined at **build** time, so it's passed to Docker as a build arg), `MEDIA_DIR`
  (set to `/data/media` by compose), `DOMAIN` (read by Caddy), and optionally
  `DATABASE_AUTH_TOKEN` for Turso.
- **Docker:** the image is Debian-based (`node:22-bookworm-slim`), not Alpine, so
  sharp and libSQL native binaries work on ARM (Oracle Ampere A1). It uses
  `output: 'standalone'`. Persistent data lives in the `site-data` volume at `/data`.
- **Admin routes:** `src/app/(payload)/**` mirrors Payload's official template. If a
  Payload upgrade changes that boilerplate, copy the new version from Payload's
  `templates/blank` rather than editing it by hand.
- **Commits:** the owner reviews before anything is merged into `main`. Push to
  feature branches.
