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
  'SAP Ambulatory Care Management': 'SAP', 'CGM MEDICO (ehem. MEDICO WIPS)': 'CGM MEDICO', IMedOne: 'iMedOne',
}
const kurz = (s) => NAMEN[s] ?? s

// ---------- 1. Datensätze gegen Rohdaten ----------
for (const [id, T] of [['pvs-installationen', D.PVS_ARZT], ['pvs-installationen-2007', D.PVS_ARZT_2007], ['pvs-psychotherapie', D.PVS_PSYCHO], ['pvs-aufsteiger', D.PVS_AUFSTEIGER], ['pvs-kis', D.PVS_KIS]]) {
  for (const r of INST.filter((x) => x.stichtag.endsWith('-12-31'))) {
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

// Gleiche Systeme in mehreren Datensätzen haben dieselben Werte (auch die gerechneten).
for (const [id, T] of [['pvs-psychotherapie', D.PVS_PSYCHO], ['pvs-aufsteiger', D.PVS_AUFSTEIGER]]) {
  for (const n of T.headers.slice(1)) if (D.PVS_ARZT.headers.includes(n)) for (let j = 2013; j <= 2025; j++) {
    if (wert(T, j, n) !== wert(D.PVS_ARZT, j, n)) fehler.push(`${id} ${n} ${j}: ${wert(T, j, n)}, pvs-installationen ${wert(D.PVS_ARZT, j, n)}`)
  }
}

// pvs-saldo: Differenz der belegten Jahresendwerte gegenüber Ende 2021.
for (const r of D.PVS_SALDO.rows) for (const n of D.PVS_SALDO.headers.slice(1)) {
  const lang = Object.keys(NAMEN).find((k) => NAMEN[k] === n) ?? n
  const q = (j) => Number(INST.find((x) => x.system === lang && x.stichtag === `${j}-12-31`)?.installationen)
  if (r[D.PVS_SALDO.headers.indexOf(n)] !== q(Number(r[0])) - q(2021)) fehler.push(`pvs-saldo ${r[0]} ${n}: stimmt nicht mit den Rohdaten`)
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
// Schnittstellen (Posts 6, 7): Anteil der Installationen ärztlicher Systeme (Ende 2025, Systeme ab 500) mit Zulassung
// laut KBV-Verzeichnis 21.10.2026, und eArztbriefe je Jahr aus den Monatswerten.
{
  const Z = leseCsv(path.join(RAW, 'pvs-zulassungen.csv')).filter((r) => r.stand === '2026-10-21')
  const arzt = INST.filter((r) => r.stichtag === '2025-12-31' && r.klasse === 'arzt')
  const ges = arzt.reduce((x, r) => x + Number(r.installationen), 0)
  const anteil = (feld) => prozent(arzt.filter((r) => Z.find((z) => z.system === r.system)?.[feld] === 'ja').reduce((x, r) => x + Number(r.installationen), 0), ges, 1)
  K['LDT-Befund-Anteil'] = anteil('ldt_befund'); K['eArztbrief-Anteil'] = anteil('earztbrief')
  const E = D.EARZTBRIEF_MONAT, jahr = (j) => E.rows.filter((r) => r[0].startsWith(j)).reduce((x, r) => x + r[1], 0)
  const mio = (n) => (n / 1e6).toFixed(1).replace('.', ',') + ' Mio'
  for (const j of ['2023', '2024', '2025']) K[`eArztbriefe ${j}`] = mio(jahr(j))
  K['eArztbriefe 2026 bis Sep'] = mio(jahr('2026'))
  const L = leseCsv(path.join(RAW, 'labor.csv')), g = (r) => Number(L.find((x) => x.reihe === r && x.stichtag === '2025-03-31')?.wert)
  K['GOP 40092 Anteil'] = prozent(g('gop_40092_alle'), g('gop_40094_alle'), 1)
}
// Herstelleranteile (Post 2), mit einer Nachkommastelle.
for (const [j, i, name] of [[2013, 1, 'CGM'], [2025, 1, 'CGM'], [2013, 2, 'medatixx'], [2025, 2, 'medatixx'], [2013, 3, 'Neue'], [2025, 3, 'Neue']]) K[`Anteil ${name} ${j}`] = prozent(hs(j, i), summe(A, j), 1)
K['Neue 2013'] = de(hs(2013, 3)); K['Neue 2025'] = de(hs(2025, 3))
{ const el = (j) => wert(A, j, 'EL'); K['medatixx ohne EL 2025'] = prozent(hs(2025, 2) - el(2025), s25, 1) }
// Psychotherapie (Post 3).
{
  const P = D.PVS_PSYCHO, p = (j, n) => wert(P, j, n)
  for (const [n, j] of [['Elefant', 2025], ['psyprax', 2025], ['Elefant', 2023], ['psyprax', 2024]]) K[`${n} ${j}`] = de(p(j, n))
  K['MEDISTAR 2023'] = de(p(2023, 'CGM MEDISTAR')); K['MEDISTAR 2024'] = de(p(2024, 'CGM MEDISTAR'))
  const w = (n) => prozent(p(2025, n) - p(2013, n), p(2013, n), 1)
  K['Wachstum Elefant'] = w('Elefant'); K['Wachstum Epikur'] = w('Epikur'); K['Wachstum psyprax'] = w('psyprax'); K['Rückgang MEDISTAR'] = prozent(p(2013, 'CGM MEDISTAR') - p(2025, 'CGM MEDISTAR'), p(2013, 'CGM MEDISTAR'), 1)
  K['Gerechnet Psycho'] = `${GERECHNET['pvs-psychotherapie'].length} von ${(P.headers.length - 1) * P.rows.length}`
  // Die Reihenfolge muss stimmen: Elefant vor MEDISTAR ab 2023, psyprax vor MEDISTAR ab 2024, nicht früher.
  if (!(p(2023, 'Elefant') > p(2023, 'CGM MEDISTAR') && p(2022, 'Elefant') < p(2022, 'CGM MEDISTAR'))) fehler.push('Post 3: Elefant überholt MEDISTAR nicht 2023')
  if (!(p(2024, 'psyprax') > p(2024, 'CGM MEDISTAR') && p(2023, 'psyprax') < p(2023, 'CGM MEDISTAR'))) fehler.push('Post 3: psyprax überholt MEDISTAR nicht 2024')
}
// Aufsteiger (Post 4): Jahreswachstum 2025 aus den Quartalswerten (Q4/2024 → Q4/2025).
{
  const q = (st, n) => Number(INST.find((r) => r.stichtag === st && r.system === n)?.installationen ?? NaN)
  for (const [n, k] of [['tomedo', 'tomedo'], ['T2med', 'T2med'], ['Medical Office', 'Medical Office'], ['CGM MEDISTAR (BLACK PRO)', 'MEDISTAR'], ['TURBOMED', 'TURBOMED'], ['ETERNO Cloud (ehem. inSuite)', 'ETERNO']]) {
    const a = q('2024-12-31', n), b = q('2025-12-31', n)
    K[`2025 Veränderung ${k}`] = prozent(Math.abs(b - a), a, 1); K[`2025 Differenz ${k}`] = de(Math.abs(b - a))
  }
  K['tomedo+T2med 2025'] = de(wert(A, 2025, 'tomedo') + wert(A, 2025, 'T2med'))
  K['Mac-Linux-Browser 2025'] = de(wert(A, 2025, 'tomedo') + wert(A, 2025, 'T2med') + wert(A, 2025, 'ETERNO Cloud'))
}
// Gewinner und Verlierer 2021–2025 (Post 5): über die Systeme der Rohdatei (mindestens einmal 500 Installationen).
{
  const q = (j, n) => Number(INST.find((r) => r.stichtag === `${j}-12-31` && r.system === n)?.installationen ?? NaN)
  const d = [...new Set(INST.filter((r) => r.stichtag === '2025-12-31' && r.system !== '__SUMME__').map((r) => r.system))].map((n) => [n, q(2025, n) - q(2021, n)]).filter(([, x]) => Number.isFinite(x))
  const plus = d.filter(([, x]) => x > 0), minus = d.filter(([, x]) => x < 0)
  K['Gewinner Zahl'] = `${plus.length} `; K['Verlierer Zahl'] = `${minus.length} `
  K['Gewinner Summe'] = de(plus.reduce((a, [, x]) => a + x, 0)); K['Verlierer Summe'] = de(-minus.reduce((a, [, x]) => a + x, 0))
  K['Systeme mit 500'] = `${d.length} Systemen`
  K['Summe Veränderung'] = de(Math.abs(q(2025, '__SUMME__') - q(2021, '__SUMME__')))
  K['Veränderung erfasst'] = de(Math.abs(d.reduce((a, [, x]) => a + x, 0)))
  K['CGM 2021–2025'] = de(-['CGM MEDISTAR (BLACK PRO)', 'TURBOMED', 'ALBIS', 'CGM M1 PRO (ehem. CompuMED M1)', 'DATA VITAL'].reduce((a, n) => a + q(2025, n) - q(2021, n), 0))
  K['Neue 2021–2025'] = de(['tomedo', 'T2med', 'Medical Office'].reduce((a, n) => a + q(2025, n) - q(2021, n), 0))
}
// Welche Kennzahl muss in welchem Text stehen.
const ERWARTET = {
  [`${H}/content/artikel/01-praxissoftware-arztpraxen-marktanteile.md`]: ['MEDISTAR 2025', 'MEDISTAR 2013', 'TURBOMED 2025', 'TURBOMED 2013', 'medatixx 2025', 'x.isynet 2025', 'Medical Office 2013', 'Medical Office 2025', 'tomedo 2025', 'T2med 2025', 'Summe Arztsysteme 2013', 'Summe Arztsysteme 2025', 'Rückgang Arztsysteme', 'CGM-Anteil 2013', 'CGM-Anteil 2025', 'MEDISTAR-Anteil 2025', 'CGM 2013', 'CGM 2025', 'Gerechnet kurz', 'Sichtbar gerechnet lang'],
  [`${H}/docs/linkedin/post-01-praxissoftware.md`]: ['MEDISTAR 2025', 'MEDISTAR 2013', 'TURBOMED 2025', 'TURBOMED 2013', 'Medical Office 2013', 'Medical Office 2025', 'tomedo 2025', 'T2med 2025', 'Gerechnet kurz'],
  [`${H}/seiten/artikel/datenherkunft.html`]: ['Gerechnet lang', 'Sichtbar gerechnet lang'],
  [`${H}/samples/index.ts`]: ['Gerechnet lang', 'Sichtbar gerechnet lang'],
  [`${H}/docs/DATASETS.md`]: ['Gerechnet lang'],
  [`${H}/content/artikel/06-labordaten-ldt-praxissoftware.md`]: ['LDT-Befund-Anteil', 'GOP 40092 Anteil'],
  [`${H}/content/artikel/05-praxissoftware-wechsel-gewinner-verlierer.md`]: ['Gewinner Zahl', 'Verlierer Zahl', 'Gewinner Summe', 'Verlierer Summe', 'Systeme mit 500', 'Summe Veränderung', 'Veränderung erfasst', 'CGM 2021–2025', 'Neue 2021–2025'],
  [`${H}/content/artikel/04-praxissoftware-aufsteiger-tomedo-t2med.md`]: ['tomedo 2025', 'T2med 2025', 'Medical Office 2013', 'Medical Office 2025', '2025 Veränderung tomedo', '2025 Veränderung T2med', '2025 Veränderung MEDISTAR', '2025 Veränderung TURBOMED', '2025 Veränderung Medical Office', '2025 Differenz tomedo', '2025 Differenz T2med', 'tomedo+T2med 2025', 'Mac-Linux-Browser 2025'],
  [`${H}/content/artikel/03-psychotherapie-software-elefant-psyprax.md`]: ['Elefant 2025', 'psyprax 2025', 'MEDISTAR 2025', 'Elefant 2023', 'MEDISTAR 2023', 'psyprax 2024', 'MEDISTAR 2024', 'Wachstum Elefant', 'Wachstum Epikur', 'Wachstum psyprax', 'Rückgang MEDISTAR', 'Gerechnet Psycho'],
  [`${H}/content/artikel/02-praxissoftware-hersteller-cgm-medatixx.md`]: ['CGM 2013', 'CGM 2025', 'medatixx 2013 (Hersteller)', 'medatixx 2025 (Hersteller)', 'Anteil CGM 2013', 'Anteil CGM 2025', 'Anteil medatixx 2025', 'Anteil Neue 2013', 'Anteil Neue 2025', 'Neue 2013', 'Neue 2025', 'medatixx ohne EL 2025', 'Summe Arztsysteme 2025', 'Rückgang Arztsysteme'],
  [`${H}/content/roadmap.ts`]: ['LDT-Befund-Anteil', 'eArztbrief-Anteil', 'eArztbriefe 2023', 'eArztbriefe 2024', 'eArztbriefe 2025', 'eArztbriefe 2026 bis Sep'],
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
merke(['x.isynet (ehem. MCS-ISYNET)', 'x.concept (ehem. DOCconcept)', 'x.comfort (ehem. DOCcomfort)'].reduce((a, n) => a + roh(INST, '2021-12-31', n) - roh(INST, '2025-12-31', n), 0)) // Verlust der alten medatixx-Systeme 2021–2025
bekannt.add('10.000')
// Differenzen erstes/letztes Jahr je Reihe in den abgeleiteten Datensätzen (Texte nennen „5.757 weniger“ o. ä.).
for (const T of [D.AERZTE_PRAXISFORM, D.MVZ_ANZAHL]) for (let i = 1; i < T.headers.length; i++) merke(Math.abs(T.rows.at(-1)[i] - T.rows[0][i])) // rund 10.000 Tierarztpraxen: Tierärzte Atlas 2024, belegt auf der Schwesterseite (sites/tiermedizin/seiten/artikel/tierarztketten-deutschland.html)
// MVZ und Bundesarztregister (recherche/mvz.md): Rohwerte und die Ableitungen, die Texte zitieren.
for (const r of leseCsv(path.join(RAW, 'ti-nutzung.csv'))) merke(Number(r.wert))
for (const r of leseCsv(path.join(RAW, 'labor.csv'))) merke(Number(r.wert))
if (fs.existsSync(path.join(RAW, 'mvz.csv'))) {
  const MV = leseCsv(path.join(RAW, 'mvz.csv'))
  for (const r of MV) merke(Number(r.wert))
  const m = (j, r) => Number(MV.find((x) => x.stichtag === `${j}-12-31` && x.reihe === r)?.wert ?? NaN)
  for (let j = 2004; j <= 2025; j++) {
    merke(m(j, 'praxen_ep_hausaerztlich') + m(j, 'praxen_ep_fachaerztlich')) // ärztliche Einzelpraxen
    merke(m(j, 'bar_t5_aerztlich_ep_zulassung_mit_angestellten') + m(j, 'bar_t5_aerztlich_ep_zulassung_ohne_angestellte')) // dasselbe aus Tabelle 5
    merke(m(j, 'bar_t5_psychotherapeutisch_ep_zulassung_mit_angestellten') + m(j, 'bar_t5_psychotherapeutisch_ep_zulassung_ohne_angestellte')) // psychotherapeutische Einzelpraxen aus Tabelle 5
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
  path.join(H, 'content/roadmap.ts'), path.join(H, 'samples/index.ts'),
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
