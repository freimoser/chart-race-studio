import type { ColumnMapping, Dataset, RawTable, SampleDataset } from '@/lib/data/types'
import { detectMapping } from '@/lib/data/detect'
import { buildDataset, effectivePeriodCount } from '@/lib/data/transform'
import { DEFAULT_ANIMATION_SEC, DEFAULT_SETTINGS, stepDurationForAnimation, type ChartSettings } from '@/lib/settings'
import { defaultTemplateFor } from '@/lib/data/dates'
import { formatById } from '@/lib/formats'

/**
 * Macht aus einem Beispiel-Datensatz Tabelle, Datensatz und Einstellungen. Eine Quelle für das Studio
 * und die Grafik in den Artikeln: Beide sollen denselben Datensatz gleich zeigen, und im Video sieht er
 * genauso aus.
 */
export function beispielLaden(sample: SampleDataset, basis: ChartSettings): { table: RawTable; mapping: ColumnMapping; dataset: Dataset; settings: ChartSettings } {
  const table: RawTable = { headers: sample.headers, rows: sample.rows, sourceName: sample.title }
  const mapping = detectMapping(table)
  const dataset = buildDataset(table, mapping)
  const kind = dataset.periods[0]?.kind ?? 'year'
  const sug = sample.suggested ?? {}
  return {
    table, mapping, dataset,
    settings: {
      ...basis,
      categories: Object.fromEntries(Object.entries(sug.colors ?? {}).map(([n, color]) => [n, { color }])),
      title: sample.title,
      subtitle: sample.subtitle,
      source: sample.source,
      dateTemplate: sug.dateFormat ?? defaultTemplateFor(kind),
      topN: sug.topN ?? formatById(basis.format).preset.topN,
      decimals: sug.decimals ?? 0,
      suffix: sug.suffix ?? '',
      prefix: '',
      compact: false,
      chartType: sug.chartType ?? basis.chartType,
      labelsPosition: sug.labelsPosition ?? basis.labelsPosition,
      showImages: false,
      secondaryAxis: sug.secondaryAxis ?? [],
      secondaryDecimals: sug.secondaryDecimals ?? 1,
      secondarySuffix: sug.secondarySuffix ?? '',
      primaryAxisLabel: sug.primaryAxisLabel ?? '',
      // Kipppunkt der Farbskala: bewusst zurücksetzen, wenn der Datensatz keinen nennt –
      // sonst behält ein Anteilsdatensatz seine Skala für den nächsten, der keine hat.
      divergingAt: sug.divergingAt,
      divergingLabels: sug.divergingLabels,
      secondaryAxisLabel: sug.secondaryAxisLabel ?? '',
      stepDuration: stepDurationForAnimation(sug.animationSec ?? DEFAULT_ANIMATION_SEC, effectivePeriodCount(dataset.periods, DEFAULT_SETTINGS.gapFill)),
    },
  }
}
