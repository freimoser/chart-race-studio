---
slug: karte
titel: Animierte Karte: Daten für Welt- und Deutschlandkarte
menue: Karte
beschreibung: Welche Tabelle eine animierte Weltkarte oder Bundesländerkarte braucht: Ländernamen, ISO-Codes, Kipppunkt, Summen und warum ein Land grau bleibt.
frage: Wie muss eine Tabelle für eine animierte Welt- oder Deutschlandkarte aussehen?
stand: 2026-10-02
reihenfolge: 4
grafik: hund-katze-welt
bereit: ja
---
Eine animierte Karte braucht **eine Zeile je Zeitpunkt und eine Spalte je Land oder Bundesland**, in den Zellen den Wert. Das Studio färbt jede Fläche nach ihrem Wert, lässt die Zeit ablaufen und zeigt daneben eine Rangliste oder eine Zählung je Stufe. Ob eine Welt- oder eine Deutschlandkarte entsteht, erkennt es an den Spaltenköpfen.

## Das Wichtigste in Kürze

- **Spaltenköpfe sind Länder oder Bundesländer.** Treffen mehr Spalten Bundesländer als Staaten, wird es die Deutschlandkarte.
- **Ländernamen deutsch, englisch oder als ISO-Code:** `Deutschland`, `Germany` und `DE` färben dieselbe Fläche.
- **Bundesländer mit amtlichem Namen**, etwa `Nordrhein-Westfalen`, `Baden-Württemberg`.
- **Summenspalten** wie `Summe: Hunde (Mio.)` erscheinen als kleine Linie mit aktuellem Wert im Seitenpanel.
- **Kipppunkt** für Anteile, bei denen die Seite zählt: fünf Farbstufen und eine Zählung, wie viele Länder in jeder Stufe liegen.

## Beispiel

```csv
Jahr,Deutschland,Frankreich,Japan,USA,Brasilien,CN,Summe: Hunde (Mio.),Summe: Katzen (Mio.)
2000,42.9,49.8,57.1,47.3,70,55.6,331.5,294.2
2001,42.5,48.9,56.7,47.2,70,55.6,336.3,297.9
2002,42.1,48,56.4,47.1,70,55.6,341.4,301.9
```

Ausschnitt aus der [Vorlage Weltkarte](../vorlagen/vorlage-weltkarte.csv): Anteil der Hunde an allen Hunden und Katzen je Land, in Prozent, dazu die weltweiten Summen. „Deutschland“, „USA“ und „CN“ stehen absichtlich in verschiedenen Schreibweisen nebeneinander, alle drei werden erkannt. Die Werte sind Beispieldaten, für die meisten Länder modelliert.

## Länder und Bundesländer richtig benennen

- **Groß- und Kleinschreibung, Akzente und Bindestriche spielen keine Rolle.** Gängige Varianten sind hinterlegt: `USA`, `Vereinigte Staaten`, `DR Kongo`, `Türkiye`, `Czech Republic`.
- **ISO-Codes mit zwei Buchstaben**, etwa `FR`, `JP`, `BR`.
- **Kammerbereiche vorher zusammenfassen.** Nordrhein und Westfalen-Lippe sind zusammen Nordrhein-Westfalen.
- **Kleinstaaten** wie Malta, Singapur oder Monaco haben auf der Weltkarte keine eigene Fläche. Sie zählen in Rangliste, Stufenzählung und Summen trotzdem mit.

Nach dem Laden zeigt das Studio unter **Kartenabgleich**, welche Karte es erkannt hat und welche Spalten keiner Fläche zugeordnet werden konnten. Bleibt ein Land grau, steht es dort mit seinem Spaltenkopf.

## Werte und Farben

- **Ohne Kipppunkt** färbt das Studio stufenlos von 0 bis zum größten Wert im ganzen Zeitraum. Daneben steht eine Rangliste der größten Werte.
- **Mit Kipppunkt** (unter **Karte & Beschriftung**) teilt es die Werte in fünf Stufen: deutlich und knapp darunter, um den Kipppunkt, knapp und deutlich darüber, mit Grenzen bei 3 und 10 Punkten Abstand. Daneben steht, wie viele Länder in jeder Stufe liegen.
- **Die Farbskala ist über den ganzen Zeitraum fest**, damit eine Veränderung auch als Farbwechsel sichtbar wird.
- **Leere Zellen** behandelt die Karte wie die anderen Diagramme. Ein Land ohne jeden Wert bleibt grau.

Ein Kipppunkt passt zu Anteilen, bei denen die Seite die Aussage ist, etwa „Hundeanteil über oder unter 50 Prozent“. Beide Seiten bekommen einen Namen, zum Beispiel „Katzen“ und „Hunde“. Ohne Namen heißen die Stufen neutral „darunter“ und „darüber“.

## Summenspalten auf der Karte

- **Aufbau:** `Summe: <Name> (<Einheit>)`. Gleichwertig sind `Gesamt:` und `Total:`.
- **Höchstens zwei bis drei.** Mehr passen nicht lesbar ins Panel.
- **Farben:** Namen mit „Hund“ werden orange, mit „Katz“ türkis gezeichnet, passend zur Karte. Andere Namen bekommen eine Farbe aus der Palette.
- **Die Summe steht in der Tabelle.** Eine Summe über die Spalten einer Karte ist selten richtig: Anteile lassen sich nicht addieren, und fehlende Länder würden still fehlen.

## Was du im Studio einstellst

- **Diagrammtyp Karte** unter Format & Diagrammtyp.
- **Zeilen der Rangliste im Panel**, solange kein Kipppunkt gesetzt ist.
- **Farbstufen um einen Kipppunkt**, mit **Kipppunkt**, **Name unten** und **Name oben**.
- **Überschrift der Zählung**, etwa „Länder je Stufe“.

Eine Schritt-für-Schritt-Anleitung mit Screenshots: [Weltkarte nach Daten einfärben und animieren](../beitrag/weltkarte-laender-einfaerben-animieren.html). Alle weiteren Optionen: [Einstellungen](einstellungen.html).

## Häufige Fragen

### Warum bleibt ein Land auf der Karte grau?

Entweder hat es in der Tabelle keinen Wert, oder sein Spaltenkopf wurde keiner Fläche zugeordnet. Der Kartenabgleich im Studio listet solche Spalten auf. Meist hilft der ISO-Code, etwa `CD` für die Demokratische Republik Kongo.

### Kann ich eine Karte der deutschen Bundesländer erstellen?

Ja. Eine Spalte je Bundesland mit amtlichem Namen, das Studio wählt dann automatisch die Deutschlandkarte. Die Vorlage Bundesländer enthält alle 16 Namen.

### Kann ich Landkreise oder Postleitzahlgebiete einfärben?

Nein. Das Studio kennt die Staaten der Welt und die 16 Bundesländer, kleinere Gebiete nicht.
