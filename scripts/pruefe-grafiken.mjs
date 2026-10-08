/**
 * Öffnet jede eingebettete Grafik des Builds (grafik.html?d=…, wie sie in den Seiten steht) in Chrome und
 * prüft, dass sie zeichnet: ein SVG mit Inhalt in der Bühne, kein JavaScript-Fehler, kein Hinweis
 * „nicht freigegeben“. Dazu ein gesperrter Datensatz als Gegenprobe.
 *
 *   npm run build && npm run preview        (läuft auf :4173)
 *   node scripts/pruefe-grafiken.mjs [--basis http://localhost:4173/]
 */
import fs from 'node:fs'
import path from 'node:path'
import { starteChrome } from './lib/cdp.mjs'

const arg = (name, std) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : std }
const BASIS = arg('--basis', 'http://localhost:4173/').replace(/\/?$/, '/')

// Alle Grafik-Adressen aus den ausgelieferten Seiten, in ihrer Schreibweise (mit &art=…).
const seiten = []
const gehe = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) gehe(p); else if (e.name.endsWith('.html')) seiten.push(p) } }
gehe('dist')
const adressen = new Set()
for (const p of seiten) for (const [, q] of fs.readFileSync(p, 'utf8').matchAll(/grafik\.html\?(d=[a-z0-9-]+(?:&(?:amp;)?art=[a-z]+)?)/g)) adressen.add(q.replace('&amp;', '&'))
// Jeder freigegebene Datensatz auch ohne Seite, die ihn einbettet: Das Studio verlinkt ihn.
for (const f of fs.readdirSync('dist/grafik-daten')) adressen.add(`d=${f.replace(/\.json$/, '')}`)

const b = await starteChrome({ breite: 1024, hoehe: 700, skala: 1, port: 9344 })
let fehlerZahl = 0
try {
  for (const q of [...adressen].sort()) {
    await b.oeffne(`${BASIS}grafik.html?${q}`, { warteMs: 2500 })
    const r = await b.js(`({ inhalt: document.querySelectorAll('[data-buehne] svg *').length, gesperrt: document.body.innerText.includes('nicht freigegeben') })`)
    const ok = r.inhalt > 0 && !r.gesperrt
    if (!ok) fehlerZahl++
    console.log(`${ok ? '✓' : '✗'} ${q}: ${r.inhalt} SVG-Elemente${r.gesperrt ? ', „nicht freigegeben“' : ''}`)
  }
  // Gegenprobe: ein Datensatz ohne Datei muss den Hinweis zeigen, nicht leer bleiben.
  await b.oeffne(`${BASIS}grafik.html?d=gibt-es-nicht`, { warteMs: 1500 })
  const gegen = await b.js(`document.body.innerText.includes('nicht freigegeben')`)
  if (!gegen) fehlerZahl++
  console.log(`${gegen ? '✓' : '✗'} Gegenprobe d=gibt-es-nicht zeigt „nicht freigegeben“`)
  for (const f of b.fehler()) { fehlerZahl++; console.log('✗ JS-Fehler:', JSON.stringify(f.params).slice(0, 200)) }
} finally { await b.ende() }
console.log(fehlerZahl ? `\n${fehlerZahl} Fehler.` : `\nAlle ${adressen.size} Grafiken zeichnen.`)
process.exit(fehlerZahl ? 1 : 0)
