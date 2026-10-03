/*
 * Mobilprüfung: lädt jede Seite in einem schmalen Telefon-Viewport (360 × 780, Touch) und meldet,
 * was dort kaputtgeht – waagrechtes Scrollen der ganzen Seite, Elemente, die rechts aus dem Bild
 * ragen, zu kleine Schrift und zu kleine Tippziele. Optional ein Bildschirmfoto je Seite.
 *
 *   npm run dev                       (läuft auf :5173)
 *   node scripts/pruefe-mobil.mjs     [--fotos ordner] [--basis http://localhost:5173/]
 *
 * Gemessen wird im Browser, nicht im Quelltext: Ob eine Tabelle überläuft, hängt an Schrift, Text
 * und Viewport zusammen. Exit 1, sobald eine Seite waagrecht scrollt oder etwas aus dem Bild ragt.
 */
import fs from 'node:fs'
import path from 'node:path'
import { starteChrome } from './lib/cdp.mjs'

const arg = (name, std) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : std }
const BASIS = arg('--basis', 'http://localhost:5173/').replace(/\/?$/, '/')
const FOTOS = arg('--fotos', '')
const BREITE = Number(arg('--breite', 360))

// Alle statischen Seiten aus den Indizes, dazu Studio und Plan in ihren Zuständen.
const artikel = JSON.parse(fs.readFileSync('src/content/artikel-index.json', 'utf8')).filter((a) => a.live)
const datenformat = JSON.parse(fs.readFileSync('src/content/datenformat-index.json', 'utf8')).filter((d) => d.bereit)
const SEITEN = [
  ['start', ''],
  ['artikel-uebersicht', 'beitrag/'],
  ...artikel.map((a) => [`artikel-${a.slug}`, `beitrag/${a.slug}.html`]),
  ['tierarztketten', 'artikel/tierarztketten-deutschland.html'],
  ['datenherkunft', 'artikel/datenherkunft.html'],
  ...datenformat.map((d) => [`datenformat-${d.slug}`, d.pfad]),
  ['impressum', 'impressum.html'],
  ['datenschutz', 'datenschutz.html'],
  ['studio-leer', 'studio/'],
  ['studio-beispiel', 'studio/?beispiel=geschlecht-praxis'],
  ['redaktionsplan', 'studio/#redaktionsplan'],
]

// Läuft im Browser. Elemente in einem eigenen waagrechten Scrollbereich (Tabellen, Code) dürfen
// breiter sein als der Bildschirm – genau dafür gibt es den Bereich.
const MESSUNG = `(() => {
  const vw = document.documentElement.clientWidth
  const inScroller = (e) => { for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') return true } return false }
  const sichtbar = (e) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && r.width > 0 && r.height > 0 }
  const name = (e) => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\\s+/).slice(0, 2).join('.') : '')
  const text = (e) => (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\\s+/g, ' ').slice(0, 40)
  const ueberstand = []
  for (const e of document.querySelectorAll('body *')) {
    if (!sichtbar(e) || inScroller(e)) continue
    const r = e.getBoundingClientRect()
    if (r.right > vw + 1 || r.left < -1) ueberstand.push(name(e) + ' „' + text(e) + '“ ' + Math.round(r.left) + '…' + Math.round(r.right) + 'px')
  }
  const klein = []
  for (const e of document.querySelectorAll('p, li, a, button, td, th, span, label')) {
    if (!sichtbar(e) || !e.childNodes.length || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue
    if (e.closest('[data-buehne], svg, iframe')) continue
    const fs = parseFloat(getComputedStyle(e).fontSize)
    if (fs < 11) klein.push(name(e) + ' „' + text(e) + '“ ' + fs + 'px')
  }
  const tippen = []
  for (const e of document.querySelectorAll('a, button, input, select, [role=tab]')) {
    if (!sichtbar(e) || e.closest('p, li, td, .kasten, footer, figcaption, .meta, .liste')) continue
    const r = e.getBoundingClientRect()
    if (r.height < 32 && r.width < 200) tippen.push(name(e) + ' „' + text(e) + '“ ' + Math.round(r.width) + '×' + Math.round(r.height))
  }
  return { scrollt: document.documentElement.scrollWidth > vw + 1, breite: document.documentElement.scrollWidth, vw, ueberstand: ueberstand.slice(0, 8), klein: klein.slice(0, 6), tippen: tippen.slice(0, 6) }
})()`

const b = await starteChrome({ breite: BREITE, hoehe: 780, skala: 2, mobil: true, port: 9344 })
let fehler = 0
try {
  for (const [name, pfad] of SEITEN) {
    await b.oeffne(BASIS + pfad, { warteMs: pfad.startsWith('studio') ? 2500 : 900 })
    const m = await b.js(MESSUNG)
    const kaputt = m.scrollt || m.ueberstand.length
    if (kaputt) fehler++
    console.log(`${kaputt ? '✗' : '✓'} ${name}${m.scrollt ? `  scrollt waagrecht (${m.breite} > ${m.vw}px)` : ''}`)
    for (const u of m.ueberstand) console.log(`    ragt hinaus: ${u}`)
    for (const k of m.klein) console.log(`    Hinweis, Schrift < 11px: ${k}`)
    for (const t of m.tippen) console.log(`    Hinweis, Tippziel < 32px: ${t}`)
    if (FOTOS) {
      const hoehe = await b.js('Math.min(document.documentElement.scrollHeight, 6000)')
      await b.cdp('Emulation.setDeviceMetricsOverride', { width: BREITE, height: hoehe, deviceScaleFactor: 1, mobile: true })
      await b.warte(300)
      await b.foto(path.join(FOTOS, `${name}.png`))
      await b.cdp('Emulation.setDeviceMetricsOverride', { width: BREITE, height: 780, deviceScaleFactor: 2, mobile: true })
    }
  }
  const js = b.fehler()
  if (js.length) console.log(`\nJavaScript-Fehler: ${js.length}`)
} finally { await b.ende() }
console.log(fehler ? `\n${fehler} Seiten mit Problemen auf ${BREITE}px.` : `\nAlle Seiten auf ${BREITE}px ohne Überlauf.`)
process.exit(fehler ? 1 : 0)
