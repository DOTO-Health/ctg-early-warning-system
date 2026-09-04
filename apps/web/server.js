// Minimal zero-dependency static file server for local dev/preview of the
// Ctg-Early-Warning-System web UI. For anything beyond local development, serve the
// `public/` directory with nginx, Vercel, Netlify, or any static host.
import http from "node:http";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "public");
const PORT = process.env.PORT || 5173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".png": "image/png",
};

http
  .createServer(async (req, res) => {
    const urlPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    const filePath = path.join(ROOT, decodeURIComponent(urlPath));

    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    try {
      const contents = await readFile(filePath);
      const ext = path.extname(filePath);
      res.writeHead(200, {
        "Content-Type": MIME[ext] || "application/octet-stream",
      });
      res.end(contents);
    } catch {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.end("Not found");
    }
  })
  .listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(
      `🖥️  Ctg-Early-Warning-System web UI running on http://localhost:${PORT}`,
    );
  });
