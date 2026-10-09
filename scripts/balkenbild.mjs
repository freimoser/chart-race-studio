/*
 * Statische Bilder für Posts ohne Zeitreihe (eine Erhebung, ein Jahr): 1080 × 1350 (4:5, LinkedIn und Instagram),
 * im Stil der Studio-Grafiken. Für Zeitreihen bleibt das Studio zuständig.
 *
 *   node scripts/balkenbild.mjs docs/linkedin/grafik-ueberstunden.json     → grafik-ueberstunden.png
 *   node scripts/balkenbild.mjs docs/linkedin/karussell-ueberstunden.json  → karussell-ueberstunden-1.png … und .pdf
 *   node scripts/balkenbild.mjs docs/linkedin/karussell-ueberstunden.json --web public/beitrag/ueberstunden
 *                                                    → 1.png/1.webp … für den Artikel, ohne Zähler und „wischen“
 *
 * Eine Datei beschreibt ein Bild oder mit `folien: [...]` ein Karussell. Das PDF ist für LinkedIn (Karussell als
 * Dokument), die PNGs für Instagram. Eine Folie mit `aus: "<datei>.json"` übernimmt ein vorhandenes Einzelbild, so
 * stehen die Werte nur an einer Stelle.
 *
 * Arten (`art`):
 *   balken     (Standard) titel, untertitel, jahr, quelle, einheit, max, balken [{ name, wert }]
 *   gestapelt  wie balken, dazu teile [Name je Abschnitt], balken [{ name, zusatz, werte [je Abschnitt] }]
 *   text       titel, absaetze [...], hinweis, quelle
 * Eine Grafik, eine Aussage: Werte direkt am Balken, keine Achse; Quelle immer im Bild. Im Karussell zeigt jede
 * Folie oben, dass sie Teil einer Reihe ist (Leiste und „Bild 2 von 5“, auf Bild 1 „wischen →“).
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
const webZiel = process.argv.includes('--web') ? process.argv[process.argv.indexOf('--web') + 1] : null
if (!quelle) { console.error('Aufruf: node scripts/balkenbild.mjs <spec.json>'); process.exit(1) }

const L = JSON.parse(fs.readFileSync('src/content/legal.json', 'utf8'))
const lies = (f) => JSON.parse(fs.readFileSync(f, 'utf8'))
const S = lies(quelle)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const FONT = pathToFileURL(path.resolve('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')).href
const zahl = (v) => v.toLocaleString('de-DE')
const FARBEN = ['#0f4c5c', '#e36414']

// Genormter Rahmen (Regel seit 09.10.2026, CLAUDE.md): Jede Folie trägt unten das Band mit Logo, Name und Adresse
// der Seite. Die Arten setzen nur ihren Inhalt ein, Band und Quellenzeile bleiben überall gleich.
const LOGO = '<svg viewBox="0 0 28 28" width="52" height="52" aria-hidden="true"><rect width="28" height="28" rx="7" fill="#fff"/><rect x="6" y="7" width="16" height="3.2" rx="1.6" fill="#0f4c5c"/><rect x="6" y="12.4" width="11" height="3.2" rx="1.6" fill="#e36414"/><rect x="6" y="17.8" width="7" height="3.2" rx="1.6" fill="#0f4c5c" opacity=".75"/></svg>'
const ADRESSE = 'tiermedizin-in-zahlen.org'
const CSS = `
@font-face { font-family: Inter; src: url('${FONT}') format('woff2'); font-weight: 100 900; }
@page { size: 1080px 1350px; margin: 0; }
* { margin: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Inter, sans-serif; background: #fff; color: #1d2329; }
.seite { width: 1080px; height: 1350px; display: flex; flex-direction: column; overflow: hidden; break-after: page; }
.inhalt { flex: 1; padding: 72px 64px 32px; display: flex; flex-direction: column; }
.mit-reihe .inhalt { padding-top: 48px; }
.mit-reihe .balken { margin-top: 56px; gap: 34px; }
.reihe { display: flex; align-items: center; gap: 24px; margin-bottom: 40px; }
.segmente { flex: 1; display: flex; gap: 10px; }
.segmente i { flex: 1; height: 10px; border-radius: 5px; background: #e3e8ea; }
.segmente i.war { background: #0f4c5c; }
.segmente i.jetzt { background: #e36414; }
.zaehler { font-size: 26px; font-weight: 700; color: #0f4c5c; white-space: nowrap; font-feature-settings: 'tnum' 1; }
.kopf { display: flex; justify-content: space-between; gap: 32px; align-items: flex-start; }
h1 { font-size: 58px; line-height: 1.1; font-weight: 750; letter-spacing: -0.02em; }
.jahr { font-feature-settings: 'tnum' 1; font-size: 112px; line-height: 0.9; font-weight: 750; color: #3d4248; }
.unter { margin-top: 24px; font-size: 30px; line-height: 1.35; color: #6e7681; max-width: 900px; }
.balken { margin-top: 72px; display: flex; flex-direction: column; gap: 42px; }
.name { font-size: 31px; font-weight: 600; line-height: 1.25; }
.zusatz { font-size: 27px; font-weight: 500; color: #6e7681; margin-top: 6px; }
.zeile { margin-top: 14px; display: flex; align-items: center; gap: 20px; }
.spur { flex: 1; height: 44px; background: #eef1f3; border-radius: 4px; position: relative; }
.fuell { position: absolute; inset: 0 auto 0 0; background: #0f4c5c; border-radius: 4px; }
.wert { font-feature-settings: 'tnum' 1; width: 150px; text-align: right; font-size: 44px; font-weight: 750; white-space: nowrap; }
.legende { margin-top: 40px; display: flex; flex-direction: column; gap: 14px; font-size: 28px; font-weight: 600; }
.legende span { display: inline-block; width: 28px; height: 28px; border-radius: 4px; margin-right: 16px; vertical-align: -4px; }
.stapel { margin-top: 16px; height: 96px; display: flex; gap: 4px; }
.teil { border-radius: 4px; color: #fff; font-size: 38px; font-weight: 750; display: flex; align-items: center; padding-left: 22px; font-feature-settings: 'tnum' 1; white-space: nowrap; }
.gross { font-size: 76px; line-height: 1.08; font-weight: 750; letter-spacing: -0.02em; }
.absatz { margin-top: 40px; font-size: 40px; line-height: 1.38; color: #2b3138; }
.hinweis { margin-top: 56px; padding: 32px 36px; background: #eef5f4; border-left: 10px solid #0f4c5c; border-radius: 4px; font-size: 36px; line-height: 1.35; font-weight: 600; }
.quelle { margin-top: auto; padding-top: 24px; font-size: 22px; line-height: 1.4; color: #6e7681; }
.band { height: 112px; background: #0f4c5c; color: #fff; padding: 0 64px; display: flex; align-items: center; justify-content: space-between; border-top: 8px solid #e36414; }
.marke { display: flex; align-items: center; gap: 18px; font-size: 32px; font-weight: 700; letter-spacing: -0.01em; }
.adresse { font-size: 30px; font-weight: 600; color: #9adbcf; }`

const kopf = (F) => `<div class="kopf"><h1>${esc(F.titel)}</h1>${F.jahr ? `<div class="jahr">${esc(F.jahr)}</div>` : ''}</div>
${F.untertitel ? `<p class="unter">${esc(F.untertitel)}</p>` : ''}`

const ARTEN = {
  balken: (F) => {
    const max = F.max ?? Math.max(...F.balken.map((b) => b.wert))
    return `${kopf(F)}
<div class="balken">
${F.balken.map((b) => `  <div><div class="name">${esc(b.name)}</div><div class="zeile"><div class="spur"><div class="fuell" style="width:${(b.wert / max * 100).toFixed(2)}%"></div></div><div class="wert">${zahl(b.wert)}${esc(F.einheit ?? '')}</div></div></div>`).join('\n')}
</div>`
  },
  gestapelt: (F) => {
    const max = F.max ?? Math.max(...F.balken.map((b) => b.werte.reduce((x, y) => x + y, 0)))
    return `${kopf(F)}
<div class="legende">${F.teile.map((t, i) => `<div><span style="background:${FARBEN[i]}"></span>${esc(t)}</div>`).join('')}</div>
<div class="balken">
${F.balken.map((b) => {
    const summe = b.werte.reduce((x, y) => x + y, 0)
    return `  <div><div class="name">${esc(b.name)}</div>${b.zusatz ? `<div class="zusatz">${esc(b.zusatz)}</div>` : ''}
    <div class="stapel" style="width:${(summe / max * 100).toFixed(2)}%">${b.werte.map((w, i) => `<div class="teil" style="flex:${w};background:${FARBEN[i]}">${zahl(w)}${esc(F.einheit ?? '')}</div>`).join('')}</div></div>`
  }).join('\n')}
</div>`
  },
  text: (F) => `<h2 class="gross">${esc(F.titel)}</h2>
${(F.absaetze ?? []).map((a) => `<p class="absatz">${esc(a)}</p>`).join('\n')}
${F.hinweis ? `<p class="hinweis">${esc(F.hinweis)}</p>` : ''}`,
}

// Reihe oben: Leiste mit einem Abschnitt je Folie und „Bild n von m“. Fehlt bei Einzelbildern und im Web-Modus.
const reihe = (nr, gesamt) => `<div class="reihe"><div class="segmente">${Array.from({ length: gesamt }, (_, i) => `<i class="${i + 1 < nr ? 'war' : i + 1 === nr ? 'jetzt' : ''}"></i>`).join('')}</div><span class="zaehler">Bild ${nr} von ${gesamt}${nr === 1 ? ' · wischen →' : ''}</span></div>`
const seite = (F, nr = 0, gesamt = 0) => {
  const art = ARTEN[F.art ?? 'balken']
  if (!art) throw new Error(`Unbekannte Art „${F.art}“`)
  if (!F.quelle) throw new Error(`Folie „${F.titel}“ ohne Quelle – kein Bild ohne Quelle im Bild.`)
  return `<section class="seite${gesamt > 1 ? ' mit-reihe' : ''}"><div class="inhalt">
${gesamt > 1 ? reihe(nr, gesamt) : ''}${art(F)}
<p class="quelle">${esc(F.quelle)} · ${F.art === 'text' ? '' : 'Grafik: '}${esc(L.operator)}</p>
</div>
<div class="band"><div class="marke">${LOGO}${esc(L.siteName)}</div><div class="adresse">${ADRESSE}</div></div></section>`
}
const dokument = (seiten) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${seiten.join('\n')}</body></html>`

// `web` in einer Folie ersetzt im Web-Modus einzelne Felder (etwa „Schreibt in die Kommentare“, das es auf der Seite nicht gibt).
const folien = (S.folien ?? [S]).map((F) => (F.aus ? lies(path.join(path.dirname(quelle), F.aus)) : F)).map((F) => (webZiel && F.web ? { ...F, ...F.web } : F))
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bild-'))
const chrome = (args, html) => {
  const f = path.join(tmp, 'bild.html')
  fs.writeFileSync(f, html)
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', ...args, pathToFileURL(f).href], { stdio: 'ignore' })
}
const basis = quelle.replace(/\.json$/, '')
const n = S.folien ? folien.length : 0
const ziele = []
if (webZiel) {
  // Für den Artikel: ohne Reihe (auf der Seite wird nicht gewischt), PNG für die Maße und WebP zum Ausliefern.
  fs.mkdirSync(webZiel, { recursive: true })
  folien.forEach((F, i) => {
    const png = path.join(webZiel, `${i + 1}.png`)
    chrome(['--window-size=1080,1350', `--screenshot=${path.resolve(png)}`], dokument([seite(F)]))
    execFileSync('cwebp', ['-quiet', '-q', '88', png, '-o', png.replace(/\.png$/, '.webp')])
    ziele.push(png, png.replace(/\.png$/, '.webp'))
  })
} else {
  folien.forEach((F, i) => {
    const ziel = S.folien ? `${basis}-${i + 1}.png` : `${basis}.png`
    chrome(['--window-size=1080,1350', `--screenshot=${path.resolve(ziel)}`], dokument([seite(F, i + 1, n)]))
    ziele.push(ziel)
  })
  if (S.folien) {
    chrome([`--print-to-pdf=${path.resolve(basis + '.pdf')}`, '--no-pdf-header-footer'], dokument(folien.map((F, i) => seite(F, i + 1, n))))
    ziele.push(`${basis}.pdf`)
  }
}
fs.rmSync(tmp, { recursive: true, force: true })
console.log(`${ziele.join(', ')} erzeugt.`)
