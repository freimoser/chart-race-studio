/**
 * ═══════════════════════════════════════════════════════════════════
 *  ANGABEN ZUR SEITE — eine Quelle für Impressum, Datenschutz und Footer
 * ═══════════════════════════════════════════════════════════════════
 * Gleiche Struktur wie `LEGAL` in der Waterfasting-App, damit beide Projekte
 * gleich zu pflegen sind.
 *
 * BLOCKER VOR DEM LIVEGANG: `street` und `zip` sind Pflicht. § 5 DDG verlangt
 * eine ladungsfähige Anschrift; ein unvollständiges Impressum ist in Deutschland
 * abmahnfähig. `npm run check:launch` meldet das als Blocker.
 */
import legal from '@site/content/legal.json'
import profil from '@site/profil.ts'

/**
 * Angaben nach § 5 DDG. Einzige Quelle – Impressum, Datenschutz und Footer lesen hieraus,
 * ebenso der Generator scripts/build-legal.mjs, der die statischen Rechtsseiten erzeugt.
 * Deshalb liegt der Inhalt als JSON vor: So kann Node ihn ohne TypeScript-Übersetzung lesen.
 *
 * BLOCKER VOR DEM LIVEGANG: street und zip sind Pflicht.
 *
 * companyName ist leer, und das bleibt so: Diese Seite wird als PRIVATPERSON betrieben,
 * nicht über die Firma. Ein Firmenname im Impressum würde einen Betreiber nennen, der
 * nicht der Betreiber ist – und die Firma für etwas in Haftung nehmen, das ihr nicht
 * gehört. Aus demselben Grund steht hier eine private E-Mail-Adresse und nicht die
 * Firmendomain.
 *
 * phone ist ebenfalls leer und darf es bleiben: Seit EuGH C-298/07 genügt ein zweiter
 * schneller Kontaktweg, die E-Mail-Adresse erfüllt das.
 *
 * Zur Frage, ob ein Impressum hier überhaupt Pflicht ist: § 5 DDG gilt für geschäftsmäßige
 * Telemedien, nicht für rein private. Weil die Seite persönliche Sichtbarkeit im beruflichen
 * Umfeld stützt, ist die Einordnung nicht eindeutig – ein vollständiges Impressum ist der
 * sichere Weg und kostet nichts. Die Datenschutzerklärung ist unabhängig davon Pflicht,
 * sobald der Hoster Zugriffsdaten verarbeitet.
 */
export const LEGAL = legal

/** Profil der Seite, für die gebaut wird (sites/<SITE>/profil.ts, docs/ARCHITEKTUR.md). */
export const PROFIL = profil

export const SITE = {
  /** Markenname: einzige Quelle ist siteName in legal.json – dort ändern, nicht hier. */
  name: legal.siteName,
  domain: profil.domain,
  tagline: 'Aus einer Tabelle wird ein Video für den Feed.',
  /** Wird für Sitemap, robots.txt und die kanonische URL gebraucht. Nach dem ersten Deploy eintragen. */
  url: import.meta.env.VITE_SITE_URL ?? '',
} as const

/** Integrationen (GA4, Cloudflare, Search Console) – eigene Datei, damit Artikelseiten nicht das ganze Profil laden. */
export { FEATURES } from './features'

export const hatAnschrift = () => Boolean(LEGAL.street && LEGAL.zip)
