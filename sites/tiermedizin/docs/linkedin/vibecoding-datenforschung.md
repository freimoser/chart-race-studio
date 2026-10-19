# LinkedIn-Artikel: Vibecoding, Datenforschung und mehr

**Format:** LinkedIn-Artikel (nicht Post), Einschub nach Post 8, keine Postnummer.
**Stand:** 29.09.2026 · Entwurf. Stellen mit **[prüfen]** kann nur Thomas bestätigen.
**Titelbild:** Screenshot des Studios mit laufendem Line Race (1920 × 1080), etwa die Weltkarte oder Post 4.

---

## Titel

Vibecoding, Datenforschung und mehr: Wie „Tiermedizin in Zahlen“ entstanden ist

## Untertitel

Eine Datenseite zur deutschen Tiermedizin in zwei Wochen. Der Code war der kleinere Teil.

---

Am 14. September wollte ich ein animiertes Diagramm für einen LinkedIn-Post. Seit dem 27. September gibt es
eine eigene Seite: **tiermedizin-in-zahlen.org**, mit einem Studio für animierte Diagramme, zwölf
Datensätzen, einem Redaktionsplan und Artikeln zu jedem Post.

Geschrieben habe ich den Code nicht selbst, sondern ein KI-Agent **[prüfen: Anteil, den du selbst gemacht hast]**.
Das nennt man inzwischen Vibecoding. Hier steht, was dabei gut ging, was schiefging und warum die Daten
mehr Arbeit waren als die Software.

## Warum überhaupt

Die Statistik der Tierärzteschaft erscheint jedes Jahr im Deutschen Tierärzteblatt. Die Tabellen stehen dort,
jede für sich, über Jahrgänge verteilt. Wer wissen will, wie sich die Zahl der Praxisinhaber seit 1991 entwickelt
hat, muss drei Jahrzehnte Hefte zusammensuchen. Ein Bild, in dem man die Entwicklung sieht, gab es nicht.

Dasselbe gilt für Heimtierzahlen, Praxisschwerpunkte und Tierarztketten. Die Zahlen sind öffentlich, aber
verstreut.

## Vibecoding: schnell, aber nicht von allein richtig

Vibecoding heißt: Ich beschreibe, was entstehen soll, der Agent schreibt den Code, ich schaue mir das Ergebnis an
und sage, was nicht stimmt. Das Studio mit Balken- und Linienrennen und Videoexport stand am ersten Tag. Das Video
entsteht vollständig im Browser, keine Daten verlassen das Gerät.

Was ich unterschätzt hatte: **Schnell ist nicht dasselbe wie fertig.** Die ersten Linienrennen hatten
Geisterlinien, die blass stehen blieben, und Beschriftungen, die beim Kreuzen zweier Kurven sprangen. Beschrieben
ist so ein Fehler in einem Satz. Behoben war er erst, als es eine Prüfung gab, die jedes Video Bild für Bild
abfährt und jeden Sprung meldet. Heute sind das 10.740 Bilder über sieben Datensätze, ohne einen Sprung.

Das ist die wichtigste Lehre aus zwei Wochen Vibecoding: **Jeder Fehler, den man findet, braucht eine Prüfung, die
ihn wiederfindet.** Sonst kommt er mit der nächsten Änderung zurück. Die KI schreibt diese Prüfungen genauso schnell
wie den Code. Man muss sie nur verlangen.

## Datenforschung: der eigentliche Aufwand

Der Code war in Tagen fertig. Die Daten sind es bis heute nicht ganz. Drei Beispiele:

**Begriffe, die etwas anderes meinen, als man denkt.** In der Kammerstatistik heißen angestellte Tierärztinnen und
Tierärzte lange „Praxisassistenten“. Das sind keine Tiermedizinischen Fachangestellten, die zählt die Kammer gar
nicht. Und „tierärztlich tätig“ umfasst auch Veterinärämter, Industrie und Hochschulen, rund ein Drittel aller
Tätigen. Beides sah zuerst wie ein Zahlenfehler aus.

**Methodenbrüche.** Die Zahl der Hunde und Katzen springt 2012 von 13,6 auf 19,7 Millionen. Nicht weil über Nacht
sechs Millionen Tiere dazukamen, sondern weil die Verbände von einer Schätzung auf eine repräsentative Befragung
umgestellt haben. Wer über 2012 hinweg vergleicht, vergleicht zwei Methoden.

**Zahlen, die niemand erhebt.** Für Tierarztketten gibt es keine amtliche Statistik. Die einzige belastbare
Gesamtzahl stammt aus dem Tierärzte Atlas: rund 450 Standorte im August 2024. Für die Seite habe ich 13 Gruppen
Standort für Standort gezählt.

Die KI hilft hier enorm beim Suchen, Lesen und Zusammenführen. Sie liefert aber auch Zahlen, die plausibel
klingen und nicht stimmen. Für die Praxisschwerpunkte 2019 bis 2025 hatte sie eine saubere Trendschätzung
gerechnet. Die Bundestierärztekammer schreibt für 2023 selbst „gut ein Viertel Gemischtpraxen“, die Schätzung
lag bei 38 Prozent. Sie flog raus.

Seitdem gilt: **Jeder Wert hat eine Quelle und eine Markierung**, belegt, geschätzt oder interpoliert. Was
modelliert ist, steht als Beispieldaten auf der Seite, etwa die Weltkarte Hund oder Katze.

## Und mehr

**Artikel zu echten Fragen.** Zu jedem Post gibt es einen Artikel. Die Fragen dafür hat die KI zuerst selbst
formuliert: 30 Fragen, von denen genau 4 tatsächlich gesucht werden. Heute ist jede Zielfrage an echten
Suchanfragen gemessen.

**Ein eigener Datenstandard.** Wer mit dem Studio eigene Daten animieren will, findet Vorlagen und eine
Anleitung. Die Regeln sind klein: erste Spalte die Zeit, eine Spalte je Reihe, eine leere Zelle heißt „nicht
erhoben“, eine 0 ist eine echte Null.

**Offen.** Das Studio ist Open Source, der Code liegt auf GitHub, jede Zahl hat ihre Quelle auf der Seite.

## Was ich mitnehme

1. Mit KI zu bauen ist schnell. Richtig wird es durch Prüfungen, nicht durch Geschwindigkeit.
2. In der Datenarbeit ist die KI eine hervorragende Rechercheassistentin und eine schlechte Quelle.
3. Die meiste Zeit geht nicht ins Bauen, sondern ins Nachfragen: Was zählt diese Zahl eigentlich?

Visite 1 hat 30 Posts, sechs sind draußen. Die nächsten handeln davon, wem die Praxisgruppen gehören und wer neu gründet statt kauft.

Wenn ihr Daten kennt, die in die Reihe gehören, oder einen Fehler findet: Schreibt mir.

→ tiermedizin-in-zahlen.org

---

## Begleitpost zum Artikel

Zwei Wochen, eine Datenseite, fast kein selbst geschriebener Code. **[prüfen]**

Seit dem 27. September ist „Tiermedizin in Zahlen“ online. Gebaut mit einem KI-Agenten, was man inzwischen
Vibecoding nennt.

Der Code war der kleinere Teil. Der größere:
→ herausfinden, dass „Praxisassistenten“ in der Kammerstatistik angestellte Tierärzte sind
→ verstehen, warum die Zahl der Hunde und Katzen 2012 um sechs Millionen springt
→ 13 Praxisgruppen Standort für Standort zählen, weil es keine amtliche Zahl gibt

Was gut ging, was schiefging und was ich mitnehme, steht im Artikel.

#Vibecoding #KI #Tiermedizin #Datenjournalismus #OpenData

## Offen vor dem Veröffentlichen

- [ ] Anteil Eigenleistung am Code ehrlich angeben (Absatz 2 und Begleitpost)
- [ ] Werkzeug nennen oder nicht (Claude Code)? Für Glaubwürdigkeit empfohlen
- [ ] „sechs sind draußen“ am Veröffentlichungstag nachzählen
- [ ] Titelbild aus dem Studio exportieren
