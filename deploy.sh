#!/usr/bin/env bash
# Rebuild heliumsol.com from the latest origin/main. Run on the server as
# /opt/heliumsol/deploy.sh.
#
# The site is served by the PM2 process "heliumsol" (server.cjs). That process
# resolves files under dist/ per request, so a new build is live as soon as the
# swap below lands; the reload at the end is only so that changes to
# server.cjs itself take effect.
#
# Note this is a deploy checkout, not a working copy: it hard-resets to
# origin/main, so anything edited directly on the box is discarded — this file
# and server.cjs included, since both live in the repo. Push to GitHub instead.
set -euo pipefail

cd /opt/heliumsol

git fetch --quiet origin main
git reset --hard origin/main

npm ci

# Build to a scratch dir rather than straight to dist/. `vite build` empties
# its output dir before writing, so building in place would leave the live
# site 404ing for the few seconds the build takes, and would leave it broken
# for good if the build failed halfway.
rm -rf dist-new
npx vite build --outDir dist-new --emptyOutDir

# Write static HTML for the legal pages into the same scratch dir. Without it
# /privacy-policy and /terms-of-service serve the homepage shell to anything
# that does not run JavaScript, which is how SMS carrier reviewers read them.
npx tsx scripts/prerender.tsx dist-new

# Guard against swapping in a build that produced nothing, or lost its legal
# pages.
test -s dist-new/index.html
test -s dist-new/privacy-policy/index.html
test -s dist-new/terms-of-service/index.html
test -s dist-new/sms-program/index.html

rm -rf dist-old
if [ -d dist ]; then mv dist dist-old; fi
mv dist-new dist

# heliumsol runs in cluster mode, so reload swaps workers without dropping
# requests.
pm2 reload heliumsol

echo "deployed $(git rev-parse --short HEAD) -> /opt/heliumsol/dist"
