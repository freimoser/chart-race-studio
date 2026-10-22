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
    chart: 'line', dataStatus: 'teilweise',
    dataNote: 'Datensatz pvs-psychotherapie anlegen (Pflegeprotokoll A5): Systeme der Psychotherapie 2013–2025 aus pvs-kbv-installationen.csv, Größe der Arztgruppe aus recherche/pvs-kbv-historie.md Abschnitt 6 (2007, 2013–2016, 2021–2025 belegt, teils als Mindestwert aus den Top 20).',
    refs: [1],
  },
  {
    nr: 4, arc: 'software', status: 'geplant',
    title: 'Die Aufsteiger: Mac, Linux und Cloud',
    hook: 'tomedo und T2med gab es 2013 noch nicht. Ende 2025 haben sie zusammen 8.608 Installationen, und sie wachsen jedes Quartal, während die großen Windows-Systeme verlieren.',
    figures: ['tomedo: 7 (2013) → 4.530 (2025); 2025 Quartal für Quartal 3.628, 3.883, 4.219, 4.530', 'T2med: 0 (Markteintritt 2015) → 4.078', 'ETERNO Cloud (Browser): 1 (2014) → 778', 'Medical Office: 1.115 → 5.700, seit 2021 nur noch leicht steigend'],
    chart: 'line', dataStatus: 'teilweise',
    dataNote: 'Datensatz pvs-aufsteiger anlegen (Pflegeprotokoll A6), Quartalswerte 2021–2025 belegt.',
    refs: [1, 2],
  },
  {
    nr: 5, arc: 'software', status: 'geplant',
    title: 'Wer seit 2021 Praxen gewinnt und wer verliert',
    hook: 'Zwischen Ende 2021 und Ende 2025 kamen bei den Gewinnern 13.667 Installationen dazu, bei den Verlierern gingen 15.139 verloren. Die Summe sinkt kaum – darunter wird kräftig gewechselt.',
    figures: ['Größte Zugewinne 2021–2025: medatixx +3.654, tomedo +2.872, T2med +2.595, Epikur +1.527', 'Größte Verluste: TURBOMED −3.385, MEDISTAR −2.375, x.isynet −1.541, x.concept −1.360, ALBIS −1.146', 'Gesamtzahl aller Installationen: 119.405 → 116.954', 'medatixx-intern: Gewinne des neuen medatixx entsprechen etwa den Verlusten von x.isynet, x.concept und x.comfort'],
    dataStatus: 'belegt',
    dataNote: 'Nettoveränderungen, keine Wechselströme: Die KBV sagt nicht, wer von wem zu wem wechselt. Im Post deutlich sagen. Datensatz pvs-saldo (Pflegeprotokoll A8). § 371 SGB V (Archivierungs- und Wechselschnittstelle) als Kontext.',
    refs: [1, 4],
  },
  {
    nr: 6, arc: 'vernetzung', status: 'geplant',
    title: 'Wie viele Systeme Laborbefunde nach LDT 3 lesen',
    hook: 'Ein Praxissystem ohne zertifizierten LDT-3-Import bekommt Laborbefunde nicht strukturiert in die Akte. Wie viele Installationen laufen auf Systemen, die es nachweislich können?',
    figures: ['Systeme mit KBV-Zulassung LDT 3 Befund-Import bzw. Auftrag-Export', 'Anteil der Installationen Ende 2025 auf Systemen mit Zulassung', 'Systeme, die Labor bewerben, aber keine LDK-Zulassung haben'],
    dataStatus: 'teilweise',
    dataNote: 'Recherche läuft (Pflegeprotokoll A4): data/raw/pvs-zulassungen.csv. Stand 19.10.2026 für 30 Systeme aus der FleXChange-Recherche vorhanden.',
    refs: [1],
  },
  {
    nr: 7, arc: 'vernetzung', status: 'geplant',
    title: 'KIM und eArztbrief: zugelassen ist nicht genutzt',
    hook: 'Fast jedes große System hat die KBV-Zulassung für eArztbrief und KIM. Wie viele Nachrichten tatsächlich fließen, zeigt das TI-Dashboard der gematik.',
    figures: ['Zulassungen eArztbrief und 1-Click-KIM je System (KBV)', 'KIM-Nachrichten, eArztbriefe und E-Rezepte je Monat (gematik)', 'Anteil der Installationen mit eArztbrief-Zulassung'],
    dataStatus: 'offen',
    dataNote: 'Recherche läuft (Pflegeprotokoll A4): data/raw/ti-nutzung.csv. Definition „Nachricht“ der gematik genau übernehmen.',
    refs: [6],
  },
  {
    nr: 8, arc: 'versorgung', status: 'geplant',
    title: 'Das MVZ wächst, die Einzelpraxis schrumpft',
    hook: 'Medizinische Versorgungszentren beschäftigen jedes Jahr mehr Ärztinnen und Ärzte. Für die Software heißt das: mehrere Standorte, eine Datenbank, angestellte statt selbstständige Nutzer.',
    figures: ['Zahl der MVZ und dort tätige Ärzte (KBV)', 'MVZ nach Träger: Vertragsärzte, Krankenhäuser, sonstige', 'Angestellte Ärztinnen und Ärzte in der ambulanten Versorgung (Bundesarztregister)'],
    dataStatus: 'offen',
    dataNote: 'Recherche läuft (Pflegeprotokoll A3): data/raw/mvz.csv.',
    refs: [5],
  },
  {
    nr: 9, arc: 'versorgung', status: 'geplant',
    title: 'Krankenhaus-Software in der ambulanten Versorgung',
    hook: 'ORBIS, SAP, CGM MEDICO und iMedOne stehen in der KBV-Liste der Praxissysteme: 7.948 Installationen Ende 2025, 6,8 Prozent aller. So rechnen Klinikambulanzen und Klinik-MVZ ab.',
    figures: ['Krankenhaussysteme zusammen: 7.302 (2013) → 7.948 (2025), Anteil 6,2 → 6,8 Prozent', 'ORBIS 4.073, SAP 1.543, CGM MEDICO 1.363, iMedOne 969 (Ende 2025)', 'Anbieter von ORBIS: Agfa HealthCare bis 2016, Dedalus ab 2021'],
    chart: 'line', dataStatus: 'teilweise',
    dataNote: 'Datensatz pvs-kis anlegen (Pflegeprotokoll A7). Zweitquelle: Zahl der Klinik-MVZ aus der MVZ-Recherche (Post 8).',
    refs: [1, 8],
  },
  {
    nr: 10, arc: 'versorgung', status: 'geplant',
    title: 'Praxissoftware beim Arzt und beim Tierarzt',
    hook: 'Zwei Märkte, dieselbe Frage: Wie viele Anbieter teilen sich die Praxen? Für die Humanmedizin zählt die KBV, für die Tiermedizin gibt es keine amtliche Statistik.',
    figures: ['Humanmedizin Ende 2025: 126 Zeilen in der KBV-Statistik, die größten drei ärztlichen Systeme 32 Prozent der ärztlichen Installationen (22.043 von 68.191)', 'Tiermedizin: Quelle offen (Umfragen, Herstellerangaben)', 'Gemeinsamer Artikel mit tiermedizin-in-zahlen.org'],
    dataStatus: 'offen',
    dataNote: 'Recherche Tiermedizin-PVS (Pflegeprotokoll A9); Ordner „Website Tierarzt Solution Map“ (vetkompass) prüfen. Verlinkung nach docs/VERLINKUNG.md, erst wenn die Humanmedizin live ist.',
    refs: [1, 2],
  },
  {
    nr: 11, arc: 'vernetzung', status: 'geplant',
    title: 'Wer die Laborbefunde liefert',
    hook: 'Jeder Laborbefund läuft über eine Schnittstelle zwischen Labor und Praxissystem. Wie konzentriert ist die Labormedizin, und wie viele Befunde gehen digital?',
    figures: ['Zahl der Laborpraxen und Laborgruppen (Konzentration)', 'Laborleistungen in der vertragsärztlichen Versorgung (KBV, Volumen)', 'LDT-3-Zulassungen auf Laborseite'],
    dataStatus: 'offen',
    dataNote: 'Recherche Labor (Pflegeprotokoll A10). Zielgruppe Labore direkt ansprechen; FleXChange-Bezug (Labor-Order-Entry) nur als offener Hinweis.',
    refs: [6],
  },
]
