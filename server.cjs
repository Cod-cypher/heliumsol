// Static file server for the heliumsol.com SPA, run under PM2 as "heliumsol".
//
// The site is a plain Vite build with no backend, so this exists only to give
// heliumsol the same PM2-managed shape as optimizeindex and sujood. nginx
// proxies to it on 127.0.0.1:3003 instead of serving dist/ off disk.
//
// Deployed from the repo by deploy.sh, which reloads the PM2 process after each
// build — so edit this file here and push, not on the server.
//
// The cache headers below deliberately mirror what the nginx server block used
// to set, so moving behind Node did not change what browsers cache:
//   /assets/*    content-hashed by Vite, therefore immutable -> 1 year
//   /index.html  carries the pointers to the current hashed bundles, so a
//                cached copy would keep requesting the previous deploy's
//                assets -> must always revalidate
//
// Compression is left to nginx (gzip_proxied any is set for this server), so
// there is no compression middleware here — doing it in both places would just
// burn CPU twice.

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;
const DIST = path.join(__dirname, 'dist');

// Trust nginx so req.ip / req.protocol reflect the real visitor.
app.set('trust proxy', 1);

// Vite emits content-hashed filenames, so a given /assets/ URL's bytes never
// change. maxAge alone omits `immutable`, which is what stops browsers
// revalidating on reload.
app.use(
  '/assets',
  express.static(path.join(DIST, 'assets'), {
    immutable: true,
    maxAge: '1y',
    fallthrough: false,
  })
);

// Everything else in dist (favicon, robots.txt, images added later). index:false
// so the handler below is the single place that picks an index.html, and
// redirect:false so a request for a directory such as /privacy-policy falls
// through to it — serve-static would otherwise 301 it to /privacy-policy/ and
// then 404 that, and the visitor would get the homepage shell.
app.use(
  express.static(DIST, {
    index: false,
    redirect: false,
    etag: true,
    lastModified: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

// Routes prerendered at build time (scripts/prerender.tsx — currently the two
// legal pages) have their own dist/<route>/index.html carrying that page's
// title, meta and full text, so anything that does not run JavaScript — SMS
// carrier reviewers, crawlers — sees the page rather than the homepage. Every
// other path is a client-side route of the SPA, not a 404, and gets the shell.
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');

  const route = req.path.replace(/\/+$/, '');
  if (route) {
    const page = path.join(DIST, route, 'index.html');
    // path.join resolves any ../ in the request; never serve outside dist.
    if (page.startsWith(DIST + path.sep) && fs.existsSync(page)) {
      return res.sendFile(page);
    }
  }

  res.sendFile(path.join(DIST, 'index.html'));
});

// Bind to loopback only. nginx is the sole entry point, so there is no reason
// to expose this port on the public interface the way :3001 and :3002 are.
app.listen(PORT, '127.0.0.1', () => {
  console.log(`heliumsol static server listening on 127.0.0.1:${PORT} serving ${DIST}`);
});
