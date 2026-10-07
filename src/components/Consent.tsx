import { useEffect, useState } from 'react'
import { FEATURES } from '@/content/site'
import { wurzel } from '@/lib/pfade'
import { ladeAnalytics, liesEinwilligung, loescheEinwilligung, schreibEinwilligung } from '@/lib/consent'

/**
 * ═══════════════════════════════════════════════════════════════════
 *  EINWILLIGUNG FÜR STATISTIK-COOKIES
 * ═══════════════════════════════════════════════════════════════════
 * Erscheint nur, wenn Google Analytics konfiguriert ist. Cloudflare Web Analytics
 * ist cookielos und braucht keine Einwilligung – steht aber in der Datenschutzerklärung.
 *
 * Umgesetzte Anforderungen:
 *  - § 25 TDDDG: Einwilligung VOR dem Setzen von Cookies. Das Google-Skript wird
 *    erst nach dem Klick geladen, nicht vorher eingebunden und blockiert.
 *  - Ablehnen so einfach wie Zustimmen: gleich große Knöpfe, keine Vorauswahl,
 *    kein Dark Pattern.
 *  - Jederzeit widerrufbar: jedes Element mit data-consent-reset öffnet es erneut.
 *  - Keine Werbesignale: Google Signals und Ad-Personalisierung sind abgeschaltet.
 */

// Speicher und Lader teilen sich Studio und statische Seiten (lib/consent.ts).
const lies = liesEinwilligung
const schreib = schreibEinwilligung

export function Consent() {
  const gaId = FEATURES.gaId
  // Startzustand direkt aus dem Speicher ableiten, nicht per Effekt nachziehen:
  // sonst blitzt das Banner bei bereits getroffener Entscheidung kurz auf.
  const [offen, setOffen] = useState(() => (gaId ? lies() === null : false))

  useEffect(() => {
    if (!gaId) return
    if (lies() === 'granted') ladeAnalytics(gaId)

    const aufWiderruf = (ev: MouseEvent) => {
      const ziel = (ev.target as HTMLElement | null)?.closest('[data-consent-reset]')
      if (!ziel) return
      ev.preventDefault()
      loescheEinwilligung()
      setOffen(true)
    }
    document.addEventListener('click', aufWiderruf)
    return () => document.removeEventListener('click', aufWiderruf)
  }, [gaId])

  if (!gaId || !offen) return null

  const entscheide = (wert: 'granted' | 'denied') => {
    schreib(wert)
    setOffen(false)
    if (wert === 'granted') ladeAnalytics(gaId)
  }

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.10)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p id="consent-title" className="text-sm font-semibold text-ink">Darf ich messen, welche Seiten benutzt werden?</p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
            Dafür würde ich Google Analytics einsetzen, das Cookies benötigt. Es hilft mir zu sehen, was nützlich ist,
            für die Nutzung dieser Seite ist es nicht erforderlich. Werbe-Zielgruppen werden ausdrücklich nicht gebildet.
            Deine Daten und Tabellen im Studio sind davon nie betroffen, die verlassen das Gerät ohnehin nicht.
            Details in der <a href={wurzel('datenschutz.html')} className="underline hover:text-ink">Datenschutzerklärung</a>.
          </p>
        </div>
        <div className="flex flex-none gap-2">
          <button type="button" onClick={() => entscheide('denied')} className="btn-ghost flex-1 sm:flex-none">Nein danke</button>
          <button type="button" onClick={() => entscheide('granted')} className="btn-primary flex-1 sm:flex-none">Einverstanden</button>
        </div>
      </div>
    </div>
  )
}
