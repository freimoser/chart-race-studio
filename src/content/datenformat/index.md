---
slug: index
titel: Datenformat: Tabellen für animierte Diagramme vorbereiten
menue: Überblick
beschreibung: So muss eine Tabelle aussehen, damit das Studio daraus ein Bar Race, Line Race oder eine animierte Karte macht. Mit Vorlagen und Regeln für KI-Assistenten.
frage: Wie muss ich meine Daten strukturieren, damit das Studio sie in ein animiertes Diagramm verwandelt?
stand: 2026-10-02
reihenfolge: 1
bereit: ja
---
Das Studio braucht **eine Tabelle: in der ersten Zeile die Spaltenköpfe, in der ersten Spalte die Zeit, in jeder weiteren Spalte eine Reihe, in den Zellen nur Zahlen**. Aus derselben Tabelle entstehen ein Bar Race, ein Line Race oder eine animierte Karte, ohne sie umzubauen. Die Tabelle wird in deinem Browser gelesen und verlässt dein Gerät nicht.

## Das Wichtigste in Kürze

- **Eine Zeile je Zeitpunkt, eine Spalte je Reihe.** Reihen sind Länder, Gruppen, Produkte, Kategorien.
- **Erste Spalte ist die Zeit:** `2024`, `2024-03`, `03.2024`, `Q1 2024` oder `31.12.2024`.
- **In die Zelle nur die Zahl.** Die Einheit gehört in den Spaltenkopf, in Klammern: `Hunde (Mio.)`.
- **Leer heißt „nicht erhoben“, 0 heißt null.** Eine leere Zelle wird überbrückt oder ausgelassen, eine 0 wird gezeichnet.
- **Spalten, die mit `Summe:` beginnen, sind keine Reihe**, sondern eine Gesamtzahl, die das Studio gesondert zeigt.
- Dateien: `.xlsx`, `.xls`, `.ods`, `.csv`, `.tsv`. Bei Excel zählt nur das erste Blatt.

## Die Grundform

So sieht eine Tabelle aus, die das Studio ohne jede Einstellung versteht:

```csv
Jahr,Praxisinhaber,Angestellte in Praxen,Summe: Tierärztlich Tätige (Personen)
2019,12019,9350,31888
2020,12001,9732,32582
2021,11889,10227,32930
```

Die Werte sind die der Bundestierärztekammer. Die Summe ist größer als die beiden Spalten zusammen, weil sie auch Tierärztinnen und Tierärzte außerhalb von Praxen zählt – ein Grund, warum das Studio Summen nie selbst rechnet. Die erste Spalte darf beliebig heißen, entscheidend ist, dass darin Zeitangaben stehen. Jede weitere Spalte wird zu einem Balken, einer Linie oder einer Fläche auf der Karte. Die Reihenfolge der Spalten spielt keine Rolle, die Reihenfolge der Zeilen auch nicht: Das Studio sortiert nach der Zeit.

## Zeitangaben

| Schreibweise | Beispiel | wird gelesen als |
|---|---|---|
| Jahr | `2024` | Jahr |
| Monat | `2024-03`, `03.2024`, `03/2024`, `März 2024`, `Mar 2024` | Monat |
| Quartal | `Q1 2024`, `2024 Q1`, `2024-Q1`, `1. Quartal 2024` | Quartal |
| Tag | `2024-03-31`, `31.03.2024`, Excel-Datumszelle | Tag |

Fehlen bei Jahresdaten einzelne Jahre, ergänzt das Studio sie auf der Zeitachse, damit die Abstände stimmen. Lässt sich eine Zeitangabe gar nicht lesen, etwa `Saison 1`, behandelt das Studio die Zeilen als geordnete Schritte in der Reihenfolge der Tabelle und zeigt den Text so, wie er dasteht.

## Zahlen

- **Nur die Zahl in die Zelle.** `€`, `$`, `%`, Leerzeichen und Apostrophe werden entfernt, aber eine Zelle wie `ca. 12` oder `12 (geschätzt)` ist keine Zahl.
- **Am sichersten: ohne Tausendertrennzeichen und mit Punkt als Dezimaltrenner**, also `12125` und `42.9`. So liefern wir auch unsere eigenen CSV-Dateien aus.
- Deutsche Schreibweise funktioniert ebenfalls: `12,5` ist zwölfeinhalb, `1.234.567` eine gute Million. **Vorsicht bei genau einem Trennzeichen mit drei Ziffern danach:** `1.250` wird als 1.250 (Tausend zweihundertfünfzig) gelesen, `1,250` als 1,25. Wer Dezimalzahlen mit drei Nachkommastellen hat, schreibt sie ohne Tausendertrenner und mit Punkt, oder gibt sie in Excel als Zahl ein.
- **Keine Formeln, keine verbundenen Zellen, keine Summenzeile unten.** Eine Summenzeile wäre für das Studio ein weiterer Zeitpunkt, Summen gehören als eigene Spalte in die Tabelle.

## Leere Zellen und Nullen

Eine leere Zelle heißt: Für diesen Zeitpunkt gibt es keinen Wert. Was das Studio damit macht, stellst du unter **Datenlücken auffüllen** ein: zwischen zwei bekannten Werten interpolieren, den letzten Wert halten oder die Lücke stehen lassen.

Leere Zellen am Anfang einer Spalte bedeuten: Die Reihe gab es noch nicht. Sie erscheint erst mit ihrem ersten Wert. Eine 0 dagegen ist ein echter Wert und wird gezeichnet. Schreib deshalb nie 0 für „gab es noch nicht“ oder „unbekannt“.

## Summenspalten

Eine Spalte, deren Kopf mit `Summe:`, `Gesamt:` oder `Total:` beginnt, ist nie eine normale Reihe:

- **Bar Race:** ausgeblendet, sonst wäre sie ein Balken, der alle anderen überragt.
- **Line Race:** große mitlaufende Zahl oben links, statt einer Linie, die die Achse hochzieht.
- **Karte:** kleine Linie mit dem aktuellen Wert im Seitenpanel.

Aufbau: `Summe: <Name> (<Einheit>)`, zum Beispiel `Summe: Hunde (Mio.)`. **Die Summe steht in der Tabelle, sie wird nicht gerechnet.** Anteile lassen sich nicht addieren, und fehlende Länder würden stillschweigend fehlen. Wer die Summe liefert, weiß, wie sie entstanden ist.

## Andere Tabellenformen

Das Studio erkennt zwei weitere Formen von selbst:

- **Lang:** drei Spalten Zeit, Name, Wert, eine Zeile je Kombination, also `2024,Bayern,8938`. Praktisch, wenn die Daten aus einer Datenbank kommen.
- **Gedreht:** Reihen in den Zeilen und Jahre in den Spaltenköpfen, wie viele Statistikämter veröffentlichen.

Unter **Spaltenzuordnung** im Studio lässt sich korrigieren, welche Spalte Zeit, Name oder Wert ist, falls die Erkennung danebenliegt.

## Je Diagrammart

Dieselbe Tabelle passt für alle drei, aber jede Diagrammart hat eigene Stärken und ein paar eigene Regeln:

- [Bar Race](bar-race.html): Rangfolgen, die sich über die Zeit verschieben. Bis zu 30 Balken gleichzeitig.
- [Line Race](line-race.html): Entwicklungen über lange Zeiträume, auch mit zweiter Achse für eine andere Einheit.
- [Karte](karte.html): Werte je Land oder Bundesland, als Verlauf oder in Stufen um einen Kipppunkt.
- [Einstellungen](einstellungen.html): was jede Option im Studio bewirkt, von der Videolänge bis zum Wasserzeichen.

## Deine Daten bleiben auf deinem Gerät

Das Studio ist eine Seite, die vollständig in deinem Browser läuft. Für deine Tabelle heißt das:

- **Sie wird nicht hochgeladen.** Das Programm liest die Datei direkt in deinem Browser. Es gibt keinen Server, der sie entgegennimmt.
- **Sie wird nicht gespeichert.** Die Tabelle liegt nur im Arbeitsspeicher des geöffneten Tabs. Lädst du die Seite neu oder schließt den Tab, ist sie weg.
- **Gespeichert werden nur Einstellungen**, im lokalen Speicher deines Browsers: Gestaltung, Videolänge, Titel, Untertitel, Quellenangabe und der Text des Wasserzeichens. Hochgeladene Bilder, Flaggen, Farben je Reihe und Logos werden nicht gespeichert. Den lokalen Speicher kannst du jederzeit in den Browser-Einstellungen löschen.
- **Das Video entsteht in deinem Browser.** Eine Ausnahme gibt es: Beherrscht dein Browser keine eingebaute Videokodierung, lädt das Studio beim Export einmalig das Programm ffmpeg.wasm (rund 30 MB) von jsDelivr nach. Dabei sieht jsDelivr wie bei jedem Abruf deine IP-Adresse, deine Tabelle und deine Bilder werden nicht übertragen.
- **Ich als Betreiber habe keinen Zugriff** auf deine Tabellen, Bilder oder Videos. Sie kommen nie bei mir an.

Was beim Aufruf der Seite selbst an Verbindungsdaten anfällt, steht in der [Datenschutzerklärung](../datenschutz.html).

**Ob du bestimmte Daten verwenden und das Video veröffentlichen darfst, entscheidest und verantwortest du selbst.** Dass die Verarbeitung lokal läuft, ersetzt keine Prüfung, ob etwa personenbezogene, vertrauliche oder lizenzierte Daten in ein Video gehören.

## Für KI-Assistenten: Datensätze erzeugen lassen

Diese Seite ist so geschrieben, dass ein KI-Assistent daraus eine passende Tabelle bauen kann. Alle Regeln stehen zusammen in einer Datei: [datenformat.md](datenformat.md). Einen Prompt zum Kopieren:

```text
Erstelle eine CSV-Tabelle für das Studio von Tiermedizin in Zahlen
(Regeln: https://tiermedizin-in-zahlen.org/datenformat/datenformat.md).

Thema: <was gezeigt werden soll>
Zeitraum: <von–bis>, Takt: <Jahr | Monat | Quartal>
Reihen: <Länder, Gruppen, Kategorien>
Diagrammart: <Bar Race | Line Race | Karte>

Regeln:
- Erste Zeile Spaltenköpfe, erste Spalte die Zeit, eine Spalte je Reihe.
- Komma als Trennzeichen, Punkt als Dezimaltrenner, keine Tausendertrenner.
- Einheit in den Spaltenkopf in Klammern, in die Zellen nur Zahlen.
- Leere Zelle, wenn es keinen Wert gibt, niemals 0 als Platzhalter.
- Gesamtwerte als eigene Spalte „Summe: Name (Einheit)“, nicht als Zeile.
- Für Karten: Ländernamen auf Deutsch, Englisch oder als ISO-Code,
  Bundesländer mit amtlichem Namen.

Gib unter der Tabelle für jede Spalte die Quelle an und markiere,
welche Werte belegt, geschätzt oder interpoliert sind.
Erfinde keine Werte: Wo du keinen Beleg hast, bleibt die Zelle leer.
```

**Prüfe, was zurückkommt.** KI-Assistenten finden und ordnen Zahlen schnell, liefern aber auch Werte, die plausibel klingen und nicht stimmen. Jede Zahl, die in ein veröffentlichtes Video geht, sollte eine Quelle haben, die du selbst geöffnet hast.

## Vorlagen

Fertige Tabellen nach diesem Format, jeweils als Excel und CSV:

- [Zeitreihe](../vorlagen/vorlage-zeitreihe.xlsx) ([CSV](../vorlagen/vorlage-zeitreihe.csv)): zwei Reihen über 35 Jahre, für Bar Race und Line Race.
- [Weltkarte](../vorlagen/vorlage-weltkarte.xlsx) ([CSV](../vorlagen/vorlage-weltkarte.csv)): Länder in gemischter Schreibweise und zwei Summenspalten.
- [Bundesländer](../vorlagen/vorlage-bundeslaender.xlsx) ([CSV](../vorlagen/vorlage-bundeslaender.csv)): alle 16 Länder mit amtlichem Namen.

Eine Schritt-für-Schritt-Anleitung mit Screenshots gibt es für die Karte: [Weltkarte nach Daten einfärben und animieren](../beitrag/weltkarte-laender-einfaerben-animieren.html).

## Häufige Fragen

### Werden meine Daten hochgeladen?

Nein. Das Studio liest die Tabelle in deinem Browser und hält sie nur im Arbeitsspeicher des geöffneten Tabs. Nach dem Neuladen ist sie weg. Gespeichert werden lokal nur Einstellungen wie Titel und Gestaltung, nie die Tabelle.

### Kann ich meine Excel-Tabelle direkt verwenden?

Ja, wenn das erste Blatt die Form hat: erste Zeile Spaltenköpfe, erste Spalte die Zeit, darunter nur Zahlen. Verbundene Zellen, Zwischenüberschriften und Summenzeilen vorher entfernen.

### Was passiert mit einer leeren Zelle?

Sie heißt „kein Wert“. Zwischen zwei bekannten Werten wird je nach Einstellung interpoliert oder der letzte Wert gehalten, am Anfang einer Spalte beginnt die Reihe einfach später. Eine 0 wird dagegen als echter Wert gezeichnet.

### Kann ich mit ChatGPT oder Claude einen Datensatz dafür erzeugen?

Ja. Gib dem Assistenten den Prompt von dieser Seite oder die Datei datenformat.md. Prüfe die Werte danach gegen die Quellen, bevor du ein Video veröffentlichst.

### Wie viele Reihen und Zeitpunkte gehen?

Im Bar Race sind bis zu 30 Balken gleichzeitig sichtbar, im Line Race bis zu 30 Linien hervorgehoben, auf der Weltkarte alle Länder. Die Zahl der Zeitpunkte bestimmt nur, wie schnell das Video läuft, die Gesamtlänge stellst du selbst ein.
