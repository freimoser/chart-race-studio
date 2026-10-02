# Changelog

Alle nennenswerten Änderungen dieses Projekts. Format lose nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

## [Unveröffentlicht]

### Post 28: Die Tiermedizin wird weiblich (02.10.2026)

- **Neuer Datensatz** `geschlecht-praxis`: Praxisinhaberinnen, Praxisinhaber und angestellte Tierärztinnen und Tierärzte 2002–2025, dazu der Frauenanteil aller Tätigen als mitlaufende Zahl. Alle 24 Jahrgänge aus Tab. 1 der BTK-Statistik gelesen (`data/raw/ds14-geschlecht.json`), nichts interpoliert; ersetzt eine zugelieferte Vorlage mit 19 von 26 interpolierten Jahren. `check:glaette`: 1.380 Bilder, 0 Sprünge.
- **Artikel 28** fertig und online: Zeitreihe statt Näherung, 72,0 statt 71,7 Prozent (Tab. 1 der korrigierten Fassung, Pressemitteilung im Text erklärt). Befund: Der Rückgang der Praxisinhaber seit 2019 ist ein Rückgang der Männer (minus 1.038, Frauen plus 235).
- Datenherkunft um „Die Tiermedizin wird weiblich“ und das bisher fehlende „Wem die Tierarztketten gehören“ ergänzt.
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
