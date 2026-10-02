---
slug: bar-race
titel: Bar Race: Daten für ein Balkenrennen vorbereiten
menue: Bar Race
beschreibung: Welche Tabelle ein Bar Chart Race braucht, wie viele Balken sinnvoll sind und was mit Lücken, Summen und Flaggen passiert. Mit Beispiel zum Kopieren.
frage: Wie muss eine Tabelle für ein Bar Chart Race aussehen?
stand: 2026-10-02
reihenfolge: 2
bereit: ja
---
Ein Bar Race braucht **eine Zeile je Zeitpunkt und eine Spalte je Balken**. Zu jedem Zeitpunkt sortiert das Studio die Balken nach ihrem Wert, zeigt die größten und lässt sie gleitend die Plätze tauschen, wenn sich die Werte kreuzen. Es eignet sich für Rangfolgen, die sich über die Zeit verschieben: Länder, Marken, Gruppen, Rassen.

## Das Wichtigste in Kürze

- **Eine Spalte je Balken**, der Spaltenkopf wird zur Beschriftung. Lange Namen wie `Nordrhein-Westfalen` sind kein Problem.
- **Sichtbar sind die Top N**, einstellbar von 1 bis 30. Voreingestellt sind 10 Balken im Format 16:9 und 1:1, 12 in 4:5 und 9:16.
- **Summenspalten werden ausgeblendet.** Eine Gesamtzahl würde als Balken alle anderen überragen.
- **Ein Balken erscheint mit seinem ersten Wert** und bleibt nach seinem letzten Wert mit diesem Wert stehen, statt zu verschwinden.
- **Flaggen und Bilder** je Balken wählst du im Studio, sie gehören nicht in die Tabelle.

## Beispiel

```csv
Jahr,Bayern,Nordrhein-Westfalen,Niedersachsen,Baden-Württemberg
2002,6070,4626,4388,3032
2003,6214,4712,4485,3099
2004,6306,4840,4586,3184
2005,6516,4970,4785,3264
```

Ausschnitt aus der [Vorlage Bundesländer](../vorlagen/vorlage-bundeslaender.csv): Mitglieder der Landestierärztekammern je Bundesland, Quelle Bundestierärztekammer. Für ein Bar Race reichen schon wenige Zeitpunkte. Spannend wird es, wenn sich Reihenfolgen ändern, ein Rennen ohne einen einzigen Platztausch ist ein animiertes Balkendiagramm.

## Was gute Daten für ein Bar Race ausmacht

- **Mehr Reihen als sichtbare Balken.** Ein Bar Race lebt davon, dass Reihen von unten in die Top N aufsteigen und andere herausfallen. Bei 12 sichtbaren Balken dürfen es ruhig 30 Spalten sein.
- **Werte derselben Größenordnung.** Ist ein Balken hundertmal so groß wie die anderen, sieht man von ihnen nur Striche. Dann lieber den Ausreißer weglassen oder als `Summe:`-Spalte führen.
- **Gleiche Einheit in allen Spalten.** Das Bar Race hat eine Achse. Prozent und Personen gehören nicht in dieselbe Tabelle.

## Lücken, Anfang und Ende

- **Leere Zelle zwischen zwei Werten:** je nach Einstellung **Datenlücken auffüllen** interpoliert (Voreinstellung), mit dem letzten Wert gehalten oder ausgelassen.
- **Leere Zellen am Anfang einer Spalte:** Den Balken gibt es noch nicht, er erscheint mit seinem ersten Wert.
- **Leere Zellen am Ende einer Spalte:** Der Balken bleibt mit seinem letzten Wert stehen. Soll er wirklich verschwinden, weil es die Reihe nicht mehr gibt, trag eine 0 ein. Dann fällt er aus den Top N.
- **Fehlende Jahre** in der ersten Spalte ergänzt das Studio auf der Zeitachse, damit ein Sprung von 2001 auf 2005 nicht so schnell abläuft wie ein Jahr.

## Was du im Studio einstellst

- **Sichtbare Balken (Top N):** wie viele Balken gleichzeitig zu sehen sind.
- **Zwischenschritte je Periode:** 1 bis 8, voreingestellt 2. Mit Zwischenschritten tauschen Balken die Plätze genau dann, wenn sich ihre Werte kreuzen, statt am Ende einer Periode.
- **Kategorie-Labels:** außerhalb links oder im Balken. Außerhalb reserviert das Studio automatisch Platz für lange Namen.
- **Feste Achse:** Aus, wächst die Achse mit dem größten Balken mit. An, bleibt sie über den ganzen Zeitraum gleich, dann sieht man das Wachstum selbst.
- **Bilder/Flaggen anzeigen:** unter **Farben & Bilder** je Balken eine Flagge wählen oder ein Bild hochladen. Bilder bleiben im Browser und werden nicht gespeichert.

Alle weiteren Optionen, von der Videolänge bis zum Zahlenformat, stehen unter [Einstellungen](einstellungen.html).

## Häufige Fragen

### Wie viele Balken kann ein Bar Race zeigen?

Bis zu 30 gleichzeitig. Für ein Video im Feed sind 10 bis 12 gut lesbar, das ist auch die Voreinstellung. Die Tabelle darf mehr Spalten haben, als Balken sichtbar sind.

### Warum verschwindet ein Balken nicht, obwohl die Reihe endet?

Nach dem letzten Wert hält das Studio den Balken mit diesem Wert, damit er nicht wegen einer fehlenden Zelle herausfällt. Wer ihn verschwinden lassen will, trägt ab dem Ende eine 0 ein.

### Kann ich Flaggen statt Namen zeigen?

Ja. Unter Farben & Bilder lässt sich für jeden Balken eine Flagge wählen oder ein eigenes Bild hochladen, dazu den Schalter Bilder/Flaggen anzeigen einschalten. Der Name bleibt als Beschriftung stehen.
