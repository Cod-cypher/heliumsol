#!/usr/bin/env bash
# Rebuild heliumsol.com from the latest origin/main. Run on the server as
# /opt/heliumsol/deploy.sh.
#
# The site is served by the PM2 process "heliumsol" (server.cjs, which loads
# the bundled server from dist/server.cjs). It reads its configuration from
# /opt/heliumsol/.env, which is gitignored, so the hard reset below never
# touches it.
#
# Note this is a deploy checkout, not a working copy: it hard-resets to
# origin/main, so anything edited directly on the box is discarded — this file
# and server.ts included, since both live in the repo. Push to GitHub instead.
set -euo pipefail

cd /opt/heliumsol

git fetch --quiet origin main
git reset --hard origin/main

test -s .env || { echo "missing /opt/heliumsol/.env - see .env.example" >&2; exit 1; }

# npm ci runs `prisma generate` through the postinstall script.
npm ci

# Apply any new database migrations before the new code starts using them.
npx prisma migrate deploy

# Build to a scratch dir rather than straight to dist/, so the live site keeps
# serving the previous build until the new one is complete and checked.
rm -rf dist-new
npx vite build --outDir dist-new/client --emptyOutDir
npx vite build --ssr src/entry-server.tsx --outDir dist-new/ssr
# Writes real HTML for every route (crawlers and SMS carrier reviewers read
# pages without running JavaScript), plus 404.html, sitemap.xml, robots.txt.
npx tsx scripts/prerender.ts dist-new
npx esbuild server.ts --bundle --platform=node --format=cjs --packages=external \
  --sourcemap --outfile=dist-new/server.cjs

# Guard against swapping in a build that produced nothing or lost pages.
test -s dist-new/server.cjs
test -s dist-new/client/index.html
test -s dist-new/client/app-shell.html
test -s dist-new/client/404.html
test -s dist-new/client/contact/index.html
test -s dist-new/client/privacy-policy/index.html
test -s dist-new/client/terms-of-service/index.html
test -s dist-new/client/sms-program/index.html
test -s dist-new/client/sitemap.xml

rm -rf dist-old
if [ -d dist ]; then mv dist dist-old; fi
mv dist-new dist

# Restart onto the new server bundle.
pm2 reload heliumsol

echo "deployed $(git rev-parse --short HEAD) -> /opt/heliumsol/dist"
