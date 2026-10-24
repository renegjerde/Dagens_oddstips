import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.env.PORT || 3000);\nconst ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "";
const PARSE_KEY = process.env.PARSE_API_KEY || "";
const FOOTBALL_TOKEN = process.env.FOOTBALL_DATA_TOKEN || "";
const PARSE_BASE = "https://api.parse.bot/scraper/87082f99-8f94-45ae-88e4-fff8a25af1d5/";
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".md": "text/markdown; charset=utf-8" };
const cache = new Map();
const CACHE_MS = 60_000;

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}
async function apiJson(url, headers) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(15_000) });
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error(`Leverandøren returnerte ikke JSON (HTTP ${response.status}).`); }
  if (!response.ok) throw new Error(data?.message || data?.error || `Leverandørfeil HTTP ${response.status}.`);
  return data;
}
async function cached(key, fn) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.at < CACHE_MS) return entry.value;
  const value = await fn();
  cache.set(key, { at: Date.now(), value });
  return value;
}
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname === "/api/health") {
      return json(res, 200, { ok: true, parseConfigured: Boolean(PARSE_KEY), statsConfigured: Boolean(FOOTBALL_TOKEN) });
    }
    if (url.pathname === "/api/odds/tournaments") {
      if (!PARSE_KEY) return json(res, 503, { error: "PARSE_API_KEY mangler i .env." });
      const data = await cached("odds:tournaments", () => apiJson(PARSE_BASE + "list_tournaments", { "X-API-Key": PARSE_KEY }));
      return json(res, 200, data);
    }
    if (url.pathname === "/api/odds/matches") {
      if (!PARSE_KEY) return json(res, 503, { error: "PARSE_API_KEY mangler i .env." });
      const id = url.searchParams.get("tournament_id") || "";
      const limit = Math.max(1, Math.min(100, Number(url.searchParams.get("limit") || 100)));
      if (!/^[\w.-]{1,40}$/.test(id)) return json(res, 400, { error: "Ugyldig tournament_id." });
      const key = `odds:matches:${id}:${limit}`;
      const data = await cached(key, () => apiJson(`${PARSE_BASE}get_football_matches?limit=${limit}&tournament_id=${encodeURIComponent(id)}`, { "X-API-Key": PARSE_KEY }));
      return json(res, 200, data);
    }
    if (url.pathname === "/api/stats/matches") {
      if (!FOOTBALL_TOKEN) return json(res, 503, { error: "FOOTBALL_DATA_TOKEN mangler i .env." });
      const competition = url.searchParams.get("competition") || "PL";
      const dateFrom = url.searchParams.get("dateFrom") || "";
      const dateTo = url.searchParams.get("dateTo") || "";
      if (!/^[A-Z0-9]{2,5}$/.test(competition) || !/^\d{4}-\d{2}-\d{2}$/.test(dateFrom) || !/^\d{4}-\d{2}-\d{2}$/.test(dateTo)) {
        return json(res, 400, { error: "Ugyldig konkurranse eller dato." });
      }
      const key = `stats:${competition}:${dateFrom}:${dateTo}`;
      const data = await cached(key, () => apiJson(`https://api.football-data.org/v4/competitions/${competition}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}&status=FINISHED`, { "X-Auth-Token": FOOTBALL_TOKEN }));
      return json(res, 200, data);
    }
    // Static files are restricted to the project root.
    const pathname = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const target = normalize(join(ROOT, pathname));
    if (!target.startsWith(ROOT)) return json(res, 403, { error: "Forbidden" });
    const body = await readFile(target);
    res.writeHead(200, { "Content-Type": MIME[extname(target)] || "application/octet-stream", "X-Content-Type-Options": "nosniff" });
    return res.end(body);
  } catch (error) {
    const message = error?.name === "AbortError" || error?.name === "TimeoutError" ? "Forespørselen tok for lang tid." : (error?.message || "Ukjent serverfeil.");
    return json(res, 502, { error: message });
  }
});
server.listen(PORT, () => console.log(`Oddstips MVP lytter på http://localhost:${PORT}`));
