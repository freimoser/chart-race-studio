/*
 * Standbilder der eingebetteten Grafiken: das Schlussbild jeder animierten Grafik als WebP, in beiden Formaten
 * der Seite (16:9 ab 560 Pixel Rahmenbreite, darunter 4:5). build-artikel.mjs legt das Bild unter das iframe:
 * Wer die Seite öffnet, sieht es, bis die Grafik geladen ist, und Crawler, Bildersuche und Antwortmaschinen, die
 * kein JavaScript ausführen, bekommen ein Bild mit beschreibendem Alternativtext statt eines leeren Rahmens
 * (SEO-Prüfung 09.11.2026: „Grafiken für Crawler unsichtbar“).
 *
 *   SITE=<seite> npm run build && SITE=<seite> npm run preview      (läuft auf :4173)
 *   SITE=<seite> node scripts/grafik-standbilder.mjs [--basis http://localhost:4173/] [id …]
 *   danach erneut bauen, damit die Seiten die Bilder tragen
 *
 * Die Grafik zeigt bei „reduzierter Bewegung“ sofort das letzte Bild; das Skript stellt das im Browser ein und
 * entfernt das Abspielsymbol vor dem Foto. Ausgabe: sites/<seite>/public/grafik-bild/<id>[-<art>]-169.webp und -45.webp.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { starteChrome } from './lib/cdp.mjs'
import { sitePfad } from './lib/site.mjs'

const arg = (name, std) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : std }
const BASIS = arg('--basis', 'http://localhost:4173/').replace(/\/?$/, '/')
const NUR = process.argv.slice(2).filter((x, i, xs) => !x.startsWith('--') && xs[i - 1] !== '--basis')
const ZIEL = sitePfad('public/grafik-bild')

// Alle Grafiken, die die ausgelieferten Seiten einbetten, in ihrer Schreibweise (d=…&art=…).
const seiten = []
const gehe = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) gehe(p); else if (e.name.endsWith('.html')) seiten.push(p) } }
if (!fs.existsSync('dist')) { console.error('Kein dist/ – erst bauen.'); process.exit(1) }
gehe('dist')
const grafiken = new Map()
for (const p of seiten) for (const [, id, art] of fs.readFileSync(p, 'utf8').matchAll(/grafik\.html\?d=([a-z0-9-]+)(?:&(?:amp;)?art=([a-z]+))?/g)) {
  if (!NUR.length || NUR.includes(id)) grafiken.set(`${id}${art ? `-${art}` : ''}`, { id, art })
}

const FORMATE = [
  // Fenster wie der Rahmen im Artikel: Bühne plus 52 Pixel Bedienleiste, die nicht ins Bild kommt.
  { name: '169', breite: 704, hoehe: 396 + 52, skala: 1.5 },
  { name: '45', breite: 400, hoehe: 500 + 52, skala: 2 },
]
fs.mkdirSync(ZIEL, { recursive: true })
let n = 0
for (const f of FORMATE) {
  const b = await starteChrome({ breite: f.breite, hoehe: f.hoehe, skala: f.skala, port: 9351 })
  await b.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  try {
    for (const [name, g] of grafiken) {
      await b.oeffne(`${BASIS}grafik.html?d=${g.id}${g.art ? `&art=${g.art}` : ''}`, { warteMs: 2500 })
      const ok = await b.js(`(() => { document.querySelectorAll('span[aria-hidden].absolute').forEach((e) => e.remove()); return document.querySelectorAll('[data-buehne] svg *').length > 0 })()`)
      if (!ok) { console.log(`✗ ${name}: Grafik zeichnet nicht`); continue }
      const png = path.join(ZIEL, `${name}-${f.name}.png`)
      await b.foto(png, { selektor: '[data-buehne]' })
      execFileSync('cwebp', ['-quiet', '-q', '80', png, '-o', png.replace(/\.png$/, '.webp')])
      fs.rmSync(png)
      n++
      console.log(`✓ ${name}-${f.name}.webp`)
    }
  } finally { await b.ende() }
}
console.log(`${n} Standbilder in ${ZIEL}`)
