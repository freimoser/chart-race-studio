import type { SampleDataset } from '../../../src/lib/data/types.ts'
import { PVS_ARZT, PVS_ARZT_2007, PVS_HERSTELLER } from './data.ts'

/**
 * Beispiel-Datensätze von „Humanmedizin in Zahlen“, alle mit recherchierten Zahlen.
 * Erzeugt aus sites/humanmedizin/data/raw/ über sites/humanmedizin/scripts/build-samples.mjs (data.ts).
 * Quellen, Lücken und Methodenbrüche: sites/humanmedizin/docs/DATASETS.md und recherche/pvs-kbv-historie.md.
 */

// Farben nach Gruppe, eine klare Farbe je Gruppe statt Abstufungen (Wunsch Nutzer 21.10.2026, vorher kaum
// unterscheidbare Blau- und Grüntöne): CompuGroup Medical blau, medatixx grün, die drei Aufsteiger orange, alle übrigen
// grau. Zuordnung nach Eigentümer 2025. Geprüft mit dem Palettenvalidator (Farbsehschwächen, Kontrast; das Grün braucht
// sichtbare Beschriftung, die Balken tragen Name und Wert). Die Legende steht im Video unter dem Untertitel.
const BLAU = '#2a78d6', GRUEN = '#1baf7a', ORANGE = '#eb6834', GRAU = '#a7adb8'
const GRUPPE: Record<string, string> = {
  'CGM MEDISTAR': BLAU, 'CGM TURBOMED': BLAU, 'CGM ALBIS': BLAU, 'CGM M1 PRO': BLAU, 'CGM DATA VITAL': BLAU, 'CGM DAVID': BLAU,
  'x.isynet': GRUEN, 'x.concept': GRUEN, 'x.comfort': GRUEN, medatixx: GRUEN, EL: GRUEN, easymed: GRUEN, 'PDE-TOP': GRUEN,
  'Medical Office': ORANGE, tomedo: ORANGE, T2med: ORANGE,
}
const LEGENDE = [
  { label: 'CompuGroup Medical', color: BLAU },
  { label: 'medatixx', color: GRUEN },
  { label: 'Medical Office, tomedo, T2med', color: ORANGE },
  { label: 'übrige', color: GRAU },
]
const farbenFuer = (headers: string[]) => Object.fromEntries(headers.slice(1).map((n) => [n, GRUPPE[n] ?? GRAU]))
const farben = farbenFuer(PVS_ARZT.headers)

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
      'Gerechnet: Für 2017 bis 2020 hat die KBV keine Installationszahlen veröffentlicht, nur Anteile mit einer Nachkommastelle (Q3/2017, Q3/2020). Installationen = Anteil × Gesamtzahl, die Gesamtzahl linear zwischen Ende 2016 und Ende 2021; die Jahresenden 2017 bis 2020 liegen linear zwischen diesen Stützpunkten. Systeme ohne veröffentlichten Anteil sind linear zwischen 2016 und 2021 gerechnet. Jeder gerechnete Wert steht mit Methode in data/raw/pvs-gerechnet.json, zusammen 113 Werte.',
      'Medical Office springt laut KBV-Anteil von 1.832 Installationen Ende 2016 auf rund 3.000 im Herbst 2017. Ob das echt ist, ist offen: Für 2021 hat die KBV Medical Office nachweislich doppelt gezählt und später korrigiert. 0 vor dem Markteintritt ist belegt (medatixx seit 2014, T2med seit 2015), easymed steht ab 2023 nicht mehr in der Liste.',
      'Namen wie heute: CGM MEDISTAR hieß bis 2023 MEDISTAR, x.isynet früher MCS-ISYNET, ETERNO Cloud bis 2025 inSuite. Farben nach Hersteller (Eigentümer 2025): CompuGroup Medical blau, medatixx grün, die Aufsteiger Medical Office, tomedo und T2med orange, alle übrigen grau; die Legende steht unter dem Untertitel.',
    ],
    headers: PVS_ARZT.headers,
    rows: PVS_ARZT.rows,
    suggested: { chartType: 'bar', topN: 12, decimals: 0, colors: farben, legende: LEGENDE, labelsPosition: 'outside' },
  },
  {
    id: 'pvs-installationen-2007',
    erstellt: '2026-10-21', geprueft: '2026-10-21',
    category: 'software',
    title: 'Praxissoftware in Arztpraxen seit 2007',
    subtitle: 'Installationen laut KBV, Jahresende, ohne Psychotherapie- und Klinik-Systeme; 2008–2012 und 2017–2020 gerechnet',
    source: 'Quelle: KBV, Installationsstatistik Systeme (Q4/2007, Q4/2013–Q4/2016, Q4/2021–Q4/2025); Zwischenjahre aus Teilbelegen gerechnet',
    sourceUrl: 'https://www.kbv.de/infothek/zahlen-und-fakten/pvs-installationsstatistiken',
    unit: 'Installationen',
    description: 'Die lange Fassung ab 2007, mit 20 Zeilen: CGM MEDISTAR vorn, TURBOMED und ALBIS verlieren, alte Systeme verschwinden, neue kommen.',
    dataInfo: [
      'Dieselbe Abgrenzung wie im Datensatz „Praxissoftware in Arztpraxen“ (ab 2013): Installationen ärztlicher Systeme laut KBV, ohne Psychotherapie- und Krankenhaussysteme, jedes System mit mindestens einmal 500 Installationen seit 2007, 30 Systeme. 2007 ist das erste Jahr mit vollständiger KBV-Liste; für 2001 bis 2004 und 2006 ist keine Liste je System erhalten, darum beginnt die Reihe nicht früher.',
      'Belegt sind die Jahresenden 2007, 2013 bis 2016 und 2021 bis 2025. Dazwischen gibt es Teilbelege: Mitte 2009 die 20 größten Systeme (Dissertation Kersting, MHH, die KBV-Zahlen zitiert; Stichtag nicht ganz sicher), Ende 2010 die fünf größten und Mitte 2011 die sieben größten (Ärzte Zeitung nach KBV), Ende 2011 die KBV-Werte je Anbieter. Für acht Anbieter, die damals nur ein nennenswertes System hatten (MEDISTAR, TurboMed, DURIA, S3-Win, Med7, EL, Data-AL, easymed), ist der Anbieterwert Ende 2011 als Systemwert übernommen – eine Annahme.',
      'Gerechnet: Die Jahresenden 2008 bis 2012 liegen linear zwischen den Belegen davor und danach, 2017 bis 2020 wie im kurzen Datensatz aus den KBV-Anteilen. Zusammen 249 von 570 Werten gerechnet oder angenommen; von den 20 jeweils sichtbaren Balken sind es 176 von 380 (46 Prozent), fast alle in den Jahren ohne eigene KBV-Liste. Jeder Wert mit Methode in data/raw/pvs-gerechnet.json.',
      'Ausscheiden und Eintritt: PDE-TOP (MCS Pie Data) steht ab 2013 nicht mehr in der vollständigen KBV-Liste, easymed ab 2023; beide haben dort 0. tomedo, medatixx und T2med haben vor ihrem belegten Markteintritt 0. Für DATA VITAL und ETERNO Cloud ist der erste Beleg (2013 bzw. 2014) nach vorn gehalten.',
      'Wie es vor 2007 aussah, zeigen belegte Momentaufnahmen im Artikel (1997, Mitte 2000, 2005). Sie sind nicht animiert, weil dazwischen Jahre ohne jede Systemliste liegen und die KBV 1999 bis 2001 DOS- und Windows-Versionen getrennt zählte.',
    ],
    headers: PVS_ARZT_2007.headers,
    rows: PVS_ARZT_2007.rows,
    suggested: { chartType: 'bar', topN: 20, decimals: 0, colors: farbenFuer(PVS_ARZT_2007.headers), legende: LEGENDE, labelsPosition: 'outside', animationSec: 40 },
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
      colors: { 'CompuGroup Medical (alle Arztsysteme)': BLAU, 'medatixx (alle Systeme)': GRUEN, 'Medical Office, tomedo und T2med': ORANGE },
    },
  },
]
