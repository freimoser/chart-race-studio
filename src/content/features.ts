/**
 * Integrationen. Alles optional: Was nicht konfiguriert ist, erscheint nicht –
 * kein „wird gerade eingerichtet“, sondern schlicht nichts.
 * Gesetzt werden die Werte als Build-Variablen (.env.local lokal, Repository-Variablen in Actions).
 */
export const FEATURES = {
  /** Google Analytics 4, Messkennung „G-XXXXXXX“. Setzt Cookies → nur nach Einwilligung. */
  gaId: import.meta.env.VITE_GA_ID ?? '',
  /** Cloudflare Web Analytics, Token aus dem Dashboard. Cookielos → ohne Einwilligung, aber in der Datenschutzerklärung genannt. */
  cloudflareToken: import.meta.env.VITE_CF_BEACON ?? '',
  /** Inhalt des google-site-verification-Meta-Tags für die Search Console. */
  searchConsole: import.meta.env.VITE_GSC_VERIFICATION ?? '',
} as const
