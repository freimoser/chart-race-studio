// Konsistenzprüfung der aktiven Seite: führt sites/<seite>/scripts/pruefe-konsistenz.mjs aus, falls vorhanden.
//   npm run check:daten
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { SITE, SITE_DIR } from './lib/site.mjs'

const skript = path.resolve(SITE_DIR, 'scripts/pruefe-konsistenz.mjs')
if (!fs.existsSync(skript)) console.log(`${SITE}: keine Konsistenzprüfung angelegt (sites/${SITE}/scripts/pruefe-konsistenz.mjs).`)
else await import(pathToFileURL(skript).href)
