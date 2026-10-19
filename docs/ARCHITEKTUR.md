# Architektur: ein Kern, mehrere Seiten

Stand 20.10.2026. Seit diesem Tag baut das Repo `chart-race-studio` zwei Seiten: **Tiermedizin in Zahlen** und
**Humanmedizin in Zahlen**. Technik (Studio, Chart Races, Export, Artikel-Generator, Prüfungen) wird gemeinsam
weiterentwickelt, Inhalte und Auswertungen bleiben getrennt.

## Warum ein Repo und nicht zwei

Eine Kopie des Codes läuft nach wenigen Wochen auseinander: Jede Verbesserung am Export, an einer Prüfung oder am
Layout müsste von Hand hinübergezogen werden. Mit einem Repo ist eine Kernänderung ein Commit, und beide Seiten
haben sie. GitHub Pages liefert je Repo aber nur eine Seite aus. Deshalb gibt es zwei Repos auf GitHub, aber nur
eines mit Code:

```
freimoser/chart-race-studio          Code beider Seiten
  ├─ Pages dieses Repos         →   tiermedizin-in-zahlen.org        (.github/workflows/deploy.yml)
  └─ schiebt dist/ nach         →   freimoser/humanmedizin-in-zahlen, Zweig gh-pages
                                     → humanmedizin-in-zahlen.org    (.github/workflows/deploy-humanmedizin.yml)
```

## Aufbau

```
src/, scripts/, *.html, vite.config.ts     Kern – gilt für alle Seiten, kein Seitentext fest im Code
scripts/lib/site.mjs                        welche Seite (SITE), Pfade der Seite, Profil
scripts/site.mjs                            bereitet den Arbeitsstand vor (läuft vor dev, build, test)
scripts/lib/reihen.mjs                      Helfer für Datensätze: wide, stuetze, lueckenlos, kette …
src/content/profil.ts                       Form eines Seitenprofils (alle Felder dokumentiert)
src/content/redaktion.ts                    Form eines Redaktionsplans
sites/<seite>/
  profil.ts                                 Domain, Farbrichtung, Navigation, Fuß, Startseite, Übersicht, llms.txt
  CLAUDE.md                                 Regeln der Seite (Zweck, Zielgruppe, Ton, Herausgeber)
  content/legal.json                        Impressum, Markenname (siteName)
  content/roadmap.ts                        Redaktionsplan
  content/artikel/*.md                      Artikel zur Post-Reihe
  content/freigabe.json                     was live geht
  samples/index.ts, data.ts                 Datensätze fürs Studio und die Grafiken (data.ts erzeugt)
  data/raw/                                 Rohdaten mit Quellen
  scripts/build-samples.mjs                 erzeugt samples/data.ts aus data/raw/
  seiten/                                   handgeschriebene Seiten (Leitartikel, Datenherkunft, Über das Projekt)
  public/                                   Favicons, Vorschaubilder, Bilder, Videos
  docs/                                     Redaktion, Datensatz-Doku, LinkedIn-Texte
```

`npm run dev`, `build` und `test` rufen zuerst `scripts/site.mjs` auf. Das Skript setzt den Verweis `sites/aktiv`
(für TypeScript und den Editor) und kopiert die handgeschriebenen Seiten der Seite in die Wurzel, weil Vite eine
Seite unter dem Pfad ausliefert, unter dem sie liegt. Die Kopien sind schreibgeschützt und nicht eingecheckt.

Im Code gibt es zwei Pfad-Aliase: `@/…` für den Kern (`src/`), `@site/…` für die aktive Seite.

## Welche Seite?

1. `SITE=humanmedizin npm run dev` – ausdrücklich.
2. Sonst die Datei `.seite` im Arbeitsordner (eine Zeile, nicht eingecheckt). Im Klon `Freimoser-ChartRace` steht
   dort nichts oder `tiermedizin`, im Klon `Humanmedizin in Daten` steht `humanmedizin`.
3. Sonst `tiermedizin`.

Zwei Entwicklungsserver verschiedener Seiten im selben Ordner gehen nicht (die Wurzelkopien gehören zu einer
Seite). Darum hat jede Seite ihren eigenen Klon und ihren eigenen Chat.

## Befehle

```bash
npm run dev            # aktive Seite, http://localhost:5173
npm run dev:human      # Humanmedizin ausdrücklich
npm run build          # aktive Seite nach dist/
npm run test:alle      # Tests für beide Seiten
npm run daten          # sites/<seite>/samples/data.ts neu erzeugen
SITE=humanmedizin node scripts/og-bilder.mjs   # Vorschaubilder
SITE=humanmedizin node scripts/gen-icons.mjs   # Favicons aus sites/<seite>/public/favicon.svg
```

## Deploy

- **Tiermedizin:** unverändert, `deploy.yml` bei jedem Push auf `main`, Repository-Variablen `VITE_SITE_URL`,
  `VITE_GA_ID` usw.
- **Humanmedizin:** `deploy-humanmedizin.yml` bei jedem Push auf `main`, sobald die Variable `HUMAN_SITE_URL`
  gesetzt ist. Einmalige Einrichtung:
  1. Domain `humanmedizin-in-zahlen.org` bei Cloudflare registrieren; DNS wie bei der Tiermedizin (graue Wolke,
     A-Records auf GitHub Pages `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`, `CNAME www` auf
     `freimoser.github.io`).
  2. Leeres Repo `freimoser/humanmedizin-in-zahlen` anlegen (öffentlich, für kostenlose Pages).
  3. Schlüsselpaar erzeugen: `ssh-keygen -t ed25519 -N "" -f human_deploy -C humanmedizin-deploy`. Den öffentlichen
     Teil als **Deploy Key mit Schreibrecht** im Repo `humanmedizin-in-zahlen` eintragen, den privaten als
     **Secret `HUMAN_DEPLOY_KEY`** in `chart-race-studio`. Danach beide Dateien löschen.
  4. In `chart-race-studio` Variable `HUMAN_SITE_URL=https://humanmedizin-in-zahlen.org` setzen (später
     `HUMAN_GA_ID` mit einer eigenen GA4-Property, `HUMAN_GSC_VERIFICATION`).
  5. Workflow einmal von Hand starten. Danach im Repo `humanmedizin-in-zahlen`: Pages → Deploy from a branch →
     `gh-pages` / root, Custom Domain eintragen, HTTPS erzwingen.

## Eine weitere Seite anlegen

`sites/<neu>/` mit denselben Dateien wie `sites/humanmedizin/` anlegen (Profil zuerst, `src/content/profil.ts` sagt,
was hineingehört), einen Deploy-Workflow nach dem Muster von `deploy-humanmedizin.yml` und eine Zeile in der Matrix
von `ci.yml`.
