import type { ChartHandle, ChartInput } from './types'
import { createLineRace } from './lineRace'
import { createMapRace } from './mapRace'

export async function createChart(kind: 'bar' | 'line' | 'map' | 'combo', container: HTMLElement, input: ChartInput): Promise<ChartHandle> {
  if (kind === 'line') return createLineRace(container, input)
  // Säulen + Linie ist der Linienrenderer mit Säulen für die linke Achse.
  if (kind === 'combo') return createLineRace(container, { ...input, saeulen: true })
  if (kind === 'map') return createMapRace(container, input)
  const { createBarRace } = await import('./racingBars')
  return createBarRace(container, input)
}
