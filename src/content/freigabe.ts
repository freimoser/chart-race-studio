// Freigabe-Regel ohne Datensätze: siehe freigabe-basis.ts. Hier kommt nur hinzu, was SAMPLES braucht.
export * from './freigabe-basis'
import { datensatzFreigegeben } from './freigabe-basis'
import ARTIKEL_JSON from './artikel-index.json'
import { SAMPLES } from '@/samples'

/** Die Datensätze, die das Studio anbietet. Alle Oberflächen lesen hier, nicht direkt SAMPLES. */
export const SICHTBARE_SAMPLES = SAMPLES.filter((s) => datensatzFreigegeben(s.id))

/** Artikel zur Post-Reihe, erzeugt von scripts/build-artikel.mjs aus src/content/artikel/*.md. */
export interface ArtikelEintrag { post?: number; art?: string; slug: string; titel: string; beschreibung: string; frage: string; bereit: boolean; live: boolean }
export const ARTIKEL: ArtikelEintrag[] = ARTIKEL_JSON as ArtikelEintrag[]
