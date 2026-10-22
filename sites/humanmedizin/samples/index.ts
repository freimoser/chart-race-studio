import type { SampleDataset } from '../../../src/lib/data/types.ts'
import { EARZTBRIEF_MONAT, LABORDATEN_PB, PVS_ARZT, PVS_ARZT_2007, PVS_AUFSTEIGER, PVS_HERSTELLER, PVS_KIS, PVS_PSYCHO } from './data.ts'

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
  'CGM MEDISTAR': BLAU, 'CGM TURBOMED': BLAU, 'CGM ALBIS': BLAU, 'CGM M1 PRO': BLAU, 'CGM DATA VITAL': BLAU,
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
    id: 'pvs-psychotherapie',
    erstellt: '2026-10-22', geprueft: '2026-10-22',
    category: 'software',
    title: 'Psychotherapie-Software überholt MEDISTAR',
    subtitle: 'Installationen laut KBV, Jahresende: das größte Arztsystem gegen die drei größten Systeme der Psychotherapie',
    source: 'Quelle: KBV, Installationsstatistik Systeme (Q4/2013–Q4/2016, Q4/2021–Q4/2025); 2017–2020 aus KBV-Anteilen gerechnet',
    sourceUrl: 'https://www.kbv.de/infothek/zahlen-und-fakten/pvs-installationsstatistiken',
    unit: 'Installationen',
    description: 'Seit Ende 2023 ist das meistinstallierte System der KBV-Statistik keine Arztsoftware: Elefant überholt CGM MEDISTAR, 2024 auch psyprax.',
    dataInfo: [
      'Gezählt werden Installationen laut KBV-Installationsstatistik, also Abrechnungen eines Quartals mit der Prüfnummer eines Systems, nicht Praxen oder Personen. Eine psychotherapeutische Einzelpraxis zählt wie ein großes MVZ; Systeme mit vielen Einzelpraxen erscheinen dadurch groß.',
      'Elefant, psyprax und Epikur laufen zu 97, 96 und 94 Prozent in der KBV-Arztgruppe Psychotherapeuten (Ende 2025, KBV-Bericht je Arztgruppe). CGM MEDISTAR ist das größte System für ärztliche Praxen. Die Arztgruppe Psychotherapeuten wuchs von 10,6 Prozent aller Installationen (2007) auf rund 30 Prozent (2025).',
      'Gerechnet: Für 2017 bis 2020 hat die KBV nur Anteile veröffentlicht (Q3/2017, Q3/2020). Installationen = Anteil × Gesamtzahl, die Gesamtzahl linear zwischen Ende 2016 und Ende 2021, die Jahresenden linear zwischen diesen Stützpunkten. 16 von 52 Werten gerechnet, jeder mit Methode in data/raw/pvs-gerechnet.json.',
      'Nicht im Bild: SMARTY (4.982) und PsychoDat (1.705, Ende 2025), um bei vier Linien zu bleiben. Wer die Psychotherapie-Systeme herausnimmt, sieht den Markt der Arztpraxen im Datensatz „Praxissoftware in Arztpraxen“.',
    ],
    headers: PVS_PSYCHO.headers,
    rows: PVS_PSYCHO.rows,
    suggested: {
      chartType: 'line', topN: 4, decimals: 0, primaryAxisLabel: 'Installationen',
      // Validiert (alle Paare, hell): CGM blau wie in allen PVS-Grafiken, die drei Psychotherapie-Systeme pink, gelb, grün.
      colors: { 'CGM MEDISTAR': BLAU, Elefant: '#e87ba4', psyprax: '#eda100', Epikur: '#008300' },
    },
  },
  {
    id: 'earztbrief-monat',
    erstellt: '2026-10-22', geprueft: '2026-10-22',
    category: 'vernetzung',
    title: 'eArztbriefe über KIM je Monat',
    subtitle: 'Mit KIM gesendete elektronische Arztbriefe in Deutschland, je Monat, März 2022 bis September 2026',
    source: 'Quelle: gematik, TI-Dashboard (kumulierter Zähler seit 01.08.2021); Monatswerte als Differenz gerechnet',
    sourceUrl: 'https://ti-lage.prod.ccs.gematik.solutions/d/_v5YC1HVk/ti-dashboard-verlauf-kim',
    unit: 'eArztbriefe',
    description: 'Der eArztbrief ist Alltag geworden: von 150.000 im März 2022 auf gut 4 Millionen im Monat, 45,2 Millionen im Jahr 2025.',
    dataInfo: [
      'Gezählt werden eArztbriefe, die über KIM (Kommunikation im Medizinwesen) der Telematikinfrastruktur gesendet wurden, laut TI-Dashboard der gematik. Nicht enthalten sind Arztbriefe per Fax, Post oder anderen Diensten. Die Zahl sagt nichts darüber, wie viele Praxen senden.',
      'Gerechnet: Die gematik veröffentlicht einen Zähler seit 01.08.2021 (Stand jeweils 0 Uhr UTC). Jeder Monatswert ist die Differenz zweier Monatsendstände; ein Monat reicht dadurch vom Vortag des Monatsletzten bis zum Vortag des nächsten Monatsletzten. Die Jahressummen (2023: 14,4 Mio., 2024: 32,3 Mio., 2025: 45,2 Mio.) sind identisch mit den Differenzen der Jahresendstände.',
      'Zweitquelle: Laut PraxisBarometer Digitalisierung 2025 (KBV/IGES) nutzen 82 Prozent der Arztpraxen mit TI-Anschluss den eArztbrief über KIM, aber nur 22 Prozent der psychotherapeutischen Praxen. Die Zulassung dafür haben Systeme mit 88,9 Prozent der Installationen ärztlicher Systeme (KBV-Verzeichnis, Stand 21.10.2026).',
    ],
    headers: EARZTBRIEF_MONAT.headers,
    rows: EARZTBRIEF_MONAT.rows,
    suggested: { chartType: 'line', topN: 1, decimals: 0, primaryAxisLabel: 'eArztbriefe je Monat', dateFormat: 'MMM YYYY', colors: { 'eArztbriefe über KIM': BLAU } },
  },
  {
    id: 'labordaten-praxisbarometer',
    erstellt: '2026-10-22', geprueft: '2026-10-22',
    category: 'vernetzung',
    title: 'Labordaten: empfangen ja, senden kaum',
    subtitle: 'Anteil der Arztpraxen, die Labordaten überwiegend digital empfangen bzw. senden, 2018 bis 2025',
    source: 'Quelle: PraxisBarometer Digitalisierung (KBV/IGES), Befragung von Arztpraxen ohne Psychotherapie; ab 2024 geänderte Antwortformulierung',
    sourceUrl: 'https://www.kbv.de/infothek/zahlen-und-fakten/praxisbarometer-digitalisierung',
    unit: 'Prozent der Arztpraxen',
    description: 'Vier von fünf Arztpraxen empfangen Labordaten digital, aber nur zwei von fünf senden welche – Befunde kommen digital, Aufträge nicht.',
    dataInfo: [
      'Gezählt wird der Anteil befragter Arztpraxen (ohne psychotherapeutische Praxen), die angeben, Labordaten überwiegend digital zu empfangen bzw. zu senden. Es ist eine jährliche Befragung, keine Vollerhebung.',
      'Methodenbruch: Ab 2024 lautet die Antwortmöglichkeit „Labordaten (inklusive Labordatenaufträgen und -ergebnissen)“. Der Anstieg beim Senden von 20 (2023) auf 30 und 39 Prozent ist deshalb teilweise ein Effekt der neuen Formulierung. Kein Wert ist gerechnet.',
      'Gegenprobe Zulassungen (KBV-Verzeichnis, Stand 21.10.2026): Systeme mit Zulassung für den LDT-Befund-Import tragen 95,8 Prozent der Installationen ärztlicher Systeme; den LDT-Auftrag-Export hat kein ärztliches Praxissystem zertifiziert.',
    ],
    headers: LABORDATEN_PB.headers,
    rows: LABORDATEN_PB.rows,
    suggested: { chartType: 'line', topN: 2, decimals: 0, suffix: ' %', primaryAxisLabel: 'Prozent der Arztpraxen', colors: { 'Labordaten digital empfangen': BLAU, 'Labordaten digital gesendet': ORANGE } },
  },
  {
    id: 'pvs-aufsteiger',
    erstellt: '2026-10-22', geprueft: '2026-10-22',
    category: 'software',
    title: 'Die Aufsteiger unter den Praxissystemen',
    subtitle: 'Installationen laut KBV, Jahresende: die vier Systeme außerhalb von CGM und medatixx, die seit 2013 am stärksten gewachsen sind',
    source: 'Quelle: KBV, Installationsstatistik Systeme (Q4/2013–Q4/2016, Q4/2021–Q4/2025); 2017–2020 aus KBV-Anteilen gerechnet',
    sourceUrl: 'https://www.kbv.de/infothek/zahlen-und-fakten/pvs-installationsstatistiken',
    unit: 'Installationen',
    description: 'tomedo und T2med gab es 2013 noch nicht, Ende 2025 haben sie zusammen 8.608 Installationen; Medical Office wächst seit 2021 nur noch leicht.',
    dataInfo: [
      'Gezählt werden Installationen laut KBV-Installationsstatistik (Abrechnungen mit der Prüfnummer eines Systems), nicht Praxen. tomedo (Zollsoft) läuft auf dem Mac, T2med auf Windows, macOS und Linux, ETERNO Cloud (Doc Cirrus, bis 2025 inSuite) im Browser, Medical Office (INDAMED) unter Windows.',
      'Markteintritt belegt: tomedo KBV-Zulassung Mitte 2013 (7 Installationen Ende 2013), T2med Markteinführung 2015 (0 davor). Für ETERNO Cloud ist der erste Beleg (1 Installation Ende 2014) für 2013 gehalten.',
      'Gerechnet: 2017 bis 2020 aus KBV-Anteilen (Q3/2017, Q3/2020) bzw. linear; 17 von 52 Werten, mit Methode in data/raw/pvs-gerechnet.json. Auffällig: Medical Office springt laut KBV-Anteil von 1.832 Ende 2016 auf rund 3.000 im Herbst 2017; für 2021 hat die KBV Medical Office nachweislich doppelt gezählt und korrigiert, ob 2017 bis 2020 betroffen sind, ist offen.',
    ],
    headers: PVS_AUFSTEIGER.headers,
    rows: PVS_AUFSTEIGER.rows,
    // Validiert (alle Paare, hell). Bewusst kein CGM-Blau und kein medatixx-Grün in derselben Bedeutung: eigene Farbe je System.
    suggested: { chartType: 'line', topN: 4, decimals: 0, primaryAxisLabel: 'Installationen', colors: { 'Medical Office': '#6250d6', tomedo: '#e87ba4', T2med: '#eda100', 'ETERNO Cloud': '#008300' } },
  },
  {
    id: 'pvs-kis',
    erstellt: '2026-10-22', geprueft: '2026-10-22',
    category: 'versorgung',
    title: 'Krankenhaus-Software in der ambulanten Abrechnung',
    subtitle: 'Installationen von Krankenhausinformationssystemen in der KBV-Statistik, Jahresende',
    source: 'Quelle: KBV, Installationsstatistik Systeme (Q4/2013–Q4/2016, Q4/2021–Q4/2025); 2017–2020 aus KBV-Anteilen bzw. linear gerechnet',
    sourceUrl: 'https://www.kbv.de/infothek/zahlen-und-fakten/pvs-installationsstatistiken',
    unit: 'Installationen',
    description: 'Klinikambulanzen und Klinik-MVZ rechnen ambulant mit dem Krankenhaussystem ab: zusammen 7.948 Installationen Ende 2025, knapp 9 Prozent mehr als 2013.',
    dataInfo: [
      'Gezählt werden Installationen von Krankenhausinformationssystemen in der KBV-Installationsstatistik: ambulante Abrechnungen von Ermächtigungs- und Hochschulambulanzen, Klinik-MVZ und Ähnlichem. Es sind keine Systeme für Arztpraxen.',
      'Anbieter: ORBIS bis 2016 Agfa HealthCare, ab 2021 Dedalus HealthCare; SAP Ambulatory Care Management (SAP); CGM MEDICO (früher MEDICO WIPS: Siemens, dann Cerner, heute CGM Clinical); iMedOne (Deutsche Telekom Clinical Solutions).',
      'Gerechnet: 2017 bis 2020; ORBIS aus KBV-Anteilen (Q3/2017, Q3/2020), die übrigen linear zwischen 2016 und 2021; 16 von 52 Werten, mit Methode in data/raw/pvs-gerechnet.json.',
    ],
    headers: PVS_KIS.headers,
    rows: PVS_KIS.rows,
    suggested: { chartType: 'line', topN: 4, decimals: 0, primaryAxisLabel: 'Installationen', colors: { 'CGM MEDICO': BLAU, ORBIS: '#e87ba4', SAP: '#eda100', iMedOne: '#008300' } },
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
      'Gezählt werden Installationen, nicht Praxen oder Ärzte (siehe Dateninfo des Systemdatensatzes). Kleinstsysteme unter 500 Installationen fehlen.',
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
