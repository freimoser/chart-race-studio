---
slug: saeulen-linie
titel: Säulen + Linie: Menge und Preis in einem Diagramm
menue: Säulen + Linie
beschreibung: Welche Tabelle ein animiertes Säulen-Linien-Diagramm braucht: Säulen für die linke Achse, Linien für die rechte, Veränderung in Prozent und echte Lücken.
frage: Wie muss eine Tabelle für ein animiertes Diagramm mit Säulen und Linie aussehen?
stand: 2026-10-04
reihenfolge: 5
grafik: oktoberfest
bereit: ja
---
Säulen + Linie braucht **dieselbe Tabelle wie ein Line Race: eine Zeile je Zeitpunkt, eine Spalte je Reihe**. Der Unterschied liegt in der Zuordnung: Reihen auf der linken Achse werden Säulen, Reihen auf der rechten Achse werden Linien. So stehen zwei Einheiten in einem Bild, die zusammen eine Geschichte erzählen, etwa eine Menge und ein Preis. Jede Säule wächst hoch, wenn die Linien ihr Jahr erreichen.

## Das Wichtigste in Kürze

- **Linke Achse = Säulen.** Eine Reihe ergibt eine Säule je Zeitpunkt, mehrere Reihen stehen nebeneinander. Gut lesbar sind eine bis drei.
- **Rechte Achse = Linien.** Im Studio unter **Farben & Bilder** bei der Reihe auf **Y2** klicken. Eine bis drei Linien.
- **Veränderung in Prozent:** Auf Wunsch steht hinter jedem Wert, wie stark er seit dem ersten Wert gestiegen ist, etwa „15,33 € (+379 %)“.
- **Summenspalten** wie `Gesamt: Besucher (Mio.)` laufen als große Zahl oben links mit, wie im Line Race.
- **Leere Zellen bleiben leer**, wenn unter Datenlücken „Nicht“ eingestellt ist: keine Säule, eine Lücke in der Linie. Für Jahre, in denen es nichts gab, ist das die ehrliche Darstellung.

## Beispiel

```csv
Jahr,Bier (Mio. Liter),Maß,Maß mit Inflation,Gesamt: Besucher (Mio.)
2018,7.87,11.3,5.63,6.3
2019,7.85,11.71,5.71,6.3
2020,,,5.74,
2021,,,5.91,
2022,7.13,13.45,6.32,5.7
```

Ausschnitt aus dem Datensatz zum Oktoberfest: Bier als Säulen, Maßpreis und der mit der Inflation fortgeschriebene Preis von 1985 als Linien, Besucher als mitlaufende Zahl. 2020 und 2021 fiel die Wiesn aus; diese Zeilen haben nur den Inflationswert. Mehr dazu im Artikel [Oktoberfest in Zahlen](../beitrag/oktoberfest-masspreis-inflation.html).

## Wann Säulen + Linie passt

- **Zwei Einheiten, eine Aussage:** Menge und Preis, Personen und Anteil, Umsatz und Zahl der Betriebe. Mit einer Einheit ist ein Line Race klarer.
- **Säulen für das, was sich addiert,** etwa Liter, Personen oder Euro je Jahr. Linien für Preise, Anteile und Indizes, die man nicht stapelt.
- **Nicht zu viele Zeitpunkte:** Bis etwa 50 Säulen bleiben sie gut zu unterscheiden. Für Monatswerte über viele Jahre ist ein Line Race besser.
- **Ein Vergleichswert als zweite Linie** macht eine Linie erst lesbar, etwa ein Preis neben der allgemeinen Teuerung.

## Lücken und Nullen

- **Leere Zelle heißt: kein Wert.** Mit der Einstellung **Datenlücken auffüllen: Nicht** bleibt die Säule weg und die Linie unterbrochen. Mit **Interpolieren** rechnet das Studio zwischen zwei Werten weiter; das ist bei Preisen manchmal vertretbar, bei Mengen fast nie.
- **Null ist ein Wert.** Eine 0 zeichnet eine Säule ohne Höhe und zieht die Linie auf null. Nie als Platzhalter für „unbekannt“ eintragen.

## Was du im Studio einstellst

- **Diagrammtyp Säulen + Linie** unter Format & Diagrammtyp.
- **Y2** je Reihe unter **Farben & Bilder**: legt sie als Linie auf die rechte Achse.
- **Titel linke Achse** und **Titel rechte Achse**, **Dezimalstellen rechts** und **Suffix rechts**, etwa „ €“.
- **Veränderung seit Beginn in % hinter dem Wert** unter Säulen, Linien & Achsen.
- **Datenlücken auffüllen: Nicht**, wenn leere Zellen leer bleiben sollen.

Alle weiteren Optionen stehen unter [Einstellungen](einstellungen.html).

## Häufige Fragen

### Wie lege ich fest, was Säule und was Linie wird?

Über die Achse: Reihen auf der linken Achse werden Säulen, Reihen mit Y2 auf der rechten Achse werden Linien. Ohne Y2 entstehen nur Säulen.

### Kann ich mehrere Säulen je Jahr zeigen?

Ja. Jede Reihe der linken Achse bekommt ihre eigene Säule, sie stehen je Zeitpunkt nebeneinander. Mehr als drei werden schmal.

### Wie zeige ich den Anstieg in Prozent?

Mit dem Schalter „Veränderung seit Beginn in % hinter dem Wert“. Gerechnet wird gegen den ersten Wert der Reihe, für Säulen und Linien.
