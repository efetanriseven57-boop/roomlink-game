/**
 * Production server: starts Expo Metro (web) and proxies all traffic on PORT.
 * Also serves /store-assets/ as static files for Play Store downloads.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const PORT = parseInt(process.env.PORT || "3000", 10);
const METRO_PORT = parseInt(process.env.METRO_PORT || "8082", 10);
const projectRoot = path.resolve(__dirname, "..");
const STATIC_DIR = path.join(projectRoot, "web", "store-assets");
const PUBLIC_SITE_DIR = path.join(projectRoot, "web", "public-site");
const SITE_URL = "https://ad-mob-play-store--efetanriseven.replit.app";

function getDeploymentDomain() {
  const rawDomain =
    process.env.REPLIT_INTERNAL_APP_DOMAIN ||
    process.env.REPLIT_DEV_DOMAIN ||
    process.env.EXPO_PUBLIC_DOMAIN ||
    "";
  if (!rawDomain) return "";
  const withProtocol = /^https?:\/\//i.test(rawDomain)
    ? rawDomain
    : `https://${rawDomain}`;
  return new URL(withProtocol).host;
}

const deploymentDomain = getDeploymentDomain();
const clerkProxyUrl =
  deploymentDomain && process.env.CLERK_PROXY_URL
    ? `https://${deploymentDomain}${process.env.CLERK_PROXY_URL}`
    : "";
const metroEnv = {
  ...process.env,
  CI: "1",
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.CLERK_PUBLISHABLE_KEY ||
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    "",
  EXPO_PUBLIC_CLERK_PROXY_URL: clerkProxyUrl,
};

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

const metro = spawn(
  "pnpm",
  ["exec", "expo", "start", "--port", String(METRO_PORT)],
  { cwd: projectRoot, stdio: "inherit", env: metroEnv }
);
metro.on("error", (err) => console.error("Failed to start Expo:", err.message));
metro.on("exit", (code) => { process.exit(code || 0); });

function serveStatic(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || "application/octet-stream";
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    res.writeHead(200, {
      "content-type": mime,
      "content-length": data.length,
      "cache-control": "no-cache",
    });
    res.end(data);
  });
}

function serveSafeFile(rootDir, requestFile, res) {
  const root = path.resolve(rootDir);
  const candidate = path.resolve(root, requestFile);
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) {
    res.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }
  serveStatic(candidate, res);
}

function proxy(req, res) {
  const requestPath = req.url.split("?")[0];

  if (req.url === "/status") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (
    requestPath === "/robots.txt" ||
    requestPath === "/ads.txt" ||
    requestPath === "/app-ads.txt" ||
    requestPath === "/googledb5fdd5cecde9cd4.html"
  ) {
    serveSafeFile(path.join(projectRoot, "web"), requestPath.slice(1), res);
    return;
  }

  if (requestPath === "/sitemap.xml") {
    const pages = [
      ["/", "1.0"],
      ["/play-guide.html", "0.9"],
      ["/strategy.html", "0.8"],
      ["/scoring.html", "0.8"],
      ["/methodology.html", "0.8"],
      ["/about.html", "0.7"],
      ["/help.html", "0.7"],
      ["/privacy.html", "0.5"],
      ["/terms.html", "0.5"],
    ];
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(([page, priority]) => `<url><loc>${SITE_URL}${page}</loc><lastmod>2026-09-17</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`).join("")}</urlset>\n`;
    res.writeHead(200, {
      "content-type": "application/xml; charset=utf-8",
      "content-length": Buffer.byteLength(body),
      "cache-control": "public, max-age=3600",
    });
    res.end(body);
    return;
  }

  if (requestPath === "/") {
    serveSafeFile(PUBLIC_SITE_DIR, "index.html", res);
    return;
  }

  const publicPages = {
    "/index.html": "index.html",
    "/about": "about.html",
    "/about.html": "about.html",
    "/help.html": "help.html",
    "/privacy": "privacy.html",
    "/privacy.html": "privacy.html",
    "/terms.html": "terms.html",
    "/terms": "terms.html",
    "/help": "help.html",
    "/methodology": "methodology.html",
    "/methodology.html": "methodology.html",
    "/play-guide": "play-guide.html",
    "/play-guide.html": "play-guide.html",
    "/scoring": "scoring.html",
    "/scoring.html": "scoring.html",
    "/strategy": "strategy.html",
    "/strategy.html": "strategy.html",
    "/site.css": "site.css",
    "/site.js": "site.js",
  };
  if (publicPages[requestPath]) {
    serveSafeFile(PUBLIC_SITE_DIR, publicPages[requestPath], res);
    return;
  }

  // Serve store assets statically
  if (requestPath === "/store-assets" || requestPath.startsWith("/store-assets/")) {
    let relPath = requestPath.slice("/store-assets".length);
    if (!relPath || relPath === "/") relPath = "/index.html";
    serveSafeFile(STATIC_DIR, relPath.slice(1), res);
    return;
  }

  const options = {
    hostname: "localhost",
    port: METRO_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `localhost:${METRO_PORT}` },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", () => {
    res.writeHead(503, {
      "content-type": "text/html; charset=utf-8",
      "retry-after": "5",
    });
    res.end(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Room-Link Puzzle: Galaxy</title>
<style>
body{background:#0a0015;color:#00ff88;font-family:sans-serif;
display:flex;align-items:center;justify-content:center;
height:100vh;margin:0;flex-direction:column;text-align:center;}
h1{font-size:2rem;margin-bottom:1rem;}
.spinner{width:40px;height:40px;border:4px solid #333;
border-top:4px solid #00ff88;border-radius:50%;
animation:spin 1s linear infinite;margin:1.5rem auto;}
@keyframes spin{to{transform:rotate(360deg)}}
</style></head>
<body>
<h1>🌌 Room-Link Puzzle: Galaxy</h1>
<div class="spinner"></div>
<p style="color:#aaa">Starting up... please wait and refresh.</p>
<script>setTimeout(()=>location.reload(),5000)</script>
</body></html>`);
  });

  req.pipe(proxyReq, { end: true });
}

const server = http.createServer(proxy);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Production server on port ${PORT}, Metro on ${METRO_PORT}`);
  console.log(`Clerk production proxy configured: ${Boolean(clerkProxyUrl)}`);
});

process.on("SIGTERM", () => { metro.kill("SIGTERM"); server.close(); process.exit(0); });
process.on("SIGINT",  () => { metro.kill("SIGTERM"); server.close(); process.exit(0); });
