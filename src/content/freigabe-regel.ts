import type { RoadmapPost } from './roadmap.ts'

/**
 * Datensätze, die live angeboten werden: aus veröffentlichten Posts, dem aktuellen und aus Posts mit
 * `vorabOnline`, dazu die aus `datensaetzeOhnePost`. Ist der Artikel online, muss sein Link „Datensatz im
 * Studio öffnen“ auch funktionieren.
 *
 * Eigene Datei ohne import.meta, damit Seite (freigabe-basis.ts), Build (vite.config.ts, grafik-daten/) und
 * Livegang-Prüfung (scripts/check-launch.mjs) dieselbe Regel lesen.
 */
export function freigegebeneDatensaetze(posts: RoadmapPost[], datensaetzeOhnePost: string[] = []): Set<string> {
  return new Set([
    ...posts.filter((p) => p.sampleId && (p.status === 'veroeffentlicht' || p.status === 'naechster' || p.vorabOnline)).map((p) => p.sampleId as string),
    // Datensätze außerhalb der Post-Reihe, etwa für einen Exkurs: freigegeben, sobald sie hier stehen.
    ...datensaetzeOhnePost,
  ])
}
