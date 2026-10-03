import { useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { Buehne } from '@/components/Buehne'
import { PreviewController, usePreview } from '@/lib/preview/controller'
import { SICHTBARE_SAMPLES } from '@/content/freigabe'
import { beispielLaden } from '@/lib/beispiel'
import { DEFAULT_SETTINGS, type ChartType } from '@/lib/settings'
import type { FormatId, VideoFormat } from '@/lib/formats'
import { stageColors } from '@/lib/stageColors'

/**
 * Schmal hochkant wie im LinkedIn-Feed, breit im Querformat. Dieselbe Grenze steht in article.css
 * (@container), dort bestimmt sie die Höhe des Rahmens.
 */
const SCHMAL = 560
const formatFuer = (breite: number): FormatId => (breite < SCHMAL ? '4:5' : '16:9')

/**
 * Rechenformate der Grafik. Das Video wird für 1080 oder 1920 Pixel Breite gesetzt; auf 360 Pixel
 * verkleinert wären die Beschriftungen dann 7 Pixel hoch. Hier ist die Fläche kleiner, die Schrift
 * relativ größer: Auf einem 360 Pixel breiten Telefon stehen die Beschriftungen bei gut 10 Pixeln, in
 * einer Artikelspalte am Rechner bei rund 12. Seitenverhältnis und Aufbau bleiben die des Videos.
 */
const RECHENFORMAT: Record<'4:5' | '16:9', VideoFormat> = {
  '4:5': { id: '4:5', label: '4:5', hint: 'Grafik schmal', width: 640, height: 800, preset: { padding: 30, titleSize: 30, subtitleSize: 18, captionSize: 14, dateSize: 58, labelSize: 17, topN: 10, watermarkSize: 14, dateTopRight: true, subtitleLines: 3 } },
  '16:9': { id: '16:9', label: '16:9', hint: 'Grafik breit', width: 1120, height: 630, preset: { padding: 40, titleSize: 36, subtitleSize: 20, captionSize: 15, dateSize: 64, labelSize: 19, topN: 10, watermarkSize: 15, dateTopRight: true } },
}

// Hochkant auf dem Telefon darf die Spalte mit den Namen breiter werden als im Video: Ein gekürzter
// Name („Angestellte Tierärzti…“) ist schlimmer als eine etwas schmalere Zeichenfläche.
const SCHMAL_DIAGRAMM = { minPlotAnteil: 0.33 }

export function Grafik({ id, art }: { id: string; art?: ChartType }) {
  const sample = SICHTBARE_SAMPLES.find((s) => s.id === id)
  const [format, setFormat] = useState<FormatId>(() => formatFuer(window.innerWidth))
  const controller = useMemo(() => new PreviewController(), [])
  const snap = usePreview(controller)
  const gestartet = useRef(false)
  // Für die Anzeige: ob die Grafik schon einmal lief. Der Ref oben steuert nur das automatische Starten.
  const [lief, setLief] = useState(false)
  const sichtbar = useRef(false)
  const ruhig = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  // Drehen des Telefons oder ein breiteres Fenster wechseln das Format.
  useEffect(() => {
    const onResize = () => setFormat(formatFuer(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const geladen = useMemo(() => {
    if (!sample) return null
    // Kurze Standbilder: Im Artikel will niemand eine Sekunde auf den Start warten. Kein Wasserzeichen
    // und keine Schleife – die Grafik bleibt am Ende stehen, das letzte Bild ist das wichtigste.
    const g = beispielLaden(sample, { ...DEFAULT_SETTINGS, format, holdStart: 0.4, holdEnd: 2, loopPreview: false, watermarkEnabled: false })
    return art ? { ...g, settings: { ...g.settings, chartType: art } } : g
  }, [sample, format, art])

  // Abspielen, sobald die Grafik zur Hälfte im Bild ist; anhalten, wenn sie hinausscrollt. Der
  // Beobachter misst im iframe gegen den Bildschirm des Artikels. Wer reduzierte Bewegung eingestellt
  // hat, sieht gleich das letzte Bild und startet selbst.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      sichtbar.current = e.isIntersecting && e.intersectionRatio >= 0.5
      const s = controller.getSnapshot()
      if (sichtbar.current && !gestartet.current && s.total > 0 && !ruhig) { gestartet.current = true; controller.play() }
      else if (!sichtbar.current && s.playing) controller.pause()
    }, { threshold: [0, 0.5] })
    io.observe(document.body)
    return () => io.disconnect()
  }, [controller, ruhig])

  // Sobald das Chart steht: entweder gleich starten (schon sichtbar) oder das Schlussbild zeigen.
  useEffect(() => {
    if (snap.total === 0 || gestartet.current) return
    if (sichtbar.current && !ruhig) { gestartet.current = true; controller.play() }
    else controller.seek(snap.total - 1)
  }, [snap.total, controller, ruhig])

  useEffect(() => controller.subscribe(() => { if (controller.getSnapshot().playing) setLief(true) }), [controller])

  if (!sample || !geladen) {
    return <div className="flex h-full items-center justify-center p-6 text-center text-sm text-ink-muted">Diese Grafik ist noch nicht freigegeben.</div>
  }

  const hintergrund = stageColors(geladen.settings.theme).bg
  return (
    <div className="flex h-full flex-col" style={{ background: hintergrund }}>
      {/* Tippen auf die Grafik startet und hält an – die Knöpfe darunter tun dasselbe für Tastatur und Screenreader. */}
      <div className="relative min-h-0 flex-1 cursor-pointer" onClick={() => { gestartet.current = true; controller.toggle() }}>
        <Buehne dataset={geladen.dataset} settings={geladen.settings} brand="klar" controller={controller} format={RECHENFORMAT[format as '4:5' | '16:9']} diagramm={format === '4:5' ? SCHMAL_DIAGRAMM : undefined} flach />
        {!lief && snap.total > 0 && (
          // Nur solange die Grafik noch nicht lief (reduzierte Bewegung oder noch nicht im Bild): zeigt, dass
          // sie sich bewegt. Danach übernimmt die Leiste darunter, damit nichts Zahlen oder Quelle verdeckt.
          <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary/85 text-white shadow-lg">
            <Play size={28} className="translate-x-0.5" />
          </span>
        )}
      </div>
      <div className="flex h-[52px] shrink-0 items-center gap-2 border-t border-line bg-surface px-2">
        <button type="button" className="btn-ghost !min-h-10 !w-10 !px-0" onClick={() => { gestartet.current = true; controller.toggle() }} disabled={snap.total === 0} aria-label={snap.playing ? 'Pause' : 'Abspielen'}>
          {snap.playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button type="button" className="btn-ghost !min-h-10 !w-10 !px-0" onClick={() => { gestartet.current = true; controller.restart() }} disabled={snap.total === 0} aria-label="Von Anfang">
          <RotateCcw size={16} />
        </button>
        <input
          type="range"
          className="min-w-0 flex-1"
          min={0}
          max={Math.max(0, snap.total - 1)}
          value={Math.min(snap.index, Math.max(0, snap.total - 1))}
          disabled={snap.total === 0}
          onChange={(e) => controller.seek(Number(e.target.value))}
          aria-label="Zeitpunkt"
        />
      </div>
    </div>
  )
}
