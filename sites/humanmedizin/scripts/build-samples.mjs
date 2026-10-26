// Erzeugt sites/humanmedizin/samples/data.ts aus den Rohdaten in sites/humanmedizin/data/raw/.
// Aufruf: npm run daten   (im Arbeitsordner der Humanmedizin bzw. mit SITE=humanmedizin)
//
// Jeder gerechnete Wert landet zusätzlich in data/raw/pvs-gerechnet.json, mit Methode – Regel „Gerechnetes markieren“
// (CLAUDE.md). Quellen und Fallstricke: sites/humanmedizin/recherche/pvs-kbv-historie.md.
import fs from 'node:fs'
import path from 'node:path'
import { stuetze, lit } from '../../../scripts/lib/reihen.mjs'
import { leseCsv } from '../../../scripts/lib/csv.mjs'

const RAW = path.resolve('sites/humanmedizin/data/raw')
const csv = (f) => leseCsv(path.join(RAW, f))

// ---------- KBV-Installationsstatistik ----------
// Hauptdatei plus, falls vorhanden, die Nachrecherche zu 1998–2012 (gleiches Format). Anbieterzeilen
// (system=__ANBIETER__:…) dienen nur als Beleg in der Recherche, nicht als Systemwert.
const LUECKEN = 'pvs-kbv-luecken-1998-2012.csv'
const ROH = [...csv('pvs-kbv-installationen.csv'), ...(fs.existsSync(path.join(RAW, LUECKEN)) ? csv(LUECKEN) : [])]
// Die Ärzte Zeitung nennt PSYPRAX für Mitte 2010 6.198 – gegen 8.219 (2009) und 8.777 (2011) sehr wahrscheinlich ein
// Übertragungsfehler (recherche, Nachtrag 2, Widerspruch 1). Nicht als Stütze verwenden.
const INST = ROH.filter((r) => !r.system.startsWith('__ANBIETER__') && !(r.system === 'psyprax' && r.stichtag === '2010-06-30'))

// Ende 2011 gibt es nur den KBV-Bericht nach Anbietern. Wo ein Anbieter nachweislich nur ein nennenswertes System hatte
// (Abgleich der Listen 1999/2000 und Mitte 2011, recherche Abschnitt 9 und Nachtrag 2), dient der Anbieterwert als
// Jahresendwert des Systems – als Annahme, in pvs-gerechnet.json markiert.
const EIN_PRODUKT = {
  'MEDISTAR Praxiscomputer GmbH': 'CGM MEDISTAR (BLACK PRO)', 'TURBOMED EDV GmbH': 'TURBOMED', 'DURIA eG': 'DURIA',
  'Mediamed Systec GmbH': 'S3-Win', 'Bitron GmbH': 'Med7', 'Softland GmbH': 'EL - Elaphe Longissima', 'Data-AL GmbH': 'Data-AL', promedico: 'easymed',
}
const ANNAHME = ROH.filter((r) => r.stichtag === '2011-12-31' && EIN_PRODUKT[r.system.replace('__ANBIETER__:', '')])
  .map((r) => ({ system: EIN_PRODUKT[r.system.replace('__ANBIETER__:', '')], jahr: 2011, wert: Number(r.installationen) }))
const ANTEIL = csv('pvs-kbv-anteile-2017-2020.csv')

// Zeitpunkt eines Stichtags als Kommazahl, gemessen in Jahresenden: 31.12.2016 = 2016, 30.09.2017 = 2016,75.
const zeitpunkt = (iso) => { const [j, m] = iso.split('-').map(Number); return j - 1 + m / 12 }
const jahre = (von, bis) => Array.from({ length: bis - von + 1 }, (_, i) => von + i)

/** Belegte Jahresendwerte (31.12.) eines Systems: {Jahr: Installationen}. */
const belegt = (system) => Object.fromEntries(INST.filter((r) => r.system === system && r.stichtag.endsWith('-12-31')).map((r) => [Number(r.stichtag.slice(0, 4)), Number(r.installationen)]))
/** Belege an anderen Stichtagen (Q1–Q3) eines Systems, nur aus Jahren ohne Jahresendwert: {Zeitpunkt: Installationen}. */
const unterjaehrig = (system) => {
  const q4 = belegt(system)
  return Object.fromEntries(INST.filter((r) => r.system === system && !r.stichtag.endsWith('-12-31') && q4[Number(r.stichtag.slice(0, 4))] == null)
    .map((r) => [zeitpunkt(r.stichtag), Number(r.installationen)]))
}
const SUMME = belegt('__SUMME__')

// 2017–2020 hat die KBV nur Anteile in Prozent veröffentlicht (Q3/2017, Q3/2020). Installationen = Anteil × Gesamtzahl,
// die Gesamtzahl linear zwischen Q4/2016 und Q4/2021. Die Stützpunkte liegen auf ihrem echten Zeitpunkt (2016,75 und
// 2019,75); die Jahresenden 2017–2020 entstehen linear zwischen den Nachbarn.
const summeBei = (t) => stuetze({ 2016: SUMME[2016], 2021: SUMME[2021] }, t)

// Vor dem Markteintritt ist 0 ein Beleg, keine Lücke – nur wo Eintritt bzw. Zulassung belegt sind (recherche, Abschnitt 8):
// tomedo KBV-Zertifizierung Mitte 2013, medatixx (Produkt) „seit 2014 auf dem Markt“, T2med Markteinführung 2015.
// easymed steht ab 2023 nicht mehr in der vollständigen KBV-Liste (promedico 2018 in medatixx verschmolzen), PDE-TOP
// (MCS Pie Data, 2007: 987) ab 2013 nicht mehr (geprüft im Bericht Stand 31.12.2014, der auch Systeme mit 8 Installationen führt).
const NULL_VOR = { tomedo: 2013, medatixx: 2014, T2med: 2015 }
const NULL_AB = { easymed: 2023, 'PDE-TOP': 2013 }

const NAMEN = {
  'CGM MEDISTAR (BLACK PRO)': 'CGM MEDISTAR', TURBOMED: 'CGM TURBOMED', ALBIS: 'CGM ALBIS', 'CGM M1 PRO (ehem. CompuMED M1)': 'CGM M1 PRO',
  'DATA VITAL': 'CGM DATA VITAL', 'x.isynet (ehem. MCS-ISYNET)': 'x.isynet', 'x.concept (ehem. DOCconcept)': 'x.concept',
  'x.comfort (ehem. DOCcomfort)': 'x.comfort', 'EL - Elaphe Longissima': 'EL', 'ETERNO Cloud (ehem. inSuite)': 'ETERNO Cloud',
  'SAP Ambulatory Care Management': 'SAP', 'CGM MEDICO (ehem. MEDICO WIPS)': 'CGM MEDICO', IMedOne: 'iMedOne',
}
const kurz = (s) => NAMEN[s] ?? s

/**
 * Baut eine lückenlose Tabelle Jahr × System für die ärztlichen Systeme (Klasse „arzt“; Psychotherapie- und
 * Krankenhaussysteme bleiben draußen, recherche Abschnitt 6). Aufgenommen ist, wer im Zeitraum an einem Jahresende
 * mindestens einmal `mindestens` Installationen hatte. Jede Zelle ohne Jahresendbeleg ist gerechnet und landet mit
 * Methode in `gerechnet`.
 *
 * `unterjaehrigNutzen`: Belege aus Q1–Q3 als Stützpunkte (für Jahre ohne Jahresendwert). Für den ersten Datensatz aus,
 * damit seine veröffentlichten Werte gleich bleiben.
 */
function baue({ von, bis, mindestens = 500, unterjaehrigNutzen = false, systeme: auswahl = null }) {
  const JAHRE = jahre(von, bis)
  const gerechnet = []
  // `auswahl`: feste Systemliste in dieser Reihenfolge, unabhängig von Klasse und Mindestgröße (z. B. Psychotherapie).
  const systeme = auswahl ?? [...new Set(INST.filter((r) => r.klasse === 'arzt').map((r) => r.system))]
    .filter((s) => INST.some((r) => r.system === s && r.stichtag.endsWith('-12-31') && Number(r.stichtag.slice(0, 4)) >= von && Number(r.installationen) >= mindestens))
  const reihe = (system) => {
    const b = belegt(system)
    for (const j of JAHRE) {
      if (NULL_VOR[kurz(system)] && j < NULL_VOR[kurz(system)] && b[j] == null) b[j] = 0
      if (NULL_AB[kurz(system)] && j >= NULL_AB[kurz(system)] && b[j] == null) b[j] = 0
    }
    const annahmen = unterjaehrigNutzen ? ANNAHME.filter((x) => x.system === system && b[x.jahr] == null && x.jahr >= von) : []
    for (const x of annahmen) {
      b[x.jahr] = x.wert
      gerechnet.push({ jahr: x.jahr, system: kurz(system), wert: x.wert, methode: 'KBV-Anbieterwert 31.12.2011 übernommen (Annahme: Anbieter hatte nur dieses System)' })
    }
    const punkte = { ...b, ...(unterjaehrigNutzen ? unterjaehrig(system) : {}) }
    for (const a of ANTEIL.filter((r) => r.system === system)) punkte[zeitpunkt(a.stichtag)] = Number(a.anteil_prozent) / 100 * summeBei(zeitpunkt(a.stichtag))
    const belegJahre = Object.keys(punkte).map(Number).sort((x, y) => x - y)
    return JAHRE.map((j) => {
      if (b[j] != null) return b[j]
      const v = Math.round(stuetze(punkte, j) ?? 0)
      const vor = belegJahre.filter((x) => x < j).at(-1), nach = belegJahre.find((x) => x > j)
      const mitAnteil = ANTEIL.some((r) => r.system === system)
      const methode = j > 2016 && j < 2021 && vor >= 2016 && nach <= 2021
        ? (mitAnteil ? 'linear zwischen Q4/2016, Q3/2017 (KBV-Anteil × Summe), Q3/2020 (KBV-Anteil × Summe) und Q4/2021' : 'linear zwischen Q4/2016 und Q4/2021 (KBV hat keinen Anteil veröffentlicht)')
        : vor == null ? `erster Beleg (${nach}) gehalten` : nach == null ? `letzter Beleg (${vor}) gehalten` : `linear zwischen den Belegen ${vor} und ${nach}`
      gerechnet.push({ jahr: j, system: kurz(system), wert: v, methode })
      return v
    })
  }
  const spalten = systeme.map((s) => [kurz(s), reihe(s), s])
  return {
    systeme, spalten, gerechnet,
    tabelle: { headers: ['Jahr', ...spalten.map(([n]) => n)], rows: JAHRE.map((j, i) => [String(j), ...spalten.map(([, w]) => w[i])]) },
  }
}

// ---------- Datensatz 1: Systeme in Arztpraxen 2013–2025 ----------
// Ab 2013 gibt es wieder vollständige Listen aller Systeme; 2008–2012 fehlen sie fast ganz (recherche, Abschnitt 4).
const VON = 2013, BIS = 2025
const JAHRE = jahre(VON, BIS)
const D1 = baue({ von: VON, bis: BIS })
const PVS_ARZT = D1.tabelle
const ARZT = D1.systeme
const spalten = D1.spalten

// ---------- Datensatz 3: Systeme in Arztpraxen seit 2007 ----------
// Zweite Auswertung auf Wunsch des Nutzers (21.10.2026): derselbe Aufbau ab 2007, im Video mit 20 Zeilen. 2007 ist das
// erste Jahr mit vollständiger KBV-Liste; davor fehlen 2001–2004 und 2006 ganz (recherche, Nachtrag 2), darum ab 2007
// und nicht ab 2000 (Entscheidung des Nutzers). Stützen in den Lücken: Mitte 2009 (Top 20, Dissertation Kersting,
// Stichtag unsicher), 2010 (Top 5), Mitte 2011 (Top 7), Ende 2011 (Anbieterwerte, siehe EIN_PRODUKT).
const D3 = baue({ von: 2007, bis: BIS, unterjaehrigNutzen: true })
const PVS_ARZT_2007 = D3.tabelle

// ---------- Datensatz 2: Hersteller ----------
// Eigentümer am Stichtag (Spalte hersteller der Rohdatei). Drei Linien: CGM, medatixx und die drei Herausforderer, die
// seit 2013 am stärksten gewachsen sind. Gezählt werden die Systeme aus Datensatz 1 (Klasse „arzt“, ab 2013 mindestens
// einmal 500 Installationen); Kleinstsysteme unter 500 Installationen fehlen.
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

// ---------- Datensatz 4: Psychotherapie-Software gegen MEDISTAR (Post 3) ----------
// Eine Aussage: Seit Ende 2023 ist das meistinstallierte System der KBV-Statistik keine Arztsoftware mehr. Vier Linien:
// das größte Arztsystem und die drei größten Systeme, deren Installationen zu 94–97 Prozent in der Arztgruppe
// Psychotherapeuten liegen (recherche Abschnitt 6). 2017–2020 wie in Datensatz 1 aus KBV-Anteilen gerechnet.
const D4 = baue({ von: 2013, bis: 2025, systeme: ['CGM MEDISTAR (BLACK PRO)', 'Elefant', 'psyprax', 'Epikur'] })
const PVS_PSYCHO = D4.tabelle

// ---------- Datensatz 5: Aufsteiger (Post 4) ----------
// Die vier Systeme außerhalb von CGM und medatixx, die seit 2013 am stärksten gewachsen sind.
const D5 = baue({ von: 2013, bis: 2025, systeme: ['Medical Office', 'tomedo', 'T2med', 'ETERNO Cloud (ehem. inSuite)'] })
const PVS_AUFSTEIGER = D5.tabelle

// ---------- Datensatz 6: Krankenhaussysteme in der ambulanten Abrechnung (Post 9) ----------
// Klasse „kis“ (recherche Abschnitt 7): Klinikambulanzen und Klinik-MVZ rechnen ambulant mit dem KIS ab.
const D6 = baue({ von: 2013, bis: 2025, systeme: ['ORBIS', 'SAP Ambulatory Care Management', 'CGM MEDICO (ehem. MEDICO WIPS)', 'IMedOne'] })
const PVS_KIS = D6.tabelle

// ---------- Datensatz 7: Gewinner und Verlierer seit Ende 2021 (Post 5) ----------
// Veränderung der Installationen gegenüber Ende 2021, je Jahresende 2021–2025 – nur belegte Jahresendwerte, die
// Differenz ist die einzige Rechnung. Je die zwei größten Gewinner und Verlierer 2021–2025 (über alle Systeme).
// Es sind Salden, keine Wechselströme: Wer von wem zu wem wechselt, sagt die KBV nicht.
const SALDO_SYSTEME = ['medatixx', 'tomedo', 'CGM MEDISTAR (BLACK PRO)', 'TURBOMED']
const q4 = (s, j) => Number(INST.find((r) => r.system === s && r.stichtag === `${j}-12-31`)?.installationen)
const PVS_SALDO = {
  headers: ['Jahr', ...SALDO_SYSTEME.map(kurz)],
  rows: [2021, 2022, 2023, 2024, 2025].map((j) => [String(j), ...SALDO_SYSTEME.map((s) => q4(s, j) - q4(s, 2021))]),
}
{
  // Auswahl gegen die Daten prüfen: Es müssen wirklich die zwei größten Gewinner und Verlierer sein.
  const alle = [...new Set(INST.filter((r) => r.stichtag === '2025-12-31' && r.system !== '__SUMME__').map((r) => r.system))]
    .map((s) => [s, q4(s, 2025) - q4(s, 2021)]).filter(([, d]) => Number.isFinite(d)).sort((x, y) => y[1] - x[1])
  const erwartet = [alle[0][0], alle[1][0], alle.at(-2)[0], alle.at(-1)[0]].sort().join('|')
  if (erwartet !== [...SALDO_SYSTEME].sort().join('|')) throw new Error(`pvs-saldo: größte Gewinner/Verlierer sind jetzt ${erwartet}`)
  for (const row of PVS_SALDO.rows) for (const v of row.slice(1)) if (!Number.isFinite(v)) throw new Error('pvs-saldo: fehlender Jahresendwert')
}

// ---------- TI-Nutzung und PraxisBarometer (Posts 6, 7) ----------
// Quellen und Definitionen: recherche/schnittstellen.md. In der Rohdatei stehen nur belegte Werte.
const TI = csv('ti-nutzung.csv')
const istMonatsende = (iso) => { const [j, m, t] = iso.split('-').map(Number); return t === new Date(Date.UTC(j, m, 0)).getUTCDate() }
// eArztbriefe je Monat: Differenz zweier Monatsendstände des kumulierten Zählers der gematik (gerechnet). Die gematik
// meldet den Stand um 0 Uhr UTC des Stichtags; ein „Monat“ reicht deshalb vom Vortag des Monatsletzten bis zum Vortag
// des nächsten – ein Tag Versatz, für Monatssummen unerheblich, in der Dateninfo genannt.
const kum = TI.filter((r) => r.reihe === 'kim_earztbriefe_kumuliert' && istMonatsende(r.stichtag)).sort((x, y) => x.stichtag.localeCompare(y.stichtag))
const EARZTBRIEF_MONAT = {
  headers: ['Monat', 'eArztbriefe über KIM'],
  rows: kum.slice(1).map((r, i) => [r.stichtag.slice(0, 7), Number(r.wert) - Number(kum[i].wert)]),
}
for (let i = 1; i < kum.length; i++) {
  const [vj, vm] = kum[i - 1].stichtag.split('-').map(Number), [j, m] = kum[i].stichtag.split('-').map(Number)
  if ((j - vj) * 12 + m - vm !== 1) throw new Error(`ti-nutzung: Monatsende fehlt zwischen ${kum[i - 1].stichtag} und ${kum[i].stichtag}`)
}
// PraxisBarometer Digitalisierung (KBV/IGES): Anteil der Arztpraxen, die Labordaten digital empfangen bzw. senden.
// Ab 2024 lautet die Antwort „Labordaten (inkl. Labordatenaufträgen und -ergebnissen)“ – Formulierungsbruch.
const pb = (reihe) => Object.fromEntries(TI.filter((r) => r.reihe === reihe).map((r) => [r.stichtag.slice(0, 4), Number(r.wert)]))
const empfang = pb('pb_labordaten_digital_empfang_arztpraxen'), versand = pb('pb_labordaten_digital_versand_arztpraxen')
const LABORDATEN_PB = {
  headers: ['Jahr', 'Labordaten digital empfangen', 'Labordaten digital gesendet'],
  rows: Object.keys(empfang).sort().map((j) => [j, empfang[j], versand[j]]),
}

// ---------- MVZ und Praxisformen (Post 8) ----------
// Quellen und Definitionen: recherche/mvz.md. MVZ-Statistik (KBV) und Bundesarztregister weichen bei Personen bis
// 2 Prozent ab – deshalb zwei getrennte Datensätze, nie in einer Grafik gemischt.
const MV = csv('mvz.csv')
const mv = (j, r) => { const x = MV.find((z) => z.stichtag === `${j}-12-31` && z.reihe === r); return x ? Number(x.wert) : null }
// Ärztinnen und Ärzte nach Praxisform, ohne psychologische Psychotherapeutinnen und -therapeuten (Bundesarztregister).
// 2016–2025: Personen der Praxisform minus Psychotherapeuten der Praxisform (KBV-Datenportal, gerechnet).
// 2015: Summe der ärztlichen Spalten aus Tabelle 5 der Registerstatistik (gerechnet; Methode an 2025 geprüft).
const t5 = (j, teil) => MV.filter((z) => z.stichtag === `${j}-12-31` && z.reihe.startsWith(`bar_t5_aerztlich_${teil}_`)).reduce((x, z) => x + Number(z.wert), 0)
const PRAXISFORMEN = [['Einzelpraxis', 'einzelpraxis', 'ep'], ['Berufsausübungsgemeinschaft', 'bag', 'bag'], ['MVZ und andere Einrichtungen', 'mvz_einrichtung', 'einrichtung']]
const AERZTE_PRAXISFORM = {
  headers: ['Jahr', ...PRAXISFORMEN.map(([n]) => n)],
  rows: Array.from({ length: 11 }, (_, i) => 2015 + i).map((j) => [String(j), ...PRAXISFORMEN.map(([, portal, tab]) => {
    const p = mv(j, `bar_personen_${portal}`), q = mv(j, `bar_psych_psychotherapeuten_${portal}`)
    return p != null && q != null ? p - q : t5(j, tab)
  })]),
}
{
  // Gegenprobe: Wo beide Wege möglich sind (2025), müssen sie übereinstimmen; Tabelle der Recherche 2015/2025.
  const r25 = AERZTE_PRAXISFORM.rows.at(-1).slice(1), t25 = PRAXISFORMEN.map(([, , tab]) => t5(2025, tab))
  if (r25.join() !== t25.join()) throw new Error(`aerzte-praxisform 2025: Portal ${r25} ≠ Tabelle 5 ${t25}`)
  if (AERZTE_PRAXISFORM.rows[0].slice(1).join() !== '69860,51679,13826') throw new Error(`aerzte-praxisform 2015: ${AERZTE_PRAXISFORM.rows[0]}`)
  for (const r of AERZTE_PRAXISFORM.rows) if (r.slice(1).some((v) => !(v > 0))) throw new Error(`aerzte-praxisform: Wert fehlt ${r}`)
}
// MVZ gesamt und mit Krankenhaus als Träger, 2004–2025 (KBV-MVZ-Statistik, alle Jahre belegt).
const MVZ_ANZAHL = {
  headers: ['Jahr', 'MVZ gesamt', 'davon Krankenhaus als Träger'],
  rows: Array.from({ length: 22 }, (_, i) => 2004 + i).map((j) => [String(j), mv(j, 'mvz_anzahl'), mv(j, 'mvz_krankenhaus_mvz')]),
}
for (const r of MVZ_ANZAHL.rows) if (r.slice(1).some((v) => v == null)) throw new Error(`mvz-anzahl: Wert fehlt ${r}`)

// ---------- Labormedizin (Post 11) ----------
// Bundesarztregister, Fachgruppe Laboratoriumsmedizin einschließlich Mikrobiologie, 2013–2025 (recherche/labor.md).
// Alle Werte belegt, nichts gerechnet. BÄK-Ärztestatistik nur als Zweitquelle im Text (Bruch 2021/2022).
const LAB = csv('labor.csv')
const lab = (j, r) => { const x = LAB.find((z) => z.stichtag === `${j}-12-31` && z.reihe === r); return x ? Number(x.wert) : null }
const LABOR_AERZTE = {
  headers: ['Jahr', 'Angestellt in MVZ und Einrichtungen', 'Mit eigener Zulassung'],
  rows: Array.from({ length: 13 }, (_, i) => 2013 + i).map((j) => [String(j), lab(j, 'bar_labor_angestellt_einrichtungen'), lab(j, 'bar_labor_zulassung')]),
}
for (const r of LABOR_AERZTE.rows) if (r.slice(1).some((v) => v == null)) throw new Error(`labor-aerzte: Wert fehlt ${r}`)

// ---------- Allgemeinmediziner (Post 12) ----------
// KBV-Berichte je Arztgruppe, Fachgruppe Allgemeinmediziner (Top 20), Quartale aus archivierten Berichten
// (recherche/pvs-arztgruppen.md). Jahresenden 2020, 2021, 2024, 2025 belegt; Q4/2022 und Q4/2023 fehlen und werden linear
// zwischen den nächsten belegten Quartalen gerechnet (Q1/2022–Q1/2023 bzw. Q3/2023–Q4/2024), markiert in pvs-gerechnet.json.
const AM = csv('pvs-kbv-allgemeinmediziner.csv')
// Die neun größten Systeme Ende 2025 außer kleinen Regionalsystemen; Namen wie in pvs-installationen (Herstellerfarben).
const AM_SYSTEME = [['462', 'medatixx'], ['280', 'CGM MEDISTAR'], ['112', 'CGM TURBOMED'], ['498', 'T2med'], ['210', 'Medical Office'], ['216', 'x.isynet'], ['243', 'x.concept'], ['203', 'CGM ALBIS'], ['244', 'QUINCY WIN'], ['457', 'tomedo']]
const amGerechnet = []
const tag = (st) => Date.parse(st) / 864e5
const amWert = (id, st) => { const r = AM.find((x) => x.kbv_id === id && x.stichtag === st); return r ? Number(r.installationen) : null }
const amJahr = (id, name, j) => {
  const st = `${j}-12-31`, belegt = amWert(id, st)
  if (belegt != null) return belegt
  const stuetzen = AM.filter((x) => x.kbv_id === id).map((x) => x.stichtag).sort()
  const vor = stuetzen.filter((s) => s < st).at(-1), nach = stuetzen.find((s) => s > st)
  if (!vor || !nach) throw new Error(`pvs-allgemeinmediziner: ${name} ${j} ohne Stützstellen`)
  const v = Math.round(amWert(id, vor) + (amWert(id, nach) - amWert(id, vor)) * (tag(st) - tag(vor)) / (tag(nach) - tag(vor)))
  amGerechnet.push({ jahr: j, system: name, wert: v, methode: `linear zwischen ${vor} (${amWert(id, vor)}) und ${nach} (${amWert(id, nach)}), KBV-Bericht Arztgruppe Allgemeinmediziner` })
  return v
}
const PVS_ALLGEMEIN = {
  headers: ['Jahr', ...AM_SYSTEME.map(([, n]) => n)],
  rows: Array.from({ length: 6 }, (_, i) => 2020 + i).map((j) => [String(j), ...AM_SYSTEME.map(([id, n]) => amJahr(id, n, j))]),
}

// ---------- Download zur Säulenseite (Praxisverwaltungssysteme in Deutschland) ----------
// Liegt in public/tabellen/, nicht in public/daten/: Das leert build-artikel.mjs bei jedem Build.
// Alle erfassten Systeme mit Installationen Q4/2025 und Q3/2025 und den KBV-Zulassungen (Stand des Verzeichnisses).
// Belegte Werte, nichts gerechnet. Epikur und SMARTY wie auf der Seite als „gemischt“.
{
  const EINSATZ = { arzt: 'Arztpraxis', psychotherapie: 'Psychotherapie', kis: 'Krankenhaus', unklar: 'Sonstige' }
  const ZUL = csv('pvs-zulassungen.csv'), zStand = ZUL.map((z) => z.stand).sort().at(-1)
  const q = (st, n) => INST.find((r) => r.stichtag === st && r.system === n)
  const zeilen = INST.filter((r) => r.stichtag === '2025-12-31' && r.system !== '__SUMME__')
    .sort((x, y) => Number(y.installationen) - Number(x.installationen))
    .map((r) => {
      const z = ZUL.find((x) => x.stand === zStand && x.system === r.system) ?? {}
      const einsatz = ['Epikur', 'SMARTY'].includes(r.system) ? 'gemischt' : EINSATZ[r.klasse] ?? r.klasse
      return [r.system, r.hersteller.replace(/\s*\(.*\)$/, ''), einsatz, r.installationen, q('2025-09-30', r.system)?.installationen ?? '', z.ldt_befund ?? '', z.earztbrief ?? '', z.kim_1click ?? '']
    })
  const feld = (v) => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v)
  fs.mkdirSync('sites/humanmedizin/public/tabellen', { recursive: true })
  fs.writeFileSync('sites/humanmedizin/public/tabellen/pvs-systeme-2025.csv',
    [['system', 'hersteller', 'einsatz', 'installationen_2025_12_31', 'installationen_2025_09_30', `zulassung_ldt_befund_import_${zStand}`, `zulassung_earztbrief_${zStand}`, `zulassung_1click_kim_${zStand}`], ...zeilen].map((r) => r.map(feld).join(',')).join('\n') + '\n')
}

// ---------- Ausgabe ----------
const emit = (name, w) => `export const ${name} = {\n  headers: ${JSON.stringify(w.headers)},\n  rows: [\n${w.rows.map((r) => '    [' + r.map(lit).join(', ') + '],').join('\n')}\n  ],\n}\n`
fs.writeFileSync('sites/humanmedizin/samples/data.ts', `// Automatisch erzeugt von sites/humanmedizin/scripts/build-samples.mjs aus sites/humanmedizin/data/raw/ – nicht von Hand editieren.\n/* eslint-disable */\n` +
  [emit('PVS_ARZT', PVS_ARZT), emit('PVS_HERSTELLER', PVS_HERSTELLER), emit('PVS_ARZT_2007', PVS_ARZT_2007), emit('PVS_PSYCHO', PVS_PSYCHO), emit('PVS_AUFSTEIGER', PVS_AUFSTEIGER), emit('PVS_KIS', PVS_KIS), emit('PVS_SALDO', PVS_SALDO), emit('EARZTBRIEF_MONAT', EARZTBRIEF_MONAT), emit('AERZTE_PRAXISFORM', AERZTE_PRAXISFORM), emit('MVZ_ANZAHL', MVZ_ANZAHL), emit('LABOR_AERZTE', LABOR_AERZTE), emit('LABORDATEN_PB', LABORDATEN_PB), emit('PVS_ALLGEMEIN', PVS_ALLGEMEIN)].join('\n'))
const sortiert = (l) => [...l].sort((a, b) => a.system.localeCompare(b.system) || a.jahr - b.jahr)
fs.writeFileSync(path.join(RAW, 'pvs-gerechnet.json'), JSON.stringify({
  hinweis: 'Von sites/humanmedizin/scripts/build-samples.mjs erzeugt. Jeder Wert der Datensätze, der nicht direkt aus einem KBV-Bericht (Jahresende) stammt, mit Methode. pvs-hersteller ist die Summe von pvs-installationen und hat dieselben gerechneten Werte. Alles andere ist belegt (pvs-kbv-installationen.csv, pvs-kbv-luecken-1998-2012.csv).',
  summe_2017_2020: 'Gesamtzahl aller Installationen linear zwischen Q4/2016 (' + SUMME[2016] + ') und Q4/2021 (' + SUMME[2021] + ')',
  'pvs-installationen': sortiert(D1.gerechnet),
  'pvs-installationen-2007': sortiert(D3.gerechnet),
  'pvs-psychotherapie': sortiert(D4.gerechnet),
  'pvs-aufsteiger': sortiert(D5.gerechnet),
  'pvs-kis': sortiert(D6.gerechnet),
  'pvs-allgemeinmediziner': sortiert(amGerechnet),
}, null, 1) + '\n')
console.log('PVS_ARZT', PVS_ARZT.headers.length - 1, 'Systeme,', D1.gerechnet.length, 'gerechnet; PVS_ARZT_2007', PVS_ARZT_2007.headers.length - 1, 'Systeme,', PVS_ARZT_2007.rows.length, 'Jahre,', D3.gerechnet.length, 'von', (PVS_ARZT_2007.headers.length - 1) * PVS_ARZT_2007.rows.length, 'gerechnet bzw. angenommen')
