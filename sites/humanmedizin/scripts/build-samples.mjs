// Erzeugt sites/humanmedizin/samples/data.ts aus den Rohdaten in sites/humanmedizin/data/raw/.
// Aufruf: npm run daten   (im Arbeitsordner der Humanmedizin bzw. mit SITE=humanmedizin)
//
// Jeder gerechnete Wert landet zusätzlich in data/raw/pvs-gerechnet.json, mit Methode – Regel „Gerechnetes markieren“
// (CLAUDE.md). Quellen und Fallstricke: sites/humanmedizin/recherche/pvs-kbv-historie.md.
import fs from 'node:fs'
import path from 'node:path'
import { stuetze, lit } from '../../../scripts/lib/reihen.mjs'

const RAW = path.resolve('sites/humanmedizin/data/raw')
const csv = (f) => {
  const [kopf, ...zeilen] = fs.readFileSync(path.join(RAW, f), 'utf8').trim().split(/\r?\n/)
  const k = kopf.split(',')
  // Kein Feld enthält ein Komma außer der URL am Ende: alles nach dem fünften Komma gehört zur URL.
  return zeilen.map((z) => { const t = z.split(','); return Object.fromEntries(k.map((n, i) => [n, i === k.length - 1 ? t.slice(i).join(',') : t[i]])) })
}

// ---------- KBV-Installationsstatistik ----------
const INST = csv('pvs-kbv-installationen.csv')
const ANTEIL = csv('pvs-kbv-anteile-2017-2020.csv')

// Zeitachse: Jahresende (Q4) 2013 bis 2025. Ab 2013 gibt es wieder vollständige Listen aller Systeme; 2008–2012 fehlen
// sie fast ganz (recherche, Abschnitt 4). Der Schlüssel ist das Jahr des Stichtags 31.12.
const VON = 2013, BIS = 2025
const JAHRE = Array.from({ length: BIS - VON + 1 }, (_, i) => VON + i)
// Zeitpunkt eines Stichtags als Kommazahl, gemessen in Jahresenden: 31.12.2016 = 2016, 30.09.2017 = 2016,75.
const zeitpunkt = (iso) => { const [j, m] = iso.split('-').map(Number); return j - 1 + m / 12 }

const belegt = (system) => Object.fromEntries(INST.filter((r) => r.system === system && r.stichtag.endsWith('-12-31')).map((r) => [Number(r.stichtag.slice(0, 4)), Number(r.installationen)]))
const SUMME = belegt('__SUMME__')

// 2017–2020 hat die KBV nur Anteile in Prozent veröffentlicht (Q3/2017, Q3/2020). Installationen = Anteil × Gesamtzahl,
// die Gesamtzahl linear zwischen Q4/2016 und Q4/2021. Die Stützpunkte liegen auf ihrem echten Zeitpunkt (2016,75 und
// 2019,75); die Jahresenden 2017–2020 entstehen linear zwischen den Nachbarn.
const summeBei = (t) => stuetze({ 2016: SUMME[2016], 2021: SUMME[2021] }, t)

const gerechnet = []

// Vor dem Markteintritt ist 0 ein Beleg, keine Lücke – nur wo Eintritt bzw. Zulassung belegt sind (recherche, Abschnitt 8):
// medatixx (Produkt) „seit 2014 auf dem Markt“, T2med Markteinführung 2015. easymed steht ab 2023 nicht mehr in der
// vollständigen KBV-Liste (promedico 2018 in medatixx verschmolzen).
const NULL_VOR = { medatixx: 2014, T2med: 2015 }
const NULL_AB = { easymed: 2023 }
function mitEintritt(system) {
  const b = belegt(system)
  for (const j of JAHRE) {
    if (NULL_VOR[system] && j < NULL_VOR[system] && b[j] == null) b[j] = 0
    if (NULL_AB[system] && j >= NULL_AB[system] && b[j] == null) b[j] = 0
  }
  return b
}

// ---------- Datensatz 1: Systeme in Arztpraxen ----------
// Nur Systeme der Klasse „arzt“ (recherche, Abschnitt 6): Psychotherapie-Systeme (Elefant, psyprax, PsychoDat, Epikur,
// SMARTY, RED Medical) und Krankenhaussysteme bleiben draußen, sonst führen sie die Liste. Aufgenommen ist, wer
// zwischen 2013 und 2025 mindestens einmal 500 Installationen hatte.
const NAMEN = {
  'CGM MEDISTAR (BLACK PRO)': 'CGM MEDISTAR', TURBOMED: 'CGM TURBOMED', ALBIS: 'CGM ALBIS', 'CGM M1 PRO (ehem. CompuMED M1)': 'CGM M1 PRO',
  'DATA VITAL': 'CGM DATA VITAL', 'x.isynet (ehem. MCS-ISYNET)': 'x.isynet', 'x.concept (ehem. DOCconcept)': 'x.concept',
  'x.comfort (ehem. DOCcomfort)': 'x.comfort', 'EL - Elaphe Longissima': 'EL', 'ETERNO Cloud (ehem. inSuite)': 'ETERNO Cloud',
}
const kurz = (s) => NAMEN[s] ?? s
const ARZT = [...new Set(INST.filter((r) => r.klasse === 'arzt').map((r) => r.system))]
  .filter((s) => INST.some((r) => r.system === s && r.stichtag.endsWith('-12-31') && Number(r.stichtag.slice(0, 4)) >= VON && Number(r.installationen) >= 500))

function reiheMitEintritt(system) {
  const b = mitEintritt(system)
  const punkte = { ...b }
  for (const a of ANTEIL.filter((r) => r.system === system)) {
    const t = zeitpunkt(a.stichtag)
    punkte[t] = Number(a.anteil_prozent) / 100 * summeBei(t)
  }
  return JAHRE.map((j) => {
    if (b[j] != null) return b[j]
    const v = Math.round(stuetze(punkte, j) ?? 0)
    const mitAnteil = ANTEIL.some((r) => r.system === system)
    gerechnet.push({ jahr: j, system: kurz(system), wert: v, methode: j > 2016 && j < 2021
      ? (mitAnteil ? 'linear zwischen Q4/2016, Q3/2017 (KBV-Anteil × Summe), Q3/2020 (KBV-Anteil × Summe) und Q4/2021' : 'linear zwischen Q4/2016 und Q4/2021 (KBV hat keinen Anteil veröffentlicht)')
      : 'nächster Beleg gehalten bzw. linear zwischen zwei Belegen' })
    return v
  })
}

const spalten = ARZT.map((s) => [kurz(s), reiheMitEintritt(s)])
const PVS_ARZT = {
  headers: ['Jahr', ...spalten.map(([n]) => n)],
  rows: JAHRE.map((j, i) => [String(j), ...spalten.map(([, w]) => w[i])]),
}

// ---------- Datensatz 2: Hersteller ----------
// Eigentümer am Stichtag (Spalte hersteller der Rohdatei). Drei Linien: CGM, medatixx und die drei Herausforderer, die
// seit 2013 am stärksten gewachsen sind. Gezählt werden die Systeme aus Datensatz 1 (Klasse „arzt“, ab 2013 mindestens
// einmal 500 Installationen); Kleinstsysteme fehlen (bei CGM etwa DAVID mit 44 Installationen 2025).
const herstellerAm = (system, j) => INST.find((r) => r.system === system && r.stichtag === `${j}-12-31`)?.hersteller ?? ''
const GRUPPEN = [
  ['CompuGroup Medical (alle Arztsysteme)', (h) => /^CompuGroup Medical$/.test(h)],
  ['medatixx (alle Systeme)', (h) => /^medatixx$/.test(h)],
  ['Medical Office, tomedo und T2med', (h) => /^(INDAMED|Zollsoft|T2med)$/.test(h)],
]
// Dieselben Systeme wie im Datensatz 1, damit die Summen zu den Balken passen.
const reihenAlle = Object.fromEntries(spalten.map(([, w], i) => [ARZT[i], w]))
// Hersteller für gerechnete Jahre: der des letzten belegten Jahres davor (Eigentümerwechsel 2017–2020 gibt es bei diesen nicht).
const herstellerJahr = (s, j) => { for (let k = j; k >= VON; k--) { const h = herstellerAm(s, k); if (h) return h } return herstellerAm(s, BIS) }
const PVS_HERSTELLER = {
  headers: ['Jahr', ...GRUPPEN.map(([n]) => n)],
  rows: JAHRE.map((j, i) => [String(j), ...GRUPPEN.map(([, passt]) => ARZT.filter((s) => passt(herstellerJahr(s, j))).reduce((a, s) => a + reihenAlle[s][i], 0))]),
}
// Die Hersteller-Linien sind Summen der Systemreihen; deren gerechnete Werte stehen schon in der Liste.
const gerechnetEindeutig = gerechnet

// ---------- Ausgabe ----------
const emit = (name, w) => `export const ${name} = {\n  headers: ${JSON.stringify(w.headers)},\n  rows: [\n${w.rows.map((r) => '    [' + r.map(lit).join(', ') + '],').join('\n')}\n  ],\n}\n`
fs.writeFileSync('sites/humanmedizin/samples/data.ts', `// Automatisch erzeugt von sites/humanmedizin/scripts/build-samples.mjs aus sites/humanmedizin/data/raw/ – nicht von Hand editieren.\n/* eslint-disable */\n` +
  [emit('PVS_ARZT', PVS_ARZT), emit('PVS_HERSTELLER', PVS_HERSTELLER)].join('\n'))
fs.writeFileSync(path.join(RAW, 'pvs-gerechnet.json'), JSON.stringify({
  hinweis: 'Von sites/humanmedizin/scripts/build-samples.mjs erzeugt. Jeder Wert der Datensätze pvs-installationen und pvs-hersteller, der nicht direkt aus einem KBV-Bericht stammt, mit Methode. Alles andere ist belegt (pvs-kbv-installationen.csv).',
  summe_2017_2020: 'Gesamtzahl aller Installationen linear zwischen Q4/2016 (' + SUMME[2016] + ') und Q4/2021 (' + SUMME[2021] + ')',
  werte: gerechnetEindeutig.sort((a, b) => a.system.localeCompare(b.system) || a.jahr - b.jahr),
}, null, 1) + '\n')
console.log('PVS_ARZT', PVS_ARZT.headers.length - 1, 'Systeme,', PVS_ARZT.rows.length, 'Jahre;', 'PVS_HERSTELLER', PVS_HERSTELLER.headers.length - 1, 'Linien;', gerechnetEindeutig.length, 'gerechnete Werte')
