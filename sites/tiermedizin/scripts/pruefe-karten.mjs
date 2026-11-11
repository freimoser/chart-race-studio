/*
 * Prüft Europakarten (balkenbild.mjs, art: karte): Jede Zahl steht im eigenen Land (bei Kästen der Anker der Linie),
 * kein Wert für ein Land, das es in den Grenzen nicht gibt, keine Beschriftung außerhalb des Bildes.
 *   node sites/tiermedizin/scripts/pruefe-karten.mjs sites/tiermedizin/docs/linkedin/karte-*.json
 */
import fs from 'node:fs'
import { geoAzimuthalEqualArea, geoPath, geoContains } from 'd3-geo'
const geo = JSON.parse(fs.readFileSync('sites/tiermedizin/data/geo/europa-50m.geojson'))
const B = 1080, H = 1350 - 112
for (const datei of process.argv.slice(2)) {
  const F = JSON.parse(fs.readFileSync(datei))
  const ecken = { type: 'MultiPoint', coordinates: F.ausschnitt ?? [[-9.5, 37], [-9, 43.5], [34.6, 34.6], [26, 35], [14.5, 35.8], [28, 62], [5, 61]] }
  const proj = geoAzimuthalEqualArea().rotate([-12, -52]).fitExtent([[F.rand ?? 24, 40], [B - 12, H - 130]], ecken)
  const pfad = geoPath(proj)
  const fehler = []
  const ids = new Set(geo.features.map((f) => f.properties.id))
  for (const id of Object.keys(F.werte)) if (!ids.has(id)) fehler.push(`${id}: nicht in den Grenzen`)
  for (const f of geo.features) {
    const id = f.properties.id; if (F.werte[id] == null || F.ohneZahl?.includes(id)) continue
    const L = F.lage?.[id] ?? {}
    const teile = f.geometry.coordinates.map((c) => ({ type: 'Polygon', coordinates: c }))
    const gross = teile.reduce((a, b) => (pfad.area(b) > pfad.area(a) ? b : a))
    let [x, y] = pfad.centroid(gross)
    if (L.x != null) [x, y] = proj([L.x, L.y])
    const anker = [x, y]
    if (!L.kasten) { x += L.dx ?? 0; y += L.dy ?? 0 }
    const pt = L.kasten ? anker : [x, y]
    if (!geoContains(f, proj.invert(pt))) fehler.push(`${id} (${F.werte[id]}): Beschriftung liegt außerhalb des Landes`)
    if (y < 0 || y > H - 130 || x < 0 || x > B) fehler.push(`${id}: Beschriftung außerhalb des Bildes`)
  }
  console.log(fehler.length ? `✗ ${datei}\n  ` + fehler.join('\n  ') : `✓ ${datei}: ${Object.keys(F.werte).length} Länder, jede Zahl im eigenen Land`)
}
