import * as d3 from 'd3'
import type { ChartHandle, ChartInput } from './types'
import { formatValue } from '../data/numbers'
import { istSumme, summenSpalte } from './summen'
import { createMeasurer, fontString } from '../layout'
import { formatPeriod } from '../data/dates'

/**
 * Eigener, deterministischer Line-Chart-Race-Renderer auf D3-Basis.
 * `renderAt(t)` zeichnet den Zustand zu einem beliebigen (auch gebrochenen)
 * Datums-Index – ohne Transitions, dadurch exakt reproduzierbar im Export.
 * Unterstützt eine zweite Y-Achse rechts (input.secondaryAxis).
 *
 * Mit `input.saeulen` wird daraus „Säulen + Linie“: Reihen der linken Achse stehen als Säulen je Periode,
 * Reihen der rechten Achse laufen als Linien darüber. Gedacht für zwei Einheiten, die zusammen eine
 * Geschichte erzählen, etwa Menge und Preis. Eine Säule wächst in der Periode vor ihrem Jahr hoch und steht
 * voll, wenn die Linien ihr Jahr erreichen. Leere Zellen bleiben leer, es wird keine Säule erfunden.
 */
export function createLineRace(container: HTMLElement, input: ChartInput): ChartHandle {
  const measure = createMeasurer()
  const { width: W, height: H, periods } = input
  // Datenstandard: „Summe: …“-Spalten sind keine Linien. Sie laufen als große Zahl oben links im Plot
  // mit – als Linie würde eine Summe die Achse so hochziehen, dass alle Einzelreihen am Boden kleben.
  const summen = input.names.filter(istSumme)
  const names = input.names.filter((n) => !istSumme(n))
  const reihenRows = input.rows.filter((r) => !summen.includes(r.name))
  const P = periods.length
  const dark = input.theme === 'dark'
  const axisColor = dark ? '#9aa3ad' : '#7a828c'
  const gridColor = dark ? '#33383e' : '#e6e9ed'
  const textColor = dark ? '#f2f4f7' : '#1c2229'
  const onRight = (n: string) => input.secondaryAxis.includes(n)
  const hasRight = names.some(onRight)
  const fmtFor = (n: string) => (onRight(n) ? input.secondaryFormat : input.numberFormat)
  const saeulen = Boolean(input.saeulen)
  const istSaeule = (n: string) => saeulen && !onRight(n)

  // Werte-Matrix name -> index -> value|null
  const idx = new Map(periods.map((p, i) => [p.iso, i]))
  const series = new Map<string, (number | null)[]>()
  for (const n of input.names) series.set(n, new Array<number | null>(P).fill(null))
  for (const r of input.rows) {
    const i = idx.get(r.date)
    if (i !== undefined) series.get(r.name)?.splice(i, 1, r.value)
  }
  const extent = (right: boolean) => {
    let max = 0, min = 0
    for (const r of reihenRows) if (onRight(r.name) === right) { if (r.value > max) max = r.value; if (r.value < min) min = r.value }
    return { max, min }
  }
  const extL = extent(false), extR = extent(true)

  // Optional hinter dem Wert die Veränderung seit dem ersten Wert der Reihe, etwa „15,33 € (+379 %)“.
  const ersterWert = new Map(input.names.map((n) => [n, series.get(n)!.find((v) => v !== null) ?? null]))
  const wertText = (n: string, v: number) => {
    const basis = formatValue(v, fmtFor(n))
    const a = ersterWert.get(n)
    if (!input.veraenderungZeigen || a == null || a === 0) return basis
    const pct = Math.round((v / a - 1) * 100)
    // Am Anfang (und wo eine Reihe genau auf ihren Startwert zurückkehrt) steht kein „(+0 %)“.
    if (pct === 0) return basis
    return `${basis} (${pct >= 0 ? '+' : '−'}${Math.abs(pct).toLocaleString('de-DE')} %)`
  }
  const labelFont = fontString(input.labelSize, 600, input.fontFamily)
  const valueFont = fontString(input.labelSize * 0.9, 500, input.fontFamily)
  const tickFont = fontString(input.labelSize * 0.8, 400, input.fontFamily)
  const axisTitleFont = fontString(input.labelSize * 0.8, 600, input.fontFamily)
  // Kopf-Labels sind einzeilig: „Name  Wert“. Platz rechts = breitestes Label + Bild + Abstand.
  const gapText = input.labelSize * 0.45
  const imgSizeAll = input.labelSize * 1.3 * input.imageScale
  // Breitester Wert je Reihe: ihr größter Wert, mit Veränderung der größte Anstieg.
  const breitesterWert = (n: string) => {
    const vals = series.get(n)!.filter((v): v is number => v !== null)
    return vals.reduce((m, v) => Math.max(m, measure(wertText(n, v), valueFont)), 0)
  }
  const labelWidth = (n: string) => measure(n, labelFont) + gapText + breitesterWert(n)
  const widestLabel = names.reduce((m, n) => Math.max(m, labelWidth(n)), 0)
  const leftTicks = Math.ceil(Math.max(measure(formatValue(extL.max, input.numberFormat), tickFont), measure(formatValue(extL.min, input.numberFormat), tickFont))) + 16
  const rightTicks = hasRight ? Math.ceil(measure(formatValue(extR.max, input.secondaryFormat), tickFont)) + 16 : 0
  // Die Label-Spalte darf den Plot nicht auffressen: in schmalen Formaten (9:16, besonders mit zweiter
  // Achse) bleibt die Zeichenfläche mindestens 45 % breit, Namen werden dann gekürzt.
  const headNeeded = Math.ceil(widestLabel) + input.labelSize * 1.2 + (input.showImages ? imgSizeAll + input.labelSize * 0.3 : 0)
  const headMax = Math.max(input.labelSize * 3, W - leftTicks - rightTicks - W * (input.minPlotAnteil ?? 0.45))
  const headSpace = Math.min(headNeeded, headMax)
  const titleSpace = input.primaryAxisLabel || (hasRight && input.secondaryAxisLabel) ? input.labelSize * 1.4 : 0
  // Zweite Achse steht ganz außen, hinter der Label-Spalte, damit sich Ticks und Kopf-Labels nie überlagern.
  const margin = { top: input.labelSize + titleSpace, right: headSpace + rightTicks, bottom: input.labelSize * 2.2, left: leftTicks }
  const plotW = Math.max(50, W - margin.left - margin.right)
  const plotH = Math.max(50, H - margin.top - margin.bottom)

  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H).attr('viewBox', `0 0 ${W} ${H}`)
  svg.style('font-family', input.fontFamily)
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
  const gridG = g.append('g').attr('class', 'grid')
  const yAxisG = g.append('g').attr('class', 'y-axis')
  const y2AxisG = g.append('g').attr('class', 'y2-axis').attr('transform', `translate(${plotW + headSpace},0)`)
  const xAxisG = g.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${plotH})`)
  const saeulenG = g.append('g').attr('class', 'saeulen')
  const linesG = g.append('g').attr('class', 'lines')
  const headsG = g.append('g').attr('class', 'heads')
  const defs = svg.append('defs')

  // Achsentitel
  if (input.primaryAxisLabel) g.append('text').attr('x', -margin.left + 4).attr('y', -input.labelSize * 0.9).attr('fill', axisColor).style('font', axisTitleFont).text(input.primaryAxisLabel)
  if (hasRight && input.secondaryAxisLabel) g.append('text').attr('x', plotW + headSpace + rightTicks - 4).attr('y', -input.labelSize * 0.9).attr('fill', axisColor).attr('text-anchor', 'end').style('font', axisTitleFont).text(input.secondaryAxisLabel)

  // Mit Säulen braucht die erste und letzte Periode eine halbe Säulenbreite Rand.
  const x = saeulen
    ? d3.scaleLinear().domain([-0.5, Math.max(1, P - 1) + 0.5]).range([0, plotW])
    : d3.scaleLinear().domain([0, Math.max(1, P - 1)]).range([0, plotW])
  // Feste Achsen über den gesamten Zeitraum: keine springende Skala während der Animation.
  const y = d3.scaleLinear().domain([extL.min, (extL.max || 1) * 1.06]).nice().range([plotH, 0])
  const y2 = d3.scaleLinear().domain([extR.min, (extR.max || 1) * 1.06]).nice().range([plotH, 0])
  const scaleFor = (n: string) => (onRight(n) ? y2 : y)
  const styleAxis = (sel: d3.Selection<SVGGElement, unknown, null, undefined>) => {
    sel.select('.domain').remove()
    sel.selectAll('text').attr('fill', axisColor).style('font', tickFont)
    sel.selectAll('line').attr('stroke', gridColor)
  }
  // Sind alle Achsenwerte ganze Zahlen, ohne Nachkommastellen: „15 €“ statt „15,00 €“. Die Werte an den
  // Linien behalten ihre Stellen.
  const achsenFormat = (sc: d3.ScaleLinear<number, number>, fmt: typeof input.numberFormat) => (sc.ticks(5).every(Number.isInteger) ? { ...fmt, decimals: 0 } : fmt)
  const fmtY = achsenFormat(y, input.numberFormat), fmtY2 = achsenFormat(y2, input.secondaryFormat)
  yAxisG.call(d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(8).tickFormat((v) => formatValue(Number(v), fmtY)))
  styleAxis(yAxisG)
  if (hasRight) {
    y2AxisG.call(d3.axisRight(y2).ticks(5).tickSize(0).tickPadding(8).tickFormat((v) => formatValue(Number(v), fmtY2)))
    styleAxis(y2AxisG)
  }
  gridG.call(d3.axisLeft(y).ticks(5).tickSize(-plotW).tickFormat(() => ''))
  styleAxis(gridG)

  // Summenanzeige oben links im Plot: Name klein, Zahl groß. Oben links ist bei wachsenden Reihen die
  // freie Ecke; der Block sitzt unter dem Achsentitel und über den Gitterlinien.
  const summenG = g.append('g').attr('class', 'summen').attr('transform', `translate(${input.labelSize * 0.6},${input.labelSize * 0.4})`)
  const zahlSchrift = input.labelSize * 1.9
  const summenZeilen = summen.map((spalte, k) => {
    const { name, einheit } = summenSpalte(spalte)
    const zg = summenG.append('g').attr('transform', `translate(${k * (plotW * 0.34)},0)`)
    zg.append('text').attr('y', input.labelSize * 0.9).attr('fill', axisColor).style('font', axisTitleFont).text(name)
    // Zahl und Einheit in einer Zeile: Die Einheit folgt als tspan direkt auf die Zahl. Vorher wurde ihre
    // Position gemessen, und bei Tabellenziffern lag „515“ über „Standorte“.
    const zeile = zg.append('text').attr('y', input.labelSize * 0.9 + zahlSchrift)
    const zahl = zeile.append('tspan').attr('fill', textColor)
      .style('font', fontString(zahlSchrift, 700, input.fontFamily)).style('font-variant-numeric', 'tabular-nums')
    const zusatz = zeile.append('tspan').attr('fill', axisColor).attr('dx', input.labelSize * 0.35)
      .style('font', fontString(input.labelSize * 0.9, 500, input.fontFamily))
    return { spalte, einheit, zahl, zusatz }
  })

  // Bild-Muster für Köpfe
  const patternId = (n: string) => `lr-img-${Math.abs(hash(n))}`
  if (input.showImages) {
    for (const n of names) {
      const img = input.images[n]
      if (!img) continue
      const size = input.labelSize * 1.3 * input.imageScale
      defs.append('pattern').attr('id', patternId(n)).attr('patternUnits', 'objectBoundingBox').attr('width', 1).attr('height', 1)
        .append('image').attr('href', img).attr('width', size).attr('height', size).attr('preserveAspectRatio', 'xMidYMid slice')
    }
  }

  // x-Achse: nur echte Perioden, ausgedünnt
  const realIdx = periods.map((p, i) => (p.real ? i : -1)).filter((i) => i >= 0)
  const maxTicks = Math.max(2, Math.floor(plotW / (input.labelSize * 4)))
  const every = Math.ceil(realIdx.length / maxTicks)
  // Regelmäßige Ticks plus letztes Jahr; ein zu nah am Ende liegender Regel-Tick entfällt (sonst „2024 2025“ übereinander)
  const regular = realIdx.filter((_, k) => k % every === 0)
  const lastIdx = realIdx[realIdx.length - 1]
  const tickIdx = regular.filter((v, k) => k === 0 || lastIdx - v >= every || v === lastIdx)
  if (tickIdx[tickIdx.length - 1] !== lastIdx) tickIdx.push(lastIdx)
  const defaultTpl = (kind: string) => (kind === 'year' ? 'YYYY' : kind === 'quarter' ? 'Q YYYY' : kind === 'month' ? 'MMM YYYY' : kind === 'day' ? 'DD.MM.YY' : 'LABEL')
  xAxisG.call(d3.axisBottom(x).tickValues(tickIdx).tickFormat((v) => formatPeriod(periods[Number(v)], defaultTpl(periods[Number(v)].kind))).tickSize(0).tickPadding(10))
  xAxisG.select('.domain').attr('stroke', gridColor)
  xAxisG.selectAll('text').attr('fill', axisColor).style('font', tickFont)
  // Erstes/letztes Jahr nach innen ausrichten: kollidiert sonst mit dem „0“ der Y-Achse bzw. der Label-Spalte
  // (Mit Säulen steht jedes Jahr mittig unter seiner Säule, dort gibt es keinen Konflikt.)
  if (!saeulen) {
    xAxisG.selectAll<SVGTextElement, number>('.tick text').attr('text-anchor', (_, i, nodes) => (i === 0 ? 'start' : i === nodes.length - 1 ? 'end' : 'middle'))
    xAxisG.selectAll<SVGTextElement, number>('.tick text').attr('dx', (_, i, nodes) => (i === 0 ? -input.labelSize * 0.3 : i === nodes.length - 1 ? input.labelSize * 0.3 : 0))
  }

  /** Kürzt einen Text mit Auslassungspunkten auf die verfügbare Breite. */
  const fitText = (text: string, maxW: number, font: string): string => {
    if (maxW <= 0) return ''
    if (measure(text, font) <= maxW) return text
    let lo = 0, hi = text.length
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2)
      if (measure(text.slice(0, mid) + '…', font) <= maxW) lo = mid
      else hi = mid - 1
    }
    return lo > 0 ? text.slice(0, lo) + '…' : ''
  }

  // Zwischen zwei Jahren wird monoton kubisch interpoliert (Steffen, dieselbe Regel wie d3.curveMonotoneX):
  // Die Linie hat an den Jahrespunkten keine Knicke mehr, schießt aber nie über einen echten Wert hinaus
  // und erfindet keine Zwischenhochs. Kopf, Wert und Linie folgen derselben Kurve.
  const steigungen = new Map<(number | null)[], number[]>()
  const steigungFuer = (vals: (number | null)[]) => {
    let m = steigungen.get(vals)
    if (m) return m
    m = vals.map((v, i) => {
      if (v == null) return 0
      const a = vals[i - 1], b = vals[i + 1]
      const d0 = a == null ? null : v - a
      const d1 = b == null ? null : b - v
      if (d0 == null && d1 == null) return 0
      if (d0 == null) return d1!
      if (d1 == null) return d0
      return (Math.sign(d0) + Math.sign(d1)) * Math.min(Math.abs(d0), Math.abs(d1), 0.5 * Math.abs((d0 + d1) / 2))
    })
    steigungen.set(vals, m)
    return m
  }
  const valueAt = (vals: (number | null)[], t: number): number | null => {
    const i = Math.floor(t)
    const f = t - i
    const a = vals[i]
    if (a === null || a === undefined) return null
    if (f <= 0 || i + 1 >= P) return a
    const b = vals[i + 1]
    if (b === null || b === undefined) return a
    const m = steigungFuer(vals)
    const f2 = f * f, f3 = f2 * f
    return (2 * f3 - 3 * f2 + 1) * a + (f3 - 2 * f2 + f) * m[i] + (-2 * f3 + 3 * f2) * b + (f3 - f2) * m[i + 1]
  }

  let current = 0
  const listeners = new Set<(i: number, last: boolean) => void>()

  // Erster Wert je Reihe: Eine neue Reihe blendet über eine ganze Periode ein, statt im ersten Bild voll dazustehen.
  const ersterIndex = new Map(input.names.map((n) => [n, series.get(n)!.findIndex((v) => v !== null)]))
  const minGap = input.labelSize * 1.35

  /** Alle Reihen mit Wert zum Zeitpunkt tt, samt stetiger Deckkraft. */
  function koepfe(tt: number) {
    const liste: { name: string; v: number; op: number }[] = []
    for (const n of names) {
      const v = valueAt(series.get(n)!, tt)
      if (v !== null) liste.push({ name: n, v, op: 1 })
    }
    // Für die Rangfolge zählt eine einsteigende Reihe erst allmählich: Ihr Rangwert wächst vom Achsenboden
    // auf ihren echten Wert. Sonst verdrängt sie im ersten Bild eine andere Reihe aus den Top N.
    const boden = y.domain()[0]
    const rangListe = liste.map((h) => ({ name: h.name, v: boden + (h.v - boden) * einblenden(h.name, tt) }))
    liste.forEach((h, i) => { h.op = deckkraft(rangListe[i], rangListe) * einblenden(h.name, tt) * ausblenden(h.name, tt) })
    return liste
  }
  // Einblenden zählt ab dem Beginn des aktuellen Abschnitts: nach dem ersten Wert und ebenso nach einer
  // Lücke (zwei Jahre ohne Wiesn). Sonst stünde die Beschriftung nach der Lücke in einem Bild wieder da.
  function einblenden(n: string, tt: number) {
    const vals = series.get(n)!
    let i = Math.min(P - 1, Math.floor(tt))
    if (vals[i] === null) return 1
    while (i > 0 && vals[i - 1] !== null) i--
    if (i <= 0 || i === ersterIndex.get(n) && i === 0) return 1
    const u = Math.max(0, Math.min(1, (tt - i) / 1))
    return u * u * (3 - 2 * u)
  }
  // Vor einer Lücke oder dem Ende der Reihe blendet der Kopf über die letzte Periode aus, statt zu verschwinden.
  function ausblenden(n: string, tt: number) {
    const vals = series.get(n)!
    const i = Math.floor(tt)
    if (i + 1 >= P || vals[i] === null || vals[i + 1] !== null) return 1
    const u = Math.max(0, Math.min(1, tt - i))
    return 1 - u * u * (3 - 2 * u)
  }
  // Stetige Deckkraft um die Top-N-Grenze: Die Grenze liegt zwischen dem N-ten und dem (N+1)-ten Wert,
  // das Übergangsband ist mindestens 4 % der Achse breit. Wer die Grenze kreuzt, blendet über das Band weich
  // ein oder aus. Unterhalb ist eine Reihe unsichtbar – keine Geisterlinien.
  function deckkraft(h: { name: string; v: number }, liste: { name: string; v: number }[]) {
    if (onRight(h.name)) return 1
    const sortiert = liste.filter((x) => !onRight(x.name)).map((x) => x.v).sort((a, b) => b - a)
    const hi = sortiert[input.topN - 1], lo = sortiert[input.topN]
    if (hi === undefined || lo === undefined) return 1
    const band = Math.max(1e-9, (y.domain()[1] - y.domain()[0]) * 0.04)
    return Math.max(0, Math.min(1, 0.5 + (h.v - (hi + lo) / 2) / Math.max(hi - lo, band)))
  }
  // Beschriftungen blenden später ein als Linien: Eine Linie an der Top-N-Grenze darf halb sichtbar sein, ein
  // halb sichtbarer Name dagegen liest sich wie ein Fehler und überlagert seine Nachbarn.
  const labelDeckkraft = (op: number) => { const u = Math.max(0, Math.min(1, (op - 0.3) / 0.6)); return u * u * (3 - 2 * u) }
  /** Kollisionsfreie Label-Positionen; jedes Label beansprucht nur so viel Abstand, wie es sichtbar ist. */
  /** Gleichstand (unter 0,01 px): oben bleibt, wer zuletzt höher lag. So entscheidet das Standbild am Ende
   *  wie die Bilder davor, in denen die Linien noch auseinanderliefen. Erst ohne jeden Unterschied in der
   *  Vergangenheit gilt der Name. Bildschirm-y wächst nach unten, also zuerst die Reihe mit dem höheren Wert. */
  const vorher = (a: string, b: string, tk: number) => {
    const va = series.get(a), vb = series.get(b)
    if (va && vb) for (let i = Math.min(P - 1, Math.ceil(tk)); i >= 0; i--) {
      const x = va[i], y = vb[i]
      if (x != null && y != null && Math.abs(x - y) > 1e-9) return scaleFor(a)(x) - scaleFor(b)(y)
    }
    return a < b ? -1 : 1
  }
  function anordnen(liste: { name: string; v: number; op: number }[], tk: number) {
    const lo_ = input.labelSize * 0.75, hi_ = plotH - input.labelSize * 0.8
    const placed = liste.filter((h) => h.op > 0.01).map((h) => ({ ...h, lop: labelDeckkraft(h.op), y: scaleFor(h.name)(h.v), ty: scaleFor(h.name)(h.v) }))
    const abstand = (a: { lop: number }, b: { lop: number }) => minGap * Math.min(a.lop, b.lop)
    for (let iter = 0; iter < 40; iter++) {
      // Praktisch gleiche Höhe gilt als Gleichstand (siehe vorher). Vorher entschied im letzten Bild der Name,
      // davor eine Rundungsdifferenz der Glättung – gleichauf endende Reihen tauschten dann im Standbild.
      placed.sort((a, b) => (Math.abs(a.ty - b.ty) > 0.01 ? a.ty - b.ty : 0) || (Math.abs(a.y - b.y) > 0.01 ? a.y - b.y : 0) || vorher(a.name, b.name, tk))
      let moved = false
      for (let i = 1; i < placed.length; i++) {
        const gap = placed[i].ty - placed[i - 1].ty
        const soll = abstand(placed[i], placed[i - 1])
        if (gap < soll - 0.01) { const push = (soll - gap) / 2; placed[i - 1].ty -= push; placed[i].ty += push; moved = true }
      }
      for (const p of placed) p.ty = Math.max(lo_, Math.min(hi_, p.ty))
      for (let i = 1; i < placed.length; i++) { const soll = abstand(placed[i], placed[i - 1]); if (placed[i].ty - placed[i - 1].ty < soll - 0.01) placed[i].ty = Math.min(hi_, placed[i - 1].ty + soll) }
      for (let i = placed.length - 2; i >= 0; i--) { const soll = abstand(placed[i + 1], placed[i]); if (placed[i + 1].ty - placed[i].ty < soll - 0.01) placed[i].ty = Math.max(lo_, placed[i + 1].ty - soll) }
      if (!moved) break
    }
    return placed
  }

  // Säulen: je Periode eine Gruppe, mehrere Reihen der linken Achse nebeneinander. Die Säule des Jahres i
  // wächst zwischen i − 0,6 und i hoch (weich auslaufend) und steht voll, wenn die Linien bei i ankommen.
  const saeulenNamen = names.filter(istSaeule)
  const gruppenBreite = Math.abs(x(1) - x(0)) * 0.72
  const saeulenBreite = gruppenBreite / Math.max(1, saeulenNamen.length)
  const radius = Math.min(saeulenBreite * 0.18, input.labelSize * 0.2)
  function zeichneSaeulen(t: number) {
    const daten: { key: string; name: string; i: number; v: number; k: number }[] = []
    for (let i = 0; i < P; i++) {
      const u = Math.max(0, Math.min(1, (t - (i - 0.6)) / 0.6))
      if (u <= 0) break
      const wachsen = 1 - (1 - u) * (1 - u) * (1 - u)
      saeulenNamen.forEach((n, k) => {
        const v = series.get(n)![i]
        if (v !== null) daten.push({ key: `${n}|${i}`, name: n, i, v: v * wachsen, k })
      })
    }
    const y0 = y(Math.max(0, y.domain()[0]))
    const bars = saeulenG.selectAll<SVGPathElement, typeof daten[number]>('path').data(daten, (d) => d.key)
    bars.enter().append('path').merge(bars)
      .attr('fill', (d) => input.colors[d.name])
      .attr('d', (d) => {
        const left = x(d.i) - gruppenBreite / 2 + d.k * saeulenBreite + saeulenBreite * 0.06
        const w = saeulenBreite * 0.88
        const top = y(d.v)
        const h = Math.max(0, y0 - top)
        const r = Math.min(radius, h / 2, w / 2)
        // Oben abgerundet, unten gerade auf der Grundlinie
        return `M${left},${y0} V${top + r} Q${left},${top} ${left + r},${top} H${left + w - r} Q${left + w},${top} ${left + w},${top + r} V${y0} Z`
      })
    bars.exit().remove()
  }

  function renderAt(t: number) {
    t = Math.max(0, Math.min(P - 1, t))
    current = t
    for (const s of summenZeilen) {
      const v = valueAt(series.get(s.spalte)!, t)
      const text = v == null ? '' : formatValue(v, { ...input.numberFormat, prefix: '', suffix: '' })
      s.zahl.text(text)
      s.zusatz.text(v == null ? '' : s.einheit)
    }
    const upto = Math.floor(t)
    const heads = koepfe(t)
    const opacityFor = (h: { name: string; v: number }) => deckkraft(h, heads)
    const headOf = (n: string) => heads.find((h) => h.name === n)

    if (saeulen) zeichneSaeulen(t)
    const paths = linesG.selectAll<SVGPathElement, string>('path').data(names.filter((n) => !istSaeule(n)), (d) => d)
    paths.enter().append('path').attr('fill', 'none').attr('stroke-width', Math.max(2, input.labelSize * 0.14)).attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round')
      .merge(paths)
      .attr('stroke', (n) => input.colors[n])
      // Gestrichelt nur, wo Linien beider Achsen nebeneinander stehen; bei Säulen + Linie ist die Linie die Linie.
      .attr('stroke-dasharray', (n) => (onRight(n) && !saeulen ? `${input.labelSize * 0.5} ${input.labelSize * 0.3}` : null))
      // Reihen ohne aktuellen Wert (beendet) bleiben als Verlauf sichtbar, nur gedämpft
      .attr('opacity', (n) => {
        const h = headOf(n)
        if (h) return opacityFor(h)
        // Beendete Reihe: blendet innerhalb einer Periode nach ihrem letzten Wert aus, statt stehen zu bleiben
        const vals = series.get(n)!
        let letzter = -1
        for (let i = 0; i <= upto; i++) if (vals[i] !== null) letzter = i
        if (letzter < 0) return 0
        // Eine Lücke mitten in der Reihe (etwa zwei Jahre ohne Wiesn) ist kein Ende: Der Verlauf bleibt stehen.
        const geht_weiter = vals.slice(upto + 1).some((v) => v !== null)
        return opacityFor({ name: n, v: vals[letzter]! }) * (geht_weiter ? 1 : Math.max(0, 1 - (t - letzter)))
      })
      .attr('d', (n) => {
        const vals = series.get(n)!
        const sc = scaleFor(n)
        const line = d3.line<[number, number] | null>().defined((d) => d !== null).x((d) => x(d![0])).y((d) => sc(d![1]))
        // Die Kurve wird in feinen Schritten aus derselben Interpolation gesampelt, aus der auch der Kopf
        // seine Position hat – so sitzt der Punkt immer exakt auf der Linie.
        const SCHRITTE = 8
        const pts: ([number, number] | null)[] = []
        for (let i = 0; i <= upto; i++) {
          const v = vals[i]
          if (v === null) { pts.push(null); continue }
          pts.push([i, v])
          const ende = Math.min(i + 1, t)
          if (i + 1 < P && vals[i + 1] !== null && ende > i) {
            for (let k = 1; k <= SCHRITTE; k++) {
              const tk = i + (ende - i) * (k / SCHRITTE)
              if (tk >= i + 1) break
              pts.push([tk, valueAt(vals, tk)!])
            }
            if (ende < i + 1) pts.push([ende, valueAt(vals, ende)!])
          }
        }
        return pts.some(Boolean) ? line(pts) : null
      })

    // Köpfe und einzeilige Labels („Name  Wert“) mit Kollisionsauflösung, innerhalb der Plot-Höhe geklemmt
    // Beschriftungen: Die Anordnung wird nicht nur für t berechnet, sondern auch für benachbarte
    // Zeitpunkte, und der Versatz jedes Labels (Label minus Punkt) wird gemittelt. Kreuzen sich zwei Linien,
    // tauschen ihre Labels dadurch in einer gleitenden Bewegung die Plätze statt in einem Bild. Im
    // Gleichlauf ist der Versatz konstant und das Mittel exakt. Rein aus den Daten berechnet, also für den
    // Bild-für-Bild-Export weiterhin eine Funktion der Zeit.
    const MITTEL = 12, FENSTER = 0.4
    const versatz = new Map<string, { summe: number; n: number }>()
    // Zum Ende hin schrumpft das Fenster auf null: Das letzte Bild steht als Standbild lange im Video und muss
    // exakt kollisionsfrei sein. Am Anfang bleibt es voll – dort kreuzen sich Linien oft schon im ersten Jahr.
    const fenster = Math.min(FENSTER, 2 * (P - 1 - t))
    for (let k = 0; k < MITTEL; k++) {
      // Fenster um t herum, an den Rändern geklemmt: Am Anfang und am Ende – dem Standbild – gilt damit exakt
      // die kollisionsfreie Anordnung, und Labels beginnen einen Platztausch schon kurz vor dem Kreuzen.
      // Untergrenze knapp über 0: Im ersten Bild stehen oft alle Reihen auf demselben Wert (Anstieg 0 %). Dort
      // entschiede sonst der Name über die Reihenfolge, eine Periode später der Wert, und das Mittel aus beiden
      // Anordnungen legte Labels übereinander.
      const tk = Math.max(1e-3, Math.min(P - 1, t + fenster * (k / (MITTEL - 1) - 0.5)))
      for (const p of anordnen(tk === t ? heads : koepfe(tk), tk)) {
        const e = versatz.get(p.name) ?? { summe: 0, n: 0 }
        e.summe += p.ty - p.y; e.n++
        versatz.set(p.name, e)
      }
    }
    const lo_ = input.labelSize * 0.75, hi_ = plotH - input.labelSize * 0.8
    const placed = heads.filter((h) => h.op > 0.01).map((h) => {
      const y0 = scaleFor(h.name)(h.v)
      const e = versatz.get(h.name)
      const ty = Math.max(lo_, Math.min(hi_, y0 + (e ? e.summe / e.n : 0)))
      return { ...h, lop: labelDeckkraft(h.op), y: y0, ty }
    })
    const xHead = x(t)
    const imgSize = imgSizeAll
    const hasImg = (n: string) => input.showImages && !!input.images[n]
    const heads$ = headsG.selectAll<SVGGElement, typeof placed[number]>('g.head').data(placed, (d) => d.name)
    const enter = heads$.enter().append('g').attr('class', 'head')
    enter.append('path').attr('class', 'leader').attr('fill', 'none').attr('stroke-width', 1)
    enter.append('circle').attr('class', 'dot')
    enter.append('circle').attr('class', 'img')
    enter.append('text').attr('class', 'name').style('font', labelFont)
    enter.append('text').attr('class', 'value').style('font', valueFont)
    const merged = enter.merge(heads$)
    merged.attr('opacity', 1)
    const x0 = xHead + input.labelSize * 0.5
    merged.select<SVGCircleElement>('circle.dot').attr('opacity', (d) => (istSaeule(d.name) ? 0 : d.op)).attr('cx', xHead).attr('cy', (d) => d.y).attr('r', Math.max(3, input.labelSize * 0.22)).attr('fill', (d) => input.colors[d.name])
    // Verbindungslinie nur, wenn das Label verschoben werden musste
    merged.select<SVGPathElement>('path.leader')
      .attr('stroke', (d) => input.colors[d.name]).attr('opacity', (d) => 0.6 * d.lop)
      .attr('d', (d) => (Math.abs(d.ty - d.y) > 1 && !istSaeule(d.name) ? `M${xHead},${d.y} L${x0 - input.labelSize * 0.15},${d.ty}` : null))
    merged.select<SVGCircleElement>('circle.img')
      .attr('display', (d) => (hasImg(d.name) ? null : 'none'))
      .attr('opacity', (d) => d.lop).attr('cx', x0 + imgSize / 2).attr('cy', (d) => d.ty)
      .attr('r', imgSize / 2).attr('fill', (d) => `url(#${patternId(d.name)})`).attr('stroke', (d) => input.colors[d.name]).attr('stroke-width', 2)
    const textX = (d: typeof placed[number]) => x0 + (hasImg(d.name) ? imgSize + input.labelSize * 0.3 : 0)
    const baseline = (d: typeof placed[number]) => d.ty + input.labelSize * 0.35
    // Namen auf den verbleibenden Platz kürzen, damit nichts über die zweite Achse hinausläuft
    const shownName = (d: typeof placed[number]) => {
      const budget = headSpace - (textX(d) - x0) - input.labelSize * 0.4 - gapText - measure(wertText(d.name, d.v), valueFont)
      return fitText(d.name, budget, labelFont)
    }
    merged.select<SVGTextElement>('text.name').attr('opacity', (d) => d.lop).attr('x', textX).attr('y', baseline).attr('fill', textColor).text(shownName)
    merged.select<SVGTextElement>('text.value').attr('opacity', (d) => d.lop).attr('x', (d) => textX(d) + measure(shownName(d), labelFont) + gapText).attr('y', baseline).attr('fill', axisColor).text((d) => wertText(d.name, d.v))
    heads$.exit().remove()
  }

  // Abspielen in Echtzeit (Vorschau)
  let timer: d3.Timer | null = null
  let running = false
  const play = () => {
    if (running) return
    running = true
    const startT = current
    const startMs = performance.now()
    timer = d3.timer(() => {
      const t = startT + (performance.now() - startMs) / input.tickDuration
      const i = Math.floor(Math.min(P - 1, t))
      const prev = Math.floor(current)
      renderAt(t)
      if (i !== prev) listeners.forEach((fn) => fn(i, i >= P - 1))
      if (t >= P - 1) { pause(); listeners.forEach((fn) => fn(P - 1, true)) }
    })
  }
  const pause = () => { running = false; timer?.stop(); timer = null }

  renderAt(0)

  return {
    kind: 'line',
    dates: periods.map((p) => p.iso),
    goTo: (i) => renderAt(i),
    renderAt,
    play,
    pause,
    isRunning: () => running,
    currentIndex: () => Math.floor(current),
    onDateChange: (fn) => { listeners.add(fn); return () => listeners.delete(fn) },
    svg: () => container.querySelector('svg'),
    destroy: () => { pause(); container.innerHTML = '' },
  }
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return h
}
