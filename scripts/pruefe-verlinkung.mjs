/*
 * Eingehende interne Links je indexierbarer Seite, gezählt im Hauptteil (<main>), relative Pfade
 * aufgelöst. Das Build-Audit des Pflege-Skills zählt nur absolute Links („/pfad“) – diese Seite
 * verlinkt relativ, dort stünde überall 0. Grenze: 3 eingehende Links (Crawl-Häufigkeit).
 *
 *   npm run build && node scripts/pruefe-verlinkung.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const DIST = 'dist'
const dateien = []
const gehe = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) gehe(p); else if (e.name.endsWith('.html') && e.name !== 'export.html') dateien.push(p) } }
gehe(DIST)
const route = (p) => ('/' + path.relative(DIST, p).split(path.sep).join('/')).replace(/(\/index)?\.html$/, '') || '/'
const seiten = new Map(dateien.map((f) => [route(f), { datei: f, html: fs.readFileSync(f, 'utf8') }]))
const ein = new Map([...seiten.keys()].map((r) => [r, new Set()]))
for (const [r, { datei, html }] of seiten) {
  const teil = (html.match(/<main[\s\S]*?<\/main>/) ?? [html])[0]
  const basis = new URL('https://x/' + path.relative(DIST, datei).split(path.sep).join('/'))
  for (const [, href] of teil.matchAll(/href="([^"#?]+)/g)) {
    if (/^(https?:|mailto:)/.test(href)) continue
    const ziel = new URL(href, basis).pathname.replace(/^\/[^/]*chart-race-studio/, '').replace(/(\/index)?\.html$/, '').replace(/\/$/, '') || '/'
    if (ein.has(ziel) && ziel !== r) ein.get(ziel).add(r)
  }
}
let schwach = 0
for (const [r, { html }] of [...seiten].sort()) {
  if (r === '/' || /name="robots" content="noindex/.test(html)) continue
  const n = ein.get(r).size
  if (n < 3) schwach++
  console.log(`${n < 3 ? '✗' : '✓'} ${String(n).padStart(2)}  ${r}`)
}
console.log(schwach ? `\n${schwach} Seiten mit weniger als 3 eingehenden Links.` : '\nAlle Seiten mit mindestens 3 eingehenden Links.')
process.exit(schwach ? 1 : 0)
