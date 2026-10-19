import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { freigegebeneDatensaetze } from './src/content/freigabe-regel.ts'
import type { SeitenProfil } from './src/content/profil.ts'
import type { SampleDataset } from './src/lib/data/types.ts'
import type { RoadmapPost } from '@site/content/roadmap.ts'

// Welche Seite gebaut wird (docs/ARCHITEKTUR.md). Alles Seitenspezifische kommt aus sites/<SITE>/:
// Profil (Texte, Domain, Navigation), Inhalte, Datensätze und der Ordner public/.
const SITE = process.env.SITE || 'tiermedizin'
const SITE_DIR = resolve(import.meta.dirname, 'sites', SITE)
const seite = (rel: string) => resolve(SITE_DIR, rel)
const ladeSeite = (rel: string) => import(pathToFileURL(seite(rel)).href)
const PROFIL: SeitenProfil = (await ladeSeite('profil.ts')).default
const { SAMPLES } = (await ladeSeite('samples/index.ts')) as { SAMPLES: SampleDataset[] }
const { POSTS } = (await ladeSeite('content/roadmap.ts')) as { POSTS: RoadmapPost[] }

// Markenname aus einer einzigen Quelle – die Rechtsseiten, Artikel, Oberfläche und diese Datei lesen alle legal.json.
const MARKE: string = JSON.parse(readFileSync(seite('content/legal.json'), 'utf8')).siteName
const FREIGABE: { beispieleErstNachVeroeffentlichung: boolean; datensaetzeOhnePost?: string[] } = JSON.parse(readFileSync(seite('content/freigabe.json'), 'utf8'))

// BASE_PATH wird im GitHub-Actions-Workflow auf "/<repo-name>/" gesetzt.
// Lokal bleibt es "/".
const base = process.env.BASE_PATH ?? '/'

/**
 * Artikel zur Post-Reihe, die scripts/build-artikel.mjs vor dem Build erzeugt hat. Nur was dort
 * freigegeben ist, liegt als Datei in beitrag/ – Entwürfe in beitrag/entwurf/ werden nie gebaut.
 */
interface Beitrag { post: number; slug: string; titel: string; beschreibung: string; frage: string; stand: string; geaendert?: string; live: boolean }
const BEITRAEGE: Beitrag[] = (JSON.parse(readFileSync(seite('content/artikel-index.json'), 'utf8')) as Beitrag[])
  .filter((b) => b.live && existsSync(`beitrag/${b.slug}.html`))

/** Bereich „Datenformat“: Hauptseite und Unterseiten je Diagrammart, ebenfalls von scripts/build-artikel.mjs erzeugt. */
interface DatenformatSeite { slug: string; pfad: string; titel: string; menue: string; beschreibung: string; frage: string; stand: string; bereit: boolean }
const DATENFORMAT: DatenformatSeite[] = existsSync(seite('content/datenformat-index.json'))
  ? (JSON.parse(readFileSync(seite('content/datenformat-index.json'), 'utf8')) as DatenformatSeite[])
    .filter((d) => d.bereit && existsSync(`datenformat/${d.slug === 'index' ? 'index' : d.slug}.html`))
  : []

/**
 * Trägt optionale Integrationen statisch in die ausgelieferte index.html ein.
 * Statisch, nicht zur Laufzeit: Die Search Console liest das Meta-Tag aus dem HTML,
 * und der Cloudflare-Beacon soll ohne Umweg über React geladen werden.
 * Ohne gesetzte Variable wird nichts eingefügt.
 */
/** Kopfzeile: nur Navigation. Rechtliches steht im Fuß – so erwarten es Leser, und der Kopf bleibt kurz. */
// Dasselbe Zeichen wie im Studio (Wordmark in src/components/ui.tsx), damit Magazin und Werkzeug als eine Seite erkennbar sind.
const ZEICHEN = `<svg class="zeichen" width="26" height="26" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="7" fill="var(--brand-primary)"/><rect x="6" y="7" width="16" height="3.2" rx="1.6" fill="#fff"/><rect x="6" y="12.4" width="11" height="3.2" rx="1.6" fill="var(--brand-accent)"/><rect x="6" y="17.8" width="7" height="3.2" rx="1.6" fill="#fff" opacity=".75"/></svg>`
function rahmenKopf(hoch: string, seitePfad = '') {
  // Der Bereich, in dem die Seite liegt, wird markiert – Leser sehen, wo sie sind.
  const aktiv = (bereich: string) => (seitePfad.startsWith(bereich) ? ' aria-current="page"' : '')
  // Die Marke führt zur Startseite, dem Magazin. Das Studio steht als letzter Punkt, umrandet statt
  // gefüllt: erreichbar, aber nicht der erste Weg. Der Redaktionsplan fehlt auf dem Telefon (Klasse
  // „breit“), damit die Navigation in eine Zeile passt; er steht im Fuß jeder Seite.
  return `<header class="site">
      <div class="wrap">
        <a class="marke" href="${hoch}">${ZEICHEN}<span>${MARKE}</span></a>
        <nav aria-label="Hauptnavigation">
          ${PROFIL.navigation(hoch, aktiv)}
        </nav>
      </div>
    </header>`
}
function rahmenFuss(hoch: string, cookieWahl: boolean) {
  return `<footer class="seite">
      <div class="wrap">
        <p><strong>${MARKE}</strong> · ${PROFIL.fussText}</p>
        <p>
          ${PROFIL.fussLinks(hoch)}
        </p>
        <p>${PROFIL.schwester}</p>
        <p class="recht"><a href="${hoch}ueber-das-projekt.html">Über das Projekt</a> · <a href="${hoch}impressum.html">Impressum</a> · <a href="${hoch}datenschutz.html">Datenschutz</a>${cookieWahl ? ' · <button type="button" data-consent-reset>Cookie-Auswahl</button>' : ''}</p>
      </div>
    </footer>`
}

function integrationen(env: Record<string, string>) {
  return {
    name: 'crs-integrationen',
    transformIndexHtml(html: string, ctx: { path?: string; filename?: string }) {
      html = html.replaceAll('%SITE_NAME%', MARKE)
      html = html.replaceAll('%SITE_THEMA%', PROFIL.thema)
      html = html.replaceAll('%BASE%', base)
      // Farbrichtung und Browserfarbe der Seite; die Vorlagen tragen die der Tiermedizin.
      html = html.replace('data-brand="klar"', `data-brand="${PROFIL.marke}"`).replace('<meta name="theme-color" content="#0f3b3d" />', `<meta name="theme-color" content="${PROFIL.themeColor}" />`)
      // Kopf und Fuß aller statischen Seiten aus einer Quelle. Die Seiten tragen nur Platzhalter;
      // die Pfade richten sich nach der Ordnertiefe, die 404-Seite bekommt absolute Pfade, weil
      // GitHub Pages sie unter jeder beliebigen Adresse ausliefert.
      if (html.includes('<!--rahmen:')) {
        const seitePfad = (ctx.path ?? '/').replace(/^\/+/, '').replace(/(^|\/)$/, '$1index.html')
        const hoch = seitePfad === '404.html' ? base : '../'.repeat(seitePfad.split('/').length - 1) || './'
        html = html.replace('<!--rahmen:kopf-->', rahmenKopf(hoch, seitePfad)).replace('<!--rahmen:fuss-->', rahmenFuss(hoch, Boolean(env.VITE_GA_ID)))
      }
      const tags: string[] = []
      if (env.VITE_GSC_VERIFICATION) tags.push(`<meta name="google-site-verification" content="${env.VITE_GSC_VERIFICATION}" />`)
      // Canonical JE SEITE. Ein einziges Canonical für alle Seiten – der erste Wurf hier –
      // lässt jede Unterseite behaupten, sie sei die Startseite, und nimmt sie damit aus dem
      // Index. Seiten mit noindex bekommen keines, sie sollen gar nicht indexiert werden.
      const pfad = (ctx.path ?? '/').replace(/^\/+/, '').replace(/(^|\/)$/, '$1index.html')
      // Ohne Canonical: Rechtstexte und 404 (noindex) sowie die internen Rahmen für Grafik und Export.
      // Das Studio wird nur auf einer Seite indexiert (PROFIL.studioIndexieren), sonst stünde dasselbe Werkzeug doppelt im Index.
      const studioVerborgen = pfad === 'studio/index.html' && !PROFIL.studioIndexieren
      const istRecht = /^(impressum|datenschutz|404|grafik|export)\.html$/.test(pfad) || studioVerborgen
      if (studioVerborgen) tags.push('<meta name="robots" content="noindex, follow" />')
      if (env.VITE_SITE_URL && !istRecht) {
        const basis = env.VITE_SITE_URL.replace(/\/$/, '')
        // …/index.html kanonisch als Verzeichnis, damit /beitrag/ und /beitrag/index.html nicht
        // als zwei Seiten gelten.
        const voll = `${basis}/${pfad.replace(/(^|\/)index\.html$/, '$1')}`
        tags.push(`<link rel="canonical" href="${voll}" />`, `<meta property="og:url" content="${voll}" />`)
        // Ohne og:image zeigt LinkedIn beim Teilen eines Links nur eine graue Kachel. Seiten ohne
        // eigenes Bild bekommen die Standardkarte.
        if (!/property="og:image"/.test(html)) {
          tags.push(`<meta property="og:image" content="${basis}/og-standard.png" />`, `<meta property="og:image:width" content="1200" />`, `<meta property="og:image:height" content="630" />`)
          if (!/twitter:card/.test(html)) tags.push(`<meta name="twitter:card" content="summary_large_image" />`)
        }
      }
      // Cloudflare Web Analytics ist cookielos; deshalb ohne Einwilligungsschranke, aber in der Datenschutzerklärung genannt.
      if (env.VITE_CF_BEACON) tags.push(`<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${env.VITE_CF_BEACON}"}'></script>`)
      // Feed-Hinweis auf allen Seiten, sobald es Artikel gibt: Feedreader und Antwortmaschinen finden neue
      // Artikel darüber, ohne die Sitemap abzuwarten.
      if (env.VITE_SITE_URL && BEITRAEGE.length) tags.push(`<link rel="alternate" type="application/atom+xml" title="${MARKE}: neue Artikel" href="${env.VITE_SITE_URL.replace(/\/$/, '')}/feed.xml" />`)
      // Startseite: WebSite-Auszeichnung. Herausgeber ist die Person, keine Organisation – die Seite wird privat betrieben.
      if (pfad === 'index.html' && env.VITE_SITE_URL) tags.push(`<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebSite', name: MARKE, url: env.VITE_SITE_URL.replace(/\/$/, '') + '/', inLanguage: 'de-DE',
        description: PROFIL.beschreibung,
        publisher: { '@type': 'Person', name: PROFIL.autor.name, url: env.VITE_SITE_URL.replace(/\/$/, '') + '/ueber-das-projekt.html', sameAs: PROFIL.autor.sameAs, ...PROFIL.autor.extra },
      })}</script>`)
      // Studio: KI-Crawler wie GPTBot, ClaudeBot oder PerplexityBot führen kein JavaScript aus
      // und sähen sonst ein leeres <div id="root">. React ersetzt diesen Inhalt beim Start.
      if (pfad === 'studio/index.html') {
        html = html.replace('<div id="root"></div>', `<div id="root"><main style="max-width:44rem;margin:0 auto;padding:2rem 1.25rem;font-family:system-ui,sans-serif">
      <h1>Studio für animierte Diagramme</h1>
      <p>Aus einer Tabelle wird ein animiertes Diagramm als MP4: Bar Race, Line Race oder animierte Karte. Das Studio läuft komplett im Browser, die Daten verlassen das Gerät nicht.</p>
      <ul>
        <li><a href="../">${MARKE}: Startseite</a></li>
        <li><a href="${PROFIL.datenformatUrl('../')}">Datenformat: Tabellen für animierte Diagramme vorbereiten</a></li>
${BEITRAEGE.length ? `        <li><a href="../beitrag/">Alle Artikel</a></li>\n` : ''}        <li><a href="../artikel/datenherkunft.html">Woher die Zahlen kommen</a></li>
        <li><a href="../ueber-das-projekt.html">Über das Projekt</a> · <a href="../impressum.html">Impressum</a> · <a href="../datenschutz.html">Datenschutz</a></li>
      </ul>
    </main></div>`)
      }
      return tags.length ? html.replace('</head>', `  ${tags.join('\n  ')}\n  </head>`) : html
    },
    generateBundle(this: { emitFile: (f: { type: 'asset'; fileName: string; source: string }) => void }) {
      // robots.txt und sitemap.xml nur mit bekannter Adresse – eine Sitemap mit falscher Domain
      // ist schlechter als keine.
      // Je Datensatz eine eigene Datei für die eingebettete Grafik (src/grafik/Grafik.tsx): Sie lädt nur den
      // einen, den sie zeigt. Nur freigegebene, dieselbe Regel wie in der Seite und für die CSV-Dateien.
      const frei = freigegebeneDatensaetze(POSTS, FREIGABE.datensaetzeOhnePost)
      for (const s of SAMPLES) {
        if (FREIGABE.beispieleErstNachVeroeffentlichung && !frei.has(s.id)) continue
        this.emitFile({ type: 'asset', fileName: `grafik-daten/${s.id}.json`, source: JSON.stringify(s) })
      }
      const url = env.VITE_SITE_URL?.replace(/\/$/, '')
      if (!url) return
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n` })
      // llms.txt: kuratierte Übersicht für Antwortmaschinen. Der letzte Abschnitt ist der
      // wertvollste und fehlt fast überall – er nennt die Sätze, die verkürzt zitiert in die
      // Irre führen, samt fehlendem Kontext.
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: PROFIL.llms({ url, marke: MARKE, datenformat: DATENFORMAT, beitraege: BEITRAEGE }) })
      // Nur indexierbare Seiten. Impressum und Datenschutz tragen noindex und gehören deshalb
      // nicht hinein – eine Sitemap ist eine Bitte um Indexierung, beides zusammen meldet die
      // Search Console als Fehler. Hash-Routen sind keine eigenen URLs und haben hier ebenfalls
      // nichts verloren.
      // llms-full.txt: der volle Text aller Live-Artikel in einer Datei, als Markdown. Antwortmaschinen
      // bekommen so jede Zahl mit Kontext und Quelle, ohne HTML parsen oder JavaScript ausführen zu müssen.
      if (BEITRAEGE.length) {
        // Alle Artikeldateien, nicht nur die nummerierten: Auswertungen, Exkurse und Anleitungen heißen anders
        // und fehlten sonst mit leerem Text (bis 14.10.2026 sechs der fünfzehn Live-Artikel).
        const texte = readdirSync(seite('content/artikel')).filter((f) => f.endsWith('.md') && f !== 'README.md').map((f) => readFileSync(seite(`content/artikel/${f}`), 'utf8'))
        const voll = BEITRAEGE.map((b) => {
          const roh = texte.find((t) => new RegExp(`^slug: ${b.slug}$`, 'm').test(t)) ?? ''
          // Links auf Artikel, die noch nicht online sind, werden zu Text – wie im Live-Build der Seiten.
          const text = roh.replace(/^---[\s\S]*?\n---\n/, '').replace(/^::grafik .*\n/gm, '').replace(/\[([^\]]+)\]\(([a-z0-9-]+)\.html\)/g, (m, t, slug) => BEITRAEGE.some((x) => x.slug === slug) ? m : t).replace(/\]\((?!https?:)(\.\.\/)?([^)]+)\)/g, (_m, hoch, ziel) => `](${url}/${hoch ? '' : 'beitrag/'}${ziel})`)
          return `# ${b.titel}\n\nQuelle: ${url}/beitrag/${b.slug}.html · Stand ${b.stand} · ${MARKE}, ${PROFIL.autor.name}\n\n${text.trim()}\n`
        })
        this.emitFile({ type: 'asset', fileName: 'llms-full.txt', source: `# ${MARKE}: alle Artikel im Volltext\n\n> ${PROFIL.beschreibung}\n\n${voll.join('\n---\n\n')}` })
      }
      // Atom-Feed der Live-Artikel, neueste zuerst nach Stand.
      if (BEITRAEGE.length) {
        const escX = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const sortiert = [...BEITRAEGE].sort((a, b) => (b.geaendert ?? b.stand).localeCompare(a.geaendert ?? a.stand))
        this.emitFile({ type: 'asset', fileName: 'feed.xml', source: `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="de">
  <title>${escX(MARKE)}</title>
  <subtitle>${escX(PROFIL.beschreibung)}</subtitle>
  <link href="${url}/" />
  <link rel="self" href="${url}/feed.xml" />
  <id>${url}/</id>
  <updated>${sortiert[0].geaendert ?? sortiert[0].stand}T00:00:00Z</updated>
  <author><name>${escX(PROFIL.autor.name)}</name></author>
${sortiert.map((b) => `  <entry>
    <title>${escX(b.titel)}</title>
    <link href="${url}/beitrag/${b.slug}.html" />
    <id>${url}/beitrag/${b.slug}.html</id>
    <updated>${b.geaendert ?? b.stand}T00:00:00Z</updated>
    <summary>${escX(b.beschreibung)}</summary>
  </entry>`).join('\n')}
</feed>
` })
      }
      // lastmod nur, wo es ein echtes Änderungsdatum gibt. Ein Build-Datum auf jeder Seite
      // bringt Google bei, dem Feld nicht zu trauen – dann zählt es auch dort nicht, wo es stimmt.
      const neuester = BEITRAEGE.map((b) => b.geaendert ?? b.stand).sort().at(-1)
      // Handgeschriebene Seiten tragen ihr Änderungsdatum selbst (<meta name="dcterms.modified">); ohne Meta kein lastmod.
      const geaendert = (datei: string) => (readFileSync(datei, 'utf8').match(/<meta name="dcterms\.modified" content="(\d{4}-\d{2}-\d{2})"/) ?? [])[1]
      const seiten: [string, string?][] = [
        ['', neuester], ...(PROFIL.studioIndexieren ? [['studio/', geaendert('studio/index.html')] as [string, string?]] : []),
        // Handgeschriebene Seiten des Profils, „Über das Projekt“ zuerst.
        ...[...PROFIL.seiten].sort((x, y) => Number(y.pfad === 'ueber-das-projekt.html') - Number(x.pfad === 'ueber-das-projekt.html')).map((x): [string, string?] => [x.pfad, geaendert(x.pfad)]),
        ...(BEITRAEGE.length ? [['beitrag/', neuester] as [string, string?]] : []),
        ...BEITRAEGE.map((b): [string, string?] => [`beitrag/${b.slug}.html`, b.geaendert ?? b.stand]),
        ...DATENFORMAT.map((d): [string, string?] => [d.pfad, d.stand]),
      ]
      this.emitFile({
        type: 'asset', fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          seiten.map(([p, mod]) => `  <url><loc>${url}/${p}</loc>${mod ? `<lastmod>${mod}</lastmod>` : ''}</url>`).join('\n') +
          `\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
  base,
  plugins: [react(), tailwindcss(), integrationen(env)],
  // Öffentliche Dateien (Favicons, Bilder, Videos, Vorlagen) gehören zur Seite.
  publicDir: seite('public'),
  resolve: {
    alias: { '@site': SITE_DIR, '@': resolve(import.meta.dirname, 'src') },
  },
  worker: { format: 'es' },
  optimizeDeps: {
    // ffmpeg.wasm lädt seine Worker selbst; nicht vor-bündeln.
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        start: resolve(import.meta.dirname, 'index.html'),
        studio: resolve(import.meta.dirname, 'studio/index.html'),
        grafik: resolve(import.meta.dirname, 'grafik.html'),
        export: resolve(import.meta.dirname, 'export.html'),
        // Handgeschriebene Seiten aus sites/<SITE>/seiten/, von scripts/site.mjs in die Wurzel kopiert.
        ...Object.fromEntries(PROFIL.seiten.map((x) => [x.name, resolve(import.meta.dirname, x.pfad)])),
        impressum: resolve(import.meta.dirname, 'impressum.html'),
        datenschutz: resolve(import.meta.dirname, 'datenschutz.html'),
        nichtGefunden: resolve(import.meta.dirname, '404.html'),
        ...Object.fromEntries(BEITRAEGE.map((b) => [`beitrag-${b.slug}`, resolve(import.meta.dirname, `beitrag/${b.slug}.html`)])),
        ...(BEITRAEGE.length ? { beitraege: resolve(import.meta.dirname, 'beitrag/index.html') } : {}),
        ...Object.fromEntries(DATENFORMAT.map((d) => [`datenformat-${d.slug}`, resolve(import.meta.dirname, `datenformat/${d.slug}.html`)])),
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', `sites/${SITE}/**/*.test.ts`],
  },
  }
})
