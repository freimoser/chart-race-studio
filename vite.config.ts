import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { existsSync, readdirSync, readFileSync } from 'node:fs'

// Markenname aus einer einzigen Quelle – die Rechtsseiten, Artikel, Oberfläche und diese Datei lesen alle legal.json.
import { SAMPLES } from './src/samples/index.ts'
import { POSTS } from './src/content/roadmap.ts'
import { freigegebeneDatensaetze } from './src/content/freigabe-regel.ts'
const MARKE: string = JSON.parse(readFileSync('src/content/legal.json', 'utf8')).siteName
const FREIGABE: { beispieleErstNachVeroeffentlichung: boolean; datensaetzeOhnePost?: string[] } = JSON.parse(readFileSync('src/content/freigabe.json', 'utf8'))

// BASE_PATH wird im GitHub-Actions-Workflow auf "/<repo-name>/" gesetzt.
// Lokal bleibt es "/".
const base = process.env.BASE_PATH ?? '/'

/**
 * Artikel zur Post-Reihe, die scripts/build-artikel.mjs vor dem Build erzeugt hat. Nur was dort
 * freigegeben ist, liegt als Datei in beitrag/ – Entwürfe in beitrag/entwurf/ werden nie gebaut.
 */
interface Beitrag { post: number; slug: string; titel: string; beschreibung: string; frage: string; stand: string; live: boolean }
const BEITRAEGE: Beitrag[] = (JSON.parse(readFileSync('src/content/artikel-index.json', 'utf8')) as Beitrag[])
  .filter((b) => b.live && existsSync(`beitrag/${b.slug}.html`))

/** Bereich „Datenformat“: Hauptseite und Unterseiten je Diagrammart, ebenfalls von scripts/build-artikel.mjs erzeugt. */
interface DatenformatSeite { slug: string; pfad: string; titel: string; menue: string; beschreibung: string; frage: string; stand: string; bereit: boolean }
const DATENFORMAT: DatenformatSeite[] = existsSync('src/content/datenformat-index.json')
  ? (JSON.parse(readFileSync('src/content/datenformat-index.json', 'utf8')) as DatenformatSeite[])
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
          <a href="${hoch}beitrag/"${aktiv('beitrag/')}>Artikel</a>
          <a href="${hoch}datenformat/"${aktiv('datenformat/')}>Datenformat</a>
          <a href="${hoch}artikel/datenherkunft.html"${aktiv('artikel/datenherkunft')}>Datenherkunft</a>
          <a class="breit" href="${hoch}studio/#redaktionsplan">Redaktionsplan</a>
          <a class="studio" href="${hoch}studio/">Studio</a>
        </nav>
      </div>
    </header>`
}
function rahmenFuss(hoch: string, cookieWahl: boolean) {
  return `<footer class="seite">
      <div class="wrap">
        <p><strong>${MARKE}</strong> · Zahlen zu Tierärzten, Praxen und Haustieren in Deutschland, jede mit Quelle. Ein privates Projekt von Thomas Freimoser.</p>
        <p>
          <a href="${hoch}">Startseite</a> · <a href="${hoch}beitrag/">Alle Artikel</a> · <a href="${hoch}artikel/tierarztketten-deutschland.html">Tierarztketten</a> ·
          <a href="${hoch}datenformat/">Datenformat</a> · <a href="${hoch}artikel/datenherkunft.html">Datenherkunft</a> · <a href="${hoch}studio/#redaktionsplan">Redaktionsplan</a> · <a href="${hoch}studio/">Studio</a>
        </p>
        <p class="recht"><a href="${hoch}ueber-das-projekt.html">Über das Projekt</a> · <a href="${hoch}impressum.html">Impressum</a> · <a href="${hoch}datenschutz.html">Datenschutz</a>${cookieWahl ? ' · <button type="button" data-consent-reset>Cookie-Auswahl</button>' : ''}</p>
      </div>
    </footer>`
}

function integrationen(env: Record<string, string>) {
  return {
    name: 'crs-integrationen',
    transformIndexHtml(html: string, ctx: { path?: string; filename?: string }) {
      html = html.replaceAll('%SITE_NAME%', MARKE)
      html = html.replaceAll('%BASE%', base)
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
      const istRecht = /^(impressum|datenschutz|404|grafik|export)\.html$/.test(pfad)
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
        description: 'Zahlen zu Tierärzten, Tierarztpraxen und Haustieren in Deutschland, jede mit Jahr und Quelle.',
        publisher: { '@type': 'Person', name: 'Thomas Freimoser', url: env.VITE_SITE_URL.replace(/\/$/, '') + '/ueber-das-projekt.html', sameAs: ['https://www.linkedin.com/in/thomas-freimoser'] },
      })}</script>`)
      // Studio: KI-Crawler wie GPTBot, ClaudeBot oder PerplexityBot führen kein JavaScript aus
      // und sähen sonst ein leeres <div id="root">. React ersetzt diesen Inhalt beim Start.
      if (pfad === 'studio/index.html') {
        html = html.replace('<div id="root"></div>', `<div id="root"><main style="max-width:44rem;margin:0 auto;padding:2rem 1.25rem;font-family:system-ui,sans-serif">
      <h1>Studio für animierte Diagramme</h1>
      <p>Aus einer Tabelle wird ein animiertes Diagramm als MP4: Bar Race, Line Race oder animierte Karte. Das Studio läuft komplett im Browser, die Daten verlassen das Gerät nicht.</p>
      <ul>
        <li><a href="../">${MARKE}: Startseite</a></li>
        <li><a href="../datenformat/">Datenformat: Tabellen für animierte Diagramme vorbereiten</a></li>
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
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: `# ${MARKE}

> Zahlen zu Tierärzten, Tierarztpraxen und Haustieren in Deutschland, jede mit Jahr und Quelle. Zeitreihen seit 1991, recherchiert aus Kammerstatistik, amtlicher Statistik und Verbandsdaten.

Ein privates Projekt von [Thomas Freimoser](${url}/ueber-das-projekt.html). Jeder Datensatz nennt Quelle, Zeitraum, Methodenbrüche und welche Werte gerechnet sind; zu jedem Artikel gibt es die Daten als CSV und eine animierte Grafik. Dazu gehört ein [Studio](${url}/studio/), das aus einer Tabelle animierte Diagramme macht und vollständig im Browser läuft.

## Wofür diese Seite eine gute Quelle ist

- [Liste der Tierarztketten in Deutschland](${url}/artikel/tierarztketten-deutschland.html): Praxisketten und Klinikgruppen mit belegten Standortzahlen und verlinkten Quellen, und die Abgrenzung zu Einkaufsgemeinschaften, die keine Praxis besitzen.
- [Über das Projekt](${url}/ueber-das-projekt.html): wer hinter der Seite steht, wie die Zahlen entstehen, was gerechnet ist und wie Fehler korrigiert werden.
- [Woher die Zahlen kommen](${url}/artikel/datenherkunft.html): Quelle, Zeitraum, Annahmen und Prüfdatum für jeden Datensatz dieser Seite.
${DATENFORMAT.length ? `\n## Eigene Daten für das Studio vorbereiten\n\nWie eine Tabelle aussehen muss, damit das Studio daraus ein Bar Race, ein Line Race oder eine animierte Karte macht. Alle Regeln in einer Datei, zum Erzeugen solcher Tabellen: [datenformat.md](${url}/datenformat/datenformat.md). Die Tabellen werden im Browser verarbeitet und nicht hochgeladen.\n\n${DATENFORMAT.map((d) => `- [${d.frage}](${url}/${d.pfad}) (Stand ${d.stand}): ${d.beschreibung}`).join('\n')}\n` : ''}${BEITRAEGE.length ? `\n## Einzelne Fragen, jeweils mit Zahl, Jahr und Quelle\n\nÜbersicht: [Tiermedizin in Zahlen](${url}/beitrag/). Volltext aller Artikel: [llms-full.txt](${url}/llms-full.txt). Zu jedem Artikel gibt es die Daten als CSV.\n\n${BEITRAEGE.map((b) => `- [${b.frage}](${url}/beitrag/${b.slug}.html) (Stand ${b.stand}): ${b.beschreibung}`).join('\n')}\n` : ''}
## Grenzen dieser Quelle

Thomas Freimoser ist kein Tierarzt und keine statistische Behörde. Diese Seite wertet veröffentlichte Statistiken aus und legt ihre Methode offen. Sie ersetzt keine amtliche Statistik und gibt keine medizinische, rechtliche oder wirtschaftliche Beratung. Für tiermedizinische Fragen ist die Bundestierärztekammer die zuständige Stelle.

## Aussagen, die ohne Kontext irreführen

- „Rund 577 Kettenstandorte in Deutschland" ist eine Modellschätzung für 2026 mit einem Band von 550 bis 610. Belegt ist allein die Zählung des Tierärzte Atlas: rund 450 Standorte von 16 Ketten im August 2024.
- „2019 brechen die gemischten Praxen ein" beschreibt einen Fragebogenwechsel, keine Praxisschließungen. Die Bundestierärztekammer fragt seit 2019 Pferde getrennt ab und schließt die Vergleichbarkeit mit den Vorjahren selbst aus.
- „2024 überholen die Angestellten die Praxisinhaber" zählt Personen, nicht Vollzeitstellen. Unter den Angestellten arbeiten deutlich mehr Menschen in Teilzeit.
- „Die Französische Bulldogge ist selten" gilt nur für das VDH-Zuchtbuch. Die Rasse wird überwiegend außerhalb der Verbandsstrukturen gezüchtet und erscheint deshalb viel kleiner, als sie ist.
- „VetFamily hat über 1.300 Praxen" bedeutet nicht Eigentum. VetFamily ist eine Einkaufsgemeinschaft rechtlich selbstständiger Praxen und besitzt keine einzige davon.
` })
      // Nur indexierbare Seiten. Impressum und Datenschutz tragen noindex und gehören deshalb
      // nicht hinein – eine Sitemap ist eine Bitte um Indexierung, beides zusammen meldet die
      // Search Console als Fehler. Hash-Routen sind keine eigenen URLs und haben hier ebenfalls
      // nichts verloren.
      // llms-full.txt: der volle Text aller Live-Artikel in einer Datei, als Markdown. Antwortmaschinen
      // bekommen so jede Zahl mit Kontext und Quelle, ohne HTML parsen oder JavaScript ausführen zu müssen.
      if (BEITRAEGE.length) {
        const texte = readdirSync('src/content/artikel').filter((f) => /^\d+-.*\.md$/.test(f)).map((f) => readFileSync(`src/content/artikel/${f}`, 'utf8'))
        const voll = BEITRAEGE.map((b) => {
          const roh = texte.find((t) => new RegExp(`^slug: ${b.slug}$`, 'm').test(t)) ?? ''
          // Links auf Artikel, die noch nicht online sind, werden zu Text – wie im Live-Build der Seiten.
          const text = roh.replace(/^---[\s\S]*?\n---\n/, '').replace(/\[([^\]]+)\]\(([a-z0-9-]+)\.html\)/g, (m, t, slug) => BEITRAEGE.some((x) => x.slug === slug) ? m : t).replace(/\]\((?!https?:)(\.\.\/)?([^)]+)\)/g, (_m, hoch, ziel) => `](${url}/${hoch ? '' : 'beitrag/'}${ziel})`)
          return `# ${b.titel}\n\nQuelle: ${url}/beitrag/${b.slug}.html · Stand ${b.stand} · ${MARKE}, Thomas Freimoser\n\n${text.trim()}\n`
        })
        this.emitFile({ type: 'asset', fileName: 'llms-full.txt', source: `# ${MARKE}: alle Artikel im Volltext\n\n> Zahlen zu Tierärzten, Tierarztpraxen und Haustieren in Deutschland, jede mit Jahr und Quelle.\n\n${voll.join('\n---\n\n')}` })
      }
      // Atom-Feed der Live-Artikel, neueste zuerst nach Stand.
      if (BEITRAEGE.length) {
        const escX = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const sortiert = [...BEITRAEGE].sort((a, b) => b.stand.localeCompare(a.stand))
        this.emitFile({ type: 'asset', fileName: 'feed.xml', source: `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="de">
  <title>${escX(MARKE)}</title>
  <subtitle>Zahlen zu Tierärzten, Tierarztpraxen und Haustieren in Deutschland, jede mit Jahr und Quelle.</subtitle>
  <link href="${url}/" />
  <link rel="self" href="${url}/feed.xml" />
  <id>${url}/</id>
  <updated>${sortiert[0].stand}T00:00:00Z</updated>
  <author><name>Thomas Freimoser</name></author>
${sortiert.map((b) => `  <entry>
    <title>${escX(b.titel)}</title>
    <link href="${url}/beitrag/${b.slug}.html" />
    <id>${url}/beitrag/${b.slug}.html</id>
    <updated>${b.stand}T00:00:00Z</updated>
    <summary>${escX(b.beschreibung)}</summary>
  </entry>`).join('\n')}
</feed>
` })
      }
      // lastmod nur, wo es ein echtes Änderungsdatum gibt. Ein Build-Datum auf jeder Seite
      // bringt Google bei, dem Feld nicht zu trauen – dann zählt es auch dort nicht, wo es stimmt.
      const neuester = BEITRAEGE.map((b) => b.stand).sort().at(-1)
      // Handgeschriebene Seiten tragen ihr Änderungsdatum selbst (<meta name="dcterms.modified">); ohne Meta kein lastmod.
      const geaendert = (datei: string) => (readFileSync(datei, 'utf8').match(/<meta name="dcterms\.modified" content="(\d{4}-\d{2}-\d{2})"/) ?? [])[1]
      const seiten: [string, string?][] = [
        ['', neuester], ['studio/', geaendert('studio/index.html')], ['ueber-das-projekt.html', geaendert('ueber-das-projekt.html')],
        ['artikel/tierarztketten-deutschland.html', geaendert('artikel/tierarztketten-deutschland.html')], ['artikel/datenherkunft.html', geaendert('artikel/datenherkunft.html')],
        ...(BEITRAEGE.length ? [['beitrag/', neuester] as [string, string?]] : []),
        ...BEITRAEGE.map((b): [string, string?] => [`beitrag/${b.slug}.html`, b.stand]),
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
  resolve: {
    alias: { '@': resolve(import.meta.dirname, 'src') },
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
        artikelKetten: resolve(import.meta.dirname, 'artikel/tierarztketten-deutschland.html'),
        artikelDaten: resolve(import.meta.dirname, 'artikel/datenherkunft.html'),
        ueber: resolve(import.meta.dirname, 'ueber-das-projekt.html'),
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
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
  }
})
