# Zwei Seiten, ein Repo – feste Regeln

Dieses Repo (`freimoser/chart-race-studio`) baut zwei Seiten von Thomas Freimoser mit derselben Technik:

| Seite | Ordner | Arbeitsordner (eigener Klon, eigener Chat) | Ausgeliefert über |
|---|---|---|---|
| https://tiermedizin-in-zahlen.org | `sites/tiermedizin/` | `~/Claude Code/Freimoser-ChartRace` | Pages dieses Repos |
| https://humanmedizin-in-zahlen.org | `sites/humanmedizin/` | `~/Claude Code/Humanmedizin in Daten` | Repo `humanmedizin-in-zahlen`, Zweig `gh-pages` |

Welche Seite gebaut wird, sagt `SITE=…`; ohne die Variable gilt die Datei `.seite` im Arbeitsordner (nicht
eingecheckt), sonst `tiermedizin`. Aufbau, Deploy und wie man eine dritte Seite anlegt: `docs/ARCHITEKTUR.md`.
Verlinkung zwischen den Seiten: `docs/VERLINKUNG.md`.

**Zuerst die Regeln der eigenen Seite lesen** – beide sind hier eingebunden:

@sites/tiermedizin/CLAUDE.md
@sites/humanmedizin/CLAUDE.md

## Zusammenarbeit der beiden Chats

1. **Vor jeder Arbeit `git pull --rebase`.** Beide Klone schieben auf `main`.
2. **Inhalte nur in `sites/<eigene seite>/`.** Die Wurzelkopien `artikel/`, `ueber-das-projekt.html`, `index.html`,
   `beitrag/`, `impressum.html`, `datenschutz.html` sind erzeugt und schreibgeschützt – nie bearbeiten.
3. **Kern = alles außerhalb von `sites/`** (`src/`, `scripts/`, `vite.config.ts`, `*.html` der Wurzel, Workflows).
   Eine Kernänderung muss beide Seiten tragen: vor dem Push `npm run test:alle` und beide Builds
   (`SITE=tiermedizin npm run build`, `SITE=humanmedizin npm run build`). Kein Seitenname, keine Domain und kein
   Seitentext fest im Kern – alles Seitenspezifische gehört ins Profil (`sites/<seite>/profil.ts`, Form in
   `src/content/profil.ts`).
4. **Kernänderung in `CHANGELOG.md`** mit einer Zeile „betrifft beide Seiten“, damit der andere Chat sie beim
   nächsten Pull sieht. Neue Profilfelder bekommen in beiden Profilen einen Wert.
5. Ein Push auf `main` deployt beide Seiten.

## Daten und Grafiken (verbindlich, beide Seiten)

Diese Regeln stammen aus Fehlern, die schon passiert sind. Vor jeder Auswertung, Grafik und jedem Post lesen.

1. **Keine leeren Jahre.** Jede Reihe einer eigenen Grafik hat in jedem Jahr (bzw. Stichtag) des gezeigten
   Zeitraums einen Wert. Keine Linie und kein Balken setzt später ein oder hört früher auf. Fehlt ein Wert:
   1. **recherchieren** – Primärquelle, dann Zweitquelle (Zweitquelle nur mit Fundstelle);
   2. **rechnen mit naheliegenden Daten**, in dieser Reihenfolge: zwischen zwei Belegen linear; bei Quellenwechsel
      über ein Überlappungsjahr verketten (Faktor); vor dem ersten bzw. nach dem letzten Beleg über eine verwandte
      Reihe fortschreiben (z. B. Anteil an Deutschland), sonst den nächsten Beleg halten.
   3. **markieren**, was gerechnet ist und wo sich Quellen überschneiden: in der Rohdatei
      (`sites/<seite>/data/raw/`), in der Dateninfo (`dataInfo`), in der Datenherkunft und **im LinkedIn-Post**.
   Hilfen in `scripts/lib/reihen.mjs`: `stuetze`, `lueckenlos`, `kette`. Test: `src/test/luecken.test.ts`
   (gilt für alle Datensätze mit `erstellt` ab 2026-10-07).
2. **Nie nur eine Quelle.** Was eine Reihe wirklich misst (Gebührensatz, Rechnung, Umsatz, Umfrage, Register,
   Installation), vorher klären und unabhängige Quellen überlagern. Gegenläufige Belege offen nennen.
3. **Eine Grafik, eine Aussage**, höchstens etwa vier Linien. Reihen, die lange gleich laufen, nicht gemeinsam in
   Prozent zeigen (dann in absoluten Werten oder als eigene Grafik per `::grafik <id>` im Artikel).
4. **Titel und Begriffe nach der Definition der Quelle.** Beispiele: Pferde sind keine Heimtiere → „Heimtiere und
   Pferde“; eine KBV-Installation ist keine Praxis. Ein Titel verspricht nichts, was die Daten nicht zeigen.
5. **Nichts Altes kaputt machen.** Neue Fassungen als neue Datensätze. Nach jeder Änderung am Diagramm-Code
   `node scripts/pruefe-glaette.mjs` über alle Datensätze beider Seiten (Entwicklungsserver der jeweiligen Seite
   muss laufen) – 0 Sprünge.

## Posts

- Jeder Post-Text in `sites/<seite>/docs/linkedin/` endet vor den Quellen mit einem Block **„Gerechnet / Quellen“**:
  welche Werte berechnet sind (wie) und wo sich Quellen überschneiden.
- Links in Post und Kommentar **ohne `.html`**.
- **Jedes Bild und Video trägt die Marke der Seite** (Wasserzeichen = Domain der Seite, Standard im Studio).
  Kein Bild ohne Quelle im Bild.

## Website

- SEO-Grenzen: Titel höchstens 60, Meta-Description höchstens 155 Zeichen (geprüft von `check:launch` und
  `check:content`). Jede Seite verlinkt den Autor auf `/ueber-das-projekt.html`; handgeschriebene Seiten tragen
  `<meta name="dcterms.modified">` für das lastmod der Sitemap. Quellen in Artikeln verlinken, mit Abrufdatum.
- Google Analytics nur über `VITE_GA_ID` und Einwilligung (`src/lib/consent.ts`), **nie** als festes Snippet im
  `<head>` (§ 25 TDDDG). Vor jedem Deploy `npm run check:launch`.
- Vor dem Push: `npm run build`, `npm test`, `npm run check:links` (je Seite); bei Layout `npm run check:mobil`; bei
  Änderungen an der eingebetteten Grafik `npm run check:grafiken` (gegen `npm run preview`).
