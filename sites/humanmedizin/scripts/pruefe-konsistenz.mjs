/*
 * Konsistenzprüfung der Humanmedizin-Daten: Stimmen die Datensätze untereinander, mit den Rohdaten und mit den
 * Zahlen in Artikeln, Leitartikel, Post-Texten und Dateninfo überein?
 *
 *   node sites/humanmedizin/scripts/pruefe-konsistenz.mjs      (Exit 1 bei Fehlern)
 *
 * 1. Jahresendwerte der Datensätze = Rohdaten (pvs-kbv-installationen.csv), wo die Rohdatei einen Wert hat.
 * 2. pvs-installationen und pvs-installationen-2007 sind 2013–2025 für gemeinsame Systeme gleich.
 * 3. pvs-hersteller = Summe der Systeme je Hersteller (Eigentümer am Stichtag).
 * 4. Kennzahlen, die die Texte zitieren, aus den Daten neu gerechnet und in jedem Text gesucht (Fehler, wenn eine Zahl
 *    fehlt). Neue Kennzahlen hier eintragen, sobald ein Text sie zitiert.
 * 5. Jede Zahl mit Tausenderpunkt in den Texten muss irgendwo in Rohdaten, Datensätzen oder Kennzahlen vorkommen;
 *    sonst Hinweis zum Nachprüfen (Tippfehler, veraltete Zahl).
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { leseCsv } from '../../../scripts/lib/csv.mjs'

const H = 'sites/humanmedizin'
const RAW = path.join(H, 'data/raw')
const D = await import(pathToFileURL(path.resolve(H, 'samples/data.ts')).href)
const INST = leseCsv(path.join(RAW, 'pvs-kbv-installationen.csv'))
const GERECHNET = JSON.parse(fs.readFileSync(path.join(RAW, 'pvs-gerechnet.json'), 'utf8'))

const fehler = [], hinweise = []
const de = (n) => n.toLocaleString('de-DE')
const wert = (T, jahr, name) => T.rows.find((r) => r[0] === String(jahr))?.[T.headers.indexOf(name)]
const NAMEN = {
  'CGM MEDISTAR (BLACK PRO)': 'CGM MEDISTAR', TURBOMED: 'CGM TURBOMED', ALBIS: 'CGM ALBIS', 'CGM M1 PRO (ehem. CompuMED M1)': 'CGM M1 PRO',
  'DATA VITAL': 'CGM DATA VITAL', 'x.isynet (ehem. MCS-ISYNET)': 'x.isynet', 'x.concept (ehem. DOCconcept)': 'x.concept',
  'x.comfort (ehem. DOCcomfort)': 'x.comfort', 'EL - Elaphe Longissima': 'EL', 'ETERNO Cloud (ehem. inSuite)': 'ETERNO Cloud',
}
const kurz = (s) => NAMEN[s] ?? s

// ---------- 1. Datensätze gegen Rohdaten ----------
for (const [id, T] of [['pvs-installationen', D.PVS_ARZT], ['pvs-installationen-2007', D.PVS_ARZT_2007]]) {
  for (const r of INST.filter((x) => x.stichtag.endsWith('-12-31') && x.klasse === 'arzt')) {
    const j = Number(r.stichtag.slice(0, 4)), v = wert(T, j, kurz(r.system))
    if (v != null && v !== Number(r.installationen)) fehler.push(`${id} ${j} ${kurz(r.system)}: Datensatz ${v}, Rohdaten ${r.installationen}`)
  }
}

// ---------- 2. Kurze und lange Fassung gleich ----------
for (const n of D.PVS_ARZT.headers.slice(1)) {
  if (!D.PVS_ARZT_2007.headers.includes(n)) { hinweise.push(`${n} fehlt in pvs-installationen-2007`); continue }
  for (let j = 2013; j <= 2025; j++) {
    const a = wert(D.PVS_ARZT, j, n), b = wert(D.PVS_ARZT_2007, j, n)
    if (a !== b) fehler.push(`${n} ${j}: pvs-installationen ${a}, pvs-installationen-2007 ${b}`)
  }
}

// ---------- 3. Herstellersummen ----------
const herstellerAm = (system, j) => {
  for (let k = j; k >= 2013; k--) { const h = INST.find((r) => r.system === system && r.stichtag === `${k}-12-31`)?.hersteller; if (h) return h }
  return ''
}
const LANG = Object.fromEntries(INST.map((r) => [kurz(r.system), r.system]))
const GRUPPEN = { 'CompuGroup Medical (alle Arztsysteme)': /^CompuGroup Medical$/, 'medatixx (alle Systeme)': /^medatixx$/, 'Medical Office, tomedo und T2med': /^(INDAMED|Zollsoft|T2med)$/ }
for (const r of D.PVS_HERSTELLER.rows) {
  const j = Number(r[0])
  for (const [g, re] of Object.entries(GRUPPEN)) {
    const summe = D.PVS_ARZT.headers.slice(1).filter((n) => re.test(herstellerAm(LANG[n] ?? n, j))).reduce((a, n) => a + wert(D.PVS_ARZT, j, n), 0)
    const v = r[D.PVS_HERSTELLER.headers.indexOf(g)]
    if (v !== summe) fehler.push(`pvs-hersteller ${j} ${g}: ${v}, Summe der Systeme ${summe}`)
  }
}

// ---------- 4. Kennzahlen in den Texten ----------
const A = D.PVS_ARZT, HS = D.PVS_HERSTELLER
const summe = (T, j) => T.rows.find((x) => x[0] === String(j)).slice(1).reduce((a, b) => a + b, 0)
const s13 = summe(A, 2013), s25 = summe(A, 2025)
const hs = (j, i) => HS.rows.find((x) => x[0] === String(j))[i]
const prozent = (a, b, stellen = 0) => (a / b * 100).toFixed(stellen).replace('.', ',')
const sichtbarGerechnet = (() => {
  const T = D.PVS_ARZT_2007, G = GERECHNET['pvs-installationen-2007']
  let n = 0
  for (const r of T.rows) {
    const j = Number(r[0])
    n += T.headers.slice(1).map((h, i) => [h, r[i + 1]]).sort((x, y) => y[1] - x[1]).slice(0, 20).filter(([h]) => G.some((g) => g.system === h && g.jahr === j)).length
  }
  return n
})()
const K = {
  'MEDISTAR 2025': de(wert(A, 2025, 'CGM MEDISTAR')), 'MEDISTAR 2013': de(wert(A, 2013, 'CGM MEDISTAR')),
  'TURBOMED 2025': de(wert(A, 2025, 'CGM TURBOMED')), 'TURBOMED 2013': de(wert(A, 2013, 'CGM TURBOMED')),
  'medatixx 2025': de(wert(A, 2025, 'medatixx')), 'x.isynet 2025': de(wert(A, 2025, 'x.isynet')),
  'Medical Office 2013': de(wert(A, 2013, 'Medical Office')), 'Medical Office 2025': de(wert(A, 2025, 'Medical Office')),
  'tomedo 2025': de(wert(A, 2025, 'tomedo')), 'T2med 2025': de(wert(A, 2025, 'T2med')),
  'Summe Arztsysteme 2013': de(s13), 'Summe Arztsysteme 2025': de(s25), 'Rückgang Arztsysteme': de(s13 - s25),
  'CGM-Anteil 2013': `${prozent(hs(2013, 1), s13)} `, 'CGM-Anteil 2025': `${prozent(hs(2025, 1), s25)} `,
  'MEDISTAR-Anteil 2025': prozent(wert(A, 2025, 'CGM MEDISTAR'), s25, 1),
  'CGM 2013': de(hs(2013, 1)), 'CGM 2025': de(hs(2025, 1)), 'medatixx 2013 (Hersteller)': de(hs(2013, 2)), 'medatixx 2025 (Hersteller)': de(hs(2025, 2)),
  'Systeme kurz': `${A.headers.length - 1} `, 'Gerechnet kurz': `${GERECHNET['pvs-installationen'].length} von ${(A.headers.length - 1) * A.rows.length}`,
  'Systeme lang': `${D.PVS_ARZT_2007.headers.length - 1} `, 'Gerechnet lang': `${GERECHNET['pvs-installationen-2007'].length} von ${(D.PVS_ARZT_2007.headers.length - 1) * D.PVS_ARZT_2007.rows.length}`,
  'Sichtbar gerechnet lang': `${sichtbarGerechnet} von ${D.PVS_ARZT_2007.rows.length * 20}`,
}
// Welche Kennzahl muss in welchem Text stehen.
const ERWARTET = {
  [`${H}/content/artikel/01-praxissoftware-arztpraxen-marktanteile.md`]: ['MEDISTAR 2025', 'MEDISTAR 2013', 'TURBOMED 2025', 'TURBOMED 2013', 'medatixx 2025', 'x.isynet 2025', 'Medical Office 2013', 'Medical Office 2025', 'tomedo 2025', 'T2med 2025', 'Summe Arztsysteme 2013', 'Summe Arztsysteme 2025', 'Rückgang Arztsysteme', 'CGM-Anteil 2013', 'CGM-Anteil 2025', 'MEDISTAR-Anteil 2025', 'CGM 2013', 'CGM 2025', 'Gerechnet kurz', 'Sichtbar gerechnet lang'],
  [`${H}/docs/linkedin/post-01-praxissoftware.md`]: ['MEDISTAR 2025', 'MEDISTAR 2013', 'TURBOMED 2025', 'TURBOMED 2013', 'Medical Office 2013', 'Medical Office 2025', 'tomedo 2025', 'T2med 2025', 'Gerechnet kurz'],
  [`${H}/seiten/artikel/datenherkunft.html`]: ['Gerechnet lang', 'Sichtbar gerechnet lang'],
  [`${H}/samples/index.ts`]: ['Gerechnet lang', 'Sichtbar gerechnet lang'],
  [`${H}/docs/DATASETS.md`]: ['Gerechnet lang'],
}
for (const [datei, liste] of Object.entries(ERWARTET)) {
  const text = fs.readFileSync(datei, 'utf8')
  for (const k of liste) if (!text.includes(K[k])) fehler.push(`${datei}: Kennzahl „${k}“ = „${K[k].trim()}“ steht nicht im Text`)
}

// ---------- 5. Unbekannte Zahlen in Texten ----------
const bekannt = new Set()
const merke = (v) => { if (typeof v === 'number' && Number.isFinite(v)) bekannt.add(de(v)) }
for (const r of [...INST, ...leseCsv(path.join(RAW, 'pvs-kbv-luecken-1998-2012.csv'))]) merke(Number(r.installationen))
for (const T of Object.values(D)) for (const r of T.rows) r.slice(1).forEach(merke)
for (const v of Object.values(K)) bekannt.add(v.trim())
// Abgeleitete Zahlen, die die Texte nennen, jeweils aus den Rohdaten gerechnet.
const LUE = leseCsv(path.join(RAW, 'pvs-kbv-luecken-1998-2012.csv'))
const roh = (rows, st, sys) => Number(rows.find((r) => r.stichtag === st && r.system === sys)?.installationen ?? NaN)
merke(['Elefant', 'psyprax', 'PsychoDat'].reduce((a, n) => a + roh(INST, '2025-12-31', n), 0)) // Psychotherapie-Systeme Ende 2025
merke(['ORBIS', 'SAP Ambulatory Care Management', 'CGM MEDICO (ehem. MEDICO WIPS)', 'IMedOne'].reduce((a, n) => a + roh(INST, '2025-12-31', n), 0)) // Krankenhaussysteme Ende 2025
merke(roh(LUE, '2000-06-30', 'ALBIS') + roh(LUE, '2000-06-30', 'ALBIS DOS (Altversion)')) // ALBIS Mitte 2000, beide Versionen
merke(roh(INST, '1997-12-31', 'ALBIS') + roh(INST, '1997-12-31', 'ALBIS ON WINDOWS (eigene KBV-Zeile 1997)')) // ALBIS Ende 1997
bekannt.add('9.508')
// MVZ und Bundesarztregister (recherche/mvz.md): Rohwerte und die Ableitungen, die Texte zitieren.
if (fs.existsSync(path.join(RAW, 'mvz.csv'))) {
  const MV = leseCsv(path.join(RAW, 'mvz.csv'))
  for (const r of MV) merke(Number(r.wert))
  const m = (j, r) => Number(MV.find((x) => x.stichtag === `${j}-12-31` && x.reihe === r)?.wert ?? NaN)
  for (let j = 2004; j <= 2025; j++) {
    merke(m(j, 'praxen_ep_hausaerztlich') + m(j, 'praxen_ep_fachaerztlich')) // ärztliche Einzelpraxen
    merke(m(j, 'bar_t5_aerztlich_ep_zulassung_mit_angestellten') + m(j, 'bar_t5_aerztlich_ep_zulassung_ohne_angestellte')) // dasselbe aus Tabelle 5
    merke(m(j, 'bar_t5_aerztlich_einrichtung_anstellung') + m(j, 'bar_t5_aerztlich_einrichtung_zulassung')) // Ärzte in MVZ und Einrichtungen
    merke(m(j, 'bar_personen_mvz_einrichtung') - m(j, 'bar_psych_psychotherapeuten_mvz_einrichtung'))
  }
}
// Redaktionsplan: Summen über Gewinner/Verlierer 2021–2025 und Summe der größten drei Arztsysteme 2025.
{
  const q = (j, n) => roh(INST, `${j}-12-31`, n)
  const netto = [...new Set(INST.filter((r) => r.stichtag === '2025-12-31' && r.system !== '__SUMME__').map((r) => r.system))].map((n) => q(2025, n) - q(2021, n)).filter(Number.isFinite)
  merke(netto.filter((x) => x > 0).reduce((a, x) => a + x, 0)); merke(-netto.filter((x) => x < 0).reduce((a, x) => a + x, 0))
  const top3 = D.PVS_ARZT.headers.slice(1).map((n) => wert(D.PVS_ARZT, 2025, n)).sort((x, y) => y - x).slice(0, 3)
  merke(top3.reduce((a, x) => a + x, 0))
  merke(wert(D.PVS_ARZT, 2025, 'tomedo') + wert(D.PVS_ARZT, 2025, 'T2med'))
  // Arztgruppe Psychotherapeuten 2014 → 2025 (recherche Abschnitt 6, 2025 als Mindestwert aus den Top 20), auf Tausend gerundet.
  const psy14 = 24451, psy25 = 35271, rest14 = q(2014, '__SUMME__') - psy14, rest25 = q(2025, '__SUMME__') - psy25
  merke(Math.round((rest14 - rest25) / 1000) * 1000); merke(Math.round((psy25 - psy14) / 1000) * 1000)
  for (const j of [2013, 2025]) merke(['ORBIS', 'SAP Ambulatory Care Management', 'CGM MEDICO (ehem. MEDICO WIPS)', 'IMedOne'].reduce((a, n) => a + q(j, n), 0))
} // Medical Office Q2/2021 im KBV-Bericht Q2/2021 (doppelt gezählt), zitiert aus recherche/pvs-kbv-historie.md Abschnitt 2
for (const T of [D.PVS_ARZT, D.PVS_ARZT_2007, D.PVS_HERSTELLER]) for (const r of T.rows) merke(r.slice(1).reduce((a, b) => a + b, 0))
// Differenzen zwischen zwei Jahren je System (Texte nennen „plus 311“ o. ä.), Summen von Versionszeilen (Momentaufnahmen).
for (const r of INST) for (const r2 of INST) if (r.system === r2.system && r.stichtag < r2.stichtag) merke(Math.abs(Number(r2.installationen) - Number(r.installationen)))
const texte = [
  ...fs.readdirSync(path.join(H, 'content/artikel')).filter((f) => f.endsWith('.md')).map((f) => path.join(H, 'content/artikel', f)),
  ...fs.readdirSync(path.join(H, 'docs/linkedin')).filter((f) => f.endsWith('.md')).map((f) => path.join(H, 'docs/linkedin', f)),
  path.join(H, 'seiten/artikel/praxisverwaltungssysteme-deutschland.html'), path.join(H, 'seiten/artikel/datenherkunft.html'),
  path.join(H, 'content/roadmap.ts'),
]
const ERLAUBT = new Set(['1.997', '2.000', '2.005', '2.007', '2.013', '2.025']) // Jahreszahlen mit Punkt kommen nicht vor, nur zur Sicherheit
for (const datei of texte) {
  const roh = fs.readFileSync(datei, 'utf8').replace(/https?:\/\/\S+/g, '')
  for (const [z] of roh.matchAll(/\b\d{1,3}(?:\.\d{3})+\b/g)) {
    if (!bekannt.has(z) && !ERLAUBT.has(z)) hinweise.push(`${datei}: Zahl ${z} in keiner Datenquelle gefunden – von Hand prüfen`)
  }
}

for (const f of fehler) console.log('✗', f)
for (const h of [...new Set(hinweise)]) console.log('·', h)
console.log(fehler.length ? `\n${fehler.length} Fehler.` : `\nKeine Fehler. ${new Set(hinweise).size} Hinweise.`)
process.exit(fehler.length ? 1 : 0)
