import { useApp } from '@/state/store'
import { preview } from '@/lib/preview/controller'
import type { ChartHandle } from '@/lib/chart/types'
import { Buehne } from '@/components/Buehne'
import { wurzel } from '@/lib/pfade'

/** Die Bühne des Studios: Daten und Einstellungen aus dem Store, Abspielen über den Studio-Controller. */
export function Stage() {
  const dataset = useApp((s) => s.dataset)
  const settings = useApp((s) => s.settings)
  const brand = useApp((s) => s.brand)
  return (
    <Buehne
      dataset={dataset}
      settings={settings}
      brand={brand}
      controller={preview}
      // Nur im Dev-Modus: für die Glätteprüfung (scripts/pruefe-glaette.mjs) von außen erreichbar
      onChart={import.meta.env.DEV ? (h) => { (window as unknown as { __crsChart?: ChartHandle }).__crsChart = h } : undefined}
      leer={<Leerzustand />}
    />
  )
}

/** Ohne Daten keine Bühne mit verwaistem Titel, sondern der Weg zum ersten Video. */
function Leerzustand() {
  return (
    <div className="max-w-sm rounded-lg bg-surface p-5 text-center shadow-sm">
      <p className="text-base font-semibold text-ink">Noch keine Daten geladen</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        <span className="hidden lg:inline">Rechts</span><span className="lg:hidden">Unten</span> einen Beispiel-Datensatz wählen oder eine eigene Tabelle laden: erste Spalte die Zeit, eine Spalte je Reihe, in den Zellen nur Zahlen.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <a href={wurzel('datenformat/')} className="btn-primary !min-h-10 !px-3 text-sm">So muss die Tabelle aussehen</a>
        <a href={wurzel('vorlagen/vorlage-zeitreihe.xlsx')} download className="btn-ghost !min-h-10 !px-3 text-sm">Vorlage herunterladen</a>
      </div>
      <p className="mt-3 text-xs text-ink-faint">Die Tabelle wird nur in diesem Browser gelesen und nicht hochgeladen.</p>
    </div>
  )
}
