# Beispiel-Datensätze

Alle mitgelieferten Datensätze (`src/samples/data.ts`, erzeugt mit `node scripts/build-samples.mjs` aus den Rohdaten in `data/raw/`) enthalten **ausschließlich recherchierte, reale Zahlen** aus den unten genannten Quellen. Nichts wurde geschätzt oder aufgefüllt; fehlende Werte sind `null` und werden in der App per „Datenlücken auffüllen“ interpoliert. Die ausführliche Rechercheliste mit allen Einzelquellen, PDF-Links und Qualitätsnotizen steht in [`DATASETS-RESEARCH.md`](./DATASETS-RESEARCH.md).

## 1. Tierarztpraxen im Wandel: Inhaber vs. Angestellte (1991–2025)

- **Quelle:** Bundestierärztekammer (BTK), „Statistik: Tierärzteschaft in der Bundesrepublik Deutschland“, jährlich im Deutschen Tierärzteblatt, Stand 31.12. – <https://www.bundestieraerztekammer.de/btk/statistik/>. Für 1991–1995: Zusammenstellung derselben Jahresstatistiken in Maure, S. (1998), Dissertation FU Berlin, sowie Schöne & Ulrich (1992) für 1991; Details in [`DATASETS-RESEARCH-1990.md`](./DATASETS-RESEARCH-1990.md).
- **Reihen:** Praxisinhaber:innen (niedergelassene Tierärzt:innen), Angestellte in Praxen (angestellte Tierärzt:innen), Außerhalb von Praxen (tätig außerhalb von Praxen), Tätige gesamt, sowie auf der rechten Achse Hunde und Katzen in Mio. (IVH/ZZF). Kurze Namen seit 03.10.2026, damit die Kopf-Labels in 4:5, 1:1 und in der Grafik der Artikel nicht gekürzt werden. Alle Reihen beginnen 1991; Lücken siehe unten.
- **Warum die Praxiszahlen nicht die Gesamtzahl ergeben:** „Tierärztlich Tätige“ zählt **alle Tätigkeitsbereiche**, nicht nur Praxen. Neben der Praxis sind das vor allem öffentliches Veterinärwesen (Veterinärämter, Fleischhygiene), Industrie und freie Wirtschaft, Hochschulen, Forschungsanstalten, Bundeswehr, Auslandstätigkeit und sonstige veterinärmedizinische Tätigkeiten. Rund ein Drittel der tierärztlich Tätigen arbeitet außerhalb von Praxen, und dieser Anteil ist seit Jahren stabil. Die Reihe **„Tätig außerhalb von Praxen“ ist von uns berechnet** als Tätige minus Niedergelassene minus Angestellte; sie enthält damit auch die wenigen Praxisvertreter:innen (1991: 170 Personen). Die vollständige Aufgliederung für 1991 (Schöne & Ulrich 1992) summiert sich exakt auf die publizierte Zahl der Tätigen und ist in [`DATASETS-RESEARCH-1990.md`](./DATASETS-RESEARCH-1990.md) dokumentiert.
- **Was gezählt wird – und was nicht:** Die BTK-Statistik erfasst ausschließlich **approbierte Tierärztinnen und Tierärzte** als Kammermitglieder, und zwar als **Personen, nicht als Vollzeitäquivalente**. Die Kategorie hieß in der Statistik lange „Praxisassistenten“ und meint **angestellte Tierärzt:innen**; die BTK selbst schreibt seit 2024 „Angestellte“. **Tiermedizinische Fachangestellte (TFA) sind darin nicht enthalten** – sie sind keine Kammermitglieder und tauchen in keiner BTK-Statistik auf. Zum Vergleich: Die Bundesagentur für Arbeit zählte zum 31.12.2022 rund 25 800 TFA (davon 7 467 Auszubildende), der bpt nennt für 2024 rund 22 800 sozialversicherungspflichtig beschäftigte TFA. Eine Klinik mit 8 Tierärzt:innen und 25 TFA erscheint in diesem Datensatz also nur mit den 8 Personen.
- **Abdeckung und Lücken je Reihe:**
  - *Angestellte Tierärzt:innen*: **1991–2025, lückenlos**. 1991–2001 aus Friedrich (2007, Dissertation TiHo Hannover, Tab. 6, nach den DTBl-Statistiken); diese Reihe weist die Assistent:innen ohne Praxisvertreter:innen aus, also so abgegrenzt wie die heutige BTK-Statistik. Ab 2002 BTK direkt; 2002 (3 784) am 02.10.2026 aus Tab. 1 der Statistik 2002 nachgetragen (`statistik_02.pdf`, ausgelesen für ds14), vorher interpoliert.
  - *Niedergelassene*: **lückenlos 1991–2025**, seit 1994–2001 aus dem Agrarstatistischen Jahrbuch 2001 (Tab. 166) ergänzt werden konnten. In den Überschneidungsjahren 1994, 1995 und 1998 stimmt diese Reihe exakt mit den anderen Quellen überein.
  - *Tierärztlich Tätige* und damit auch *Tätig außerhalb von Praxen*: 1991, 1994–2000 und ab 2002. Es fehlen 1992, 1993 und 2001, die interpoliert werden. Seit dem Nachtrag der Angestellten ist *Tätig außerhalb von Praxen* auch für 2002 berechnet (7 672). Der berechnete Wert für 1991 (6 759) stimmt exakt mit der Summe der publizierten Einzelbereiche überein: öffentliches Veterinärwesen 3 701, akademische Bildungsstätten 1 201, Industrie und freie Wirtschaft 879, sonstige veterinärmedizinische Tätigkeiten 530, Praxisvertretung 170, Auslandstätigkeit 139, Bundeswehr 71, Forschungsanstalten 68.
  - 1990 wurde weggelassen, weil der Wert nur die alten Bundesländer umfasst.
- **Vergleichsachse Hunde + Katzen:** IVH-Schätzungen bis 2011, IMR-Erhebung 2012, Skopos ab 2013. Der Sprung 2011→2012 ist ein Methodenwechsel, keine reale Verdopplung. Die Reihe wird bewusst als **eine durchgehende Linie** gezeichnet; der Hinweis auf den Methodenwechsel steht in der Quellenzeile des Datensatzes und wird so ins Video eingebrannt. Die Reihe beginnt 1991 und ist bis auf das Jahr 1992 lückenlos; 1992 überspringt die Verbandsreihe selbst und wird interpoliert. Ein **nationales Heimtierregister existiert nicht** – Hunde werden nur kommunal für die Hundesteuer erfasst, Katzen gar nicht, TASSO und FINDEFIX sind freiwillig. Alle Zahlen sind daher Umfrage-Hochrechnungen. Details in [`DATASETS-RESEARCH-GAPS.md`](./DATASETS-RESEARCH-GAPS.md).
- **Wichtig zur Einordnung „Anzahl Tierarztpraxen“:** Die BTK zählt **Personen, keine Praxen**. Die Zahl der Niedergelassenen (selbstständige Praxisinhaber:innen in Einzel-, Gemeinschafts- und Gruppenpraxen) ist der beste öffentlich verfügbare Näherungswert für die Praxenzahl. Eine amtliche Praxenstatistik gibt es in Deutschland nicht.
- **Geschichte in den Daten:** Niedergelassene 10 475 (2002) → Höchststand 12 019 (2019) → 11 216 (2025); Praxisassistent:innen 3 784 (2002) → 12 125 (2025). **2024 überholen die Angestellten erstmals die Inhaber.**
- **Datenqualität:** alle Reihen vollständig ab 2003, davor die oben genannten Lücken. Bis 2011 hieß die Kategorie „Praktizierende Tierärzte“.
- **Attribution:** „Quelle: Bundestierärztekammer, Statistik Tierärzteschaft 1991–2025 (Deutsches Tierärzteblatt)“

## 1b. Angestellte überholen die Praxisinhaber (1991–2025)

- **Quelle:** wie Datensatz 1, Statistik der Deutschen Tierärzteschaft der Bundestierärztekammer.
- **Warum ein eigener Datensatz:** Zugespitzte Fassung mit genau zwei Reihen. Datensatz 1 enthält zusätzlich „Tierärztlich Tätige gesamt“ mit 34 476 – damit reicht die Y-Achse bis 35 000 und der Wechsel bei 11 000 zu 12 000 ist im Video nicht mehr zu erkennen. Ein `topN` hilft nicht, weil es die größten Reihen auswählt und die Gesamtreihe damit immer dabei wäre.
- **Kurze Reihennamen** („Praxisinhaber:innen“, „Angestellte in Praxen“), weil die Kopf-Labels im 1:1-Format sonst abgeschnitten werden.
- **Gegenprobe:** Der Tierärzte Atlas Deutschland 2024 schreibt für Ende 2023 „mit rd. 11 400 erstmals genauso viele angestellte wie selbstständige Tierärzt:innen“. Die Reihe zeigt 11 437 zu 11 429.
- **Die Aussage:** 1991 kamen auf jeden Angestellten viereinhalb Inhaber (8 510 zu 1 880). 2024 kippt es (11 264 zu 11 990), 2025 deutlicher (11 216 zu 12 125).

## 2. Tierärztinnen und Tierärzte je Bundesland (2002–2025)

- **Quelle:** BTK-Statistik (siehe oben), Mitglieder je Landestierärztekammer. Nordrhein und Westfalen-Lippe wurden zu Nordrhein-Westfalen summiert.
- **Reihen:** 16 Bundesländer, Kammermitglieder zum 31.12. (inkl. Ruhestand).
- **Datenqualität:** vollständig 2002–2025. Die Jahre 2002–2005 stammen aus den im Internet Archive erhaltenen BTK-Statistik-PDFs und sind doppelt belegt (Jahrestabelle plus die Rückschau-Tabelle der Ausgabe 2005); alle Kammersummen stimmen mit den publizierten Bundeswerten überein. Zwei quelleninterne Summenabweichungen (2017: 18 Personen, 2018: 10) sind in der Recherche dokumentiert.
- **Warum nicht ab 1991:** Für die Zeit vor 2002 gibt es keine Kammerdaten im Netz, und die BTK selbst weist in ihren Dokumenten mehrfach darauf hin, dass sie über keine älteren Kammerzahlen verfügt. Auffindbar war lediglich ein Einzelwert (Sachsen 1991: 1 035). Die älteren Tabellen existieren nur gedruckt im Deutschen Tierärzteblatt.
- **Zweck in der App:** Test für lange Kategorienamen („Mecklenburg-Vorpommern“, „Baden-Württemberg“) mit Labels außerhalb der Balken.

## 3. Heimtiere in Deutschland (1991–2025)

- **Quelle:** Industrieverband Heimtierbedarf (IVH) e.V. / Zentralverband Zoologischer Fachbetriebe (ZZF) e.V., Datenblatt „Der Deutsche Heimtiermarkt“, Populationszahlen aus der repräsentativen Haushaltsbefragung (Skopos) – <https://www.ivh-online.de/der-verband/daten-fakten/anzahl-der-heimtiere-in-deutschland.html>
- **Reihen:** Katzen, Hunde, Kleintiere, Ziervögel, Aquarien und Terrarien (ab 2002) – in Millionen. Gartenteiche stehen in den Rohdaten, aber nicht im Datensatz.
- **Datenqualität:** jährlich **1991–2025 mit Ausnahme von 1992**, das die Verbandsreihe selbst überspringt. Einzellücke: Aquarien 1999, weil die BBE-Quelle dieses Jahres Zierfische (84,6 Mio.) statt Aquarien zählt. 1991–2003 stammen aus den im Internet Archive erhaltenen ZZF-Jahresberichten „Der deutsche Heimtiermarkt – Struktur & Umsatzdaten“, 2004–2009 aus archivierten IVH-Datenblättern, ab 2010 aus den laufenden IVH/ZZF-Veröffentlichungen. Für 1997–2003 summieren sich die Einzelarten exakt auf die jeweils publizierte Gesamtzahl, was die Extraktion bestätigt.
- **Methodenwechsel, die als Sprünge sichtbar sind:** 1994 neue Berechnungsgrundlage für Ziervögel, 1999 Wechsel der Quelle auf den BBE-Branchenreport (der ZZF weist selbst darauf hin, dass 1995–1998 damit nicht vergleichbar sind), 2000 „neue Erhebungsmethoden“, 2002 Aufteilung der Aquarien in Aquarien, Gartenteiche und Terrarien (deshalb der Rückgang von 3,0 auf 1,9), 2012 erste repräsentative Erhebung (IMR) und 2013 Umstellung auf Skopos.
- **Korrekturen gegenüber früheren Ständen:** Die zunächst als 1999 geführten Werte stammten tatsächlich aus 1996 (die IVH-Website zeigte 2001 noch den alten Stand). Die aus Wikipedia übernommene Schätzung für 1992 widerspricht der zeitgenössischen Verbandsreihe und wurde entfernt. Katzen 2003 sind 7,3 Mio., nicht 7,5 Mio. (das ist der Wert für 2004). Details in [`DATASETS-RESEARCH-PETS.md`](./DATASETS-RESEARCH-PETS.md).
- **Attribution:** „Quelle: IVH/ZZF, ‚Der Deutsche Heimtiermarkt‘ (Datenblätter 2014–2025), Erhebung Skopos“

## 3b. Heimtiermarkt: Umsatz nach Segment (2011–2025)

- **Quelle:** ZZF/IVH, „Der Deutsche Heimtiermarkt – Struktur & Umsatzdaten“ – <https://www.ivh-online.de/der-verband/daten-fakten/der-deutsche-heimtiermarkt.html>
- **Reihen:** Katzenfutter, Hundefutter, Bedarfsartikel und Zubehör, Online-Handel, Futter für Kleintiere, Ziervogelfutter, Zierfischfutter – in Millionen Euro zu Endverbraucherpreisen.
- **Wichtig zur Abgrenzung:** Futter und Bedarfsartikel sind **stationärer Handel**. Der Online-Handel ist eine Schätzung über **alle** Segmente hinweg und deshalb bewusst eine eigene Größe, keine Teilmenge der anderen Balken. Er wächst von 400 Mio. Euro (2013) auf über 1 500 Mio. Euro und überholt 2022 die Bedarfsartikel im Laden.
- **Datenqualität:** 2011–2025 durchgehend für Katzenfutter, Hundefutter und Bedarfsartikel; Online-Handel ab 2013; die kleineren Futtersegmente (Kleintiere, Ziervögel, Zierfische) werden erst ab 2018 getrennt ausgewiesen und starten deshalb später. 2009 und 2010 fehlen in der Quelle, der Einzelwert für 2008 wurde deshalb weggelassen. Für 2024 weist die Quelle eine veränderte Datenbasis aus, der Vergleich mit 2023 ist laut ZZF nur bedingt möglich.
- **Attribution:** „Quelle: ZZF/IVH, Der Deutsche Heimtiermarkt“

## 3c. Praxisschwerpunkte: Die Kleintierpraxis wird zum Normalfall (1991–2025)

- **Quelle:** Bundestierärztekammer, jährliche Statistik im Deutschen Tierärzteblatt; 1990–1995 zitiert nach Maure (1998). Details in [`DATASETS-RESEARCH-KLEINTIER.md`](./DATASETS-RESEARCH-KLEINTIER.md).
- **Reihen:** Praxisinhaber:innen mit ausschließlich Kleintieren, mit gemischter Praxis und mit ausschließlich Nutz- bzw. Großtieren.
- **Die Kategorien heißen über die Jahre unterschiedlich**, meinen aber dasselbe Dreieck: 1990–1995 „Kleintierpraxis / Gemischtpraxis / Großtierpraxis“, 2001–2004 „Praxis für überwiegend Kleintiere / Groß- und Kleintiere / überwiegend Großtiere“, 2006–2018 „Kleintiere / Nutztiere und Kleintiere / Nutztiere“.
- **Die Reihen laufen durch bis 2025, ohne Schätzung.** Ab 2019 fragt die BTK Pferde getrennt ab. Bis dahin wurden Pferde laut BTK „zu den Nutztieren gezählt und unter der Rubrik ‚Großtiere‘ erhoben“ (Deutsches Tierärzteblatt 8/2024, S. 990). Damit lassen sich die neuen Kategorien definitorisch auf die alte Dreiteilung abbilden:
  - *Nur Kleintiere* = Kleintiere
  - *Nur Nutz- und Großtiere* = Nutztiere + Pferde + „Nutztiere und Pferde“
  - *Gemischt* = „Nutztiere und Kleintiere“ + „Kleintiere und Pferde“ + „Nutztiere, Pferde und Kleintiere“
- **Der Versatz 2018→2019 ist echt** (gemischt 4 554 → 3 381, Nutz-Gruppe 971 → 1 713) und eine Folge der neuen Abfrage, nicht der Praxislandschaft: Wer vorher nur „Nutztiere und Kleintiere“ ankreuzen konnte, antwortet heute differenzierter. Die BTK zeigt deshalb selbst keinen Verlauf, sondern nur die aktuelle Verteilung.
- **Gegenprobe:** Die einzige Verteilung, die die BTK nennt (2023: „mehr als 50 Prozent betreiben Kleintierpraxen, gut ein Viertel sind Gemischtpraxen“), wird von dieser Zuordnung getroffen – sie ergibt 53,9 Prozent Kleintiere und 28,8 Prozent gemischt. Eine zuvor geprüfte, trendbasierte Schätzung hätte 37,8 Prozent gemischt ergeben und der Quelle widersprochen; sie wurde deshalb verworfen.
- **Antwortquote** (Summe der drei Reihen geteilt durch die Niedergelassenen, berechnet): 1991–1995 96,9 bis 99,0 Prozent, 2001–2015 praktisch 100 Prozent (höchstens zwei Personen fehlen), 2016–2018 97,1 bis 98,8 Prozent, 2019–2023 nur 91,2 bis 96,5 Prozent, 2024 102,4 Prozent (Mehrfachantworten möglich), 2025 97,1 Prozent. Die absoluten Werte 2019–2023 sind deshalb leicht untererfasst.
- **Aufteilung ab 2019** (Tab. 2, Block Niedergelassene, nicht im Datensatz, aber für Artikel 24 verwendet): reine Nutztierpraxen 838 (2019) · 768 (2021) · 705 (2023) · 718 (2025); reine Pferdepraxen 693 · 827 · 891 · 989; Nutztiere und Pferde 182 · 192 · 213 · 225. 2024 enthält Mehrfachnennungen (Summe 11.529 über 11.264 Inhabern) und bleibt außen vor. Einzelwerte mit Quelle: `docs/DATASETS-RESEARCH-KLEINTIER.md`, Segment IV.
- **Vierte Reihe „Ketten (Standorte in Deutschland)“** – bewusst eine andere Einheit und eine andere Quelle: exakt die Reihe TOTAL aus dem Ketten-Datensatz (`data/raw/ds12-ketten-modell.json`), 35 Standorte 2015 bis 514 im Jahr 2025, verankert am Tierärzte Atlas 2024 mit rund 450 Standorten im August 2024; die übrigen Jahre sind Modellwerte. **Die Reihe darf nicht mit den BTK-Reihen verrechnet werden:** Wer seine Praxis an eine Gruppe verkauft, verschwindet aus der Inhaberzahl und erscheint als angestellte:r Tierärzt:in wieder – ein Kettenstandort und ein fehlender Inhaber sind weder dasselbe noch gegeneinander aufrechenbar. Die Reihe zeigt ausschließlich die Größenordnung: rund 500 Kettenstandorte gegenüber gut 11 000 Praxisinhaber:innen. Details beim Ketten-Datensatz in `src/samples/index.ts`.
- **Die Aussage:** 2002 ziehen die reinen Kleintierpraxen mit den gemischten gleich (jeweils 4 419), danach übernehmen sie. Bis 2018 wachsen sie auf 6 142, während die reinen Nutztierpraxen auf 971 fallen.

## 3d. Fachtierarzt-Gebiete (2007–2025)

- **Quelle:** Bundestierärztekammer, Statistik Tierärzteschaft 2007–2025 (Deutsches Tierärzteblatt), Tabellen zu den Gebietsbezeichnungen.
- **Reihen:** elf Gebiete, darunter Kleintiere, Kleintierchirurgie und Innere Medizin der Kleintiere sowie Rinder, Schweine, Pferde, Geflügel, Lebensmittel, Mikrobiologie, Pathologie und Öffentliches Veterinärwesen.
- **Zusammengeführte Bezeichnungen:** „Kleintiere, kleine Haustiere“ (bis 2004), „Klein- und Heimtiere“ (2005–2014) und „Kleintiere“ (ab 2018) sind laut BTK-Fußnote dasselbe Gebiet und bilden eine Reihe; ebenso „Lebensmittelhygiene“ und „Lebensmittel“.
- **Warum erst ab 2007:** 2005 zählt die Statistik nur Tierärzt:innen bis 65 Jahre und ist nicht vergleichbar, 2006 ist durch dieselbe Baden-Württemberg-Lücke verzerrt.
- **Lücken:** 2015–2017 und 2020 hat die BTK diese Tabellen nicht oder unvollständig veröffentlicht (die Seiten 4 bis 10 der PDF-Ausgabe 2020 sind leer), diese Jahre werden interpoliert. Einzellücken: Pferde 2012 (die Quelle führt 116 unter „Pferde“ und 461 unter „Pferdechirurgie“, offensichtlich falsch zugeordnet, deshalb leer); Innere Medizin der Kleintiere erst ab 2018 ausgewiesen. Kleintierchirurgie 2013, 2014 und 2018 (40, 44, 102) fehlten in der ersten Extraktion und sind am 23.09.2026 aus den Originaltabellen nachgetragen.
- **Auffälligkeiten, so publiziert:** Mikrobiologie 2013 = 605 bei 481 (2012) und 494 (2014), in Tab. 4 der Statistik 2013 so gedruckt; die Spalte „aktiv“ (307 / 321 / 305) springt nicht, vermutlich ein Meldefehler bei den Ruheständlern. 2025 sinken zehn von elf Gebieten zusammen um 412 Bezeichnungen, alle Werte entsprechen Tab. 6a in `2025_korr.pdf`. Rund 330 davon erklärt die Kammer Berlin, die 2025 in „ges.“ nur noch aktive Fachtierärzt:innen meldet (ges. = aktiv in allen Zeilen, Kleintiere 130 → 53, Öffentliches Veterinärwesen 144 → 82). Bundesweit bleibt „aktiv“ stabil (Kleintiere 1 244 → 1 233).

## 3e. Wo die Kleintiermedizin wächst (2002–2018)

- **Quelle:** Bundestierärztekammer, Statistik Tierärzteschaft 2002–2018, Tabelle nach Kammerbereichen. Nordrhein und Westfalen-Lippe sind wie in den anderen Bundesland-Datensätzen zu Nordrhein-Westfalen addiert.
- **Reihen:** 16 Bundesländer, niedergelassene Tierärzt:innen mit Schwerpunkt Kleintiere.
- **Prüfung:** Die Summe der 17 Kammern wurde für jedes Jahr gegen den publizierten Bundeswert geprüft und stimmt in 21 von 23 Jahren. Die beiden Abweichungen liegen 2019 und 2024 und damit außerhalb des hier verwendeten Zeitraums; sie sind quelleninterne Fehler, nicht Lesefehler, und in [`DATASETS-RESEARCH-KLEINTIER-BL.md`](./DATASETS-RESEARCH-KLEINTIER-BL.md) dokumentiert.
- **Warum 2002 bis 2018:** Vor 2002 veröffentlicht die BTK keine Kammerdaten. Ab 2019 gilt derselbe Bruch wie beim nationalen Datensatz (Pferde als eigene Kategorie), und mehrere Kammern melden seither „k. A.“ – Bremen durchgehend, Mecklenburg-Vorpommern fünf Jahre, dazu Sachsen-Anhalt und Hamburg. In einem Balkenrennen würden diese Länder scheinbar verschwinden, deshalb endet die Reihe 2018.
- **Lücken:** 2005 enthält die Statistik eine gekürzte Tabelle ohne diese Zahlen, 2006 ist durch die Fehlmeldung aus Baden-Württemberg unbrauchbar. Beide Jahre werden interpoliert.

## 3f. Der Aufstieg der Tierarztketten (Praxisketten, 2015–2026)

- **Quelle:** Modellreihe nach dem Arbeitsdatensatz vom 17.09.2026 (Stichtag der aktuellen Werte), aufgebaut aus Betreiberangaben, Bundeskartellamt, Fachpresse und den Rankings von gesundheitsmarkt.de (2023, 2024, 2026 mit Stand 08.07.2026). Gesamtmarkt verankert am Tierärzte Atlas Deutschland 2024 (Deutsches Tierärzteblatt 2/2025, S. 202). Wert und Marker je Zelle in [`data/raw/ds12-ketten-modell.json`](../data/raw/ds12-ketten-modell.json). Die Vorgängerdatei [`ds11-ketten.json`](../data/raw/ds11-ketten.json) mit Quellentext je Wert wird nicht mehr gebaut und bleibt nur als Beleg für die älteren Einzelwerte liegen.
- **Es gibt zu diesem Thema keine amtliche Statistik.** Die Bundestierärztekammer erhebt Ketten nicht.
- **Einheit:** physische Behandlungsstandorte (Praxen, Kliniken, Tiergesundheitszentren) unter gemeinsamer Betreiberstruktur, unabhängig von Kauf oder Neugründung. Nicht Personen, nicht mit BTK-Zahlen verrechenbar.
- **13 Gruppen plus activet, Long Tail und TOTAL:** IVC Evidensia, Tierarzt Plus Partner, AniCura, VetPartners, VetGruppen (Vetopia), Altano (Pferde), TeamVet, Veternicum Nesto, SmartVet → Medivet, Rex, filu, Cadomo Vets, Wolf & Tiger; dazu activet bis 2022 und „Weitere Gruppen (Long Tail)“. Unabhängige Betreibergruppen (TeamVet), Pferdegruppen (Altano) und Neugründer (Rex, filu, Wolf & Tiger) zählen ausdrücklich mit.
- **Marker je Wert:** B belegt, B~ Quelle nennt „rund“ oder „knapp“, B≥ belegte Untergrenze aus einer „über X“-Aussage (gerechnet als X+1), B/P belegte Praxenzahl als Näherung für Standorte, S geschätzt oder interpoliert, 0 Gruppe existierte in Deutschland noch nicht. Die Reihe ist lückenlos; von den 104 Jahreswerten der 14 Einzelreihen, die nicht 0 sind, sind 41 belegt und 63 geschätzt. 2019 und 2020 haben keinen einzigen Beleg, 2025 nur VetPartners.
- **Belegregel des Datensatzes:** Nennen zwei Quellen für dasselbe Jahr und dieselbe Geografie verschiedene Werte, gilt der höhere belegte; ein späterer niedrigerer Wert löst einen älteren höheren ab (AniCura 79 in 2024, 78 im September 2026). Deutschland wird nie mit DACH gemischt, Prognosen („bis Jahresende über 100“) zählen nicht.
- **Werte 2026 (Stand 17.09.2026):** IVC Evidensia „mehr als 120 Praxen und Kliniken“ (Arbeitgeberprofil, statt 115 im Ranking), Tierarzt Plus Partner „über 110 Tierarztpraxen“ (Stellenausschreibung, statt 106 im Ranking), AniCura 78 (Standortseite), VetGruppen „über 30 Praxen und Kliniken“ (statt 26 im Ranking), VetPartners 30 (Eigenangabe 14.09.2026: 27 Praxen an 30 Standorten, statt 28 im Ranking), TeamVet 27 (Karriereseite; an anderer Stelle 24, die Partnerliste der Website führt 33 Einträge), Veternicum Nesto „über 25 Standorte“ (Unternehmensseite; die Standortliste ergab beim Zählen im September 2026 23), Medivet 20, Rex 13, filu 11 (zwölf Adressen auf der Standortseite, Waiblingen öffnet erst im November 2026), Cadomo Vets 4, Wolf & Tiger 3. Altano hat keinen Wert für 2026; der letzte Beleg ist 26 Standorte (gesundheitsmarkt.de, 24.04.2023), 2024–2026 sind geschätzt (27, 29, 30).
- **Summe 2026:** Die 13 Gruppen kommen auf 505, davon 475 belegt oder als Untergrenze belegt und 30 geschätzt (Altano). Mit Altano nach dem letzten Beleg sind es 501; diese Zahl nennt der Artikel [`artikel/tierarztketten-deutschland.html`](../artikel/tierarztketten-deutschland.html) als belegte Untergrenze. Mit einem geschätzten Long Tail von 72 ergibt sich TOTAL 577, darzustellen als „rund 575–580“, Band 550 bis 610.
- **Historische Anker:** AniCura 7 (2015), 20 (11/2016), 22 (04/2017), 30 (08/2018), knapp 60 (07/2021), rund 70 (11/2022), rund 75 (10/2023), 79 (2024). IVC Evidensia 4 (11/2016), 13 (30.06.2018), über 50 (12/2021), über 70 (zm-online 11/2022; das Bundeskartellamt zählte im Juni 2022 noch 60), rund 75 (10/2023), 76 (2024). Tierarzt Plus Partner über 30 (11/2021), 96 (Eigenangabe 30.07.2024; das Ranking 2024 zählt 86). VetPartners 1, 5, 11, 17, 24 für 2021–2025 nach eigener Chronik. TeamVet 23 (12/2023). Veternicum Nesto 12 (2023) und 21 (2024) laut Ranking. SmartVet 20 (2016) und 18 (2021), Medivet 20 (2023, 2024).
- **Belegte Nullen und Gründungen:** Tierarzt Plus 2018, Altano Juni 2017, Veternicum Ende 2019, VetPartners Deutschland 2021 mit einer Praxis, Rex 2021, filu 2022, VetGruppen Deutschland (GmbH 2021 gegründet, erste Partnerschaft laut eigener Angabe 2023, deshalb 0 bis 2022). IVC Evidensia ist nach eigenem Arbeitgeberprofil „seit 2015 in Deutschland aktiv“, der Datensatz setzt für 2015 geschätzt einen Standort an; die Evidensia Deutschland GmbH wurde erst Anfang 2016 gegründet (ds11). Diese Spannung ist offen.
- **TOTAL:** Einziger externer Gesamtanker ist der Tierärzte Atlas mit rund 450 Standorten von 16 Ketten im August 2024. Die 13 Gruppen kommen 2024 auf 389, der Rest von 61 ist Long Tail. Alle anderen TOTAL-Werte (35 im Jahr 2015 bis 577 im Jahr 2026) sind Modellschätzungen.
- **Zusammengefasste Namen, damit nichts doppelt gezählt wird:** SmartVet (2005 gegründet, 2021 noch 18 eigene Praxen) gehört seit 2021 mehrheitlich und seit Ende 2023 vollständig zu **Medivet**. **Vetopia** (Axcel, 2021 aus VetGruppen DK und EMPET NO, über 220 Kliniken in acht Ländern) ist die Muttergruppe von **VetGruppen Deutschland**. **Nesto** (BE/LU) hat sich mit **Veternicum** zusammengeschlossen. Die fünf **activet**-Praxen (Weiterstadt, Hannover, Duisburg, Krefeld, Potsdam) gehören seit August 2023 zu **Tierarzt Plus** und stecken in dessen Standortzahl.
- **Bewusst nicht enthalten, weil kein Praxisbesitz:** VetFamily (Einkaufsgemeinschaft rechtlich selbstständiger Praxen, 2000 in Dänemark gegründet, über 1 300 Mitgliedspraxen in Deutschland), VUK, Smartemis (rund 90 Partner), vezzgroup (rund 14), OneVet Deutschland. Pfotendoctor ist Telemedizin ohne Standorte und gehört zu Tierarzt Plus. Wer VetFamily als Kette zählt, kommt auf ein Vielfaches der tatsächlichen Kettengröße.
- **TeamVet ist ein Sonderfall** und deshalb in der Dateninfo gekennzeichnet: ein Verbund mit Beteiligungen, ausdrücklich ohne Investmentfonds im Gesellschafterkreis.
- **Keine Gegenprobe:** zm-online, 11/2022 – „nicht mehr als 200 Praxen und Kliniken in Investoren- beziehungsweise Konzernhand“ bei rund 10 000 Praxen. Die Angabe meint nur Konzern- und Private-Equity-Standorte und taugt für diese breitere Definition nicht zur Validierung.
- **Die Aussage:** Von rund 35 Standorten 2015 auf geschätzte 575 bis 580 im Jahr 2026. 2026 führt IVC Evidensia mit über 120 Standorten vor Tierarzt Plus Partner mit über 110 und AniCura mit 78; AniCura ist seit 2024 nicht mehr gewachsen.

## 3g. Hund oder Katze – was ist wo häufiger? (Welt, 2000–2026)

- **Quellen:** FEDIAF (28 europäische Märkte 2018, 41 Länder ab 2020), Europäische Kommission (12 Länder für 2004, 2010, 2012), AVMA (USA 2001, 2006, 2011, 2016), Japan Pet Food Association (2008–2015), CAHI (Kanada), AVA (Australien), USDA (Brasilien, Russland, Philippinen), China Pet Industry White Paper (2018, 2019, 2024), IBGE und Instituto Pet Brasil (Brasilien).
- **Gezeigt wird** der Hundeanteil an der Summe aus Hunden und Katzen; 50 Prozent ist der Kipppunkt.
- **Modellierung:** exakter Anker wo vorhanden, sonst geometrische Interpolation zwischen zwei Ankern, davor Rückrechnung mit gedeckelter Wachstumsrate. Länder ohne eigenen Anker folgen einer Regionsannahme.
- **Unabhängige Gegenprobe 2018:** Euromonitor über Statista nennt weltweit 471 Mio. Hunde und 373 Mio. Katzen. Die Ländersumme ergibt 450,8 und 335,5 — also −4,3 Prozent bei Hunden und −10,1 Prozent bei Katzen. Gute Übereinstimmung für ein zusammengesetztes Modell, keine Deckungsgleichheit.
- **Zweite Gegenprobe:** Deutschland trifft unsere eigene FEDIAF-Extraktion exakt (2023: 10,5/15,7 · 2024: 10,5/15,9).
- **Zwei Korrekturen gegen nationale Quellen.** *China:* Der Anker 2019 bleibt, die Fortschreibung der Vorlage verfehlte aber den Katzenboom (52,6 statt gemessener 42,4 Prozent Hundeanteil 2024, PetData). Die Jahre 2020–2024 laufen jetzt auf den gemessenen Wert zu. *Brasilien:* Die Vorlage mischte IBGE-Hunde mit Katzenzahlen eines Aggregators und kam auf 82 Prozent; Brasiliens eigene Erhebungen ergeben durchgehend rund 69 Prozent (USDA 2004, IBGE 2013, Instituto Pet Brasil 2018). Die Reihe nutzt nur noch diese Paare.
- **Nahtstelle geprüft:** Alle 197 Werte für 2020 stimmen mit dem vorherigen Datensatz überein, es gibt keinen Sprung zwischen Historie und Gegenwart.
- **Die Aussage:** 84 von 197 Ländern wechseln zwischen 2000 und 2026 die Stufe, fast alle Richtung Katze — 27 von „leicht mehr Katzen" zu „mehr Katzen", weitere 27 von „mehr Hunde" zu „leicht mehr Hunde". Japan ist der deutlichste belegte Fall: von 57 auf 41 Prozent Hundeanteil.
- **Summenspalten (seit 24.09.2026):** `Summe: Hunde (Mio.)` und `Summe: Katzen (Mio.)` aus den absoluten Länderwerten (`data/raw/ds13-weltsummen-quelle.csv`, Auszug der Vorlage), erzeugt mit `scripts/build-welt-summen.mjs`. China und Brasilien sind dort genauso korrigiert wie die Anteile. Ergebnis 2000: 331,5 / 294,2 Mio., 2024: 504,2 / 426,7 Mio.; gegen Euromonitor 2018 −4,3 Prozent Hunde, −6,7 Prozent Katzen. Die DR Kongo war bis dahin grau, weil der Datensatz „DR Congo“ schreibt – behoben über die Namenstabelle `src/assets/laendernamen.json`.
- **Als `isExample` markiert**, weil für die meisten Länder kein eigener Anker existiert und 2026 durchgehend Projektion ist.

## 4. Beliebteste Hunderassen (VDH-Welpenstatistik, 1992–2025)

- **Quelle:** Verband für das Deutsche Hundewesen (VDH) e.V., Welpenstatistik der VDH-Mitgliedsvereine (Onlinetabelle) – <https://www.vdh.de/ueber-den-vdh/welpenstatistik/>
- **Reihen:** 47 Rassen, ohne Gesamtzahl. Enthalten sind alle 33 Rassen, die zwischen 1992 und 2025 je unter den ersten 20 waren, und 14 weitere aus der Nachextraktion.
- **Datenqualität:** vollständig 1992–2025, keine Reihe bricht zwischendurch ab. Die ursprüngliche Extraktion für 2011–2025 umfasste nur die damaligen Top-15-Rassen, wodurch 22 Rassen nach 2010 endeten – darunter Französische Bulldogge, Australian Shepherd, Mops und Chihuahua. Diese Lücke wurde aus derselben VDH-Tabelle nachgezogen und gegen die vorhandenen Werte geprüft: alle 360 bestehenden Zellen reproduzierten sich ohne Abweichung, die Spaltensummen stimmen mit der publizierten Gesamtzahl überein. Details in [`DATASETS-RESEARCH-HUNDERASSEN.md`](./DATASETS-RESEARCH-HUNDERASSEN.md). 1992–2010 stammen aus fünf archivierten Snapshots der alten VDH-Onlinetabelle (Internet Archive), gegen Wikipedia- und Presseangaben geprüft (z.B. Deutscher Schäferhund 1998 = 27 834). 1990 und 1991 sind nirgends online verfügbar. Nur Rassehunde mit VDH-Papieren.
- **Gesamtzahl aller VDH-Welpen** (Tabelle „Gesamt – Alle Rassen“, in `data/raw/ds3-hunderassen.json` als „Alle VDH-Rassen (Summe der Tabelle)“; die Spaltensummen der 304 Rassenzeilen ergeben exakt diese Werte): 2011: 80.719 · 2012: 80.049 · 2013: 77.061 · 2014: 77.385 · 2015: 76.245 · 2016: 77.533 · 2017: 75.891 · 2018: 75.038 · 2019: 72.377 · 2020: 77.461 · 2021: 85.595 · 2022: 69.381 · 2023: 60.306 · 2024: 56.851 · 2025: 55.053. Für die Jahre vor 2011 liegt keine Gesamtzahl vor. Anteile einzelner Rassen an allen VDH-Welpen sind daraus berechnet.
- **Attribution:** „Quelle: VDH, Welpenstatistik der VDH-Mitgliedsvereine 2011–2025“

## 5. Rinderbestand je Bundesland (1991–2025)

- **Quelle:** Statistisches Bundesamt (Destatis), Viehbestandserhebung (Stichtag wechselnd, siehe unten), aufbereitet in den Tabellen der BMEL-Statistik – <https://www.bmel-statistik.de/landwirtschaft/tierhaltung/viehbestand>
- **Lizenz:** Datenlizenz Deutschland – Namensnennung – Version 2.0 (dl-de/by-2-0).
- **Reihen:** 13 Flächenländer in 1 000 Tieren (Stadtstaaten weggelassen).
- **Datenqualität:** 1991–2025 mit einer Lücke: Sachsen-Anhalt 2002 ist in der Quelle nicht nachgewiesen, im Datensatz leer und im Diagramm überbrückt. 1991–2010 stammen aus der Eurostat-Regionaltabelle mit den von Destatis gelieferten Länderdaten, ab 2010 aus der BMEL-Aufbereitung; die 2010er Werte beider Quellen sind identisch, die Reihen fügen sich also nahtlos. **Prüfsumme:** Laut Recherchenotiz zu `ds7` stimmt die Summe aller 16 Länder 1991–2009 auf ±0,3 Tausend mit dem Bundeswert überein, ausgenommen die Jahre mit fehlenden Ländern (2000 ohne alle drei Stadtstaaten, 2005 und 2006 ohne Bremen und Hamburg, 2002 ohne Sachsen-Anhalt). 2024 und 2025 trifft die 16-Länder-Summe den Bundeswert auf 0,2 Tausend. Die 13 gezeigten Flächenländer liegen um die Stadtstaaten darunter (1991: 29 Tausend, 2025: 14 Tausend). Die Bundeszeile in `ds4` für 2010–2023 passt nicht zu den Ländersummen und wird nicht verwendet.
- **Prüfsumme:** In jedem Jahr mit vollständigen Länderdaten weicht die Summe der 16 Länder um höchstens 0,3 Tausend vom Bundeswert ab (1991–2009 gegen die Destatis-Bundeswerte in ds7, 2010–2025 gegen die Deutschland-Zeile in ds4, dort höchstens 0,2 Tausend). Größere Abweichungen gibt es nur in Jahren, in denen Länder fehlen: 2000 ohne die Stadtstaaten (21,9 Tausend), 2002 ohne Sachsen-Anhalt (378,2 Tausend), 2005 und 2006 ohne Bremen und Hamburg (je rund 18 Tausend). Die Deutschland-Zeile in ds4 wurde im September 2026 korrigiert: Im Deutschland-Block der BMEL-Tabelle 0117090 sind die Zeilen 2010–2023 falsch beschriftet (Werte nach Monat sortiert, Beschriftung abwechselnd Mai/November). Die jetzt verwendeten Novemberwerte stimmen auf das Stück mit den Ländersummen überein. Die Länderwerte selbst waren nicht betroffen.
- **Wichtig zum Stichtag:** Der Erhebungstermin wechselt über die Jahre – bis 1997 der 3. Dezember, 1998 der 3. November, 1999–2006 sowie 2008 und 2009 der 3. Mai, 2007 und ab 2010 der 3. November (die BMEL-Ländertabellen ab 2010 sind Novemberwerte). Rinderbestände schwanken saisonal, die Unterschiede liegen bei ein bis zwei Prozent und damit deutlich unter dem langfristigen Rückgang. Der Hinweis steht im Untertitel des Datensatzes.
- **Der Einbruch Anfang der 1990er** in den neuen Ländern ist real und spiegelt die Auflösung der LPG-Tierbestände, kein Gebietsstandsbruch: Bereits die Dezemberzählung 1990 umfasst Gesamtdeutschland.
- **Attribution:** „Quelle: Statistisches Bundesamt (Destatis), Viehbestandserhebung; BMEL-Statistik (dl-de/by-2-0)“

## Dateninfo je Datensatz

Jeder Beispiel-Datensatz hat zwei Ebenen der Erklärung:

- `description` – **ein Satz** für die Kachel in der Oberfläche. Nennt die Kernaussage, keine Methodik.
- `dataInfo` – ein Array von Absätzen, das in der Oberfläche erst auf Klick erscheint. Hier gehört alles hin, was man zum Einordnen braucht: Was genau gezählt wird, welche Lücken es gibt, welche Methodenbrüche sichtbar sind, was berechnet oder geschätzt ist.

Faustregel: Wenn ein Satz mit „weil“, „außer“ oder einer Jahreszahl als Einschränkung beginnt, gehört er in `dataInfo`, nicht in `description`. Die Kacheln bleiben so überschaubar, und die Sorgfalt geht trotzdem nicht verloren.

## Rubriken in der Oberfläche

Die Beispiele sind in der App nach Rubriken gruppiert (`SAMPLE_CATEGORIES` in `src/lib/data/types.ts`):

| Rubrik | Datensätze |
|---|---|
| Tierarztpraxen & Beruf | Inhaber vs. Angestellte, Angestellte überholen die Praxisinhaber, Praxisschwerpunkte, Fachtierarzt-Gebiete, Wo die Kleintiermedizin wächst, Tierärzt:innen je Bundesland, Wer die Tierarztpraxen kauft |
| Heimtiere & Markt | Hund oder Katze weltweit, Heimtiere nach Art, Heimtiermarkt-Umsatz, Beliebteste Hunderassen |
| Nutztiere | Rinderbestand je Bundesland |

Eine neue Rubrik anlegen: Eintrag in `SAMPLE_CATEGORIES` ergänzen, dann bei den Datensätzen in `src/samples/index.ts` das Feld `category` setzen. Die Reihenfolge der Rubriken in der Oberfläche entspricht der Reihenfolge im Array.

## Eigene Datensätze ergänzen

1. Rohdaten als Wide-Tabelle (`Jahr | Kategorie A | Kategorie B | …`) aufbereiten.
2. In `src/samples/data.ts` als `export const NAME = { headers, rows }` ablegen.
3. In `src/samples/index.ts` einen Eintrag mit `category`, Titel, Untertitel, Quelle, einsätziger `description`, `dataInfo` und `suggested`-Voreinstellungen anlegen. `isExample: true` setzen, wenn die Zahlen nicht belastbar sind – die App zeigt dann ein Badge „Beispieldaten“.

## Wem die Tierarztketten gehören (`ketten-eigentuemer`)

**Erstellt/geprüft:** 30.09.2026 · **Verwendet in:** Post 8

Abgeleitet, nicht eigenständig erhoben: `KETTEN_EIGENTUEMER` in `src/samples/data.ts` summiert die Reihen von
`KETTEN` zu fünf Blöcken nach dem Eigentümer im September 2026 (Beteiligungsgesellschaften, Mars, ohne Fonds bzw.
tierärztlich geführt, Eigentümer nicht erfasst, weitere Gruppen) plus die Summenspalte. Belege, Schätzungen und
Lücken sind die des Ketten-Datensatzes (`data/raw/ds12-ketten-modell.json`). Eigentümer laut Artikel zu Post 8.
Ein Block ist leer, solange keine seiner Gruppen existierte. Wichtig für jede Darstellung: Zugeordnet wird nach
dem heutigen Eigentümer, nicht nach dem im jeweiligen Jahr.

## Die Tiermedizin wird weiblich (`geschlecht-praxis`)

**Erstellt/geprüft:** 02.10.2026 · **Verwendet in:** Post 28 · **Rohdaten:** `data/raw/ds14-geschlecht.json`

Alle 24 Jahrgänge der BTK-Statistik 2002–2025, Tab. 1, je Jahr: Kammermitglieder gesamt und Frauen, tierärztlich
Tätige gesamt und Frauen (einschließlich Ausland, wie in Tab. 1), Praxisinhaber und Praxisassistenten je gesamt und
Frauen. Jeder Wert mit Quell-PDF und Tabelle in der Rohdatei; nichts interpoliert. Anker geprüft: 2020 (43.461 /
27.500; 32.582 / 22.121) und 2025 (Pressemitteilung 66,8 / 71,7 %). Am 02.10.2026 zusätzlich von Hand gegen Tab. 1
geprüft, alle Werte gleich: 2002 (Praktizierende 7.024 m / 3.451 w, Assistenten 1.045 m / 2.739 w), 2006 (Tätige 11.872 m /
11.901 w, Praktizierende 7.030 / 4.328, Assistenten 1.053 / 3.384), 2014, 2015, 2016, 2019 und 2025 (Inhaber und
Angestellte gesamt und Frauen). 2002 bis 2011 druckt die BTK die Männer selbst aus, ab 2012 sind sie berechnet. Die Gesamtzahlen stimmen auf die Person mit
`TIERAERZTESCHAFT_DEUTSCHLAND` überein.

Bekannte Eigenheiten: 2005 von der BTK selbst als unvollständig bezeichnet (Umzug der Zentralen Tierärztedatei);
Referendare 2006 in keiner Summe, 2007 nur in der Gesamtsumme, ab 2008 bei den Tätigen; 2011 fehlt die Ausland-Zeile
lesbar (null); für 2025 weicht Tab. 1 der korrigierten Fassung (67,0 / 72,0 %) von der Pressemitteilung ab.
Die Praxisassistenten 2002 (3.784) aus dieser Auswertung sind seit 02.10.2026 auch in Datensatz 1 nachgetragen.

Ersetzt eine extern zugelieferte Vorlage, in der 19 von 26 Jahren interpoliert oder zurückgerechnet waren.

## Die Maß wird teurer, getrunken wird mehr (`oktoberfest`, Exkurs)

- **Quelle:** Statistisches Amt München, „Oktoberfest 1985–2025“ (Open Data Portal München, Stand 13.07.2026, dl-de/by-2-0, Namensnennung Pflicht). Verbraucherpreisindex: Destatis, Lange Reihen ab 1948, Jahresdurchschnitte; 2025 aus der Jahresrate +2,2 % (PM 019/2026). Rohdaten mit allen Feldern in `data/raw/ds15-oktoberfest.json`.
- **Reihen:** Bier in Mio. Liter (aus Hektolitern umgerechnet) und Besucher in Mio., beide als Säulen nebeneinander; Maß und Maß mit Inflation in Euro (Linien auf der rechten Achse). Diagrammart „Säulen + Linie“, Veränderung seit 1985 hinter jedem Wert, Lücken nicht aufgefüllt.
- **Berechnet:** „Maß mit Inflation“ = Maßpreis 1985 × VPI(Jahr) / VPI(1985). 1985–1990 Index des früheren Bundesgebiets, 1991 verkettet (61,9 / 89,0).
- **2026 vorläufig** (Feld `vorlaeufig_2026` in den Rohdaten): Besucher 7,4 Mio. laut Bilanz der Stadt vom 04.10.2026; Bier = 2025 × 1,027 (Festbier laut Verein Münchner Brauereien), Maßpreis = 2025 × 1,0238 (durchschnittliche Steigerung laut Stadt), weil die Bilanz anders zählt als die amtliche Reihe (2025: 6,5 Mio. Maß laut Wirten, 67.127 hl amtlich). Inflation 2026 = Mittel der Vorjahresraten Januar–September (2,61 %). Ersetzen, sobald das Statistische Amt die Reihe fortschreibt.
- **Lücken und Brüche:** 2020/21 keine Wiesn (Corona), die Zeilen haben nur den Inflationswert. Hendl (nicht im Diagramm, im Artikel): 2001 halbiert sich die Zahl, vermutlich geänderte Erfassung. Dauer 16–18 Tage.
- **Reduzierte Fassung** `oktoberfest-preis`: dieselben Werte ohne Bier (Besucher als Säulen, Maß und Maß mit Inflation als Linien), zweite Grafik im Artikel.
- **Freigabe:** gehört zu keinem Post; freigegeben über `datensaetzeOhnePost` in `src/content/freigabe.json`. Rubrik „Exkurs“.

## Tierarzt, Inflation und Maß (`tierarzt-inflation`, Sonderauswertung)

- **Quelle:** Destatis Verbraucherpreisindex (GENESIS 61111-0001/-0003/-0004, CC13-0935) und Umsatzsteuerstatistik (73311-0002, WZ08-75001 Tierarztpraxen), Eurostat HICP CP0935 (NL, AT), alle über die öffentlichen Schnittstellen am 07.10.2026; Maß aus `ds15-oktoberfest.json`. Rohdaten in `data/raw/ds16-tierarztkosten.json` (Preise, GOT-Positionen, Warenkorb) und `data/raw/ds17-tierarzt-umsatz.json` (Umsatz, HICP, Abrechnungsfaktor, Verordnungsbegründung).
- **Reihen:** Anstieg seit 2010 in Prozent, 2010–2024: Tierarztpreise (deutscher Index), Tierarztpreise NL, Praxisumsatz, Inflation, Maß (2020/21 linear zwischen 2019 und 2022).
- **Warum so:** Der deutsche Index bildet nur die GOT-Sätze ab (Stufen). Die erste Fassung mit GOT-Einzelleistungen ab 2000 sah angreifbar aus; deshalb überlagern jetzt drei unabhängige Blickwinkel. Der GOT-Warenkorb „Routinejahr“ (`korbJahr`) steht nur noch als Lupe im Artikel, mit Abrechnungsfaktor 1,44 (AFC 2019) als Szenario.
- **Grenzen:** Umsatz = Preis × Menge. Faktor nach 2022 unbekannt. Umsatz 2025 erscheint 2027; dann um ein Jahr verlängern.
- **Freigabe:** über `datensaetzeOhnePost`.
