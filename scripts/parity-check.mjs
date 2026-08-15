import fs from "node:fs";
import path from "node:path";
const SRC = "C:/Users/narab/Web Cerfinits";
const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style>[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/ /g, " ").replace(/\s+/g, " ").trim();
const pages = ["index", ...Array.from({length:10},(_,i)=>"ch"+String(i+1).padStart(2,"0")), "glossary", "cheatsheet", "full"];
let fail = 0;
for (const p of pages) {
  const html = fs.readFileSync(path.join(SRC, `gold-start-${p}.html`), "utf8");
  let body = (html.match(/<body>([\s\S]*?)<\/body>/))[1].replace(/<a class="tl" href="gold-start-00-cover\.html">[\s\S]*?<\/a>\s*/g, "");
  const want = strip(body);
  const route = p === "index" ? "" : "/" + p;
  const res = await fetch(`http://localhost:3000/gold-start${route}`);
  const got = strip(await res.text());
  const ok = got.includes(want);
  console.log(`${ok ? "PASS" : "FAIL"} /gold-start${route} (${want.length} chars fully contained)`);
  if (!ok) { fail++;
    for (let i = 0; i < want.length; i += 500) { if (!got.includes(want.slice(i, i + 100))) { console.log(`  first miss near offset ${i}: ${want.slice(i, i + 80)}`); break; } }
  }
}
process.exit(fail ? 1 : 0);
