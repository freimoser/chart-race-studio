import { describe, expect, it } from 'vitest'
import { sichtbarkeiten } from '@/content/freigabe'
import type { RoadmapPost } from '@/content/roadmap'

const post = (nr: number, status: RoadmapPost['status']): RoadmapPost =>
  ({ nr, status, arc: 'praxis', title: `Post ${nr}`, hook: '', figures: [], dataStatus: 'belegt' })

describe('Vorschaufenster des Redaktionsplans', () => {
  it('zeigt den aktuellen Post und drei geplante, auch wenn ein späterer schon veröffentlicht ist', () => {
    const posts = [post(4, 'veroeffentlicht'), post(5, 'naechster'), post(6, 'veroeffentlicht'),
      post(7, 'geplant'), post(8, 'geplant'), post(9, 'geplant'), post(10, 'geplant')]
    const s = sichtbarkeiten(posts, 4)
    expect([...s.entries()]).toEqual([[4, 'veroeffentlicht'], [5, 'aktuell'], [6, 'veroeffentlicht'],
      [7, 'vorschau'], [8, 'vorschau'], [9, 'vorschau'], [10, 'verborgen']])
  })

  it('stellt den aktuellen Post an den Anfang, auch wenn er eine höhere Nummer hat', () => {
    const s = sichtbarkeiten([post(7, 'geplant'), post(8, 'geplant'), post(12, 'naechster')], 2)
    expect(s.get(12)).toBe('aktuell')
    expect(s.get(7)).toBe('vorschau')
    expect(s.get(8)).toBe('verborgen')
  })
})
