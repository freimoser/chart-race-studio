// CSV lesen für die Datensatz-Skripte aller Seiten. Felder in Anführungszeichen dürfen Kommas enthalten
// („"S3 Praxiscomputer (FREY-Gruppe, …)"“); eine URL in der letzten Spalte darf auch unzitiert Kommas enthalten.
import fs from 'node:fs'

/** Eine CSV-Zeile in Felder zerlegen. */
export const felder = (z) => {
  const out = []; let f = '', q = false
  for (let i = 0; i < z.length; i++) {
    const c = z[i]
    if (q) { if (c === '"' && z[i + 1] === '"') { f += '"'; i++ } else if (c === '"') q = false; else f += c }
    else if (c === '"') q = true
    else if (c === ',') { out.push(f); f = '' }
    else f += c
  }
  out.push(f)
  return out
}

/** Datei lesen: Liste von Objekten nach der Kopfzeile. Überzählige Felder gehören zur letzten Spalte. */
export const leseCsv = (datei) => {
  const [kopf, ...zeilen] = fs.readFileSync(datei, 'utf8').trim().split(/\r?\n/)
  const k = felder(kopf)
  return zeilen.map((z) => { const t = felder(z); return Object.fromEntries(k.map((n, i) => [n, i === k.length - 1 ? t.slice(i).join(',') : t[i]])) })
}
