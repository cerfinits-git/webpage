// Crawls every internal link reachable from the site's pages on the dev
// server and reports anything that doesn't resolve. Usage:
//   node scripts/link-check.mjs
const BASE = "http://localhost:3000";
const SEEDS = [
  "/",
  "/blog",
  "/blog/cot-gold-basics",
  "/blog/trading-psychology-discipline",
  "/blog/ict-market-maker-basics",
  "/algo",
  "/grade",
  "/gold-start",
  ...Array.from({ length: 10 }, (_, i) => `/gold-start/ch${String(i + 1).padStart(2, "0")}`),
  "/gold-start/glossary",
  "/gold-start/cheatsheet",
  "/gold-start/full",
  "/plan",
  "/plan/cashflow",
  "/plan/portfolio",
  "/plan/balance",
  "/plan/goals",
  "/plan/reports",
  "/sitemap.xml",
  "/robots.txt",
  "/gold-start-cerfinits.pdf",
  "/og-cover.png",
];

const seen = new Map(); // url -> status
const queue = [...SEEDS];
let bad = 0;

while (queue.length) {
  const url = queue.shift();
  if (seen.has(url)) continue;
  const res = await fetch(BASE + url, { redirect: "follow", method: url.match(/\.(pdf|png)$/) ? "HEAD" : "GET" });
  seen.set(url, res.status);
  if (res.status !== 200) {
    bad++;
    console.log(`FAIL ${res.status}  ${url}`);
    continue;
  }
  const type = res.headers.get("content-type") || "";
  if (!type.includes("text/html")) continue;
  const html = await res.text();
  // only the SSR body, not hydration payloads
  const doc = html.split("<script")[0] + html.split("</script>").pop();
  for (const m of doc.matchAll(/href="(\/[^"#?]*)/g)) {
    const link = m[1].replace(/\/$/, "") || "/";
    if (!seen.has(link) && !queue.includes(link)) queue.push(link);
  }
}

console.log(`\nchecked ${seen.size} URLs — ${bad} broken`);
process.exit(bad ? 1 : 0);
