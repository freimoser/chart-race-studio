/**
 * Freigabe: was auf der Seite sichtbar ist, hängt am Redaktionsplan.
 *
 * Schalter in freigabe.json:
 *
 * - `beispieleErstNachVeroeffentlichung` (an seit 29.09.2026): Ein Datensatz erscheint live erst, wenn
 *   ihn ein veröffentlichter Post, der aktuelle Post (`naechster`) oder ein Post mit `vorabOnline` verwendet. Der aktuelle Post zählt
 *   mit, weil sein Artikel am Tag des Posts schon online ist und auf das Studio verlinkt.
 * - `vorschauPosts`: Wie viele noch nicht veröffentlichte Posts der Redaktionsplan live zeigt – der
 *   aktuelle und die nächsten danach, ohne Zahlen und ohne Datensatz. Alle weiteren bleiben verborgen.
 * - `artikelLive`: Die Artikel unter src/content/artikel/ werden als eigene Seiten gebaut, sobald
 *   ihr Post auf `naechster` steht und der Entwurf `bereit: ja` trägt (scripts/build-artikel.mjs).
 *
 * Lokal (`npm run dev`) ist alles sichtbar, damit die Videos vor dem Post entstehen können. Mit `?live`
 * in der Adresse zeigt auch der Entwicklungsserver genau das, was online zu sehen ist.
 *
 * Verborgen heißt nur: nicht in der Oberfläche. Die Daten stehen weiter im öffentlichen Repository
 * und im Bundle. Für Rohdaten, die vorab niemand sehen darf, ist dieser Schalter nicht gedacht.
 */

// Ohne Datensätze: Die eingebettete Grafik braucht nur die Freigabe-Regel, nicht alle Daten im Bündel.
// freigabe.ts reicht alles weiter und ergänzt, was die Datensätze selbst braucht.
import FREIGABE_JSON from './freigabe.json'
import { POSTS, type RoadmapPost } from './roadmap'
import { freigegebeneDatensaetze } from './freigabe-regel'

export const FREIGABE: { beispieleErstNachVeroeffentlichung: boolean; artikelLive: boolean; vorschauPosts: number; datensaetzeOhnePost?: string[] } = FREIGABE_JSON

/** true = die Seite zeigt, was online zu sehen ist. Im Entwicklungsserver nur mit `?live`. */
export const LIVE_ANSICHT = !import.meta.env.DEV
  || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('live'))

/** aktuell = der Post auf `naechster`; vorschau = die Posts danach im Vorschaufenster. */
export type Sichtbarkeit = 'veroeffentlicht' | 'aktuell' | 'vorschau' | 'verborgen'

/**
 * Das Vorschaufenster: der aktuelle Post zuerst, dann die geplanten in Nummernfolge, zusammen höchstens
 * `anzahl`. Posts werden nicht immer in Nummernfolge veröffentlicht (Post 6 kam vor Post 5), deshalb
 * zählen nur die noch offenen.
 */
export function sichtbarkeiten(posts: RoadmapPost[], anzahl: number): Map<number, Sichtbarkeit> {
  const offen = posts.filter((p) => p.status !== 'veroeffentlicht')
    .sort((a, b) => Number(b.status === 'naechster') - Number(a.status === 'naechster') || a.nr - b.nr)
  const fenster = new Set(offen.slice(0, anzahl).map((p) => p.nr))
  return new Map(posts.map((p) => [p.nr,
    p.status === 'veroeffentlicht' ? 'veroeffentlicht'
      : !fenster.has(p.nr) ? 'verborgen'
        : p.status === 'naechster' ? 'aktuell' : 'vorschau']))
}

const SICHTBARKEIT = sichtbarkeiten(POSTS, FREIGABE.vorschauPosts)

/** Wie der Post live erscheint. Lokal ohne `?live` zeigt der Plan trotzdem alles und nennt diesen Wert nur. */
export const sichtbarkeitVon = (post: RoadmapPost): Sichtbarkeit => SICHTBARKEIT.get(post.nr) ?? 'verborgen'

/** Datensätze, die live angeboten werden. Die Regel steht in freigabe-regel.ts. */
export const FREIGEGEBENE_DATENSAETZE = freigegebeneDatensaetze(POSTS, FREIGABE.datensaetzeOhnePost)

export function datensatzFreigegeben(id: string): boolean {
  return !LIVE_ANSICHT || !FREIGABE.beispieleErstNachVeroeffentlichung || FREIGEGEBENE_DATENSAETZE.has(id)
}
