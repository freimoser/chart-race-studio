// Gemeinsame Helfer für die Datensatz-Skripte aller Seiten (sites/<seite>/scripts/build-samples.mjs).
// Rohdaten liegen je Seite unter sites/<seite>/data/raw/ im Long-Format { date, name, value, metric? }.
// Regeln dazu: docs/DATENSTANDARD.md und CLAUDE.md (lückenlose Reihen, Gerechnetes markieren).

/** long rows -> wide table (Jahr × names). Bei Dubletten gewinnt die zuerst genannte Quelle. */
export function wide(rows, { names, from, to, rename = {} }) {
  const dates = [...new Set(rows.map((r) => r.date))].filter((d) => (!from || d >= from) && (!to || d <= to)).sort()
  const nm = names ?? [...new Set(rows.map((r) => r.name))]
  const out = dates.map((d) => [d, ...nm.map((n) => { const r = rows.find((x) => x.date === d && x.name === n); return r ? r.value : null })])
  // Zeilen ohne einen einzigen Wert verwerfen
  return { headers: ['Jahr', ...nm.map((n) => rename[n] ?? n)], rows: out.filter((r) => r.slice(1).some((v) => v != null)) }
}
export const byMetric = (d, m) => d.rows.filter((r) => r.metric === m)

// Dubletten (Datum|Name) entfernen – die zuerst gelistete Quelle gewinnt.
export const dedupe = (rows) => { const s = new Set(); return rows.filter((r) => { const k = r.date + '|' + r.name; return s.has(k) ? false : (s.add(k), true) }) }

// ---------- Lückenlose Reihen (Regel seit 07.10.2026, docs/DATENSTANDARD.md Abschnitt 7) ----------
// Neue Datensätze haben in jedem Jahr einen Wert. Was keine Quelle hat, wird mit naheliegenden Daten gerechnet
// und in Dateninfo und Post benannt: zwischen zwei Belegen linear, davor/danach der nächste Beleg gehalten –
// oder, wo es eine verwandte Reihe gibt, über deren Verhältnis fortgeschrieben (siehe DACH).
/** Wert aus Stützpunkten {Jahr: Wert}: belegt, sonst linear zwischen zwei Belegen, außen der nächste Beleg. */
export const stuetze = (punkte, jahr) => {
  if (punkte[jahr] != null) return punkte[jahr]
  const js = Object.keys(punkte).filter((k) => punkte[k] != null).map(Number).sort((x, y) => x - y)
  const vor = js.filter((x) => x < jahr).at(-1), nach = js.find((x) => x > jahr)
  if (vor == null) return nach == null ? null : punkte[nach]
  if (nach == null) return punkte[vor]
  return punkte[vor] + (punkte[nach] - punkte[vor]) * (jahr - vor) / (nach - vor)
}
export const r3 = (v) => (v == null ? null : Math.round(v * 1000) / 1000)
/** Breite Tabelle → jede Spalte über alle Jahre von–bis nach `stuetze` gefüllt; `ersatz` überschreibt Spalten. */
export function lueckenlos(w, { von, bis, ersatz = {} }) {
  const spalte = (i) => Object.fromEntries(w.rows.filter((r) => r[i] != null).map((r) => [Number(r[0]), r[i]]))
  const punkte = w.headers.slice(1).map((_, i) => spalte(i + 1))
  return {
    headers: w.headers,
    rows: Array.from({ length: bis - von + 1 }, (_, k) => von + k).map((j) => [String(j),
      ...w.headers.slice(1).map((n, i) => r3(ersatz[n] ? ersatz[n](j) : stuetze(punkte[i], j)))]),
  }
}

/** Stützpunkte {Jahr: Wert} mit einem Faktor verketten – bei Quellenwechsel über ein Überlappungsjahr. */
export const kette = (punkte, faktor) => Object.fromEntries(Object.entries(punkte).map(([j, v]) => [j, v * faktor]))

/** Wert als JS-Literal für die erzeugte data.ts. */
export const lit = (v) => (v == null ? 'null' : typeof v === 'number' ? String(v) : JSON.stringify(v))
