# Pflegeprotokoll Humanmedizin in Zahlen

Auftrag des Nutzers (22.10.2026, `/loop 15m`): „Verbessere unsere Auswertungen. Stelle sicher, die Daten sind
untereinander korrekt. Plane die nächsten 10 Posts und sammle die Daten dazu. Mach 20 Durchläufe.“

- Zeitplan: alle 15 Minuten, Job `4290d020` (nur in der laufenden Sitzung). **Nach Durchlauf 20 den Job löschen.**
- Jeder Durchlauf: `git pull --rebase`, eine abgeschlossene Aufgabe aus der Liste unten, Prüfungen
  (`npm test`, Build, `check:launch`, `check:content`, Konsistenzprüfung), lokaler Commit, Eintrag hier.
- Pushen nur nach Rückfrage beim Nutzer (ein Push deployt auch die Tiermedizin).

## Aufgabenliste

| # | Aufgabe | Stand |
|---|---|---|
| A1 | Konsistenzprüfung als Skript: Datensätze untereinander, Herstellersummen, zitierte Zahlen in Texten | erledigt (D1): `npm run check:daten` |
| A2 | Redaktionsplan Posts 2–11 schärfen (Aufhänger, Zahlen, Datenbedarf je Post) | erledigt (D2) |
| A3 | Recherche MVZ (Post 8): KBV-MVZ-Statistik, Träger, angestellte Ärzte | erledigt (zwischen D2 und D3): recherche/mvz.md, data/raw/mvz.csv; Datensätze noch anlegen |
| A4 | Recherche Schnittstellen (Posts 6, 7): KBV-Zulassungen LDT/eArztbrief/KIM je System, gematik TI-Dashboard | erledigt (zwischen D3 und D4): recherche/schnittstellen.md, data/raw/pvs-zulassungen.csv, ti-nutzung.csv; Posts und Datensätze noch anlegen |
| A5 | Datensatz Psychotherapie (Post 3) aus KBV-Arztgruppenberichten | erledigt (D3): `pvs-psychotherapie` |
| A6 | Datensatz Aufsteiger (Post 4) | |
| A7 | Datensatz KIS-Systeme (Post 8) | |
| A8 | Datensatz Wechsel/Nettoveränderung je System (Post 9) | |
| A9 | Recherche Tiermedizin-PVS (Post 10), Abgleich mit Schwesterseite | |
| A10 | Recherche Labor (Post 11) | |
| A11 | Artikelentwürfe zu den Posts mit belegten Daten | |

## Durchläufe

| Nr. | Datum | Was |
|---|---|---|
| 1 | 22.10.2026 | Protokoll angelegt. Konsistenzprüfung `sites/humanmedizin/scripts/pruefe-konsistenz.mjs` (`npm run check:daten`): Rohdaten ↔ Datensätze, kurze ↔ lange Fassung, Herstellersummen, 24 Kennzahlen in 5 Texten, unbekannte Zahlen. Ergebnis: keine Fehler. CSV-Leser nach `scripts/lib/csv.mjs` ausgelagert (Daten bitgleich). Recherchen MVZ und Schnittstellen gestartet. |
| 2 | 22.10.2026 | Redaktionsplan Posts 2–11 neu: Reihenfolge nach Datenlage (2 Hersteller, 3 Psychotherapie, 4 Aufsteiger, 5 Gewinner/Verlierer 2021–2025, 6 LDT 3, 7 KIM/eArztbrief, 8 MVZ, 9 Klinik-Software, 10 Arzt vs. Tierarzt, 11 Labor), alle Zahlen aus den Daten gerechnet. Dabei zwei eigene Fehler gefunden und korrigiert (Top-3-Anteil 32 statt 37 %, „Praxen“ statt „Installationen“). Nachgeprüft am Original-PDF: Summe Ende 2021 = 119.405 (Zufallsgleichheit mit 2014). Redaktionsplan jetzt Teil der Konsistenzprüfung. |
| 3 | 22.10.2026 | Datensatz `pvs-psychotherapie` (Post 3): CGM MEDISTAR gegen Elefant, psyprax, Epikur 2013–2025, 16 Werte 2017–2020 gerechnet. Kernaussage aus den Daten: Elefant überholt MEDISTAR Ende 2023 (11.026 zu 10.966), psyprax 2024. Farben validiert (alle Paare), Glätteprüfung 0 Sprünge (auch `pvs-hersteller`). Generator: `baue()` nimmt jetzt eine feste Systemliste. Dazwischen MVZ-Recherche eingearbeitet (Post 8). |
| – | 22.10.2026 | Zwischen D3 und D4: **Datenfehler behoben** – DAVID (Id 721) gehört laut KBV zu Medat Computersysteme, nicht CGM (Rohdatei ab 2013, Name und Farbe im Race ab 2007, Dateninfo, Datenherkunft). Rohdatei wieder mit CRLF-Zeilenenden. Schnittstellen-Recherche übernommen. |
| 4 | 22.10.2026 | Posts 6 und 7 auf den Schnittstellen-Daten aufgebaut, Kernzahlen selbst nachgerechnet: LDT-Befund-Import 95,8 % der Installationen (Basis: 28 Systeme ab 500; Recherche nannte 96,2 % über alle 51), eArztbrief-Zulassung 88,9 %, LDT-Auftrag 0 ärztliche Systeme. Rundungsfehler im Recherchebericht korrigiert (eArztbriefe 2025: 45,2 statt 45,3 Mio.). Neue Datensätze `earztbrief-monat` (55 Monate, Monatswerte aus kumuliertem gematik-Zähler gerechnet, Jahressummen identisch) und `labordaten-praxisbarometer` (2018–2025, Formulierungsbruch 2024 markiert). Neue Rubrik „Schnittstellen & Telematik“. Konsistenzprüfung um Zulassungsanteile und eArztbrief-Jahressummen erweitert. Leitartikel-Tabelle gegen Verzeichnis 21.10. geprüft: stimmt. |
