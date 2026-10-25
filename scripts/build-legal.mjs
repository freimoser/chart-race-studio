/*
 * Erzeugt impressum.html und datenschutz.html als statische Seiten.
 * Aufruf: node scripts/build-legal.mjs   (läuft automatisch als Teil von npm run build)
 *
 * Warum statisch und nicht als Route in der Anwendung: Im Impressum steht eine
 * ladungsfähige, oft private Anschrift. Die gehört nicht in den Suchindex. In einer
 * Single-Page-Anwendung mit Hash-Routen ist das unmöglich – dort gibt es nur ein einziges
 * HTML-Dokument, und ein noindex darauf würde die ganze Seite aus dem Index nehmen.
 * Als eigene Datei bekommt jede Rechtsseite ihr eigenes `noindex, follow`.
 *
 * § 5 DDG verlangt leicht erkennbar, unmittelbar erreichbar und ständig verfügbar.
 * Der Link im Footer erfüllt das vollständig; Auffindbarkeit über Google ist nicht gefordert.
 */
import fs from 'node:fs'
import { PROFIL, SITE, sitePfad } from './lib/site.mjs'

const L = JSON.parse(fs.readFileSync(sitePfad('content/legal.json'), 'utf8'))
const env = process.env
const ga = env.VITE_GA_ID || ''
const cf = env.VITE_CF_BEACON || ''
const hatAnschrift = Boolean(L.street && L.zip)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Abschnittsnummern zentral vergeben. Von Hand nummeriert entstehen bei bedingten
// Abschnitten doppelte Nummern, und der Text wird beim Zitieren unbrauchbar.
function nummerieren(abschnitte) {
  let n = 0
  return abschnitte.filter(Boolean).map((a) => `<h2>${++n}. ${a.titel}</h2>\n${a.inhalt}`).join('\n\n')
}

const anschrift = hatAnschrift
  ? `<p>${esc(L.operator)}<br />${L.companyName ? esc(L.companyName) + '<br />' : ''}${esc(L.street)}<br />${esc(L.zip)} ${esc(L.city)}<br />${esc(L.country)}</p>`
  : `<p class="warnung">Anschrift fehlt. Vor dem öffentlichen Betrieb in <code>sites/${SITE}/content/legal.json</code> eintragen – § 5 DDG verlangt eine ladungsfähige Anschrift. <code>npm run check:launch</code> meldet das als Blocker.</p>`

const seite = (titel, beschreibung, inhalt) => `<!doctype html>
<html lang="de" data-brand="klar">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${titel} – ${esc(L.siteName)}</title>
    <meta name="description" content="${esc(beschreibung)}" />
    <meta name="robots" content="noindex, follow" />
    <link rel="icon" href="./favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="./favicon-96.png" sizes="96x96" type="image/png" />
    <link rel="icon" href="./favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="./apple-touch-icon.png" />
    <script type="module" src="/src/article.ts"></script>
  </head>
  <body>
    <!--rahmen:kopf-->
    <main class="wrap">
      <article>
        <h1>${titel}</h1>
${inhalt}
      </article>
    </main>
    <!--rahmen:fuss-->
  </body>
</html>
`

// ---------- Impressum ----------
const impressum = nummerieren([
  { titel: 'Angaben gemäß § 5 DDG', inhalt: anschrift },
  { titel: 'Kontakt', inhalt: `<p>E-Mail: <a href="mailto:${esc(L.email)}">${esc(L.email)}</a>${L.phone ? `<br />Telefon: ${esc(L.phone)}` : ''}</p>` },
  L.vatId && { titel: 'Umsatzsteuer-Identifikationsnummer', inhalt: `<p>${esc(L.vatId)}</p>` },
  { titel: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV', inhalt: `<p>${esc(L.responsible)}${hatAnschrift ? `, ${esc(L.street)}, ${esc(L.zip)} ${esc(L.city)}` : ''}</p>` },
  { titel: 'Verbraucherstreitbeilegung', inhalt: '<p>Ich bin nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>' },
  { titel: 'Haftung für Inhalte', inhalt: '<p>Als Diensteanbieter bin ich für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Die mitgelieferten Beispieldatensätze sind mit Sorgfalt recherchiert und mit Quelle sowie Dateninfo versehen; sie ersetzen keine amtliche Statistik. Lücken, Methodenbrüche und berechnete Werte sind je Datensatz offengelegt.</p>' },
  { titel: 'Haftung für Links', inhalt: '<p>Diese Seite verlinkt auf externe Quellen, auf deren Inhalte ich keinen Einfluss habe. Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar.</p>' },
  { titel: 'Urheberrecht', inhalt: '<p>Der Programmcode steht unter der MIT-Lizenz. Die Diagramm-Animation basiert auf <a href="https://github.com/hatemhosny/racing-bars" target="_blank" rel="noreferrer">racing-bars</a> (MIT). Die Rechte an den zitierten Statistiken liegen bei den jeweils genannten Herausgebern.</p>' },
])

// ---------- Datenschutz ----------
// Stand der Datenschutzerklärung. Bei jeder inhaltlichen Änderung der Texte unten neu setzen.
const STAND = '26. Oktober 2026'
// Übermittlung in die USA: Angemessenheitsbeschluss zum EU-US Data Privacy Framework. Nur für Empfänger nennen,
// deren Zertifizierung belegt ist (GitHub, Google, Cloudflare: jeweils eigene Datenschutzerklärung, geprüft 26.10.2026).
const dpf = (wer) => `${wer} ist nach dem EU-US Data Privacy Framework zertifiziert. Eine Übermittlung in die USA stützt sich deshalb auf den Angemessenheitsbeschluss der EU-Kommission vom 10. Juli 2023 (Art. 45 DSGVO).`

const messung = []
if (cf) messung.push(`<p><strong>Cloudflare Web Analytics</strong> (Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA) misst Seitenaufrufe ohne Cookies und ohne geräteübergreifende Wiedererkennung. Es werden keine Profile gebildet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes Interesse ist, zu sehen, welche Seiten gelesen werden. Weil dabei keine Informationen auf deinem Gerät gespeichert oder ausgelesen werden, ist keine Einwilligung nach § 25 TDDDG erforderlich. ${dpf('Cloudflare')}</p>`)
if (ga) messung.push(`<p><strong>Google Analytics 4</strong> (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) wird ausschließlich nach deiner ausdrücklichen Einwilligung geladen. Erst dann werden Cookies gesetzt: <code>_ga</code> und <code>_ga_&lt;Kennung&gt;</code>, um wiederkehrende Besuche zu unterscheiden, jeweils mit einer Laufzeit von zwei Jahren. Die IP-Adresse wird gekürzt, Google Signals und die Personalisierung von Werbung sind abgeschaltet. Google speichert die Ereignisdaten höchstens 14 Monate. Dabei können Daten an die Google LLC in den USA übermittelt werden; ${dpf('Google LLC').replace(/^Google LLC ist/, 'sie ist')}</p>
<p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO in Verbindung mit § 25 Abs. 1 TDDDG. Du kannst deine Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen: <button type="button" data-consent-reset>Auswahl erneut treffen</button>. Ohne Einwilligung funktioniert die Seite vollständig.</p>`)
if (!messung.length) messung.push('<p>Es findet keine Reichweitenmessung statt. Es sind keine Analyse-Skripte eingebunden und es werden keine Cookies zu Statistikzwecken gesetzt.</p>')

// Lokaler Speicher: jeder Eintrag, den die Seite selbst schreibt. Neue Schlüssel hier ergänzen.
const speicher = [
  ['<code>chart-race-studio</code>', 'Einstellungen des Studios, auch eingegebene Texte wie Titel, Untertitel, Quellenangabe und Wasserzeichen', 'bis du ihn löschst'],
  ['<code>crs-consent-statistik</code>', 'deine Entscheidung zur Statistik, nur wenn du sie triffst', 'bis du ihn löschst oder neu wählst'],
  ['<code>crs-neu-geladen</code> (Sitzungsspeicher)', 'Merker, dass die Seite nach einer neuen Version schon einmal neu geladen wurde', 'bis du den Tab schließt'],
]

const datenschutz = nummerieren([
  { titel: 'Das Wichtigste zuerst', inhalt: `<p>${esc(L.siteName)} läuft vollständig im Browser. Tabellen, die du hochlädst oder eingibst, die erzeugten Videos und deine Einstellungen verlassen dein Gerät nicht. Es gibt keinen Server, der sie entgegennimmt, und ich als Betreiber habe keinen Zugriff darauf. Die Tabelle liegt nur im Arbeitsspeicher des geöffneten Tabs und ist nach dem Neuladen weg. Was das für das Vorbereiten eigener Daten heißt, steht unter <a href="${PROFIL.datenformatUrl('')}">Datenformat</a>.</p>` },
  { titel: 'Verantwortlicher', inhalt: `<p>${esc(L.operator)}${hatAnschrift ? `, ${esc(L.street)}, ${esc(L.zip)} ${esc(L.city)}` : ''}<br />E-Mail: <a href="mailto:${esc(L.email)}">${esc(L.email)}</a></p><p>Einen Datenschutzbeauftragten gibt es nicht; er ist für diese private Seite nicht vorgeschrieben.</p>` },
  { titel: 'Aufruf der Seite', inhalt: `<p>Die Seite wird über GitHub Pages ausgeliefert (GitHub, Inc., 88 Colin P Kelly Jr Street, San Francisco, CA 94107, USA). Beim Abruf verarbeitet der Hoster technisch notwendige Zugriffsdaten wie IP-Adresse, Zeitpunkt, abgerufene Datei und User-Agent, um die Seite auszuliefern und vor Missbrauch zu schützen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes Interesse ist eine sichere, erreichbare Seite. Ich erhalte von diesen Daten keine Kopie. Wie lange GitHub sie speichert, legt GitHub fest (<a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">Datenschutzerklärung von GitHub</a>). ${dpf('GitHub')}</p>` },
  { titel: 'Speicherung im Browser', inhalt: `<p>Die Seite legt nur diese Einträge im Speicher deines Browsers ab. Nichts davon wird übertragen, und alles lässt sich jederzeit über die Browser-Einstellungen löschen. Tabellen, Bilder, Logos und Farben je Reihe werden nicht gespeichert.</p>
<table><thead><tr><th>Eintrag</th><th>Zweck</th><th>Dauer</th></tr></thead><tbody>
${speicher.map(([k, z, d]) => `<tr><td>${k}</td><td>${z}</td><td>${d}</td></tr>`).join('\n')}
</tbody></table>
<p>Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG, weil die Einträge für die von dir genutzten Funktionen unbedingt erforderlich sind, und Art. 6 Abs. 1 lit. f DSGVO. Cookies setzt die Seite selbst keine; Cookies entstehen nur, wenn du der Statistik zustimmst (siehe unten).</p>` },
  { titel: 'Schriften und Programmcode', inhalt: '<p>Schriften und Programmcode werden mit der Seite selbst ausgeliefert. Es findet keine Nachladung von Google Fonts statt.</p><p>Eine Ausnahme gibt es beim Videoexport: Beherrscht dein Browser keine eingebaute Videokodierung (WebCodecs), lädt das Studio einmalig das Programm ffmpeg.wasm vom Dienst jsDelivr (cdn.jsdelivr.net) nach. Dabei verarbeitet jsDelivr wie bei jedem Abruf technisch notwendige Verbindungsdaten, insbesondere deine IP-Adresse. Deine Tabelle, deine Bilder und das Video werden nicht übertragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO: Ohne das Programm ließe sich das Video in diesem Browser nicht erzeugen. Verantwortlich für jsDelivr ist laut dessen Datenschutzerklärung die Volentio JSD Limited, England; Hinweise unter <a href="https://www.jsdelivr.com/terms/privacy-policy" rel="noopener">jsdelivr.com/terms/privacy-policy</a>. Der Abruf kann eine Übermittlung in ein Drittland bedeuten.</p>' },
  { titel: 'Reichweitenmessung', inhalt: messung.join('\n') },
  { titel: 'Google Search Console', inhalt: '<p>Für diese Seite wird die Google Search Console genutzt. Sie verarbeitet <strong>keine</strong> Daten der Besucherinnen und Besucher: Es wird kein Skript geladen, kein Cookie gesetzt und kein Zählpixel eingebunden. Ausgewertet werden ausschließlich Daten, die bei Google ohnehin anfallen, wenn die Seite in den Suchergebnissen erscheint.</p>' },
  { titel: 'Kontakt per E-Mail', inhalt: '<p>Wenn du mir schreibst, verarbeite ich deine Adresse und den Inhalt der Nachricht, um zu antworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes Interesse ist, deine Anfrage zu beantworten. Ich lösche die Nachricht, wenn das Anliegen erledigt ist und keine gesetzliche Aufbewahrungspflicht besteht. Für den Empfang nutze ich einen E-Mail-Anbieter, der die Nachricht in meinem Auftrag speichert.</p>' },
  { titel: 'Deine Rechte', inhalt: `<p>Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Eine Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3). Eine formlose E-Mail an die oben genannte Adresse genügt.</p>
<p><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Soweit ich Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeite, kannst du aus Gründen, die sich aus deiner besonderen Situation ergeben, jederzeit widersprechen.</p>
<p>Du kannst dich außerdem bei einer Aufsichtsbehörde beschweren (Art. 77 DSGVO), etwa bei der deines Wohnorts. Für mich zuständig ist das <a href="https://www.lda.bayern.de" rel="noopener">Bayerische Landesamt für Datenschutzaufsicht</a>, Promenade 18, 91522 Ansbach.</p>` },
  { titel: 'Pflicht zur Bereitstellung und automatisierte Entscheidungen', inhalt: '<p>Du bist nicht verpflichtet, Daten bereitzustellen; die Seite funktioniert ohne Einwilligung und ohne Eingaben vollständig. Es gibt keine automatisierte Entscheidungsfindung und kein Profiling im Sinne von Art. 22 DSGVO.</p>' },
]) + `\n<p>Stand: ${STAND}</p>`

fs.writeFileSync('impressum.html', seite('Impressum', 'Anbieterkennzeichnung nach § 5 DDG und Verantwortlichkeit für die Inhalte dieser Website.', impressum))
fs.writeFileSync('datenschutz.html', seite('Datenschutzerklärung', 'Welche Daten diese Seite verarbeitet – und welche ausdrücklich nicht.', datenschutz))
console.log(`impressum.html und datenschutz.html erzeugt · Anschrift ${hatAnschrift ? 'vorhanden' : 'FEHLT'} · Messung: ${[cf && 'Cloudflare', ga && 'GA4'].filter(Boolean).join(', ') || 'keine'}`)
