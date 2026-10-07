/**
 * ═══════════════════════════════════════════════════════════════════
 *  EINWILLIGUNG FÜR STATISTIK-COOKIES – gemeinsame Bausteine
 * ═══════════════════════════════════════════════════════════════════
 * Das Studio (React, components/Consent.tsx) und die statischen Seiten (article.ts) nutzen
 * denselben Speicherschlüssel und denselben Lader. Eine Entscheidung gilt damit auf der ganzen
 * Seite, egal wo sie getroffen wurde.
 *
 *  - § 25 TDDDG: Das Google-Skript wird erst nach dem Klick geladen, nicht vorher eingebunden.
 *  - Ablehnen so einfach wie Zustimmen, keine Vorauswahl.
 *  - Widerruf: jedes Element mit data-consent-reset öffnet die Auswahl erneut.
 *  - Keine Werbesignale: Google Signals und Ad-Personalisierung sind abgeschaltet.
 */

export const CONSENT_KEY = 'crs-consent-statistik'

declare global {
  interface Window { dataLayer?: unknown[]; __crsGa?: boolean }
}

export const liesEinwilligung = () => { try { return localStorage.getItem(CONSENT_KEY) } catch { return null } }
export const schreibEinwilligung = (v: string) => { try { localStorage.setItem(CONSENT_KEY, v) } catch { /* Speicher gesperrt */ } }
export const loescheEinwilligung = () => { try { localStorage.removeItem(CONSENT_KEY) } catch { /* ignorieren */ } }

export function ladeAnalytics(gaId: string) {
  if (window.__crsGa) return
  window.__crsGa = true
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(s)
  window.dataLayer = window.dataLayer || []
  // gtag erwartet das arguments-Objekt, kein Array – sonst verwirft gtag.js die Einträge.
  // eslint-disable-next-line prefer-rest-params
  const gtag = function (..._args: unknown[]) { window.dataLayer!.push(arguments) }
  gtag('js', new Date())
  gtag('config', gaId, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false })
}

/**
 * Für die statischen Seiten: Banner ohne Framework. `datenschutz` ist der relative Pfad zur
 * Datenschutzerklärung. Ohne Messkennung passiert gar nichts – kein Banner, kein Skript.
 */
export function starteEinwilligung(gaId: string, datenschutz: string) {
  if (!gaId) return
  let banner: HTMLElement | null = null

  const schliessen = () => { banner?.remove(); banner = null }
  const entscheide = (wert: 'granted' | 'denied') => {
    schreibEinwilligung(wert)
    schliessen()
    if (wert === 'granted') ladeAnalytics(gaId)
  }
  const zeigen = () => {
    if (banner) return
    banner = document.createElement('div')
    banner.className = 'einwilligung'
    banner.setAttribute('role', 'dialog')
    banner.setAttribute('aria-modal', 'false')
    banner.setAttribute('aria-labelledby', 'einwilligung-titel')
    banner.innerHTML = `<div class="wrap">
        <div class="text">
          <p id="einwilligung-titel"><strong>Darf ich messen, welche Seiten benutzt werden?</strong></p>
          <p>Dafür würde ich Google Analytics einsetzen, das Cookies benötigt. Es hilft mir zu sehen, was nützlich ist,
          für die Nutzung dieser Seite ist es nicht erforderlich. Werbe-Zielgruppen werden ausdrücklich nicht gebildet.
          Details in der <a href="${datenschutz}">Datenschutzerklärung</a>.</p>
        </div>
        <div class="wahl">
          <button type="button" class="knopf zweit" data-wahl="denied">Nein danke</button>
          <button type="button" class="knopf" data-wahl="granted">Einverstanden</button>
        </div>
      </div>`
    banner.addEventListener('click', (ev) => {
      const wahl = (ev.target as HTMLElement).closest<HTMLElement>('[data-wahl]')?.dataset.wahl
      if (wahl === 'granted' || wahl === 'denied') entscheide(wahl)
    })
    document.body.appendChild(banner)
  }

  const stand = liesEinwilligung()
  if (stand === 'granted') ladeAnalytics(gaId)
  else if (stand === null) zeigen()

  document.addEventListener('click', (ev) => {
    if (!(ev.target as HTMLElement | null)?.closest('[data-consent-reset]')) return
    ev.preventDefault()
    loescheEinwilligung()
    zeigen()
  })
}
