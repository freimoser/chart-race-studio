// Erzeugt sites/<seite>/samples/data.ts aus den Rohdaten der Seite: führt sites/<seite>/scripts/build-samples.mjs aus.
//   npm run daten              (Seite aus SITE bzw. .seite)
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { SITE_DIR } from './lib/site.mjs'

await import(pathToFileURL(path.resolve(SITE_DIR, 'scripts/build-samples.mjs')).href)
