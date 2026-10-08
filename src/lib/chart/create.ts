import type { ChartHandle, ChartInput } from './types'
import { createLineRace } from './lineRace'

export async function createChart(kind: 'bar' | 'line' | 'map' | 'combo', container: HTMLElement, input: ChartInput): Promise<ChartHandle> {
  if (kind === 'line') return createLineRace(container, input)
  // Säulen + Linie ist der Linienrenderer mit Säulen für die linke Achse.
  if (kind === 'combo') return createLineRace(container, { ...input, saeulen: true })
  // Karte und Balkenrennen erst bei Bedarf laden: Die Kartendaten (Welt, Bundesländer) und racing-bars
  // gehören nicht in jede eingebettete Liniengrafik.
  if (kind === 'map') { const { createMapRace } = await import('./mapRace'); return createMapRace(container, input) }
  const { createBarRace } = await import('./racingBars')
  return createBarRace(container, input)
}
