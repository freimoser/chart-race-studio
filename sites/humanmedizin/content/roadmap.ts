/**
 * Redaktionsplan von „Humanmedizin in Zahlen“: Posts in Visiten zu je 30, die aufeinander aufbauen.
 * Form und Regeln wie bei der Schwesterseite (src/content/redaktion.ts, sites/tiermedizin/docs/REDAKTION.md).
 *
 * Zielgruppe sind die Dienstleister der ambulanten Versorgung (PVS-Hersteller, Labore, MVZ-Betreiber,
 * Abrechnung, Telematik, Healthtech), nicht Patienten. Jeder Post beantwortet eine Frage, die sich diese
 * Leser stellen: Wer nutzt welches System, wer wächst, wie vernetzt ist der Markt.
 *
 * Zahlen stehen erst hier, wenn sie in sites/humanmedizin/data/raw/ belegt sind. Bis dahin sagt `dataStatus` offen,
 * was fehlt. `linkedInUrl` wird nach Veröffentlichung eingetragen.
 */
import type { RoadmapArc, RoadmapPost, Visite } from '../../../src/content/redaktion.ts'
export type { DataStatus, PostStatus, RoadmapArc, RoadmapPost, Visite } from '../../../src/content/redaktion.ts'
export { POSTS_JE_VISITE, visiteVon } from '../../../src/content/redaktion.ts'

export const VISITEN: Visite[] = [
  { nr: 1, titel: 'Wer die Praxis-IT in Deutschland liefert', leitfrage: 'Welche Software steuert die ambulante Versorgung, wer stellt sie her, und wie gut sprechen die Systeme miteinander?', status: 'laeuft' },
  { nr: 2, titel: 'In Vorbereitung', leitfrage: 'Die Themen werden gerade gesammelt.', status: 'in-vorbereitung' },
]

export const ARCS: RoadmapArc[] = [
  { id: 'software', label: 'Die Praxissoftware', claim: 'Über hundert Systeme sind zugelassen, eine Handvoll teilt sich den Markt.' },
  { id: 'hersteller', label: 'Die Hersteller', claim: 'Wer die Systeme besitzt, ist eine andere Frage als welches System führt.' },
  { id: 'vernetzung', label: 'Die Schnittstellen', claim: 'Zugelassen heißt nicht vernetzt: was die Systeme nachweislich austauschen können.' },
  { id: 'versorgung', label: 'Die Praxen', claim: 'Wer die Praxen betreibt, verändert, welche Software sie brauchen.' },
]

export const POSTS: RoadmapPost[] = [
  {
    nr: 1, arc: 'software', status: 'naechster',
    title: 'Welche Praxissoftware Arztpraxen nutzen',
    hook: 'Über hundert Praxisverwaltungssysteme haben eine KBV-Zulassung. Wie sich die Installationen über die Jahre verschoben haben, zeigt die Installationsstatistik der KBV.',
    figures: ['Installationen je System laut KBV, ärztliche Praxen ohne Psychotherapie-Systeme', 'Gewinner und Verlierer der letzten Jahre', 'Summe aller Installationen Q4/2025: 116.954 (126 Zeilen, selbst summiert)'],
    sampleId: 'pvs-installationen', chart: 'bar', dataStatus: 'teilweise',
    dataNote: 'Zeitreihe der KBV-Installationsstatistik wird recherchiert (Archiv der Quartals-PDFs). KBV-Hinweis „kein genaues Abbild des Marktes“ in den Post. Psychotherapie-Systeme (Elefant, psyprax, PsychoDat) und KIS-Zeilen getrennt zeigen, sonst führen sie die Liste.',
  },
  {
    nr: 2, arc: 'hersteller', status: 'geplant',
    title: 'CGM verliert, die Herausforderer holen auf',
    hook: 'Nicht die Produkte, die Hersteller zählen: 2013 lief jede zweite Installation einer Arztsoftware auf einem CGM-System, 2025 knapp jede dritte. Medical Office, tomedo und T2med kommen zusammen von 1 auf 21 Prozent.',
    figures: ['CGM (MEDISTAR, TURBOMED, ALBIS, M1 PRO, DATA VITAL): 40.206 (2013) → 22.070 (2025), 50,2 → 32,4 Prozent der ärztlichen Systeme', 'medatixx (x.isynet, x.concept, x.comfort, medatixx, easymed, ab 2022 EL): 21.896 → 19.159, 27,3 → 28,1 Prozent', 'Medical Office, tomedo, T2med zusammen: 1.122 → 14.308, 1,4 → 21,0 Prozent', 'Übernahmen: medatixx 2007 aus DOCexpert und MCS, CGM kaufte MEDISTAR 2002/03 und TurboMed 12/2003'],
    sampleId: 'pvs-hersteller', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Datensatz pvs-hersteller steht. EL kommt 2022 durch die Übernahme von Softland zu medatixx – im Post als Sprung erklären. 2017–2020 gerechnet wie im Datensatz pvs-installationen.',
    refs: [1],
  },
  {
    nr: 3, arc: 'software', status: 'geplant',
    title: 'Psychotherapie hat ihre eigene Software',
    hook: 'Das meistinstallierte System der KBV-Statistik ist seit Ende 2023 keine Arztsoftware: Elefant überholt MEDISTAR (11.026 zu 10.966). Der Grund ist eine Arztgruppe, die sich seit 2007 fast verdreifacht hat.',
    figures: ['Arztgruppe Psychotherapeuten: 10,6 Prozent aller Installationen (2007), rund 30 Prozent (2025)', 'Elefant 10.967, psyprax 10.519, Epikur 6.008, SMARTY 4.982, PsychoDat 1.705 (Ende 2025)', 'Elefant, psyprax, PsychoDat, Epikur, SMARTY: 84 bis 98 Prozent ihrer Installationen in dieser Arztgruppe', 'Ärztliche Abrechnungsstellen seit 2014 rund 13.000 weniger, psychotherapeutische rund 11.000 mehr'],
    sampleId: 'pvs-psychotherapie', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Datensatz pvs-psychotherapie steht (22.10.2026): MEDISTAR gegen Elefant, psyprax, Epikur 2013–2025, 16 Werte 2017–2020 gerechnet. Größe der Arztgruppe Psychotherapeuten nur als Text (2007 und 2013–2016 belegt, 2021–2025 als Mindestwert aus den Top 20).',
    refs: [1],
  },
  {
    nr: 4, arc: 'software', status: 'geplant',
    title: 'Die Aufsteiger: Mac, Linux und Cloud',
    hook: 'tomedo und T2med gab es 2013 noch nicht. Ende 2025 haben sie zusammen 8.608 Installationen, und sie wachsen jedes Quartal, während die großen Windows-Systeme verlieren.',
    figures: ['tomedo: 7 (2013) → 4.530 (2025); 2025 Quartal für Quartal 3.628, 3.883, 4.219, 4.530', 'T2med: 0 (Markteintritt 2015) → 4.078', 'ETERNO Cloud (Browser): 1 (2014) → 778', 'Medical Office: 1.115 → 5.700, seit 2021 nur noch leicht steigend'],
    sampleId: 'pvs-aufsteiger', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Datensatz pvs-aufsteiger steht (22.10.2026), Jahresende 2013–2025, 17 Werte gerechnet. Quartalswerte 2021–2025 sind belegt und können eine feinere Fassung tragen. Medical-Office-Sprung 2017 offen nennen.',
    refs: [1, 2],
  },
  {
    nr: 5, arc: 'software', status: 'geplant',
    title: 'Wer seit 2021 Praxen gewinnt und wer verliert',
    hook: 'Zwischen Ende 2021 und Ende 2025 gewannen 14 Systeme zusammen 13.667 Installationen, 25 verloren 15.139 (Systeme mit mindestens einmal 500 Installationen). Die Gesamtzahl sinkt nur um 2.451 – darunter wird kräftig gewechselt.',
    figures: ['Größte Zugewinne 2021–2025: medatixx +3.654, tomedo +2.872, T2med +2.595, Epikur +1.527', 'Größte Verluste: TURBOMED −3.385, MEDISTAR −2.375, x.isynet −1.541, x.concept −1.360, ALBIS −1.146', 'Gesamtzahl aller Installationen: 119.405 → 116.954', 'medatixx-intern: Gewinne des neuen medatixx entsprechen etwa den Verlusten von x.isynet, x.concept und x.comfort'],
    sampleId: 'pvs-saldo', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Datensatz pvs-saldo steht (22.10.2026). Nettoveränderungen, keine Wechselströme: Die KBV sagt nicht, wer von wem zu wem wechselt. Im Post deutlich sagen. Datensatz pvs-saldo (Pflegeprotokoll A8). § 371 SGB V (Archivierungs- und Wechselschnittstelle) als Kontext.',
    refs: [1, 4],
  },
  {
    nr: 6, arc: 'vernetzung', status: 'geplant',
    title: 'Laborbefunde kommen digital, Aufträge nicht',
    hook: 'Systeme mit Zulassung für den LDT-3-Befund-Import tragen 95,8 Prozent der Installationen ärztlicher Systeme. Den digitalen Laborauftrag hat kein einziges ärztliches Praxissystem bei der KBV zertifiziert.',
    figures: ['LDT-Befund-Import zugelassen: 22 von 28 ärztlichen Systemen, 95,8 Prozent der Installationen (KBV, Stand 21.10.2026)', 'LDT-Auftrag-Export: kein ärztliches Praxissystem, nur Epikur und Laborsysteme', 'PraxisBarometer 2025: 80 Prozent der Arztpraxen empfangen Labordaten digital, 39 Prozent senden (2018: 69 und 15)', 'Ab 2024 geänderte Antwortformulierung (inkl. Aufträgen) – Sprung beim Senden teils Methodik'],
    sampleId: 'labordaten-praxisbarometer', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Recherche fertig: recherche/schnittstellen.md, data/raw/pvs-zulassungen.csv, ti-nutzung.csv. Basis der Anteile: die 28 ärztlichen Systeme mit mindestens 500 Installationen (Recherche nennt 96,2 Prozent über alle 51 Systeme). Wie viele Praxen tatsächlich LDT 3 statt LDT 2 nutzen, ist nicht belegt – nicht behaupten.',
    refs: [1],
  },
  {
    nr: 7, arc: 'vernetzung', status: 'geplant',
    title: 'Der eArztbrief ist Alltag geworden',
    hook: 'Im März 2022 gingen 150.450 eArztbriefe über KIM, im September 2026 waren es 4,3 Millionen im Monat. Zugelassen sind fast alle Systeme; genutzt wird er in Arztpraxen viel häufiger als in der Psychotherapie.',
    figures: ['eArztbriefe über KIM: 14,4 Mio. (2023), 32,3 Mio. (2024), 45,2 Mio. (2025), 41,4 Mio. Januar bis September 2026 (gematik)', 'Höchster Monat bisher: März 2026 mit 5,2 Mio.', 'PraxisBarometer 2025: 82 Prozent der Arztpraxen mit TI nutzen den eArztbrief über KIM, 22 Prozent der Psychotherapiepraxen', 'Zulassung eArztbrief: Systeme mit 88,9 Prozent der Installationen; 1-Click-KIM 100 Prozent (Pflicht seit Abschaltung von KV-Connect am 20.10.2025)'],
    sampleId: 'earztbrief-monat', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Monatswerte als Differenz des kumulierten gematik-Zählers gerechnet (markieren). Medical Office steht derzeit nicht im eArztbrief-Verzeichnis (seit 02/2026) – „derzeit nicht im Verzeichnis“ schreiben, Zulassungen fallen bei Rezertifizierung zeitweise weg. Keine Nutzungszahlen je System verfügbar.',
    refs: [6],
  },
  {
    nr: 8, arc: 'versorgung', status: 'geplant',
    title: 'Das MVZ wächst, die ärztliche Einzelpraxis schrumpft',
    hook: '2004 gab es 70 Medizinische Versorgungszentren, 2025 sind es 5.305. Jedes zweite gehört einem Krankenhaus, und fast alle, die dort arbeiten, sind angestellt. Für die Software heißt das: mehrere Standorte, eine Datenbank, angestellte statt selbstständige Nutzer.',
    figures: ['MVZ: 70 (2004) → 2.156 (2015) → 5.305 (2025), davon mit Krankenhaus als Träger 2.659 (50,1 Prozent)', 'In MVZ tätig Ende 2025: 32.062 angestellte Ärztinnen und Ärzte, 1.788 Vertragsärzte (94,7 Prozent angestellt)', 'Ärztinnen und Ärzte in MVZ und anderen Einrichtungen (ohne Psychotherapeuten, Bundesarztregister): 13.826 (2015) → 32.885 (2025), 10,2 → 22,4 Prozent', 'Ärztliche Einzelpraxen: 62.524 (2015) → 50.701 (2025, aus der Registerstatistik summiert), minus 18,9 Prozent'],
    sampleId: 'aerzte-praxisform', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Datensätze aerzte-praxisform (Leitgrafik, 2015–2025) und mvz-anzahl (2004–2025, im Artikel per ::grafik) stehen seit 22.10.2026. Recherche: recherche/mvz.md, data/raw/mvz.csv (MVZ-Statistik 2004–2025 lückenlos, Bundesarztregister 2015/2016–2025). Falle: Mit psychotherapeutischen Einzelpraxen (plus 48 Prozent) schrumpfen die Einzelpraxen nur um 2,7 Prozent – im Titel „ärztliche Einzelpraxis“. MVZ-Statistik und Bundesarztregister weichen bis 2 Prozent ab, nicht in einer Grafik mischen. Träger nicht als Linien zeigen (Mehrfachträgerschaft). Datensätze: Ärzte nach Praxisform 2015–2025 (Leitgrafik), MVZ gesamt und Krankenhaus-MVZ 2004–2025.',
    refs: [5],
  },
  {
    nr: 9, arc: 'versorgung', status: 'geplant',
    title: 'Krankenhaus-Software in der ambulanten Versorgung',
    hook: 'ORBIS, SAP, CGM MEDICO und iMedOne stehen in der KBV-Liste der Praxissysteme: 7.948 Installationen Ende 2025, 6,8 Prozent aller. So rechnen Klinikambulanzen und Klinik-MVZ ab.',
    figures: ['Krankenhaussysteme zusammen: 7.302 (2013) → 7.948 (2025), Anteil 6,2 → 6,8 Prozent', 'ORBIS 4.073, SAP 1.543, CGM MEDICO 1.363, iMedOne 969 (Ende 2025)', 'Anbieter von ORBIS: Agfa HealthCare bis 2016, Dedalus ab 2021'],
    sampleId: 'pvs-kis', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Datensatz pvs-kis steht (22.10.2026), die Linien sind fast flach – als Line Race schwach. Stärkere Aussage für den Post: Die Zahl der Krankenhaus-MVZ hat sich seit 2015 fast verdreifacht (910 → 2.659, KBV-MVZ-Statistik), die KIS-Installationen wachsen kaum (7.302 → 7.948 seit 2013). Geprüft 22.10.2026: nur als Obergrenze haltbar (406 von 1.749, unter der Annahme gleichbleibender übriger Klinikambulanzen), keine Zählung je MVZ vorhanden. Stärkerer belegter Aufhänger: SAP IS-H (dazu gehört SAP Ambulatory Care Management, 1.543 Installationen) endet spätestens 2030 – recherche/pvs-kbv-historie.md Abschnitt 7.',
    refs: [1, 8],
  },
  {
    nr: 10, arc: 'versorgung', status: 'geplant',
    title: 'Wer zählt die Praxissoftware?',
    hook: 'Für Arztpraxen zählt die KBV jedes Praxissystem, weil jedes eine Prüfnummer braucht: Zwei Hersteller halten 60,5 Prozent der Installationen ärztlicher Systeme. Für die rund 10.000 Tierarztpraxen gibt es keine Statistik, nur Werbeangaben der Hersteller.',
    figures: ['Humanmedizin Ende 2025 (KBV): größte drei Systeme 32,3 Prozent, größte fünf 49,6 Prozent der Installationen ärztlicher Systeme', 'Nach Herstellern: CGM 32,4, medatixx 28,1, INDAMED 8,4, Zollsoft 6,6, T2med 6,0 Prozent', 'Tiermedizin: nur Herstellerangaben in verschiedenen Einheiten, Gebieten und Jahren (z. B. Praxen in Europa oder DACH) – keine Anteile rechenbar'],
    dataStatus: 'teilweise',
    dataNote: 'Recherche 22.10.2026: Post als Vergleich der Konzentration nicht tragfähig, darum gedreht zu „Wer zählt?“. Bildpost mit KBV-Herstelleranteilen; Tiermedizin ausdrücklich ohne Balken, nur ein Kasten „keine Statistik“. Vor Veröffentlichung Interessenkonflikte prüfen (Recherche-Notiz liegt lokal, nicht im öffentlichen Repo). Gemeinsamer Bezug zur Schwesterseite nach docs/VERLINKUNG.md. Artikelentwurf 22.10.2026 (pvs-statistik-kbv-methode) bewusst ohne Tiermedizin-Vergleich, solange die Offenlegung des Petleo-Bezugs nicht entschieden ist; stattdessen KBV gegen Herstellerangaben und Umfragen (medatixx, Zi, DPtV).',
    refs: [1, 2],
  },
  {
    nr: 11, arc: 'vernetzung', status: 'geplant',
    title: 'Das Labor ist ein Angestelltenfach geworden',
    hook: 'Ende 2025 sind 88,5 Prozent der Laborärztinnen und -ärzte in der Kassenversorgung angestellt, 2013 waren es 68,0 Prozent. Mit eigener Zulassung arbeiten noch 99. Für alle, die Schnittstellen bauen: Die Gegenseite der Praxissoftware ist ein Labor-MVZ, keine Einzelpraxis.',
    figures: ['Laborärzte im Bundesarztregister: 1.166 (2013) → 1.386 (2025), davon angestellt in MVZ und Einrichtungen 793 → 1.226', 'Mit eigener Zulassung: 288 → 99; Vertragsärzte in Einzelpraxen 92 → 35', 'Zweitquelle BÄK (FA Laboratoriumsmedizin): niedergelassen 337 → 113, angestellt 329 → 725 (Bruch 2021/2022 beachten)', 'Seit 2025 Pauschale für ein System zur digitalen Auftragserteilung (GOP 40092): im 1. Quartal 2025 bei 80,5 Prozent der Fälle mit Transportpauschale – misst Bereitstellung, nicht digitale Aufträge aus der Praxissoftware'],
    sampleId: 'labor-aerzte', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Recherche fertig: recherche/labor.md, data/raw/labor.csv. Keine Quelle für die Zahl der Laborpraxen oder Labor-MVZ; Konzentration nur über Sonic (Umsatz DE 2011–2026) und SYNLAB 2022/2023, Limbach/amedes ohne Stichtag. FleXChange-Bezug (Labor-Order-Entry) nur als offener Hinweis.',
    refs: [6],
  },
  {
    nr: 12, arc: 'software', status: 'geplant',
    title: 'Welche Praxissoftware Allgemeinmediziner nutzen',
    hook: 'Bei den Allgemeinmedizinern führt nicht CGM MEDISTAR, sondern medatixx: 1.892 Installationen Ende 2025, knapp vor MEDISTAR (1.857) und TURBOMED (1.850). T2med steht hier auf Platz 4 (1.737). In jeder Fachgruppe sieht die Spitze anders aus – bei Augenärzten führt FIDUS, bei Radiologen medavis RIS.',
    figures: ['Allgemeinmediziner Q4/2025 (KBV, Top 20 je Fachgruppe): medatixx 1.892, CGM MEDISTAR 1.857, TURBOMED 1.850, T2med 1.737, Medical Office 1.548', 'Top 20 der Fachgruppe zusammen 18.909 Installationen (Mindestwert der Gruppe)', 'Spitzenreiter je Fachgruppe: Frauenärzte und Orthopäden MEDISTAR, Augenärzte FIDUS, Chirurgen ORBIS, Radiologen medavis RIS, Psychotherapeuten Elefant'],
    dataStatus: 'teilweise',
    dataNote: 'Rohdaten data/raw/pvs-kbv-arztgruppen.csv (Q4 und Q3/2025, alle 23 Fachgruppen, je Top 20), Recherche recherche/pvs-arztgruppen.md, Suchnachfrage docs/KEYWORD-RECHERCHE.md („praxissoftware hausarzt vergleich“). Falle: „Allgemeinmediziner“ ist die KBV-Arztgruppe, nicht „Hausärzte“ – hausärztliche Internisten stehen bei den Internisten, Praktiker getrennt; im Titel die Arztgruppe nennen. Nur Top 20 je Gruppe, Summe ist Mindestwert. Für eine Zeitreihe die archivierten Berichte je Arztgruppe (Q4/2021–Q4/2024) erheben; bis dahin Balken für einen Stichtag. Keine Bewertung, keine Kaufempfehlung.',
    refs: [1, 2, 4],
  },
]
