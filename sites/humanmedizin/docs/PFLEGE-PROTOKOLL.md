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
| A3 | Recherche MVZ (Post 8): KBV-MVZ-Statistik, Träger, angestellte Ärzte | erledigt; Datensätze `aerzte-praxisform`, `mvz-anzahl` (D7) |
| A4 | Recherche Schnittstellen (Posts 6, 7): KBV-Zulassungen LDT/eArztbrief/KIM je System, gematik TI-Dashboard | erledigt (zwischen D3 und D4): recherche/schnittstellen.md, data/raw/pvs-zulassungen.csv, ti-nutzung.csv; Posts und Datensätze noch anlegen |
| A5 | Datensatz Psychotherapie (Post 3) aus KBV-Arztgruppenberichten | erledigt (D3): `pvs-psychotherapie` |
| A6 | Datensatz Aufsteiger (Post 4) | erledigt (D5): `pvs-aufsteiger` |
| A7 | Datensatz KIS-Systeme (Post 9) | erledigt (D5): `pvs-kis`, Aussage für den Post noch schärfen |
| A8 | Datensatz Wechsel/Nettoveränderung je System (Post 5) | erledigt (D6): `pvs-saldo` |
| A9 | Recherche Tiermedizin-PVS (Post 10), Abgleich mit Schwesterseite | erledigt: keine Marktanteile belegbar, Post 10 neu gefasst; Recherche-Notiz lokal (Entscheidung Nutzer offen: enthält Angaben zur Petleo-Beteiligung) |
| A10 | Recherche Labor (Post 11) | erledigt: recherche/labor.md, data/raw/labor.csv; Datensatz `labor-aerzte` |
| A11 | Artikelentwürfe zu den Posts mit belegten Daten | läuft: Post 2 (D8), 3 (D9), 4 (D10) |

## Durchläufe

| Nr. | Datum | Was |
|---|---|---|
| 1 | 22.10.2026 | Protokoll angelegt. Konsistenzprüfung `sites/humanmedizin/scripts/pruefe-konsistenz.mjs` (`npm run check:daten`): Rohdaten ↔ Datensätze, kurze ↔ lange Fassung, Herstellersummen, 24 Kennzahlen in 5 Texten, unbekannte Zahlen. Ergebnis: keine Fehler. CSV-Leser nach `scripts/lib/csv.mjs` ausgelagert (Daten bitgleich). Recherchen MVZ und Schnittstellen gestartet. |
| 2 | 22.10.2026 | Redaktionsplan Posts 2–11 neu: Reihenfolge nach Datenlage (2 Hersteller, 3 Psychotherapie, 4 Aufsteiger, 5 Gewinner/Verlierer 2021–2025, 6 LDT 3, 7 KIM/eArztbrief, 8 MVZ, 9 Klinik-Software, 10 Arzt vs. Tierarzt, 11 Labor), alle Zahlen aus den Daten gerechnet. Dabei zwei eigene Fehler gefunden und korrigiert (Top-3-Anteil 32 statt 37 %, „Praxen“ statt „Installationen“). Nachgeprüft am Original-PDF: Summe Ende 2021 = 119.405 (Zufallsgleichheit mit 2014). Redaktionsplan jetzt Teil der Konsistenzprüfung. |
| 3 | 22.10.2026 | Datensatz `pvs-psychotherapie` (Post 3): CGM MEDISTAR gegen Elefant, psyprax, Epikur 2013–2025, 16 Werte 2017–2020 gerechnet. Kernaussage aus den Daten: Elefant überholt MEDISTAR Ende 2023 (11.026 zu 10.966), psyprax 2024. Farben validiert (alle Paare), Glätteprüfung 0 Sprünge (auch `pvs-hersteller`). Generator: `baue()` nimmt jetzt eine feste Systemliste. Dazwischen MVZ-Recherche eingearbeitet (Post 8). |
| – | 22.10.2026 | Zwischen D3 und D4: **Datenfehler behoben** – DAVID (Id 721) gehört laut KBV zu Medat Computersysteme, nicht CGM (Rohdatei ab 2013, Name und Farbe im Race ab 2007, Dateninfo, Datenherkunft). Rohdatei wieder mit CRLF-Zeilenenden. Schnittstellen-Recherche übernommen. |
| 4 | 22.10.2026 | Posts 6 und 7 auf den Schnittstellen-Daten aufgebaut, Kernzahlen selbst nachgerechnet: LDT-Befund-Import 95,8 % der Installationen (Basis: 28 Systeme ab 500; Recherche nannte 96,2 % über alle 51), eArztbrief-Zulassung 88,9 %, LDT-Auftrag 0 ärztliche Systeme. Rundungsfehler im Recherchebericht korrigiert (eArztbriefe 2025: 45,2 statt 45,3 Mio.). Neue Datensätze `earztbrief-monat` (55 Monate, Monatswerte aus kumuliertem gematik-Zähler gerechnet, Jahressummen identisch) und `labordaten-praxisbarometer` (2018–2025, Formulierungsbruch 2024 markiert). Neue Rubrik „Schnittstellen & Telematik“. Konsistenzprüfung um Zulassungsanteile und eArztbrief-Jahressummen erweitert. Leitartikel-Tabelle gegen Verzeichnis 21.10. geprüft: stimmt. |
| 5 | 22.10.2026 | Datensätze `pvs-aufsteiger` (Medical Office, tomedo, T2med, ETERNO 2013–2025) und `pvs-kis` (ORBIS, SAP, CGM MEDICO, iMedOne). Eigener Formulierungsfehler korrigiert („fast so viele wie 2013“ → knapp 9 % mehr). Befund für Post 9: KIS-Installationen fast flach, Krankenhaus-MVZ fast verdreifacht – stärkere Aussage, noch zu prüfen. Konsistenzprüfung: alle PVS-Datensätze gegen Rohdaten, gleiche Systeme über Datensätze gleich. Glätteprüfung 0 Sprünge für alle 6 Line Races, jetzt Standardliste. Recherchen Tierarzt-PVS und Labor gestartet. |
| 6 | 22.10.2026 | Datensatz `pvs-saldo` (Post 5): Veränderung seit Ende 2021 für die zwei größten Gewinner (medatixx +3.654, tomedo +2.872) und Verlierer (TURBOMED −3.385, MEDISTAR −2.375), nur Differenzen belegter Werte; der Generator prüft bei jeder KBV-Ausgabe, ob die Auswahl noch stimmt. Line Race mit negativen Werten geprüft (Achse korrekt), Glätte 0 Sprünge, Untertitel gekürzt (war abgeschnitten). Konsistenzprüfung: Saldo gegen Rohdaten. |
| 7 | 22.10.2026 | Post 8: Datensätze `aerzte-praxisform` (Ärzte nach Praxisform 2015–2025 ohne Psychotherapeuten; alle 11 Jahre exakt wie die Recherche-Tabelle, Generator prüft 2015 fest und 2025 auf zwei Rechenwegen) und `mvz-anzahl` (MVZ gesamt und Krankenhaus-MVZ 2004–2025, alle belegt). Glätte 0 Sprünge. Konsistenzprüfung prüft jetzt auch die Zahlen in den Dateninfos; dabei eine Rundung (150.000 statt 150.450) durch den genauen Wert ersetzt. |
| – | 22.10.2026 | Zwischen D7 und D8: Labor-Recherche übernommen, Kernzahlen an der Rohdatei geprüft (88,5 % angestellt, 2013: 68,0 %). Datensatz `labor-aerzte` (2013–2025, alle belegt), Post 11 neu gefasst: „Das Labor ist ein Angestelltenfach geworden“. Damit haben alle Posts 2–11 Daten. |
| 8 | 22.10.2026 | Artikelentwurf Post 2 (`praxissoftware-hersteller-cgm-medatixx`, bereit, geht mit dem Post online). Befund beim Schreiben: Der medatixx-Anteil springt 2022 nur durch die Übernahme von EL (ohne EL 2025: 26,0 statt 28,1 %) – steht im Artikel. Herstellersummen 2015/2016 seit dem medatixx-Nachtrag korrekt niedriger (21.348/20.914); kein Text zitierte die alten Werte. Konsistenzprüfung prüft 14 Kennzahlen des Artikels. |
| 9 | 22.10.2026 | Artikelentwurf Post 3 (`psychotherapie-software-elefant-psyprax`). Scheinbarer Widerspruch geklärt (psyprax 2013: 8.722 in der Arztgruppe vs. 9.301 gesamt – kein Fehler). Zwei zu weite Formulierungen durch Belege ersetzt („fast immer Einzelpraxis“ → 88 % laut Bundesarztregister; Umsatz-Spekulation gestrichen). Konsistenzprüfung: 12 Kennzahlen und die Überhol-Jahre (Elefant 2023, psyprax 2024) werden geprüft. |
| 10 | 22.10.2026 | Artikelentwurf Post 4 (`praxissoftware-aufsteiger-tomedo-t2med`), mit Jahreswachstum 2025 aus den belegten Quartalswerten (tomedo +34,8 %, T2med +22,4 %, MEDISTAR −7,3 %, TURBOMED −11,3 %). Zwei eigene Ungenauigkeiten korrigiert (tomedo läuft nur auf dem Mac; Neugründungsanteil nicht belegt). Halbzeit: alle 10 Posts haben Daten, Artikel 1–4 stehen. |
