# Datensätze von Humanmedizin in Zahlen

Stand 20.10.2026. Für Leser steht dasselbe in der Datenherkunft (`seiten/artikel/datenherkunft.html`), mit Anker je ID.

| ID | Inhalt | Zeitraum | Rohdaten | gerechnet |
|---|---|---|---|---|
| `pvs-installationen` | Installationen je Praxisverwaltungssystem, 27 Systeme für ärztliche Praxen (ohne Psychotherapie und KIS) | Q4/2013–Q4/2025, jährlich | `data/raw/pvs-kbv-installationen.csv`, `data/raw/pvs-kbv-anteile-2017-2020.csv` | 2017–2020 (KBV nur Anteile) und ETERNO 2013; Liste: `data/raw/pvs-gerechnet.json` |
| `pvs-hersteller` | Summen je Hersteller: CGM, medatixx, Medical Office + tomedo + T2med | wie oben | wie oben | wie oben |

Erzeugt mit `npm run daten` (`scripts/build-samples.mjs`). Recherche, Quellen je Stichtag, Übernahmen und Fallstricke:
`recherche/pvs-kbv-historie.md`.

## Offene Punkte

- 2007–2012 sind nur lückenhaft belegt (2007 vollständig, 2010/2011 nur die größten Systeme bzw. Hersteller). Eine Fassung
  ab 2007 wäre ein **neuer** Datensatz (`pvs-installationen-2007`), mit 2008–2012 gerechnet.
- Medical Office 2017: Sprung laut KBV-Anteil, möglicherweise Doppelzählung wie 2021 – bei der KBV nachfragen.
- Eigentümer der medatixx-Gruppe, Kaufjahre ALBIS und Compumed durch CGM: unbelegt.
- Psychotherapie-Datensatz (Post 3) und Reihe „nur ärztliche Abrechnungsstellen“ aus den Arztgruppen-Berichten: Daten in der
  Recherche, Abschnitt 6.
