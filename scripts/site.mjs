/*
 * Bereitet den Arbeitsstand für eine Seite vor. Läuft vor `npm run dev` und `npm run build`.
 *
 *   SITE=humanmedizin node scripts/site.mjs
 *
 * 1. sites/aktiv zeigt auf sites/<seite> – nur für TypeScript und den Editor (Pfad-Alias @site).
 * 2. Die handgeschriebenen Seiten aus sites/<seite>/seiten/ werden in die Wurzel kopiert, weil Vite
 *    eine Seite unter dem Pfad ausliefert, unter dem sie im Projekt liegt. Die Kopien sind
 *    schreibgeschützt und stehen in .gitignore: Geändert wird immer das Original unter sites/.
 *    Was die vorige Seite kopiert hatte, wird vorher entfernt (Liste in .seite-aktiv.json).
 */
import fs from 'node:fs'
import path from 'node:path'
import { SITE, SITE_DIR } from './lib/site.mjs'

const AKTIV = path.join('sites', 'aktiv')
fs.rmSync(AKTIV, { force: true, recursive: true })
fs.symlinkSync(SITE, AKTIV)

const LISTE = '.seite-aktiv.json'
if (fs.existsSync(LISTE)) {
  for (const datei of JSON.parse(fs.readFileSync(LISTE, 'utf8')).dateien ?? []) fs.rmSync(datei, { force: true })
}
const QUELLE = path.join(SITE_DIR, 'seiten')
const dateien = []
const kopiere = (rel) => {
  const von = path.join(QUELLE, rel)
  if (fs.statSync(von).isDirectory()) return fs.readdirSync(von).forEach((f) => kopiere(path.join(rel, f)))
  fs.mkdirSync(path.dirname(rel) || '.', { recursive: true })
  fs.rmSync(rel, { force: true })
  fs.copyFileSync(von, rel)
  fs.chmodSync(rel, 0o444)
  dateien.push(rel)
}
if (fs.existsSync(QUELLE)) fs.readdirSync(QUELLE).forEach((f) => kopiere(f))
fs.writeFileSync(LISTE, JSON.stringify({ seite: SITE, dateien }, null, 2) + '\n')
console.log(`Seite: ${SITE} (${dateien.length} handgeschriebene Seiten aus ${QUELLE}/)`)
