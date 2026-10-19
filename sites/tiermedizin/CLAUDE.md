# Tiermedizin in Zahlen – Regeln dieser Seite

Gilt, wenn `SITE=tiermedizin` (Standard im Arbeitsordner `~/Claude Code/Freimoser-ChartRace`). Gemeinsame Regeln für
Daten, Grafiken, Posts und Technik: `CLAUDE.md` im Repo-Wurzelordner.

Seite: https://tiermedizin-in-zahlen.org (Repo heißt weiter chart-race-studio). Privates Projekt von Thomas
Freimoser, **nicht** der Firma: kein Petleo, Herausgeber ist die Person. Antworten auf Deutsch und enden mit
`🌐 https://tiermedizin-in-zahlen.org`.

**Geht es in einer Antwort um einen Post** (erstellen, ändern, Text, Bilder, Video), steht als allerletzte Zeile der
Link zum Artikel des Posts, live geprüft und ohne `.html`: `🌐 https://tiermedizin-in-zahlen.org/beitrag/<slug>`. Er
ersetzt dann die Startseiten-Zeile. Der Nutzer will nichts von Hand suchen (Regel vom 09.10.2026).

## Wo was liegt

- Profil (Texte von Start, Übersicht, Kopf, Fuß, llms.txt): `sites/tiermedizin/profil.ts`
- Artikel: `sites/tiermedizin/content/artikel/*.md`, Redaktionsplan `sites/tiermedizin/content/roadmap.ts`
- Datensätze: `sites/tiermedizin/samples/index.ts`, Rohdaten `sites/tiermedizin/data/raw/`, Generator
  `sites/tiermedizin/scripts/build-samples.mjs` (`npm run daten`)
- Handgeschriebene Seiten (Tierarztketten, Datenherkunft, Über das Projekt): `sites/tiermedizin/seiten/`
- Bilder, Videos, Favicons, Vorlagen: `sites/tiermedizin/public/`
- Ablauf je Post: `sites/tiermedizin/docs/REDAKTION.md`. Datensätze: `sites/tiermedizin/docs/DATASETS.md`.
  LinkedIn-Texte: `sites/tiermedizin/docs/linkedin/`.

## Marke in Bildern und Videos

Bildposts (ohne Zeitreihe) nur über `sites/tiermedizin/scripts/balkenbild.mjs` aus einer JSON-Datei: 1080 × 1350
(4:5, LinkedIn und Instagram), genormtes Band unten mit Logo, „Tiermedizin in Zahlen“ und `tiermedizin-in-zahlen.org`.
Videos aus dem Studio mit dem Wasserzeichen `tiermedizin-in-zahlen.org` (Standard).

## Schwesterseiten

- https://humanmedizin-in-zahlen.org – dieselbe Technik, Humanmedizin, FleXChange-Bezug. Verlinkung nach
  `docs/VERLINKUNG.md`; Links dorthin erst setzen, wenn sie live ist.
- https://tiermedizin-in-digital.org – digitale Lösungen für Tierarztpraxen, eigenes Projekt.
