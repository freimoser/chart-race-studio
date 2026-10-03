/*
 * Glätteprüfung für Line Race und Karte: fährt die Animation in feinen Zeitschritten ab und meldet
 * jeden Sprung – eine Beschriftung, ein Punkt oder eine Deckkraft, die sich zwischen zwei benachbarten
 * Bildern stärker ändert, als eine stetige Bewegung es erlaubt.
 *
 *   npm run dev   (zweites Terminal)
 *   node scripts/pruefe-glaette.mjs [datensatz …]
 *
 * Gemessen wird bei 60 Bildern je Jahr. Grenze: 2,5 % der Diagrammhöhe je Bild für Positionen,
 * 0,15 je Bild für Deckkraft. Exit 1, wenn irgendwo ein Sprung liegt.
 */
import { starteChrome } from './lib/cdp.mjs'

const URL = process.env.STUDIO_URL ?? 'http://localhost:5173/studio/'
const DATENSAETZE = process.argv.slice(2).length ? process.argv.slice(2) : ['ketten', 'ketten-eigentuemer', 'geschlecht-praxis', 'inhaber-angestellte', 'heimtiere', 'tieraerzteschaft-deutschland', 'praxisschwerpunkte', 'heimtiermarkt', 'fachtieraerzte']
const b = await starteChrome({ breite: 1440, hoehe: 1000, skala: 1 })
let fehler = 0
try {
  for (const id of DATENSAETZE) {
    await b.oeffne(`${URL}?beispiel=${id}`, { warteMs: 1800 })
    await b.js(`window.__crs.useApp.getState().updateSettings({ chartType: 'line', format: '1:1' })`)
    await b.warte(1200)
    const r = await b.js(`(() => {
      const h = window.__crsChart; const svg = h.svg(); const H = svg.getBBox().height || 1000
      const P = h.dates.length, SCHRITT = 1 / 60
      const lese = () => { const m = new Map()
        for (const g of svg.querySelectorAll('g.head')) { const n = g.querySelector('text.name'); const d = g.querySelector('circle.dot')
          m.set(g.__data__?.name ?? n.textContent, { ty: +n.getAttribute('y'), y: +d.getAttribute('cy'), op: +n.getAttribute('opacity'), pop: +d.getAttribute('opacity') }) }
        return m }
      let vorher = null, spruenge = []
      for (let t = 0; t <= P - 1 + 1e-9; t += SCHRITT) {
        h.renderAt(t); const jetzt = lese()
        if (vorher) for (const [n, a] of jetzt) { const b = vorher.get(n)
          const opA = a.op, opB = b ? b.op : 0
          if (Math.abs(opA - opB) > 0.15) spruenge.push({ t: +t.toFixed(3), n, art: 'Deckkraft Name', von: +opB.toFixed(2), auf: +opA.toFixed(2) })
          if (Math.abs(a.pop - (b ? b.pop : 0)) > 0.15) spruenge.push({ t: +t.toFixed(3), n, art: 'Deckkraft Linie', von: +(b ? b.pop : 0).toFixed(2), auf: +a.pop.toFixed(2) })
          if (b && Math.min(opA, opB) > 0.3) {
            if (Math.abs(a.ty - b.ty) > H * 0.025) spruenge.push({ t: +t.toFixed(3), n, art: 'Beschriftung', um: Math.round(Math.abs(a.ty - b.ty)) })
            if (Math.abs(a.y - b.y) > H * 0.025) spruenge.push({ t: +t.toFixed(3), n, art: 'Punkt', um: Math.round(Math.abs(a.y - b.y)) })
          } }
        if (vorher) for (const [n, b] of vorher) if (!jetzt.has(n) && (b.op > 0.15 || b.pop > 0.15)) spruenge.push({ t: +t.toFixed(3), n, art: 'verschwunden', von: +b.op.toFixed(2) })
        vorher = jetzt }
      return { P, bilder: Math.round((P - 1) * 60), spruenge: spruenge.slice(0, 12), anzahl: spruenge.length } })()`)
    fehler += r.anzahl
    console.log(`${r.anzahl ? '✗' : '✓'} ${id}: ${r.bilder} Bilder, ${r.anzahl} Sprünge`)
    for (const s of r.spruenge) console.log('   ', JSON.stringify(s))
  }
} finally { await b.ende() }
process.exit(fehler ? 1 : 0)
