/**
 * Freigabe: was auf der Seite sichtbar ist, hängt am Redaktionsplan.
 *
 * Schalter in freigabe.json:
 *
 * - `beispieleErstNachVeroeffentlichung` (an seit 29.09.2026): Ein Datensatz erscheint live erst, wenn
 *   ihn ein veröffentlichter Post oder der aktuelle Post (`naechster`) verwendet. Der aktuelle Post zählt
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
import FREIGABE_JSON from './freigabe.json'
import ARTIKEL_JSON from './artikel-index.json'
import { POSTS, type RoadmapPost } from './roadmap'
import { SAMPLES } from '@/samples'

export const FREIGABE: { beispieleErstNachVeroeffentlichung: boolean; artikelLive: boolean; vorschauPosts: number } = FREIGABE_JSON

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

/** Datensätze, die live angeboten werden: aus veröffentlichten Posts und dem aktuellen. */
export const FREIGEGEBENE_DATENSAETZE = new Set(
  POSTS.filter((p) => p.sampleId && (p.status === 'veroeffentlicht' || p.status === 'naechster')).map((p) => p.sampleId as string),
)

export function datensatzFreigegeben(id: string): boolean {
  return !LIVE_ANSICHT || !FREIGABE.beispieleErstNachVeroeffentlichung || FREIGEGEBENE_DATENSAETZE.has(id)
}

/** Die Datensätze, die das Studio anbietet. Alle Oberflächen lesen hier, nicht direkt SAMPLES. */
export const SICHTBARE_SAMPLES = SAMPLES.filter((s) => datensatzFreigegeben(s.id))

/** Artikel zur Post-Reihe, erzeugt von scripts/build-artikel.mjs aus src/content/artikel/*.md. */
export interface ArtikelEintrag { post?: number; art?: string; slug: string; titel: string; beschreibung: string; frage: string; bereit: boolean; live: boolean }
export const ARTIKEL: ArtikelEintrag[] = ARTIKEL_JSON as ArtikelEintrag[]
