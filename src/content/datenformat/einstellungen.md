---
slug: einstellungen
titel: Einstellungen im Studio: was jede Option bewirkt
menue: Einstellungen
beschreibung: Format, Videolänge, Texte, Achsen, Datenlücken, Farben, Zahlenformat und Wasserzeichen: alle Optionen des Studios mit ihren Voreinstellungen erklärt.
frage: Welche Einstellungen hat das Studio, und was bewirken sie?
stand: 2026-10-02
reihenfolge: 5
bereit: ja
---
Das Studio hat drei Bereiche: **Daten** zum Laden und Prüfen der Tabelle, **Gestaltung** für alles, was im Video zu sehen ist, und **Export** für die Datei. Die Voreinstellungen ergeben ein Video von 46 Sekunden: 1 Sekunde Standbild, 30 Sekunden Animation und 15 Sekunden Standbild am Ende. Alle Einstellungen bleiben im lokalen Speicher deines Browsers, die Tabelle nicht.

## Daten

- **Beispiel-Datensätze:** fertige Tabellen dieser Seite zum Ausprobieren, jede mit Dateninfo zu Quelle und Lücken.
- **Eigene Daten:** Datei hineinziehen oder wählen (`.xlsx`, `.xls`, `.ods`, `.csv`, `.tsv`), oder mit einer leeren Tabelle beginnen.
- **Spaltenzuordnung:** zeigt, ob das Studio die Tabelle im breiten, langen oder gedrehten Format erkannt hat, wie viele Zeitpunkte und Reihen, und lässt die Zuordnung korrigieren.
- **Kartenabgleich:** nur bei Karten. Zeigt, welche Spalten einer Fläche zugeordnet wurden und welche nicht.
- **Datenprüfung:** Fehler und Hinweise, etwa Zellen, die keine Zahl sind.
- **Tabelle bearbeiten:** Zellen direkt im Studio ändern und Spalten umbenennen.

## Format und Diagrammtyp

| Format | Größe | gedacht für |
|---|---|---|
| 16:9 | 1920 × 1080 | YouTube, Desktop, Präsentationen |
| 1:1 | 1080 × 1080 | Feed-Posts, passt überall |
| 4:5 | 1080 × 1350 | LinkedIn- und Instagram-Feed, die meiste Fläche im Feed |
| 9:16 | 1080 × 1920 | TikTok, Reels, Stories |

Dazu der **Diagrammtyp**: [Bar Race](bar-race.html), [Line Race](line-race.html) oder [Karte](karte.html), und das Farbschema hell oder dunkel. Ein Formatwechsel setzt die Zahl der sichtbaren Balken auf die Voreinstellung des Formats.

## Zeit und Ablauf

- **Animationsdauer:** wie lange die Zeit abläuft, 2 bis 120 Sekunden am Regler, im Feld bis 900. Voreingestellt sind 30 Sekunden, verteilt auf alle Zeitpunkte.
- **Dauer je Zeitschritt:** dasselbe von der anderen Seite, in Millisekunden je Zeitpunkt.
- **Standbild Anfang** (voreingestellt 1 Sekunde) und **Standbild Ende** (15 Sekunden): Das erste und das letzte Bild bleiben stehen. Beide sind Teil der Videodatei. Das lange Standbild am Ende gibt im Feed Zeit, die Zahlen zu lesen.
- **Zwischenschritte je Periode:** nur im Bar Race, 1 bis 8.
- **Vorschau in Schleife:** nur für die Vorschau, nicht für das Video.

## Texte

- **Titel**, **Untertitel** und **Quellenangabe** erscheinen im Video oben und unten. Beispiel-Datensätze bringen sie mit.
- **Ausrichtung:** links oder zentriert.
- **Periode anzeigen (Datumszähler):** die große Jahreszahl im Bild, mit wählbarem **Datumsformat**, je nachdem, ob die Tabelle Jahre, Monate, Quartale oder Tage enthält.

## Je Diagrammart

- **Bar Race – Balken & Beschriftung:** Sichtbare Balken (Top N), Kategorie-Labels außerhalb oder im Balken, Eckenrundung, Feste Achse.
- **Line Race – Linien & Achsen:** Hervorgehobene Linien (Top N), Titel der linken und rechten Achse, Dezimalstellen und Suffix rechts. Die Achsen sind immer fest.
- **Karte – Karte & Beschriftung:** Zeilen der Rangliste, Farbstufen um einen Kipppunkt mit Namen für beide Seiten, Überschrift der Zählung. Die Farbskala ist immer fest.
- **Datenlücken auffüllen**, für alle drei: **Interpolieren** (Voreinstellung) rechnet zwischen zwei bekannten Werten gleichmäßig weiter, **Letzten Wert** hält den vorigen Wert, **Nicht** lässt die Lücke und ergänzt auch keine fehlenden Jahre.

## Farben und Bilder

- **Palette:** sechs Farbreihen, von Freimoser bis Monochrom. Beispiel-Datensätze bringen teils feste Farben je Reihe mit.
- **Je Reihe:** eigene Farbe, eine Flagge oder ein hochgeladenes Bild, im Line Race der Knopf **Y2** für die rechte Achse.
- **Bilder/Flaggen anzeigen** und **Bildgröße**.
- **Farben & Bilder zurücksetzen** stellt alle Reihen auf die Palette zurück.

Farben, Flaggen und Bilder je Reihe werden nicht gespeichert, sie gelten nur, solange der Tab offen ist.

## Zahlenformat

- **Dezimalstellen**, 0 bis 4.
- **Präfix** und **Suffix / Einheit**, etwa `€ ` vor oder ` Mio.` hinter der Zahl.
- **Tausendertrennzeichen**, voreingestellt an.
- **Kompakt (1,2 Mio.)** kürzt große Zahlen ab.

## Wasserzeichen

- **Wasserzeichen einbrennen:** Name oder Handle als Text, dazu optional ein **Logo**. Das Logo wird auf höchstens 512 Pixel verkleinert und nicht gespeichert.
- **Position** in einer der vier Ecken, **Deckkraft** und **Größe**.

## Export

- **Video exportieren:** MP4 mit H.264, 30 Bilder pro Sekunde, ohne Tonspur, in der Größe des gewählten Formats. Das Video wird Bild für Bild in deinem Browser berechnet und ist deshalb ruckelfrei, auch auf einem langsamen Rechner, es dauert dort nur länger.
- **Aktuelles Vorschaubild als PNG:** ein Standbild, etwa als Titelbild für einen Artikel.

Im LinkedIn-Editor erscheinen links und rechts schwarze Ränder. Das ist nur die Vorschau des Editors, nicht Teil des Videos.

## Häufige Fragen

### Wie lang wird mein Video?

Standbild am Anfang plus Animationsdauer plus Standbild am Ende, voreingestellt 1 plus 30 plus 15, also 46 Sekunden. Unter Zeit & Ablauf steht die Gesamtlänge immer aktuell.

### Welches Format ist das beste für LinkedIn?

4:5 mit 1080 × 1350 Pixeln bekommt im Feed die meiste Fläche. 1:1 passt überall, 16:9 wirkt im Feed klein.

### Bleiben meine Einstellungen gespeichert?

Ja, im lokalen Speicher deines Browsers: Format, Gestaltung, Videolänge, Texte und Wasserzeichentext. Farben und Bilder je Reihe, das Logo und die Tabelle selbst werden nicht gespeichert.
