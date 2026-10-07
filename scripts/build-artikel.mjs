/*
 * Baut aus den Entwürfen in src/content/artikel/*.md die Artikelseiten zur Post-Reihe.
 *
 *   node scripts/build-artikel.mjs              Live-Seiten nach beitrag/ (läuft im Build)
 *   node scripts/build-artikel.mjs --entwuerfe  zusätzlich ALLE Entwürfe nach beitrag/entwurf/,
 *                                               mit noindex, zum Gegenlesen unter `npm run dev`
 *
 * Eine Seite geht nur online, wenn alle drei Bedingungen erfüllt sind:
 *   1. freigabe.json: artikelLive ist true
 *   2. der zugehörige Post steht im Redaktionsplan auf „veroeffentlicht“
 *   3. der Entwurf trägt `bereit: ja`
 * Fehlt eine davon, entsteht keine Datei – nicht versteckt, sondern gar nicht gebaut.
 *
 * Beide Ausgabeordner sind erzeugt und stehen in .gitignore. Die Übersicht
 * src/content/artikel-index.json wird dagegen eingecheckt, weil Oberfläche und Vite-Konfiguration
 * sie importieren.
 *
 * Format der Entwürfe: siehe src/content/artikel/README.md.
 */
import fs from 'node:fs'
import path from 'node:path'
import { ARCS, POSTS, visiteVon } from '../src/content/roadmap.ts'
import * as DATEN from '../src/samples/data.ts'

const QUELLE = 'src/content/artikel'
const ZIEL = 'beitrag'
const ENTWURF = path.join(ZIEL, 'entwurf')
const mitEntwuerfen = process.argv.includes('--entwuerfe')

const FREIGABE = JSON.parse(fs.readFileSync('src/content/freigabe.json', 'utf8'))
const L = JSON.parse(fs.readFileSync('src/content/legal.json', 'utf8'))
const BASIS = (process.env.VITE_SITE_URL ?? '').replace(/\/$/, '')
const DATEN_ZIEL = 'public/daten'

// Metadaten der Beispiel-Datensätze. src/samples/index.ts ist über den Pfad-Alias @/ nicht direkt
// aus Node importierbar; die wenigen Felder, die hier gebraucht werden, stehen dort je Datensatz
// in einer eigenen Zeile und lassen sich verlässlich auslesen.
const DATENSAETZE = Object.fromEntries(fs.readFileSync('src/samples/index.ts', 'utf8').split('    id: ').slice(1).map((b) => {
  const g = (re) => (b.match(re) ?? [])[1]
  const id = g(/^'(.*?)'/)
  const quelle = DATEN[g(/headers: (\w+)\.headers/)]
  return [id, { id, titel: g(/title: '(.*?)',\n/), untertitel: g(/subtitle: '(.*?)',\n/), quelle: g(/source: '(.*?)',\n/), quelleUrl: g(/sourceUrl: '(.*?)'/), einheit: g(/unit: '(.*?)'/), daten: quelle }]
}))

// Ein Post gilt ab „naechster“ als freigabefähig: Der Artikel muss online sein, wenn der
// LinkedIn-Beitrag erscheint, sonst läuft der Link im ersten Kommentar ins Leere.
const FREIGABEFAEHIG = new Set(['veroeffentlicht', 'naechster'])

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const datumDe = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })

// ---------- Entwürfe lesen ----------
function lesen(datei) {
  const roh = fs.readFileSync(path.join(QUELLE, datei), 'utf8')
  const m = roh.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) throw new Error(`${datei}: Kopfbereich zwischen --- fehlt`)
  const kopf = {}
  for (const zeile of m[1].split('\n')) {
    const k = zeile.match(/^(\w+):\s*(.*)$/)
    if (k) kopf[k[1]] = k[2].trim()
  }
  // Anleitungen gehören zu keinem Post: Sie erklären das Werkzeug und sind jederzeit gültig.
  // Exkurse (etwa das Oktoberfest als Beispiel für ein neues Diagramm) gehören ebenfalls zu keinem Post.
  const anleitung = kopf.art === 'anleitung' || kopf.art === 'exkurs' || kopf.art === 'auswertung'
  for (const pflicht of [...(anleitung ? [] : ['post']), 'slug', 'titel', 'beschreibung', 'frage', 'stand', 'bereit']) {
    if (!kopf[pflicht]) throw new Error(`${datei}: Feld „${pflicht}“ fehlt`)
  }
  if (!/^[a-z0-9-]+$/.test(kopf.slug)) throw new Error(`${datei}: slug nur aus a–z, 0–9 und Bindestrich`)
  return { datei, ...kopf, anleitung, post: anleitung ? undefined : Number(kopf.post), bereit: kopf.bereit === 'ja', text: m[2].trim() }
}

// ---------- Kleines Markdown ----------
// Bewusst minimal und ohne Abhängigkeit: Absätze, ## und ###, Listen, Tabellen, Zitate,
// **fett**, *kursiv* und [Links](url). Mehr brauchen diese Artikel nicht, und jedes weitere
// Konstrukt wäre eine Stelle, an der ein Entwurf anders aussieht als gedacht.
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
      const extern = /^https?:/.test(u)
      return `<a href="${u}"${extern ? ' rel="noopener"' : ''}>${t}</a>`
    })
}

function markdown(text) {
  // Codeblöcke (```) zuerst herausnehmen: Sie dürfen Leerzeilen enthalten, an denen sonst Absätze getrennt würden.
  const codes = []
  text = text.replace(/^```(\w*)\n([\s\S]*?)\n```$/gm, (_, sprache, code) => `\u0000CODE${codes.push({ sprache, code }) - 1}\u0000`)
  const bloecke = text.split(/\n{2,}/)
  const html = []
  const faq = []
  let inFaq = false
  for (let i = 0; i < bloecke.length; i++) {
    const b = bloecke[i].trim()
    if (!b) continue
    const code = b.match(/^\u0000CODE(\d+)\u0000$/)
    if (code) {
      const { sprache, code: inhalt } = codes[Number(code[1])]
      html.push(`<pre${sprache ? ` data-sprache="${esc(sprache)}"` : ''}><code>${esc(inhalt)}</code></pre>`)
      continue
    }
    // Weitere Grafik mitten im Text: eine Zeile „::grafik <Datensatz> [Diagrammart]“. Hier nur ein
    // Platzhalter; seite() setzt die Grafik ein, weil erst dort Pfadtiefe, CSV und Freigabe bekannt sind.
    const weitere = b.match(/^::grafik ([a-z0-9-]+)(?: (bar|line|map|combo))?$/)
    if (weitere) { html.push(`\u0000GRAFIK ${weitere[1]} ${weitere[2] ?? ''}\u0000`); continue }
    const zeilen = b.split('\n')
    const bild = b.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/)
    if (bild) {
      // Bilder liegen unter public/beitrag/…; Breite und Höhe aus dem PNG-Kopf, damit die Seite
      // beim Laden nicht springt.
      const [, alt, src] = bild
      let masse = ''
      try {
        const kopfBytes = fs.readFileSync(path.join('public', ZIEL, src)).subarray(16, 24)
        masse = ` width="${kopfBytes.readUInt32BE(0) / 2}" height="${kopfBytes.readUInt32BE(4) / 2}"`
      } catch { throw new Error(`Bild ${src} fehlt unter public/${ZIEL}/`) }
      html.push(`<figure><img src="${src}" alt="${esc(alt)}"${masse} loading="lazy" /><figcaption>${inline(alt)}</figcaption></figure>`)
      continue
    }
    if (b.startsWith('## ')) {
      const t = b.slice(3).trim()
      inFaq = /^häufige fragen/i.test(t)
      html.push(`<h2>${inline(t)}</h2>`)
    } else if (b.startsWith('### ')) {
      const t = b.slice(4).trim()
      html.push(`<h3>${inline(t)}</h3>`)
      // Die Antwort ist der nächste Block. Sie geht als FAQPage in die strukturierten Daten.
      if (inFaq && bloecke[i + 1]) faq.push({ frage: t, antwort: bloecke[i + 1].trim().replace(/\*\*|\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') })
    } else if (zeilen.every((z) => z.startsWith('> '))) {
      html.push(`<blockquote>${inline(zeilen.map((z) => z.slice(2)).join(' '))}</blockquote>`)
    } else if (zeilen.every((z) => /^- /.test(z))) {
      html.push(`<ul>\n${zeilen.map((z) => `  <li>${inline(z.slice(2))}</li>`).join('\n')}\n</ul>`)
    } else if (zeilen.every((z) => /^\d+\. /.test(z))) {
      html.push(`<ol>\n${zeilen.map((z) => `  <li>${inline(z.replace(/^\d+\. /, ''))}</li>`).join('\n')}\n</ol>`)
    } else if (zeilen.length >= 2 && zeilen.every((z) => z.startsWith('|')) && /^\|[\s:|-]+\|$/.test(zeilen[1])) {
      const zellen = (z) => z.replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
      const rechts = zellen(zeilen[1]).map((c) => c.endsWith(':'))
      const td = (c, k, tag) => `<${tag}${rechts[k] ? ' class="num"' : ''}>${inline(c)}</${tag}>`
      html.push(`<div class="scroll"><table>\n<thead><tr>${zellen(zeilen[0]).map((c, k) => td(c, k, 'th')).join('')}</tr></thead>\n<tbody>\n` +
        zeilen.slice(2).map((z) => `<tr>${zellen(z).map((c, k) => td(c, k, 'td')).join('')}</tr>`).join('\n') + `\n</tbody></table></div>`)
    } else {
      html.push(`<p>${inline(zeilen.join(' '))}</p>`)
    }
  }
  return { html: html.join('\n\n'), faq }
}

// Rückt HTML für die Lesbarkeit des Quelltexts ein, aber nie innerhalb von <pre>: Dort wäre jede
// Einrückung sichtbar.
function einruecken(html, tiefe = '        ') {
  let inPre = false
  return html.split('\n').map((z) => {
    const zeile = inPre ? z : tiefe + z
    if (/<pre[\s>]/.test(z)) inPre = true
    if (/<\/pre>/.test(z)) inPre = false
    return zeile
  }).join('\n')
}

// ---------- Animierte Grafik ----------
// Die Grafik zum Artikel, direkt unter dem ersten Absatz: Wer den Artikel öffnet, sieht nach drei, vier
// Sätzen die Entwicklung laufen. Sie läuft in einem iframe (grafik.html, src/grafik/), das erst lädt,
// wenn es in die Nähe des Bildschirms kommt. Ohne JavaScript bleibt der Rahmen leer, der Text trägt
// trotzdem alles. Das Format wählt die Grafik selbst: unter 560 Pixel Breite hochkant 4:5, sonst 16:9.
//
// Im Kopf eines Entwurfs überschreibt `grafik: <Datensatz> [bar|line|map]` den Datensatz des Posts,
// `grafik: keine` lässt sie weg.
// Live zeigt die Grafik nur freigegebene Datensätze (src/content/freigabe.ts). Eine Seite, die immer
// online ist, darf deshalb nur auf einen solchen zeigen – sonst stünde dort „noch nicht freigegeben“.
const freigegeben = (id) => (FREIGABE.datensaetzeOhnePost ?? []).includes(id) || POSTS.some((p) => p.sampleId === id && (FREIGABEFAEHIG.has(p.status) || p.vorabOnline))
function grafikVon(kopfwert, sampleId, { mussFrei = false } = {}) {
  if (kopfwert === 'keine') return null
  const [id, art] = (kopfwert || sampleId || '').split(/\s+/)
  if (!id) return null
  if (!DATENSAETZE[id]) throw new Error(`grafik: Datensatz „${id}“ gibt es nicht in src/samples/index.ts`)
  if (mussFrei && !freigegeben(id)) throw new Error(`grafik: Datensatz „${id}“ ist live noch nicht freigegeben`)
  if (art && !['bar', 'line', 'map'].includes(art)) throw new Error(`grafik: Diagrammart „${art}“ unbekannt (bar, line oder map)`)
  return { id, art }
}
function grafikFigur(g, { tiefe, csv, hinweis }) {
  const ds = DATENSAETZE[g.id]
  return `<figure class="grafik">
          <div class="grafik-rahmen"><iframe src="${tiefe}grafik.html?d=${g.id}${g.art ? `&amp;art=${g.art}` : ''}" title="Animierte Grafik: ${esc(ds.titel)}" loading="lazy"></iframe></div>
          <figcaption><span>${hinweis ?? esc(ds.titel)}${csv ? ` · <a href="${csv}" download>Daten als CSV</a>` : ''}</span><a class="knopf" href="${tiefe}studio/?beispiel=${g.id}">Im Studio öffnen</a></figcaption>
        </figure>`
}

// ---------- Seite ----------
function seite(a, { entwurf, alle }) {
  // Beiträge ohne Post (Anleitung, Exkurs) können im Kopf `linkedin_datum` und `linkedin` tragen, wenn sie
  // auf LinkedIn erschienen sind; dann zeigen sie Datum und Link wie ein Post aus dem Redaktionsplan.
  const post = a.anleitung ? { nr: 0, title: a.titel, refs: [], publishedOn: a.linkedin_datum, linkedInUrl: a.linkedin } : POSTS.find((p) => p.nr === a.post)
  if (!post) throw new Error(`${a.datei}: Post ${a.post} steht nicht im Redaktionsplan`)
  const tiefe = entwurf ? '../../' : '../'
  const { html, faq } = markdown(a.text)
  // Der erste Absatz ist die Antwort. Er steht als Lead direkt unter der Überschrift –
  // Antwortmaschinen und Vorschauen zitieren am ehesten den ersten Absatz.
  const [ersterBlock, ...restBloecke] = html.split('\n\n')
  if (!ersterBlock.startsWith('<p>')) throw new Error(`${a.datei}: Der Text muss mit einem Absatz beginnen, der die Frage beantwortet`)
  const lead = ersterBlock.replace(/^<p>/, '<p class="lead">').replace(/<a href="([a-z0-9-]+)\.html">(.*?)<\/a>/g, (m, slug, text) =>
    entwurf || alle.some((x) => x.slug === slug && x.live) ? m : text)
  // Relative Links im Text sind für beitrag/ geschrieben; die Vorschau liegt eine Ebene tiefer.
  // Links auf Artikel, die noch nicht online sind, werden im Live-Build zu reinem Text – sonst
  // führen sie ins Leere. Sobald der Zielartikel freigegeben ist, erscheint der Link von selbst.
  const entlinken = (h) => entwurf ? h : h.replace(/<a href="([a-z0-9-]+)\.html">(.*?)<\/a>/g, (m, slug, text) =>
    alle.some((x) => x.slug === slug && x.live) ? m : text)
  const rumpf = entlinken(restBloecke.join('\n\n').replace(/href="\.\.\//g, `href="${tiefe}`))
    .replace(/\u0000GRAFIK ([a-z0-9-]+) (\w*)\u0000/g, (_, id, art) => grafikFigur(grafikVon(`${id} ${art}`.trim(), undefined, { mussFrei: a.live }), { tiefe, csv: !entwurf && DATENSAETZE[id]?.daten ? `${tiefe}daten/${id}.csv` : '' }))
    .replace(/<img src="(?!https?:|\.\.\/)/g, entwurf ? '<img src="../' : '<img src="')
    .replace(/href="(vorlagen\/)/g, `href="${tiefe}$1`)

  // Verweise auf andere Posts: auf deren Artikel, wenn es ihn gibt, sonst auf den Redaktionsplan.
  const verweise = (post.refs ?? []).map((r) => {
    const ziel = alle.find((x) => x.post === r && (entwurf || x.live))
    const titel = POSTS.find((p) => p.nr === r)?.title ?? `Post ${r}`
    return ziel ? `<a href="${ziel.slug}.html">${esc(titel)}</a>` : `<a href="${tiefe}studio/#redaktionsplan">${esc(titel)}</a>`
  })

  const basis = BASIS
  const ogBild = fs.existsSync(path.join('public', ZIEL, 'og', `${a.slug}.png`)) && basis ? `${basis}/${ZIEL}/og/${a.slug}.png` : ''
  // Datensatz des Posts; bei Beiträgen ohne Post (Anleitung, Exkurs) der der Grafik.
  const dsId = post.sampleId ?? grafikVon(a.grafik)?.id
  const ds = dsId ? DATENSAETZE[dsId] : undefined
  const csv = ds?.daten && !entwurf ? `${tiefe}daten/${ds.id}.csv` : ''
  const jsonld = [{
    '@context': 'https://schema.org', '@type': 'Article',
    headline: a.titel, description: a.beschreibung, inLanguage: 'de-DE',
    author: { '@type': 'Person', name: L.operator },
    ...(a.veroeffentlicht ? { datePublished: a.veroeffentlicht } : {}),
    dateModified: a.stand,
    ...(ogBild ? { image: ogBild } : {}),
    ...(basis ? { mainEntityOfPage: `${basis}/${ZIEL}/${a.slug}.html` } : {}),
    about: a.frage,
  }]
  // Der Datensatz als eigenes Objekt: macht ihn für die Google-Datensatzsuche auffindbar und
  // gibt Antwortmaschinen eine zitierfähige Quelle mit Zeitraum und Herkunft.
  if (ds?.daten) {
    const jahre = ds.daten.rows.map((r) => String(r[0])).filter((j) => /^\d{4}$/.test(j))
    jsonld.push({
      '@context': 'https://schema.org', '@type': 'Dataset',
      name: ds.titel, description: `${ds.untertitel ?? ds.titel}. ${a.beschreibung}`,
      creator: { '@type': 'Person', name: L.operator },
      ...(jahre.length ? { temporalCoverage: `${jahre[0]}/${jahre.at(-1)}` } : {}),
      spatialCoverage: ds.id === 'hund-katze-welt' ? 'Welt' : ds.id === 'oktoberfest' ? 'München' : 'Deutschland',
      variableMeasured: ds.daten.headers.slice(1),
      ...(ds.quelleUrl ? { isBasedOn: ds.quelleUrl } : {}),
      ...(ds.quelle ? { citation: ds.quelle } : {}),
      dateModified: a.stand,
      ...(basis ? { url: `${basis}/${ZIEL}/${a.slug}.html`, distribution: { '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${basis}/daten/${ds.id}.csv` } } : {}),
    })
  }
  // Anleitung: die Schritte als HowTo, aus den ###-Überschriften unter „Schritt für Schritt“.
  if (a.anleitung) {
    const teil = a.text.split(/\n## /).find((t) => /^Schritt für Schritt/.test(t)) ?? ''
    const schritte = [...teil.matchAll(/^### (.+)$/gm)].map((m) => m[1].replace(/^\d+\.\s*/, ''))
    if (schritte.length) jsonld.push({
      '@context': 'https://schema.org', '@type': 'HowTo', name: a.titel, description: a.beschreibung, inLanguage: 'de-DE',
      tool: { '@type': 'HowToTool', name: `Studio von ${L.siteName}` },
      step: schritte.map((name, i) => ({ '@type': 'HowToStep', position: i + 1, name })),
    })
  }
  if (faq.length) {
    jsonld.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.frage, acceptedAnswer: { '@type': 'Answer', text: f.antwort } })),
    })
  }

  const g = grafikVon(a.grafik, post.sampleId, { mussFrei: a.live })
  const bild = g ? grafikFigur(g, { tiefe, csv })
    : fs.existsSync(path.join('public', ZIEL, `${a.slug}.png`))
      ? `<figure><img src="${tiefe}${ZIEL}/${a.slug}.png" alt="${esc(post.title)}" loading="lazy" /></figure>` : ''

  return `<!doctype html>
<html lang="de" data-brand="klar">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(a.titel.length + L.siteName.length + 3 <= 60 ? `${a.titel} | ${L.siteName}` : a.titel)}</title>
    <meta name="description" content="${esc(a.beschreibung)}" />
${entwurf ? '    <meta name="robots" content="noindex, nofollow" />\n' : ''}    <link rel="icon" href="${tiefe}favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="${tiefe}favicon-96.png" sizes="96x96" type="image/png" />
    <link rel="icon" href="${tiefe}favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="${tiefe}apple-touch-icon.png" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${esc(a.titel)}" />
    <meta property="og:description" content="${esc(a.beschreibung)}" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:site_name" content="${esc(L.siteName)}" />
${ogBild ? `    <meta property="og:image" content="${ogBild}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta name="twitter:card" content="summary_large_image" />\n` : ''}${a.veroeffentlicht ? `    <meta property="article:published_time" content="${a.veroeffentlicht}" />\n` : ''}    <meta property="article:modified_time" content="${a.stand}" />
    <script type="application/ld+json">${JSON.stringify(jsonld.length === 1 ? jsonld[0] : jsonld)}</script>
    <script type="module" src="/src/article.ts"></script>
  </head>
  <body>
${entwurf ? `    <p class="entwurf">Entwurf · ${a.bereit ? 'bereit zur Freigabe' : 'noch nicht bereit'} · nicht öffentlich</p>\n` : ''}    <!--rahmen:kopf-->

    <main class="wrap">
      <article>
        <p class="meta">${a.art === 'exkurs' ? 'Exkurs · Neu im Studio' : a.art === 'auswertung' ? 'Sonderauswertung' : a.anleitung ? 'Anleitung' : `Visite ${visiteVon(post.nr)} · Post ${post.nr}: ${esc(post.title)}`}</p>
        <h1>${esc(a.titel)}</h1>
        ${lead}
        <p class="meta">Stand ${datumDe(a.stand)} · von ${esc(L.operator)}${post.publishedOn ? ` · auf LinkedIn seit ${datumDe(post.publishedOn)}` : ''}</p>
        ${bild}
${einruecken(rumpf)}
        <aside class="kasten">
${csv ? `          <p><a href="${csv}" download>Daten als CSV herunterladen</a> · ${esc(ds.titel)}</p>\n` : ''}${post.sampleId ? `          <p><a href="${tiefe}studio/?beispiel=${post.sampleId}">Datensatz im Studio öffnen und selbst animieren</a></p>\n` : ''}${post.linkedInUrl ? `          <p><a href="${post.linkedInUrl}" rel="noopener">Zum Beitrag auf LinkedIn</a></p>\n` : ''}${verweise.length ? `          <p>Baut auf: ${verweise.join(' · ')}</p>\n` : ''}          <p><a href="${tiefe}artikel/datenherkunft.html">Woher die Zahlen kommen</a> · <a href="${entwurf ? '../' : './'}">Alle Artikel von ${esc(L.siteName)}</a></p>
        </aside>
      </article>
    </main>
    <!--rahmen:fuss-->
  </body>
</html>
`
}

// ---------- Übersicht aller Live-Artikel ----------
// Die Drehscheibe für interne Links: Jeder Artikel ist von hier aus einen Klick entfernt, und
// Crawler ohne JavaScript finden die Reihe, ohne die Single-Page-Anwendung ausführen zu müssen.
function uebersicht(live) {
  const nachKapitel = [
    ...ARCS.map((arc) => ({ arc, liste: live.filter((a) => POSTS.find((p) => p.nr === a.post)?.arc === arc.id) })),
    { arc: { label: 'Sonderauswertungen, Exkurse und Anleitungen' }, liste: live.filter((a) => a.anleitung) },
  ].filter((k) => k.liste.length)
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: 'Tiermedizin in Zahlen', inLanguage: 'de-DE',
    description: 'Zahlen zu Tierärzten, Tierarztpraxen und Haustieren in Deutschland – jede mit Jahr und Quelle.',
    author: { '@type': 'Person', name: L.operator },
    mainEntity: { '@type': 'ItemList', itemListElement: live.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.titel, ...(BASIS ? { url: `${BASIS}/${ZIEL}/${a.slug}.html` } : {}) })) },
  }
  return `<!doctype html>
<html lang="de" data-brand="klar">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Alle Artikel: Tierärzte, Praxen und Haustiere in Zahlen</title>
    <meta name="description" content="Wie viele Tierärzte, Tierarztpraxen und Haustiere gibt es in Deutschland? Zeitreihen seit 1991, jede Zahl mit Jahr und Quelle." />
    <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="../favicon-96.png" sizes="96x96" type="image/png" />
    <link rel="icon" href="../favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="../apple-touch-icon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Tiermedizin in Zahlen" />
    <meta property="og:description" content="Tierärzte, Tierarztpraxen und Haustiere in Deutschland – Zeitreihen mit Quelle." />
    <meta property="og:locale" content="de_DE" />
    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
    <script type="module" src="/src/article.ts"></script>
  </head>
  <body>
    <!--rahmen:kopf-->
    <main class="wrap">
      <p class="meta">Alle Artikel</p>
      <h1>Tierärzte, Praxen und Haustiere in Zahlen</h1>
      <p class="lead">Wie viele Tierärzte, Tierarztpraxen und Haustiere gibt es in Deutschland, und wie hat sich das seit 1991 verändert? Jeder Artikel beantwortet eine Frage mit Zahl, Jahr und Quelle und nennt, was die Zahl nicht sagt.</p>
${nachKapitel.map((k) => `      <h2>${esc(k.arc.label)}</h2>
      <ul class="liste">
${k.liste.map((a) => `        <li><a href="${a.slug}.html">${esc(a.frage)}</a><br />${esc(a.beschreibung)}</li>`).join('\n')}
      </ul>`).join('\n')}
      <p class="meta">Dazu: <a href="../artikel/tierarztketten-deutschland.html">Wer betreibt die Tierarztpraxen in Deutschland?</a> · <a href="../artikel/datenherkunft.html">Woher die Zahlen kommen</a> · <a href="../studio/#redaktionsplan">Redaktionsplan</a></p>
    </main>
    <!--rahmen:fuss-->
  </body>
</html>
`
}

// ---------- Startseite ----------
// Die Wurzel der Seite ist das Magazin, nicht das Werkzeug: Die meisten kommen über einen LinkedIn-Beitrag
// und mit dem Telefon. Oben der neueste Artikel mit laufender Grafik, darunter alle Artikel, das Studio
// als Angebot für alle, die selbst animieren wollen. Alte Links auf das Studio (/?beispiel=…,
// /#redaktionsplan) leitet ein kleines Skript im Kopf nach /studio/ weiter; GitHub Pages kann keine
// Weiterleitung auf dem Server.
function startseite(live) {
  const artikel = live.filter((a) => !a.anleitung || a.art === 'exkurs' || a.art === 'auswertung').sort((x, y) => (y.veroeffentlicht ?? '').localeCompare(x.veroeffentlicht ?? '') || (y.post ?? 0) - (x.post ?? 0))
  const neu = artikel.find((a) => grafikVon(a.grafik, POSTS.find((p) => p.nr === a.post)?.sampleId))
  const gNeu = neu && grafikVon(neu.grafik, POSTS.find((p) => p.nr === neu.post)?.sampleId)
  const csvNeu = gNeu && DATENSAETZE[gNeu.id]?.daten ? `daten/${gNeu.id}.csv` : ''
  const anleitungen = live.filter((a) => a.anleitung && a.art === 'anleitung')
  return `<!doctype html>
<html lang="de" data-brand="klar">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>(function () { var s = location.search, h = location.hash; if (/[?&]beispiel=/.test(s) || /^#(redaktionsplan|post-)/.test(h)) location.replace('studio/' + s + h) })()</script>
    <title>Tiermedizin in Zahlen: Tierärzte, Praxen und Haustiere</title>
    <meta name="description" content="Wie viele Tierärzte, Praxen und Haustiere gibt es in Deutschland? Zeitreihen seit 1991 als animierte Grafik, jede Zahl mit Jahr und Quelle." />
    <meta name="theme-color" content="#0f3b3d" />
    <link rel="icon" href="favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="favicon-96.png" sizes="96x96" type="image/png" />
    <link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="apple-touch-icon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Tiermedizin in Zahlen" />
    <meta property="og:description" content="Tierärzte, Tierarztpraxen und Haustiere in Deutschland: Zeitreihen mit Quelle, als animierte Grafik." />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:site_name" content="${esc(L.siteName)}" />
    <script type="module" src="/src/article.ts"></script>
  </head>
  <body>
    <!--rahmen:kopf-->
    <main class="wrap">
      <h1>Tierärzte, Praxen und Haustiere in Zahlen</h1>
      <p class="lead">Wie viele Tierärztinnen und Tierärzte, Praxen und Haustiere gibt es in Deutschland, und was hat sich seit 1991 verschoben? Jeder Artikel beantwortet eine Frage mit Zahl, Jahr und Quelle, zeigt die Entwicklung als animierte Grafik und sagt, was die Zahl nicht sagt.</p>
${neu ? `      <section class="neu" aria-labelledby="neu-titel">
        <p class="meta">Neu${neu.veroeffentlicht ? ` · ${datumDe(neu.veroeffentlicht)}` : ''}</p>
        <h2 id="neu-titel"><a href="beitrag/${neu.slug}.html">${esc(neu.titel)}</a></h2>
        <p>${esc(neu.beschreibung)}</p>
        ${grafikFigur(gNeu, { tiefe: '', csv: csvNeu })}
        <p><a href="beitrag/${neu.slug}.html">Artikel lesen</a></p>
      </section>
` : ''}${artikel.length ? `      <h2>Alle Artikel</h2>
      <ul class="liste">
${artikel.filter((a) => a !== neu).map((a) => `        <li><a href="beitrag/${a.slug}.html">${esc(a.frage)}</a><br />${esc(a.beschreibung)}</li>`).join('\n')}
        <li><a href="artikel/tierarztketten-deutschland.html">Wer betreibt die Tierarztpraxen in Deutschland?</a><br />Praxisketten und Klinikgruppen mit Standortzahlen, und warum Einkaufsgemeinschaften keine Ketten sind.</li>
      </ul>
      <p class="meta"><a href="beitrag/">Alle Artikel nach Thema</a> · <a href="studio/#redaktionsplan">Was als Nächstes kommt</a></p>
` : ''}      <section class="selbst" aria-labelledby="selbst-titel">
        <h2 id="selbst-titel">Eigene Daten animieren</h2>
        <p>Jede Grafik dieser Seite entsteht im Studio: eine Tabelle hinein, ein MP4-Video heraus, als Bar Race, Line Race oder animierte Karte. Es läuft vollständig im Browser, die Daten verlassen das Gerät nicht. Am bequemsten am Rechner.</p>
        <p class="knoepfe"><a class="knopf" href="studio/">Studio öffnen</a><a class="knopf zweit" href="datenformat/">So muss die Tabelle aussehen</a></p>
${anleitungen.length ? `        <p class="meta">Anleitung: ${anleitungen.map((a) => `<a href="beitrag/${a.slug}.html">${esc(a.titel)}</a>`).join(' · ')}</p>\n` : ''}      </section>
      <p class="meta">Woher jede Zahl stammt, mit Quelle, Zeitraum und Lücken: <a href="artikel/datenherkunft.html">Datenherkunft</a></p>
    </main>
    <!--rahmen:fuss-->
  </body>
</html>
`
}

// ---------- Lauf ----------
const dateien = fs.existsSync(QUELLE) ? fs.readdirSync(QUELLE).filter((f) => f.endsWith('.md') && f !== 'README.md').sort() : []
const artikel = dateien.map(lesen)

const doppelt = (feld) => artikel.map((a) => a[feld]).filter((v, i, xs) => v !== undefined && xs.indexOf(v) !== i)
if (doppelt('slug').length) throw new Error(`Doppelter slug: ${doppelt('slug').join(', ')}`)
if (doppelt('post').length) throw new Error(`Zwei Entwürfe für Post ${doppelt('post').join(', ')}`)

for (const a of artikel) {
  const post = POSTS.find((p) => p.nr === a.post)
  a.live = Boolean(FREIGABE.artikelLive && (a.anleitung || FREIGABEFAEHIG.has(post?.status) || post?.vorabOnline) && a.bereit)
  // Veröffentlichungsdatum des Artikels: das LinkedIn-Datum, sonst der Stand beim Freischalten.
  a.veroeffentlicht = post?.publishedOn ?? a.linkedin_datum ?? (a.live ? a.stand : undefined)
}

fs.rmSync(ZIEL, { recursive: true, force: true })
const live = artikel.filter((a) => a.live)
if (live.length || mitEntwuerfen) fs.mkdirSync(ZIEL, { recursive: true })
for (const a of live) fs.writeFileSync(path.join(ZIEL, `${a.slug}.html`), seite(a, { entwurf: false, alle: artikel }))
if (live.length) fs.writeFileSync(path.join(ZIEL, 'index.html'), uebersicht(live))
// Die Startseite entsteht immer, auch ohne Live-Artikel: Sie ist die Wurzel der Seite.
fs.writeFileSync('index.html', startseite(live))

// CSV je Datensatz eines Live-Artikels. Nur freigegebene – dieselbe Regel wie für die Seiten.
fs.rmSync(DATEN_ZIEL, { recursive: true, force: true })
// Dazu die Datensätze weiterer Grafiken im Text (::grafik), auch sie bekommen ihren CSV-Download.
const imText = (a) => [...a.text.matchAll(/^::grafik ([a-z0-9-]+)/gm)].map((m) => m[1])
const csvIds = [...new Set(live.flatMap((a) => [POSTS.find((p) => p.nr === a.post)?.sampleId ?? grafikVon(a.grafik)?.id, ...imText(a)]).filter((id) => id && DATENSAETZE[id]?.daten))]
if (csvIds.length) fs.mkdirSync(DATEN_ZIEL, { recursive: true })
const zelle = (v) => v == null ? '' : /[",;\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v)
for (const id of csvIds) {
  const { daten, quelle } = DATENSAETZE[id]
  // BOM und Semikolon nicht: Komma-CSV mit Punkt als Dezimaltrenner ist das, was Werkzeuge und
  // Antwortmaschinen zuverlässig lesen. Die Quelle steht in der letzten Zeile als Kommentar.
  const zeilen = [daten.headers, ...daten.rows].map((r) => r.map(zelle).join(','))
  fs.writeFileSync(path.join(DATEN_ZIEL, `${id}.csv`), zeilen.join('\n') + `\n# ${quelle ?? ''}\n`)
}
if (mitEntwuerfen) {
  fs.mkdirSync(ENTWURF, { recursive: true })
  for (const a of artikel) fs.writeFileSync(path.join(ENTWURF, `${a.slug}.html`), seite(a, { entwurf: true, alle: artikel }))
  fs.writeFileSync(path.join(ENTWURF, 'index.html'), `<!doctype html><html lang="de"><head><meta charset="UTF-8" /><meta name="robots" content="noindex, nofollow" /><title>Entwürfe</title><script type="module" src="/src/article.ts"></script></head><body><main class="wrap"><h1>Artikelentwürfe</h1><ol>\n${
    artikel.map((a) => `<li><a href="${a.slug}.html">${a.anleitung ? `Anleitung: ${esc(a.titel)}` : `Post ${a.post}: ${esc(POSTS.find((p) => p.nr === a.post)?.title ?? a.slug)}`}</a>${a.bereit ? '' : ' (noch nicht bereit)'}</li>`).join('\n')}\n</ol></main></body></html>\n`)
}

// Übersicht für Oberfläche, Sitemap und llms.txt. Deterministisch sortiert, damit sie nur bei
// echten Änderungen im Diff auftaucht.
const index = artikel.map((a) => ({ post: a.post, ...(a.anleitung ? { art: a.art } : {}), slug: a.slug, titel: a.titel, beschreibung: a.beschreibung, frage: a.frage, stand: a.stand, bereit: a.bereit, live: a.live }))
fs.writeFileSync('src/content/artikel-index.json', JSON.stringify(index, null, 2) + '\n')

console.log(`Artikel: ${artikel.length} Entwürfe, ${artikel.filter((a) => a.bereit).length} bereit, ${live.length} online${FREIGABE.artikelLive ? '' : ' (Freigabe aus)'}${mitEntwuerfen ? `, Vorschau unter /${ENTWURF}/` : ''}`)

// ---------- Bereich „Datenformat“ ----------
// Eine Hauptseite und je Diagrammart eine Unterseite: wie eine Tabelle aussehen muss, damit das Studio
// sie liest. Gehört zu keinem Post und ist immer online, sobald `bereit: ja`. Jede Seite gibt es
// zusätzlich als Markdown unter /datenformat/<slug>.md, alle zusammen in /datenformat/datenformat.md –
// für KI-Assistenten, die daraus Datensätze erzeugen sollen.
const DF_QUELLE = 'src/content/datenformat'
const DF_ZIEL = 'datenformat'
const DF_MD = 'public/datenformat'

function dfLesen(datei) {
  const roh = fs.readFileSync(path.join(DF_QUELLE, datei), 'utf8')
  const m = roh.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) throw new Error(`${datei}: Kopfbereich zwischen --- fehlt`)
  const kopf = {}
  for (const zeile of m[1].split('\n')) { const k = zeile.match(/^(\w+):\s*(.*)$/); if (k) kopf[k[1]] = k[2].trim() }
  for (const pflicht of ['slug', 'titel', 'menue', 'beschreibung', 'frage', 'stand', 'reihenfolge', 'bereit']) {
    if (!kopf[pflicht]) throw new Error(`${datei}: Feld „${pflicht}“ fehlt`)
  }
  return { datei, ...kopf, reihenfolge: Number(kopf.reihenfolge), bereit: kopf.bereit === 'ja', text: m[2].trim() }
}

const dfDatei = (s) => s.slug === 'index' ? 'index.html' : `${s.slug}.html`
const dfPfad = (s) => s.slug === 'index' ? `${DF_ZIEL}/` : `${DF_ZIEL}/${s.slug}.html`

function dfSeite(s, alle) {
  const { html, faq } = markdown(s.text)
  const [ersterBlock, ...rest] = html.split('\n\n')
  if (!ersterBlock.startsWith('<p>')) throw new Error(`${s.datei}: Der Text muss mit einem Absatz beginnen, der die Frage beantwortet`)
  const haupt = alle.find((x) => x.slug === 'index')
  const url = BASIS ? `${BASIS}/${dfPfad(s)}` : ''
  const jsonld = [{
    '@context': 'https://schema.org', '@type': 'TechArticle',
    headline: s.titel, description: s.beschreibung, inLanguage: 'de-DE',
    author: { '@type': 'Person', name: L.operator }, dateModified: s.stand, about: s.frage,
    ...(url ? { mainEntityOfPage: url } : {}),
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: L.siteName, ...(BASIS ? { item: `${BASIS}/` } : {}) },
      { '@type': 'ListItem', position: 2, name: haupt?.menue ?? 'Datenformat', ...(BASIS ? { item: `${BASIS}/${DF_ZIEL}/` } : {}) },
      ...(s.slug === 'index' ? [] : [{ '@type': 'ListItem', position: 3, name: s.menue, ...(url ? { item: url } : {}) }]),
    ],
  }]
  const teil = s.text.split(/\n## /).find((t) => /^Schritt für Schritt/.test(t)) ?? ''
  const schritte = [...teil.matchAll(/^### (.+)$/gm)].map((m) => m[1].replace(/^\d+\.\s*/, ''))
  if (schritte.length) jsonld.push({
    '@context': 'https://schema.org', '@type': 'HowTo', name: s.titel, description: s.beschreibung, inLanguage: 'de-DE',
    tool: { '@type': 'HowToTool', name: `Studio von ${L.siteName}` },
    step: schritte.map((name, i) => ({ '@type': 'HowToStep', position: i + 1, name })),
  })
  if (faq.length) jsonld.push({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.frage, acceptedAnswer: { '@type': 'Answer', text: f.antwort } })),
  })
  const nav = alle.map((x) => x.slug === s.slug
    ? `<li><strong aria-current="page">${esc(x.menue)}</strong></li>`
    : `<li><a href="${x.slug === 'index' ? './' : `${x.slug}.html`}">${esc(x.menue)}</a></li>`).join('')
  const titel = s.titel.length + L.siteName.length + 3 <= 60 ? `${s.titel} | ${L.siteName}` : s.titel
  return `<!doctype html>
<html lang="de" data-brand="klar">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(titel)}</title>
    <meta name="description" content="${esc(s.beschreibung)}" />
    <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="../favicon-96.png" sizes="96x96" type="image/png" />
    <link rel="icon" href="../favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="../apple-touch-icon.png" />
    <link rel="alternate" type="text/markdown" href="${s.slug}.md" title="Diese Seite als Markdown" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${esc(s.titel)}" />
    <meta property="og:description" content="${esc(s.beschreibung)}" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:site_name" content="${esc(L.siteName)}" />
    <meta property="article:modified_time" content="${s.stand}" />
    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
    <script type="module" src="/src/article.ts"></script>
  </head>
  <body>
    <!--rahmen:kopf-->

    <main class="wrap">
      <article>
        <p class="meta">${s.slug === 'index' ? 'Datenformat' : `<a href="./">Datenformat</a> · ${esc(s.menue)}`}</p>
        <h1>${esc(s.titel)}</h1>
        ${ersterBlock.replace(/^<p>/, '<p class="lead">')}
        <p class="meta">Stand ${datumDe(s.stand)} · Datenstandard 1.0 · von ${esc(L.operator)} · <a href="${s.slug}.md">als Markdown</a></p>
${grafikVon(s.grafik, undefined, { mussFrei: true }) ? `        ${grafikFigur(grafikVon(s.grafik), { tiefe: '../', hinweis: `So sieht das Ergebnis aus: ${esc(DATENSAETZE[grafikVon(s.grafik).id].titel)}` })}\n` : ''}        <nav class="unternav" aria-label="Datenformat"><ul>${nav}</ul></nav>
${einruecken(rest.join('\n\n'))}
        <aside class="kasten">
          <p><a href="../studio/">Zum Studio</a> · <a href="../vorlagen/vorlage-zeitreihe.xlsx">Vorlage Zeitreihe</a> · <a href="../vorlagen/vorlage-weltkarte.xlsx">Vorlage Weltkarte</a> · <a href="../vorlagen/vorlage-bundeslaender.xlsx">Vorlage Bundesländer</a></p>
          <p>Alle Regeln in einer Datei für KI-Assistenten: <a href="datenformat.md">datenformat.md</a></p>
        </aside>
      </article>
    </main>
    <!--rahmen:fuss-->
  </body>
</html>
`
}

const dfDateien = fs.existsSync(DF_QUELLE) ? fs.readdirSync(DF_QUELLE).filter((f) => f.endsWith('.md')).sort() : []
const dfSeiten = dfDateien.map(dfLesen).sort((a, b) => a.reihenfolge - b.reihenfolge)
if (dfSeiten.length && !dfSeiten.some((x) => x.slug === 'index')) throw new Error(`${DF_QUELLE}: Hauptseite mit slug „index“ fehlt`)
const dfLive = dfSeiten.filter((x) => x.bereit)
fs.rmSync(DF_ZIEL, { recursive: true, force: true })
fs.rmSync(DF_MD, { recursive: true, force: true })
if (dfLive.length) {
  fs.mkdirSync(DF_ZIEL, { recursive: true })
  fs.mkdirSync(DF_MD, { recursive: true })
  // Markdown mit absoluten Adressen: Eine KI, die die Datei einzeln bekommt, kann relative Links nicht auflösen.
  const absolut = (t) => !BASIS ? t : t
    .replace(/\]\(\.\/\)/g, `](${BASIS}/${DF_ZIEL}/)`)
    .replace(/\]\(\.\.\/([^)]*)\)/g, `](${BASIS}/$1)`)
    .replace(/\]\(([a-z0-9-]+\.(html|md))\)/g, `](${BASIS}/${DF_ZIEL}/$1)`)
  const alsMd = (x) => `# ${x.titel}\n\nQuelle: ${BASIS ? `${BASIS}/${dfPfad(x)}` : dfPfad(x)} · Stand ${x.stand} · Datenstandard 1.0 · ${L.siteName}, ${L.operator}\n\n${absolut(x.text)}\n`
  for (const x of dfLive) {
    fs.writeFileSync(path.join(DF_ZIEL, dfDatei(x)), dfSeite(x, dfLive))
    fs.writeFileSync(path.join(DF_MD, `${x.slug}.md`), alsMd(x))
  }
  fs.writeFileSync(path.join(DF_MD, 'datenformat.md'), `# Datenformat für das Studio von ${L.siteName} (Datenstandard 1.0)\n\n> Wie eine Tabelle aussehen muss, damit das Studio daraus ein Bar Race, ein Line Race oder eine animierte Karte macht. Alle Seiten des Bereichs in einer Datei, gedacht für KI-Assistenten, die solche Tabellen erzeugen.\n\n${dfLive.map(alsMd).join('\n---\n\n')}`)
}
fs.writeFileSync('src/content/datenformat-index.json', JSON.stringify(dfSeiten.map((x) => ({ slug: x.slug, pfad: dfPfad(x), titel: x.titel, menue: x.menue, beschreibung: x.beschreibung, frage: x.frage, stand: x.stand, bereit: x.bereit })), null, 2) + '\n')
console.log(`Datenformat: ${dfSeiten.length} Seiten, ${dfLive.length} online`)
