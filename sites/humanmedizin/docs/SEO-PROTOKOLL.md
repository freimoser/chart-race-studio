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

## Ideenliste (nach erwartetem Nutzen)

- **Mehr Artikel live** (Entscheidung Thomas): Die Startseite trägt mit einem Artikel wenig Text, zehn fertige Entwürfe
  warten auf ihren LinkedIn-Termin. Der Redaktionsplan erlaubt, einen Artikel vor dem Post online zu stellen; das wäre der
  größte einzelne SEO-Hebel.

- **Datenlizenz festlegen** (Entscheidung Thomas): Ohne `license` im Dataset-Schema meldet Google Dataset Search eine
  Warnung; eine offene Lizenz für die eigenen Zusammenstellungen (z. B. CC BY 4.0) macht die Daten zitierfähig.
- Datenherkunft ohne strukturierte Daten: Article/`about` oder DataCatalog für freigegebene Datensätze.
- Säulenseite Praxisverwaltungssysteme: Dataset-Schema für die KBV-Tabelle Q4/2025, CSV-Download, Sprungmarken.
- Dataset-Schema ergänzen: `keywords`, `isAccessibleForFree`, `measurementTechnique`, `includedInDataCatalog`.
- Keyword-Recherche Humanmedizin (Autocomplete, PAA) als `docs/KEYWORD-RECHERCHE.md` wie bei der Tiermedizin.
- Startseite: Kernzahlen als Text (nicht nur Grafik), `ItemList` der Artikel.
- Interne Verlinkung Säulenseite ↔ alle Artikel prüfen, Ankertexte mit Suchbegriff.
- `llms.txt`: Kernzahlen je Thema als Faktenliste, sobald weitere Artikel freigegeben sind.
- Autorenseite: E-E-A-T (Rolle, Erfahrung mit PVS-Schnittstellen, offen genannter Interessenkonflikt) prüfen.
