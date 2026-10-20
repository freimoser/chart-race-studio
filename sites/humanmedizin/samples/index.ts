import type { SampleDataset } from '../../../src/lib/data/types.ts'
import { PVS_ARZT, PVS_HERSTELLER } from './data.ts'

/**
 * Beispiel-Datensätze von „Humanmedizin in Zahlen“, alle mit recherchierten Zahlen.
 * Erzeugt aus sites/humanmedizin/data/raw/ über sites/humanmedizin/scripts/build-samples.mjs (data.ts).
 * Quellen, Lücken und Methodenbrüche: sites/humanmedizin/docs/DATASETS.md und recherche/pvs-kbv-historie.md.
 */

// Farben nach Hersteller: CGM in Blautönen, medatixx in Grüntönen, die Herausforderer warm, alle anderen grau.
// So zeigt das Bar Race nebenbei, wem die Systeme gehören (Eigentümer 2025).
const CGM = { 'CGM MEDISTAR': '#14213d', 'CGM TURBOMED': '#2b3f6b', 'CGM ALBIS': '#43598f', 'CGM M1 PRO': '#5f75a8', 'CGM DATA VITAL': '#8193bf' }
const MEDATIXX = { 'x.isynet': '#1f7a6e', 'x.concept': '#2a9d8f', 'x.comfort': '#5cb8ab', medatixx: '#13584f', EL: '#8fd0c6', easymed: '#b5e0d9' }
const NEUE = { 'Medical Office': '#e36414', tomedo: '#f08a3e', T2med: '#c2410c', 'ETERNO Cloud': '#f4a261' }
const GRAU = '#9aa3b2'
const farben = Object.fromEntries(PVS_ARZT.headers.slice(1).map((n) => [n, { ...CGM, ...MEDATIXX, ...NEUE }[n] ?? GRAU]))

export const SAMPLES: SampleDataset[] = [
  {
    id: 'pvs-installationen',
    erstellt: '2026-10-20', geprueft: '2026-10-20',
    category: 'software',
    title: 'Praxissoftware in Arztpraxen',
    subtitle: 'Installationen je Praxisverwaltungssystem laut KBV, Jahresende, ohne Psychotherapie- und Klinik-Systeme',
    source: 'Quelle: KBV, Installationsstatistik Systeme (Q4/2013–Q4/2016, Q4/2021–Q4/2025); 2017–2020 aus KBV-Anteilen gerechnet',
    sourceUrl: 'https://www.kbv.de/infothek/zahlen-und-fakten/pvs-installationsstatistiken',
    unit: 'Installationen',
    description: 'CGM MEDISTAR führt seit Jahren, aber mit immer weniger Installationen. Medical Office, tomedo, T2med und das neue medatixx holen auf.',
    dataInfo: [
      'Gezählt werden Installationen: Abrechnungen eines Quartals mit der Prüfnummer eines Systems, praktisch abrechnende Praxen oder Betriebsstätten. Nicht Ärztinnen und Ärzte, nicht Lizenzen. Die KBV schreibt selbst, die Statistik sei kein genaues Abbild des tatsächlichen Marktes.',
      'Nur Systeme für ärztliche Praxen. Psychotherapie-Systeme (Elefant, psyprax, PsychoDat, Epikur, SMARTY, RED Medical; jeweils 84 bis 98 Prozent ihrer Installationen in der Arztgruppe Psychotherapeuten) und Krankenhaussysteme (ORBIS, SAP, CGM MEDICO, iMedOne) sind herausgenommen, sonst führten sie die Liste. Aufgenommen ist jedes ärztliche System mit mindestens einmal 500 Installationen seit 2013. Auch bei den ärztlichen Systemen liegt ein kleiner Teil der Installationen in der Psychotherapie, bei tomedo 12 und bei medatixx 11 Prozent.',
      'Gerechnet: Für 2017 bis 2020 hat die KBV keine Installationszahlen veröffentlicht, nur Anteile mit einer Nachkommastelle (Q3/2017, Q3/2020). Installationen = Anteil × Gesamtzahl, die Gesamtzahl linear zwischen Ende 2016 und Ende 2021; die Jahresenden 2017 bis 2020 liegen linear zwischen diesen Stützpunkten. Systeme ohne veröffentlichten Anteil sind linear zwischen 2016 und 2021 gerechnet. Jeder gerechnete Wert steht mit Methode in data/raw/pvs-gerechnet.json, zusammen 109 Werte.',
      'Medical Office springt laut KBV-Anteil von 1.832 Installationen Ende 2016 auf rund 3.000 im Herbst 2017. Ob das echt ist, ist offen: Für 2021 hat die KBV Medical Office nachweislich doppelt gezählt und später korrigiert. 0 vor dem Markteintritt ist belegt (medatixx seit 2014, T2med seit 2015), easymed steht ab 2023 nicht mehr in der Liste.',
      'Namen wie heute: CGM MEDISTAR hieß bis 2023 MEDISTAR, x.isynet früher MCS-ISYNET, ETERNO Cloud bis 2025 inSuite. Farben nach Hersteller: CGM blau, medatixx grün, Medical Office, tomedo, T2med und ETERNO orange, andere grau.',
    ],
    headers: PVS_ARZT.headers,
    rows: PVS_ARZT.rows,
    suggested: { chartType: 'bar', topN: 12, decimals: 0, colors: farben, labelsPosition: 'outside' },
  },
  {
    id: 'pvs-hersteller',
    erstellt: '2026-10-20', geprueft: '2026-10-20',
    category: 'software',
    title: 'CGM, medatixx und die Herausforderer',
    subtitle: 'Installationen der Praxissysteme je Hersteller laut KBV, Jahresende, nur ärztliche Systeme',
    source: 'Quelle: KBV, Installationsstatistik Systeme; Summen je Hersteller und 2017–2020 gerechnet',
    sourceUrl: 'https://www.kbv.de/infothek/zahlen-und-fakten/pvs-installationsstatistiken',
    unit: 'Installationen',
    description: 'CGM verliert seit 2013 fast die Hälfte seiner Installationen, medatixx ein Achtel, Medical Office, tomedo und T2med wachsen auf das Zwölffache.',
    dataInfo: [
      'Summen der Systeme aus dem Datensatz „Praxissoftware in Arztpraxen“, je Hersteller nach dem Eigentümer am Stichtag. CompuGroup Medical: MEDISTAR, TURBOMED, ALBIS, M1 PRO, DATA VITAL. medatixx: x.isynet, x.concept, x.comfort, medatixx, easymed und ab 2022 EL (Softland im April 2022 übernommen, daher der Sprung). Herausforderer: Medical Office (INDAMED), tomedo (Zollsoft), T2med.',
      'Gezählt werden Installationen, nicht Praxen oder Ärzte (siehe Dateninfo des Systemdatensatzes). Kleinstsysteme unter 500 Installationen fehlen, bei CGM etwa DAVID mit 44 Installationen 2025.',
      'Gerechnet: 2017 bis 2020 aus KBV-Anteilen bzw. linear (wie im Systemdatensatz). Wechsel zwischen Produkten desselben Herstellers, etwa von x.isynet zu medatixx, verschieben nichts zwischen den Linien; sie sind Migration, kein Wettbewerb.',
    ],
    headers: PVS_HERSTELLER.headers,
    rows: PVS_HERSTELLER.rows,
    suggested: {
      chartType: 'line', topN: 3, decimals: 0, primaryAxisLabel: 'Installationen',
      colors: { 'CompuGroup Medical (alle Arztsysteme)': '#14213d', 'medatixx (alle Systeme)': '#2a9d8f', 'Medical Office, tomedo und T2med': '#e36414' },
    },
  },
]
