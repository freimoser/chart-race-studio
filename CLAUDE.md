# Tiermedizin in Zahlen – feste Regeln

Seite: https://tiermedizin-in-zahlen.org (Repo heißt weiter chart-race-studio). Privates Projekt von Thomas
Freimoser, **nicht** der Firma: kein Petleo, Herausgeber ist die Person. Antworten auf Deutsch und enden mit
`🌐 https://tiermedizin-in-zahlen.org`.

Diese Regeln stammen aus Fehlern, die schon passiert sind. Vor jeder Auswertung, Grafik und jedem Post lesen.

## Daten und Grafiken (verbindlich)

1. **Keine leeren Jahre.** Jede Reihe einer eigenen Grafik hat in jedem Jahr des gezeigten Zeitraums einen
   Wert. Keine Linie und kein Balken setzt später ein oder hört früher auf. Fehlt ein Wert:
   1. **recherchieren** – Primärquelle, dann Zweitquelle (Zweitquelle nur mit Fundstelle);
   2. **rechnen mit naheliegenden Daten**, in dieser Reihenfolge: zwischen zwei Belegen linear; bei Quellenwechsel
      über ein Überlappungsjahr verketten (Faktor); vor dem ersten bzw. nach dem letzten Beleg über eine verwandte
      Reihe fortschreiben (z. B. Anteil an Deutschland), sonst den nächsten Beleg halten.
   3. **markieren**, was gerechnet ist und wo sich Quellen überschneiden: in der Rohdatei (`data/raw/`), in der
      Dateninfo (`dataInfo`), in der Datenherkunft und **im LinkedIn-Post**.
   Hilfen in `scripts/build-samples.mjs`: `stuetze`, `lueckenlos`, `kette`. Test: `src/test/luecken.test.ts`
   (gilt für alle Datensätze mit `erstellt` ab 2026-10-07).
2. **Nie nur eine Quelle.** Was eine Reihe wirklich misst (Gebührensatz, Rechnung, Umsatz, Umfrage, Register),
   vorher klären und unabhängige Quellen überlagern. Gegenläufige Belege offen nennen.
3. **Eine Grafik, eine Aussage**, höchstens etwa vier Linien. Reihen, die lange gleich laufen, nicht gemeinsam in
   Prozent zeigen (dann in absoluten Werten oder als eigene Grafik per `::grafik <id>` im Artikel).
4. **Titel und Begriffe nach der Definition der Quelle.** Beispiel: Pferde sind keine Heimtiere → „Heimtiere und
   Pferde“. Ein Titel verspricht nichts, was die Daten nicht zeigen.
5. **Nichts Altes kaputt machen.** Neue Fassungen als neue Datensätze. Nach jeder Änderung am Diagramm-Code
   `node scripts/pruefe-glaette.mjs` über alle Datensätze (Entwicklungsserver muss laufen) – 0 Sprünge.

## Posts

- Jeder Post-Text in `docs/linkedin/` endet vor den Quellen mit einem Block **„Gerechnet / Quellen“**: welche
  Werte berechnet sind (wie) und wo sich Quellen überschneiden.
- Links in Post und Kommentar **ohne `.html`**.
- Ablauf je Post: `docs/REDAKTION.md`. Datenstandard: `docs/DATENSTANDARD.md`. Datensätze: `docs/DATASETS.md`.

## Website

- SEO-Grenzen: Titel höchstens 60, Meta-Description höchstens 155 Zeichen (geprüft von `check:launch` und
  `check:content`). Jede Seite verlinkt den Autor auf `/ueber-das-projekt.html`; handgeschriebene Seiten tragen
  `<meta name="dcterms.modified">` für das lastmod der Sitemap. Quellen in Artikeln verlinken, mit Abrufdatum.

- Google Analytics nur über `VITE_GA_ID` und Einwilligung (`src/lib/consent.ts`), **nie** als festes Snippet im
  `<head>` (§ 25 TDDDG). Vor jedem Deploy `npm run check:launch`.
- Vor dem Push: `npm run build`, `npm test`, `npm run check:links`; bei Layout `npm run check:mobil`.
