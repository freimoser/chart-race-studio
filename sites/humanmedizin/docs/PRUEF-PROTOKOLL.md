# Prüf- und Chart-Race-Protokoll – Humanmedizin in Zahlen

Loop ab 29.10.2026, alle 15 Minuten: „Gehe die Website durch. Prüfe alles auf Bugs sowohl mobil als auch standard. Stelle
sicher wir halten alle SEO- und GEO-Richtlinien ein. Schau, dass wir gute Artikel haben. Verbessere Punkte, die du
verbessern kannst. Mindestens 20 Wiederholungen; füge bei jedem Durchgang ein Chart Race hinzu.“

Regeln für jedes neue Chart Race (CLAUDE.md): echte, belegte Daten; keine leeren Jahre; Zweitquelle; Gerechnetes markiert
(Rohdatei, Dateninfo, Datenherkunft); höchstens etwa vier Linien; Glätteprüfung 0 Sprünge.

| Durchgang | Datum | Chart Race | Bugs und Verbesserungen |
|---|---|---|---|
| 1 | 29.10.2026 | `erezept-monat`: eingelöste E-Rezepte je Monat, 03/2022–09/2026 (gematik-Zähler, Monatsdifferenzen; Zweitquelle ABDA: 582 Mio. 2025 = Summe der Monatswerte, geprüft) | **Bug (Kern):** Datumsanzeige „3är 2022“ statt „Mär 2022“ in jeder Monatsreihe mit März – behoben mit Test, Glätte beider Seiten 0 Sprünge. **Bug (Prüfskript):** doppelte Schlüssel im Kennzahlen-Objekt hätten Prüfungen still überschrieben – zusammengeführt, Duplikate geprüft. Mobil (12 Seiten, 360 px) und Build-Prüfungen ohne Befund. |
| 2 | 29.10.2026 | `kim-nutzung`: Anteil der Praxen mit KIM-Nutzung, Arztpraxen gegen psychotherapeutische Praxen, 2021–2026 (TI-Atlas, alle Werte belegt; Zweitquelle PraxisBarometer 2025: 76,1 gegen 31,6 Prozent, gleicher Abstand) | Alle 12 Entwurfsseiten mit eigenem Prüfskript auf 360 und 1280 px: kein Überlauf, eine h1, eingebettete Grafiken mit Höhe, keine JS-Fehler. Glätte 0 Sprünge. |
