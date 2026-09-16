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
- `src/components/chat/*` — the chat widget; `src/content/chat.ts` holds its
  persona, rules and copy; `public/llms.txt` is its knowledge of HeliumSol.

## Commands

- `npm run dev` — `tsx server.ts`: API + Vite middleware on `PORT` from .env
  (3000 locally). Needs a filled-in `.env` (see `.env.example`).
- `npm run build` — client build to `dist/client`, SSR build to `dist/ssr`,
  `scripts/prerender.ts` writes every route + 404.html + sitemap.xml +
  robots.txt, esbuild bundles the server to `dist/server.cjs`
- `npm start` — `node server.cjs` (production mode, serves `dist/client`)
- `npm run lint` — `tsc --noEmit` (there is no test suite)
- `npx prisma migrate dev --name <change>` — after editing the schema; commit
  the migration. Production applies it with `prisma migrate deploy` on deploy.
- `npm run admin -- <email> <password> [name]` — create an admin login

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
  `prisma migrate deploy`, builds into `dist-new/`, swaps it in for `dist/`,
  then runs `pm2 reload heliumsol`.
- **Production config is `/opt/heliumsol/.env`** (gitignored, so the hard reset
  leaves it alone). `deploy.sh` refuses to run without it.
- **PM2 must run exactly one instance.** Chat presence, rate limits and the
  OpenAI token-cap cache live in process memory.

## Legal pages and SMS compliance

- The text for `/privacy-policy` and `/terms-of-service` lives in
  `src/content/legal.tsx`. Bump `LEGAL_UPDATED` in `src/routes.ts` whenever
  it changes.
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
  `404.html` with a 404 status. A new page only needs adding to `ROUTES` and
  `App.tsx` — but it must not read `window`/`document` during render, or the
  pre-render breaks.

## Environment gotchas

- The dev machine runs Windows with PowerShell 5.1. Double quotes inside a
  `git commit -m` message get mangled, so write the message to a file and use
  `git commit -F <file>`.
- `.gitattributes` forces `*.sh` to LF line endings, and `deploy.sh` is
  committed as executable (mode 100755). Keep both, or bash on the server will
  refuse to run the script.
