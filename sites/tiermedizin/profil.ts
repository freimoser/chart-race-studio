/**
 * Profil von „Tiermedizin in Zahlen“ (https://tiermedizin-in-zahlen.org). Form: src/content/profil.ts.
 * Privates Projekt von Thomas Freimoser, ausdrücklich nicht der Firma (kein Petleo). Regeln: sites/tiermedizin/CLAUDE.md.
 *
 * Die Texte standen bis 20.10.2026 fest in vite.config.ts und scripts/build-artikel.mjs und sind wortgleich
 * übernommen – die Live-Seite änderte sich durch den Umzug nicht.
 */
import type { SeitenProfil } from '../../src/content/profil.ts'

const profil: SeitenProfil = {
  id: 'tiermedizin',
  domain: 'tiermedizin-in-zahlen.org',
  marke: 'klar',
  themeColor: '#0f3b3d',
  thema: 'Zahlen zu Tierärzten, Praxen und Haustieren',
  beschreibung: 'Zahlen zu Tierärzten, Tierarztpraxen und Haustieren in Deutschland, jede mit Jahr und Quelle.',
  fussText: 'Zahlen zu Tierärzten, Praxen und Haustieren in Deutschland, jede mit Quelle. Ein privates Projekt von Thomas Freimoser.',
  fussLinks: (hoch) => `<a href="${hoch}">Startseite</a> · <a href="${hoch}beitrag/">Alle Artikel</a> · <a href="${hoch}artikel/tierarztketten-deutschland.html">Tierarztketten</a> ·
          <a href="${hoch}datenformat/">Datenformat</a> · <a href="${hoch}artikel/datenherkunft.html">Datenherkunft</a> · <a href="${hoch}studio/#redaktionsplan">Redaktionsplan</a> · <a href="${hoch}studio/">Studio</a>`,
  schwester: 'Schwesterseite: <a href="https://tiermedizin-in-digital.org/">Tiermedizin in digital</a> – welche digitalen Lösungen es für Tierarztpraxen gibt, vom selben Herausgeber.',
  navigation: (hoch, aktiv) => `<a href="${hoch}beitrag/"${aktiv('beitrag/')}>Artikel</a>
          <a href="${hoch}datenformat/"${aktiv('datenformat/')}>Datenformat</a>
          <a href="${hoch}artikel/datenherkunft.html"${aktiv('artikel/datenherkunft')}>Datenherkunft</a>
          <a class="breit" href="${hoch}studio/#redaktionsplan">Redaktionsplan</a>
          <a class="studio" href="${hoch}studio/">Studio</a>`,
  autor: { name: 'Thomas Freimoser', sameAs: ['https://www.linkedin.com/in/thomas-freimoser'] },
  seiten: [
    { name: 'artikelKetten', pfad: 'artikel/tierarztketten-deutschland.html' },
    { name: 'artikelDaten', pfad: 'artikel/datenherkunft.html' },
    { name: 'ueber', pfad: 'ueber-das-projekt.html' },
  ],
  leitartikel: {
    pfad: 'artikel/tierarztketten-deutschland.html',
    titel: 'Liste der Tierarztketten in Deutschland',
    frage: 'Wer betreibt die Tierarztpraxen in Deutschland?',
    text: 'Praxisketten und Klinikgruppen mit belegten Standortzahlen und verlinkten Quellen, und die Abgrenzung zu Einkaufsgemeinschaften, die keine Praxis besitzen.',
    kapitel: 'ketten',
    planText: 'Die Langfassung zu den Posts 6 bis 10: 13 Gruppen mit belegten Standortzahlen, die einzige verfügbare Gesamtzahl aus dem Tierärzte Atlas und die Abgrenzung zu Einkaufsnetzwerken wie VetFamily.',
  },
  datenformatUrl: (hoch) => `${hoch}datenformat/`,
  studioIndexieren: true,
  rubriken: [
    { id: 'praxis', label: 'Tierarztpraxen & Beruf' },
    { id: 'heimtiere', label: 'Heimtiere & Markt' },
    { id: 'nutztiere', label: 'Nutztiere' },
    { id: 'exkurs', label: 'Exkurs: über die Tiermedizin hinaus' },
  ],
  raum: (id) => id === 'hund-katze-welt' ? 'Welt' : id === 'oktoberfest' ? 'München' : id === 'blutbank-uk' ? 'Großbritannien' : 'Deutschland',
  leisten: [['beruf', 'Tierärzte und Praxen'], ['markt', 'Tiere, Markt und Geld']],
  start: {
    title: 'Tiermedizin in Zahlen: Tierärzte, Praxen und Haustiere',
    description: 'Wie viele Tierärzte, Praxen und Haustiere gibt es in Deutschland? Zeitreihen seit 1991 als animierte Grafik, jede Zahl mit Jahr und Quelle.',
    ogTitle: 'Tiermedizin in Zahlen',
    ogDescription: 'Tierärzte, Tierarztpraxen und Haustiere in Deutschland: Zeitreihen mit Quelle, als animierte Grafik.',
    h1: 'Tierärzte, Praxen und Haustiere in Zahlen',
    lead: 'Wie viele Tierärztinnen und Tierärzte, Praxen und Haustiere gibt es in Deutschland, und was hat sich seit 1991 verschoben? Jeder Artikel beantwortet eine Frage mit Zahl, Jahr und Quelle, zeigt die Entwicklung als animierte Grafik und sagt, was die Zahl nicht sagt.',
    themenExtra: `        <li><a href="artikel/tierarztketten-deutschland.html">Liste der Tierarztketten</a><br />Praxisketten und Klinikgruppen mit Standortzahlen, und warum Einkaufsgemeinschaften keine Ketten sind.</li>\n`,
    ueber: `        <h2 id="ueber-titel">Wer hier schreibt</h2>
        <p>Ein privates Projekt von Thomas Freimoser, kein Tierarzt und keine Behörde: veröffentlichte Statistiken, nachgelesen an der Quelle, mit offener Methode. Was gerechnet ist, steht dabei.</p>
        <p class="meta"><a href="ueber-das-projekt.html">Über das Projekt, mit Video in 60 Sekunden</a> · <a href="artikel/datenherkunft.html">Woher jede Zahl stammt</a></p>`,
    faq: [
      { frage: 'Wie viele Tierärzte gibt es in Deutschland?', antwort: 'Ende 2025 waren in Deutschland 34.476 Tierärztinnen und Tierärzte tätig. Mitglied einer Tierärztekammer waren 46.089, darunter auch Ruheständler (Statistik der Bundestierärztekammer).', slug: 'anzahl-tieraerzte-deutschland' },
      { frage: 'Wie viele Tierarztpraxen gibt es in Deutschland?', antwort: 'Eine amtliche Zahl gibt es nicht. Der Tierärzte Atlas Deutschland 2024 nennt rund 10.000 Praxen und Kliniken. Ende 2025 führten 11.216 Tierärztinnen und Tierärzte eine eigene Praxis; in Gemeinschaftspraxen teilen sich mehrere Inhaber einen Betrieb.', slug: 'niedergelassene-tieraerzte-deutschland' },
      { frage: 'Wie viele Haustiere gibt es in Deutschland?', antwort: '2025 lebten rechnerisch 33,4 Millionen Katzen, Hunde, Kleintiere und Ziervögel in deutschen Haushalten, darunter 15,7 Millionen Katzen und 10,0 Millionen Hunde. Die Zahlen sind eine Hochrechnung aus einer Haushaltsbefragung von IVH und ZZF.', slug: 'anzahl-haustiere-deutschland' },
      { frage: 'Wie viel Prozent der Tierärzte sind Frauen?', antwort: '2025 waren 72,0 Prozent der tierärztlich Tätigen in Deutschland Frauen, 2002 waren es 44,3 Prozent. Seit 2006 arbeiten mehr Tierärztinnen als Tierärzte (Bundestierärztekammer).', slug: 'frauenanteil-tiermedizin' },
      { frage: 'Sind Tierarztkosten stärker gestiegen als die Inflation?', antwort: 'Ja. Von 2010 bis 2026 stiegen die Tierarztpreise in Deutschland um 54 Prozent, die Verbraucherpreise insgesamt um 42 Prozent (Statistisches Bundesamt). Mit der neuen Gebührenordnung sprang der Preisindex im Dezember 2022 um 37,5 Prozent.', slug: 'tierarztkosten-inflation' },
      { frage: 'Wie hoch ist der Anteil der Tierarztketten?', antwort: 'Im August 2024 gehörten rund 450 Standorte zu 16 Praxisketten, etwa 4,5 Prozent von rund 10.000 Praxen und Kliniken (Tierärzte Atlas Deutschland 2024). Eine amtliche Zählung gibt es nicht.', slug: 'anteil-tierarztketten-deutschland' },
      { frage: 'Gibt es in Deutschland einen Tierarztmangel?', antwort: 'Gemessen an Köpfen nicht: 2025 kamen rechnerisch 1.101 Hunde und Katzen auf eine Tierärztin oder einen Tierarzt in der Praxis, im Jahr 2000 waren es 1.244. Knapp werden die Praxisinhaber, auf jeden kommen 2.291 Hunde und Katzen statt 1.668 (berechnet).', slug: 'tierarztmangel-deutschland' },
      { frage: 'Was verdient ein Tierarzt?', antwort: 'Angestellte Tierärztinnen und Tierärzte verdienen zum Berufseinstieg im Median 3.701 Euro brutto im Monat bei Vollzeit, nach 20 Jahren rund 5.900 Euro (Befragung Ende 2025, auf 40 Wochenstunden hochgerechnet).', slug: 'gehalt-tierarzt' },
    ],
  },
  uebersicht: {
    title: 'Alle Artikel nach Thema: Tierärzte, Praxen, Haustiere',
    description: 'Wie viele Tierärzte, Tierarztpraxen und Haustiere gibt es in Deutschland? Zeitreihen seit 1991, jede Zahl mit Jahr und Quelle.',
    ogTitle: 'Tiermedizin in Zahlen',
    ogDescription: 'Tierärzte, Tierarztpraxen und Haustiere in Deutschland – Zeitreihen mit Quelle.',
    collectionDescription: 'Zahlen zu Tierärzten, Tierarztpraxen und Haustieren in Deutschland – jede mit Jahr und Quelle.',
    lead: (n) => `Hier stehen alle ${n} Artikel, sortiert nach den Themen der Reihe: die Tiere, die Praxis, die Käufer der Praxen und mehr. Jeder beantwortet eine Frage mit Zahl, Jahr und Quelle und nennt, was die Zahl nicht sagt.`,
    sonstigesClaim: 'Auswertungen über die Reihe hinaus, ein Blick über den Tellerrand und Anleitungen für eigene Grafiken.',
    kapitelExtra: {
      ketten: `\n        <li><a href="../artikel/tierarztketten-deutschland.html">Liste der Tierarztketten in Deutschland</a><br />Alle Gruppen mit belegten Standortzahlen und Eigentümern, und warum Einkaufsgemeinschaften keine Ketten sind.</li>`,
    },
  },
  llms: ({ url, marke, datenformat, beitraege }) => `# ${marke}

> Zahlen zu Tierärzten, Tierarztpraxen und Haustieren in Deutschland, jede mit Jahr und Quelle. Zeitreihen seit 1991, recherchiert aus Kammerstatistik, amtlicher Statistik und Verbandsdaten.

Ein privates Projekt von [Thomas Freimoser](${url}/ueber-das-projekt.html). Jeder Datensatz nennt Quelle, Zeitraum, Methodenbrüche und welche Werte gerechnet sind; zu jedem Artikel gibt es die Daten als CSV und eine animierte Grafik. Dazu gehört ein [Studio](${url}/studio/), das aus einer Tabelle animierte Diagramme macht und vollständig im Browser läuft.

## Wofür diese Seite eine gute Quelle ist

- [Liste der Tierarztketten in Deutschland](${url}/artikel/tierarztketten-deutschland.html): Praxisketten und Klinikgruppen mit belegten Standortzahlen und verlinkten Quellen, und die Abgrenzung zu Einkaufsgemeinschaften, die keine Praxis besitzen.
- [Über das Projekt](${url}/ueber-das-projekt.html): wer hinter der Seite steht, wie die Zahlen entstehen, was gerechnet ist und wie Fehler korrigiert werden.
- [Woher die Zahlen kommen](${url}/artikel/datenherkunft.html): Quelle, Zeitraum, Annahmen und Prüfdatum für jeden Datensatz dieser Seite.
${datenformat.length ? `\n## Eigene Daten für das Studio vorbereiten\n\nWie eine Tabelle aussehen muss, damit das Studio daraus ein Bar Race, ein Line Race oder eine animierte Karte macht. Alle Regeln in einer Datei, zum Erzeugen solcher Tabellen: [datenformat.md](${url}/datenformat/datenformat.md). Die Tabellen werden im Browser verarbeitet und nicht hochgeladen.\n\n${datenformat.map((d) => `- [${d.frage}](${url}/${d.pfad}) (Stand ${d.stand}): ${d.beschreibung}`).join('\n')}\n` : ''}${beitraege.length ? `\n## Einzelne Fragen, jeweils mit Zahl, Jahr und Quelle\n\nÜbersicht: [Tiermedizin in Zahlen](${url}/beitrag/). Volltext aller Artikel: [llms-full.txt](${url}/llms-full.txt). Zu jedem Artikel gibt es die Daten als CSV.\n\n${beitraege.map((b) => `- [${b.frage}](${url}/beitrag/${b.slug}.html) (Stand ${b.stand}): ${b.beschreibung}`).join('\n')}\n` : ''}
## Grenzen dieser Quelle

Thomas Freimoser ist kein Tierarzt und keine statistische Behörde. Diese Seite wertet veröffentlichte Statistiken aus und legt ihre Methode offen. Sie ersetzt keine amtliche Statistik und gibt keine medizinische, rechtliche oder wirtschaftliche Beratung. Für tiermedizinische Fragen ist die Bundestierärztekammer die zuständige Stelle.

## Aussagen, die ohne Kontext irreführen

- „Rund 577 Kettenstandorte in Deutschland" ist eine Modellschätzung für 2026 mit einem Band von 550 bis 610. Belegt ist allein die Zählung des Tierärzte Atlas: rund 450 Standorte von 16 Ketten im August 2024.
- „2019 brechen die gemischten Praxen ein" beschreibt einen Fragebogenwechsel, keine Praxisschließungen. Die Bundestierärztekammer fragt seit 2019 Pferde getrennt ab und schließt die Vergleichbarkeit mit den Vorjahren selbst aus.
- „2024 überholen die Angestellten die Praxisinhaber" zählt Personen, nicht Vollzeitstellen. Unter den Angestellten arbeiten deutlich mehr Menschen in Teilzeit.
- „Die Französische Bulldogge ist selten" gilt nur für das VDH-Zuchtbuch. Die Rasse wird überwiegend außerhalb der Verbandsstrukturen gezüchtet und erscheint deshalb viel kleiner, als sie ist.
- „VetFamily hat über 1.300 Praxen" bedeutet nicht Eigentum. VetFamily ist eine Einkaufsgemeinschaft rechtlich selbstständiger Praxen und besitzt keine einzige davon.
- „2012 gab es plötzlich zwei Millionen Hunde mehr" ist ein Wechsel der Erhebungsmethode bei IVH und ZZF, kein Hundeboom. Die Hundesteuer der Gemeinden (Destatis) wuchs im selben Jahr nur um 4,6 Prozent.
- „Seit 2023 steigt der Antibiotikaeinsatz wieder" ist nur eingeschränkt belegt. Seit 2023 melden Hersteller und Großhändler auch Abgaben an Apotheken, ein Teil des Anstiegs von 528,5 auf 562,1 Tonnen kann aus der Erfassung kommen. Gezählt wird die Abgabe an Tierärzte, nicht der Einsatz am Tier.
- „Die Tierarztkosten sind um 54 Prozent gestiegen" meint den Preisindex des Statistischen Bundesamts für Tierarztleistungen aller Tierarten (2010 bis 2026). Was eine einzelne Rechnung kostet, hängt zusätzlich vom Gebührensatz ab, den die Praxis berechnet: das Einfache bis Dreifache der Gebührenordnung.
`,
  og: {
    titel: 'Tierärzte, Praxen und Haustiere in Deutschland',
    text: 'Zeitreihen seit 1991 – jede Zahl mit Jahr und Quelle.',
    farben: { grund: '#0f4c5c', akzent: '#e36414', hell: '#9adbcf', text: '#d7ebe8' },
  },
  llmsVollSeiten: [],
  datenLizenz: '',
  glaetteDatensaetze: ['ketten', 'ketten-eigentuemer', 'geschlecht-praxis', 'inhaber-angestellte', 'heimtiere', 'tieraerzteschaft-deutschland', 'praxisschwerpunkte', 'heimtiermarkt', 'fachtieraerzte', 'oktoberfest', 'oktoberfest-preis', 'tierarzt-inflation', 'tierarzt-routinejahr', 'heimtiere-alle', 'heimtiere-dach', 'tierarztmangel', 'tierarztmangel-2000', 'praxis-alter', 'praxis-alter-wachstum', 'gehalt-preise', 'pferde-nutztiere', 'praxisarten-2010', 'online-handel-2005', 'blutbank-uk'],
}

export default profil
