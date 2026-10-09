/*
 * Statisches Balkenbild für Posts ohne Zeitreihe (eine Erhebung, ein Jahr): 1080 × 1350 (4:5, LinkedIn-Feed),
 * im Stil der Studio-Grafiken. Für Zeitreihen bleibt das Studio zuständig.
 *
 *   node scripts/balkenbild.mjs docs/linkedin/grafik-ueberstunden.json
 *
 * Die JSON-Datei nennt titel, untertitel, jahr, quelle, einheit (z. B. " %"), max (Achsenende) und balken
 * [{ name, wert }]. Das PNG landet neben der JSON-Datei. Eine Grafik, eine Aussage: alle Balken in einer
 * Farbe, Werte direkt am Balken, keine Legende.
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const CHROME = process.env.CHROME_BIN ?? [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium',
].find((p) => fs.existsSync(p))
if (!CHROME) { console.error('Kein Chrome gefunden. Pfad über CHROME_BIN setzen.'); process.exit(1) }
const quelle = process.argv[2]
if (!quelle) { console.error('Aufruf: node scripts/balkenbild.mjs <spec.json>'); process.exit(1) }

const L = JSON.parse(fs.readFileSync('src/content/legal.json', 'utf8'))
const S = JSON.parse(fs.readFileSync(quelle, 'utf8'))
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const FONT = pathToFileURL(path.resolve('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')).href
const zahl = (v) => v.toLocaleString('de-DE')
const max = S.max ?? Math.max(...S.balken.map((b) => b.wert))

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face { font-family: Inter; src: url('${FONT}') format('woff2'); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1080px; height: 1350px; font-family: Inter, sans-serif; background: #fff; color: #1d2329;
  padding: 72px 64px 56px; display: flex; flex-direction: column; }
.kopf { display: flex; justify-content: space-between; gap: 32px; align-items: flex-start; }
h1 { font-size: 58px; line-height: 1.1; font-weight: 750; letter-spacing: -0.02em; }
.jahr { font-feature-settings: 'tnum' 1; font-size: 112px; line-height: 0.9; font-weight: 750; color: #3d4248; }
.unter { margin-top: 24px; font-size: 30px; line-height: 1.35; color: #6e7681; max-width: 900px; }
.balken { margin-top: 80px; display: flex; flex-direction: column; gap: 46px; }
.name { font-size: 31px; font-weight: 600; line-height: 1.25; }
.zeile { margin-top: 14px; display: flex; align-items: center; gap: 20px; }
.spur { flex: 1; height: 44px; background: #eef1f3; border-radius: 4px; position: relative; }
.fuell { position: absolute; inset: 0 auto 0 0; background: #0f4c5c; border-radius: 4px; }
.wert { font-feature-settings: 'tnum' 1; width: 120px; text-align: right; font-size: 44px; font-weight: 750; }
.fuss { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; gap: 40px;
  font-size: 22px; line-height: 1.4; color: #6e7681; }
.autor { font-size: 28px; font-weight: 650; color: #5b6168; white-space: nowrap; }
</style></head><body>
<div class="kopf"><h1>${esc(S.titel)}</h1><div class="jahr">${esc(S.jahr)}</div></div>
<p class="unter">${esc(S.untertitel)}</p>
<div class="balken">
${S.balken.map((b) => `  <div><div class="name">${esc(b.name)}</div><div class="zeile"><div class="spur"><div class="fuell" style="width:${(b.wert / max * 100).toFixed(2)}%"></div></div><div class="wert">${zahl(b.wert)}${esc(S.einheit ?? '')}</div></div></div>`).join('\n')}
</div>
<div class="fuss"><div>${esc(S.quelle)}</div><div class="autor">${esc(L.operator)}</div></div>
</body></html>`

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'balken-'))
const f = path.join(tmp, 'bild.html')
fs.writeFileSync(f, html)
const ziel = quelle.replace(/\.json$/, '.png')
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1080,1350', `--screenshot=${path.resolve(ziel)}`, pathToFileURL(f).href], { stdio: 'ignore' })
fs.rmSync(tmp, { recursive: true, force: true })
console.log(`${ziel} erzeugt.`)
