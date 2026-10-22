# PVS-Installationen laut KBV – Zeitreihe 1997–2025 (Recherche 20.10.2026)

Grundlage für ein Bar Chart Race „Praxisverwaltungssysteme in der ambulanten Versorgung“ auf *Humanmedizin in Zahlen*.
Zugehörige Daten: `pvs-kbv-installationen.csv` (nur belegte Werte aus KBV-Berichten, 2010/2011 teils aus der Ärzte Zeitung, die die KBV zitiert; Long-Format, keine Schätzungen). Alle Abrufe am 20.10.2026.

## 1. Kurzfazit

- **Abgedeckt:** 32 Stichtage zwischen 1997 und 2025, davon 13 Jahresenden (Q4): 1997, 2007, 2010 (nur Top 5 + Summe,
  Zweitquelle Ärzte Zeitung), 2011 (nur Summe), 2013, 2014, 2015, 2016, 2021, 2022, 2023, 2024, 2025. Dazu Quartale
  2010/2011 (teilweise), 2013–2016 und 2021–2025. Vollständige Systemlisten: 2007, 2013–2016, 2021–2025.
- **Große Lücken (keine absoluten Zahlen auffindbar):** 1998–2006, 2008–2009 und 2012 je System (2010/2011 nur die
  größten), **2017–2020**. Von
  Q3/2017 bis Q3/2020 hat die KBV nur noch **Prozentanteile mit einer Nachkommastelle** veröffentlicht, ohne
  Installationszahlen und ohne Gesamtsumme (belegt für Q3/2017, Q4/2017, Q3/2020, siehe Abschnitt 5).
- **Was die Daten tragen:** Rangfolge und Trend der Systeme, gemessen an der Zahl der Praxen bzw. Abrechnungsstellen,
  die mit dem System abrechnen. **Nicht:** Umsatz, Ärztezahl, Arbeitsplätze, Zufriedenheit.
- **Wichtigste Verzerrung:** Die Psychotherapie-Systeme Elefant und psyprax führen die Gesamtliste seit Q4/2023 (Elefant 11.026 vor MEDISTAR 10.966) nur, weil
  psychotherapeutische Praxen fast immer Einzelpraxen sind und als eigene Arztgruppe mitgezählt werden. Der Anteil der
  Arztgruppe Psychotherapeuten an allen Installationen stieg von 10,6 % (2007) über 20,5 % (2014) auf rund 30 % (2025).
  Eine Reihe „nur ärztliche Praxen“ ist ab 2007 für die Jahre mit Arztgruppen-Bericht rechenbar (Abschnitt 6).

## 2. Was die Zahl misst (Methodik der KBV)

Wörtliche Hinweise der KBV (jeweils kurz zitiert):

- Heute (kbv.de, Infothek): „Entscheidend für die Statistikberechnung ist die Prüfnummer, die mit der KV-Abrechnung
  übermittelt wird.“ und: die Statistiken können „kein genaues Abbild des tatsächlichen Marktes wiedergeben“.
  <https://www.kbv.de/infothek/zahlen-und-fakten/pvs-installationsstatistiken>
- KBV-Seite „EDV-Statistik“ 2011: Die Statistiken geben „die Anzahl der Praxen, die ADT-Abrechnungen mit einem
  zugelassenen Softwaresystem durchgeführt haben“, wieder; Daten kommen von den KVen, „keine Korrektur der gelieferten
  Daten“. <https://web.archive.org/web/2011/http://www.kbv.de/ita/4198.html>
- KBV 1998 (Top 60, Abrechnungsquartal 4/97): gezählt werden „gemeldete Praxen, die im bezogenen Abrechnungsquartal die
  ADT-Abrechnung“ mit einem zugelassenen System durchgeführt haben.
  <https://web.archive.org/web/19980702054133/http://www.kbv.de:80/itarzt/statisti/02_to60s.htm>
- Berichtskopf seit 2021: „Installationsbestand gemäß ADT-Abrechnungen“; die Spalte heißt „Installationen“.

Was daraus folgt:

1. **Einheit = Abrechnung je Quartal mit einer Prüfnummer**, praktisch eine abrechnende Praxis/Betriebsstätte. Nicht
   Ärzte, nicht Lizenzen, nicht Arbeitsplätze. Eine große Gemeinschaftspraxis zählt wie eine Einzelpraxis. Systeme mit
   vielen Einzelpraxen (Psychotherapie) erscheinen dadurch groß, Systeme für MVZ und große Praxen (z. B. M1 PRO, KIS) klein.
2. **Jede Installation gehört genau einer Arztgruppe an.** Gegenprobe Q4/2014: Die aus den 23 Arztgruppen-Berichten
   (Anteil und Zahl des Erstplatzierten) hochgerechneten Gruppensummen ergeben 119.396, die Gesamtsumme ist 119.405.
   Damit ist „Gesamt minus Arztgruppe Psychotherapeuten“ eine saubere Rechnung.
3. **Quartalswerte, keine Jahreswerte.** Stichtag = Ende des Abrechnungsquartals. Veröffentlicht wird mit großem Verzug
   (Datenstand 31.12.2025 erschien am 05.10.2026; 2021–2024 lag der Verzug bei 9–12 Monaten).
4. **KBV korrigiert nicht und revidiert gelegentlich still.** Beispiel: Medical Office Q2/2021 = 9.508 im Bericht Q2/2021,
   aber 4.754 als Vorquartal im Bericht Q3/2021 (Doppelzählung, Gesamtsumme dadurch 124.160 statt 119.408). Der
   Vorquartalswert Q1/2021 (9.210) ist nie korrigiert worden und deshalb in der CSV **ausgelassen**, ebenso die Summe
   Q1/2021 (123.842). Prozentangabe Q3/2020 (3,8 %) bestätigt die Größenordnung ~4.500.
5. **Basis 1997 ist eine andere Welt:** 1997 rechneten nur rund 69.000 Praxen per EDV ab (Basis 69.252). Der Anstieg
   bis 2007 (114.244) ist überwiegend Digitalisierung, nicht Marktwachstum. Auch 2007→2014 wächst die Arztgruppe
   Psychotherapeuten von 12.147 auf 24.451 – Psychotherapeuten stiegen in die EDV-Abrechnung ein.
6. **Mehrfachzählung:** Eine Praxis, die in einem Quartal mit zwei Systemen abrechnet (Wechselquartal, mehrere
   Betriebsstätten), kann zweimal gezählt werden. Die KBV dokumentiert das nicht. Systemwechsel erscheinen deshalb
   in den Quartalsdaten mit Verzögerung und können kurzzeitig doppelt zählen (nicht belegt, Plausibilitätsannahme).
7. **Namen und Zeilen:** Vor 2021 ist die Zeile ein Produktname, ab 2021 trägt jede Zeile eine KBV-Id (z. B. 280 = CGM
   MEDISTAR). Umbenennungen bei gleicher Id: PSYPRAX → psyprax (2023, kurz zwei Zeilen), MEDISTAR → CGM MEDISTAR →
   CGM MEDISTAR BLACK PRO, RED Medical Erlkönig → RED medical classic (456), inSuite → ETERNO Cloud (488),
   MEDICO WIPS → CGM MEDICO (226), COMPUMED M1 → CGM M1 PRO (252). 2007 stehen manche Produkte in zwei Zeilen
   (TURBOMED # 12.747 und TurboMed 334; PROFIMED win 825 und PROFIMED 97; DAVID 2.091 und David 21) – in der CSV nur die
   große Zeile. Die Bedeutung von „#“ und „*“ hinter Namen 2007 ist im Bericht nicht erklärt.

## 3. Quellen je Stichtag

Jeder KBV-Bericht enthält das Berichtsquartal und ein Vergleichsquartal (bis 2016: Vorjahresquartal; ab 2021:
Vorquartal). Liegt ein Stichtag in zwei Berichten vor, gilt der **neuere** Bericht (Revisionen siehe unten).

| Stichtag(e) in der CSV | Bericht (Datenstand) | Fundstelle | Format |
|---|---|---|---|
| 31.12.1997 | Top 60 Systeme, Abrechnungsquartal 4/97, Stand 31.03.1998 | <https://web.archive.org/web/19980702054133/http://www.kbv.de:80/itarzt/statisti/02_to60s.htm> | HTML, nur Top 60 + Gesamt 69.252 |
| 31.12.2007 | Installationsstatistik – Systeme, Stand 31.12.2007 | Wayback 20090420180852 von `daris.kbv.de/daris/doccontent.dll?…DocId=003734920` (volle URL in CSV) | PDF, alle Systeme, Gesamt 114.244 |
| 30.06.2011, 31.12.2011 (nur Summe) | Installationsstatistik – **Anbieter**, Stand 30.06.2011 bzw. 31.12.2011 | Wayback 20120301232359 bzw. 20120818050438, `daris.kbv.de …DocId=003734919` | PDF, nur Hersteller; Summe 118.456 / 118.802 |
| 31.03.2013, 31.03.2014 | Systeme, Stand 31.03.2014 | <https://web.archive.org/web/20150122073852/http://www.kbv.de/media/sp/Gesamt_Systeme_Installationen.pdf> | Gesamt 118.879 / 118.001 |
| 30.06.2013, 30.06.2014 | Systeme, Stand 30.06.2014 | <https://web.archive.org/web/20150614193042/http://www.kbv.de/media/sp/Gesamt_Systeme_Installationen.pdf> | Gesamt 118.926 / 117.879 |
| 31.12.2013, 31.12.2014 | Systeme, Stand 31.12.2014 | <https://web.archive.org/web/20151224061806/http://www.kbv.de/media/sp/Gesamt_Systeme_Installationen.pdf> (identisch im ZIP <https://web.archive.org/web/20160411073106/http://www.kbv.de/media/sp/Gesamt_EDV_Statistiken.zip>) | Gesamt 119.405 / 118.303 |
| 30.09.2015, 30.09.2016 | Systeme, Stand 30.09.2016 | <https://web.archive.org/web/20170329061710/http://www.kbv.de/media/sp/Gesamt_Systeme_Installationen.pdf> | Gesamt 120.084 / 119.754 |
| 31.12.2015, 31.12.2016 | Systeme, Stand 31.12.2016 | <https://web.archive.org/web/20171102045731/http://www.kbv.de/media/sp/Gesamt_Systeme_Installationen.pdf> | Gesamt 120.379 / 120.039 |
| (nur %) 30.09.2017 | Systeme, Stand 30.09.2017 | <https://web.archive.org/web/20180619111854/http://www.kbv.de/media/sp/Gesamt_Systeme_Installationen.pdf> | nur %-Anteile |
| (nur %) 31.12.2017 | Systeme, Stand 31.12.2017 (Kopie) | <https://pdf4pro.com/view/installationsstatistik-systeme-kbv-3cebc.html> | nur %-Anteile, Drittkopie |
| (nur %) 30.09.2020 | Systeme, Stand 30.09.2020 | <https://web.archive.org/web/20210423111206/https://www.kbv.de/media/sp/Gesamt_Systeme_Installationen.pdf> | nur %-Anteile |
| 31.03.2021, 30.06.2021 | Systeme, Datenstand 30.06.2021 (im ZIP) | <https://web.archive.org/web/20220419145239/http://www.kbv.de/media/sp/Gesamt_EDV_Statistiken.zip> | Id, %, Zahl, Vorquartal; kein Gesamt |
| 30.06.2021 (revidiert), 30.09.2021 | Datenstand 30.09.2021 | <https://web.archive.org/web/20220806224327/https://www.kbv.de/media/sp/Gesamt_Systeme_Installationen.pdf> | dto. |
| 31.12.2021, 31.03.2022 | Datenstand 31.03.2022 | <https://web.archive.org/web/20230204211945/https://www.kbv.de/media/sp/Gesamt_Systeme_Installationen.pdf> | dto. |
| 30.06.2022, 30.09.2022 | Datenstand 30.09.2022 (Kopie bei medatixx) | <https://arztsoftware.medatixx.de/fileadmin/user_upload/Aktuelles_Thema/20230828_PM_medatixx-KBV/20230824_KBV_Gesamt_Systeme_Installationen.pdf> | dto.; Herstellerkopie, Inhalt entspricht KBV-Layout |
| 31.12.2022, 31.03.2023 | Datenstand 31.03.2023 | <https://web.archive.org/web/20240108010839/https://www.kbv.de/media/sp/Gesamt_Systeme_Installationen.pdf> | dto. |
| 31.12.2023, 31.03.2024 | Datenstand 31.03.2024 | <https://web.archive.org/web/20250220083747/https://www.kbv.de/media/sp/Gesamt_Systeme_Installationen.pdf> | dto. |
| 31.12.2024, 31.03.2025 | Datenstand 31.03.2025 | <https://web.archive.org/web/20260324143850/https://update.kbv.de/ita-update/Service-Informationen/Installationsstatistiken/Gesamt_Systeme_Installationen.pdf> | dto. |
| 30.06.2025, 30.09.2025 | Datenstand 30.09.2025 (KBV-Update-Paket 2026/Q3) | <https://update.kbv.de/ita-update/Vorquartale/ita_update_2026_Q3/Service-Informationen/Installationsstatistiken/Gesamt_Systeme_Installationen.pdf> | dto. |
| 30.09.2025 (revidiert), 31.12.2025 | Datenstand 31.12.2025 (aktuell, Datei vom 05.10.2026) | <https://update.kbv.de/ita-update/Service-Informationen/Installationsstatistiken/Gesamt_Systeme_Installationen.pdf> | dto.; Verzeichnis: <https://update.kbv.de/ita-update/Service-Informationen/Installationsstatistiken/> |

Arztgruppe Psychotherapeuten (Top 20) – verwendet für Abschnitt 6:

| Stichtag(e) | Fundstelle |
|---|---|
| 31.12.2007 („Psychologische Psychotherapeuten und Kinder- und Jugendlichen-Psychotherapeuten“, Gesamt 12.147) | Wayback 20090519043826, `daris.kbv.de …DocId=003741063` |
| 31.12.2013, 31.12.2014 | ZIP 2016 (s. o.), `Arztgruppe_Psychotherapeuten.pdf` |
| 30.09.2015, 30.09.2016 (Gesamt 25.276 / 26.379) | <https://web.archive.org/web/20170713091640/http://www.kbv.de/media/sp/Gesamt_EDV_Statistiken.zip> |
| 30.09.2020, 31.12.2020 | <https://web.archive.org/web/20220122024450/https://www.kbv.de/media/sp/Arztgruppe_Psychotherapeuten.pdf> |
| 31.03.2021, 30.06.2021 | ZIP 2022 (s. o.) |
| 31.12.2021, 31.03.2022 | <https://web.archive.org/web/20230205043032/https://www.kbv.de/media/sp/Arztgruppe_Psychotherapeuten.pdf> |
| 30.09.2023, 31.12.2023 | <https://web.archive.org/web/20241228071504/https://www.kbv.de/media/sp/Arztgruppe_Psychotherapeuten.pdf> |
| 31.12.2024, 31.03.2025 | <https://web.archive.org/web/20260324143850/https://update.kbv.de/ita-update/Service-Informationen/Installationsstatistiken/Arztgruppe_Psychotherapeuten.pdf> |
| 30.06.2025 – 31.12.2025 | Update-Paket 2026/Q3 und aktuelles Verzeichnis (s. o.), `Arztgruppe_Psychotherapeuten.pdf` |

**Revisionen zwischen zwei Berichten** (neuerer gilt, in der CSV übernommen): Medical Office Q2/2021 9.508 → 4.754;
Summe Q2/2021 124.160 → 119.408; Summe Q3/2025 116.846 → 116.843. Alle übrigen Überschneidungen sind identisch.

**Summenzeile `__SUMME__`:** 1997, 2007, 2011, 2013–2016 = von der KBV gedruckte Zeile „Gesamt“. Ab 2021 druckt die KBV
keine Summe; dort ist `__SUMME__` die Spaltensumme der **vollständigen** KBV-Liste (alle 125–133 Zeilen). Gegenprobe über
die Prozentspalte: Abweichung unter 1 %. Drei bis vier Kleinstzeilen 2021 mit fehlender Prozentangabe wurden beim
Auslesen nicht erfasst (je 1–6 Installationen).

## 4. Abdeckung und Lücken

| Jahr (Q4) | Je System | Summe | Psychotherapeuten-Gruppe | Lücke füllbar über |
|---|---|---|---|---|
| 1997 | Top 60 | ja | nein (Fachgruppen-Top-10 1997 archiviert, nicht ausgewertet) | – |
| 1998–2006 | – | – | – | DARIS-Archiv der KBV nicht im Webarchiv; 2001 nur Anbieterzahlen im Ärzteblatt (Abschnitt 10) |
| 2007 | alle | ja | ja | – |
| 2008, 2009 | – | – (2009: 117.573 bzw. 114.772 laut Ärzte Zeitung, Stichtag unklar, nicht in CSV) | – | KBV-Seiten nannten Stand 31.12.2009; PDFs nicht archiviert |
| 2010 | Q2: 4 Systeme, Q4: Top 5 (Ärzte Zeitung zitiert KBV) | ja (115.440 / 117.453) | nein | übrige Systeme linear 2007–2013 |
| 2011 | Q2: Top 7 (Ärzte Zeitung) + alle Hersteller (KBV-Anbieterbericht); Q4: alle Hersteller | ja | nein | Anbieterwerte als Stütze für Einproduktanbieter (Abschnitt 9) |
| 2012 | – | – | – | – |
| 2013–2016 | alle | ja | ja (2013, 2014; 2015/2016 nur Q3) | – |
| 2017 | nur % (Q3, Q4) | nein | nein | Summe linear 2016→2021, × Anteil (gerechnet, markieren) |
| 2018, 2019 | – | – | – | linear zwischen Q4/2016 und Q4/2021, oder über Herstellerangaben |
| 2020 | nur % (Q3) | nein | ja (Q3, Q4: Top 20 mit Zahlen) | Anteil Q3/2020 × interpolierte Summe |
| 2021–2025 | alle | ja | ja (außer Q4/2022) | – |

**Regel nach DATENSTANDARD für die Grafik (nicht in der CSV, nur im späteren Datensatz):**
1. 1998–2006 und 2008–2012: linear zwischen 1997, 2007, 2010/2011 (soweit belegt) und 2013 je System (für Systeme, die es 1997 nicht gab, 0 bzw.
   „vor Markteintritt“ nur mit Beleg); bei Systemen ohne Wert 1997 alternativ Zeitraum erst ab 2007 zeigen.
   Empfehlung: Chart Race **ab 2007** (oder ab 2013) starten, 1997 nur als Fußnote/Vorspann – zwischen 1997 und 2007 hat
   sich Namens- und Herstellerlandschaft komplett verändert (DOC EXPERT, MCS-INA, COMPUMED-Produkte).
2. 2017–2020: Prozentanteile Q4/2017 und Q3/2020 sind KBV-belegt. Summe zwischen 120.379 (Q4/2016) und 119.405
   (Q4/2021) linear interpolieren, × Anteil → Installationen 2017 und 2020; 2018/2019 linear zwischen 2017 und 2020.
   Achtung: Anteile haben nur eine Nachkommastelle (±0,05 Pp ≈ ±60 Installationen).
3. Jede gerechnete Zahl markieren (Rohdatei, dataInfo, Post).

## 5. Prozent-Stichtage ohne Installationszahlen (KBV, %-Anteil an allen Installationen)

| System | Q3/2017 | Q4/2017 | Q3/2020 |
|---|---|---|---|
| MEDISTAR | 11,8 | 11,6 | 10,5 |
| TURBOMED | 10,2 | 10,1 | 8,8 |
| PSYPRAX | 8,7 | 8,8 | 9,1 |
| Elefant | 7,6 | 7,7 | 8,6 |
| x.isynet | 7,3 | 7,2 | 6,6 |
| x.concept | 4,8 | 4,8 | 4,3 |
| ALBIS | 4,8 | 4,7 | 4,2 |
| x.comfort | 3,5 | 3,5 | 2,8 |
| ORBIS | 3,3 | 3,4 | 3,4 |
| CGM M1 PRO | 3,1 | 3,1 | 2,8 |
| QUINCY WIN | 3,0 | 3,0 | 2,8 |
| Medical Office | 2,5 | 2,9 | 3,8 |
| SMARTY | 2,5 | 2,5 | 3,0 |
| Epikur | 2,1 | 2,1 | 3,2 |
| PsychoDat | 1,7 | 1,7 | 1,5 |
| DURIA | 1,6 | 1,6 | 1,7 |
| EL – Elaphe Longissima | 1,4 | 1,4 | 1,4 |
| medatixx | – | – | 1,5 |
| tomedo | 0,4 | 0,4 | 1,0 |
| T2med | <0,1 | 0,2 | 0,8 |

Quellen: Q3/2017 und Q3/2020 KBV über Webarchiv, Q4/2017 Drittkopie pdf4pro (Layout und Werte konsistent mit KBV,
aber keine KBV-Domain) – siehe Abschnitt 3. Auffällig: Medical Office springt von 2,5 % (Q3/2017) auf 2,9 % (Q4/2017).

## 6. Ärzte vs. Psychotherapeuten

**KBV-Daten nach Arztgruppe gibt es** – als „TOP 20 Systeme“ je Arztgruppe (23 Gruppen, u. a. Allgemeinmediziner,
Internisten, Psychotherapeuten, „KindundJugendPsychologen“ = laut Titel **Kinder- und Jugendpsychiater**, also Ärzte).
Aktuell: <https://update.kbv.de/ita-update/Service-Informationen/Installationsstatistiken/TOP_20_je_Fachgruppe.pdf>.
Bis 2016 mit Anteil an der Gruppe, daraus ist die Gruppensumme rechenbar; ab 2020 nur Zahlen der Top 20.

**Abgrenzung der Gruppe:** 2007 hieß sie „Psychologische Psychotherapeuten und Kinder und Jugendlichen
Psychotherapeuten“ (also nichtärztlich), daneben gab es eine eigene Gruppe „Psychiater“. Seit spätestens 2014 heißt sie
nur „Psychotherapeuten“; ob ärztliche Psychotherapeuten darin stecken, sagt die KBV nicht. Titel deshalb: „Praxen der
Arztgruppe Psychotherapeuten (laut KBV)“, nicht „psychologische Psychotherapeuten“.

**Größe der Arztgruppe Psychotherapeuten** (Installationen):

| Stichtag | Gesamt | Arztgruppe Psychotherapeuten | Anteil | Rest (ärztliche Gruppen inkl. KIS-Ambulanzen) |
|---|---|---|---|---|
| 31.12.2007 | 114.244 | 12.147 (KBV „Gesamt“) | 10,6 % | 102.097 |
| 31.12.2013 | 118.303 | ≈ 23.026 (aus PSYPRAX 8.722 = 37,88 %) | 19,5 % | ≈ 95.277 |
| 31.12.2014 | 119.405 | ≈ 24.451 (aus PSYPRAX 9.145 = 37,40 %) | 20,5 % | ≈ 94.954 |
| 30.09.2015 | 119.754 | 25.276 (KBV „Gesamt“) | 21,1 % | 94.478 |
| 30.09.2016 | 120.084 | 26.379 (KBV „Gesamt“) | 22,0 % | 93.705 |
| 31.12.2021 | 119.405 | ≥ 31.880 (Summe Top 20) | ≥ 26,7 % | ≤ 87.525 |
| 31.12.2023 | 118.521 | ≥ 33.586 | ≥ 28,3 % | ≤ 84.935 |
| 31.12.2024 | 117.571 | ≥ 34.462 | ≥ 29,3 % | ≤ 83.109 |
| 31.12.2025 | 116.954 | ≥ 35.271 | ≥ 30,2 % | ≤ 81.683 |

Die Top 20 decken die Gruppe fast vollständig ab (Platz 20 hat 25–30 Installationen). **Kernaussage:** Die Zahl der
ärztlichen Abrechnungsstellen mit PVS sinkt seit 2014 um rund 13.000 (Praxisaufgaben, Zusammenschlüsse, MVZ), die der
psychotherapeutischen steigt um rund 11.000. Die Gesamtsumme bleibt dadurch fast konstant – das verdeckt beide Trends.

**Gesamt / davon Arztgruppe Psychotherapeuten je System** („≤ n“ = nicht in den Top 20, also höchstens Platz-20-Wert):

| Stichtag | MEDISTAR | TURBOMED | ALBIS | x.isynet | medatixx | Medical Office | tomedo | T2med | psyprax | Elefant | Epikur | SMARTY | PsychoDat |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2007-12-31 | 14.838/36 | 12.747/66 | 7.470/31 | 8.760/640 | – | 576/≤14 | – | – | 7.241/4.928 | 3.443/2.812 | 615/531 | 1.401/999 | 1.806/1.586 |
| 2014-12-31 | 14.804/91 | 13.047/189 | 6.338/71 | 9.223/667 | – | 1.377/≤31 | 196/≤31 | – | 9.720/9.145 | 7.555/7.205 | 1.822/1.677 | 2.640/2.300 | 2.166/2.115 |
| 2016-09-30 | 14.583/89 | 12.624/171 | 6.005/63 | 9.168/652 | – | 1.716/≤30 | 343/≤30 | 38/≤30 | 10.273/9.681 | 8.558/8.184 | 2.194/2.020 | 2.890/2.523 | 2.082/2.039 |
| 2021-12-31 | 11.992/66 | 9.690/102 | 4.741/51 | 7.627/496 | 2.467/33 | 4.891/41 | 1.658/87 | 1.483/≤27 | 11.067/10.572 | 10.840/10.476 | 4.481/4.146 | 3.950/3.514 | 1.827/1.797 |
| 2023-12-31 | 10.966/58 | 7.941/85 | 4.226/49 | 6.929/430 | 4.100/154 | 5.321/47 | 2.701/201 | 2.637/≤27 | 10.962/10.491 | 11.026/10.654 | 5.331/4.971 | 4.543/4.089 | 1.757/1.731 |
| 2024-12-31 | 10.369/48 | 7.108/75 | 3.954/47 | 6.572/400 | 4.988/373 | 5.571/59 | 3.360/353 | 3.332/≤27 | 10.845/10.407 | 10.983/10.647 | 5.728/5.373 | 4.787/4.334 | 1.733/1.704 |
| 2025-12-31 | 9.617/43 | 6.305/70 | 3.595/45 | 6.086/346 | 6.121/659 | 5.700/60 | 4.530/565 | 4.078/≤25 | 10.519/10.119 | 10.967/10.645 | 6.008/5.673 | 4.982/4.537 | 1.705/1.676 |

**Reihe „nur ärztliche Praxen“** = Gesamtwert − Wert in der Arztgruppe Psychotherapeuten (bzw. − Platz-20-Wert als
Obergrenze, wenn nicht gelistet; Fehler ≤ 30). Rechenbar für 2007, 2013, 2014, Q3/2015, Q3/2016, 2021, 2023, 2024, 2025;
Q4/2015 und Q4/2016 über Q3-Anteile, Q4/2022 fehlt der Gruppenbericht (linear 2021–2023). Für ein „ärztliches“ Chart
Race reicht es aber meist, die Psychotherapie-Systeme **wegzulassen**: Bei allen anderen großen Systemen liegt der
Psychotherapie-Anteil unter 6 % (Ausnahmen: x.isynet 6–7 %, medatixx 11 %, tomedo 12 %).

**Klassifikation je System** (Datengrundlage: Anteil der Installationen in der Arztgruppe Psychotherapeuten, Q4/2025):

| System | Klasse | Psychotherapie-Anteil | Beleg |
|---|---|---|---|
| Elefant (HASOMED) | psychotherapie | 97 % | KBV Arztgruppe; Hersteller: Praxissoftware für Psychotherapie (<https://www.elefant-praxissoftware.de/>) |
| psyprax | psychotherapie | 96 % | KBV; Hersteller nennt Psychotherapie, Ambulanzen, MVZ (<https://www.psyprax.de/>) |
| PsychoDat (ergosoft) | psychotherapie | 98 % | KBV; Herstellerseite „Praxissoftware Psychotherapie“ (<https://ergosoft.info/produkte/praxissoftware-psychotherapie-psychodat/>) |
| Epikur | psychotherapie | 94 % | KBV; Epikur bietet auch „e-medico“ für Ärzte |
| SMARTY | psychotherapie | 91 % | KBV; Hersteller: Psychotherapie, Psychiatrie, Anästhesie (<https://smarty-online.de/smarty-software/>) |
| RED Medical (Id 626) | psychotherapie | 84 % | KBV |
| RED medical classic (Id 456) | unklar | 57 % | KBV |
| x.isynet, medatixx, tomedo, alle CGM-Systeme, Medical Office, T2med, QUINCY, DURIA usw. | arzt | ≤ 12 % | KBV |
| ORBIS, SAP Ambulatory Care Management, CGM MEDICO (MEDICO WIPS), IMedOne, LORENZO, NEXUS/KIS, M-KIS, ClinicCentre Billing | kis | – | Krankenhausinformationssysteme; abgerechnet werden Ermächtigungs- und Hochschulambulanzen u. Ä. |
| esQlab.online, MaSc (KV-IT, Mammographie-Screening), RescuePro | unklar | – | Spezialanwendungen (Labor-, Screening-, Rettungs-/Notdienstabrechnung), kein klassisches PVS |

## 7. KIS-Zeilen

ORBIS (Agfa HealthCare, seit 2020 Dedalus), SAP Ambulatory Care Management (früher „SAP Ambulatory Care“, SAP-Modul
IS-H), MEDICO WIPS (Siemens → Cerner → seit 2020/21 CGM Clinical, heute „CGM MEDICO“), IMedOne (Telekom), LORENZO
SolutionCentre (iSOFT, nur 2007 groß) stehen für ambulante Abrechnungen aus Krankenhäusern. In der CSV `klasse=kis`.
Zusammen 6–7 % aller Installationen. Für eine Praxis-Grafik herausnehmen oder als „Klinik-Ambulanzen“ zusammenfassen.

## 8. Hersteller und Übernahmen

Belege aus Ärzteblatt, Ärzte Zeitung, CGM-Abschlüssen und Herstellerseiten (Kurzzitate). „Unbelegt“ heißt: gesucht,
nicht gefunden.

**CompuGroup Medical (CGM)**

| Ereignis | Datum | Beleg |
|---|---|---|
| Data Vital (Produkt DAVID): CompuGROUP Holding und Scholz Verlag übernehmen je 50 % | 1998 | DÄ 95/12, „jeweils 50 Prozent der Gesellschafteranteile“ – <https://www.aerzteblatt.de/pdf/95/12/s7.pdf> |
| Albis, Compumed (ARCOS, DORSYMED, später CompuMED-M1) und Data Vital gehören zu Compugroup; Kaufjahr Albis/Compumed **unbelegt** | spätestens 2002 | „Über die Systemhäuser Albis, Compumed und Data Vital“ – <https://www.aerzteblatt.de/archiv/36849/Compugroup-uebernimmt-Medistar> |
| Übernahme MEDISTAR (100 %), danach „rund 30 Prozent“ | 2002/03 (Praxis Computer 2/2003; apotheke adhoc nennt 2003) | wie oben; <https://www.apotheke-adhoc.de/nachrichten/detail/markt/portraet-compugroup-1/> |
| Mehrheit an TurboMed, danach „rund 42 Prozent“ im Arztsegment | Dez. 2003 | <https://www.aerzteblatt.de/archiv/compugroup-hat-mehrheit-an-turbomed-9aabbb04-38b1-4f05-b543-2b1ca7dddd9c> |
| Compumed + Data Vital → CompuGROUP Arztsysteme Deutschland (>10.500 Anwender) | 01.07.2009 | <https://www.ots.at/presseaussendung/OTE_20090630_OTE0005/> |
| Restliche 1 % an Turbomed gekauft | Dez. 2011 | CGM-Konzernabschluss 2011 – <https://archiv.hauptversammlung.de/assets/files/CompuGroup/2012/Konzernabschluss.pdf> |
| Albis, CGM Arztsysteme u. a. in CGM Deutschland AG verschmolzen (2011); Medistar Praxiscomputer GmbH und Turbomed EDV GmbH verschmolzen (2012) | 2011/2012 | Einzelabschluss 2013 – <https://archiv.hauptversammlung.de/assets/files/CompuGroup/2014/CGM_AG_Einzelabschluss2013_Testat.pdf> |
| MEDICO (KIS, von Siemens über Cerner) heute „CGM MEDICO“, Anbieter CGM Clinical | KBV-Anbieterfeld: 2007 Siemens, 2014–2016 Cerner, ab 2021 CGM Clinical | KBV-Berichte (Abschnitt 3); genaues Übernahmedatum hier nicht recherchiert |
| Namen in der KBV-Liste: „MEDISTAR“ bis Datenstand 31.03.2023, „CGM MEDISTAR“ ab 31.03.2024, „CGM MEDISTAR BLACK PRO“ ab 30.09.2025 (Id 280 durchgehend) | – | KBV-Berichte; Pressequelle zur Umbenennung unbelegt |
| CVC-Übernahmeangebot, Delisting zum 24.06.2025 | 2024/25 | CGM-Geschäftsbericht 2025 – <https://www.hauptversammlung.de/fileadmin/public/user_upload/CGM_GB25.pdf> |

CGM nennt in den Geschäftsberichten 2011–2025 **keine** Kundenzahl oder Marktanteil für deutsche Arztpraxen (2011/2013
„Marktführer“, 2020/2024 „Anbieter“, 2025 „führender Anbieter“ im Bereich Ambulatory Information Systems).

**medatixx**

| Ereignis | Datum | Beleg |
|---|---|---|
| Kooperation DOCexpert (Bamberg) und MCS (Eltville), zusammen „rund 21 Prozent Marktanteil“ | 2006 | <https://www.aerzteblatt.de/archiv/enge-kooperation-von-docexpert-und-mcs-0aa8fc78-bf51-4da5-9254-7d0e56ca2095> |
| Gründung medatixx aus DOCexpert Computer GmbH und MCS Arzt- und Ambulanzsysteme GmbH | 2007 | <https://unternehmen.medatixx.de/> |
| Produktnamen: „aus DOCconcept nun ixx.concept, aus MCS-ISYNET wird ixx.isynet“; über 31.000 ärztliche Anwender | ÄZ 14.04.2011 | <https://www.aerztezeitung.de/Wirtschaft/Neue-Namen-fuer-EDV-von-DOCexpert-und-MCS-278240.html> |
| Heute x.isynet (= MCS-ISYNET), x.concept (= DOCconcept), x.comfort (= DOCcomfort); Wechsel „ixx.“ → „x.“ zeitlich unbelegt; in der KBV-Liste schon 2014 „x.…“ | – | KBV 2014 |
| promedico (easymed) zu medatixx | 10/2011, verschmolzen 2018 | <https://unternehmen.medatixx.de/>; KBV-Anbieterbericht 31.12.2011 führt promedico noch getrennt |
| Neues Produkt „medatixx“ „seit 2014 auf dem Markt“ (KBV: 6 Installationen Q4/2014) | 2014 | <https://medatixx.de/news/detail/medizin-2023-vorbericht> |
| Softland (EL – Elaphe Longissima) integriert | April 2022 | <https://unternehmen.medatixx.de/> |
| mediDOK übernommen (Archiv, kein PVS) | Sept. 2025 | dto. |
| Eigentümer der medatixx-Gruppe | unbelegt | – |

**Weitere**

| Hersteller / System | Fakt | Beleg |
|---|---|---|
| FREY ADV (QUINCY) | DGN seit 2010 FREY-Tochter; S3 Praxiscomputer (S3-Win) und InterData (INTERARZT) gehören zur FREY-Gruppe (seit wann unbelegt); doctorly übernommen 05.06.2025 | <https://www.dgn.de/unternehmen/cloudbasierte-praxissoftware-doctorly-gehoert-jetzt-zur-frey-gruppe/> |
| Doc Cirrus (inSuite / ETERNO Cloud) | Eterno übernimmt 100 % (Sept. 2026) – also **nach** allen Stichtagen; KBV nennt das Produkt schon Q4/2025 „ETERNO Cloud (ehem. inSuite)“ | <https://www.healthcare-digital.de/eterno-uebernimmt-doc-cirrus-a-a578b9dd871ae6159fa1631a2119363a/> |
| Zollsoft (tomedo) | gegründet 2011, KBV-Zertifizierung Mitte 2013 (KBV: 7 Installationen Q4/2013) | <https://zollsoft.de/ueber-uns/> |
| T2med | 2012 gegründet von Dr. H. J. von der Burchard (1999 Geschäftsführer TurboMed), Markteinführung 2015 (KBV: 4 Installationen Q3/2015) | <https://t2med.de/nachfolge-t2med/>, <https://www.aerzteblatt.de/archiv/stellungnahme-von-turbomed-e6795c37-f414-470e-bfa1-7ea45bbe8d21> |
| INDAMED (Medical Office) | 1994 gegründet | <https://www.indamed.de/30-jahre-indamed/> |
| HASOMED (Elefant) | 1991 gegründet | <https://hasomed.de/unsere-vision-und-mission/> |
| ORBIS | Anbieter laut KBV bis 2016 Agfa HealthCare, ab 2021 Dedalus HealthCare | KBV-Berichte |

## 9. Hersteller-Ebene 2011 (KBV-Anbieterbericht)

KBV „Installationsstatistik – Anbieter“, Stand 30.06.2011 und 31.12.2011 (Fundstellen Abschnitt 3):

| Anbieter (KBV-Schreibweise) | 30.06.2011 | 31.12.2011 |
|---|---|---|
| medatiXX Medizinische Informationssysteme | 20.919 | 20.882 |
| MEDISTAR Praxiscomputer GmbH (CGM) | 14.986 | 15.080 |
| TurboMed EDV GmbH (CGM) | 13.273 | 13.271 |
| Psyprax GmbH | 8.777 | 8.831 |
| CompuGroup, Geschäftsbereich ALBIS | 7.140 | 7.087 |
| CompuGroup, Geschäftsbereich Arztsysteme (M1, DATA VITAL, DAVID …) | 6.225 | 6.115 |
| HASOMED GmbH | 5.699 | 5.913 |
| Frey ADV GmbH | 4.067 | 4.065 |
| Agfa HealthCare GmbH (ORBIS) | 3.648 | 3.690 |
| New Media Company (SMARTY) | 2.178 | 2.235 |
| ergosoft GmbH (PsychoDat) | 2.081 | 2.075 |
| DURIA eG | 1.811 | 1.809 |
| Mediamed Systec GmbH (S3-Win) | 1.777 | 1.827 |
| promedico (easymed) | 1.620 | 1.639 |
| Siemens AG, Healthcare (MEDICO) | 1.377 | 1.403 |
| Bitron GmbH (Med7) | 1.246 | 1.271 |
| Softland GmbH (EL) | 1.236 | 1.265 |
| Epikur | 1.068 | 1.267 |
| SAP AG | 1.076 | 1.104 |
| Data-AL GmbH | 1.045 | 1.051 |
| **Gesamt** | **118.456** | **118.802** |

Nutzbar als Stütze 2011 für Systeme, deren Anbieter 2011 nur ein nennenswertes Produkt hatte (psyprax, Elefant, SMARTY,
PsychoDat, DURIA, S3-Win, Med7, EL, Epikur, ORBIS) – das ist eine **Annahme**, also im Datensatz als gerechnet markieren.
Nicht nutzbar für einzelne medatixx- oder CGM-Produkte. Die Anbieter-Gesamtsumme ist dieselbe Basis wie die
System-Summe (in der CSV als `__SUMME__` 2011).

## 10. Zweitquellen und Widersprüche

**Presse, die KBV-Zahlen zitiert** (für Lücken nutzbar, Fundstelle nennen):

| Stichtag | Inhalt | Quelle |
|---|---|---|
| 30.09.2001 | nur **Anbieter**: Compugroup 13.250, Medistar 12.801, Doc-Expert-Gruppe 12.268, Turbomed 10.349, MCS 8.849, Frey 3.232 | <https://www.aerzteblatt.de/archiv/kbv-statistiken-zum-einsatz-von-praxis-edv-1600e669-ac26-48bc-917a-e5572b834214> |
| 30.06.2002 | Albis + Compumed + Data Vital 13.674, Medistar 13.346 | <https://www.aerzteblatt.de/archiv/36849/Compugroup-uebernimmt-Medistar> |
| 2008/2009 | Gesamt 114.772 (ÄZ 02.09.2009) bzw. „2009: 117.573“ (ÄZ 21.10.2011) – Stichtage unklar, **Widerspruch**, nicht in CSV | <https://www.aerztezeitung.de/Wirtschaft/MEDISTAR-bleibt-Spitzenreiter-in-den-Praxen-371138.html> |
| 30.06.2010, 31.12.2010 | Gesamt 115.440 / 117.453; MEDISTAR 14.524 / 14.487, TurboMed 13.365 / 13.427, MCS-ISYNET 9.022 / 9.066, ALBIS ON WINDOWS 7.261, DOCconcept 6.082 (Q4) – **in CSV** | ÄZ 21.10.2011 <https://www.aerztezeitung.de/Wirtschaft/Medistar-bleibt-bei-Praxis-EDV-Systemen-vorne-344045.html> |
| 30.06.2011 | Medistar 14.986, TurboMed 13.273, MCS-ISYNET 9.016, PSYPRAX 8.772 (2010: 6.198), ALBIS 7.140, Elefant 5.699, QUINCY WIN 4.065; 172 Systeme – **in CSV**; deckt sich mit dem KBV-Anbieterbericht (Psyprax 8.777, HASOMED 5.699) | ÄZ 27.02.2012 <https://www.aerztezeitung.de/Wirtschaft/Grosse-Spruenge-bei-der-Praxis-Software-270151.html> |
| 30.06.2023 | 130 Systeme, 76 davon unter 100 Installationen (DPtV nach KBV) | <https://www.dptv.de/fileadmin/Redaktion/Bilder_und_Dokumente/Wissensdatenbank_oeffentlich/Umfragen/DPtV_Umfrage_TI-PVS_2024.pdf> |
| 2026 | „etwa 130 Systeme bei 98.000 Praxen“ (AOK G+G 09/2026) | <https://www.aok.de/pp/gg/magazine/gesundheit-gesellschaft-09-2026/arztpraxis-softwaresysteme/> |

**Eigenangaben medatixx** (Praxen bzw. Ärzte, nicht KBV-Installationen): 2006 „rund 21 %“; 2011 „über 31.000 ärztliche
Anwender“; 06/2020 38.000 Ärzte in 21.000 Praxen, „rund 27 Prozent“
(<https://www.presse-blog.com/2020/06/24/medatixx-und-ehealth-tec-vereinbaren-strategische-partnerschaft-zur-deutschlandweiten-umsetzung-des-elektronischen-rezepts/>);
2025/26 „mehr als 30 %“ der Humanmediziner (Lobbyregister R003058); 2026 „über 22.500 Praxen“ (medatixx.de).
Produkt medatixx: „über 3.000 Praxen“ (PM 16.01.2023) vs. „über 4.000“ (PM 22.02.2023) – KBV Q4/2022: 3.257.
**Abgleich KBV:** medatixx-Gruppe 2021: 20.324 Installationen = 17,0 % aller bzw. ~23 % ohne Psychotherapeuten-Gruppe;
die Eigenangabe 27 % (2020) liegt darüber (andere Basis: Ärzte statt Abrechnungsstellen, eigene Marktabgrenzung).

**Umfragen** (messen Zufriedenheit, keine Marktanteile; gewichten aber nach KBV):
Zi-PVS-Monitoring 2024 (10.245 Bewertungen, 39 PVS) –
<https://www.aerzteblatt.de/news/grosse-unterschiede-bei-zufriedenheit-mit-praxisverwaltungssystemen-a376fad9-f74c-4915-8ce3-a6116473c817>;
Zi-Paper 32 vom 14.01.2026 (3.120 Teilnehmende, 32 PVS mit zusammen 77,4 % Marktanteil, Gewichtung nach
KBV-Statistik Q4/2024, KBV publiziert „mit einem Nachlauf von etwa einem Jahr“) –
<https://www.zi.de/fileadmin/Downloads/Service/Publikationen/Zi-Paper_32_FINAL.pdf>; DPtV-Umfrage 09/2024 (n = 2.770
Psychotherapeuten): Elefant 31 %, psyprax 24 %, Epikur 19 %, Smarty 15 % (KBV Q4/2023, Arztgruppe Psychotherapeuten:
Elefant 32 %, psyprax 31 %, Epikur 15 %, SMARTY 12 % – Epikur in der Umfrage überrepräsentiert). Statista: keine
PVS-Marktanteilsstatistik gefunden. Nicht verwenden: blog.aerzteversichert.de (sachlich falsch, z. B. „Turbomed
(Indamed)“).

**Widersprüche und offene Punkte**
- Installationen (~117.000) > Praxen (~98.000 laut AOK G+G): Gezählt wird je Abrechnung/Betriebsstätte bzw. Prüfnummer,
  nicht je Praxis. Psychotherapeutische Einzelpraxen und Nebenbetriebsstätten treiben die Zahl.
- PSYPRAX 30.06.2010 = 6.198 (ÄZ) gegenüber 7.241 am 31.12.2007 (KBV) und 8.772 am 30.06.2011: Einbruch und Sprung um
  41,5 % sind ungeklärt (mögliche Ursache: Zeilenaufteilung PSYPRAX / PSYPRAX ON WINDOWS oder Prüfnummernwechsel).
  Für die Grafik den Wert 2010 nicht als Stütze nehmen oder markieren.
- KBV-Prozentlücke 2017–2020: Auf der KBV-Seite 6989.php verschwindet zwischen 12/2016 und 11/2017 der Hinweis auf
  „Installationszahlen von Systemen und Anbietern“ (Wayback 20161226 vs. 20171112, <https://www.kbv.de/html/6989.php>).
  Grund unbelegt. Auch die Arztgruppen-Berichte (z. B. Stand 31.12.2018) enthielten nur Prozente.
- Medistar-Kauf 2002 oder 2003; Kaufjahre Albis und Compumed; Eigentümer medatixx: unbelegt.

## 11. Fallstricke für Titel und Aussagen

1. **Nicht „Marktanteil“ ohne Zusatz.** Korrekt: „Anteil an den Praxen, die mit dem System abrechnen (KBV-Installations­
   statistik)“. Die KBV sagt selbst: kein genaues Abbild des Marktes.
2. **Nicht „Ärzte nutzen …“.** Gezählt werden Abrechnungen/Praxen, nicht Köpfe. Eine MVZ-Installation = 1.
3. **Psychotherapie trennen oder benennen.** „Elefant ist die meistgenutzte Praxissoftware“ ist nach KBV-Zahl richtig,
   aber irreführend. Besser zwei Grafiken (Arztpraxen / Psychotherapie) oder Psychotherapie-Systeme farblich absetzen.
4. **Gesamt fast konstant ≠ stabiler Markt.** Ärztliche Abrechnungsstellen −13.000 seit 2014, psychotherapeutische
   +11.000.
5. **1997 nicht direkt mit heute vergleichen** (69.000 EDV-Praxen vs. ~117.000). Ab 2007 ist die Basis vergleichbar.
6. **Lücken 2017–2020 offenlegen.** Die KBV hat in dieser Zeit keine Installationszahlen veröffentlicht; jede Zahl dort ist
   gerechnet.
7. **Hersteller-Spalte der CSV = Eigentümer am Stichtag** (nach KBV-Anbieterfeld und Übernahmedaten). Für Grafiken die
   Eigentümerwechsel aus Abschnitt 8 berücksichtigen. In der CSV ist das bereits so umgesetzt (siehe Abschnitt 12).
8. **Produktwechsel innerhalb eines Herstellers** (x.comfort/x.concept/x.isynet → medatixx; bei CGM zwischen den
   eigenen Linien, Richtung nicht belegt) sind
   Migrationen, kein Wettbewerb. Ein Bar Chart Race sollte das im Text sagen, sonst wirkt „medatixx überholt x.isynet“
   wie ein Wettbewerbserfolg.
9. **Neue Systeme wachsen von null:** tomedo ab 2013 (7 Installationen), T2med ab 2015 (4), medatixx ab 2014 (6),
   RED Medical (626) 2024/25. Vor dem ersten Auftreten darf 0 („vor Markteintritt“) nur gesetzt werden, wo Gründung bzw.
   KBV-Zulassung belegt ist (tomedo 2013, T2med 2015, medatixx 2014 – Abschnitt 8); sonst ist es eine Lücke.
10. **Zeilen ohne Prüfnummer-Kontinuität:** Vor 2021 keine Ids; Zuordnung erfolgte über Namen (siehe Abschnitt 2, Punkt 7).

## 12. Aufbau der CSV

`stichtag,system,hersteller,klasse,installationen,quelle_url` – Stichtag = Quartalsende (ISO). `system` = heutiger Name,
frühere Namen in Klammern. `hersteller` = Eigentümer am Stichtag (1997: KBV-Anbieterkurzname; danach Konzern nach
Abschnitt 8, z. B. x.isynet 2007 „MCS“, ab 2010 „medatixx“; easymed bis 2007 promedico; EL bis 31.03.2022 Softland,
ab 30.06.2022 medatixx; ORBIS bis 2016 Agfa, ab 2021 Dedalus). **2010 und 30.06.2011 je System stammen
aus der Ärzte Zeitung** (zitiert die KBV-Statistik), nicht aus einem KBV-Dokument – `quelle_url` zeigt das. Erfasst sind 44 Systeme, die zu irgendeinem Stichtag ≥ 500 Installationen hatten (plus
RED Medical und die Top-Systeme 1997); Kleinstsysteme (Labor, Pathologie, Radiologie-RIS u. Ä.) fehlen, sind aber in
`__SUMME__` enthalten. Ausgelassen: Medical Office und Summe 31.03.2021 (Doppelzählung, Abschnitt 2).
1997: Systemnamen wie veröffentlicht; nur eindeutig gleichnamige Produkte sind den heutigen Namen zugeordnet
(MEDISTAR, TURBOMED, ALBIS, DAVID, easymed, DURIA, PROFIMED, IFA-AUGENARZT, MEDYS, Praxis-Programm, PegaMed, EVA,
FIDUS, E.L., PDE-TOP, QUINCY WIN). Datenfehler im KBV-HTML 1997: INFORMED CLASSIC „798“ bei 0,72 % (passt nicht zur
Basis, nicht übernommen).

## Nachtrag 20.10.2026 (beim Bau des Datensatzes)

Das Produkt „medatixx“ steht 2015/2016 in der KBV-Liste als **„medatixx/easymedx“**: 35 Installationen am 31.12.2015,
157 am 31.12.2016 (Bericht Stand 31.12.2016, Vorjahresspalte), 0,3 % am 30.09.2017. In
`data/raw/pvs-kbv-installationen.csv` bzw. `pvs-kbv-anteile-2017-2020.csv` nachgetragen.

## Nachtrag 2 (20.10.2026): Lücken 1998–2012 – was gefunden wurde

Daten: `pvs-kbv-luecken-1998-2012.csv` (513 Zeilen, gleiches Format; Herstellerwerte als
`system=__ANBIETER__:<Name wie in der Quelle>`, `klasse` dort leer). Nur belegte Werte, keine Schätzung. Systemnamen
wie in `pvs-kbv-installationen.csv`, wenn es dasselbe System ist; sonst der veröffentlichte Name.

### Neue Quellen je Stichtag

| Stichtag in CSV | Inhalt | Quelle | Güte |
|---|---|---|---|
| 31.12.1997 | Rest der Top 60 Systeme (Ränge, die in der Haupt-CSV fehlten) + Top 60 Anbieter | KBV-HTML 1998 <https://web.archive.org/web/19980702054121/http://www.kbv.de:80/itarzt/statisti/02_top60.htm> | KBV primär |
| 30.06.1998 | Top 30 Systeme + Top 30 Anbieter, „Stand 30.9.98/Abrechnungsquartal 2/98, Quelle: KBV“ | Dt. Ärzteblatt PraxisComputer 6/1998, S. 16, Tab. 1/2 <https://www.aerzteblatt.de/pdf/95/45/s16.pdf> | KBV-Tabelle im DÄ |
| 31.03.1999 | **Top 60 Systeme + Top 60 Anbieter, Gesamt 73.465** („Abrechnungsquartal 1/99, Stand 30.06.1999“) | KBV-Website kbv-it.de <https://web.archive.org/web/19991103221122/http://www.kbv-it.de:80/sw-haus/statisti/02_to60s.html>, <https://web.archive.org/web/19991104001820/http://www.kbv-it.de:80/sw-haus/statisti/02_top60.html> | KBV primär |
| 30.06.2000 | **Top 60 Systeme + Top 60 Anbieter, Gesamt 77.501** („Abrechnungsquartal 2/00, Stand 30.09.2000“) | <https://web.archive.org/web/20001209074700/http://www.kbv-it.de:80/sw-haus/statisti/02_to60s.html>, <https://web.archive.org/web/20010220024917/http://www.kbv-it.de:80/sw-haus/statisti/02_top60.html> | KBV primär |
| 30.06.2001 (s. u.) | Top 30 Systeme („Stand 30.09.2001, Quelle: KBV“) + 6 Anbieter | DÄ PraxisComputer 2/2002 <https://www.aerzteblatt.de/archiv/kbv-statistiken-zum-einsatz-von-praxis-edv-1600e669-ac26-48bc-917a-e5572b834214> (Tabelle als Bild) | KBV-Tabelle im DÄ |
| 31.03.2002 (s. u.) | nur Anbieter: Medistar 13.346; Albis + Compumed + Data Vital 13.674 („Stand 30. Juni 2002“) | DÄ PraxisComputer 2/2003 <https://www.aerzteblatt.de/archiv/36849/Compugroup-uebernimmt-Medistar> | Presse |
| 31.12.2005 (s. u.) | Top 20 Systeme „2005“ | Dissertation M. Kersting, MHH, Tab. 2 <https://www.markus-kersting.de/wp-content/uploads/2011/03/Dissertation_Kersting_MHH_Final_Web.pdf> | Sekundär, zitiert KBV |
| 31.12.2008 | nur Summe 114.772 | Ärzte Zeitung 02.09.2009 <https://www.aerztezeitung.de/Wirtschaft/MEDISTAR-bleibt-Spitzenreiter-in-den-Praxen-371138.html> | Presse |
| 30.06.2009 (s. u.) | Top 20 Systeme „2009“ | Kersting, Tab. 2 | Sekundär |
| 31.12.2009 | nur Summe 117.573 | Ärzte Zeitung 21.10.2011 (wie Abschnitt 10) | Presse |
| 30.06.2011, 31.12.2011 | Top 20 Anbieter (KBV-Anbieterbericht, schon in Abschnitt 9) | Webarchiv DARIS (Abschnitt 3) | KBV primär |

**Stichtag-Konvention (wichtig):** 1997–2000 nennt die KBV „Abrechnungsquartal x/yy“ und daneben „Stand“ = Datum
der Auswertung, ein Quartal später (z. B. „Abrechnungsquartal 2/00, Stand 30.09.2000“). Die CSV nimmt immer das
**Quartalsende des Abrechnungsquartals**. Für 2001 und 2002 nennen die Quellen nur „Stand 30.09.2001“ bzw. „Stand 30. Juni
2002“; nach der Konvention von 1998–2000 ist das Abrechnungsquartal 2/2001 bzw. 1/2002 → in der CSV 30.06.2001 und
31.03.2002. **Nicht belegt**, kann ein Quartal später sein. Ab den PDFs 2013 ist „Stand“ das Datenquartal selbst.
Kersting nennt nur „2005“ und „2009“: Die KBV-Seite bot 2006 den Bericht „Systeme 31.12.2005“ an → 31.12.2005
(plausibel, nicht belegt). Für „2009“ ergeben die Prozentangaben eine Basis von rund 117.050 – das passt weder zur Summe
31.12.2008 (114.772) noch zu 31.12.2009 (117.573), am ehesten zu 30.06.2009 (KBV-Bericht „Systeme 30.06.2009“ ab 2010
online) → in der CSV **30.06.2009, unsicher**.

**Gesamtsummen:** 1997: 69.252 · 31.03.1999: 73.465 · 30.06.2000: 77.501 · 2001: nicht genannt (rechnerisch aus
Medistar (Windows) 10.137 = 11,65 % rund 87.000, **nicht** in der CSV) · 2007: 114.244 · 31.12.2008: 114.772 ·
31.12.2009: 117.573 · 2010/2011 siehe Hauptteil. Der Sprung 2000 → 2007 (+37.000) ist überwiegend Digitalisierung
(Anteil EDV-Abrechner an den Ärzten 1999: 72,55 %, DÄ PraxisComputer 1/2000) und der Eintritt der Psychotherapeuten
(seit 1999 in der vertragsärztlichen Versorgung, ebd.).

**1999-12-31, nur Anbieter in Prozent** (DÄ PraxisComputer 1/2000, Grafik 3, <https://www.aerzteblatt.de/pdf/97/11/s6-7.pdf>;
keine Installationszahlen, daher nicht in der CSV): DOCexpert 14,86 · MediStar 14,51 · Compugroup Holding 13,10 ·
TurboMed 11,08 · MCS 10,79 · Frey ADV 5,03 · Data-Vital 3,93 · Promedico 2,19 · Duria eG 1,70 · Mediamed 1,40 %.

### Nicht gefunden (trotz Suche)

- **Q4 2000–2004, 2006, 2008 (je System), 2010 (außer Top 5), 2012**: KBV verlinkte 2002–2013 nur auf DARIS-Dokumente
  (`daris.kbv.de/daris/link.asp?ID=1003737294`), die im Webarchiv bis auf Stand 31.12.2007 (System) und 2011 (Anbieter)
  nicht gespeichert sind. KBV-Seiten belegen, welche Berichte existierten: 30.06.2002, 31.12.2005, 30.06.2006
  („Neuberechnung … aufgrund unvollständiger Datenlieferung“), 31.12.2006, 31.12.2007, 31.12.2008, 30.06.2009,
  31.12.2009, 30.06.2010, 31.12.2010, 30.06.2011 (<https://web.archive.org/web/2007/http://www.kbv.de/ita/4299.html> u. a.).
- PraxisComputer/PRAXiS-Inhaltsverzeichnisse 1998–2013 durchsucht: Nach 2002 keine Statistik-Artikel mehr.
- Ärzte Zeitung 2011 (Jan.) und 2013 („Die Top Ten der Arztsoftware-Systeme“): hinter Login, auch im Webarchiv.
- CGM-Börsenprospekt 2007: nicht online gefunden (Pressemitteilung nennt nur „ca. 43 %“ der Ärzte als Nutzer).
- Wege, die noch offen sind: KBV direkt anfragen (DARIS-Archiv); Ärzte-Zeitung-Login; DÄ-Archiv PraxisComputer 3/2001
  und 1–6/2003 (Bilder ohne Text, nicht alle gesichtet); Fachgruppen-Top-20 2010 (teils archiviert, nicht ausgewertet).

### Untergrenzen (für „nicht gelistet“)

| Stichtag | Liste | letzter Platz = Untergrenze |
|---|---|---|
| 31.12.1997 | Top 60 Systeme / Anbieter | 104 (PRISMA) / 63 (BOSS) |
| 30.06.1998 | Top 30 Systeme / Anbieter | 390 (Apris) / 246 (Co-Med) |
| 31.03.1999 | Top 60 Systeme / Anbieter | 110 (GENOPRAX) / 68 |
| 30.06.2000 | Top 60 Systeme / Anbieter | 149 (EVIDENT) / 71 (MEDOS) |
| 30.06.2001 | Top 30 Systeme | 619 (Psychodat) |
| 2005 / 2009 (Kersting) | Top 20 | 1.038 / 1.041 |

### Anbieter mit nur einem gelisteten Produkt (Anbieterwert = Systemwert, geprüft an der Liste desselben Stichtags)

Geprüft 31.03.1999 und 30.06.2000 (Summe der Systemzeilen = Anbieterzeile): promedico (easymed), DURIA eG (DURIA),
Mediamed Praxiscomputer (S1), Medic Praxis Systeme (MEDIC-PC), Wiegand (Arztpraxis Wiegand), IFA (IFA-AUGENARZT), MEDYS,
Medisoftware (Praxisprogramm), PEGA (PegaMed), Softland (E.L.), EGAD (FIDUS), Flohrschütz (PSYPRAX ON WINDOWS), ergosoft
(PSYCHODAT PRO, 2000), Zimmer/Zimmer-AL (DATA bzw. DATA-AL). **Nicht** einproduktig: Pro Medisoft (PROFIMED 895 von 947),
EVIDENT 2000 (EVIDENT 149 + DIALOG DENTAL 165 = 314), Frey (QUINCY PCNET + QUINCY WIN), MEDISTAR 2000 (Prolog 8.116 +
Windows 3.113 = 11.229), TURBOMED 2000 (DOS 8.623 + Windows 209 = 8.832), ALBIS (DOS + Windows). Für 2001/2002/2011
gilt das nur als **Annahme** (keine vollständige Systemliste zum Abgleich).

**Versionswechsel DOS → Windows (1999–2001):** Die KBV führte alte und neue Version mit eigener Zulassungsnummer in
eigenen Zeilen (DÄ 1/2000: „1999 wurden erstmals beide Versionen mit separater Zulassungsnummer“). In der Lücken-CSV
deshalb getrennte Namen: `MEDISTAR (Prolog-Version)` / `MEDISTAR (Windows-Version)`, `TURBOMED (DOS-Version)` /
`TURBOMED (Windows-Version)`, `ALBIS DOS (Altversion)` / `ALBIS` (= ALBIS ON WINDOWS, wie ab 2007). Für eine
Produktlinien-Reihe 2000/2001 die **Anbieterwerte** MEDISTAR (11.229 / 12.801) und Turbomed (8.832 / 10.349) nehmen
(einproduktige Anbieter, belegt) oder die Versionen addieren (gerechnet). DOCexpert: `DOC EXPERT` (DOS) und
`DOC EXPERT COMFORT` (Windows-Ableger, DÄ 1/2000) → `x.comfort (ehem. DOCcomfort)`.

### Zuordnung der 1997er Namen zu heutigen Systemen

| 1997 (KBV-Name, Anbieter) | Nachfolger / heute | Beleg | Sicherheit |
|---|---|---|---|
| MEDISTAR (MEDISTAR) | CGM MEDISTAR (BLACK PRO); Prolog-Version bis 2002 abgelöst | DÄ 1/2000, 2/2002 (Frist bis Mitte 2002) | hoch |
| TURBOMED | TURBOMED (CGM ab 12/2003) | DÄ 2/2002 (Windows-Version), Abschnitt 8 | hoch |
| ALBIS (DOS) / ALBIS ON WINDOWS | ALBIS (CGM) | KBV 2000 „ALBIS DOS“ | hoch |
| DOC EXPERT (DOS) | ging in DOCexpert Comfort → DOCcomfort → ixx.comfort → x.comfort auf | DÄ 1/2000 („Windows-Ableger Docexpert Comfort des DOS-Programms“); ÄZ 14.04.2011 | mittel (Migration, nicht Umbenennung) |
| LEISYS, SISYMED, ADAMED, ADAMED PLUS, PAIDOS (DOC EXPERT) | Produkte der DOCexpert-Gruppe, ab 2005 nur noch ADAMED in den Top 20, 2007 keine mehr groß | DÄ 1/1998 (sieben DOCexpert-Produkte), DÄ 2/2002 | Herkunft hoch, Verbleib offen |
| DOC CONCEPT | x.concept (ehem. DOCconcept) | ÄZ 14.04.2011 | hoch |
| MCS-INA (MCS) | MCS-Altprodukt; MCS-ISYNET (ab 1999 gelistet) ist das Nachfolgeprodukt von MCS → x.isynet | DÄ 1/2000 (MCS „Produkt Isynet“); Nachfolge INA→ISYNET **nicht ausdrücklich belegt** | mittel |
| S + N ARZTSYSTEM (S + N) | von MCS übernommen (ab 1999 unter MCS) | DÄ 1/2000 | hoch |
| ARCOS, DORSYMED, SYSMED-KDV, ON-MED, V-DOC, M1 (COMPUMED) | Compugroup (ab 1999/2000); M1 → CompuMED-M1 → CGM M1 PRO; 2007 noch „CompuMED-M1-Arcos“ (593) | DÄ 1/2000, 2/2002 | hoch für Konzern, Produktnachfolge offen |
| DAVID (DATA-VITAL) | CGM (Data Vital 1998 zu 50 % CompuGROUP), 2025 noch 44 | DÄ 95/12 1998 | hoch |
| QUINCY PCNET (FREY) | FREY; 2007 noch 396 | KBV 2007 | hoch |
| S1 (SYSMED SÜD-WEST 1997, ab 1998 Mediamed Praxiscomputer) | wahrscheinlich Vorläufer von S3-Win (Mediamed, ab 2005 gelistet) | gleicher Anbieter; Nachfolge **nicht belegt** | niedrig |
| E.L. (SOFTLAND) | EL – Elaphe Longissima (medatixx ab 04/2022) | gleiche Kurzform | hoch |
| DATA (ZIMMER) | Data-AL (Anbieter Zimmer → Zimmer-AL → Data-AL GmbH) | Anbieterkette in KBV-Listen 1999/2000/2007 | mittel |
| INFORMED CLASSIC (INFORMED) | verlor 2014 die KBV-Zulassung (Q4/2013: 285 Installationen, Platz 36) | <https://www.aerzteblatt.de/archiv/161853/Praxissoftware-Informed-verliert-KBV-Zulassung> | hoch |
| MEDIC-PC (MEDIC PRAXIS SYSTEME) | unbekannt; 2001 nicht mehr in den Top 30 | – | – |

### Markteintritt (für „0“ vs. „unter Listengrenze“)

| System | Erster Beleg | Davor | Folgerung für 2000 |
|---|---|---|---|
| Medical Office (INDAMED) | Anbieter INDAMED 95 am 30.06.2000 (KBV Top 60 Anbieter); 2007: 576 | INDAMED 1994 gegründet (Abschnitt 8); 1999 nicht in Top 60 Anbieter (< 68) | 2000 = 95 (Anbieterwert, Produktname nicht genannt) |
| DURIA | 1997: 1.208 | – | belegt |
| PegaMed | 1997: 516 | – | belegt |
| Elefant (HASOMED) | 2005: 2.101 (Kersting) | HASOMED 2000 nicht in Top 60 Anbieter (< 71); Firma 1991 gegründet | 2000 „unter 71“, nicht 0 |
| psyprax | Flohrschütz 1997: 88; 1999: 310; 2000: 1.222 | – | belegt |
| PsychoDat | 2000: 288 (PSYCHODAT PRO) | ergosoft 1999 nicht in Top 60 (< 68) | belegt |
| SMARTY, Epikur, Med7 (Bitron) | 2005 (SMARTY 1.077) bzw. 2007 (Epikur 615, Med7 587) | 2000 nicht in Top 60 Anbieter (< 71) | 2000 „unter 71“ |
| EVIDENT | 2000: 149 | – | belegt |
| ORBIS (GWI, ORBIS-AAPM) | 2000: 184 | – | belegt |
| CGM MEDICO (MEDICO WIPS, Data-Plan) | 2000: 171 | – | belegt |
| x.isynet (MCS-ISYNET) | 1999: 158 | 1997 nicht in Top 60 (< 104) | belegt ab 1999 |
| x.concept (DOC CONCEPT) | 1999: 149 | 1997 nicht in Top 60 | belegt ab 1999 |
| x.comfort (DOC EXPERT COMFORT) | 2000: 1.945 | 1999 nicht in Top 60 (< 110) | belegt ab 2000 |
| tomedo / T2med / medatixx | 2013 / 2015 / 2014 | Gründung 2011 / 2012 / Produkt 2014 | 2000 = 0 (belegt über Gründung) |

### Widersprüche

1. **PSYPRAX 2010:** Ärzte Zeitung 27.02.2012 nennt für 30.06.2010 6.198 – Kersting „2009“ hat 8.219, KBV 2007 7.241,
   KBV 30.06.2011 8.777. Der ÄZ-Wert ist sehr wahrscheinlich falsch; in `pvs-kbv-installationen.csv` (2010-06-30) als
   Zweitquelle enthalten → **für die Grafik nicht verwenden** bzw. markieren.
2. **Kersting „2009“:** Prozentbasis (~117.050) passt nicht zur Summe 31.12.2008 (114.772); Anbieter für E.L. dort
   „Compugroup“ (KBV 2011: Softland) – Tabelle hat Übertragungsfehler.
3. **Kersting „2005“:** keine DOCcomfort-Zeile, dafür „DOCexpert“ 7.485 (2001 hatten DOC EXPERT 2.240 + DOC EXPERT
   COMFORT 4.710). Ob die KBV 2005 beide unter „DOCexpert“ führte, ist unbelegt → eigener Name
   `DOCexpert (KBV-Zeile 2005)`.
4. **DÄ 2/2002 (Stand 30.09.2001):** PsychoDat 619 = „0,12 %“ (müsste ~0,71 % sein) – Druckfehler im Prozentwert, Zahl
   plausibel.
5. **KBV 1997:** INFORMED CLASSIC 798 bei 0,72 % (passt zu ~500) – nicht übernommen.

### Hinweise zur bestehenden CSV (`pvs-kbv-installationen.csv`)

- **1997 ALBIS:** Dort ist „ALBIS“ (1.401) die **DOS-Version** und „ALBIS ON WINDOWS (eigene KBV-Zeile 1997)“ (955) die
  Linie, die ab 2007 als `ALBIS` geführt wird. Empfehlung: 1997 umbenennen in `ALBIS DOS (Altversion)` bzw. `ALBIS`.
- **„DOC EXPERT (Systemfamilie 1997)“** ist kein Familienwert, sondern das einzelne DOS-Produkt DOC EXPERT (5.532); die
  Familie (Anbieter) hatte 10.630. Name irreführend; in der Lücken-CSV aus Kompatibilität beibehalten.

### Empfehlung: Race ab 2000 oder ab 2007?

Jahresend-Werte (Q4) je System belegt: 2005 (Top 20, Stichtag plausibel), 2007, 2010 (nur Top 5), 2013–2016,
2021–2025. Quartalsnahe Ersatzwerte: Q2/2000 (Top 60), Q2/2001 (Top 30, Stichtag erschlossen), Q2/2009 (Top 20,
unsicher). Ohne jeden Systemwert: 2002, 2003, 2004, 2006, 2008, 2012 (Summen nur 2008).
Bei rund 20 Systemen und 26 Jahren (2000–2025) wären etwa **55 % der Werte gerechnet** (linear oder über Anteile), davon
2002–2004 drei Jahre am Stück ohne Stütze, dazu der DOS/Windows-Bruch 2000/01 und die Digitalisierungs-Basis
(77.500 → 114.000). Ab 2007 sind es etwa **40 %** (2008, 2011/2012, 2017–2020 voll; 2009/2010 teilweise).
**Empfehlung:** Das zweite Race **ab 2007** (Jahresende, markierte Interpolation), die Jahre 1997–2005 nicht als
lückenlose Animation, sondern als belegte Momentaufnahmen (1997, Q1/1999, Q2/2000, 2005) zeigen – z. B. als Vorspann
„So sah der Markt 1997/2000 aus“. Ein Race ab 2000 wäre nur mit deutlichem Hinweis „über die Hälfte der Werte
gerechnet“ vertretbar.

## Nachprüfung 22.10.2026 (Pflegedurchlauf 2)

Die Gesamtsumme Ende 2021 (119.405) ist zufällig identisch mit Ende 2014. Nachgerechnet am Original: KBV-Bericht
„Datenstand 31.03.2022“ (Webarchiv 20230204211945), Spalte „4. Quartal 2021“ über alle 126 Zeilen = **119.405**,
Spalte „1. Quartal 2022“ = **119.104**. Beides deckt sich mit `data/raw/pvs-kbv-installationen.csv`. Der Rest
(Summe minus erfasste Systeme ≥ 500) verläuft 2021/2022 glatt (5.659 → 5.611 → 5.555).
