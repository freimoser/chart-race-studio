import { describe, expect, it, vi } from 'vitest'
import { PreviewController } from '@/lib/preview/controller'
import type { ChartHandle } from '@/lib/chart/types'

/** Handle wie racing-bars: pause() meldet das aktuelle Datum noch einmal an alle Beobachter. */
function handle(): ChartHandle & { melde: (i: number) => void } {
  const beobachter = new Set<(i: number, last: boolean) => void>()
  let index = 0
  const dates = ['2020', '2021', '2022']
  const melde = (i: number) => { index = i; beobachter.forEach((fn) => fn(i, i === dates.length - 1)) }
  return {
    kind: 'bar', dates, melde,
    goTo: (i) => { index = i }, play: () => {}, pause: vi.fn(() => melde(index)), isRunning: () => false,
    currentIndex: () => index, onDateChange: (fn) => { beobachter.add(fn); return () => beobachter.delete(fn) },
    svg: () => null, destroy: () => {},
  }
}

describe('PreviewController', () => {
  it('hält am Ende an, ohne sich über das erneut gemeldete letzte Datum endlos aufzurufen', () => {
    vi.useFakeTimers()
    const c = new PreviewController()
    const h = handle()
    c.attach(h)
    c.play()
    vi.advanceTimersByTime(c.holdStart * 1000)
    expect(c.getSnapshot().state).toBe('playing')
    expect(() => h.melde(2)).not.toThrow()
    expect(c.getSnapshot().state).toBe('holdEnd')
    expect(h.pause).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
