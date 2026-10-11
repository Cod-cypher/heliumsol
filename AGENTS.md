# HeliumSol — notes for coding agents

Marketing site for heliumsol.com: Vite + React 19 + Tailwind v4 with no routing
library (`src/App.tsx` reads the path; routes and their meta live in
`src/routes.ts`), served by an Express server (`server.ts`) with Prisma on
Postgres. Every route is pre-rendered to static HTML at build time.

The backend was copied from the optimizeindex repo and adapted; it has its own
code, its own `heliumsol` database (same Postgres instance as optimizeindex)
and its own PM2 process. Nothing is shared at runtime.

- `server.ts` — analytics ingest (`/api/track`), leads (`/api/leads`: Postgres
  + SMTP email), chat (`server/chat/*`, OpenAI Responses API with human
  handoff by emailed join link), admin login + chat inbox (`/admin`).
- `prisma/schema.prisma` — Lead, Visitor, Session, PageView, Event, AdminUser,
  ChatConversation, ChatMessage. Same shape as optimizeindex's tables.
- `src/components/ContactLeadForm.tsx` — the 3-step form on `/contact`.
- `src/components/SignupForm.tsx` — the free-offer form on
  `/free-website-and-chatbot`; submits `type: 'free_offer_signup'` through
  the same `/api/leads` pipeline.
- `src/components/chat/*` — the chat widget; `src/content/chat.ts` holds its
  persona, rules and copy; `public/llms.txt` is its knowledge of HeliumSol.
  **Update `llms.txt` whenever a page, service or the offer changes**: it is
  what the assistant knows, and `verify-seo` checks every link in it.

## Where things live

- `src/site.ts` — origin, contact details, legal date, the signup path and the
  default share image. Safe to import from `server/`. **Never import
  `src/routes.ts` from `server/` or `shared/`**: it pulls in the blog, which
  is built by a Vite plugin from markdown that esbuild cannot bundle.
  `verify-seo` fails the build if the server bundle contains it.
- `src/routes.ts` — the composed route list: hand-written pages plus one route
  per service page, landing page, blog category and blog post. Sitemap,
  prerender and the client router all read this list.
- `src/content/services.ts`, `src/content/landings.ts` — service and landing
  page data (`src/content/types.ts` has the shape). Adding an entry adds the
  page, its nav/footer link, its sitemap line and its structured data.
- `content/blog/<slug>.md` — one blog post per file. Adding a file adds the
  page, the blog index card, the category page, the sitemap entry, the RSS
  item and the related-posts links. See "Adding a blog post".
- `src/lib/jsonld.ts` + `src/components/JsonLd.tsx` — structured data lives in
  components, not in the prerender. `Faq.tsx` and `Breadcrumbs.tsx` render the
  visible markup and the JSON-LD from one array so they cannot drift.
- `src/components/OfferCta.tsx` — the closing CTA every service, landing and
  blog page ends with. It points at `SIGNUP_PATH`.
- `src/lib/useSkipEntrance.ts` — use `initial={skip ? false : {...}}` on any
  `motion` element that holds prerendered text, or the text ships at opacity 0.
- `public/fonts/` — self-hosted woff2 (`@font-face` in `src/index.css`). No
  Google Fonts.
- `public/images/` — `.webp` (+ optional `.avif` sibling). Use
  `src/components/Picture.tsx`, which requires width, height and alt.
- `public/og-default.png` — the 1200x630 share image. Source: `design/og-default.html`,
  rasterised once with headless Chrome. Blog hero sources are in `design/blog/`.

## Adding a blog post

1. Create `content/blog/<slug>.md` (lowercase, hyphens). Frontmatter keys:
   `title`, `description`, `date` (YYYY-MM-DD), `category` (a slug from
   `src/content/categories.ts`), `tags` (list), `keyword`, `author` (a key in
   `src/content/authors.ts`), optional `updated`, `image` (root-relative, under
   `public/`), `imageAlt`, `seoTitle`, `draft: true`.
2. Open with a 2–3 sentence direct answer. Use `##` question-style headings.
   Never use a `#` heading (the page renders the title as the only H1; the
   build fails otherwise). Link to the relevant service page and at least one
   other page. Cite sources with working links; never invent a statistic.
3. `npm run build`. The markdown plugin (`scripts/vite-plugin-md.ts`) validates
   the frontmatter and `verify-seo` checks the rendered page.

## Commands

- `npm run dev` — `tsx server.ts`: API + Vite middleware on `PORT` from .env
  (3000 locally). Needs a filled-in `.env` (see `.env.example`).
- `npm run build` — client build to `dist/client`, SSR build to `dist/ssr`,
  esbuild bundles the server to `dist/server.cjs` (with a metafile),
  `scripts/prerender.ts` writes every route + 404.html + sitemap.xml +
  robots.txt + blog/feed.xml, then `scripts/verify-seo.ts` fails the build on
  a missing H1, duplicate head tags, a wrong canonical, a missing share image,
  a broken internal link or anchor, an `<img>` without dimensions or alt,
  missing JSON-LD types, sitemap or feed drift, a dead link in `llms.txt`, or
  a server bundle that pulled in the blog.
- `npm run verify:seo` — run the checks alone against an existing `dist/`.
- `npm start` — `node server.cjs` (production mode, serves `dist/client`)
- `npm run lint` — `tsc --noEmit` (there is no test suite)
- `npx prisma migrate dev --name <change>` — after editing the schema; commit
  the migration. Production applies it with `prisma migrate deploy` on deploy.
- `npm run admin -- <email> <password> [name]` — create an admin login

## Analytics

- First-party tracking (`src/lib/tracker.ts` → `/api/track` → Postgres) always
  runs on the marketing site.
- GA4 loads only when `GA4_MEASUREMENT_ID` is set in `.env` at build time, with
  Consent Mode v2 defaults of denied; `src/components/ConsentBanner.tsx`
  upgrades consent on "Allow", as the privacy policy promises. Search Console
  verification uses `GSC_VERIFICATION` the same way. Both are injected by
  `scripts/prerender.ts`.
- GA4 events: `generate_lead` (contact form), `sign_up` (free offer),
  `click_to_call` and `click_to_email` (any tel:/mailto: link). Mark them as
  conversions in the GA4 admin.

## Deploying

Deploying is: push to `main` on GitHub, then the user runs this one command.

```powershell
ssh root@167.233.120.70 "cd /opt/heliumsol && git fetch -q origin main && git reset --hard origin/main && bash deploy.sh"
```

It ends by printing `deployed <commit> -> /opt/heliumsol/dist`. Check it
worked with:

```powershell
curl.exe -s https://heliumsol.com/privacy-policy | Select-String "<title>"
```

That should print `Privacy Policy | HeliumSol`, not the homepage title. Also
check `https://heliumsol.com/api/health` returns `"db":"up"`.

Things an agent needs to know:

- **Agents cannot run the deploy.** The server uses password login, and
  Claude Code's permission system blocks SSH to it. Push, then give the user
  the command above to run. Do not try to work around this.
- **Always pull before running `deploy.sh`.** The command above resets
  first. `deploy.sh` also resets, but bash is already running the old copy by
  then, so a change to `deploy.sh` itself would only apply on the next deploy.
- **Never edit files on the server.** `/opt/heliumsol` is a deploy checkout
  that hard-resets to `origin/main` on every deploy, so changes there are
  lost. `deploy.sh` and `server.cjs` are both in this repo; change them here
  and push.
- **How production is wired.** nginx proxies heliumsol.com to
  `127.0.0.1:3003`. That port is `server.cjs` (a shim that loads the bundled
  `dist/server.cjs`) running under PM2 as `heliumsol` from
  `ecosystem.config.cjs`. The nginx config lives only on the server, at
  `/etc/nginx/sites-enabled/heliumsol.conf`. `deploy.sh` runs `npm ci` and
  `prisma migrate deploy`, builds into `dist-new/`, runs `verify-seo`, swaps
  it in for `dist/`, then runs `pm2 reload heliumsol`.
- **Production config is `/opt/heliumsol/.env`** (gitignored, so the hard reset
  leaves it alone). `deploy.sh` refuses to run without it.
- **PM2 must run exactly one instance.** Chat presence, rate limits and the
  OpenAI token-cap cache live in process memory.

## Legal pages and SMS compliance

- The text for `/privacy-policy` and `/terms-of-service` lives in
  `src/content/legal.tsx`. Bump `LEGAL_UPDATED` and `LEGAL_UPDATED_ISO` in
  `src/site.ts` whenever it changes.
- Privacy section 6 (`#sms`) and Terms section 4 (`#sms-terms`) are what US
  carriers review for the HeliumSol SMS registration. When editing, keep every
  required statement: consent, message types, "Message frequency may vary",
  "Message and data rates may apply", STOP, HELP, no sharing of opt-in data,
  "not a condition of purchasing", and the support contact.
- `/sms-program` (the `SMS_PROGRAM` doc in the same file) is the campaign URL
  given to the SMS provider. HeliumSol takes consent **verbally**, so this page
  describes that process word for word: the script, the confirmation text, and
  the STOP and HELP replies. If the real process changes, change this page too.
- Reviewers read these pages without running JavaScript. That works because
  `scripts/prerender.ts` writes every route in `ROUTES` out as real HTML and
  the server serves `dist/client/<route>/index.html`. Unknown paths get
  `404.html` with a 404 status. A new page needs a route in `ROUTES` and a
  case in `App.tsx` — but it must not read `window`/`document` during render,
  or the pre-render breaks.

## Environment gotchas

- The dev machine runs Windows with PowerShell 5.1. Double quotes inside a
  `git commit -m` message get mangled, so write the message to a file and use
  `git commit -F <file>`.
- `.gitattributes` forces `*.sh` and `*.md` to LF line endings, and `deploy.sh`
  is committed as executable (mode 100755). Keep both, or bash on the server
  will refuse to run the script.
