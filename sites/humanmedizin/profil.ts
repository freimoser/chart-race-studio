/**
 * Profil von „Humanmedizin in Zahlen“ (https://humanmedizin-in-zahlen.org). Form: src/content/profil.ts.
 *
 * Herausgeber ist Thomas Freimoser als Person, wie bei der Schwesterseite. Anders als dort ist der Firmenbezug
 * gewollt und steht offen auf jeder Seite: Thomas Freimoser ist Geschäftsführer der FleXChange Medical GmbH, die
 * Schnittstellen zwischen Praxissoftware und E-Health-Anwendungen anbietet. Zielgruppe sind weniger Patienten als
 * die Dienstleister der ambulanten Versorgung: PVS-Hersteller, Labore, MVZ-Betreiber, Abrechnungs- und
 * Telematik-Anbieter, Healthtech. Regeln: sites/humanmedizin/CLAUDE.md.
 */
import type { SeitenProfil } from '../../src/content/profil.ts'

const TIER = 'https://tiermedizin-in-zahlen.org'
const FLEXCHANGE = 'https://flexchange-medical.de/'

const profil: SeitenProfil = {
  id: 'humanmedizin',
  domain: 'humanmedizin-in-zahlen.org',
  marke: 'signal',
  themeColor: '#14213d',
  thema: 'Zahlen zu Arztpraxen, Praxissoftware und Gesundheits-IT',
  beschreibung: 'Zahlen zu Arztpraxen, Praxisverwaltungssystemen und Gesundheits-IT in Deutschland, jede mit Jahr und Quelle.',
  fussText: `Zahlen zu Arztpraxen, Praxissoftware und Gesundheits-IT in Deutschland, jede mit Quelle. Ein Projekt von Thomas Freimoser, Geschäftsführer der <a href="${FLEXCHANGE}">FleXChange Medical GmbH</a>.`,
  fussLinks: (hoch) => `<a href="${hoch}">Startseite</a> · <a href="${hoch}beitrag/">Alle Artikel</a> · <a href="${hoch}artikel/praxisverwaltungssysteme-deutschland.html">Praxisverwaltungssysteme</a> ·
          <a href="${hoch}artikel/datenherkunft.html">Datenherkunft</a> · <a href="${hoch}studio/#redaktionsplan">Redaktionsplan</a>`,
  schwester: `Schwesterseite: <a href="${TIER}/">Tiermedizin in Zahlen</a> – dieselbe Methode für Tierärzte, Tierarztpraxen und Haustiere, vom selben Herausgeber.`,
  navigation: (hoch, aktiv) => `<a href="${hoch}beitrag/"${aktiv('beitrag/')}>Artikel</a>
          <a href="${hoch}artikel/praxisverwaltungssysteme-deutschland.html"${aktiv('artikel/praxisverwaltungssysteme')}>Praxissoftware</a>
          <a href="${hoch}artikel/datenherkunft.html"${aktiv('artikel/datenherkunft')}>Datenherkunft</a>
          <a class="breit" href="${hoch}studio/#redaktionsplan">Redaktionsplan</a>`,
  autor: {
    name: 'Thomas Freimoser',
    sameAs: ['https://www.linkedin.com/in/thomas-freimoser', `${TIER}/ueber-das-projekt.html`],
    extra: { jobTitle: 'Geschäftsführer', worksFor: { '@type': 'Organization', name: 'FleXChange Medical GmbH', url: FLEXCHANGE, sameAs: ['https://www.linkedin.com/company/flexchange-medical'] } },
  },
  seiten: [
    { name: 'artikelPvs', pfad: 'artikel/praxisverwaltungssysteme-deutschland.html' },
    { name: 'artikelDaten', pfad: 'artikel/datenherkunft.html' },
    { name: 'ueber', pfad: 'ueber-das-projekt.html' },
  ],
  leitartikel: {
    pfad: 'artikel/praxisverwaltungssysteme-deutschland.html',
    titel: 'Praxisverwaltungssysteme in Deutschland',
    frage: 'Welche Praxissoftware nutzen Arztpraxen in Deutschland?',
    text: 'Alle Praxisverwaltungssysteme mit KBV-Zulassung, Installationen je System und Hersteller, und welche Schnittstellen jedes System nachweislich kann.',
    kapitel: 'software',
    planText: 'Die Langfassung zum Markt der Praxisverwaltungssysteme: Installationen je System und Hersteller laut KBV, getrennt nach ärztlichen und psychotherapeutischen Praxen, mit den Schnittstellen-Zulassungen je System.',
  },
  // Kein eigener Datenformat-Bereich: Die Anleitung steht einmal, auf der Schwesterseite. Zwei Kopien wären doppelter Inhalt.
  datenformatUrl: () => `${TIER}/datenformat/`,
  // Das Studio ist auf der Tiermedizin-Seite indexiert; hier dient es nur zum Öffnen der Datensätze.
  studioIndexieren: false,
  rubriken: [
    { id: 'software', label: 'Praxissoftware & Schnittstellen' },
    { id: 'vernetzung', label: 'Schnittstellen & Telematik' },
    { id: 'versorgung', label: 'Praxen & Versorgung' },
  ],
  raum: () => 'Deutschland',
  leisten: [['software', 'Praxissoftware'], ['versorgung', 'Praxen und Versorgung']],
  start: {
    title: 'Humanmedizin in Zahlen: Arztpraxen und Praxissoftware',
    description: 'Welche Praxissoftware nutzen Arztpraxen, wer liefert sie, und wie vernetzt ist die ambulante Versorgung? Zeitreihen mit Jahr und Quelle.',
    ogTitle: 'Humanmedizin in Zahlen',
    ogDescription: 'Arztpraxen, Praxissoftware und Gesundheits-IT in Deutschland: Zeitreihen mit Quelle, als animierte Grafik.',
    h1: 'Arztpraxen, Praxissoftware und Gesundheits-IT in Zahlen',
    lead: 'Welche Software steuert die Arzt- und Psychotherapiepraxen in Deutschland, wer stellt sie her, und wie gut sprechen die Systeme miteinander? Jeder Artikel beantwortet eine Frage mit Zahl, Jahr und Quelle, zeigt die Entwicklung als animierte Grafik und sagt, was die Zahl nicht sagt.',
    themenExtra: `        <li><a href="artikel/praxisverwaltungssysteme-deutschland.html">Praxisverwaltungssysteme in Deutschland</a><br />Alle Systeme mit Installationen laut KBV, nach Hersteller, mit den Schnittstellen-Zulassungen je System.</li>\n`,
    ueber: `        <h2 id="ueber-titel">Wer hier schreibt</h2>
        <p>Thomas Freimoser, Geschäftsführer der <a href="${FLEXCHANGE}">FleXChange Medical GmbH</a>. FleXChange verbindet Praxisverwaltungssysteme mit E-Health-Anwendungen, ist also selbst Teil des Marktes, über den diese Seite schreibt. Deshalb gilt hier dieselbe Regel wie auf der Schwesterseite: veröffentlichte Statistiken, nachgelesen an der Quelle, mit offener Methode. Was gerechnet ist, steht dabei.</p>
        <p class="meta"><a href="ueber-das-projekt.html">Über das Projekt und den Interessenkonflikt</a> · <a href="artikel/datenherkunft.html">Woher jede Zahl stammt</a> · <a href="${TIER}/">Tiermedizin in Zahlen</a></p>`,
  },
  uebersicht: {
    title: 'Alle Artikel nach Thema: Praxen, Praxissoftware, IT',
    description: 'Welche Praxissoftware nutzen Arztpraxen in Deutschland, und wie entwickelt sich die ambulante Versorgung? Jede Zahl mit Jahr und Quelle.',
    ogTitle: 'Humanmedizin in Zahlen',
    ogDescription: 'Arztpraxen, Praxissoftware und Gesundheits-IT in Deutschland – Zeitreihen mit Quelle.',
    collectionDescription: 'Zahlen zu Arztpraxen, Praxisverwaltungssystemen und Gesundheits-IT in Deutschland – jede mit Jahr und Quelle.',
    lead: (n) => `Hier stehen alle ${n} Artikel, sortiert nach den Themen der Reihe: die Praxissoftware, die Praxen und ihre Betreiber, die Vernetzung. Jeder beantwortet eine Frage mit Zahl, Jahr und Quelle und nennt, was die Zahl nicht sagt.`,
    sonstigesClaim: 'Auswertungen über die Reihe hinaus und Vergleiche mit der Tiermedizin.',
    kapitelExtra: {
      software: `\n        <li><a href="../artikel/praxisverwaltungssysteme-deutschland.html">Praxisverwaltungssysteme in Deutschland</a><br />Alle Systeme mit Installationen laut KBV, nach Hersteller, und welche Schnittstellen jedes System nachweislich kann.</li>`,
    },
  },
  llms: ({ url, marke, beitraege }) => `# ${marke}

> Zahlen zu Arztpraxen, Praxisverwaltungssystemen und Gesundheits-IT in Deutschland, jede mit Jahr und Quelle. Ausgewertet aus den Installationsstatistiken und Zulassungsverzeichnissen der Kassenärztlichen Bundesvereinigung, amtlicher Statistik und Herstellerangaben.

Ein Projekt von [Thomas Freimoser](${url}/ueber-das-projekt.html), Geschäftsführer der [FleXChange Medical GmbH](${FLEXCHANGE}), eines Anbieters von Schnittstellen zwischen Praxissoftware und E-Health-Anwendungen. Der Interessenkonflikt steht offen auf der Seite. Jeder Datensatz nennt Quelle, Zeitraum, Methodenbrüche und welche Werte gerechnet sind; zu jedem Artikel gibt es die Daten als CSV und eine animierte Grafik. Schwesterseite mit derselben Methode: [Tiermedizin in Zahlen](${TIER}/).

## Wofür diese Seite eine gute Quelle ist

- [Praxisverwaltungssysteme in Deutschland](${url}/artikel/praxisverwaltungssysteme-deutschland.html): alle Systeme mit Installationszahlen laut KBV, nach Hersteller zusammengefasst, getrennt nach ärztlicher und psychotherapeutischer Versorgung, mit den KBV-Zulassungen für Labordaten (LDT), eArztbrief und KIM je System.
- [Über das Projekt](${url}/ueber-das-projekt.html): wer hinter der Seite steht, welcher Interessenkonflikt besteht, wie die Zahlen entstehen und wie Fehler korrigiert werden.
- [Woher die Zahlen kommen](${url}/artikel/datenherkunft.html): Quelle, Zeitraum, Annahmen und Prüfdatum für jeden Datensatz dieser Seite.
${beitraege.length ? `\n## Einzelne Fragen, jeweils mit Zahl, Jahr und Quelle\n\nÜbersicht: [${marke}](${url}/beitrag/). Volltext aller Artikel: [llms-full.txt](${url}/llms-full.txt). Zu jedem Artikel gibt es die Daten als CSV.\n\n${beitraege.map((b) => `- [${b.frage}](${url}/beitrag/${b.slug}.html) (Stand ${b.stand}): ${b.beschreibung}`).join('\n')}\n` : ''}
## Grenzen dieser Quelle

Thomas Freimoser ist kein Arzt und keine statistische Behörde. Diese Seite wertet veröffentlichte Statistiken aus und legt ihre Methode offen. Sie ersetzt keine amtliche Statistik und gibt keine medizinische, rechtliche oder wirtschaftliche Beratung. Sie bewertet keine Praxissoftware und spricht keine Kaufempfehlung aus.

## Aussagen, die ohne Kontext irreführen

- „Elefant ist das meistinstallierte Praxisverwaltungssystem" gilt nur für die Gesamtliste der KBV. Elefant und psyprax werden fast ausschließlich in psychotherapeutischen Praxen eingesetzt; unter den ärztlichen Praxen führen andere Systeme.
- „Die KBV-Statistik zeigt Marktanteile" stimmt nur näherungsweise. Die KBV zählt Installationen nach Prüfnummer in den Abrechnungen und schreibt selbst, das sei kein genaues Abbild des tatsächlichen Marktes. Eine Praxis, die mehrere Systeme abrechnet, oder ein MVZ mit mehreren Betriebsstätten kann mehrfach zählen.
- „CompuGroup Medical ist Marktführer" hängt davon ab, ob man Produkte oder Hersteller zählt. CGM verteilt sich auf mehrere Systeme (MEDISTAR, TURBOMED, ALBIS, M1 PRO, DATA VITAL), medatixx ebenso (medatixx, x.isynet, x.concept, x.comfort, EL). Ein Vergleich einzelner Produkte unterschätzt beide Hersteller.
- Krankenhausinformationssysteme (ORBIS, SAP, CGM MEDICO, iMedOne) stehen mit in der KBV-Liste, weil Krankenhausambulanzen und MVZ von Kliniken ambulant abrechnen. Sie sind keine Software für Arztpraxen.
`,
  og: {
    titel: 'Arztpraxen, Praxissoftware und Gesundheits-IT in Deutschland',
    text: 'Zeitreihen mit Jahr und Quelle – als animierte Grafik.',
    farben: { grund: '#14213d', akzent: '#2a9d8f', hell: '#9fd8cf', text: '#dbe4f0' },
  },
  glaetteDatensaetze: ['pvs-hersteller', 'pvs-psychotherapie', 'pvs-aufsteiger', 'pvs-kis', 'earztbrief-monat', 'labordaten-praxisbarometer', 'pvs-saldo'],
}

export default profil
