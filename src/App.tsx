import { useEffect, useState } from 'react'
import { Database, Palette, Share2 } from 'lucide-react'
import { useApp } from '@/state/store'
import { Stage } from '@/components/Stage'
import { Transport } from '@/components/Transport'
import { DataPanel } from '@/components/DataPanel'
import { DesignPanel } from '@/components/DesignPanel'
import { ExportPanel } from '@/components/ExportPanel'
import { Roadmap } from '@/components/Roadmap'
import { Consent } from '@/components/Consent'
import { AnsichtSchalter } from '@/components/AnsichtSchalter'
import { FEATURES } from '@/content/site'
import { SICHTBARE_SAMPLES } from '@/content/freigabe'
import { Wordmark } from '@/components/ui'
import type { BrandId } from '@/lib/fonts'
import { wurzel } from '@/lib/pfade'
import { formatById } from '@/lib/formats'

type Tab = 'data' | 'design' | 'export'
type View = 'studio' | 'roadmap'

/** Ansicht steht im Hash, damit Redaktionsplan und Rechtstexte verlinkbar sind. */
function viewFromHash(): View {
  const h = window.location.hash
  if (h.startsWith('#redaktionsplan')) return 'roadmap'
  return 'studio'
}
const HASH: Record<View, string> = { studio: '', roadmap: '#redaktionsplan' }

export default function App() {
  const brand = useApp((s) => s.brand)
  const setBrand = useApp((s) => s.setBrand)
  const dataset = useApp((s) => s.dataset)
  const format = formatById(useApp((s) => s.settings.format))
  const hatDaten = Boolean(dataset && dataset.periods.length >= 2 && dataset.names.length > 0)
  const [tab, setTab] = useState<Tab>('data')
  const [view, setView] = useState<View>(viewFromHash)

  useEffect(() => { document.documentElement.dataset.brand = brand }, [brand])
  // ?beispiel=<id> öffnet einen Datensatz direkt im Studio – so verlinken die Artikel auf ihr Chart.
  // Nur freigegebene Datensätze; der Parameter wird danach aus der Adresse entfernt, damit ein
  // Neuladen nicht die eigene Arbeit überschreibt.
  useEffect(() => {
    const url = new URL(window.location.href)
    const id = url.searchParams.get('beispiel')
    if (!id) return
    const sample = SICHTBARE_SAMPLES.find((s) => s.id === id)
    if (sample) useApp.getState().loadSample(sample)
    url.searchParams.delete('beispiel')
    window.history.replaceState(null, '', url.pathname + url.search + url.hash)
  }, [])
  useEffect(() => {
    const onHash = () => setView(viewFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function zeige(v: View) {
    setView(v)
    window.location.hash = HASH[v]
  }

  // Navigationspunkt der Kopfzeile, gleich gestaltet wie auf den Artikelseiten (article.css, header.site).
  const navLink = 'shrink-0 whitespace-nowrap py-2 text-sm text-ink-muted transition-colors hover:text-ink aria-[current=page]:font-semibold aria-[current=page]:text-ink'

  return (
    <div className="flex min-h-dvh flex-col lg:h-full lg:min-h-0">
      {/* Telefon: Marke oben, darunter die Navigation in einer Zeile. Breit: alles in einer Zeile. */}
      <header className="border-b border-line bg-surface">
        <div className="flex flex-wrap items-center gap-x-6 px-4 pt-2.5 lg:flex-nowrap lg:py-2">
          <a href={wurzel()} className="mr-auto" title="Zur Startseite"><Wordmark /></a>
          <nav aria-label="Hauptnavigation" className="order-3 -mx-4 flex w-[calc(100%+2rem)] gap-5 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] lg:order-none lg:mx-0 lg:w-auto lg:px-0 lg:pb-0">
            <a href={wurzel('beitrag/')} className={navLink}>Artikel</a>
            <a href={wurzel('datenformat/')} className={navLink}>Datenformat</a>
            <a href={wurzel('artikel/datenherkunft.html')} className={`${navLink} hidden sm:inline`}>Datenherkunft</a>
            <a href="#redaktionsplan" onClick={(e) => { e.preventDefault(); zeige('roadmap') }} aria-current={view === 'roadmap' ? 'page' : undefined} className={navLink}>Redaktionsplan</a>
            <a href="#" onClick={(e) => { e.preventDefault(); zeige('studio') }} aria-current={view === 'studio' ? 'page' : undefined} className={navLink}>Studio</a>
          </nav>
          <label className="hidden items-center lg:flex" title="Design-Richtung">
            <span className="sr-only">Design-Richtung</span>
            <select className="input !w-auto !py-1 text-xs" value={brand} onChange={(e) => setBrand(e.target.value as BrandId)}>
              <option value="klar">Klar (Inter)</option>
              <option value="editorial">Editorial (IBM Plex)</option>
              <option value="signal">Signal (Manrope)</option>
            </select>
          </label>
        </div>
      </header>

      {view === 'roadmap' ? (
        <main className="flex-1 bg-surface-2/40 lg:min-h-0 lg:overflow-y-auto">
          <Roadmap onOpenStudio={() => zeige('studio')} />
        </main>
      ) : (
      // Breit: Bühne links, Bedienung rechts, beide mit eigenem Scrollbereich. Telefon: alles untereinander,
      // die Seite scrollt als Ganzes; die Bühne hat das Seitenverhältnis des Videos, höchstens 70 % der Höhe.
      <main className="grid flex-1 grid-cols-1 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
        <section className="flex flex-col gap-3 p-3 lg:min-h-0 lg:p-5">
          <div
            className={`rounded-[var(--radius-brand)] bg-surface-2/60 p-2 lg:min-h-0 lg:flex-1 lg:p-5 ${hatDaten ? 'buehne-mobil' : ''}`}
            style={{ ['--seitenverhaeltnis' as string]: `${format.width} / ${format.height}` }}
          >
            <Stage />
          </div>
          <Transport />
        </section>

        <aside className="flex flex-col border-t border-line bg-surface lg:min-h-0 lg:border-l lg:border-t-0">
          <nav className="sticky top-0 z-10 grid grid-cols-3 border-b border-line bg-surface lg:static" aria-label="Bereiche">
            {([
              ['data', 'Daten', Database],
              ['design', 'Gestaltung', Palette],
              ['export', 'Export', Share2],
            ] as const).map(([id, label, Icon]) => (
              <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)} className={`flex min-h-12 items-center justify-center gap-2 text-sm font-medium transition-colors ${tab === id ? 'border-b-2 border-primary text-primary' : 'text-ink-muted hover:text-ink'}`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </nav>
          <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            {tab === 'data' && <DataPanel />}
            {tab === 'design' && <DesignPanel />}
            {tab === 'export' && <ExportPanel />}
          </div>
          <footer className="border-t border-line px-4 py-3 text-xs leading-relaxed text-ink-faint lg:py-2 lg:text-[11px] lg:leading-snug">
            <span className="mb-1.5 block">
              Das Studio macht aus einer Tabelle ein animiertes Diagramm: ein Bar Race, in dem Balken die Plätze tauschen, ein
              Line Race, in dem Linien über die Zeit wachsen, Säulen und Linie kombiniert oder eine animierte Welt- und
              Deutschlandkarte. Heraus kommt ein MP4 in 16:9, 1:1, 4:5 oder 9:16, etwa für LinkedIn oder Präsentationen.
              Tabellen aus Excel, CSV oder ODS; wie sie aussehen müssen, steht im{' '}
              <a className="underline hover:text-ink" href={wurzel('datenformat/')}>Datenformat</a>. Alle Grafiken von{' '}
              <a className="underline hover:text-ink" href={wurzel()}>Tiermedizin in Zahlen</a> sind hier entstanden, jedes Beispiel lässt sich öffnen und mit eigenen Zahlen nachbauen.
            </span>
            Läuft komplett im Browser, keine Daten verlassen das Gerät. Diagramm-Animation mit{' '}
            <a className="underline hover:text-ink" href="https://github.com/hatemhosny/racing-bars" target="_blank" rel="noreferrer">racing-bars</a> (MIT). Open Source unter MIT.
            <br />
            <a className="underline hover:text-ink" href={wurzel()}>Startseite</a>
            {' · '}
            <a className="underline hover:text-ink" href={wurzel('artikel/tierarztketten-deutschland.html')}>Tierarztketten</a>
            {' · '}
            <a className="underline hover:text-ink" href={wurzel('datenformat/')}>Datenformat</a>
            {' · '}
            <a className="underline hover:text-ink" href={wurzel('artikel/datenherkunft.html')}>Datenherkunft</a>
            {' · '}
            <a className="underline hover:text-ink" href={wurzel('ueber-das-projekt.html')}>Über das Projekt</a>
            {' · '}
            <a className="underline hover:text-ink" href={wurzel('impressum.html')}>Impressum</a>
            {' · '}
            <a className="underline hover:text-ink" href={wurzel('datenschutz.html')}>Datenschutz</a>
            {FEATURES.gaId && <>{' · '}<button type="button" data-consent-reset className="underline hover:text-ink">Cookie-Auswahl</button></>}
          </footer>
        </aside>
      </main>
      )}
      <Consent />
      <AnsichtSchalter />
    </div>
  )
}
