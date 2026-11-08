# Handoff: history, decisions, open work

This file records the claude.ai chat (Nov 7, 2026) where this project was started,
so the work can continue in Claude Code.

## What the owner asked for, in order

1. "I want to build a personal website."
2. "The site itself should be a project that uses Next.js and Payload CMS."
3. Put it in a GitHub repo. The owner chose the **existing** repo
   `AnthonyMartinez/anthonyjes_us` (previously an Astro site) instead of a new one.
4. Set up deployment. The owner already has an **Oracle Cloud VM** and asked for the
   best way to host there.
5. Create this CLAUDE.md and handoff doc.

The owner has **not** given any personal content yet (bio, headline, photo, links,
email, résumé). Ask for it or leave it to the admin panel. Don't invent it. The
domain is probably `anthonyjes.us`, going by the repo name, but this wasn't confirmed.

## Decisions and why

| Decision | Why |
|---|---|
| Payload 3 runs **inside** the Next app (one project, one server) | This is Payload 3's native model: one deploy, and the Local API gives the frontend direct DB access without HTTP. |
| Next.js pinned to `~15.4.10` | Payload's templates pin 15.4.x. Payload reported issues with 15.5 and 16 (payloadcms/payload#14456). 15.4.10 includes the late-2025 React Server Components security fixes. Recheck when upgrading. |
| **SQLite** (`@payloadcms/db-sqlite`) | No database server to run, and it works well on a single VM. Easy to back up (one file). A libSQL/Turso URL works if the site ever moves to serverless hosting. |
| Content model: `Projects`, `Posts`, `Media`, `Users`, plus a `Profile` global | A typical personal site: portfolio, blog, an editable about/contact section. Projects and Posts have **drafts** turned on. |
| Pages are `force-dynamic` | Admin edits show up immediately, and the build never needs a database. Load is negligible for a personal site. |
| Plain CSS with CSS variables, Fraunces and Inter fonts, automatic dark mode | Minimal and easy to re-theme. The owner never specified a look, so this is open to change. |
| Hosting: **Docker Compose with Caddy** on the Oracle VM | Reproducible builds, automatic HTTPS, and one command to redeploy. Data persists in a Docker volume. |
| Debian base image, not Alpine | sharp and libSQL native binaries work on both ARM (Ampere A1) and x86. |
| `prodMigrations` in the DB adapter | Migrations run automatically when the server starts, so there's no separate migrate step in the container. |
| New code on branch `nextjs-payload`, `main` untouched | Keeps the old Astro site intact until the new one is verified. |

## Status

**Done (pushed to `nextjs-payload`):**
- Full Next.js + Payload project: collections, global, public pages, components, styles, README
- Docker deployment: `Dockerfile`, `docker-compose.yml`, `Caddyfile`, `.dockerignore`
- `scripts/deploy.sh`, `scripts/backup.sh`, `DEPLOY.md` (Oracle-specific steps)
- `public/robots.txt` (disallows `/admin` and `/api`)

**Not done or not verified:**
- [ ] `npm install`, type-check, dev run and `next build` have **never been run**. The
      sandbox had no network access to npm. **Expect to fix small issues.**
- [ ] No `package-lock.json` has been committed yet.
- [ ] The initial migration hasn't been generated (`npm run migrate:create -- initial`).
      Production **won't work** without it, because tables won't exist.
- [ ] The Docker image has never been built.
- [ ] The VM hasn't been set up (ports, Docker, DNS, `.env`). See `DEPLOY.md`.
- [ ] The `nextjs-payload` branch hasn't been merged into `main`.

## Things to verify on the first real install

These were written from knowledge of Payload 3 without running the code. Check
each one:

- `@payloadcms/richtext-lexical/react` exports `RichText`, as used in `src/components/RichText.tsx`.
- `payload.find({ sort: ['-featured', '-year'] })` accepts an array of sort fields.
- `select: {...}` in `getPosts()` works without generated types.
- `findGlobal('profile')` on a fresh DB: does it apply the `defaultValue`s? `getProfile()`
  falls back to `'Your Name'` either way.
- The `predev` and `prebuild` scripts run `payload generate:importmap`. Confirm this works
  and that the admin panel's Lexical editor loads, with no "missing import map" errors.
- The `prodMigrations` type matches the placeholder `src/migrations/index.ts` export.
- `output: 'standalone'` traces `sharp` and the libSQL native bindings into
  `.next/standalone`. If not, add them with `outputFileTracingIncludes` or copy
  `node_modules/@libsql` into the runner stage.
- `next/image` with `images.localPatterns` for `/api/media/file/**` serves uploaded
  images correctly.
- Media `staticDir` from `MEDIA_DIR=/data/media` resolves correctly in the container.
- The Caddy `www.{$DOMAIN}` block errors if there's no `www` DNS record. Either add the
  record or remove the block.

## Next steps, roughly in priority order

1. Install, type-check, run and build locally. Fix whatever breaks.
2. Generate the initial migration, then commit it along with the lockfile.
3. Run `docker compose build` locally to check the image builds.
4. Deploy to the Oracle VM following `DEPLOY.md`. Create the admin user immediately.
5. Add real content through `/admin` (owner).
6. Open a PR from `nextjs-payload` to `main` and merge it once the site is live.
7. Nice to have, already offered to the owner:
   - A GitHub Action that deploys over SSH to the VM on every push to `main`
   - `sitemap.ts`, `robots.ts` and Open Graph images
   - Live preview for drafts in the admin (`admin.livePreview`)
   - Off-VM backups (Oracle Object Storage)
   - Design pass once the owner states a preferred look

## Environment notes from the original session

- GitHub CLI and git pushes go through the Claude GitHub App. The owner had to grant
  the app access to `anthonyjes_us` before pushes worked.
- That session had no npm network access. A fresh Claude Code session with network
  access can do the whole "Not done or not verified" list.
