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
| A2 | Redaktionsplan Posts 2–11 schärfen (Aufhänger, Zahlen, Datenbedarf je Post) | |
| A3 | Recherche MVZ (Post 7): KBV-MVZ-Statistik, Träger, angestellte Ärzte | läuft (Agent, seit D1) |
| A4 | Recherche Schnittstellen (Posts 5, 6): KBV-Zulassungen LDT/eArztbrief/KIM je System, gematik TI-Dashboard | läuft (Agent, seit D1) |
| A5 | Datensatz Psychotherapie (Post 3) aus KBV-Arztgruppenberichten | |
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
