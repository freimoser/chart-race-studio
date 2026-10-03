/**
 * Adressen relativ zur Wurzel der Seite. Das Studio liegt unter /studio/, die Artikel, Vorlagen und
 * Rechtstexte darüber – ein relativer Link wie „beitrag/“ zeigte aus dem Studio ins Leere.
 */
export const wurzel = (pfad = '') => `${import.meta.env.BASE_URL}${pfad}`
