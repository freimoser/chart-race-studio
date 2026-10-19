// Rückrechnung der sieben Praxisarten der BTK auf 2010–2018 (Pferde getrennt erst ab 2019).
// Aufruf: node sites/tiermedizin/scripts/build-pferde-rueckrechnung.mjs  → schreibt sites/tiermedizin/data/raw/ds21-pferde-nutztiere.json
//
// Bis 2018 kennt die Statistik drei Praxisarten (Kleintiere; Nutztiere einschließlich Pferde; Nutztiere und
// Kleintiere), ab 2019 sieben. Die Rechnung in zwei Schritten, Begründung in der Rohdatei (methode):
// 1. Brücke alt → neu, geschätzt am Bruch 2018/2019 über Anteile: Kleintiere bleiben Kleintiere, die alten
//    Nutztiere gehen ganz in die reine Großtiergruppe (Nutztiere, Pferde, Nutztiere und Pferde), von den alten
//    Gemischten geht der Anteil f dorthin, der den Anteil der Großtiergruppe 2018 nahtlos an 2019 anschließt;
//    der Rest verteilt sich auf die drei gemischten Kategorien im Verhältnis von 2019.
// 2. Pferde innerhalb der Großtiergruppe über die verwandte, gemessene Reihe Fachtierärzt:innen für Pferde
//    fortgeschrieben (Regel 1 im CLAUDE.md, DATENSTANDARD Abschnitt 7), mit Ausgleich der Antwortquote.
//    „Nutztiere und Pferde“ behält seinen Anteil an der Großtiergruppe von 2019, Nutztiere sind der Rest.
// Zwei Gegenvarianten geben die Spanne: A Pferdeanteil an der Großtiergruppe wie 2019 eingefroren,
// B Trend dieses Anteils 2019–2025 zurückgeschrieben.
import fs from 'node:fs'
import path from 'node:path'

const raw = (f) => JSON.parse(fs.readFileSync(path.join('sites/tiermedizin/data/raw', f), 'utf8'))
const d8 = raw('ds8-praxisarten-1996-2025.json'), d9 = raw('ds9-fachtieraerzte.json'), d1 = raw('ds1-tieraerzte.json')

const K = 'Kleintiere', P = 'Pferde', N = 'Nutztiere', KP = 'Kleintiere und Pferde', NP = 'Nutztiere und Pferde',
  NK = 'Nutztiere und Kleintiere', NPK = 'Nutztiere, Pferde und Kleintiere'
const NEU = [K, P, N, KP, NP, NK, NPK]

const praxis = {}
for (const r of d8.rows) if (r.metric === 'Praxisart' && +r.date >= 2010) (praxis[r.date] ??= {})[r.name] = r
const nieder = {}
for (const r of d1.rows) if (r.name === 'Niedergelassene/praktizierende Tierärzt:innen (Praxisinhaber)') nieder[r.date] = r.value
const fta = {}
for (const r of d9.rows) if (r.name === 'Fachtierarzt für Pferde') fta[r.date] = r.value

// Fachtierärzt:innen Pferde: 2012 unbrauchbar (Bayern in der Zeile Pferdechirurgie gemeldet), 2015–2017 nicht
// veröffentlicht. Diese Jahre linear zwischen den Nachbarjahren.
const ftaMarke = {}
const linear = (a, b, y) => fta[a] + (fta[b] - fta[a]) * (y - a) / (b - a)
for (const y of [2012]) { fta[y] = linear(2011, 2013, y); ftaMarke[y] = 'linear 2011–2013' }
for (const y of [2015, 2016, 2017]) { fta[y] = linear(2014, 2018, y); ftaMarke[y] = 'linear 2014–2018' }

const v = (y, n) => praxis[y][n]?.value ?? 0
const summe = (y) => Object.values(praxis[y]).reduce((s, r) => s + r.value, 0)
const quote = (y) => summe(y) / nieder[y]

// Schritt 1: Brücke am Bruch 2018/2019
const s19 = summe(2019), s18 = summe(2018)
const pool19 = (v(2019, N) + v(2019, P) + v(2019, NP)) / s19
const f = (pool19 - v(2018, N) / s18) / (v(2018, NK) / s18)
const gem19 = v(2019, NK) + v(2019, KP) + v(2019, NPK)
const anteilNP = v(2019, NP) / (v(2019, N) + v(2019, P) + v(2019, NP))
const pferdeImPool = (y) => v(y, P) / (v(y, N) + v(y, P) + v(y, NP))
const trend = (pferdeImPool(2025) - pferdeImPool(2019)) / 6

const rows = []
const r1 = (x) => Math.round(x)
for (let y = 2010; y <= 2025; y++) {
  const date = String(y)
  if (y >= 2019) {
    for (const n of NEU) {
      const q = praxis[date][n]
      rows.push({ date, name: n, value: q.value, quality: q.quality === 'korrigiert' ? 'korrigiert' : 'belegt', quelle: q.source, notes: q.quality === 'korrigiert' ? q.notes : undefined })
    }
    continue
  }
  const k = v(date, K), n = v(date, N), g = v(date, NK)
  const pool = n + f * g, rest = g * (1 - f)
  const pferde = v(2019, P) * (fta[y] / fta[2019]) * (quote(date) / quote(2019))
  const np = anteilNP * pool
  const varA = pferdeImPool(2019) * pool, varB = (pferdeImPool(2019) - trend * (2019 - y)) * pool
  const spanne = [r1(Math.min(pferde, varA, varB)), r1(Math.max(pferde, varA, varB))]
  const ger = 'gerechnet (Rückrechnung, siehe methode)'
  rows.push({ date, name: K, value: k, quality: 'belegt', quelle: `BTK Statistik ${y}, Kategorie „Kleintiere“ (1 : 1 übernommen)` })
  rows.push({ date, name: P, value: r1(pferde), quality: ger, spanne, notes: `${v(2019, P)} × Fachtierärzt:innen Pferde ${r1(fta[y])}${ftaMarke[y] ? ` (${ftaMarke[y]})` : ''} / ${fta[2019]} × Antwortquote ${(quote(date) * 100).toFixed(1)} % / ${(quote(2019) * 100).toFixed(1)} %; Variante A ${r1(varA)}, Variante B ${r1(varB)}` })
  rows.push({ date, name: N, value: r1(pool - pferde - np), quality: ger, notes: `Großtiergruppe ${r1(pool)} (= alte Nutztiere ${n} + ${(f * 100).toFixed(1)} % der alten Gemischten ${g}) − Pferde − Nutztiere und Pferde` })
  rows.push({ date, name: NP, value: r1(np), quality: ger, notes: `${(anteilNP * 100).toFixed(1)} % der Großtiergruppe wie 2019` })
  for (const m of [NK, KP, NPK]) rows.push({ date, name: m, value: r1(rest * v(2019, m) / gem19), quality: ger, notes: `Rest der alten Gemischten (${r1(rest)}) im Verhältnis von 2019` })
}

const out = {
  title: 'Niedergelassene Tierärzt:innen nach Praxisart in den Kategorien ab 2019, 2010–2025 (2010–2018 zurückgerechnet)',
  abgerufen: '2026-10-16',
  unit: 'Personen (Praxisinhaber:innen), nicht Praxen',
  quelle: 'Bundestierärztekammer, Statistik „Tierärzteschaft in der Bundesrepublik Deutschland“, Tab. 2 bzw. Praxisarten (data/raw/ds8-praxisarten-1996-2025.json); Fachtierärzt:innen Pferde (data/raw/ds9-fachtieraerzte.json); Niedergelassene gesamt (data/raw/ds1-tieraerzte.json)',
  quelleUrl: 'https://www.bundestieraerztekammer.de/btk/statistik/',
  methode: [
    'Ab 2019 erhebt die Kammer sieben Praxisarten, Pferde getrennt. Bis 2018 gab es drei; Pferde steckten in „Nutztiere“. Die BTK selbst schließt einen Vergleich mit den Jahren vor 2019 aus. Die Werte 2010–2018 sind deshalb gerechnet, nicht erhoben.',
    `Schritt 1, Brücke: Kleintiere werden 1 : 1 übernommen. Die alten Nutztiere gehen ganz in die reine Großtiergruppe (Nutztiere, Pferde, Nutztiere und Pferde). Von den alten Gemischten geht ${(f * 100).toFixed(1)} % dorthin: genau der Anteil, mit dem der Anteil der Großtiergruppe an allen Angaben 2018 nahtlos in den gemessenen Wert 2019 (${(pool19 * 100).toFixed(1)} %) übergeht. Der Rest der Gemischten verteilt sich auf die drei gemischten Kategorien im Verhältnis von 2019.`,
    `Schritt 2, Pferde: fortgeschrieben über die Fachtierärzt:innen für Pferde (gemessen; 2012 und 2015–2017 linear), Wert 2019 = ${v(2019, P)}, mit Ausgleich der Antwortquote (2010–2015 nahezu 100 %, 2019 ${(quote(2019) * 100).toFixed(1)} %). „Nutztiere und Pferde“ behält ${(anteilNP * 100).toFixed(1)} % der Großtiergruppe wie 2019, „Nutztiere“ ist der Rest.`,
    `Warum diese Variante: 2019–2025 wuchsen die Fachtierärzt:innen Pferde langsamer als die Pferdepraktiker. Rückwärts gerechnet setzt die Variante die Pferde vor 2019 eher zu hoch an und unterschätzt damit den Anstieg. Spanne aus zwei Gegenvarianten je Jahr im Feld „spanne“: A Pferdeanteil an der Großtiergruppe eingefroren wie 2019 (${(pferdeImPool(2019) * 100).toFixed(1)} %), B dessen Trend 2019–2025 (+${(trend * 100).toFixed(2)} Punkte je Jahr) zurückgeschrieben.`,
    'Robust in allen Varianten: Nutztiere liegen 2010–2018 in jedem Jahr vor den Pferden. Das Überholen 2021 ist gemessen. Nicht belastbar sind die genaue Höhe der Pferdezahl vor 2019 und Wachstumsraten seit 2010.',
    'Korrekturen der BTK-Summen aus den Kammerspalten: 2019 alle sieben Kategorien, 2020 Pferde, 2024 alle sieben (Rheinland-Pfalz doppelt gezählt); Einzelheiten in ds8.',
  ],
  parameter: { f: +f.toFixed(4), pool2019: +pool19.toFixed(4), anteilNP2019: +anteilNP.toFixed(4), pferdeImPool2019: +pferdeImPool(2019).toFixed(4), trendJeJahr: +trend.toFixed(4), quote2019: +quote(2019).toFixed(4) },
  rows,
}
fs.writeFileSync('sites/tiermedizin/data/raw/ds21-pferde-nutztiere.json', JSON.stringify(out, null, 1) + '\n')
for (let y = 2010; y <= 2025; y++) {
  const z = (n) => rows.find((r) => r.date === String(y) && r.name === n)
  console.log(y, NEU.map((n) => `${n.slice(0, 6)} ${z(n).value}`).join(' | '), z(P).spanne ? `Spanne ${z(P).spanne.join('–')}` : '')
}
