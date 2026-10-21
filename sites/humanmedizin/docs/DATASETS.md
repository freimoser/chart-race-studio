# Datensätze von Humanmedizin in Zahlen

Stand 20.10.2026. Für Leser steht dasselbe in der Datenherkunft (`seiten/artikel/datenherkunft.html`), mit Anker je ID.

| ID | Inhalt | Zeitraum | Rohdaten | gerechnet |
|---|---|---|---|---|
| `pvs-installationen` | Installationen je Praxisverwaltungssystem, 28 Systeme für ärztliche Praxen (ohne Psychotherapie und KIS) | Q4/2013–Q4/2025, jährlich | `data/raw/pvs-kbv-installationen.csv`, `data/raw/pvs-kbv-anteile-2017-2020.csv` | 2017–2020 (KBV nur Anteile) und ETERNO 2013; Liste: `data/raw/pvs-gerechnet.json` |
| `pvs-installationen-2007` | wie oben, 30 Systeme, im Video 20 Zeilen | Q4/2007–Q4/2025, jährlich | dazu `data/raw/pvs-kbv-luecken-1998-2012.csv` | 2008–2012 (zwischen Teilbelegen 2009/2010/2011), 2017–2020; 8 Anbieterwerte 2011 als Annahme; 249 von 570 |
| `pvs-hersteller` | Summen je Hersteller: CGM, medatixx, Medical Office + tomedo + T2med | wie oben | wie oben | wie oben |

Erzeugt mit `npm run daten` (`scripts/build-samples.mjs`). Recherche, Quellen je Stichtag, Übernahmen und Fallstricke:
`recherche/pvs-kbv-historie.md`.

## Offene Punkte

- Vor 2007 keine lückenlose Reihe möglich (2001–2004 und 2006 ohne Systemliste); 1997, 2000 und 2005 stehen als
  Momentaufnahmen im Artikel zu Post 1. Entscheidung des Nutzers 21.10.2026: zweites Race ab 2007, nicht ab 2000.
- Weitere Belege 2008–2012 nur über das KBV-Archiv (DARIS) direkt oder die Ärzte Zeitung (Login).
- Medical Office 2017: Sprung laut KBV-Anteil, möglicherweise Doppelzählung wie 2021 – bei der KBV nachfragen.
- Eigentümer der medatixx-Gruppe, Kaufjahre ALBIS und Compumed durch CGM: unbelegt.
- Psychotherapie-Datensatz (Post 3) und Reihe „nur ärztliche Abrechnungsstellen“ aus den Arztgruppen-Berichten: Daten in der
  Recherche, Abschnitt 6.
