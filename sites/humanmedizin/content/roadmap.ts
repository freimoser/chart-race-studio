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
    title: 'Zwei Hersteller, gut ein Drittel aller Installationen',
    hook: 'Produkte führen in die Irre: CompuGroup Medical und medatixx verteilen sich auf je fünf, sechs Systeme. Zusammengerechnet sieht der Markt anders aus.',
    figures: ['CGM Q4/2025: 22.070 Installationen (MEDISTAR, TURBOMED, ALBIS, M1 PRO, DATA VITAL)', 'medatixx Q4/2025: 19.159 (medatixx, x.isynet, x.concept, x.comfort, EL)', 'Übernahmen mit Datum, aus denen die Gruppen entstanden'],
    sampleId: 'pvs-hersteller', chart: 'line', dataStatus: 'teilweise',
    dataNote: 'Herstellerzuordnung je Stichtag nach dem damaligen Eigentümer, nicht nach dem heutigen. Übernahmedaten belegen.',
    refs: [1],
  },
  {
    nr: 3, arc: 'software', status: 'geplant',
    title: 'Psychotherapie hat ihre eigene Software',
    hook: 'Das meistinstallierte System in der KBV-Statistik ist keine Arztsoftware. Elefant und psyprax laufen fast nur in psychotherapeutischen Praxen.',
    figures: ['Elefant Q4/2025: 10.967, psyprax: 10.519, PsychoDat: 1.705', 'Zusammen 23.191 Installationen, 19,8 Prozent aller Installationen in der KBV-Statistik', 'Epikur und SMARTY laufen in beiden Versorgungsbereichen und lassen sich nicht aufteilen'],
    sampleId: 'pvs-installationen', chart: 'bar', dataStatus: 'teilweise',
    dataNote: 'Zeitreihe aus dem KBV-Archiv wie bei Post 1. Zweitquelle für die Zahl psychotherapeutischer Praxen (KBV-Bundesarztregister) daneben legen.',
    refs: [1],
  },
  {
    nr: 4, arc: 'software', status: 'geplant',
    title: 'Die Aufsteiger: Mac, Linux und Cloud',
    hook: 'tomedo, T2med und ETERNO wachsen jedes Quartal, während die großen Windows-Systeme Installationen verlieren.',
    figures: ['tomedo Q3→Q4/2025: 4.219 → 4.530', 'T2med: 3.880 → 4.078', 'ETERNO Cloud: 704 → 778'],
    dataStatus: 'teilweise',
    dataNote: 'Längere Reihe aus dem KBV-Archiv nötig; ein Quartal ist kein Trend.',
    refs: [1, 2],
  },
  {
    nr: 5, arc: 'vernetzung', status: 'geplant',
    title: 'Wie viele Systeme Laborbefunde nach LDT 3 lesen',
    hook: 'Ein PVS ohne zertifizierten LDT-3-Import bekommt Laborbefunde nicht strukturiert in die Akte. Das KBV-Zulassungsverzeichnis zeigt, wer es kann.',
    figures: ['Systeme mit LDT-3-Zulassung (Befund-Import, Auftrag-Export) laut KBV-LDK-Verzeichnis', 'Anteil der Installationen, die damit abgedeckt sind', 'Systeme, die Labor bewerben, aber keine LDK-Zulassung haben (z. B. Med7, APRIS)'],
    dataStatus: 'teilweise',
    dataNote: 'Stand 19.10.2026 für 30 Systeme erhoben (FleXChange-Recherche); auf alle Systeme mit Installationen ausweiten.',
  },
  {
    nr: 6, arc: 'vernetzung', status: 'geplant',
    title: 'KIM und eArztbrief: wer angeschlossen ist',
    hook: 'Der elektronische Arztbrief ist seit Jahren Pflicht-Thema. Wie viele Systeme ihn zugelassen können und wie viele Praxen ihn tatsächlich versenden, sind zwei verschiedene Zahlen.',
    figures: ['Zulassungen eArztbrief und 1-Click-KIM je System (KBV)', 'Versendete KIM-Nachrichten (gematik TI-Dashboard)', 'Anteil der Installationen mit eArztbrief-Zulassung'],
    dataStatus: 'offen',
    dataNote: 'Zeitreihe der KIM-Nachrichten im TI-Dashboard der gematik prüfen (Archiv, Definition „Nachricht“); Zulassungen je System sind für 30 Systeme erhoben.',
    refs: [5],
  },
  {
    nr: 7, arc: 'versorgung', status: 'geplant',
    title: 'Das MVZ wächst, die Einzelpraxis schrumpft',
    hook: 'Medizinische Versorgungszentren beschäftigen jedes Jahr mehr Ärztinnen und Ärzte. Für die Software heißt das: Mehrere Standorte, eine Datenbank.',
    figures: ['MVZ und dort tätige Ärzte laut KBV-MVZ-Statistik', 'Anteil angestellter Ärzte in der ambulanten Versorgung (Bundesarztregister)', 'Träger der MVZ: Vertragsärzte, Krankenhäuser, sonstige'],
    dataStatus: 'offen',
    dataNote: 'KBV-MVZ-Statistik (jährlich) und Bundesarztregister recherchieren; Methodenbrüche bei der Trägerzählung prüfen.',
  },
  {
    nr: 8, arc: 'versorgung', status: 'geplant',
    title: 'Krankenhaus-Software in der ambulanten Versorgung',
    hook: 'ORBIS, SAP und iMedOne stehen in der KBV-Liste der Praxissysteme. Warum Krankenhaus-Systeme ambulant abrechnen und wie viele es sind.',
    figures: ['KIS-Installationen in der KBV-Statistik Q4/2025: ORBIS 4.073, SAP 1.543, CGM MEDICO 1.363, iMedOne 969', 'Zusammen 7.948, 6,8 Prozent aller Installationen', 'Ermächtigte Krankenhausärzte und Klinik-MVZ als Grund (KBV)'],
    dataStatus: 'teilweise',
    dataNote: 'Zeitreihe aus dem KBV-Archiv; Zahl der Klinik-MVZ als Zweitquelle (KBV-MVZ-Statistik, Träger Krankenhaus).',
    refs: [1, 7],
  },
  {
    nr: 9, arc: 'vernetzung', status: 'geplant',
    title: 'Der Wechsel des Praxissystems',
    hook: 'Seit § 371 SGB V müssen Systeme Daten für den Wechsel exportieren können. Wie viele Praxen wechseln tatsächlich, und welche Systeme gewinnen dabei?',
    figures: ['Quartalsweise Zu- und Abgänge je System aus der KBV-Statistik', 'Stand der Archivierungs- und Wechselschnittstelle (AWS)', 'Systeme mit dokumentierter AWS-Zulassung (z. B. T2med, Epikur)'],
    dataStatus: 'offen',
    dataNote: 'Nettowechsel aus der KBV-Statistik zeigen nur Salden, keine Wechsel von A nach B; das im Post sagen. AWS-Verzeichnis der KBV gibt es nicht öffentlich.',
    refs: [1, 4],
  },
  {
    nr: 10, arc: 'versorgung', status: 'geplant',
    title: 'Praxissoftware beim Arzt und beim Tierarzt',
    hook: 'Zwei Märkte, dieselbe Frage: Wie viele Anbieter teilen sich die Praxen? Der Vergleich mit der Tiermedizin zeigt, wie unterschiedlich konzentriert sie sind.',
    figures: ['Zahl der Systeme und Anteil der größten drei, Humanmedizin (KBV) gegen Tiermedizin', 'Humanmedizin Q4/2025: 126 Zeilen in der KBV-Statistik', 'Tiermedizin: keine amtliche Statistik, Quelle muss gefunden werden'],
    dataStatus: 'offen',
    dataNote: 'Gemeinsamer Artikel mit der Schwesterseite tiermedizin-in-zahlen.org, beide verlinken aufeinander (docs/VERLINKUNG.md).',
    refs: [1, 2],
  },
]
