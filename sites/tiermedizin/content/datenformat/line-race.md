---
slug: line-race
titel: Line Race: Daten für ein Linienrennen vorbereiten
menue: Line Race
beschreibung: Welche Tabelle ein animiertes Liniendiagramm braucht, wann eine zweite Achse hilft und warum Gesamtzahlen als Summenspalte besser sind als als Linie.
frage: Wie muss eine Tabelle für ein animiertes Liniendiagramm aussehen?
stand: 2026-10-02
reihenfolge: 3
grafik: inhaber-angestellte
bereit: ja
---
Ein Line Race braucht **eine Zeile je Zeitpunkt und eine Spalte je Linie**. Das Studio zeichnet die Linien Zeitpunkt für Zeitpunkt nach rechts, mit Name und aktuellem Wert am Ende jeder Linie, auf Achsen, die über den ganzen Zeitraum fest bleiben. Es eignet sich für Entwicklungen über lange Zeiträume und für den Moment, in dem sich zwei Kurven kreuzen.

## Das Wichtigste in Kürze

- **Eine Spalte je Linie.** Zwei bis sieben Linien sind gut lesbar, hervorgehoben werden die Top N (1 bis 30).
- **Die Achsen sind fest.** Die Skala springt nicht, die Linien wachsen in einen Rahmen hinein, der von Anfang an steht.
- **Zweite Achse für eine andere Einheit:** etwa Personen links, Millionen Tiere rechts.
- **Summenspalten** erscheinen als große mitlaufende Zahl oben links, nicht als Linie.
- **Eine Linie beginnt mit ihrem ersten Wert und endet mit ihrem letzten.** Sie wird nicht verlängert.

## Beispiel mit zweiter Achse

```csv
Jahr,Praxisinhaber,Angestellte in Praxen,Hunde und Katzen (Mio.)
2019,12019,9350,24.8
2020,12001,9732,26.4
2021,11889,10227,27
2024,11264,11990,26.4
2025,11216,12125,25.7
```

Werte der Bundestierärztekammer und von IVH/ZZF. Die Personen laufen auf der linken Achse. Die Hunde und Katzen legst du im Studio unter **Farben & Bilder** mit dem Knopf **Y2** auf die rechte Achse, sie werden dann gestrichelt gezeichnet. Die fehlenden Jahre 2022 und 2023 ergänzt das Studio auf der Zeitachse.

## Was gute Daten für ein Line Race ausmacht

- **Ähnliche Größenordnung auf einer Achse.** Eine Reihe mit 34.000 neben zwei mit 11.000 zieht die Achse so hoch, dass die beiden anderen flach am Boden liegen. Die große Reihe entweder weglassen, als `Summe:`-Spalte führen oder auf die zweite Achse legen.
- **Gesamtwerte als Summenspalte.** `Summe: Alle Gruppen (Standorte)` wird zur Zahl oben links, die mitläuft. Als Linie würde sie dasselbe Problem machen wie oben.
- **Nicht zu viele Linien.** Ab etwa acht Linien überlagern sich die Beschriftungen. Reihen außerhalb der Top N blendet das Studio stetig aus, statt sie blass stehen zu lassen.
- **Lange Zeiträume.** Ein Line Race wirkt ab etwa zehn Zeitpunkten. Für drei Jahre ist ein Bar Race oft besser.

## Lücken, Anfang und Ende

- **Leere Zelle zwischen zwei Werten:** je nach Einstellung **Datenlücken auffüllen** interpoliert (Voreinstellung), mit dem letzten Wert gehalten oder nicht aufgefüllt.
- **Leere Zellen am Anfang:** Die Linie beginnt später und blendet über einen Zeitschritt ein. So erscheint eine Gruppe, die es erst ab 2018 gibt, auch erst 2018.
- **Leere Zellen am Ende:** Die Linie endet mit ihrem letzten Wert und blendet aus. Anders als im Bar Race wird nichts fortgeschrieben.

Zwischen zwei Zeitpunkten verlaufen die Linien als glatte Kurve, die durch jeden echten Wert geht, ohne über- oder unterzuschießen.

## Was du im Studio einstellst

- **Hervorgehobene Linien (Top N):** wie viele Linien voll sichtbar sind.
- **Titel linke Achse** und **Titel rechte Achse**, etwa „Personen“ und „Hunde und Katzen in Mio.“.
- **Dezimalstellen rechts** und **Suffix rechts** für die zweite Achse, unabhängig vom Zahlenformat links.
- **Y2** je Reihe unter **Farben & Bilder**: legt die Reihe auf die rechte Achse.

Alle weiteren Optionen stehen unter [Einstellungen](einstellungen.html).

## Häufige Fragen

### Wie bekomme ich eine zweite Y-Achse?

Unter Farben & Bilder bei der Reihe auf Y2 klicken. Sie wird dann gestrichelt auf der rechten Achse gezeichnet. Titel, Dezimalstellen und Suffix der rechten Achse stellst du unter Linien & Achsen ein.

### Warum liegen meine Linien flach am Boden?

Meist zieht eine einzelne große Reihe die Achse hoch, oft eine Gesamtzahl. Benenne sie in `Summe: Name (Einheit)` um, dann erscheint sie als Zahl oben links, oder leg sie auf die zweite Achse.

### Warum endet eine Linie vor den anderen?

Weil ihre letzten Zellen leer sind. Das Line Race verlängert keine Reihe über ihren letzten Wert hinaus, damit keine Entwicklung gezeigt wird, die es nicht gibt.
