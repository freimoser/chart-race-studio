import { LIVE_ANSICHT } from '@/content/freigabe'

/**
 * Nur im Entwicklungsserver: wechselt zwischen „lokal, alles sichtbar“ (für die Videos) und der
 * Live-Ansicht, die genau das zeigt, was online steht. Lädt neu, weil die Freigabe beim Start feststeht.
 */
export function AnsichtSchalter() {
  if (!import.meta.env.DEV) return null
  const params = new URLSearchParams(window.location.search)
  params.delete('live')
  const rest = params.toString()
  const suche = LIVE_ANSICHT ? (rest ? `?${rest}` : '') : `?live${rest ? `&${rest}` : ''}`
  return (
    <a href={`${window.location.pathname}${suche}${window.location.hash}`} data-ansicht={LIVE_ANSICHT ? 'live' : 'lokal'}
      className={`fixed bottom-3 left-3 z-50 rounded-full border px-3 py-1.5 text-[12px] font-medium shadow-sm ${LIVE_ANSICHT ? 'border-primary bg-primary text-white' : 'border-accent/50 bg-surface text-ink'}`}>
      {LIVE_ANSICHT ? 'Live-Ansicht · zurück zu lokal (alles)' : 'Lokal: alles sichtbar · Live-Ansicht prüfen'}
    </a>
  )
}
