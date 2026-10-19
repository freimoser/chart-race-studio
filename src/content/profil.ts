/**
 * Form eines Seitenprofils (sites/<seite>/profil.ts). Das Profil hält alles, was eine Seite von der anderen
 * unterscheidet und nicht in Inhaltsdateien steht: Domain, Farbrichtung, Texte und Verweise der Rahmenseiten
 * (Startseite, Übersicht, Kopf, Fuß, llms.txt). Der Kern liest nur von hier – nie einen Seitennamen fest im Code.
 *
 * Gelesen wird es von vite.config.ts, den Skripten (scripts/lib/site.mjs) und der Oberfläche (src/content/site.ts).
 * Darum nur Daten und reine Funktionen, keine Importe außer Typen.
 */
export interface Verweis { href: string; text: string }

export interface SeitenProfil {
  /** Ordnername unter sites/ */
  id: string
  /** Domain ohne Protokoll, zugleich Standard-Wasserzeichen in Videos und Bildern. */
  domain: string
  /** Farbrichtung aus src/brand/tokens.css (klar, editorial, signal). */
  marke: 'klar' | 'editorial' | 'signal'
  themeColor: string
  /** Was die Seite zählt, als Satzteil: „Zahlen zu …“. Fuß, 404-Seite. */
  thema: string
  /** Ein Satz: was die Seite ist. JSON-LD WebSite, Feed, llms-full.txt. */
  beschreibung: string
  /** Satz im Fuß nach dem Markennamen. */
  fussText: string
  /** Links im Fuß (Mittelzeile) und Hinweis auf die Schwesterseite, als HTML. `hoch` ist der Weg zur Wurzel. */
  fussLinks: (hoch: string) => string
  schwester: string
  /** Hauptnavigation im Kopf. `aktiv(bereich)` liefert das aria-current-Attribut. */
  navigation: (hoch: string, aktiv: (bereich: string) => string) => string
  /** Autor als schema.org-Person; `extra` wird angehängt (etwa worksFor). */
  autor: { name: string; sameAs: string[]; extra?: Record<string, unknown> }
  /**
   * Handgeschriebene Seiten unter sites/<seite>/seiten/, die gebaut und in die Sitemap aufgenommen werden.
   * `name` ist der Rollup-Eingang, `pfad` der Pfad ab Wurzel.
   */
  seiten: { name: string; pfad: string }[]
  /** Leitartikel neben der Reihe (Startseite, Übersicht, Studio). */
  leitartikel: { pfad: string; titel: string; frage: string; text: string; kapitel?: string; /** Text der Karte im Redaktionsplan. */ planText: string }
  /** Wo „So muss die Tabelle aussehen“ hinführt: eigener Bereich oder der der Schwesterseite. */
  datenformatUrl: (hoch: string) => string
  /** Studio in Suchmaschinen? Nur eine Seite soll das Werkzeug indexieren lassen, sonst doppelter Inhalt. */
  studioIndexieren: boolean
  /** Rubriken der Beispiel-Datensätze im Studio. */
  rubriken: readonly { id: string; label: string }[]
  /** Räumlicher Bezug eines Datensatzes für schema.org Dataset. */
  raum: (datensatzId: string) => string
  /** Kennzahl-Leisten auf Startseite und Übersicht: [id, Titel]. */
  leisten: [string, string][]
  start: {
    title: string; description: string; ogTitle: string; ogDescription: string; h1: string; lead: string
    /** Zusätzliche Listenpunkte unter „Themen“ (HTML). */
    themenExtra: string
    /** Abschnitt „Wer hier schreibt“ (HTML, ohne section). */
    ueber: string
  }
  uebersicht: {
    title: string; description: string; ogTitle: string; ogDescription: string
    collectionDescription: string
    lead: (anzahl: number) => string
    /** Text für das Kapitel ohne Post (Auswertungen, Exkurse, Anleitungen). */
    sonstigesClaim: string
    /** Zusätzliche Listenpunkte je Kapitel-ID (HTML). */
    kapitelExtra: Record<string, string>
  }
  /** Volltext von llms.txt. */
  llms: (x: { url: string; marke: string; datenformat: { frage: string; pfad: string; stand: string; beschreibung: string }[]; beitraege: { frage: string; slug: string; stand: string; beschreibung: string }[] }) => string
  /** Standard-Vorschaubild (scripts/og-bilder.mjs): Titel, Unterzeile, Farben. */
  og: { titel: string; text: string; farben: { grund: string; akzent: string; hell: string; text: string } }
  /** Glättungsprüfung (scripts/pruefe-glaette.mjs): Datensätze, die ohne Argument geprüft werden. */
  glaetteDatensaetze: string[]
}
