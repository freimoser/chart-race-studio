import type { SeitenProfil } from './profil.ts'

/**
 * Kopfzeile aller Seiten: Zeichen, Name und Navigation aus dem Profil. Eine Quelle für die statischen Seiten
 * (vite.config.ts, rahmenKopf) und das Studio (src/App.tsx), Aussehen in src/kopf.css. Ohne „@“-Pfade, weil
 * vite.config.ts die Datei direkt lädt.
 */
export const ZEICHEN = `<svg class="zeichen" width="26" height="26" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="7" fill="var(--brand-primary)"/><rect x="6" y="7" width="16" height="3.2" rx="1.6" fill="#fff"/><rect x="6" y="12.4" width="11" height="3.2" rx="1.6" fill="var(--brand-accent)"/><rect x="6" y="17.8" width="7" height="3.2" rx="1.6" fill="#fff" opacity=".75"/></svg>`

/** Inhalt von <header class="site">. `hoch` ist der Weg zur Startseite, `aktiv` markiert den Bereich der Seite. */
export function kopfInhalt(profil: Pick<SeitenProfil, 'navigation'>, marke: string, hoch: string, aktiv: (bereich: string) => string): string {
  return `<div class="wrap">
        <a class="marke" href="${hoch}">${ZEICHEN}<span>${marke}</span></a>
        <nav aria-label="Hauptnavigation">
          ${profil.navigation(hoch, aktiv)}
        </nav>
      </div>`
}
