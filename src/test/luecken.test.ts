import { describe, expect, it } from 'vitest'
import { SAMPLES } from '@/samples'

/**
 * Regel „Lückenlose Reihen“ (docs/DATENSTANDARD.md, Abschnitt 7; CLAUDE.md): Jede Reihe eines eigenen Datensatzes
 * hat in jedem Jahr des gezeigten Zeitraums einen Wert. Fehlende Jahre werden recherchiert oder mit naheliegenden
 * Daten gerechnet und in Dateninfo und Post benannt – nie leer gelassen. Gilt für alle Datensätze ab dem Tag, an
 * dem die Regel eingeführt wurde; ältere stehen in AUSNAHMEN, bis sie nachgezogen sind.
 */
const REGEL_SEIT = '2026-10-07'
const AUSNAHMEN = new Set<string>([])

const pruefbar = SAMPLES.filter((s) => (s.erstellt ?? '') >= REGEL_SEIT && !AUSNAHMEN.has(s.id))

describe('Lückenlose Reihen in eigenen Datensätzen', () => {
  it('gibt es überhaupt Datensätze, für die die Regel gilt', () => {
    expect(pruefbar.length).toBeGreaterThan(0)
  })
  for (const s of pruefbar) {
    it(`${s.id}: jede Reihe hat in jedem Jahr einen Wert`, () => {
      const leer: string[] = []
      for (const r of s.rows) r.slice(1).forEach((v, i) => { if (v == null || v === '') leer.push(`${r[0]} ${s.headers[i + 1]}`) })
      expect(leer).toEqual([])
    })
    it(`${s.id}: kein Jahr fehlt im Zeitraum`, () => {
      const jahre = s.rows.map((r) => Number(String(r[0]).slice(0, 4)))
      const fehlend = []
      for (let j = jahre[0]; j <= jahre[jahre.length - 1]; j++) if (!jahre.includes(j)) fehlend.push(j)
      expect(fehlend).toEqual([])
    })
  }
})
