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
const GRUPPEN = { 'CompuGroup Medical': /^CompuGroup Medical$/, 'medatixx (Hersteller)': /^medatixx$/, 'Herausforderer': /^(INDAMED|Zollsoft|T2med)$/ }
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
  // E-Rezepte: Jahressumme der Monatswerte gleich Differenz der Jahresendstände; 2025 gegen die ABDA (582 Mio.).
  { const R = D.EREZEPT_MONAT, j25 = R.rows.filter((r) => r[0].startsWith('2025')).reduce((x, r) => x + r[1], 0)
    const TIk = leseCsv(path.join(RAW, 'ti-nutzung.csv')), zk = (st) => Number(TIk.find((x) => x.reihe === 'erezepte_eingeloest_kumuliert' && x.stichtag === st)?.wert)
    if (j25 !== zk('2025-12-31') - zk('2024-12-31')) fehler.push('E-Rezepte 2025: Monatssumme ≠ Differenz der Jahresendstände')
    K['E-Rezepte 2025'] = `${Math.round(j25 / 1e6)} Millionen`
    if (Math.abs(j25 / 1e6 - 582) > 1) fehler.push(`E-Rezepte 2025: ${j25} weicht von der ABDA (582 Mio.) ab`) }
  // eAU: Spitze und Jahressumme 2025 (auch in Post 7 als KIM-Anteil genannt).
  { const E2 = D.EAU_MONAT, max = E2.rows.reduce((a, r) => (r[1] > a[1] ? r : a))
    K['eAU Spitze'] = `${max[0] === '2023-03' ? 'März 2023' : max[0]} mit ${(max[1] / 1e6).toFixed(1).replace('.', ',')} Millionen`
    const TIe = leseCsv(path.join(RAW, 'ti-nutzung.csv')), ze = (st) => Number(TIe.find((x) => x.reihe === 'kim_eau_an_kassen_kumuliert' && x.stichtag === st)?.wert)
    if (E2.rows.filter((r) => r[0].startsWith('2025')).reduce((x, r) => x + r[1], 0) !== ze('2025-12-31') - ze('2024-12-31')) fehler.push('eAU 2025: Monatssumme ≠ Differenz der Jahresendstände') }
  // KIM-Verkehr 2025 aus den kumulierten Zählern (Jahresendstände), eArztbrief-Anteil daran (Post 7).
  const T = leseCsv(path.join(RAW, 'ti-nutzung.csv')), z = (r, st) => Number(T.find((x) => x.reihe === r && x.stichtag === st)?.wert)
  const j25 = (r) => z(r, '2025-12-31') - z(r, '2024-12-31')
  K['KIM 2025'] = mio(j25('kim_nachrichten_gesamt_kumuliert')).replace('Mio', 'Millionen'); K['eAU 2025'] = mio(j25('kim_eau_an_kassen_kumuliert')).replace('Mio', 'Millionen')
  K['eArztbrief am KIM 2025'] = `${Math.round(j25('kim_earztbriefe_kumuliert') / j25('kim_nachrichten_gesamt_kumuliert') * 100)} Prozent`
  if (Math.abs(j25('kim_earztbriefe_kumuliert') - jahr('2025')) > 0) fehler.push('Post 7: eArztbriefe 2025 aus Monaten ≠ Jahresendstände')
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
  // Letztes Quartal 2025 (Post 5): Veränderung Q3 → Q4 je System.
  const qq = (n) => Number(INST.find((r) => r.stichtag === '2025-12-31' && r.system === n)?.installationen) - Number(INST.find((r) => r.stichtag === '2025-09-30' && r.system === n)?.installationen)
  K['Q4/25 Gewinner'] = `Das neue medatixx gewann ${qq('medatixx')} Installationen, tomedo ${qq('tomedo')}, T2med ${qq('T2med')} und Medical Office ${qq('Medical Office')}`
  K['Q4/25 Verlierer'] = `CGM MEDISTAR verlor ${-qq('CGM MEDISTAR (BLACK PRO)')}, CGM TURBOMED ${-qq('TURBOMED')}, x.concept ${-qq('x.concept (ehem. DOCconcept)')}, x.isynet ${-qq('x.isynet (ehem. MCS-ISYNET)')} und CGM ALBIS ${-qq('ALBIS')}`
  K['Q4/25 Summe'] = `um ${qq('__SUMME__')}.`
}
// MVZ und Praxisform (Post 8): Anteile und Summen aus dem Datensatz aerzte-praxisform und Tabelle 5 des Bundesarztregisters.
{
  const P = D.AERZTE_PRAXISFORM, z = (j) => P.rows.find((r) => r[0] === String(j)), ges = (j) => z(j).slice(1).reduce((a, b) => a + b, 0)
  K['Ärzte gesamt 2015'] = de(ges(2015)); K['Ärzte gesamt 2025'] = de(ges(2025))
  K['MVZ-Anteil 2015'] = prozent(z(2015)[3], ges(2015), 1); K['MVZ-Anteil 2025'] = prozent(z(2025)[3], ges(2025), 1)
  K['Köpfe Einzelpraxis Rückgang'] = prozent(z(2015)[1] - z(2025)[1], z(2015)[1], 1)
  K['Arztsysteme 2015'] = de(summe(A, 2015))
  const MV = leseCsv(path.join(RAW, 'mvz.csv')), m = (j, r) => Number(MV.find((x) => x.stichtag === `${j}-12-31` && x.reihe === r)?.wert)
  const ang = (j) => m(j, 'bar_t5_aerztlich_ep_anstellung_mit_lb') + m(j, 'bar_t5_aerztlich_ep_anstellung_ohne_lb')
  K['Angestellte EP 2015'] = de(ang(2015)); K['Angestellte EP 2025'] = de(ang(2025))
  const solo = (j) => m(j, 'bar_t5_aerztlich_ep_zulassung_ohne_angestellte')
  K['Solo-EP Rückgang'] = prozent(solo(2015) - solo(2025), solo(2015), 1)
  K['KH-MVZ-Anteil'] = prozent(m(2025, 'mvz_krankenhaus_mvz'), m(2025, 'mvz_anzahl'), 1)
  K['MVZ angestellt'] = prozent(m(2025, 'mvz_aerzte_angestellt'), m(2025, 'mvz_aerzte_angestellt') + m(2025, 'mvz_aerzte_vertragsaerzte'), 1)
  const ep = (j) => solo(j) + m(j, 'bar_t5_aerztlich_ep_zulassung_mit_angestellten') // ärztliche Einzelpraxen = Inhaber mit Zulassung
  K['ärztliche EP Rückgang'] = prozent(ep(2015) - ep(2025), ep(2015), 1)
  // Köpfe in Einzelpraxen = Zulassung mit/ohne Angestellte + Angestellte, muss dem Datensatz gleichen.
  for (const j of [2015, 2025]) if (solo(j) + m(j, 'bar_t5_aerztlich_ep_zulassung_mit_angestellten') + ang(j) !== z(j)[1]) fehler.push(`Post 8: Köpfe Einzelpraxis ${j} ≠ Tabelle 5`)
}
// Krankenhaussysteme (Post 9): Summen, Anteile, Obergrenze Krankenhaus-MVZ gegen KIS-Installationen 2015–2025.
{
  const KI = D.PVS_KIS, ks = (j) => summe(KI, j), tot = (j) => Number(INST.find((r) => r.stichtag === `${j}-12-31` && r.system === '__SUMME__')?.installationen)
  K['KIS 2013'] = de(ks(2013)); K['KIS 2025'] = de(ks(2025))
  K['KIS-Anteil 2013'] = prozent(ks(2013), tot(2013), 1); K['KIS-Anteil 2025'] = prozent(ks(2025), tot(2025), 1)
  K['ORBIS-Anteil KIS'] = prozent(wert(KI, 2025, 'ORBIS'), ks(2025), 1)
  K['SAP Wachstum'] = prozent(wert(KI, 2025, 'SAP') - wert(KI, 2013, 'SAP'), wert(KI, 2013, 'SAP'), 1)
  K['KIS plus 2015–2025'] = de(ks(2025) - ks(2015))
  K['Gerechnet KIS'] = `${GERECHNET['pvs-kis'].length} von ${(KI.headers.length - 1) * KI.rows.length}`
  const MV = leseCsv(path.join(RAW, 'mvz.csv')), kh = (j) => Number(MV.find((x) => x.stichtag === `${j}-12-31` && x.reihe === 'mvz_krankenhaus_mvz')?.wert)
  K['KH-MVZ plus 2015–2025'] = de(kh(2025) - kh(2015))
  if (!((ks(2025) - ks(2015)) / (kh(2025) - kh(2015)) < 0.25)) fehler.push('Post 9: Obergrenze „knapp ein Viertel“ stimmt nicht mehr')
}
// Konzentration (Post 10): größte drei und fünf Arztsysteme, Hersteller Ende 2025.
{
  const w = D.PVS_ARZT.headers.slice(1).map((n) => wert(D.PVS_ARZT, 2025, n)).sort((x, y) => y - x), s = summe(A, 2025)
  K['Top 3 Anteil'] = prozent(w.slice(0, 3).reduce((a, b) => a + b, 0), s, 1); K['Top 5 Anteil'] = prozent(w.slice(0, 5).reduce((a, b) => a + b, 0), s, 1)
  for (const [n, k] of [['Medical Office', 'INDAMED'], ['tomedo', 'Zollsoft'], ['T2med', 'T2med']]) K[`Anteil ${k} 2025`] = prozent(wert(A, 2025, n), s, 1)
  K['CGM+medatixx 2025'] = prozent(hs(2025, 1) + hs(2025, 2), s, 1)
  K['Summe alle 2025'] = de(Number(INST.find((r) => r.stichtag === '2025-12-31' && r.system === '__SUMME__').installationen))
}
// Labor (Post 11): Anteil angestellt, Rückgang Zulassung, Vertragsärzte in Einzelpraxen aus Tabelle 5.
{
  const L = leseCsv(path.join(RAW, 'labor.csv')), l = (j, r) => Number(L.find((x) => x.stichtag === `${j}-12-31` && x.reihe === r)?.wert)
  const reihen = [...new Set(L.map((x) => x.reihe))]
  const ges = reihen.find((r) => /bar.*gesamt/.test(r)), ein = reihen.find((r) => /bar.*angestellt_einrichtung(en)?$/.test(r))
  if (!ges || !ein) fehler.push(`Post 11: Reihen in labor.csv nicht gefunden (${reihen.filter((r) => r.startsWith('bar')).join(', ')})`)
  else {
    for (const j of [2013, 2025]) K[`Labor angestellt ${j}`] = prozent(l(j, ein), l(j, ges), 1)
    const LA = D.LABOR_AERZTE, z = (j) => LA.rows.find((r) => r[0] === String(j))
    K['Labor Zulassung Rückgang'] = prozent(z(2013)[2] - z(2025)[2], z(2013)[2], 1)
    if (z(2025)[1] !== l(2025, ein)) fehler.push('Post 11: Datensatz labor-aerzte ≠ labor.csv (angestellt 2025)')
    const ep = (j) => l(j, 'bar_labor_t5_ep_vertragsaerzte_mit_angestellten') + l(j, 'bar_labor_t5_ep_vertragsaerzte_ohne_angestellte')
    K['Labor EP'] = `noch ${ep(2025)} Laborärztinnen und -ärzte mit Zulassung, 2013 waren es ${ep(2013)}`
  }
}
// Allgemeinmediziner (Post 12): Rohdaten der Einzelberichte, Q4/2020 gegen Q4/2025, Anteile an den Top 20 Ende 2025.
{
  const AM = leseCsv(path.join(RAW, 'pvs-kbv-allgemeinmediziner.csv')), v = (st, id) => Number(AM.find((x) => x.stichtag === st && x.kbv_id === id)?.installationen)
  const q4 = AM.filter((x) => x.stichtag === '2025-12-31'), summe25 = q4.reduce((a, x) => a + Number(x.installationen), 0)
  K['AM Summe 2025'] = de(summe25)
  for (const [n, id] of [['TURBOMED', '112'], ['MEDISTAR', '280']]) K[`AM Rückgang ${n}`] = prozent(v('2020-12-31', id) - v('2025-12-31', id), v('2020-12-31', id), 1)
  const anteil = (ids) => prozent(ids.reduce((a, id) => a + v('2025-12-31', id), 0), summe25, 1)
  K['AM medatixx-Gruppe'] = anteil(['462', '216', '243', '266', '135']); K['AM CGM'] = anteil(['280', '112', '203', '252']); K['AM Neue'] = anteil(['210', '498', '457'])
  K['AM T2med-Anteil'] = anteil(['498'])
  K['AM Abstand 1–4'] = de(v('2025-12-31', '462') - v('2025-12-31', '498'))
  // Reihenfolge: medatixx vorn erst Ende 2025, im Quartal davor Platz 3.
  const rang = (st) => AM.filter((x) => x.stichtag === st).sort((a, b) => b.installationen - a.installationen).map((x) => x.kbv_id)
  if (rang('2025-12-31')[0] !== '462' || rang('2025-09-30')[2] !== '462') fehler.push('Post 12: medatixx nicht Platz 1 Ende 2025 bzw. nicht Platz 3 im Vorquartal')
}
// Welche Kennzahl muss in welchem Text stehen.
const ERWARTET = {
  [`${H}/content/artikel/01-praxissoftware-arztpraxen-marktanteile.md`]: ['MEDISTAR 2025', 'MEDISTAR 2013', 'TURBOMED 2025', 'TURBOMED 2013', 'medatixx 2025', 'x.isynet 2025', 'Medical Office 2013', 'Medical Office 2025', 'tomedo 2025', 'T2med 2025', 'Summe Arztsysteme 2013', 'Summe Arztsysteme 2025', 'Rückgang Arztsysteme', 'CGM-Anteil 2013', 'CGM-Anteil 2025', 'MEDISTAR-Anteil 2025', 'CGM 2013', 'CGM 2025', 'Gerechnet kurz', 'Sichtbar gerechnet lang'],
  [`${H}/docs/linkedin/post-01-praxissoftware.md`]: ['MEDISTAR 2025', 'MEDISTAR 2013', 'TURBOMED 2025', 'TURBOMED 2013', 'Medical Office 2013', 'Medical Office 2025', 'tomedo 2025', 'T2med 2025', 'Gerechnet kurz'],
  [`${H}/seiten/artikel/datenherkunft.html`]: ['Gerechnet lang', 'Sichtbar gerechnet lang', 'E-Rezepte 2025'],
  [`${H}/samples/index.ts`]: ['Gerechnet lang', 'Sichtbar gerechnet lang', 'E-Rezepte 2025', 'eAU Spitze', 'eAU 2025'],
  [`${H}/docs/DATASETS.md`]: ['Gerechnet lang'],
  [`${H}/content/artikel/06-labordaten-ldt-praxissoftware.md`]: ['LDT-Befund-Anteil', 'GOP 40092 Anteil'],
  [`${H}/content/artikel/05-praxissoftware-wechsel-gewinner-verlierer.md`]: ['Gewinner Zahl', 'Verlierer Zahl', 'Gewinner Summe', 'Verlierer Summe', 'Systeme mit 500', 'Summe Veränderung', 'Veränderung erfasst', 'CGM 2021–2025', 'Neue 2021–2025', 'Q4/25 Gewinner', 'Q4/25 Verlierer', 'Q4/25 Summe'],
  [`${H}/content/artikel/04-praxissoftware-aufsteiger-tomedo-t2med.md`]: ['tomedo 2025', 'T2med 2025', 'Medical Office 2013', 'Medical Office 2025', '2025 Veränderung tomedo', '2025 Veränderung T2med', '2025 Veränderung MEDISTAR', '2025 Veränderung TURBOMED', '2025 Veränderung Medical Office', '2025 Differenz tomedo', '2025 Differenz T2med', 'tomedo+T2med 2025', 'Mac-Linux-Browser 2025'],
  [`${H}/content/artikel/03-psychotherapie-software-elefant-psyprax.md`]: ['Elefant 2025', 'psyprax 2025', 'MEDISTAR 2025', 'Elefant 2023', 'MEDISTAR 2023', 'psyprax 2024', 'MEDISTAR 2024', 'Wachstum Elefant', 'Wachstum Epikur', 'Wachstum psyprax', 'Rückgang MEDISTAR', 'Gerechnet Psycho'],
  [`${H}/content/artikel/02-praxissoftware-hersteller-cgm-medatixx.md`]: ['CGM 2013', 'CGM 2025', 'medatixx 2013 (Hersteller)', 'medatixx 2025 (Hersteller)', 'Anteil CGM 2013', 'Anteil CGM 2025', 'Anteil medatixx 2025', 'Anteil Neue 2013', 'Anteil Neue 2025', 'Neue 2013', 'Neue 2025', 'medatixx ohne EL 2025', 'Summe Arztsysteme 2025', 'Rückgang Arztsysteme'],
  [`${H}/content/artikel/07-earztbrief-kim-zahlen.md`]: ['eArztbrief-Anteil', 'eArztbriefe 2023', 'eArztbriefe 2024', 'eArztbriefe 2025', 'eArztbriefe 2026 bis Sep', 'KIM 2025', 'eAU 2025', 'eArztbrief am KIM 2025'],
  [`${H}/content/artikel/08-mvz-einzelpraxis-aerzte.md`]: ['Ärzte gesamt 2015', 'Ärzte gesamt 2025', 'MVZ-Anteil 2015', 'MVZ-Anteil 2025', 'Köpfe Einzelpraxis Rückgang', 'Arztsysteme 2015', 'Summe Arztsysteme 2025', 'Angestellte EP 2015', 'Angestellte EP 2025', 'Solo-EP Rückgang', 'KH-MVZ-Anteil', 'MVZ angestellt', 'ärztliche EP Rückgang'],
  [`${H}/content/artikel/09-krankenhaus-software-ambulant-kis.md`]: ['KIS 2013', 'KIS 2025', 'KIS-Anteil 2013', 'KIS-Anteil 2025', 'ORBIS-Anteil KIS', 'SAP Wachstum', 'KIS plus 2015–2025', 'KH-MVZ plus 2015–2025', 'Gerechnet KIS'],
  [`${H}/content/artikel/10-pvs-statistik-kbv-methode.md`]: ['Top 3 Anteil', 'Top 5 Anteil', 'Anteil CGM 2025', 'Anteil medatixx 2025', 'Anteil INDAMED 2025', 'Anteil Zollsoft 2025', 'Anteil T2med 2025', 'CGM+medatixx 2025', 'Summe alle 2025', 'medatixx 2025 (Hersteller)', 'KIS-Anteil 2025'],
  [`${H}/content/artikel/11-labor-angestellte-laboraerzte.md`]: ['Labor angestellt 2013', 'Labor angestellt 2025', 'Labor Zulassung Rückgang', 'Labor EP'],
  [`${H}/content/artikel/12-praxissoftware-allgemeinmediziner.md`]: ['AM Summe 2025', 'AM Rückgang TURBOMED', 'AM Rückgang MEDISTAR', 'AM medatixx-Gruppe', 'AM CGM', 'AM Neue', 'AM T2med-Anteil', 'AM Abstand 1–4', 'Anteil CGM 2025', 'Anteil T2med 2025'],
  [`${H}/content/roadmap.ts`]: ['LDT-Befund-Anteil', 'eArztbrief-Anteil', 'eArztbriefe 2023', 'eArztbriefe 2024', 'eArztbriefe 2025', 'eArztbriefe 2026 bis Sep'],
}
// Datenherkunft: jeder Datensatz hat einen Abschnitt mit seiner id, und die Zahl gerechneter Werte stimmt.
{
  const dh = fs.readFileSync(`${H}/seiten/artikel/datenherkunft.html`, 'utf8')
  const ids = [...fs.readFileSync(`${H}/samples/index.ts`, 'utf8').matchAll(/^    id: '([a-z0-9-]+)'/gm)].map((m) => m[1])
  for (const id of ids) if (!dh.includes(`id="${id}"`)) fehler.push(`Datenherkunft: Abschnitt für Datensatz „${id}“ fehlt`)
  for (const [id, T] of [['pvs-psychotherapie', D.PVS_PSYCHO], ['pvs-aufsteiger', D.PVS_AUFSTEIGER], ['pvs-kis', D.PVS_KIS], ['pvs-allgemeinmediziner', D.PVS_ALLGEMEIN], ['pvs-internisten', D.PVS_INTERNISTEN]]) {
    const t = `${GERECHNET[id].length} von ${(T.headers.length - 1) * T.rows.length} Werten`
    if (!dh.includes(t)) fehler.push(`Datenherkunft: „${t}“ (${id}) steht nicht im Text`)
  }
}
// Säulenseite: beide Tabellen gegen die Rohdaten (Installationen Q4/Q3 2025, Zulassungen am jüngsten Stand des Verzeichnisses).
{
  const seite = fs.readFileSync(path.join(H, 'seiten/artikel/praxisverwaltungssysteme-deutschland.html'), 'utf8')
  // Reihenfolge auf der Seite: Systeme, Fachgruppen, Schnittstellen.
  const [t1, t3, t2] = [...seite.matchAll(/<tbody>([\s\S]*?)<\/tbody>/g)].map((m) => [...m[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => c[1].trim())))
  const norm = (n) => n.replace(/\s*\(ehem\.[^)]*\)/, '').replace(/[()]/g, '').trim()
  const roh = (st, name) => INST.find((r) => r.stichtag === st && norm(r.system) === name)
  const zahl = (z) => Number(z.replace(/\./g, ''))
  let vorher = Infinity
  for (const [name, , , q4, q3] of t1) {
    const a = roh('2025-12-31', name), b = roh('2025-09-30', name)
    if (!a || !b) { fehler.push(`Säulenseite: System „${name}“ nicht in den Rohdaten`); continue }
    if (zahl(q4) !== Number(a.installationen) || zahl(q3) !== Number(b.installationen)) fehler.push(`Säulenseite: ${name} ${q4}/${q3} ≠ Rohdaten ${a.installationen}/${b.installationen}`)
    if (zahl(q4) > vorher) fehler.push(`Säulenseite: Tabelle nicht absteigend bei ${name}`)
    vorher = zahl(q4)
  }
  const Z = leseCsv(path.join(RAW, 'pvs-zulassungen.csv')), stand = Z.map((z) => z.stand).sort().at(-1)
  const [j, m, d] = stand.split('-')
  if (!seite.includes(`Stand ${d}.${m}.${j}`)) fehler.push(`Säulenseite: Zulassungen nicht mit dem jüngsten Stand ${d}.${m}.${j} datiert`)
  const kurz = { 'ETERNO Cloud': 'ETERNO Cloud (ehem. inSuite)' }
  for (const [name, , ldt, brief, kim] of t2) {
    const z = Z.find((x) => x.stand === stand && (x.system === (kurz[name] ?? name) || norm(x.system) === name))
    if (!z) { fehler.push(`Säulenseite: Zulassungen für „${name}“ nicht in den Rohdaten`); continue }
    const soll = (feld, text) => (z[feld] === 'ja') === !/nicht gelistet/.test(text)
    if (!soll('ldt_befund', ldt) || (/Auftrag-Export/.test(ldt) && z.ldt_auftrag !== 'ja') || !soll('earztbrief', brief) || !soll('kim_1click', kim)) fehler.push(`Säulenseite: Zulassungen ${name} (${ldt} / ${brief} / ${kim}) ≠ Verzeichnis ${stand}`)
  }
  if (t1.length < 20 || t2.length < 10) fehler.push(`Säulenseite: Tabellen nicht gefunden (${t1.length}, ${t2.length} Zeilen)`)
  // Dritte Tabelle: Spitzenreiter je Arztgruppe (Gruppen mit mindestens 1.000 Installationen in den Top 20).
  const AG = leseCsv(path.join(RAW, 'pvs-kbv-arztgruppen.csv'))
  const gruppen = [...new Set(AG.map((r) => r.fachgruppe))].map((g) => { const z = AG.filter((r) => r.fachgruppe === g).sort((a, b) => b.installationen - a.installationen); return { g, s: z.reduce((a, r) => a + Number(r.installationen), 0), z } }).filter((x) => x.s >= 1000).sort((a, b) => b.s - a.s)
  if (t3.length !== gruppen.length) fehler.push(`Säulenseite: Fachgruppen-Tabelle hat ${t3.length} Zeilen, Rohdaten ${gruppen.length} Gruppen ab 1.000`)
  gruppen.forEach((x, i) => {
    const r = t3[i] ?? []
    if (r[0] !== x.g || zahl(r[1] ?? '') !== x.s || r[2] !== x.z[0].system || zahl(r[3] ?? '') !== Number(x.z[0].installationen) || r[4] !== x.z[1].system || zahl(r[5] ?? '') !== Number(x.z[1].installationen)) fehler.push(`Säulenseite: Fachgruppe ${x.g} weicht von den Rohdaten ab`)
  })
  const zahlwort = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn']
  const medistarVorn = gruppen.filter((x) => x.z[0].system === 'CGM MEDISTAR BLACK PRO').length
  if (!seite.includes(`führt in ${zahlwort[medistarVorn]} der ${gruppen.length} Gruppen`)) fehler.push(`Säulenseite: „führt in ${zahlwort[medistarVorn]} der ${gruppen.length} Gruppen“ steht nicht im Text`)
}
// Berichte je Arztgruppe (Post 12): je System nie mehr als in der Gesamtliste, Psychotherapeuten-Summe wie im Einzelbericht.
if (fs.existsSync(path.join(RAW, 'pvs-kbv-arztgruppen.csv'))) {
  const AG = leseCsv(path.join(RAW, 'pvs-kbv-arztgruppen.csv'))
  const norm = (n) => n.replace(/\s*\(ehem\.[^)]*\)/, '').replace(/[()]/g, '').trim().toLowerCase()
  const gesamt = new Map(INST.filter((r) => r.stichtag === '2025-12-31').map((r) => [norm(r.system), Number(r.installationen)]))
  const jeSystem = new Map()
  for (const r of AG) jeSystem.set(norm(r.system), (jeSystem.get(norm(r.system)) ?? 0) + Number(r.installationen))
  for (const [n, v] of jeSystem) if (gesamt.has(n) && v > gesamt.get(n)) fehler.push(`Arztgruppen: ${n} hat in den Gruppen ${v}, in der Gesamtliste nur ${gesamt.get(n)}`)
  const gruppe = (g) => AG.filter((r) => r.fachgruppe === g).reduce((a, r) => a + Number(r.installationen), 0)
  if (gruppe('Psychotherapeuten') !== 35271) fehler.push(`Arztgruppen: Psychotherapeuten ${gruppe('Psychotherapeuten')} ≠ 35.271 aus dem Einzelbericht`)
  if (new Set(AG.map((r) => r.fachgruppe)).size !== 23) fehler.push('Arztgruppen: nicht 23 Fachgruppen')
  // Zeitreihe Allgemeinmediziner (archivierte Einzelberichte) gegen den Gesamtbericht Q4/Q3 2025 und gegen den Datensatz.
  const AM = leseCsv(path.join(RAW, 'pvs-kbv-allgemeinmediziner.csv'))
  for (const r of AG.filter((x) => x.fachgruppe === 'Allgemeinmediziner')) {
    for (const [st, feld] of [['2025-12-31', 'installationen'], ['2025-09-30', 'installationen_vorquartal']]) {
      const a = AM.find((x) => x.stichtag === st && x.kbv_id === r.kbv_id)
      if (!a || Number(a.installationen) !== Number(r[feld])) fehler.push(`Allgemeinmediziner: ${r.system} ${st} Einzelbericht ${a?.installationen} ≠ Gesamtbericht ${r[feld]}`)
    }
  }
  // Internisten: Einzelberichte gegen Gesamtbericht und Datensatz gegen Rohdaten.
  const IN = leseCsv(path.join(RAW, 'pvs-kbv-internisten.csv'))
  for (const r of AG.filter((x) => x.fachgruppe === 'Internisten')) for (const [st, feld] of [['2025-12-31', 'installationen'], ['2025-09-30', 'installationen_vorquartal']]) {
    const a = IN.find((x) => x.stichtag === st && x.kbv_id === r.kbv_id)
    if (!a || Number(a.installationen) !== Number(r[feld])) fehler.push(`Internisten: ${r.system} ${st} Einzelbericht ${a?.installationen} ≠ Gesamtbericht ${r[feld]}`)
  }
  const idsIn = { 'CGM MEDISTAR': '280', 'x.isynet': '216', 'CGM TURBOMED': '112', medatixx: '462', 'Medical Office': '210', T2med: '498', 'CGM ALBIS': '203', 'x.concept': '243' }
  for (const r of D.PVS_INTERNISTEN.rows) D.PVS_INTERNISTEN.headers.slice(1).forEach((n, i) => {
    if (!idsIn[n]) fehler.push(`pvs-internisten: KBV-Id für ${n} fehlt in der Prüfung`)
    const a = IN.find((x) => x.stichtag === `${r[0]}-12-31` && x.kbv_id === idsIn[n])
    if (a && Number(a.installationen) !== r[i + 1]) fehler.push(`pvs-internisten: ${n} ${r[0]} ${r[i + 1]} ≠ Rohdaten ${a.installationen}`)
  })
  const PA = D.PVS_ALLGEMEIN, ids = { medatixx: '462', 'CGM MEDISTAR': '280', 'CGM TURBOMED': '112', T2med: '498', 'Medical Office': '210', 'x.isynet': '216', 'x.concept': '243', 'CGM ALBIS': '203', 'QUINCY WIN': '244', tomedo: '457' }
  for (const r of PA.rows) PA.headers.slice(1).forEach((n, i) => {
    const a = AM.find((x) => x.stichtag === `${r[0]}-12-31` && x.kbv_id === ids[n])
    if (!ids[n]) fehler.push(`pvs-allgemeinmediziner: KBV-Id für ${n} fehlt in der Prüfung`)
    if (a && Number(a.installationen) !== r[i + 1]) fehler.push(`pvs-allgemeinmediziner: ${n} ${r[0]} ${r[i + 1]} ≠ Rohdaten ${a.installationen}`)
  })
}
// Links auf Glossar-Anker (begriffe-praxis-it.html#…) müssen auf einen vorhandenen Begriff zeigen.
{
  const glossar = fs.readFileSync(path.join(H, 'seiten/artikel/begriffe-praxis-it.html'), 'utf8')
  const anker = new Set([...glossar.matchAll(/<dt id="([^"]+)"/g)].map((m) => m[1]))
  const quellen = [...fs.readdirSync(path.join(H, 'content/artikel')).filter((f) => f.endsWith('.md')).map((f) => path.join(H, 'content/artikel', f)), ...fs.readdirSync(path.join(H, 'seiten/artikel')).map((f) => path.join(H, 'seiten/artikel', f))]
  for (const f of quellen) for (const [, a] of fs.readFileSync(f, 'utf8').matchAll(/begriffe-praxis-it\.html#([a-z0-9-]+)/g)) if (!anker.has(a) && a !== 'begriffe') fehler.push(`${f}: Glossar-Anker #${a} gibt es nicht`)
}
// Häufige Fragen der Startseite (Profil): jede Zahl der Antwort muss im verlinkten Artikel stehen.
{
  const PROFIL = (await import(pathToFileURL(path.resolve(H, 'profil.ts')).href)).default
  const artikelText = (slug) => {
    const f = fs.readdirSync(path.join(H, 'content/artikel')).find((x) => fs.readFileSync(path.join(H, 'content/artikel', x), 'utf8').includes(`slug: ${slug}\n`))
    return f ? fs.readFileSync(path.join(H, 'content/artikel', f), 'utf8') : null
  }
  for (const f of PROFIL.start.faq) {
    const t = artikelText(f.slug)
    if (!t) { fehler.push(`Startseiten-FAQ: Artikel „${f.slug}“ gibt es nicht`); continue }
    for (const [z] of f.antwort.matchAll(/\d{1,3}(?:\.\d{3})+|\d+,\d+/g)) if (!t.includes(z)) fehler.push(`Startseiten-FAQ „${f.frage}“: Zahl ${z} steht nicht im Artikel ${f.slug}`)
  }
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
for (const r of leseCsv(path.join(RAW, 'aerzteschaft-geschlecht.csv'))) merke(Number(r.wert))
for (const r of leseCsv(path.join(RAW, 'weiterbildung.csv'))) merke(Number(r.wert))
for (const r of leseCsv(path.join(RAW, 'medizinstudium.csv'))) merke(Number(r.wert))
for (const r of leseCsv(path.join(RAW, 'terminservicestellen.csv'))) merke(Number(r.wert))
for (const r of leseCsv(path.join(RAW, 'erezept-quote.csv'))) merke(Number(r.wert))
for (const r of leseCsv(path.join(RAW, 'weiterbildung-foerderung.csv'))) merke(Number(r.wert))
merke(10841); merke(6130) // Ländersumme 2024, VZÄ 2024 gerundet
// Berichte je Arztgruppe: Rohwerte und Summen der Top 20 je Gruppe (Mindestwert der Gruppe).
if (fs.existsSync(path.join(RAW, 'pvs-kbv-arztgruppen.csv'))) {
  const AG = leseCsv(path.join(RAW, 'pvs-kbv-arztgruppen.csv'))
  for (const r of AG) { merke(Number(r.installationen)); merke(Number(r.installationen_vorquartal)) }
  for (const g of new Set(AG.map((r) => r.fachgruppe))) merke(AG.filter((r) => r.fachgruppe === g).reduce((a, r) => a + Number(r.installationen), 0))
}
// Zweitquellen Post 10 (recherche/pvs-kbv-historie.md Abschnitt 10): rund 98.000 Praxen (AOK G+G 09/2026), „über 22.500 Praxen“ (medatixx.de 2026).
bekannt.add('98.000'); bekannt.add('22.500')
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
    merke(m(j, 'mvz_typ_nur_angestellte') + m(j, 'mvz_typ_gemischt') + m(j, 'mvz_typ_nur_vertragsaerzte')) // Summe der MVZ-Grundtypen
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
  path.join(H, 'seiten/artikel/praxisverwaltungssysteme-deutschland.html'), path.join(H, 'seiten/artikel/datenherkunft.html'), path.join(H, 'seiten/artikel/begriffe-praxis-it.html'),
  path.join(H, 'content/roadmap.ts'), path.join(H, 'samples/index.ts'), path.join(H, 'profil.ts'),
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
