// Welche Seite gebaut wird. Ein Repo, mehrere Seiten: Der Kern (src/, scripts/) ist gemeinsam, alles
// Seitenspezifische liegt unter sites/<seite>/ (Profil, Inhalte, Datensätze, Rohdaten, öffentliche Dateien).
//
//   SITE=tiermedizin   (Standard)  → tiermedizin-in-zahlen.org
//   SITE=humanmedizin              → humanmedizin-in-zahlen.org
//
// Jedes Skript, das Inhalte liest oder schreibt, nimmt seine Pfade von hier, nie fest verdrahtet.
// Mehr dazu: docs/ARCHITEKTUR.md.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const SITE = process.env.SITE || 'tiermedizin'
export const SITE_DIR = path.join('sites', SITE)
if (!fs.existsSync(path.join(SITE_DIR, 'profil.ts'))) {
  throw new Error(`SITE=${SITE}: sites/${SITE}/profil.ts fehlt. Vorhanden: ${fs.readdirSync('sites').filter((d) => fs.existsSync(path.join('sites', d, 'profil.ts'))).join(', ')}`)
}

/** Pfad innerhalb der aktiven Seite, relativ zum Repo. */
export const sitePfad = (...teile) => path.join(SITE_DIR, ...teile)

/** TypeScript-Modul der aktiven Seite laden (Node entfernt die Typen selbst). */
export const ladeSeitenModul = (rel) => import(pathToFileURL(path.resolve(SITE_DIR, rel)).href)

/** Profil der aktiven Seite: Marke, Domain, Texte der Rahmenseiten. Typ: src/content/profil.ts. */
export const PROFIL = (await ladeSeitenModul('profil.ts')).default
