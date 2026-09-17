/**
 * Dev server: starts Expo Metro and serves a status endpoint on PORT.
 * Replit preview expects something on PORT; this satisfies that check
 * and proxies all other traffic to Metro.
 */
const http = require("http");
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

const STATIC_DIR = path.join(__dirname, "..", "web", "store-assets");
const PUBLIC_SITE_DIR = path.join(__dirname, "..", "web", "public-site");
const WEB_DIR = path.join(__dirname, "..", "web");
const SITE_URL = "https://ad-mob-play-store--efetanriseven.replit.app";
const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};
function serveStatic(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream", "content-length": data.length });
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

const PORT = parseInt(process.env.PORT || "20025", 10);
const METRO_PORT = parseInt(process.env.METRO_PORT || "8082", 10);
const projectRoot = path.resolve(__dirname, "..");

const metro = spawn(
  "pnpm",
  ["exec", "expo", "start", "--port", String(METRO_PORT), "--localhost"],
  {
    cwd: projectRoot,
    stdio: "inherit",
    env: { ...process.env, CI: "1" },
  }
);

metro.on("error", (err) => {
  console.error("Failed to start Expo:", err.message);
  process.exit(1);
});

metro.on("exit", (code) => {
  console.log("Expo exited with code", code);
  process.exit(code || 0);
});

function proxy(req, res) {
  if (req.url === "/status") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  const requestPath = req.url.split("?")[0];
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

  if (
    requestPath === "/robots.txt" ||
    requestPath === "/ads.txt" ||
    requestPath === "/app-ads.txt" ||
    requestPath === "/googledb5fdd5cecde9cd4.html"
  ) {
    serveSafeFile(WEB_DIR, requestPath.slice(1), res);
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
      "cache-control": "no-cache",
    });
    res.end(body);
    return;
  }

  if (requestPath.startsWith("/store-assets")) {
    let relPath = requestPath.replace("/store-assets", "");
    if (!relPath || relPath === "/") relPath = "/index.html";
    serveStatic(path.join(STATIC_DIR, relPath), res);
    return;
  }

  const options = {
    hostname: "localhost",
    port: METRO_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", () => {
    res.writeHead(502, { "content-type": "text/plain" });
    res.end("Metro not ready yet, please wait...");
  });

  req.pipe(proxyReq, { end: true });
}

const server = http.createServer(proxy);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Dev server listening on port ${PORT}, proxying Metro on ${METRO_PORT}`);
});

process.on("SIGTERM", () => { metro.kill(); process.exit(0); });
process.on("SIGINT", () => { metro.kill(); process.exit(0); });
