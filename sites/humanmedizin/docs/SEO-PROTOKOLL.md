# SEO- und GEO-Protokoll – Humanmedizin in Zahlen

Loop ab 26.10.2026: „Verbessere die Website. Sei kreativ und fokussiere dich auf Wins im Bereich SEO und GEO. Stelle
sicher, wir halten alle gängigen SEO-Tipps ein. Mindestens 15 Wiederholungen.“ Je Runde ein Hebel, geprüft gegen den
Build (`SITE=humanmedizin VITE_SITE_URL=https://humanmedizin-in-zahlen.org npm run build`), nicht gegen den Quelltext.

Grenzen: Kernänderungen (außerhalb `sites/`) tragen beide Seiten und stehen im CHANGELOG; der Tiermedizin-Chat arbeitet
parallel an SEO/GEO im Kern, deshalb Kernänderungen klein halten und vorher `git pull --rebase`. Kein Push ohne Freigabe.
Die Seite ist noch nicht live (Domain, Repo, Deploy-Key fehlen) – Live-Prüfungen (Search Console, Rich-Results-Test,
Trailing Slash, Header) erst danach.

## Ausgangslage (Runde 1)

| Prüfpunkt | Stand |
|---|---|
| Titel ≤ 60, Description ≤ 155 | alle indexierbaren Seiten eingehalten |
| Canonical, og:*, twitter:card | auf allen indexierbaren Seiten |
| `noindex, follow` | Impressum, Datenschutz, 404, Studio; nicht in der Sitemap |
| Strukturierte Daten | WebSite + Person/Organization (Start), Article + Dataset + FAQPage (Artikel), Article + FAQPage (Säulenseite), CollectionPage, AboutPage |
| `llms.txt`, `llms-full.txt` | vorhanden, mit „Aussagen, die ohne Kontext irreführen“ |
| robots.txt, sitemap.xml | vorhanden, Sitemap nur indexierbare Seiten |
| Eine `h1` je Seite, Bilder mit `alt` | eingehalten |

## Runden

| Runde | Datum | Hebel | Ergebnis |
|---|---|---|---|
| 1 | 26.10.2026 | Eigene Vorschaubilder (1200 × 630) je Artikel | 11 Karten mit Titel und Kernzahl in `public/beitrag/og/`; vorher zeigte jeder geteilte Link die Standardkarte. Das Bild steht auch als `image` im Article-Schema (für Artikel-Rich-Results erforderlich). |
| 2 | 26.10.2026 | Glossar `artikel/begriffe-praxis-it.html` mit `DefinedTermSet` (17 Begriffe: PVS, KBV-Prüfnummer, KVDT, LDT, KIM, eArztbrief, eAU, TI, MVZ, BAG …), je Begriff Anker, Quelle und Zahl der Seite | Für „Was ist …“-Fragen zitierfähig; verlinkt aus Fuß, Säulenseite, Datenherkunft, Über das Projekt, Post 1 und `llms.txt`; in Sitemap und Zahlenprüfung. Nebenbei: „126 Systeme“ in Post 10 auf „126 Zeilen“ korrigiert (wie Säulenseite, Varianten zählen mit). `check:mobil` maß fremden Server auf :5173 – bricht jetzt ab, wenn dort nicht unsere Seite läuft. |
| 3 | 26.10.2026 | „Häufige Fragen“ auf der Startseite (sichtbar + FAQPage), je Artikel eine Frage mit Zahl | 11 Fragen im Profil; jede erscheint erst, wenn ihr Artikel live ist (jetzt 1). Die Konsistenzprüfung verlangt, dass jede Zahl der Antwort im verlinkten Artikel steht (Gegenprobe mit falscher Zahl schlägt an). |
| 4 | 26.10.2026 | Säulenseite „Praxisverwaltungssysteme in Deutschland“: Sprungmarken (`id` an allen `h2`, Inhaltsleiste), CSV aller 41 erfassten Systeme mit Q4/Q3 2025 und Zulassungen (`tabellen/pvs-systeme-2025.csv`, erzeugt von `npm run daten`), `Dataset`-Schema mit Download, Link in `llms.txt` | **Datenfehler behoben:** Säulenseite und Datenherkunft nannten für die Zulassungen „Stand 19.10.2026“, Rohdaten und Artikel 21.10.2026; Werte stimmten. Neue Prüfung: beide Tabellen der Säulenseite gegen die Rohdaten (Werte, Sortierung, Zulassungen, Datum), Gegenprobe schlägt an. |
| 5 | 26.10.2026 | Keyword-Recherche (Google-Autovervollständigung) als `docs/KEYWORD-RECHERCHE.md`, Inhalte danach ausgerichtet | Säulenseite heißt jetzt „Übersicht 2025“ (Suche „praxisverwaltungssysteme übersicht“, keine Konkurrenz mit Post 1 „Marktanteile“); Post 3 mit Frage zu Psychotherapie-Software auf dem Mac; Post 7 und Glossar mit eArztbrief-Vergütung GOP 86900/86901 und Empfangspflicht seit 30.06.2024 (KBV-Seite, live geprüft); Glossar mit KIM-Adresse. Neue Artikelidee mit Nachfrage: Praxissoftware nach Fachrichtung (KBV-Berichte je Arztgruppe). |
| 6 | 26.10.2026 | Daten für die Suchlücke „Praxissoftware nach Fachrichtung“: KBV-Bericht „TOP 20 je Fachgruppe“ Q4/2025 für alle 23 Gruppen als `data/raw/pvs-kbv-arztgruppen.csv`, Recherche `recherche/pvs-arztgruppen.md`, Post 12 im Redaktionsplan | Befund: Bei Allgemeinmedizinern führt medatixx (1.892) vor MEDISTAR (1.857) und TURBOMED (1.850), T2med auf Platz 4. Gegenproben: Psychotherapeuten-Summe = 35.271 wie im Einzelbericht, kein System in den Gruppen über seinem Gesamtwert – beides jetzt in der Konsistenzprüfung. |
| 7 | 26.10.2026 | Zeitreihe für Post 12 aus archivierten KBV-Berichten (Webarchiv): Arztgruppe Allgemeinmediziner Q3/2020–Q4/2025, 12 Quartale, `data/raw/pvs-kbv-allgemeinmediziner.csv`; Datensatz `pvs-allgemeinmediziner` (Bar Race, zehn Systeme, Jahresende 2020–2025) mit Abschnitt in der Datenherkunft | Q4/2022 und Q4/2023 fehlen im Archiv: linear zwischen den nächsten belegten Quartalen, 20 von 60 Werten markiert. Gegenproben: KBV-Differenzspalte in allen Berichten stimmig, doppelt belegte Quartale gleich, Einzel- gegen Gesamtbericht Q4/Q3 2025 gleich, Datensatz gegen Rohdaten (alle zehn Systeme). Erst als Line Race geplant: Die Glätteprüfung fand 2 Sprünge, weil medatixx erst in den letzten Bildern überholt – deshalb Bar Race, kein Eingriff in den gemeinsamen Diagramm-Code. |
| 8 | 26.10.2026 | Artikelentwurf Post 12 `praxissoftware-allgemeinmediziner` (Suchnachfrage „praxissoftware hausarzt (vergleich)“, „allgemeinmedizin“), mit FAQ „Welche Praxissoftware nutzen Hausärzte?“ und ehrlicher Abgrenzung Allgemeinmediziner ≠ Hausärzte; Vorschaubild; verlinkt aus Post 2 und 4. Datenherkunft mit Article-Schema (neue Inhaltsprüfung aus dem Kern meldete das Fehlen) | Konsistenzprüfung prüft 10 Kennzahlen des Artikels und die Rangfolge (medatixx Platz 1 erst Q4/2025, Platz 3 im Vorquartal). Eine unbelegte Begründung und eine knapp falsche Formulierung („keines erreicht ein Zehntel“ – medatixx hat 10,006 %) vor dem Commit korrigiert. |
| 9 | 26.10.2026 | Säulenseite (live) um „Welche Software in welcher Fachgruppe führt“ ergänzt: 16 Arztgruppen mit mindestens 1.000 Installationen, Platz 1 und 2, Sprungmarke `#fachgruppen`, neue FAQ (sichtbar + FAQPage) „Welche Praxissoftware nutzen Allgemeinmediziner?“ | Der Inhalt aus Runde 6/7 wirkt damit sofort auf einer öffentlichen Seite, ohne auf Post 12 zu warten. Prüfung: Tabelle Zeile für Zeile gegen die Rohdaten, dazu die Textzahl „sieben der 16 Gruppen“ (beim Schreiben erst falsch „acht der 14“ – von der neuen Prüfung erfasst). |
| 10 | 26.10.2026 | `llms-full.txt` enthielt nur Live-Artikel (einen). Neues Profilfeld `llmsVollSeiten` (Kern): Säulenseite und Glossar stehen jetzt als Markdown mit Tabellen und vollen Links darin – 9 KB auf 28 KB | Für Antwortmaschinen die wichtigsten Seiten im Volltext, ohne HTML. Tiermedizin unverändert (`[]`, Ausgabe byte-gleich geprüft); beide Testläufe grün. |
| 11 | 26.10.2026 | Eigene Vorschaubilder für Säulenseite, Glossar, Datenherkunft und Über das Projekt (vorher Standardkarte); Kern: `og-bilder.mjs` rendert Profilseiten, der Build nutzt sie automatisch, mit Seitentitel als `og:image:alt`; Article-Schema der Säulenseite und Datenherkunft zeigt aufs eigene Bild | Beim Teilen auf LinkedIn zeigt die Übersichtsseite jetzt „116.954 Installationen …, ein Fünftel davon Psychotherapie-Software“. Tiermedizin-Build byte-gleich geprüft; Karte zu Post 10 nach der Korrektur „126 Zeilen“ neu erzeugt. |

## Ideenliste (nach erwartetem Nutzen)

- **Mehr Artikel live** (Entscheidung Thomas): Die Startseite trägt mit einem Artikel wenig Text, zehn fertige Entwürfe
  warten auf ihren LinkedIn-Termin. Der Redaktionsplan erlaubt, einen Artikel vor dem Post online zu stellen; das wäre der
  größte einzelne SEO-Hebel.

- **Datenlizenz festlegen** (Entscheidung Thomas): Ohne `license` im Dataset-Schema meldet Google Dataset Search eine
  Warnung; eine offene Lizenz für die eigenen Zusammenstellungen (z. B. CC BY 4.0) macht die Daten zitierfähig.
- Dataset-Schema ergänzen: `keywords`, `isAccessibleForFree`, `measurementTechnique`, `includedInDataCatalog`.
- Startseite: Kernzahlen als Text (nicht nur Grafik), `ItemList` der Artikel.
- Interne Verlinkung Säulenseite ↔ alle Artikel prüfen, Ankertexte mit Suchbegriff.
- `llms.txt`: Kernzahlen je Thema als Faktenliste, sobald weitere Artikel freigegeben sind.
- Autorenseite: E-E-A-T (Rolle, Erfahrung mit PVS-Schnittstellen, offen genannter Interessenkonflikt) prüfen.
