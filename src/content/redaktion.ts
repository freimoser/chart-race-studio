/**
 * Form eines Redaktionsplans (sites/<seite>/content/roadmap.ts): Posts in Visiten zu je 30, Kapitel (Arcs),
 * Datenstatus. Gemeinsam für alle Seiten, damit Oberfläche und Skripte jeden Plan lesen können.
 */

export type PostStatus = 'veroeffentlicht' | 'naechster' | 'geplant'
/** belegt = Datensatz liegt vor · teilweise = Einzelwerte belegt, Reihe fehlt · offen = muss recherchiert werden */
export type DataStatus = 'belegt' | 'teilweise' | 'offen'

/**
 * Eine Visite umfasst immer 30 Posts – wie ein Rundgang über die Station, Bett für Bett.
 * Die Nummern laufen über alle Visiten durch (Visite 2 beginnt mit Post 31), damit Verweise
 * wie „siehe Post 3“ eindeutig bleiben. Zu welcher Visite ein Post gehört, folgt aus der Nummer.
 */
export const POSTS_JE_VISITE = 30

export interface Visite {
  nr: number
  titel: string
  /** Die eine Frage, die sich durch alle 30 Posts zieht. */
  leitfrage: string
  status: 'laeuft' | 'in-vorbereitung'
}

export const visiteVon = (postNr: number) => Math.ceil(postNr / POSTS_JE_VISITE)

export interface RoadmapArc {
  id: string
  label: string
  claim: string
}

export interface RoadmapPost {
  nr: number
  arc: string
  title: string
  /** Der Aufhänger, ein bis zwei Sätze. */
  hook: string
  /** Die Zahlen, die im Post stehen sollen. */
  figures: string[]
  /** Datensatz-ID aus sites/<seite>/samples/index.ts, falls das Video daraus kommt. */
  sampleId?: string
  chart?: 'line' | 'bar' | 'map'
  dataStatus: DataStatus
  /** Was noch fehlt oder worauf zu achten ist. */
  dataNote?: string
  /** Nummern anderer Posts, auf die dieser Bezug nimmt. */
  refs?: number[]
  status: PostStatus
  publishedOn?: string
  linkedInUrl?: string
  /** Artikel schon vor dem Post online lassen – etwa weil er bereits veröffentlicht war oder für sich allein gesucht wird. */
  vorabOnline?: boolean
}
