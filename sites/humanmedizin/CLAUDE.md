# Humanmedizin in Zahlen – Regeln dieser Seite

Gilt, wenn `SITE=humanmedizin` (Standard im Arbeitsordner `~/Claude Code/Humanmedizin in Daten`). Gemeinsame Regeln
für Daten, Grafiken, Posts und Technik: `CLAUDE.md` im Repo-Wurzelordner.

Seite: https://humanmedizin-in-zahlen.org (Build-Ziel: Repo `freimoser/humanmedizin-in-zahlen`, Zweig `gh-pages`;
der Code liegt in `chart-race-studio`). Antworten auf Deutsch und enden mit `🌐 https://humanmedizin-in-zahlen.org`,
bei Posts mit dem live geprüften Artikel-Link ohne `.html` (wie bei der Schwesterseite).

## Zweck und Zielgruppe

- Herausgeber ist **Thomas Freimoser als Person**. Er ist **Geschäftsführer der FleXChange Medical GmbH**
  (https://flexchange-medical.de, Schnittstellen zwischen Praxisverwaltungssystemen und E-Health-Anwendungen,
  „FLX Suite“). Anders als bei der Tiermedizin ist der Firmenbezug gewollt: Die Seite soll für FleXChange werben und
  Thomas als Experten zeigen. Der **Interessenkonflikt steht offen** (Über das Projekt, Fuß, llms.txt, Leitartikel).
- Zielgruppe sind die **Dienstleister der ambulanten Versorgung**, die FleXChange-Schnittstellen einsetzen könnten:
  PVS-Hersteller, Labore (LDT), MVZ- und Praxisketten, Abrechnungs- und Telematik-Dienstleister, Healthtech/DiGA.
  Nicht Patienten. Ton: Marktkenner, nicht Gesundheitsmagazin.
- **Keine Bewertung von Software, keine Kaufempfehlung.** Die Seite gibt wieder, was Statistiken und
  KBV-Verzeichnisse zeigen. FleXChange wird nur dort genannt, wo es zum Thema gehört (Schnittstellen), nie als
  verdeckte Werbung im Text einer Auswertung. Werbliche Hinweise klar als solche erkennbar (UWG § 5a).

## Daten

- Leit-Datensatz: **Installationen je Praxisverwaltungssystem laut KBV-Installationsstatistik** (quartalsweise).
  Fallen: Die KBV zählt Installationen nach Prüfnummer, nicht Praxen („kein genaues Abbild des Marktes“).
  Psychotherapie-Systeme (Elefant, psyprax, PsychoDat) und Krankenhaussysteme (ORBIS, SAP, CGM MEDICO, iMedOne)
  getrennt zeigen, sonst führen sie die Liste. Epikur und SMARTY sind gemischt. Hersteller nach Eigentümer **am
  Stichtag** zuordnen (Übernahmen mit Datum).
- Recherche-Notizen: `sites/humanmedizin/recherche/`. Vorarbeit für die FleXChange-Website (Schnittstellen je System):
  `~/Claude Code/FleXChange-Medical GmbH - Website/recherche/`.

## Wo was liegt

- Profil: `sites/humanmedizin/profil.ts` · Artikel: `sites/humanmedizin/content/artikel/*.md` · Redaktionsplan:
  `sites/humanmedizin/content/roadmap.ts`
- Datensätze: `sites/humanmedizin/samples/index.ts`, Rohdaten `sites/humanmedizin/data/raw/`, Generator
  `sites/humanmedizin/scripts/build-samples.mjs` (`npm run daten`)
- Handgeschriebene Seiten (Praxisverwaltungssysteme, Datenherkunft, Über das Projekt): `sites/humanmedizin/seiten/`
- Farbrichtung `signal` (Tiefblau `#14213d`, Smaragd `#2a9d8f`, Manrope). Wasserzeichen `humanmedizin-in-zahlen.org`.
- Studio: Auf dieser Seite `noindex` (es ist auf der Tiermedizin indexiert), das Datenformat verlinkt auf die
  Schwesterseite. Kein doppelter Inhalt zwischen den Domains.

## Verlinkung

Mit tiermedizin-in-zahlen.org und flexchange-medical.de nach `docs/VERLINKUNG.md`.
