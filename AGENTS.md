# HeliumSol — notes for coding agents

Marketing site for heliumsol.com: Vite + React 19 + Tailwind v4, a
client-rendered SPA with no routing library (`src/App.tsx` reads the path;
routes and their meta live in `src/routes.ts`).

## Commands

- `npm run dev` — dev server on port 3000
- `npm run build` — `vite build`, then `scripts/prerender.tsx` writes static
  HTML for the legal pages into `dist/`
- `npm run lint` — `tsc --noEmit` (there is no test suite)

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

That should print `Privacy Policy | HeliumSol`, not the homepage title.

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
  `127.0.0.1:3003`. That port is `server.cjs`, an Express static server
  running under PM2 as `heliumsol`. The nginx config lives only on the server,
  at `/etc/nginx/sites-enabled/heliumsol.conf`. `deploy.sh` builds into
  `dist-new/`, swaps it in for `dist/`, then runs `pm2 reload heliumsol`.

## Legal pages and SMS compliance

- The text for `/privacy-policy` and `/terms-of-service` lives in
  `src/content/legal.tsx`. Bump `LEGAL_UPDATED` in `src/routes.ts` whenever
  it changes.
- Privacy section 6 (`#sms`) and Terms section 4 (`#sms-terms`) are what US
  carriers review for the HeliumSol SMS registration. When editing, keep every
  required statement: consent, message types, "Message frequency may vary",
  "Message and data rates may apply", STOP, HELP, no sharing of opt-in data,
  "not a condition of purchasing", and the support contact.
- Reviewers read these pages without running JavaScript. That only works
  because `scripts/prerender.tsx` writes them out as real HTML and
  `server.cjs` serves `dist/<route>/index.html` before falling back to the
  SPA shell. A new page that must be readable without JS needs adding to the
  prerender script.

## Environment gotchas

- The dev machine runs Windows with PowerShell 5.1. Double quotes inside a
  `git commit -m` message get mangled, so write the message to a file and use
  `git commit -F <file>`.
- `.gitattributes` forces `*.sh` to LF line endings, and `deploy.sh` is
  committed as executable (mode 100755). Keep both, or bash on the server will
  refuse to run the script.
