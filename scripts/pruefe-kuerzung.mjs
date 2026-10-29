/*
 * Kürzungsprüfung: lädt jeden Beispiel-Datensatz der Seite im Studio, schaltet nacheinander die Videoformate 4:5, 1:1,
 * 16:9 und 9:16 und meldet jeden Text auf der Bühne, der mit „…“ abgeschnitten ist – Titel, Untertitel, Quelle,
 * Reihennamen. Abgeschnittene Texte fallen im Studio kaum auf, im fertigen Video aber sofort.
 *
 *   npm run dev   (zweites Terminal, dieselbe Seite)
 *   SITE=<seite> STUDIO_URL=http://localhost:5173/studio/ node scripts/pruefe-kuerzung.mjs [datensatz …]
 *
 * Exit 1, wenn irgendwo gekürzt wird.
 */
import fs from 'node:fs'
import { starteChrome } from './lib/cdp.mjs'
import { sitePfad } from './lib/site.mjs'

const URL = process.env.STUDIO_URL ?? 'http://localhost:5173/studio/'
const FORMATE = ['4:5', '1:1', '16:9', '9:16']
const alle = [...fs.readFileSync(sitePfad('samples/index.ts'), 'utf8').matchAll(/^ {4}id: '([a-z0-9-]+)'/gm)].map((m) => m[1])
const DATENSAETZE = process.argv.slice(2).length ? process.argv.slice(2) : alle

const b = await starteChrome({ breite: 1440, hoehe: 900, skala: 1, port: 9359 })
let fehler = 0
try {
  for (const id of DATENSAETZE) {
    await b.oeffne(`${URL}?beispiel=${id}`, { warteMs: 2500 })
    const gekuerzt = []
    for (const format of FORMATE) {
      await b.js(`window.__crs.useApp.getState().updateSettings({ format: '${format}' })`)
      await b.warte(600)
      const t = await b.js(`[...document.querySelectorAll('[data-buehne] *')].filter((e) => !e.children.length).map((e) => (e.textContent || '').trim()).filter((x) => x.includes('…'))`)
      for (const x of t) gekuerzt.push(`${format}: ${x.replace(/\s+/g, ' ')}`)
    }
    if (gekuerzt.length) fehler++
    console.log(`${gekuerzt.length ? '✗' : '✓'} ${id}`)
    for (const g of gekuerzt.slice(0, 6)) console.log(`    ${g}`)
  }
} finally { await b.ende() }
console.log(fehler ? `\n${fehler} Datensätze mit gekürzten Texten.` : `\nKeine gekürzten Texte in ${DATENSAETZE.length} Datensätzen.`)
process.exit(fehler ? 1 : 0)
