import { useEffect, useMemo, useState, type MouseEvent } from 'react'
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
import { FEATURES, PROFIL, SITE } from '@/content/site'
import { SICHTBARE_SAMPLES } from '@/content/freigabe'
import { kopfInhalt } from '@/content/kopf'
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

  // Kopfzeile wie auf allen anderen Seiten: Markup aus src/content/kopf.ts, Aussehen aus src/kopf.css.
  // Markiert wird die Ansicht, in der man ist (Studio oder Redaktionsplan).
  const kopf = useMemo(() => {
    let html = kopfInhalt(PROFIL, SITE.name, wurzel(), () => '')
    if (view === 'roadmap') html = html.replace(/(<a\b[^>]*href="[^"]*#redaktionsplan")/, '$1 aria-current="page"')
    else html = html.replace('class="studio"', 'class="studio" aria-current="page"')
    return html
  }, [view])
  // Links auf das Studio selbst (Studio, Redaktionsplan) schalten nur die Ansicht um, statt die Seite neu zu laden.
  function kopfKlick(e: MouseEvent<HTMLElement>) {
    const a = (e.target as HTMLElement).closest('a')
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    const ziel = new URL(a.href, window.location.href)
    if (ziel.origin !== window.location.origin || ziel.pathname !== window.location.pathname) return
    e.preventDefault()
    zeige(ziel.hash.startsWith('#redaktionsplan') ? 'roadmap' : 'studio')
  }

  return (
    <div className="flex min-h-dvh flex-col lg:h-full lg:min-h-0">
      <header className="site" onClick={kopfKlick} dangerouslySetInnerHTML={{ __html: kopf }} />

      {view === 'roadmap' ? (
        <main className="flex-1 bg-surface-2/40 lg:min-h-0 lg:overflow-y-auto">
          <Roadmap onOpenStudio={() => zeige('studio')} />
        </main>
      ) : (
      // Breit: Bühne links, Bedienung rechts, beide mit eigenem Scrollbereich. Telefon: alles untereinander,
      // die Seite scrollt als Ganzes; die Bühne hat das Seitenverhältnis des Videos, höchstens 70 % der Höhe.
      <main className="grid flex-1 grid-cols-1 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
        {/* Die vorgerenderte Seite hat eine h1; ohne diese hier verlor das Studio sie, sobald React lädt (SEO, Screenreader). */}
        <h1 className="sr-only">Studio für animierte Diagramme</h1>
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
              <a className="underline hover:text-ink" href={PROFIL.datenformatUrl(wurzel())}>Datenformat</a>. Alle Grafiken von{' '}
              <a className="underline hover:text-ink" href={wurzel()}>{SITE.name}</a> sind hier entstanden, jedes Beispiel lässt sich öffnen und mit eigenen Zahlen nachbauen.
            </span>
            Läuft komplett im Browser, keine Daten verlassen das Gerät. Diagramm-Animation mit{' '}
            <a className="underline hover:text-ink" href="https://github.com/hatemhosny/racing-bars" target="_blank" rel="noreferrer">racing-bars</a> (MIT). Open Source unter MIT.
            <br />
            <a className="underline hover:text-ink" href={wurzel()}>Startseite</a>
            {' · '}
            <a className="underline hover:text-ink" href={wurzel(PROFIL.leitartikel.pfad)}>{PROFIL.leitartikel.titel}</a>
            {' · '}
            <a className="underline hover:text-ink" href={PROFIL.datenformatUrl(wurzel())}>Datenformat</a>
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
