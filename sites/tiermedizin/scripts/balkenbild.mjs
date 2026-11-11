/*
 * Statische Bilder für Posts ohne Zeitreihe (eine Erhebung, ein Jahr): 1080 × 1350 (4:5, LinkedIn und Instagram),
 * im Stil der Studio-Grafiken. Für Zeitreihen bleibt das Studio zuständig.
 *
 *   node sites/tiermedizin/scripts/balkenbild.mjs sites/tiermedizin/docs/linkedin/grafik-ueberstunden.json     → grafik-ueberstunden.png
 *   node sites/tiermedizin/scripts/balkenbild.mjs sites/tiermedizin/docs/linkedin/karussell-ueberstunden.json  → karussell-ueberstunden-1.png … und .pdf
 *   node sites/tiermedizin/scripts/balkenbild.mjs sites/tiermedizin/docs/linkedin/karussell-ueberstunden.json --web sites/tiermedizin/public/beitrag/ueberstunden
 *                                                    → 1.png/1.webp … für den Artikel, ohne Zähler und „wischen“
 *   node sites/tiermedizin/scripts/balkenbild.mjs sites/tiermedizin/docs/linkedin/karussell-gehalt.json --reel → karussell-gehalt-reel-1.png … (Zähler ohne „wischen“)
 *
 * Eine Datei beschreibt ein Bild oder mit `folien: [...]` ein Karussell. Das PDF ist für LinkedIn (Karussell als
 * Dokument), die PNGs für Instagram. Eine Folie mit `aus: "<datei>.json"` übernimmt ein vorhandenes Einzelbild, so
 * stehen die Werte nur an einer Stelle.
 *
 * `serie` (alle Arten): Kennzeile über dem Titel, z. B. „Europa im Vergleich · 1/5“.
 * Arten (`art`):
 *   balken     (Standard) titel, untertitel, jahr, quelle, einheit, max, balken [{ name, wert }]
 *   gestapelt  wie balken, dazu teile [Name je Abschnitt], balken [{ name, zusatz, werte [je Abschnitt] }]
 *   paare      zwei Balken je Zeile zum Vergleich: teile [Name je Balken], balken [{ name, werte [a, b] }]
 *   text       titel, absaetze [...], hinweis, quelle
 *   karte      Europakarte wie ein Choroplethenbild: titel, untertitel, quelle, einheit, stufen [{ ab, name }] aufsteigend,
 *              werte { ISO-2: Zahl }, hervor (ISO-2, orange umrandet); Länder ohne Wert grau, Grund in der Quellenzeile.
 *              Festes Layout für alle Karten: Kennzeile, Titel, Untertitel oben links, Legende unten links; im Karussell
 *              steht „Bild x von y“ in der Kennzeile.
 *              markiert [ISO-2] (Zahl mit *), ohneZahl [ISO-2] (eingefärbt, nicht beschriftet, z. B. Island unter dem Titel), lage { ISO-2: { dx, dy, kasten } } verschiebt Beschriftungen kleiner Länder (mit Linie zum Land).
 *              Grenzen: sites/tiermedizin/data/geo/europa-50m.geojson (Natural Earth, gemeinfrei).
 * Eine Grafik, eine Aussage: Werte direkt am Balken, keine Achse; Quelle immer im Bild. Im Karussell zeigt jede
 * Folie oben, dass sie Teil einer Reihe ist (Leiste und „Bild 2 von 5“, auf Bild 1 „wischen →“).
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { geoAzimuthalEqualArea, geoPath } from 'd3-geo'

const CHROME = process.env.CHROME_BIN ?? [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium',
].find((p) => fs.existsSync(p))
if (!CHROME) { console.error('Kein Chrome gefunden. Pfad über CHROME_BIN setzen.'); process.exit(1) }
const quelle = process.argv[2]
const webZiel = process.argv.includes('--web') ? process.argv[process.argv.indexOf('--web') + 1] : null
// --reel: Bilder für ein Video (Reel) mit Leiste und Zähler, aber ohne „wischen“ und ohne PDF: <name>-reel-1.png …
const reel = process.argv.includes('--reel')
if (!quelle) { console.error('Aufruf: node sites/tiermedizin/scripts/balkenbild.mjs <spec.json>'); process.exit(1) }

const L = JSON.parse(fs.readFileSync('sites/tiermedizin/content/legal.json', 'utf8'))
const lies = (f) => JSON.parse(fs.readFileSync(f, 'utf8'))
const S = lies(quelle)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const FONT = pathToFileURL(path.resolve('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')).href
// `dezimalen` je Folie: feste Nachkommastellen, etwa 2 für Euro-Beträge (21,30 statt 21,3).
const zahl = (v, d) => v.toLocaleString('de-DE', d == null ? {} : { minimumFractionDigits: d, maximumFractionDigits: d })
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
.inhalt { flex: 1; min-height: 0; padding: 72px 64px 32px; display: flex; flex-direction: column; }
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
.zeile.eng { margin-top: 6px; }
.zeile.eng .spur { height: 30px; }
.zeile.eng .wert { font-size: 34px; }
.balken.paare { gap: 22px; margin-top: 32px; }
.wert { font-feature-settings: 'tnum' 1; width: 180px; text-align: right; font-size: 44px; font-weight: 750; white-space: nowrap; }
.legende { margin-top: 40px; display: flex; flex-direction: column; gap: 14px; font-size: 28px; font-weight: 600; }
.legende span { display: inline-block; width: 28px; height: 28px; border-radius: 4px; margin-right: 16px; vertical-align: -4px; }
.stapel { margin-top: 16px; height: 96px; display: flex; gap: 4px; }
.teil { border-radius: 4px; color: #fff; font-size: 38px; font-weight: 750; display: flex; align-items: center; padding-left: 22px; font-feature-settings: 'tnum' 1; white-space: nowrap; }
.gross { font-size: 76px; line-height: 1.08; font-weight: 750; letter-spacing: -0.02em; }
.absatz { margin-top: 40px; font-size: 40px; line-height: 1.38; color: #2b3138; }
.hinweis { margin-top: 56px; padding: 32px 36px; background: #eef5f4; border-left: 10px solid #0f4c5c; border-radius: 4px; font-size: 36px; line-height: 1.35; font-weight: 600; }
.quelle { margin-top: auto; padding-top: 24px; font-size: 22px; line-height: 1.4; color: #6e7681; }
.band { flex-shrink: 0; height: 112px; background: #0f4c5c; color: #fff; padding: 0 64px; display: flex; align-items: center; justify-content: space-between; border-top: 8px solid #e36414; }
.marke { display: flex; align-items: center; gap: 18px; font-size: 32px; font-weight: 700; letter-spacing: -0.01em; }
.adresse { font-size: 30px; font-weight: 600; color: #9adbcf; }
.serie { font-size: 22px; font-weight: 750; color: #e36414; letter-spacing: .05em; text-transform: uppercase; margin-bottom: 12px; }
.karte .inhalt { position: relative; padding: 56px 56px 28px; }
.karte .inhalt > *:not(svg) { position: relative; }
.karte svg.land { position: absolute; inset: 0; }
.karte .serie { margin-bottom: 14px; }
.karte h1 { font-size: 54px; max-width: 420px; }
.karte .unter { font-size: 25px; max-width: 200px; margin-top: 14px; color: #3d4248; }
.karte .inhalt > .legende { position: absolute; left: 56px; top: 910px; margin: 0; gap: 12px; font-size: 27px; }
.karte .legende span { width: 44px; height: 30px; }
.karte .quelle { color: #4d555e; font-size: 20px; background: rgba(255,255,255,.88); margin: auto -56px -28px; padding: 14px 56px 18px; }`

const kopf = (F) => `${F.serie ? `<div class="serie">${esc(F.serie)}</div>` : ''}<div class="kopf"><h1>${esc(F.titel)}</h1>${F.jahr ? `<div class="jahr">${esc(F.jahr)}</div>` : ''}</div>
${F.untertitel ? `<p class="unter">${esc(F.untertitel)}</p>` : ''}`

const ARTEN = {
  balken: (F) => {
    const max = F.max ?? Math.max(...F.balken.map((b) => b.wert))
    return `${kopf(F)}
<div class="balken">
${F.balken.map((b) => `  <div><div class="name">${esc(b.name)}</div><div class="zeile"><div class="spur"><div class="fuell" style="width:${(b.wert / max * 100).toFixed(2)}%"></div></div><div class="wert">${zahl(b.wert, F.dezimalen)}${esc(F.einheit ?? '')}</div></div></div>`).join('\n')}
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
    <div class="stapel" style="width:${(summe / max * 100).toFixed(2)}%">${b.werte.map((w, i) => `<div class="teil" style="flex:${w};background:${FARBEN[i]}">${zahl(w, F.dezimalen)}${esc(F.einheit ?? '')}</div>`).join('')}</div></div>`
  }).join('\n')}
</div>`
  },
  paare: (F) => {
    const max = F.max ?? Math.max(...F.balken.flatMap((b) => b.werte))
    return `${kopf(F)}
<div class="legende">${F.teile.map((t, i) => `<div><span style="background:${FARBEN[i]}"></span>${esc(t)}</div>`).join('')}</div>
<div class="balken paare">
${F.balken.map((b) => `  <div><div class="name">${esc(b.name)}</div>${b.werte.map((w, i) => `<div class="zeile eng"><div class="spur"><div class="fuell" style="width:${(w / max * 100).toFixed(2)}%;background:${FARBEN[i]}"></div></div><div class="wert">${zahl(w, F.dezimalen)}${esc(F.einheit ?? '')}</div></div>`).join('')}</div>`).join('\n')}
</div>`
  },
  karte: (F) => {
    const geo = lies('sites/tiermedizin/data/geo/europa-50m.geojson')
    const B = 1080, H = 1350 - 112
    // Flächentreue Projektion mit Mittelpunkt Mitteleuropa; der Ausschnitt reicht von Portugal bis Zypern und Finnland.
    // Der Norden darf oben aus dem Bild laufen, damit Mittel- und Südeuropa groß genug für die Zahlen werden.
    const ecken = { type: 'MultiPoint', coordinates: F.ausschnitt ?? [[-9.5, 37], [-9, 43.5], [34.6, 34.6], [26, 35], [14.5, 35.8], [28, 62], [5, 61]] }
    const proj = geoAzimuthalEqualArea().rotate([-12, -52]).fitExtent([[F.rand ?? 24, 40], [B - 12, H - 130]], ecken)
    const pfad = geoPath(proj)
    const stufen = F.stufen
    const stufe = (v) => stufen.reduce((s, st, i) => (v >= st.ab ? i : s), 0)
    const FL = ['#d4e9e6', '#8fc6be', '#3a8a86', '#0f4c5c']
    const TX = ['#1d2329', '#1d2329', '#fff', '#fff']
    const flaechen = [], schrift = []
    for (const f of geo.features) {
      const id = f.properties.id === 'CYN' ? 'CY-N' : f.properties.id
      const v = F.werte[id]
      const hat = v != null
      flaechen.push(`<path d="${pfad(f)}" fill="${hat ? FL[stufe(v)] : '#d9dcdf'}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>`)
      if (!hat || F.ohneZahl?.includes(id)) continue
      // Beschriftung im größten Teil des Landes (Frankreich ohne Korsika, Norwegen ohne Inseln).
      const teile = f.geometry.coordinates.map((c) => ({ type: 'Polygon', coordinates: c }))
      const gross = teile.reduce((a, b) => (pfad.area(b) > pfad.area(a) ? b : a))
      let [x, y] = pfad.centroid(gross)
      const L = F.lage?.[id] ?? {}
      if (L.x != null) [x, y] = proj([L.x, L.y])
      const groesse = L.groesse ?? Math.max(24, Math.min(66, Math.sqrt(pfad.area(gross)) / 4.2))
      const text = zahl(v, F.dezimalen) + (F.markiert?.includes(id) ? '*' : '')
      if (L.kasten) {
        const [ax, ay] = [x, y]
        x += L.dx; y += L.dy
        const w = text.length * groesse * 0.62 + 20, h = groesse + 14
        schrift.push(`<line x1="${ax}" y1="${ay}" x2="${x}" y2="${y}" stroke="#3d4248" stroke-width="2"/><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="5" fill="${FL[stufe(v)]}" stroke="#fff" stroke-width="2.5"/>`)
        schrift.push(`<text x="${x}" y="${y}" font-size="${groesse}" fill="${TX[stufe(v)]}">${text}</text>`)
      } else {
        x += L.dx ?? 0; y += L.dy ?? 0
        schrift.push(`<text x="${x}" y="${y}" font-size="${groesse}" fill="${TX[stufe(v)]}" stroke="${FL[stufe(v)]}" stroke-width="5" paint-order="stroke"${L.drehen ? ` transform="rotate(${L.drehen} ${x} ${y})"` : ''}>${text}</text>`)
      }
    }
    const hervor = F.hervor ? geo.features.find((f) => f.properties.id === F.hervor) : null
    const svg = `<svg class="land" width="${B}" height="${H}" viewBox="0 0 ${B} ${H}">
<rect width="${B}" height="${H}" fill="#f4f7f8"/>
${flaechen.join('')}
${hervor ? `<path d="${pfad(hervor)}" fill="none" stroke="#e36414" stroke-width="5" stroke-linejoin="round"/>` : ''}
<g font-family="Inter" font-weight="750" text-anchor="middle" dominant-baseline="central" style="font-feature-settings:'tnum' 1">${schrift.join('')}</g>
</svg>`
    return `${svg}${kopf(F)}
<div class="legende">${[...stufen].reverse().map((st, i) => `<div><span style="background:${FL[stufen.length - 1 - i]}"></span>${esc(st.name)}</div>`).join('')}</div>`
  },
  text: (F) => `<h2 class="gross">${esc(F.titel)}</h2>
${(F.absaetze ?? []).map((a) => `<p class="absatz">${esc(a)}</p>`).join('\n')}
${F.hinweis ? `<p class="hinweis">${esc(F.hinweis)}</p>` : ''}`,
}

// Reihe oben: Leiste mit einem Abschnitt je Folie und „Bild n von m“. Fehlt bei Einzelbildern und im Web-Modus.
const reihe = (nr, gesamt) => `<div class="reihe"><div class="segmente">${Array.from({ length: gesamt }, (_, i) => `<i class="${i + 1 < nr ? 'war' : i + 1 === nr ? 'jetzt' : ''}"></i>`).join('')}</div><span class="zaehler">Bild ${nr} von ${gesamt}${nr === 1 && !reel ? ' · wischen →' : ''}</span></div>`
// Karten und Folien mit Kennzeile (`serie`) zeigen „Bild x von y“ in der Kennzeile statt in der Leiste – gleiches Layout.
const inKennzeile = (F) => F.art === 'karte' || Boolean(F.serie)
const seite = (F, nr = 0, gesamt = 0) => {
  const art = ARTEN[F.art ?? 'balken']
  if (!art) throw new Error(`Unbekannte Art „${F.art}“`)
  if (!F.quelle) throw new Error(`Folie „${F.titel}“ ohne Quelle – kein Bild ohne Quelle im Bild.`)
  return `<section class="seite${gesamt > 1 && !inKennzeile(F) ? ' mit-reihe' : ''}${F.art === 'karte' ? ' karte' : ''}"><div class="inhalt">
${gesamt > 1 && !inKennzeile(F) ? reihe(nr, gesamt) : ''}${art(inKennzeile(F) && gesamt > 1 ? { ...F, serie: [F.serie, `Bild ${nr} von ${gesamt}`].filter(Boolean).join(' · ') } : F)}
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
    const ziel = S.folien ? `${basis}${reel ? '-reel' : ''}-${i + 1}.png` : `${basis}.png`
    chrome(['--window-size=1080,1350', `--screenshot=${path.resolve(ziel)}`], dokument([seite(F, i + 1, n)]))
    ziele.push(ziel)
  })
  if (S.folien && !reel) {
    chrome([`--print-to-pdf=${path.resolve(basis + '.pdf')}`, '--no-pdf-header-footer'], dokument(folien.map((F, i) => seite(F, i + 1, n))))
    ziele.push(`${basis}.pdf`)
  }
}
fs.rmSync(tmp, { recursive: true, force: true })
console.log(`${ziele.join(', ')} erzeugt.`)
