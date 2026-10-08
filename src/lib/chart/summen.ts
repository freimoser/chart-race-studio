/**
 * Summenspalten (Datenstandard, Abschnitt 4). Eigene Datei ohne Kartendaten: Line Race und Balkenrennen
 * brauchen nur diese drei Bausteine, und sie sollen nicht die Welt- und Deutschlandkarte (rund 400 KB)
 * mitladen. geo.ts reicht sie für die Karte weiter.
 */

/** Spalten mit diesem Präfix sind Summen: nicht auf der Karte, sondern als Mini-Linie im Panel. */
export const SUMMEN_PRAEFIX = /^\s*(summe|gesamt|total)\s*:\s*/i
export const istSumme = (spalte: string) => SUMMEN_PRAEFIX.test(spalte)

/** „Summe: Hunde (Mio.)“ -> { name: 'Hunde', einheit: 'Mio.' } */
export function summenSpalte(spalte: string): { name: string; einheit: string } {
  const rest = spalte.replace(SUMMEN_PRAEFIX, '').trim()
  const m = rest.match(/^(.*?)\s*\(([^)]*)\)\s*$/)
  return m ? { name: m[1].trim(), einheit: m[2].trim() } : { name: rest, einheit: '' }
}
