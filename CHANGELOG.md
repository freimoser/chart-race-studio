# Changelog

Alle nennenswerten Änderungen dieses Projekts. Format lose nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

## [Unveröffentlicht]

### Korrektur Teilzeit, Post „Überstunden“ (09.10.2026)

- **Korrektur:** „Jede zweite Frau in Teilzeit, aber nur 13 Prozent der Männer“ stand als Angabe zur Tiermedizin in den Artikeln 4, 5, 28 und 29, in der Dateninfo von `inhaber-angestellte` und im Post-Text 5. Laut Tierärzte Atlas beschreibt sie die Gesamtbevölkerung. Ersetzt durch Branchendaten: 54,6 Prozent Teilzeit unter angestellten Tierärzt:innen (Jensen et al., Veterinary Sciences 2026, BaT-Befragung Ende 2025), 34–43 Prozent laut Stichproben im Tierärzte Atlas; Wochenstunden aus dem GOT-Gutachten (Inhaber 50,4, Angestellte 35,1). Korrekturvermerk mit Datum in jedem Artikel.
- **Neuer Post-Text** `docs/linkedin/post-ueberstunden.md`: Überstunden und Verwaltung in der Tierarztpraxis aus drei Befragungen (GOT-Gutachten 2020, BaT 2025, FU Berlin 2016), mit Block „Gerechnet / Quellen“ und gegenläufigem Beleg.

### Startseite zeigt den Post des Tages, Tierarztmangel seit 2000 (08.10.2026)

- **Startseite:** Oben stand am Tag von Post 5 noch die Sonderauswertung von gestern (Tierarztkosten mit Praxisumsatz), weil ein Post ohne `publishedOn` nach seinem Entwurfsdatum sortiert wurde. Jetzt steht der Post auf `naechster` oben, ohne Datum bis zur Veröffentlichung.
- **Post 5 rechnet jetzt ab 2000:** Video, Artikel (Kurzfassung, Tabelle ab 2000, Abschnitt „Warum die Jahre vor 2012 gerechnet sind“, FAQ, Beschreibung), Post-Text mit Block „Gerechnet / Quellen“, Redaktionsplan, Datenherkunft und Vorschaubild auf `tierarztmangel-2000` umgestellt. `og-bilder.mjs` rendert mit Slug-Argument nur einzelne Artikel.
- **Neuer Datensatz `tierarztmangel-2000`**: Hunde und Katzen je Praxisinhaber:in und je Tierärzt:in in der Praxis, 2000–2025. Vor 2012 die Verbandsschätzung, mit dem Faktor 1,45 an die Erhebung ab 2012 verkettet; ab 2012 gleich wie `tierarztmangel`. Je Inhaber 2000–2012 gleichbleibend um 1.650–1.730, danach Anstieg auf 2.291; je Tierärzt:in in der Praxis 1.244 (2000) auf 1.101 (2025). Glätteprüfung 0 Sprünge, Lückentest grün.

### Eingebettete Grafik lädt nur noch ihren Datensatz (08.10.2026, Branch `grafik-buendel`)

- **Vorher** lud jede Grafik in Artikeln und auf der Startseite alle 21 Datensätze, die Welt- und Deutschlandkarte und racing-bars, bevor sie das erste Bild zeigte: 300 KB (gzip). **Jetzt** 127 KB plus 2–10 KB für den einen Datensatz. Kartendaten und racing-bars kommen nur noch, wenn die Grafik eine Karte oder ein Balkenrennen ist.
- **Datensätze als Dateien:** Der Build legt je freigegebenem Datensatz `grafik-daten/<id>.json` an (15 Dateien). Gesperrte Datensätze bekommen keine Datei, dieselbe Regel wie für die CSV-Downloads. Die Regel steht jetzt einmal in `src/content/freigabe-regel.ts`, Seite, Build und Livegang-Prüfung lesen sie dort.
- **Code:** Summenspalten in eigener Datei `summen.ts` (das Line Race zog darüber die Kartendaten mit), Karte per `import()` nachgeladen, Freigabe-Regel ohne Datensätze in `freigabe-basis.ts`. Studio, Diagramm-Code und Videoexport unverändert.
- **Neue Prüfungen:** `check:launch` meldet einen Blocker, wenn eine eingebettete Grafik keine Datei hat oder eine Datei für einen gesperrten Datensatz im Build liegt (Gegentest mit beiden Fehlern). `npm run check:grafiken` öffnet jede eingebettete Grafik in Chrome und prüft, dass sie zeichnet: 16 von 16, Gegenprobe greift. Glätteprüfung über 16 Datensätze: 0 Sprünge.
- Post 5 (Tierarztmangel) im Redaktionsplan auf „nächster“.

### SEO-Prüfung und Korrekturen (08.10.2026, Branch `seo-fixes-2026-10-08`)

- **Autorenseite `/ueber-das-projekt.html`:** wer schreibt, Methode, Korrekturweg, Erklärvideo (720p, 2 MB, mit Textbeschreibung), AboutPage-, Person- und VideoObject-Schema. Autor in allen Artikeln verlinkt; Person-Schema überall mit eigener URL und LinkedIn-Profil (`sameAs`). Link im Fuß jeder Seite.
- **Startseite und Archiv entdoppelt** (72 % → 24 % gleicher Text): Startseite zeigt das Neueste, fünf Titel und die Themen; `/beitrag/` ist das Archiv nach Thema mit Einleitung je Thema und Ankern.
- **Kannibalisierung aufgelöst:** Suchbegriffe von Post 2, 6, 8 und 28 getrennt; die Ketten-Übersicht heißt „Tierarztketten in Deutschland: Liste aller Gruppen“.
- **Belege:** Ketten-Übersicht mit verlinkten Quellen je Gruppe, abgerufen am 08.10.2026 (Abweichung bei Veternicum offen benannt). Datenherkunft: veralteter Einstieg und der Grundsatz „Lücke statt Schätzung“ auf die Regel „Lückenlose Reihen“ umgestellt, Abschnitte für `tierarztmangel` und `oktoberfest-preis` ergänzt. Frauenanteil in Artikel 4 an die korrigierte Kammerstatistik angeglichen (72,0 % statt 71,7 % aus der Pressemitteilung, beides genannt).
- **Studio:** fester Beschreibungstext unter der App, WebApplication-Schema.
- **Technik:** Beschreibungen höchstens 155 Zeichen (Prüfungen `check:launch` und `check:content` angepasst, vier Texte gekürzt); lastmod für alle 24 Sitemap-Adressen über `<meta name="dcterms.modified">`; Kontrast der Metazeilen (Barrierefreiheit); Anleitungsbilder als WebP (halb so groß); Einwilligungsbanner auf dem Telefon kompakter; `llms.txt` mit Autorenseite.
- **Offen:** Blockierzeit der Startseite (Grafik lädt alle Datensätze in einem Bündel); erledigt im Eintrag darüber.

### Tierarzt gegen Inflation bis 2026 (07.10.2026)

- Kopfgrafik `tierarzt-inflation` reicht jetzt bis 2026: deutscher Index und Inflation amtlich (2026 vorläufig), Niederlande 2025/2026 aus der neuen Eurostat-Tabelle `prc_hicp_minr` (ECOICOP 2, Position CP0945; Jahresmittel 2025 deckungsgleich mit der alten Reihe), Praxisumsatz 2025/2026 mit dem Wachstum von 2024 geschätzt. Artikel, Post, Datenherkunft angepasst; 2026: DE +54 %, NL +84 %, Umsatz +152 % (geschätzt), Inflation +42 %.

### Post 5 vorbereitet, Testwoche ein Post pro Tag (07.10.2026)

- **Neuer Datensatz `tierarztmangel`** für Post 5: Hunde und Katzen je Praxisinhaber:in und je Tierärzt:in in der Praxis, 2012–2025 (zwei Linien, eine Aussage). Der Redaktionsplan hatte das schon als bessere Grafik vorgesehen. Post-Text `docs/linkedin/post-05-tierarztmangel.md` mit Block „Gerechnet / Quellen“.
- **`tieraerzteschaft-deutschland` lückenlos:** Tätige 1992, 1993, 2001 und Hunde/Katzen 1992 linear; „Außerhalb von Praxen“ dort als Differenz. Übrige Werte unverändert.

### Regel „Lückenlose Reihen“ und Heimtier-Fassungen nachgebessert (07.10.2026)

- **Neue verbindliche Regel** (Projekt-`CLAUDE.md`, `docs/DATENSTANDARD.md` Abschnitt 7, `docs/REDAKTION.md`): keine leeren Jahre; fehlende Werte recherchieren, sonst mit naheliegenden Daten rechnen (linear, verketten, über verwandte Reihe fortschreiben, nächsten Beleg halten) und in Dateninfo, Datenherkunft und Post benennen. Neuer Test `src/test/luecken.test.ts` für alle Datensätze ab 07.10.2026; schlug vor der Korrektur bei `heimtiere-alle` an (53 leere Zellen, Jahr 1992 fehlte).
- **`heimtiere-alle`** heißt jetzt „Heimtiere und Pferde in Deutschland“ (Pferde sind keine Heimtiere) und ist 1991–2025 lückenlos: Pferde aus der Viehzählung aller Halter 1990–1996 und FN 2015/2019/2025, dazwischen linear; Gartenteiche und Terrarien vor 2002 mit dem Wert von 2002.
- **`heimtiere-dach`** reicht jetzt von 1991 bis 2025: AT/CH 2010–2015 aus FEDIAF und VHN (über 2016 verkettet), vor 2010 mit dem Anteil an Deutschland wie 2010.
- Post „Tierarzt gegen Inflation“ mit Block „Gerechnet / Quellen“.

### Heimtiere: zwei neue Fassungen (07.10.2026)

- **`heimtiere-alle`:** Heimtiere in Deutschland mit Gartenteichen (ab 2002) und Pferden (FN: 1,25 Mio. 2019, 1,3 Mio. 2025). Eine Zierfisch-Reihe gibt es nicht (nur 1999/2000, rund 85 Mio.).
- **`heimtiere-dach`:** Deutschland, Österreich und Schweiz zusammen, 2016–2025, Katzen, Hunde, Kleintiere, Ziervögel. Nationale Primärquellen (ÖHTV, VHN, AMICUS) statt FEDIAF.
- **Line Race:** Reihen, die gleichauf enden, tauschten im letzten Bild die Beschriftung, weil bei Gleichstand das Alphabet entschied, kurz davor aber eine Rundungsdifferenz. Jetzt bleibt oben, wer zuletzt höher lag. Glätteprüfung über alle 15 Datensätze: 0 Sprünge; die Endbilder der alten Grafiken bleiben gleich.

### Google Analytics 4 mit Einwilligung auf allen Seiten (07.10.2026)

- **Messkennung `G-B7KKZGD0J2`** als Repository-Variable `VITE_GA_ID`. Ohne Variable bleibt alles aus wie bisher.
- **Einwilligung jetzt auch auf den statischen Seiten** (Startseite, Artikel, Datenherkunft, Rechtstexte, 404): Bisher gab es das Banner nur im Studio, die Artikel hätten also nie gemessen. Gemeinsame Bausteine in `src/lib/consent.ts`, ein Speicherschlüssel für die ganze Seite. Das Google-Skript lädt erst nach „Einverstanden“; „Nein danke“ ist gleich groß. Widerruf über „Cookie-Auswahl“ im Fuß jeder Seite und in der Datenschutzerklärung.
- **Fehler behoben, der nie aufgefallen war:** Der Lader im Studio schob ein Array in den dataLayer; gtag.js erwartet das `arguments`-Objekt und hätte die Einträge verworfen.
- **Livegang-Prüfung:** erkennt GA jetzt auch, wenn es aus dem JavaScript-Bündel nachgeladen wird (einkompilierte Messkennung), und meldet weiter einen Blocker, wenn Datenschutzerklärung und Einbindung auseinanderlaufen (Gegentest durchgeführt).

### Sonderauswertung Tierarztkosten gegen Inflation (07.10.2026)

- **Neuer Datensatz** `tierarzt-inflation`: Anstieg seit 2000 für die allgemeine Untersuchung von Katze (+230 %), Hund (+120 %) und Pferd (+101 %) laut GOT, Tierarztleistungen laut Verbraucherpreisindex (+85 %), Inflation (+66 %) und Maß (+147 %). Die Destatis-Reihe stammt aus der öffentlichen GENESIS-Tabellenansicht, die GOT-Beträge aus den Bundesgesetzblättern 1999, 2008, 2017 und der GOT 2022.
- **Artikel** „Tierarztkosten seit 2000 im Vergleich zur Inflation“ als neue Art `auswertung` (ohne Post, auf der Startseite als „Neu“), Eintrag in der Datenherkunft, Vorschaubild.
- Datensatz-Vorschläge können ein Präfix setzen (`prefix: '+'`).
- **Nachgeprüft und umgebaut (gleicher Tag):** Die Monatswerte des Index springen genau zu den GOT- und Steuerterminen (Dezember 2022 +37,5 %); er bildet also Gebührensätze ab. Statt einer einzelnen Untersuchung zeigen Katze, Hund und Pferd jetzt einen eigenen Warenkorb „Routinejahr“ (Impftermin + Krankheitsbesuch, einfacher Satz mit MwSt., Jahresdurchschnitt nach Geltungstagen): Katze +220 %, Hund +143 %, Pferd +123 %. Alle GOT-Positionen aus den vollständigen Gebührenverzeichnissen 1999, 2008, 2017 und 2022 gelesen. Die Maß ist 2020/21 linear gerechnet. Artikel mit Index-Treppe, Warenkorb, Kastrationen und Rechenbeispiel zum Abrechnungsfaktor.
- **Zweiter Umbau nach Kritik „sieht angreifbar aus“ (gleicher Tag):** Die Grafik überlagert jetzt drei unabhängige amtliche Quellen, 2010–2024: deutscher Tierarzt-Preisindex (+54 %, Stufen), Tierarzt-Preisindex der Niederlande ohne Gebührenordnung (+65 %, gleichmäßig, Eurostat) und Umsatz der Tierarztpraxen (+122 %, Umsatzsteuerstatistik), dazu Inflation (+35 %) und Maß (+70 %). Hund/Katze/Pferd nur noch als Lupe im Artikel, mit dem Abrechnungsfaktor 1,44 aus der GOT-Studie 2019 als Szenario. Neue Rohdaten `ds17-tierarzt-umsatz.json`.
- **Line Race, erstes Bild:** Stehen alle Reihen auf demselben Wert (Anstieg 0 %), lagen Labels übereinander, weil im Mittelungsfenster einmal der Name und einmal der Wert die Reihenfolge bestimmte. Das Fenster beginnt jetzt knapp über 0. Glätteprüfung über alle zwölf Datensätze: 0 Sprünge.
- **Dritte Fassung (gleicher Tag):** Katze, Hund und Pferd (GOT-Routinejahr, gleicher Faktor) wieder als Linien in der Grafik, die Maß raus. Sieben Reihen, Farben mit dem Palettenvalidator geprüft. Artikel führt mit der Kernaussage: teurer als die Inflation, am stärksten die Routine, und die GOT 2022 hat nachgeholt und umverteilt.
- **Vierte Fassung: eine Grafik, eine Aussage.** Die Sieben-Linien-Grafik war unlesbar, weil Katze, Hund, Pferd und der Preisindex bis 2021 deckungsgleich liefen. Jetzt zwei Grafiken: `tierarzt-inflation` oben („Deutschland steigt in Stufen“: Preise DE und NL, Praxisumsatz, Inflation) und neu `tierarzt-routinejahr` im Text (Routinejahr in Euro je Tierart, 2010–2026). Bestehende Datensätze und das Diagramm-Modul unverändert.
- **Inhaltsprüfung:** `check:content` las Kachel-Texte und Datenkunde nur in doppelten Anführungszeichen; Datensätze in einfachen meldete sie fälschlich mit 0 Zeichen. Jetzt beide Schreibweisen.

### Neues Format „Säulen + Linie“, Exkurs Oktoberfest (04.10.2026)

- **Auf LinkedIn gepostet** am 04.10.2026: Der Artikel zeigt „auf LinkedIn seit“. Neu: `linkedin_datum` und `linkedin` im Kopf von Beiträgen ohne Post. Kommentarbild der reduzierten Fassung in `docs/linkedin/`.
- **Zweite Grafik im Artikel:** reduzierte Fassung `oktoberfest-preis` ohne Bier (Besucher als Säulen, Maßpreis und Inflation als Linien). Neu im Artikel-Generator: `::grafik <Datensatz> [Diagrammart]` als eigene Zeile bettet eine weitere Grafik mitten im Text ein, samt CSV.
- **Nachtrag am Abend:** Wiesn 2026 vorläufig ergänzt (Bilanz der Stadt: 7,4 Mio. Besucher, Rekord; Bier und Maßpreis aus den gemeldeten Steigerungen fortgeschrieben, Inflation aus den Monatsraten). Besucher stehen jetzt als zweite Säule neben dem Bier statt als Zahl oben links. Artikel um „Mehr Gäste, weniger Bier pro Kopf“ erweitert (0,93 Liter je Besucher, niedrigster Wert seit 2001).

- **Neue Diagrammart Säulen + Linie** (`combo`): Reihen der linken Achse als Säulen, Reihen mit Y2 als Linien. Umgesetzt als Modus des Linienrenderers, damit feste Achsen, mitlaufende Summen, Glätte und der Bild-für-Bild-Export gleich bleiben. Jede Säule wächst hoch, bis die Linien ihr Jahr erreichen. Im Studio unter Format & Diagrammtyp, in der Grafik der Artikel und im Export.
- **Veränderung seit Beginn in Prozent** hinter jedem Wert (Line Race und Säulen + Linie), etwa „15,33 € (+379 %)“. Ohne Veränderung steht nichts dahinter.
- **Lücken mitten in einer Reihe** (zwei Jahre ohne Wiesn): Die Linie bleibt stehen statt zu verschwinden, Beschriftungen blenden vor der Lücke aus und danach wieder ein. `check:glaette` prüft das, 0 Sprünge.
- Achsenbeschriftung ohne Nachkommastellen, wenn alle Achsenwerte ganze Zahlen sind („15 €“ statt „15,00 €“).
- **Neuer Datensatz** `oktoberfest` (Statistisches Amt München, 1985–2025, plus Verbraucherpreisindex von Destatis), Rubrik „Exkurs“, freigegeben über `datensaetzeOhnePost`.
- **Artikel** „Oktoberfest in Zahlen: Maßpreis, Bier und Inflation“ als neue Art `exkurs` (ohne Post, auf der Startseite als „Neu“), Datenformat-Seite „Säulen + Linie“, Eintrag in der Datenherkunft, Vorschaubild, LinkedIn-Text in `docs/linkedin/post-exkurs-oktoberfest.md`.

### Mobil zuerst: Startseite, Grafik in jedem Artikel, Studio unter /studio/ (03.10.2026)

- **Startseite ist das Magazin:** `/` zeigt den neuesten Artikel mit laufender Grafik, alle Artikel und das Studio als Angebot zum Selbermachen. Erzeugt von `scripts/build-artikel.mjs`, statisch und ohne JavaScript lesbar.
- **Studio unter `/studio/`**, Redaktionsplan unter `/studio/#redaktionsplan`. Alte Links (`/?beispiel=…`, `/#redaktionsplan`) leitet die Startseite weiter. In der Kopfzeile steht das Studio als letzter Punkt, umrandet statt gefüllt.
- **Animierte Grafik in jedem Artikel**, direkt unter dem ersten Absatz, mit „Im Studio öffnen“ und CSV. Sie läuft in einem schlanken iframe (`grafik.html`, `src/grafik/`), lädt erst in der Nähe des Bildschirms, startet, sobald sie zur Hälfte sichtbar ist, und hält an, wenn sie hinausscrollt. Hochkant 4:5 auf dem Telefon, 16:9 am Rechner, mit eigenen Rechenformaten, damit die Beschriftung auf 360 Pixel bei gut 10 Pixeln liegt statt bei 7. Auch auf den Seiten zu Bar Race, Line Race, Karte und im Artikel über die Tierarztketten. Steuerbar über `grafik:` im Kopf eines Entwurfs.
- **Studio auf dem Telefon:** Die Seite scrollt als Ganzes statt in eingeklemmten Bereichen, die Bühne hat das Seitenverhältnis des Videos, die Reiter Daten, Gestaltung, Export bleiben oben stehen. Der Leerzustand ragte aus der Bühne, jetzt steht er im normalen Fluss. Kopfzeile wie auf den Artikelseiten, ohne waagrechtes Scrollen.
- **Artikelseiten auf dem Telefon:** Navigation passt in eine Zeile, Tippziele mindestens 36 Pixel, ruhigere Listen, Grafik bis an den Rand.
- **Neue Prüfung `npm run check:mobil`** (`scripts/pruefe-mobil.mjs`): lädt jede Seite auf 360 Pixeln mit Touch und meldet waagrechtes Scrollen, überstehende Elemente, zu kleine Schrift und Tippziele. Läuft auch mit `--breite 320`/`768` und `--fotos`.
- **Behoben:** Layout wurde manchmal mit den Maßen der Ersatzschrift berechnet, weil das Ereignis „loadingdone“ nach dem Promise von `document.fonts.load` kommt; ein Titel konnte dann unter die Jahreszahl laufen. Der Messspeicher wird jetzt nach dem Laden der Schrift ausdrücklich geleert.
- **Kürzere Reihennamen** im Datensatz „Tierarztpraxen im Wandel“ (Praxisinhaber:innen, Angestellte in Praxen, Außerhalb von Praxen, Tätige gesamt, Hunde und Katzen), weil die langen Namen der Statistik in 4:5 und in der Grafik gekürzt wurden. Achsenzahlen im Bar Race werden in schmalen Formaten früher ausgedünnt.
- Technik: Die Bühne ist als `Buehne` aus dem Studio gelöst (Daten, Einstellungen und Abspielsteuerung als Props), `beispielLaden()` macht aus einem Datensatz Tabelle und Einstellungen für Studio und Grafik gleichermaßen.

### Post 28: Die Tiermedizin wird weiblich (02.10.2026)

- **Neuer Datensatz** `geschlecht-praxis`: Praxisinhaberinnen, Praxisinhaber und angestellte Tierärztinnen und Tierärzte 2002–2025, dazu der Frauenanteil aller Tätigen als mitlaufende Zahl. Alle 24 Jahrgänge aus Tab. 1 der BTK-Statistik gelesen (`data/raw/ds14-geschlecht.json`), nichts interpoliert; ersetzt eine zugelieferte Vorlage mit 19 von 26 interpolierten Jahren. `check:glaette`: 1.380 Bilder, 0 Sprünge.
- **Artikel 28** fertig und online: Zeitreihe statt Näherung, 72,0 statt 71,7 Prozent (Tab. 1 der korrigierten Fassung, Pressemitteilung im Text erklärt). Befund: Der Rückgang der Praxisinhaber seit 2019 ist ein Rückgang der Männer (minus 1.038, Frauen plus 235).
- Datenherkunft um „Die Tiermedizin wird weiblich“ und das bisher fehlende „Wem die Tierarztketten gehören“ ergänzt.
- **Lücke geschlossen:** Angestellte Tierärzt:innen 2002 (3.784) aus Tab. 1 der BTK-Statistik 2002 in Datensatz 1 nachgetragen; damit ist auch „Tätig außerhalb von Praxen“ 2002 berechnet. Texte in Dateninfo, Datenherkunft, DATASETS.md und Artikel 4 angepasst.
- **Behoben:** Die Eigentümer-Ableitung stand von Hand in der erzeugten Datei `src/samples/data.ts` und wäre beim nächsten `build-samples` verloren gegangen. Sie steht jetzt im Generator.

### Gestaltung: ein Auftritt für Magazin und Studio (02.10.2026)

- Kopfzeile aller statischen Seiten: dasselbe Zeichen wie im Studio, „Studio“ als Knopf, der aktuelle Bereich markiert, auf dem Handy eine einzeilige, wischbare Navigation statt Umbruch.
- Artikelübersicht: beschreibende Überschrift statt des Markennamens, Artikelliste als ruhige Zeilen mit Trennlinien statt Aufzählung mit unterstrichenen Links.
- Studio-Kopf: Links zu Artikeln und Datenformat, Ansichtsumschalter ohne Zeilenumbruch, Design-Auswahl ohne losen Begleittext.
- Leere Bühne: statt eines verwaisten Titels aus dem letzten Datensatz ein Startzustand mit Weg zum Datenformat und zur Vorlage. Im Datenpanel ein sichtbarer Hinweis „So muss die Tabelle aussehen“.

### Bereich „Datenformat“ (02.10.2026)

- **Neuer Menüpunkt Datenformat** (`/datenformat/`): Hauptseite „Tabellen für animierte Diagramme vorbereiten“ und Unterseiten für Bar Race, Line Race, Karte und Einstellungen. Quellen in `src/content/datenformat/*.md`, gebaut von `scripts/build-artikel.mjs` mit TechArticle-, Breadcrumb- und FAQ-Auszeichnung; in Sitemap, llms.txt, Kopf- und Fußzeile, Studio-Kopf und Datenpanel verlinkt.
- **Für KI-Assistenten:** jede Seite auch als Markdown (`/datenformat/<seite>.md`), alle zusammen in `/datenformat/datenformat.md` mit absoluten Links, dazu ein Prompt zum Kopieren.
- **Datenschutz-Abschnitt** auf der Hauptseite: Tabellen werden nur im Browser gelesen, liegen nur im Arbeitsspeicher des Tabs und kommen nie beim Betreiber an. Gespeichert werden lokal nur Einstellungen.
- **Datenschutzerklärung korrigiert:** Sie sagte „keine Nachladung von fremden Servern“, aber ohne WebCodecs lädt der Export ffmpeg.wasm von jsDelivr. Jetzt offengelegt, mit Verantwortlichem laut jsDelivr; dazu, welche eingegebenen Texte im lokalen Speicher landen.
- **Ländernamen:** Frankreich (FR), Großbritannien (GB), Serbien (RS), Benin (BJ) und Burkina Faso (BF) waren unter veralteten CLDR-Codes (FX, YU, DY, HV) eingetragen, eine Spalte „FR“ blieb grau. `build-laendernamen.mjs` lässt veraltete Codes jetzt aus, Test in `geo.test.ts`.
- Generator: Codeblöcke in Markdown, ohne sichtbare Einrückung in `<pre>`.

### Lokal alles, live nur Gepostetes (29.09.2026)

- **Freigabe an:** Live bietet das Studio nur Datensätze aus veröffentlichten Posts und dem aktuellen Post an (6 statt 12). Der Redaktionsplan zeigt live die veröffentlichten Posts, den aktuellen und drei Vorschauen ohne Zahlen und Datensatz (`vorschauPosts: 4`), dazu „Weitere N Posts folgen“.
- **Lokal bleibt alles sichtbar** für die Videos. Unten links schaltet der Entwicklungsserver auf die Live-Ansicht um (`?live`); jeder Post nennt lokal, wie er live erscheint.
- Verweise „baut auf Post N“ nur noch auf Posts, die live auch stehen.
- Post 5 heißt „Tierarztmangel? Kommt darauf an, wen man zählt“: Die Kammer zählt Inhaber, nicht Praxen.
- Test für das Vorschaufenster, auch für vorgezogene Posts (`src/test/freigabe.test.ts`).
- Entwurf LinkedIn-Artikel „Vibecoding, Datenforschung und mehr“ (`docs/linkedin/`), Einschub nach Post 7.
- Post 7 („2015 gab es diesen Markt noch nicht“) vorgezogen, Post 5 zurückgestellt; sein Artikel bleibt über `vorabOnline` online, und Datensätze von `vorabOnline`-Posts sind live freigegeben, damit „Datensatz im Studio öffnen“ funktioniert. Zwei Kontextlinks auf den Post-7-Artikel.
- **Neuer Datensatz „Wem die Tierarztketten gehören“** (`ketten-eigentuemer`) für Post 8: die Ketten-Standorte in fünf Blöcken nach heutigem Eigentümer, im Code aus `KETTEN` abgeleitet. Post 6 hatte das Ketten-Video schon verwendet. Artikel 8 mit Zeitreihe der Blöcke, `check:glaette` prüft den Datensatz mit (660 Bilder, 0 Sprünge).
- Post 8 („Nicht jede Gruppe gehört einem Fonds“) statt Post 7: Post 6 hatte die Entwicklung seit 2015 auf LinkedIn schon erzählt. Der Post-7-Artikel bleibt über `vorabOnline` online.

### SEO/GEO-Pflegerunde 1 (27.09.2026)

- Artikelentwürfe 17 (VDH-Gesamtzahlen jetzt belegt in DATASETS.md), 24 (Aufteilung Nutztiere/Pferde ab 2019: 718 reine Nutztier-, 989 reine Pferdepraxen 2025) und 30 (Adresse, Quellcode) sind fertig; 27 von 31 bereit.
- 14 Entwurfstitel über 60 Zeichen gekürzt; `check:content` meldet Titel über 60 jetzt als Mangel statt ab 70 als Hinweis.
- Datendoku-Korrekturen und die Rinder-Deutschlandzeile aus den Hintergrundaufgaben übernommen.

- **Widerspruch behoben:** Der Ketten-Artikel nannte 106 Standorte für Tierarzt Plus und 483 in Summe, Post 6 und Video 111 und 505. Stand der Hintergrundaufgabe übernommen (ds12).
- **Tote Quelle:** IVH-Link lieferte 404, auf die aktuelle Seite umgestellt; sie bestätigt 33,4 Mio. Heimtiere und 15,7 Mio. Katzen 2025.
- **Veraltete Zahl:** „zehn Datensätze“ in Datenherkunft und llms.txt, es sind zwölf – jetzt ohne feste Zahl.
- Titel auf höchstens 60 und Beschreibungen auf 50–160 Zeichen; `check:launch` prüft beides jetzt als Blocker (Gegenprobe mit 81-Zeichen-Titel schlägt an).
- Interne Verlinkung: vier Seiten hatten weniger als drei eingehende Links; neue Kontextlinks und „Alle Artikel“ in jedem Artikel. Neue Prüfung `npm run check:links` (auch in der Pipeline) – das Build-Audit des Pflege-Skills zählt relative Links nicht.
- WebSite-Auszeichnung auf der Startseite (Herausgeber: Person), Atom-Feed `/feed.xml`.
- Pipeline: `index.html` überschrieb beim Deploy die eigene 404-Seite – entfernt.

### Behoben (Line Race: flüssige Animation)

- **Keine Knicke:** Zwischen den Jahren monoton kubisch interpoliert (Steffen, wie d3.curveMonotoneX) – die Linie läuft glatt durch jeden echten Wert, ohne zu überschießen; Punkt, Wert und Linie folgen derselben Kurve.
- **Keine Geisterlinien:** Reihen außerhalb der Top N blenden stetig aus, statt blass stehen zu bleiben; beendete Reihen blenden innerhalb einer Periode aus.
- **Keine Sprünge:** Beschriftungen tauschen beim Kreuzen zweier Linien gleitend die Plätze (zeitlich gemittelter Versatz, rein aus den Daten, also exportfest); neue Reihen wachsen weich in die Rangfolge; Namen blenden erst bei klarer Sichtbarkeit ein. Das Schlussbild ist exakt kollisionsfrei.
- Summe: Zahl und Einheit in einer Zeile, „515Standorte“ klebte zusammen.
- **`npm run check:glaette`** (`scripts/pruefe-glaette.mjs`): fährt jeden Datensatz mit 60 Bildern je Jahr ab und meldet jeden Sprung in Position oder Deckkraft. Stand: 7 Datensätze, 10.740 Bilder, 0 Sprünge.

### Behoben (Ketten-Chart)

- Ketten-Datensatz: Der Marker „existierte noch nicht“ stand als 0 in der Tabelle – gegen den eigenen Datenstandard. Führende Nullen sind jetzt leer; 2015 erscheinen nur die fünf Gruppen, die es gab, statt fünfzehn mit „0“.
- Line Race: Top N nach Rang statt nach Wert – bei Gleichstand an der Grenze wurden alle Reihen mit dem Grenzwert hervorgehoben.
- Nach einem Deploy lädt ein offener Tab einmal neu, wenn ein nachgeladener Programmteil fehlt. Vorher startete dann etwa das Bar Race einfach nicht.

### Neu

- **Summenspalten im Line Race** als große mitlaufende Zahl oben links statt als Linie, im Bar Race ausgeblendet. Der Ketten-Datensatz nutzt das: „Summe: Alle Gruppen (Standorte)“ statt „TOTAL Deutschland“, die Achse reicht damit bis 120 statt 600. Feste Farben je Reihe über `suggested.colors`, Restgruppe grau, Top 6.

- **Weltkarte Hund oder Katze ist Post 3** mit eigenem Artikel „Mehr Katzen oder Hunde?“ (Welt und Deutschland). Die Posts 3–15 sind zu 4–16 aufgerückt, der alte Post 16 ist im neuen Post 3 aufgegangen. Der bereits veröffentlichte Tierärzte-Artikel bleibt über `vorabOnline` online.

- **Kopf- und Fußzeile aus einer Quelle** für alle statischen Seiten (Artikel, Übersicht, Rechtstexte, 404): Die Kopfzeile bleibt beim Scrollen stehen und enthält nur Navigation, Impressum und Datenschutz stehen im Fuß. Die Seiten tragen Platzhalter, die Vite beim Build mit tiefenrichtigen Pfaden füllt.

- **Datenstandard 1.0** (`docs/DATENSTANDARD.md`) mit Vorlagen als Excel und CSV (`public/vorlagen/`, `scripts/build-vorlagen.mjs`) und der öffentlichen **Anleitung „Weltkarte nach Daten einfärben und animieren“** mit fünf Screenshots, die `scripts/screenshots-anleitung.mjs` aus dem echten Studio erzeugt (Chrome-Fernsteuerung ohne Abhängigkeit, `scripts/lib/cdp.mjs`).
- **Summenspalten auf der Karte:** Spalten `Summe: Name (Einheit)` erscheinen als Mini-Linie mit aktuellem Wert im Seitenpanel. Weltkarte Hund/Katze zeigt damit die weltweite Zahl der Hunde und Katzen (`scripts/build-welt-summen.mjs`, China und Brasilien korrigiert).
- **Ländernamen deutsch, englisch oder ISO-Code** (`src/assets/laendernamen.json`, 504 Schreibweisen). Behebt die grau gebliebene DR Kongo.
- **Kartenabgleich** im Studio: zeigt erkannte Karte, Summenspalten und Spalten ohne Fläche – mit derselben Funktion, die die Karte zeichnet.
- Kipppunkt und Stufennamen der Karte in der Gestaltung einstellbar; neutral „darunter/darüber“, wenn keine Namen gesetzt sind. Mit Stufen immer fünf Zeilen, Panelbreite nach den Stufennamen.
- Artikelgenerator: Anleitungen ohne Post (`art: anleitung`), Bilder mit festen Maßen, HowTo-Auszeichnung, Inline-Code.

### Behoben

- Doppelte React-Schlüssel in der Palettenvorschau (Palette „Monochrom“ enthält Farben mehrfach).

- **Umbenannt in „Tiermedizin in Zahlen“** (vormals Chart Race Studio). Das Werkzeug heißt jetzt „Studio“. Repository und Adresse bleiben vorerst, damit bestehende LinkedIn-Links weiter funktionieren.

- `llms-full.txt` mit dem Volltext aller Live-Artikel für Antwortmaschinen; 404-Seite mit Wegweiser.
- Artikelentwürfe 4 („Tierarztmangel in Deutschland: was die Zahlen zeigen“) und 16 (Weltvergleich Katze/Hund) auf gemessene Suchanfragen ausgerichtet.
- Markenname nur noch in `src/content/legal.json` (`siteName`) – eine Umbenennung ist eine Zeile.

- **Erste Artikel online** (Posts 1–3) unter `/beitrag/`, mit Übersichtsseite „Tiermedizin in Zahlen“, CSV-Download je Datensatz und Dataset-Auszeichnung für die Google-Datensatzsuche.
- **SEO/GEO:** Zielfragen der drei Artikel auf gemessene Suchanfragen umgestellt (docs/KEYWORD-RECHERCHE.md, Abschnitt 9); erster Absatz beantwortet die Kopfanfrage, inklusive der Unterscheidung 46.089 Kammermitglieder gegen 34.476 Tätige. Vorschaubilder für LinkedIn (`scripts/og-bilder.mjs`), Standard-og:image für alle Seiten, statischer Inhalt auf der Startseite für Crawler ohne JavaScript, `lastmod` nur mit echtem Datum, Canonical für Verzeichnisseiten.
- `check:launch` meldet tote interne Links und ungültige strukturierte Daten als Blocker.

- **Visiten:** Der Redaktionsplan ist in Staffeln zu je 30 Posts gegliedert, mit Umschalter in der Oberfläche. Postnummern laufen über alle Visiten durch.
- **Freigabe** (`src/content/freigabe.json`), beide Schalter vorbereitet und aus: Beispiel-Datensätze erst nach Veröffentlichung ihres Posts zeigen, Artikel erst nach Veröffentlichung bauen.
- **Artikel je Post:** 30 Entwürfe in `src/content/artikel/`, erzeugt zu `beitrag/<slug>.html` mit Article- und FAQPage-Auszeichnung, Sitemap- und llms.txt-Eintrag. Entwürfe nie im Build; Vorschau unter `npm run dev` → `/beitrag/entwurf/`. `check:content` prüft jeden Entwurf.
- `?beispiel=<id>` öffnet einen Datensatz direkt im Studio.

- **Choroplethenkarte der Bundesländer** als dritter Diagrammtyp. Wie der Line-Renderer eine reine Funktion der Zeit (`renderAt`), damit der Frame-für-Frame-Export reproduzierbar bleibt; zwischen zwei Jahren wird interpoliert, die Farbe wandert also weich. Feste Farbdomäne über den gesamten Zeitraum, Legende und eine mitlaufende Rangliste mit den Werten des aktuellen Jahres.
- Geometrie wird vorab aus `data/geo/deu.topo.json` erzeugt (`scripts/build-geo.mjs`) und mitgeliefert – zur Laufzeit wird nichts nachgeladen und keine TopoJSON-Bibliothek gebraucht.

### Geändert

- Ketten-Artikel auf den Datensatz vom 17.09.2026 gebracht: Tierarzt Plus Partner über 110 statt 106, VetPartners 30 statt 28, VetGruppen über 30 statt 26, TeamVet 27 statt 24, Veternicum Nesto über 25 statt 23, filu 11 statt 12; Summe mindestens 501 statt 483. Wo das Ranking vom 08.07.2026 abweicht, nennt der Artikel beide Werte. Die Methodenregel folgt jetzt dem Datensatz (neuerer Beleg, bei gleichem Stand der höhere) statt der alten Quellenhierarchie. `docs/DATASETS.md` 3f auf ds12 umgeschrieben.
- Redaktionsplan korrigiert: AniCura 78 statt 69, TeamVet 27, filu 11, Anteil Kleintierpraxen 52,9 Prozent aller Inhaber, Katzen „fast verdreifacht“ statt „dreimal so stark“, Rinderbestand minus 39 statt „halbiert“, Nutztierpraxen ab dem gesamtdeutschen Wert 1991.
- Impressum und Datenschutz sind statische Seiten mit `noindex, follow` statt Hash-Routen, aus einer JSON-Quelle erzeugt und aus der Sitemap genommen.
- `check:launch` läuft gegen den Build und prüft zusätzlich Canonical, Sitemap gegen noindex in beiden Richtungen, Favicon-Größen und ob Datenschutztext und tatsächliche Einbindung zusammenpassen.
- `companyName` ist leer: „Petleo" allein wäre nach § 5 DDG unvollständig, weil die Rechtsform fehlt.

### Behoben

- Die Legende der Weltkarte lag über ihren eigenen Farbkästchen. Der Layouttest hatte das übersehen, weil er nur Text gegen Text prüfte — er vergleicht jetzt auch Text gegen gefüllte Flächen und fand damit sofort zwei weitere Fehler im Hochformat.

- **Alle Seiten trugen dasselbe Canonical** und zeigten auf die Startseite. Beide Artikel wären damit aus dem Index gefallen. Canonical wird jetzt je Seite gesetzt, Seiten mit noindex bekommen keines.

- Die Karte animierte in der Vorschau nicht. Der Renderer brachte keine eigene Abspielschleife mit; die Vorschau ruft aber nur `play()` und verlässt sich darauf, dass der Renderer selbst läuft und Datumswechsel meldet. Im Export fiel das nicht auf, weil der die Zeit selbst stellt.
- Die Exportlänge wich von der Anzeige ab: Bei Datensätzen mit Jahreslücken lieferte der Export 53,8 s, während die Oberfläche 46,0 s versprach.

## [0.1.0] – 2026-09-17

Erste Veröffentlichung.

### Enthalten

- **Studio:** Bar Chart Race (racing-bars) und Line Chart Race (eigener D3-Renderer, optional zweite Y-Achse), vier Formate (16:9, 1:1, 4:5, 9:16) mit formatabhängigem Layout und Live-Vorschau in Zielauflösung.
- **Daten:** CSV/XLSX-Upload oder editierbare Tabelle, Wide- und Long-Format-Erkennung, Datenprüfung, Lücken interpolieren oder fortschreiben.
- **Export:** deterministisch Frame für Frame über WebCodecs `VideoEncoder` (H.264) und `mp4-muxer` im Web Worker, Fallback `ffmpeg.wasm`, dazu GIF und PNG. Standbild am Anfang und Ende ist in Datei und Gesamtlänge enthalten.
- **Zehn Beispiel-Datensätze** aus der deutschen Tiermedizin mit recherchierten Zahlen, Quelle, Dateninfo und offengelegten Lücken. Jeder trägt Recherche- und Prüfdatum.
- **Redaktionsplan** mit 30 aufeinander aufbauenden Posts unter `#redaktionsplan`, verlinkt mit den Datensätzen und nach Veröffentlichung mit den LinkedIn-Beiträgen.
- **Artikel** als eigene statische Seiten mit echter URL und strukturierten Daten: „Wer betreibt die Tierarztpraxen in Deutschland?" und „Woher die Zahlen kommen".
- **Recht und Messung:** Impressum und Datenschutz aus einer Quelle, Cookie-Einwilligung nach § 25 TDDDG (Skript erst nach Klick), Google Analytics und Cloudflare Web Analytics optional, Search Console und Sitemap.
- **Prüfskripte:** `npm run check:launch` (Blocker vor dem Livegang) und `npm run check:content` (dünne, doppelte, unverlinkte Inhalte).

### Bekannte Einschränkungen

- Die Anschrift im Impressum fehlt noch; bis dahin meldet `check:launch` einen Blocker und die Seite gehört nicht in den öffentlichen Betrieb.
- Belegte und geschätzte Werte sind in den Daten markiert, im Diagramm aber noch nicht visuell unterscheidbar.
- Der Browser-Layouttest (`scripts/browser-overlap-check.js`) braucht ein sichtbares Browser-Fenster; in einem versteckten Tab ist `requestAnimationFrame` gedrosselt und das Diagramm rendert nicht nach.
